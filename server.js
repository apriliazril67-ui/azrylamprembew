const express = require('express');
const path = require('path');
const app = express();

// Sajikan file dari folder utama — pakai resolve agar path pasti benar
app.use(express.static(path.resolve(__dirname)));

// Halaman utama — cara paling pasti di Railway
app.get('/', (req, res) => {
  const indexPath = path.resolve(__dirname, 'index.html');
  res.sendFile(indexPath);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('✅ Jalan di port ' + PORT);
  console.log('📂 Folder utama: ' + __dirname);
});
