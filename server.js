// Ganti baris ini:
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // ← hapus 'public'
});
