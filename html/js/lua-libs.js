
(function(Lua5_1) {
Lua5_1.provide_file("/", "class.lua",
"-- class.lua\n"+
"-- Compatible with Lua 5.1 (not 5.0).\n"+
"function class(base, init)\n"+
"   local c = {}    -- a new class instance\n"+
"   if not init and type(base) == 'function' then\n"+
"      init = base\n"+
"      base = nil\n"+
"   elseif type(base) == 'table' then\n"+
"    -- our new class is a shallow copy of the base class!\n"+
"      for i,v in pairs(base) do\n"+
"         c[i] = v\n"+
"      end\n"+
"      c._base = base\n"+
"   end\n"+
"   -- the class will be the metatable for all its objects,\n"+
"   -- and they will look up their methods in it.\n"+
"   c.__index = c\n"+
"\n"+
"   -- expose a constructor which can be called by <classname>(<args>)\n"+
"   local mt = {}\n"+
"   mt.__call = function(class_tbl, ...)\n"+
"   local obj = {}\n"+
"   setmetatable(obj,c)\n"+
"   if class_tbl.init then\n"+
"      class_tbl.init(obj,...)\n"+
"   else\n"+
"      -- make sure that any stuff from the base class is initialized!\n"+
"      if base and base.init then\n"+
"      base.init(obj, ...)\n"+
"      end\n"+
"   end\n"+
"   return obj\n"+
"   end\n"+
"   c.init = init\n"+
"   c.is_a = function(self, klass)\n"+
"      local m = getmetatable(self)\n"+
"      while m do\n"+
"         if m == klass then return true end\n"+
"         m = m._base\n"+
"      end\n"+
"      return false\n"+
"   end\n"+
"   setmetatable(c, mt)\n"+
"   return c\n"+
"end\n",
true, false);


})(Lua5_1);
