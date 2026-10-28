/* Happy Home Finance - prototype only.
   Data is stored in JavaScript memory and resets when the page is refreshed.
   No PHP, API, or MySQL connection is configured yet. */
const DEMO = true;
const monthlySalesTarget = 150000000;
const monthlyCashflowTarget = 20000000;
const openingBankBalance = 45000000;
const openingCashBalance = 3500000;

const transactions = [
  {id:1,date:dateOffset(-0),direction:'in',account:'bank',category:'Penjualan',description:'Setoran penjualan Toko 1',amount:12500000},
  {id:2,date:dateOffset(-0),direction:'out',account:'bank',category:'Belanja',description:'Pembelian stok alat rumah tangga',amount:4300000},
  {id:3,date:dateOffset(-1),direction:'in',account:'cash',category:'Penjualan',description:'Penerimaan tunai Toko 2',amount:2750000},
  {id:4,date:dateOffset(-1),direction:'out',account:'cash',category:'Dapur',description:'Belanja kebutuhan dapur',amount:250000},
  {id:5,date:dateOffset(-2),direction:'out',account:'bank',category:'Gaji',description:'Pembayaran gaji staf',amount:6500000},
  {id:6,date:dateOffset(-3),direction:'out',account:'bank',category:'Overhead',description:'Listrik dan internet toko',amount:1250000},
  {id:7,date:dateOffset(-4),direction:'in',account:'bank',category:'Pendapatan ongkir',description:'Rekap pendapatan ongkir',amount:850000},
  {id:8,date:dateOffset(-5),direction:'out',account:'bank',category:'Owner 1',description:'Penarikan Owner 1 (demo)',amount:1000000},
  {id:9,date:dateOffset(-6),direction:'out',account:'cash',category:'Owner 2',description:'Penarikan Owner 2 (demo)',amount:500000},
  {id:10,date:dateOffset(-7),direction:'out',account:'bank',category:'Laba ditahan',description:'Alokasi laba ditahan (demo)',amount:1000000}
];
const sales = [
  {id:1,date:dateOffset(-0),store:1,type:'sale',description:'Rekap penjualan harian Toko 1',amount:18500000},
  {id:2,date:dateOffset(-0),store:2,type:'sale',description:'Rekap penjualan harian Toko 2',amount:12750000},
  {id:3,date:dateOffset(-1),store:1,type:'sale',description:'Penjualan peralatan dapur',amount:14300000},
  {id:4,date:dateOffset(-1),store:2,type:'sale',description:'Penjualan perlengkapan rumah',amount:9800000},
  {id:5,date:dateOffset(-2),store:1,type:'shipping',description:'Pendapatan ongkir Toko 1',amount:450000},
  {id:6,date:dateOffset(-2),store:2,type:'shipping',description:'Pendapatan ongkir Toko 2',amount:325000},
  {id:7,date:dateOffset(-3),store:1,type:'sale',description:'Penjualan alat kebersihan',amount:11200000},
  {id:8,date:dateOffset(-4),store:2,type:'sale',description:'Penjualan perlengkapan kamar',amount:8750000}
];
const inventory = [
  {sku:'HH-001',name:'Rak Serbaguna 4 Susun',qty:18,cost:185000},
  {sku:'HH-002',name:'Panci Set 5 Pcs',qty:24,cost:235000},
  {sku:'HH-003',name:'Tempat Penyimpanan Plastik',qty:42,cost:32000},
  {sku:'HH-004',name:'Kipas Angin Meja',qty:12,cost:175000},
  {sku:'HH-005',name:'Set Peralatan Dapur',qty:16,cost:128000},
  {sku:'HH-006',name:'Tempat Sampah Pedal',qty:28,cost:55000}
];

function dateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function money(value) {
  return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(Number(value)||0);
}
function fmtDate(value) {
  if (!value) return '-';
  const d = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('id-ID',{day:'2-digit',month:'short',year:'numeric'}).format(d);
}
function sum(items, fn) { return items.reduce((total,item)=>total+fn(item),0); }
function el(id) { return document.getElementById(id); }
function safe(value) {
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function currentBalance(account) {
  const net = sum(transactions.filter(t=>t.account===account),t=>t.direction==='in'?t.amount:-t.amount);
  return (account==='bank'?openingBankBalance:openingCashBalance)+net;
}
function totals() {
  return {
    incoming:sum(transactions.filter(t=>t.direction==='in'),t=>t.amount),
    outgoing:sum(transactions.filter(t=>t.direction==='out'),t=>t.amount),
    bank:currentBalance('bank'),
    cash:currentBalance('cash'),
    store1:sum(sales.filter(s=>s.store===1&&s.type==='sale'),s=>s.amount),
    store2:sum(sales.filter(s=>s.store===2&&s.type==='sale'),s=>s.amount),
    shipping:sum(sales.filter(s=>s.type==='shipping'),s=>s.amount),
    inventory:sum(inventory,i=>i.qty*i.cost),
    skus:inventory.length
  };
}
function setText(id,value) { const node=el(id); if(node) node.textContent=value; }
function renderDashboard() {
  const t=totals();
  setText('totalIn',money(t.incoming));setText('totalOut',money(t.outgoing));
  setText('bankBalance',money(t.bank));setText('cashBalance',money(t.cash));
  setText('totalBalance',money(t.bank+t.cash));
  setText('store1Total',money(t.store1));setText('store2Total',money(t.store2));setText('shippingTotal',money(t.shipping));
  setText('inventoryValue',money(t.inventory));setText('inventorySkuCount',`${t.skus} barang`);
  const period=el('dashboardPeriod')?.value||'month';
  const filteredSales=sales.filter(s=>s.type==='sale'&&(period==='all'||(period==='year'?s.date.slice(0,4)===dateOffset(0).slice(0,4):s.date.slice(0,7)===dateOffset(0).slice(0,7))));
  const realization=sum(filteredSales,s=>s.amount);
  const pct=monthlySalesTarget>0?Math.min(100,realization/monthlySalesTarget*100):0;
  setText('salesProgressText',`${pct.toFixed(1).replace('.',',')}%`);
  setText('salesRealization',money(realization));setText('salesTargetCaption',`Target ${money(monthlySalesTarget)}`);
  setText('salesTargetRemaining',`Sisa target ${money(Math.max(0,monthlySalesTarget-realization))}`);
  if(el('salesProgressBar'))el('salesProgressBar').style.width=`${pct}%`;
  renderRecent();renderCashflow();renderSales();renderInventory();renderReports();
}
function renderRecent() {
  const body=el('recentTransactions'); if(!body)return;
  const rows=[...transactions].sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id).slice(0,6);
  body.innerHTML=rows.length?rows.map(t=>`<tr><td>${fmtDate(t.date)}</td><td>${safe(t.description)}</td><td>${safe(t.category)}</td><td>${t.account==='bank'?'Rekening pusat':'Kas tunai'}</td><td class="${t.direction==='in'?'amount-in':'amount-out'}">${t.direction==='in'?'+':'−'} ${money(t.amount)}</td></tr>`).join(''):`<tr><td colspan="5" class="empty-row">Belum ada transaksi.</td></tr>`;
}
function renderCashflow() {
  const incoming=sum(transactions.filter(t=>t.direction==='in'),t=>t.amount);
  const outgoing=sum(transactions.filter(t=>t.direction==='out'),t=>t.amount);
  setText('cashInPage',money(incoming));setText('cashOutPage',money(outgoing));setText('cashNetPage',money(incoming-outgoing));
  const query=(el('transactionSearch')?.value||'').toLowerCase();
  const rows=[...transactions].sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id).filter(t=>[t.description,t.category,t.account].join(' ').toLowerCase().includes(query));
  const body=el('transactionsTable');
  if(body)body.innerHTML=rows.length?rows.map(t=>`<tr><td>${fmtDate(t.date)}</td><td>${safe(t.description)}</td><td>${safe(t.category)}</td><td><span class="type-pill ${t.direction}">${t.direction==='in'?'Masuk':'Keluar'}</span></td><td>${t.account==='bank'?'Rekening pusat':'Kas tunai'}</td><td class="${t.direction==='in'?'amount-in':'amount-out'}">${t.direction==='in'?'+':'−'} ${money(t.amount)}</td></tr>`).join(''):`<tr><td colspan="6" class="empty-row">Tidak ada transaksi yang cocok.</td></tr>`;
  const expenses=transactions.filter(t=>t.direction==='out');
  const groups={};expenses.forEach(t=>groups[t.category]=(groups[t.category]||0)+t.amount);
  const entries=Object.entries(groups).sort((a,b)=>b[1]-a[1]);
  const max=Math.max(1,...entries.map(e=>e[1]));
  const breakdown=el('expenseBreakdown');
  if(breakdown)breakdown.innerHTML=entries.length?entries.map(([name,value])=>`<div class="expense-item"><span class="expense-name">${safe(name)}</span><div class="expense-track"><span style="width:${value/max*100}%"></span></div><strong class="expense-value">${money(value)}</strong></div>`).join(''):`<p class="empty-row">Belum ada pengeluaran.</p>`;
}
function renderSales() {
  const t=totals();
  setText('salesStore1Page',money(t.store1));setText('salesStore2Page',money(t.store2));setText('salesShippingPage',money(t.shipping));
  const saleOnly=sum(sales.filter(s=>s.type==='sale'),s=>s.amount);
  const pct=monthlySalesTarget>0?Math.min(100,saleOnly/monthlySalesTarget*100):0;
  setText('salesPageProgress',`${pct.toFixed(1).replace('.',',')}%`);setText('salesPageTarget',money(monthlySalesTarget));setText('salesPageRealization',money(saleOnly));setText('salesPageRemaining',money(Math.max(0,monthlySalesTarget-saleOnly)));
  if(el('salesPageProgressBar'))el('salesPageProgressBar').style.width=`${pct}%`;
  const body=el('salesTable');
  if(body)body.innerHTML=[...sales].sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id).map(s=>`<tr><td>${fmtDate(s.date)}</td><td>Toko ${s.store}</td><td>${s.type==='shipping'?'Pendapatan ongkir':'Penjualan barang'}</td><td>${safe(s.description)}</td><td>${money(s.amount)}</td></tr>`).join('');
}
function renderInventory() {
  const t=totals();
  setText('inventoryPageValue',money(t.inventory));setText('inventoryPageCount',`${t.skus} barang`);
  setText('inventoryValue',money(t.inventory));setText('inventorySkuCount',`${t.skus} barang`);
  const query=(el('inventorySearch')?.value||'').toLowerCase();
  const rows=inventory.filter(i=>`${i.sku} ${i.name}`.toLowerCase().includes(query));
  const body=el('inventoryTable');
  if(body)body.innerHTML=rows.length?rows.map(i=>`<tr><td>${safe(i.sku)}</td><td>${safe(i.name)}</td><td>${Number(i.qty).toLocaleString('id-ID',{maximumFractionDigits:2})}</td><td>${money(i.cost)}</td><td><strong>${money(i.qty*i.cost)}</strong></td></tr>`).join(''):`<tr><td colspan="5" class="empty-row">Tidak ada barang yang cocok.</td></tr>`;
}
function renderReports() {
  const start=el('reportStart')?.value||'0000-00-00';
  const end=el('reportEnd')?.value||'9999-12-31';
  const tx=transactions.filter(t=>t.date>=start&&t.date<=end);
  const incoming=sum(tx.filter(t=>t.direction==='in'),t=>t.amount);
  const outgoing=sum(tx.filter(t=>t.direction==='out'),t=>t.amount);
  setText('reportIn',money(incoming));setText('reportOut',money(outgoing));setText('reportNet',money(incoming-outgoing));
  const ss=sales.filter(s=>s.date>=start&&s.date<=end);
  const s1=sum(ss.filter(s=>s.store===1&&s.type==='sale'),s=>s.amount);
  const s2=sum(ss.filter(s=>s.store===2&&s.type==='sale'),s=>s.amount);
  const shipping=sum(ss.filter(s=>s.type==='shipping'),s=>s.amount);
  const body=el('reportSalesTable');
  if(body)body.innerHTML=`<tr><td>Penjualan Toko 1</td><td>${money(s1)}</td></tr><tr><td>Penjualan Toko 2</td><td>${money(s2)}</td></tr><tr><td>Pendapatan ongkir</td><td>${money(shipping)}</td></tr><tr><td><strong>Total omzet + ongkir</strong></td><td><strong>${money(s1+s2+shipping)}</strong></td></tr>`;
}
function showToast(message) {
  const toast=el('toast');if(!toast)return;
  toast.textContent=message;toast.classList.add('show');
  clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),2800);
}
function toggleForm(id,show) { const node=el(id);if(node)node.classList.toggle('hidden',!show);if(show)node.scrollIntoView({behavior:'smooth',block:'center'}); }
function navigate(page) {
  document.querySelectorAll('.page-section').forEach(s=>s.classList.toggle('active',s.id===`page-${page}`));
  document.querySelectorAll('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
  const titles={dashboard:'Dashboard',cashflow:'Cashflow',sales:'Omzet & Penjualan',reports:'Laporan Keuangan',inventory:'Nilai Persediaan'};
  setText('pageTitle',titles[page]||'Dashboard');
  if(window.innerWidth<760)el('sidebar')?.classList.remove('mobile-open');
  window.scrollTo({top:0,behavior:'smooth'});
}
function setupForms() {
  el('txDate').value=dateOffset(0);el('saleDate').value=dateOffset(0);
  el('transactionForm').addEventListener('submit',event=>{
    event.preventDefault();
    const amount=Number(el('txAmount').value);
    if(!Number.isFinite(amount)||amount<=0){showToast('Nominal harus lebih besar dari nol.');return;}
    transactions.push({id:Date.now(),date:el('txDate').value,direction:el('txDirection').value,account:el('txAccount').value,category:el('txCategory').value,description:el('txDescription').value.trim(),amount});
    el('transactionForm').reset();el('txDate').value=dateOffset(0);toggleForm('transactionFormPanel',false);renderDashboard();showToast('Transaksi demo ditambahkan. Tidak tersimpan setelah refresh.');
  });
  el('salesForm').addEventListener('submit',event=>{
    event.preventDefault();const amount=Number(el('saleAmount').value);
    if(!Number.isFinite(amount)||amount<=0){showToast('Nominal harus lebih besar dari nol.');return;}
    sales.push({id:Date.now(),date:el('saleDate').value,store:Number(el('saleStore').value),type:el('saleType').value,description:el('saleDescription').value.trim(),amount});
    el('salesForm').reset();el('saleDate').value=dateOffset(0);toggleForm('salesFormPanel',false);renderDashboard();showToast('Penjualan demo ditambahkan. Belum tercatat di cashflow.');
  });
  el('inventoryForm').addEventListener('submit',event=>{
    event.preventDefault();const sku=el('itemSku').value.trim();const name=el('itemName').value.trim();const qty=Number(el('itemQty').value);const cost=Number(el('itemCost').value);
    if(!sku||!name||qty<0||cost<0){showToast('Periksa data barang.');return;}
    const existing=inventory.find(i=>i.sku.toLowerCase()===sku.toLowerCase());
    if(existing){existing.name=name;existing.qty=qty;existing.cost=cost;}else inventory.push({sku,name,qty,cost});
    el('inventoryForm').reset();el('itemQty').value='0';el('itemCost').value='0';toggleForm('inventoryFormPanel',false);renderDashboard();showToast('Barang demo disimpan. Tidak tersimpan setelah refresh.');
  });
}
document.addEventListener('DOMContentLoaded',()=>{
  setText('todayDate',new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short',year:'numeric'}).format(new Date()));
  setText('yearNow',new Date().getFullYear());
  const firstDay=new Date();firstDay.setDate(1);
  el('reportStart').value=`${firstDay.getFullYear()}-${String(firstDay.getMonth()+1).padStart(2,'0')}-${String(firstDay.getDate()).padStart(2,'0')}`;
  el('reportEnd').value=dateOffset(0);
  document.querySelectorAll('.nav-link').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.page)));
  document.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.goto)));
  el('dashboardPeriod').addEventListener('change',renderDashboard);
  el('showTransactionForm').addEventListener('click',()=>toggleForm('transactionFormPanel',true));
  el('hideTransactionForm').addEventListener('click',()=>toggleForm('transactionFormPanel',false));
  el('cancelTransaction').addEventListener('click',()=>toggleForm('transactionFormPanel',false));
  el('showSalesForm').addEventListener('click',()=>toggleForm('salesFormPanel',true));
  el('hideSalesForm').addEventListener('click',()=>toggleForm('salesFormPanel',false));
  el('cancelSales').addEventListener('click',()=>toggleForm('salesFormPanel',false));
  el('showInventoryForm').addEventListener('click',()=>toggleForm('inventoryFormPanel',true));
  el('hideInventoryForm').addEventListener('click',()=>toggleForm('inventoryFormPanel',false));
  el('cancelInventory').addEventListener('click',()=>toggleForm('inventoryFormPanel',false));
  el('transactionSearch').addEventListener('input',renderCashflow);
  el('inventorySearch').addEventListener('input',renderInventory);
  el('applyReportFilter').addEventListener('click',()=>{if(el('reportStart').value>el('reportEnd').value){showToast('Tanggal awal tidak boleh melewati tanggal akhir.');return;}renderReports();showToast('Filter laporan diterapkan.');});
  el('printReport').addEventListener('click',()=>window.print());
  el('mobileMenu').addEventListener('click',()=>el('sidebar').classList.toggle('mobile-open'));
  renderDashboard();setupForms();
});
