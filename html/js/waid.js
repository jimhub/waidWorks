
$(function() {

	var canvas = $("#webGLViewport");

	var w = canvas.width();
	var h = canvas.height();

	console.log($("#mainMenu").height());
	
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, w / h, 0.1, 1000 );

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( w, h );
	
	canvas.html(renderer.domElement);

	canvas.resizable({
  		resize: function( event, ui ) {
			var width = canvas.width();
			var height = canvas.height();
  			renderer.setSize(width, height);
		    camera.aspect = width / height;
		    camera.updateProjectionMatrix();
  		}
	});

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

