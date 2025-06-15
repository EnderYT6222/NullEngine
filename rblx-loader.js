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
      const luaFn = fengari.load(luaCode);
      fengari.lua_call(luaFn, 0); // çalıştır
      output.textContent = "✅ Kod başarıyla çalıştırıldı!";
    } catch (err) {
      output.textContent = "💥 Hata: " + err.message;
    }
  };

  reader.readAsText(fileInput.files[0]);
}
