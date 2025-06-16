function runRBLX() {
  const fileInput = document.getElementById("rblxFile");
  const output = document.getElementById("output");
  output.textContent = "";  // Önce temizle

  if (!fileInput.files[0]) {
    output.textContent = "❌ Lütfen bir .rblx dosyası seçin.";
    return;
  }

  const reader = new FileReader();

  reader.onload = function(event) {
    const luaCode = event.target.result;

    try {
      const L = fengari.lauxlib.luaL_newstate();
      fengari.lualib.luaL_openlibs(L);

      // print fonksiyonunu override ediyoruz:
      fengari.lua.lua_pushjsfunction(L, function(L) {
        let n = fengari.lua.lua_gettop(L);
        let texts = [];
        for (let i = 1; i <= n; i++) {
          texts.push(fengari.to_jsstring(fengari.lua.lua_tolstring(L, i)));
        }
        output.textContent += texts.join("\t") + "\n";
        return 0;
      });
      fengari.lua.lua_setglobal(L, "print");

      const status = fengari.lauxlib.luaL_dostring(L, fengari.to_luastring(luaCode));

      if (status !== fengari.lua.LUA_OK) {
        const error = fengari.lua.lua_tojsstring(L, -1);
        output.textContent += "\n💥 Lua Hatası: " + error;
      } else {
        output.textContent += "\n✅ Kod başarıyla çalıştırıldı!";
      }
    } catch (err) {
      output.textContent += "\n🚨 JS Hatası: " + err.message;
    }
  };

  reader.readAsText(fileInput.files[0]);
}
