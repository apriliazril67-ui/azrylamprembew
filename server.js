const express = require('express');
const app = express();
const fs = require('fs');

// Langsung baca dari folder utama
app.use(express.static('./'));

// Halaman utama — cara paling sederhana
app.get('/', (req, res) => {
  res.sendFile('./index.html', { root: __dirname });
});

// Database tetap jalan
const DB_FILE = './db.json';
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '{}');

function bacaData() {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
  catch { return {}; }
}
function simpanData(d) { fs.writeFileSync(DB_FILE, JSON.stringify(d, null, 2)); }

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
