
$(function() {


	var container = $("#windowContainer");
	var sceneTree = $("#sceneTreeWindow");
	var canvas = $("#webGLViewport");
	var properties = $("#propertyWindow");

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
	};

	resizeEverything();

	camera.position.z = 5;

	// create a point light

	var FPS = 0, frames = 0;

	var render = function () {
		requestAnimationFrame(render);

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

