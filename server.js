const express = require('express');
const path = require('path');
const app = express();

// Sajikan semua file dari folder utama
app.use(express.static(__dirname));

// Halaman utama — cara paling sederhana
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('✅ Jalan di port ' + PORT));
