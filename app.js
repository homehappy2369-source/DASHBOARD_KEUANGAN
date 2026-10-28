/* Prototype only: no database, no persistence. Do not use demo numbers as official accounts. */
const monthlySalesTarget=150000000;
const openingBankBalance=45000000;
const openingCashBalance=3500000;
const accounts=[
{code:'1010',name:'Kas Tunai',type:'asset',normal:'Debit'},
{code:'1020',name:'Bank Pusat',type:'asset',normal:'Debit'},
{code:'1200',name:'Persediaan Barang',type:'asset',normal:'Debit'},
{code:'1500',name:'Peralatan Toko',type:'asset',normal:'Debit'},
{code:'1590',name:'Akumulasi Penyusutan',type:'contraAsset',normal:'Kredit'},
{code:'2010',name:'Utang Usaha',type:'liability',normal:'Kredit'},
{code:'2020',name:'Utang Gaji',type:'liability',normal:'Kredit'},
{code:'3010',name:'Modal Pemilik',type:'equity',normal:'Kredit'},
{code:'3020',name:'Laba Ditahan',type:'equity',normal:'Kredit'},
{code:'3030',name:'Prive / Penarikan Pemilik',type:'draw',normal:'Debit'},
{code:'4010',name:'Pendapatan Penjualan Toko 1',type:'revenue',normal:'Kredit'},
{code:'4020',name:'Pendapatan Penjualan Toko 2',type:'revenue',normal:'Kredit'},
{code:'4030',name:'Pendapatan Ongkir',type:'revenue',normal:'Kredit'},
{code:'4090',name:'Retur dan Potongan Penjualan',type:'contraRevenue',normal:'Debit'},
{code:'5010',name:'Harga Pokok Penjualan (HPP)',type:'expense',normal:'Debit'},
{code:'6010',name:'Beban Gaji',type:'expense',normal:'Debit'},
{code:'6020',name:'Beban Overhead',type:'expense',normal:'Debit'},
{code:'6030',name:'Beban Dapur',type:'expense',normal:'Debit'},
{code:'6040',name:'Beban Penyusutan',type:'expense',normal:'Debit'},
{code:'6050',name:'Beban Lain-lain',type:'expense',normal:'Debit'}
];
function dateOffset(days){const d=new Date();d.setDate(d.getDate()+days);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
const journals=[
{id:1,date:dateOffset(-7),ref:'JV-DEMO-001',description:'Saldo awal bank pusat (demo)',debit:'1020',credit:'3010',amount:45000000},
{id:2,date:dateOffset(-7),ref:'JV-DEMO-002',description:'Saldo awal kas tunai (demo)',debit:'1010',credit:'3010',amount:3500000},
{id:13,date:dateOffset(-7),ref:'JV-DEMO-002A',description:'Saldo awal persediaan (demo)',debit:'1200',credit:'3010',amount:9000000},
{id:3,date:dateOffset(-6),ref:'JV-DEMO-003',description:'Pembelian persediaan dibayar bank',debit:'1200',credit:'1020',amount:4300000},
{id:4,date:dateOffset(-5),ref:'JV-DEMO-004',description:'Penjualan tunai Toko 1 (demo)',debit:'1020',credit:'4010',amount:12500000},
{id:5,date:dateOffset(-5),ref:'JV-DEMO-005',description:'HPP penjualan Toko 1 (demo)',debit:'5010',credit:'1200',amount:7200000},
{id:6,date:dateOffset(-4),ref:'JV-DEMO-006',description:'Penjualan tunai Toko 2 (demo)',debit:'1010',credit:'4020',amount:2750000},
{id:7,date:dateOffset(-4),ref:'JV-DEMO-007',description:'HPP penjualan Toko 2 (demo)',debit:'5010',credit:'1200',amount:1600000},
{id:8,date:dateOffset(-3),ref:'JV-DEMO-008',description:'Pendapatan ongkir diterima bank',debit:'1020',credit:'4030',amount:850000},
{id:9,date:dateOffset(-2),ref:'JV-DEMO-009',description:'Pembayaran gaji staf',debit:'6010',credit:'1020',amount:2500000},
{id:10,date:dateOffset(-2),ref:'JV-DEMO-010',description:'Listrik dan internet toko',debit:'6020',credit:'1020',amount:650000},
{id:11,date:dateOffset(-1),ref:'JV-DEMO-011',description:'Pengeluaran dapur',debit:'6030',credit:'1010',amount:250000},
{id:12,date:dateOffset(-1),ref:'JV-DEMO-012',description:'Penarikan pemilik (prive)',debit:'3030',credit:'1020',amount:1000000}
];
const transactions=[
{id:1,date:dateOffset(0),direction:'in',account:'bank',category:'Penjualan',description:'Setoran penjualan Toko 1',amount:12500000},
{id:2,date:dateOffset(0),direction:'out',account:'bank',category:'Belanja',description:'Pembelian stok alat rumah tangga',amount:4300000},
{id:3,date:dateOffset(-1),direction:'in',account:'cash',category:'Penjualan',description:'Penerimaan tunai Toko 2',amount:2750000},
{id:4,date:dateOffset(-1),direction:'out',account:'cash',category:'Dapur',description:'Belanja kebutuhan dapur',amount:250000},
{id:5,date:dateOffset(-2),direction:'out',account:'bank',category:'Gaji',description:'Pembayaran gaji staf',amount:6500000},
{id:6,date:dateOffset(-3),direction:'out',account:'bank',category:'Overhead',description:'Listrik dan internet toko',amount:1250000}
];
const sales=[
{id:1,date:dateOffset(0),store:1,type:'sale',description:'Rekap penjualan harian Toko 1',amount:18500000},
{id:2,date:dateOffset(0),store:2,type:'sale',description:'Rekap penjualan harian Toko 2',amount:12750000},
{id:3,date:dateOffset(-1),store:1,type:'sale',description:'Penjualan peralatan dapur',amount:14300000},
{id:4,date:dateOffset(-1),store:2,type:'sale',description:'Penjualan perlengkapan rumah',amount:9800000},
{id:5,date:dateOffset(-2),store:1,type:'shipping',description:'Pendapatan ongkir Toko 1',amount:450000},
{id:6,date:dateOffset(-2),store:2,type:'shipping',description:'Pendapatan ongkir Toko 2',amount:325000}
];
const inventory=[
{sku:'HH-001',name:'Rak Serbaguna 4 Susun',qty:18,cost:185000},
{sku:'HH-002',name:'Panci Set 5 Pcs',qty:24,cost:235000},
{sku:'HH-003',name:'Tempat Penyimpanan Plastik',qty:42,cost:32000},
{sku:'HH-004',name:'Kipas Angin Meja',qty:12,cost:175000},
{sku:'HH-005',name:'Set Peralatan Dapur',qty:16,cost:128000}
];
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(Number(n)||0);
const dateFmt=s=>s?new Intl.DateTimeFormat('id-ID',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(s+'T00:00:00')):'-';
const sum=(arr,fn)=>arr.reduce((a,x)=>a+fn(x),0);
const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const acct=code=>accounts.find(a=>a.code===code);
const set=(id,value)=>{if($(id))$(id).textContent=value};
function accountBalances(until='9999-12-31',from='0000-00-00'){
 const b={};accounts.forEach(a=>b[a.code]=0);
 journals.filter(j=>j.date<=until&&j.date>=from).forEach(j=>{b[j.debit]=(b[j.debit]||0)+j.amount;b[j.credit]=(b[j.credit]||0)-j.amount});
 return b;
}
function allTimeBalances(until='9999-12-31'){
 const b={};accounts.forEach(a=>b[a.code]=0);
 journals.filter(j=>j.date<=until).forEach(j=>{b[j.debit]=(b[j.debit]||0)+j.amount;b[j.credit]=(b[j.credit]||0)-j.amount});
 return b;
}
function calcPL(until='9999-12-31',from='0000-00-00'){
 const b=accountBalances(until,from);
 const revenues=accounts.filter(a=>a.type==='revenue'||a.type==='contraRevenue');
 const revenue=sum(revenues,a=>a.type==='revenue'?-b[a.code]:b[a.code]);
 const cogs=sum(accounts.filter(a=>a.code==='5010'),a=>b[a.code]);
 const expenses=sum(accounts.filter(a=>a.type==='expense'&&a.code!=='5010'),a=>b[a.code]);
 return {revenue,cogs,gross:revenue-cogs,expenses,net:revenue-cogs-expenses};
}
function cashBalanceFromJournals(code,until='9999-12-31'){
 return (allTimeBalances(until)[code]||0);
}
function trialBalance(until='9999-12-31'){
 const b=allTimeBalances(until);
 return sum(accounts.filter(a=>a.type==='asset'||a.type==='expense'||a.type==='draw'||a.type==='contraRevenue'),a=>Math.max(0,b[a.code]))+
 sum(accounts.filter(a=>a.type==='liability'||a.type==='equity'||a.type==='revenue'||a.type==='contraAsset'),a=>Math.max(0,-b[a.code]));
}
function fmtDateInput(d){return d.toISOString().slice(0,10)}
function renderDashboard(){
 const ins=sum(transactions.filter(t=>t.direction==='in'),t=>t.amount),outs=sum(transactions.filter(t=>t.direction==='out'),t=>t.amount);
 const bank=openingBankBalance+sum(transactions.filter(t=>t.account==='bank'),t=>t.direction==='in'?t.amount:-t.amount);
 const cash=openingCashBalance+sum(transactions.filter(t=>t.account==='cash'),t=>t.direction==='in'?t.amount:-t.amount);
 set('totalIn',money(ins));set('totalOut',money(outs));set('bankBalance',money(bank));set('cashBalance',money(cash));set('totalBalance',money(bank+cash));
 const s1=sum(sales.filter(s=>s.store===1&&s.type==='sale'),s=>s.amount),s2=sum(sales.filter(s=>s.store===2&&s.type==='sale'),s=>s.amount),ship=sum(sales.filter(s=>s.type==='shipping'),s=>s.amount);
 set('store1Total',money(s1));set('store2Total',money(s2));set('shippingTotal',money(ship));
 const p=calcPL();set('dashRevenue',money(p.revenue));set('dashCogs',money(p.cogs));set('dashExpenses',money(p.expenses));set('dashProfit',money(p.net));
 const realized=s1+s2, pct=Math.min(100,realized/monthlySalesTarget*100);set('salesProgressText',pct.toFixed(1)+'%');set('salesRealization',money(realized));set('salesTargetRemaining','Sisa target '+money(Math.max(0,monthlySalesTarget-realized)));$('salesProgressBar').style.width=pct+'%';
 const body=$('recentJournals');body.innerHTML=[...journals].sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id).slice(0,5).map(j=>`<tr><td>${dateFmt(j.date)}</td><td>${safe(j.ref)}</td><td>${safe(j.description)}</td><td>${money(j.amount)}</td><td>${money(j.amount)}</td><td><span class="type-pill in">Seimbang</span></td></tr>`).join('');
 renderCashflow();renderSales();renderInventory();renderJournal();renderReports();
}
function renderCashflow(){
 const incoming=sum(transactions.filter(t=>t.direction==='in'),t=>t.amount),outgoing=sum(transactions.filter(t=>t.direction==='out'),t=>t.amount);
 set('cashInPage',money(incoming));set('cashOutPage',money(outgoing));set('cashTotalPage',money(openingBankBalance+openingCashBalance+incoming-outgoing));
 const q=($('transactionSearch')?.value||'').toLowerCase();const rows=[...transactions].sort((a,b)=>b.date.localeCompare(a.date)).filter(t=>[t.description,t.category,t.account].join(' ').toLowerCase().includes(q));
 $('transactionsTable').innerHTML=rows.map(t=>`<tr><td>${dateFmt(t.date)}</td><td>${safe(t.description)}</td><td>${safe(t.category)}</td><td><span class="type-pill ${t.direction}">${t.direction==='in'?'Masuk':'Keluar'}</span></td><td>${t.account==='bank'?'Rekening pusat':'Kas tunai'}</td><td class="${t.direction==='in'?'amount-in':'amount-out'}">${money(t.amount)}</td></tr>`).join('')||'<tr><td colspan="6" class="empty-row">Belum ada transaksi.</td></tr>';
}
function renderSales(){
 const s1=sum(sales.filter(s=>s.store===1&&s.type==='sale'),s=>s.amount),s2=sum(sales.filter(s=>s.store===2&&s.type==='sale'),s=>s.amount),ship=sum(sales.filter(s=>s.type==='shipping'),s=>s.amount);
 set('salesStore1Page',money(s1));set('salesStore2Page',money(s2));set('salesShippingPage',money(ship));
 const total=s1+s2,pct=Math.min(100,total/monthlySalesTarget*100);set('salesPageProgress',pct.toFixed(1)+'%');set('salesPageTarget',money(monthlySalesTarget));set('salesPageRealization',money(total));set('salesPageRemaining',money(Math.max(0,monthlySalesTarget-total)));$('salesPageProgressBar').style.width=pct+'%';
 $('salesTable').innerHTML=[...sales].sort((a,b)=>b.date.localeCompare(a.date)).map(s=>`<tr><td>${dateFmt(s.date)}</td><td>Toko ${s.store}</td><td>${s.type==='shipping'?'Ongkir':'Penjualan barang'}</td><td>${safe(s.description)}</td><td>${money(s.amount)}</td></tr>`).join('');
}
function renderInventory(){
 const total=sum(inventory,i=>i.qty*i.cost);set('inventoryPageValue',money(total));set('inventoryPageCount',inventory.length+' barang');
 const q=($('inventorySearch')?.value||'').toLowerCase(),rows=inventory.filter(i=>(i.sku+' '+i.name).toLowerCase().includes(q));
 $('inventoryTable').innerHTML=rows.map(i=>`<tr><td>${safe(i.sku)}</td><td>${safe(i.name)}</td><td>${i.qty.toLocaleString('id-ID')}</td><td>${money(i.cost)}</td><td><strong>${money(i.qty*i.cost)}</strong></td></tr>`).join('')||'<tr><td colspan="5" class="empty-row">Belum ada barang.</td></tr>';
}
function renderJournal(){
 const q=($('journalSearch')?.value||'').toLowerCase(),rows=[...journals].sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id).filter(j=>(j.ref+' '+j.description+' '+acct(j.debit).name+' '+acct(j.credit).name).toLowerCase().includes(q));
 $('journalTable').innerHTML=rows.map(j=>`<tr><td>${dateFmt(j.date)}</td><td>${safe(j.ref)}</td><td>${safe(j.description)}</td><td>${safe(acct(j.debit).code+' · '+acct(j.debit).name)}</td><td>${safe(acct(j.credit).code+' · '+acct(j.credit).name)}</td><td>${money(j.amount)} = ${money(j.amount)}</td></tr>`).join('')||'<tr><td colspan="6" class="empty-row">Tidak ada jurnal yang cocok.</td></tr>';
 const debits=sum(journals,j=>j.amount),credits=sum(journals,j=>j.amount);set('journalDebits',money(debits));set('journalCredits',money(credits));set('journalBalanceStatus',Math.abs(debits-credits)<.01?'Seimbang':'Tidak seimbang');
 $('accountsTable').innerHTML=accounts.map(a=>`<tr><td>${a.code}</td><td>${safe(a.name)}</td><td>${({asset:'Aset',contraAsset:'Kontra aset',liability:'Kewajiban',equity:'Ekuitas',draw:'Prive',revenue:'Pendapatan',contraRevenue:'Kontra pendapatan',expense:'Beban'})[a.type]}</td><td>${a.normal}</td></tr>`).join('');
}
function line(label,value,indent=false){return `<div class="statement-line"><span class="${indent?'indent':''}">${safe(label)}</span><strong>${money(value)}</strong></div>`}
function renderReports(){
 const start=$('reportStart')?.value||'0000-00-00',end=$('reportEnd')?.value||'9999-12-31';
 const p=calcPL(end,start);set('profitPeriod',`${dateFmt(start)} – ${dateFmt(end)}`);
 $('profitLossLines').innerHTML=line('Pendapatan Penjualan Toko 1',accountBalances(end,start)['4010']*-1,true)+line('Pendapatan Penjualan Toko 2',accountBalances(end,start)['4020']*-1,true)+line('Pendapatan Ongkir',accountBalances(end,start)['4030']*-1,true)+line('Retur dan Potongan Penjualan',accountBalances(end,start)['4090'],true)+line('Total pendapatan bersih',p.revenue)+line('Harga Pokok Penjualan (HPP)',p.cogs)+line('Laba kotor',p.gross)+line('Beban gaji',accountBalances(end,start)['6010'])+line('Beban overhead',accountBalances(end,start)['6020'])+line('Beban dapur',accountBalances(end,start)['6030'])+line('Beban penyusutan',accountBalances(end,start)['6040'])+line('Beban lain-lain',accountBalances(end,start)['6050'])+line('Total beban operasional',p.expenses);
 set('netProfit',money(p.net));
 const b=allTimeBalances(end);
 const assetAccounts=accounts.filter(a=>a.type==='asset'||a.type==='contraAsset');
 const liabilityAccounts=accounts.filter(a=>a.type==='liability');
 const equityAccounts=accounts.filter(a=>a.type==='equity'||a.type==='draw');
 const assetValues=assetAccounts.map(a=>({a,v:b[a.code]}));
 const liabValues=liabilityAccounts.map(a=>({a,v:-b[a.code]}));
 const equityValues=equityAccounts.map(a=>({a,v:a.type==='draw'?-b[a.code]:-b[a.code]}));
 const currentPL=calcPL(end,'0000-00-00').net;
 const assets=sum(assetValues,x=>x.v),liabilities=sum(liabValues,x=>x.v),equity=sum(equityValues,x=>x.v)+currentPL;
 $('assetsLines').innerHTML=assetValues.map(x=>line(x.a.name,x.v,true)).join('');
 $('liabilitiesLines').innerHTML=liabValues.map(x=>line(x.a.name,x.v,true)).join('')+equityValues.map(x=>line(x.a.name,x.v,true)).join('')+line('Laba / (rugi) berjalan',currentPL,true);
 set('totalAssets',money(assets));set('totalLiabilitiesEquity',money(liabilities+equity));
 const diff=assets-(liabilities+equity),check=$('balanceCheck');
 check.textContent=Math.abs(diff)<.01?'Neraca seimbang berdasarkan jurnal demo.':'Neraca belum seimbang: selisih '+money(diff)+'. Periksa saldo awal, jurnal, dan pemetaan akun.';
 check.className='balance-check '+(Math.abs(diff)<.01?'ok':'error');
 const bank=b['1020']||0,cash=b['1010']||0;
 $('cashFlowLines').innerHTML=line('Saldo akhir akun Bank Pusat',bank)+line('Saldo akhir akun Kas Tunai',cash)+line('Total kas dan setara kas',bank+cash);
 const s1=sum(sales.filter(s=>s.store===1&&s.type==='sale'&&s.date>=start&&s.date<=end),s=>s.amount),s2=sum(sales.filter(s=>s.store===2&&s.type==='sale'&&s.date>=start&&s.date<=end),s=>s.amount),ship=sum(sales.filter(s=>s.type==='shipping'&&s.date>=start&&s.date<=end),s=>s.amount);
 $('reportSalesTable').innerHTML=`<tr><td>Penjualan Toko 1 (modul omzet)</td><td>${money(s1)}</td></tr><tr><td>Penjualan Toko 2 (modul omzet)</td><td>${money(s2)}</td></tr><tr><td>Pendapatan ongkir (modul omzet)</td><td>${money(ship)}</td></tr><tr><td><strong>Total omzet operasional</strong></td><td><strong>${money(s1+s2+ship)}</strong></td></tr>`;
}
function toast(msg){const n=$('toast');n.textContent=msg;n.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>n.classList.remove('show'),3000)}
function toggle(id,show){$(id).classList.toggle('hidden',!show);if(show)$(id).scrollIntoView({behavior:'smooth',block:'center'})}
function navigate(page){document.querySelectorAll('.page-section').forEach(s=>s.classList.toggle('active',s.id==='page-'+page));document.querySelectorAll('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.page===page));const titles={dashboard:'Ringkasan',cashflow:'Cashflow',sales:'Omzet & Penjualan',inventory:'Persediaan & HPP',journal:'Jurnal Umum',reports:'Laporan Keuangan'};set('pageTitle',titles[page]||'Ringkasan');window.scrollTo({top:0,behavior:'smooth'})}
function init(){
 set('todayDate',new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short',year:'numeric'}).format(new Date()));set('yearNow',new Date().getFullYear());
 const first=new Date();first.setDate(1);$('reportStart').value=fmtDateInput(first);$('reportEnd').value=dateOffset(0);$('journalDate').value=dateOffset(0);$('txDate').value=dateOffset(0);$('saleDate').value=dateOffset(0);
 const opts=accounts.map(a=>`<option value="${a.code}">${a.code} · ${safe(a.name)}</option>`).join('');$('debitAccount').innerHTML=opts;$('creditAccount').innerHTML=opts;$('debitAccount').value='1200';$('creditAccount').value='1020';
 document.querySelectorAll('.nav-link').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.page)));document.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.goto)));
 $('showTransactionForm').onclick=()=>toggle('transactionFormPanel',true);$('hideTransactionForm').onclick=$('cancelTransaction').onclick=()=>toggle('transactionFormPanel',false);
 $('showSalesForm').onclick=()=>toggle('salesFormPanel',true);$('hideSalesForm').onclick=$('cancelSales').onclick=()=>toggle('salesFormPanel',false);
 $('showInventoryForm').onclick=()=>toggle('inventoryFormPanel',true);$('hideInventoryForm').onclick=$('cancelInventory').onclick=()=>toggle('inventoryFormPanel',false);
 $('showJournalForm').onclick=()=>toggle('journalFormPanel',true);$('hideJournalForm').onclick=$('cancelJournal').onclick=()=>toggle('journalFormPanel',false);
 $('transactionSearch').oninput=renderCashflow;$('inventorySearch').oninput=renderInventory;$('journalSearch').oninput=renderJournal;
 $('applyReportFilter').onclick=()=>{if($('reportStart').value>$('reportEnd').value){toast('Tanggal awal melewati tanggal akhir.');return}renderReports();toast('Filter laporan diterapkan.')};
 $('printReport').onclick=()=>window.print();
 $('transactionForm').onsubmit=e=>{e.preventDefault();const amount=Number($('txAmount').value);if(amount<=0)return;transactions.push({id:Date.now(),date:$('txDate').value,direction:$('txDirection').value,account:$('txAccount').value,category:$('txCategory').value,description:$('txDescription').value.trim(),amount});e.target.reset();$('txDate').value=dateOffset(0);toggle('transactionFormPanel',false);renderDashboard();toast('Cashflow demo ditambahkan; belum membuat jurnal.')};
 $('salesForm').onsubmit=e=>{e.preventDefault();const amount=Number($('saleAmount').value);if(amount<=0)return;sales.push({id:Date.now(),date:$('saleDate').value,store:Number($('saleStore').value),type:$('saleType').value,description:$('saleDescription').value.trim(),amount});e.target.reset();$('saleDate').value=dateOffset(0);toggle('salesFormPanel',false);renderDashboard();toast('Data omzet demo ditambahkan; belum membuat jurnal.')};
 $('inventoryForm').onsubmit=e=>{e.preventDefault();const sku=$('itemSku').value.trim(),name=$('itemName').value.trim(),qty=Number($('itemQty').value),cost=Number($('itemCost').value);if(!sku||!name||qty<0||cost<0)return;const old=inventory.find(i=>i.sku.toLowerCase()===sku.toLowerCase());if(old){old.name=name;old.qty=qty;old.cost=cost}else inventory.push({sku,name,qty,cost});e.target.reset();$('itemQty').value='0';$('itemCost').value='0';toggle('inventoryFormPanel',false);renderDashboard();toast('Barang demo ditambahkan; belum membuat jurnal stok.')};
 $('journalForm').onsubmit=e=>{e.preventDefault();const amount=Number($('journalAmount').value),debit=$('debitAccount').value,credit=$('creditAccount').value;if(amount<=0){toast('Nominal harus lebih besar dari nol.');return}if(debit===credit){toast('Akun debit dan kredit tidak boleh sama.');return}const ref=$('journalRef').value.trim();if(journals.some(j=>j.ref.toLowerCase()===ref.toLowerCase())){toast('Nomor bukti sudah dipakai.');return}journals.push({id:Date.now(),date:$('journalDate').value,ref,description:$('journalDescription').value.trim(),debit,credit,amount});e.target.reset();$('journalDate').value=dateOffset(0);$('debitAccount').value='1200';$('creditAccount').value='1020';toggle('journalFormPanel',false);renderDashboard();toast('Jurnal demo tersimpan dan seimbang. Hilang setelah refresh.')};
 renderDashboard();
}
document.addEventListener('DOMContentLoaded',init);
