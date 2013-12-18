
var objects = new Object();

var newObject = function(obj) {
  objects[obj.uuid] = obj;
};


var getObject = function(uuid) {
  return objects[uuid];
};

var removeObject = function(uuid) {
  objects[uuid] = null;
}

var clearScene = function(scene) {
  var obj, i;
  for ( i = scene.children.length - 1; i >= 0 ; i -- ) {
      obj = scene.children[ i ];
      scene.remove(obj);
      removeObject(obj.uuid);
  }
}


var C = Lua5_1.C;

var L = C.lua_open();
C.luaL_openlibs(L);

C.lua_pushcfunction(
    L,
    Lua5_1.Runtime.addFunction(
        function(L)
        {
          var scene = new THREE.Scene();
          C.lua_pushstring(L, scene.uuid);
          newObject(scene);
          return 1;
        }
      )
  );
C.lua_setglobal(L, "waidScene");

C.lua_pushcfunction(
    L,
    Lua5_1.Runtime.addFunction(
        function(L)
        {
          var sceneID = C.luaL_checkstring(L, 1);
          var objID = C.luaL_checkstring(L, 2);

          var scene = getObject(sceneID);
          var obj = getObject(objID);

          scene.add(obj);

          return 0;
        }
      )
  );
C.lua_setglobal(L, "waidAddToScene");

C.lua_pushcfunction(
    L,
    Lua5_1.Runtime.addFunction(
        function(L)
        {
          var fov = C.luaL_checknumber(L, 1);
          var aspect = C.luaL_checknumber(L, 2);
          var near = C.luaL_checknumber(L, 3);
          var far = C.luaL_checknumber(L, 4);

          var cam = new THREE.PerspectiveCamera(fov, aspect, near, far);
          C.lua_pushstring(L, cam.uuid);
          newObject(cam);
          return 1;
        }
      )
  );
C.lua_setglobal(L, "waidPerspectiveCamera");

C.lua_pushcfunction(
    L,
    Lua5_1.Runtime.addFunction(
        function(L)
        {
          var color = C.luaL_checknumber(L, 1);

          var obj = new THREE.PointLight(color);
          C.lua_pushstring(L, obj.uuid);
          newObject(obj);
          return 1;
        }
      )
  );
C.lua_setglobal(L, "waidPointLight");

C.lua_pushcfunction(
    L,
    Lua5_1.Runtime.addFunction(
        function(L)
        {
          var w = C.luaL_checknumber(L, 1);
          var h = C.luaL_checknumber(L, 2);
          var d = C.luaL_checknumber(L, 3);

          var geometry = new THREE.CubeGeometry(w, h, d);
          var material = new THREE.MeshLambertMaterial({color: 0x00ff00});

          var obj = new THREE.Mesh(geometry, material);
          C.lua_pushstring(L, obj.uuid);
          newObject(obj);
          return 1;
        }
      )
  );
C.lua_setglobal(L, "waidCube");

C.lua_pushcfunction(
    L,
    Lua5_1.Runtime.addFunction(
        function(L)
        {
          var objID = C.luaL_checkstring(L, 1);
          var r = C.luaL_checknumber(L, 2);

          obj = getObject(objID);

          obj.rotation.x += r;

          return 0;
        }
      )
  );
C.lua_setglobal(L, "waidRotateObjectX");

C.lua_pushcfunction(
    L,
    Lua5_1.Runtime.addFunction(
        function(L)
        {
          var objID = C.luaL_checkstring(L, 1);
          var r = C.luaL_checknumber(L, 2);

          obj = getObject(objID);

          obj.rotation.y += r;

          return 0;
        }
      )
  );
C.lua_setglobal(L, "waidRotateObjectY");

C.lua_pushcfunction(
    L,
    Lua5_1.Runtime.addFunction(
        function(L)
        {
          var objID = C.luaL_checkstring(L, 1);
          var r = C.luaL_checknumber(L, 2);

          obj = getObject(objID);

          obj.rotation.z += r;

          return 0;
        }
      )
  );
C.lua_setglobal(L, "waidRotateObjectZ");

C.lua_pushcfunction(
    L,
    Lua5_1.Runtime.addFunction(
        function(L)
        {
          var id = C.luaL_checkstring(L, 1);
          var x = C.luaL_checknumber(L, 2);
          var y = C.luaL_checknumber(L, 3);
          var z = C.luaL_checknumber(L, 4);

          var obj = getObject(id);
          obj.position.set(x, y, z);
          return 0;
        }
      )
  );
C.lua_setglobal(L, "waidSetObjectPosition");

C.lua_pushcfunction(
    L,
    Lua5_1.Runtime.addFunction(
        function(L)
        {
          var id = C.luaL_checkstring(L, 1);
          var x = C.luaL_checknumber(L, 2);
          var y = C.luaL_checknumber(L, 3);
          var z = C.luaL_checknumber(L, 4);

          var obj = getObject(id);
          obj.rotation.set(x, y, z);
          return 0;
        }
      )
  );
C.lua_setglobal(L, "waidSetObjectRotation");

C.lua_pushcfunction(
    L,
    Lua5_1.Runtime.addFunction(
        function(L)
        {
          var id = C.luaL_checkstring(L, 1);
          var x = C.luaL_checknumber(L, 2);
          var y = C.luaL_checknumber(L, 3);
          var z = C.luaL_checknumber(L, 4);

          var obj = getObject(id);
          obj.scale.set(x, y, z);
          return 0;
        }
      )
  );
C.lua_setglobal(L, "waidSetObjectScale");
