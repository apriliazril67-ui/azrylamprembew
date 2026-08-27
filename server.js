const express = require('express');
const app = express();
const fs = require('fs');

// Baca semua file dari folder utama
app.use(express.static(__dirname));

// Halaman utama — cara paling simpel
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Database tetap jalan
const DB_PATH = __dirname + '/db.json';
if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, '{}');

function bacaData() {
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); }
  catch { return {}; }
}

function simpanData(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

app.use(express.json());

app.get('/api/data', (req, res) => res.json(bacaData()));

app.post('/api/simpan', (req, res) => {
  const data = bacaData();
  Object.assign(data, req.body);
  simpanData(data);
  res.json({ sukses: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('✅ Jalan di port ' + PORT));
