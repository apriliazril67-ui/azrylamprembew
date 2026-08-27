requireAuth();
renderNav("order");

let pricePerUnit = 0;

function showMsg(text, type){
  document.getElementById("msg-box").innerHTML = `<div class="msg msg-${type}">${text}</div>`;
}

function updatePreview(){
  const jumlah = parseInt(document.getElementById("jumlah").value, 10) || 0;
  document.getElementById("total-preview").value = formatRupiah(jumlah * pricePerUnit);
}

async function loadInfo(){
  const cfg = await api("/config");
  pricePerUnit = cfg.pricePerUnit;
  document.getElementById("info-price").textContent = formatRupiah(pricePerUnit);
  updatePreview();

  const me = await api("/me");
  document.getElementById("info-saldo").textContent = formatRupiah(me.user.saldo);
  document.getElementById("info-stock").textContent = me.stockTersisa + " unit";
}

document.getElementById("jumlah").addEventListener("input", updatePreview);

document.getElementById("order-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const jumlah = parseInt(document.getElementById("jumlah").value, 10);
  const btn = document.getElementById("btn-order");
  btn.disabled = true;
  try{
    const data = await api("/order", { method:"POST", body: JSON.stringify({ jumlah }) });
    showMsg(`Berhasil! ${data.order.jumlah} unit AM Premium sudah masuk ke Riwayat Pesanan.`, "success");
    await refreshSaldo();
    await loadInfo();
  }catch(err){
    showMsg(err.message, "error");
  }finally{
    btn.disabled = false;
  }
});

loadInfo();
