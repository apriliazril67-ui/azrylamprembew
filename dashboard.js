requireAuth();
renderNav("dashboard");
maybeShowWaPopup();

(async function init(){
  const user = Auth.getUser();
  document.getElementById("hello-username").textContent = user.username;

  try{
    const me = await api("/me");
    Auth.setUser(me.user);
    document.getElementById("stat-saldo").textContent = formatRupiah(me.user.saldo);
    document.getElementById("stat-stock").textContent = me.stockTersisa + " unit";
  }catch(e){}

  try{
    const cfg = await api("/config");
    document.getElementById("stat-price").textContent = formatRupiah(cfg.pricePerUnit);
  }catch(e){}
})();
