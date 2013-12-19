
$(function() {
	THREE.Vector3.ZERO = new THREE.Vector3(0, 0, 0);

	var viewPortKeyStates = new Object();

	var MOUSE_LMB = 1;
	var MOUSE_MMB = 2;
	var MOUSE_RMB = 3;

	var CAM_LEFT = 65;
	var CAM_RIGHT = 68;
	var CAM_FWD = 87;
	var CAM_BACK = 83;

	var camSpeed = 0.1;
	var mouseSens = 0.002;

	var mouseX = 0;
	var mouseY = 0;
	var mouseMoveX = 0;
	var mouseMoveY = 0;

	var havePointerLock = 'pointerLockElement' in document ||
    	'mozPointerLockElement' in document ||
    	'webkitPointerLockElement' in document;

	var resetViewPortKeys = function() {
		viewPortKeyStates[MOUSE_LMB] = false;
		viewPortKeyStates[MOUSE_MMB] = false;
		viewPortKeyStates[MOUSE_RMB] = false;

		viewPortKeyStates[CAM_LEFT] = false;
		viewPortKeyStates[CAM_RIGHT] = false;
		viewPortKeyStates[CAM_FWD] = false;
		viewPortKeyStates[CAM_BACK] = false;
	};

	resetViewPortKeys();

	$("#mainMenu").menubar({
        select: function(event, ui) {
            var tag = ui.item.children().attr('tag');

            switch(tag) {
            	case "addCube":
            		var geometry = new THREE.CubeGeometry(1,1,1);
					var material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );
					var cube = new THREE.Mesh( geometry, material );
					scene.add( cube );
            		break;
            	default:
            		console.log("Unknown menu action");
            		break;
            }
        }
    });

	var container = $("#windowContainer");
	var sceneTree = $("#sceneTreeWindow");
	var canvas = $("#webGLViewport");
	var properties = $("#propertyWindow");
	var bottomBar = $("#bottomBar");

	var menuBarHeight = 41;
	var bottomBarHeight = 20;

	var sceneTreeWidth = 250;
	var propertiesWidth = 250;

	var w = canvas.width();
	var h = canvas.height();
	
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, w / h, 0.1, 1000 );

	var renderer = new THREE.WebGLRenderer();

	canvas.html(renderer.domElement);

	canvas.get(0).requestPointerLock = canvas.get(0).requestPointerLock ||
	     canvas.get(0).mozRequestPointerLock ||
	     canvas.get(0).webkitRequestPointerLock;

	document.exitPointerLock = document.exitPointerLock ||
				   document.mozExitPointerLock ||
				   document.webkitExitPointerLock;
	
	var resizeEverything = function() {
		
		var cW = $(window).width();
		var cH = $(window).height() - menuBarHeight - bottomBarHeight;

		container.offset({top: menuBarHeight, left:0});
		container.width(cW);
		container.height(cH);

		sceneTree.offset({top: menuBarHeight, left: 0});
		sceneTree.width(sceneTreeWidth);
		sceneTree.height(cH);

		canvas.offset({top: menuBarHeight, left: sceneTreeWidth});
		canvas.width(cW - sceneTreeWidth - propertiesWidth);
		canvas.height(cH);

		var canvasWidth = canvas.width();
		var height = canvas.height();
		renderer.setSize(canvasWidth, height);
	    camera.aspect = canvasWidth / height;
	    camera.updateProjectionMatrix();

	    properties.offset({top: menuBarHeight, left: sceneTreeWidth + canvasWidth});
		properties.width(propertiesWidth);
		properties.height(cH);

		bottomBar.offset({top: menuBarHeight+cH, left: 0});
		bottomBar.width(cW);
		bottomBar.height(bottomBarHeight);

	};

	$( window ).resize(resizeEverything);

	resizeEverything();

	canvas.keydown(function(e) {
		//console.log(e.which);

		viewPortKeyStates[e.which] = true;
	});

	canvas.mousedown(function(e) {
		viewPortKeyStates[e.which] = true;

		if(e.which == 3) {
		    if(havePointerLock) {
				// Ask the browser to lock the pointer
				canvas.get(0).requestPointerLock();
		    }
		}
	});

	canvas.mouseup(function(e) {
		viewPortKeyStates[e.which] = false;

		if(e.which == 3 && havePointerLock) {
			document.exitPointerLock();
		}
	});

	canvas.keyup(function(e) {
		viewPortKeyStates[e.which] = false;
	});

	canvas.click(function(e) {
		canvas.focus();
	});

	canvas.focusout(function(e) {
		resetViewPortKeys();
	});

	var rotQuaternion = new THREE.Quaternion();
	var rotationVector = new THREE.Vector3( 0, 0, 0 );

	document.addEventListener( 'mousemove', function(e) {
		if(viewPortKeyStates[MOUSE_RMB]) {
			var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
			var movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

			rotationVector.set(-movementY * mouseSens, -movementX * mouseSens, 0);
			rotQuaternion.set( rotationVector.x, rotationVector.y, rotationVector.z, 1 ).normalize();
		 	camera.quaternion.multiply( rotQuaternion );
		}
	}, false);

	camera.position.y = 5;
	camera.position.z = 5;

	camera.lookAt(THREE.Vector3.ZERO);

	// create some default lights
	var light = new THREE.AmbientLight( 0x333333 ); // soft white light
	scene.add( light );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( 1, 1, 1 );
	scene.add( directionalLight );

	var FPS = 0, frames = 0;

	var render = function () {
		requestAnimationFrame(render);

		if(viewPortKeyStates[CAM_LEFT]) {
			camera.translateX(-camSpeed);
		}

		if(viewPortKeyStates[CAM_RIGHT]) {
			camera.translateX(camSpeed);
		}

		if(viewPortKeyStates[CAM_FWD]) {
			camera.translateZ(-camSpeed);
		}

		if(viewPortKeyStates[CAM_BACK]) {
			camera.translateZ(camSpeed);
		}

		C.lua_getglobal(L, "render");

		if (C.lua_pcall(L, 0, 0, 0) != 0) {
        	throw new Error("error running function 'render': "+
                C.lua_tostring(L, -1));
        }
       	
       	frames++;
       	renderer.render(scene, camera);
	};

	var fpsUpdate = function() {
		FPS = frames;
		console.log("FPS: "+FPS);
		frames = 0;
	}

	//window.setInterval(fpsUpdate, 1000);

/*Lua5_1.provide_file("/", "main.lua",
"waidLog(\"LUA Engine Started.\")\n"+
"\n"+
"function render()\n"+
"end\n"+
"\n",
true, false);
*/

	var runMain = function() {
		var mainLUACode = 
	"print(\"LUA Engine Started.\")\n"+
	"\n"+
	"function render()\n"+
	"end\n"+
	"\n";

		if (C.luaL_dostring(L, mainLUACode) != 0)
		{
		  var err = C.lua_tostring(L, -1);
		  C.lua_close(L);
		  L = 0;
		  throw new Error("Lua error: " + err);
		}
	}


	newObject(scene);

	C.lua_pushstring(L, scene.uuid);
	C.lua_setglobal(L, "mainScene");

	runMain();

	$( "#runIt" ).click(function() {
		clearScene(scene);
		if (C.luaL_dostring(L, $("textarea#luaScript").val()) != 0)
		{
		  var err = C.lua_tostring(L, -1);
		  C.lua_close(L);
		  L = 0;
		  throw new Error("Lua error: " + err);

		  runMain();
		}

	});

	render();
});

