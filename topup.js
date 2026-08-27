requireAuth();
renderNav("topup");

function showMsg(text, type){
  document.getElementById("msg-box").innerHTML = `<div class="msg msg-${type}">${text}</div>`;
}

let minTopup = 1000;

async function loadConfig(){
  const cfg = await api("/config");
  minTopup = cfg.minTopup;
  document.getElementById("min-topup-text").textContent = formatRupiah(cfg.minTopup);
  document.getElementById("qr-image").src = cfg.qrImageUrl;
  document.getElementById("dana-number").textContent = cfg.danaNumber;
  document.getElementById("dana-name").textContent = cfg.danaName;
  document.getElementById("nominal").min = cfg.minTopup;
}

document.getElementById("topup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nominal = parseInt(document.getElementById("nominal").value, 10);
  const namaPengirim = document.getElementById("nama-pengirim").value.trim();
  const btn = document.getElementById("btn-topup");

  if(nominal < minTopup){
    showMsg(`Nominal top up minimal ${formatRupiah(minTopup)}.`, "error");
    return;
  }

  btn.disabled = true;
  try{
    await api("/deposit", { method:"POST", body: JSON.stringify({ nominal, namaPengirim }) });
    showMsg("Konfirmasi top up terkirim. Saldo masuk setelah admin verifikasi (1-10 menit).", "success");
    document.getElementById("topup-form").reset();
  }catch(err){
    showMsg(err.message, "error");
  }finally{
    btn.disabled = false;
  }
});

loadConfig();
