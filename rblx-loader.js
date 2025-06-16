function runRBLX() {
  const fileInput = document.getElementById("rblxFile");
  const output = document.getElementById("output");

  if (!fileInput.files[0]) {
    output.textContent = "❌ Lütfen bir .rblx dosyası seçin.";
    return;
  }

  const reader = new FileReader();

  reader.onload = function(event) {
    const luaCode = event.target.result;

    try {
      const L = fengari.lauxlib.luaL_newstate();
      fengari.lualib.luaL_openlibs(L);  // ✅ Tüm Lua kütüphaneleri yüklenir

      const status = fengari.lauxlib.luaL_dostring(L, fengari.to_luastring(luaCode));

      if (status !== fengari.lua.LUA_OK) {
        const error = fengari.lua.lua_tojsstring(L, -1);
        output.textContent = "💥 Lua Hatası: " + error;
      } else {
        output.textContent = "✅ Kod başarıyla çalıştırıldı!";
      }
    } catch (err) {
      output.textContent = "🚨 JS Hatası: " + err.message;
    }
  };

  reader.readAsText(fileInput.files[0]);
}
