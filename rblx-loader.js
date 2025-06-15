// Fengari modüllerini globalden al
const lua = fengari.lua;
const lauxlib = fengari.lauxlib;
const to_luastring = fengari.to_luastring;

function runRBLX() {
  const fileInput = document.getElementById("rblxFile");
  const output = document.getElementById("output");

  if (fileInput.files.length === 0) {
    output.textContent = "⚠️ Lütfen bir .rblx dosyası seç!";
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    const luaCode = e.target.result;

    try {
      // Yeni Lua VM oluştur
      const L = lauxlib.luaL_newstate();
      lauxlib.luaL_openlibs(L);

      // Lua kodunu çalıştır
      const status = lauxlib.luaL_dostring(L, to_luastring(luaCode));

      if (status === lua.LUA_OK) {
        output.textContent = "✅ Kod başarıyla çalıştırıldı!";
      } else {
        const err = lua.lua_tojsstring(L, -1);
        output.textContent = "💥 Lua Hatası: " + err;
      }
    } catch (err) {
      output.textContent = "💥 JS Hatası: " + err.message;
    }
  };

  reader.readAsText(fileInput.files[0]);
}
