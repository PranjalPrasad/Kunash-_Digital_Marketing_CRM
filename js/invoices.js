/* Invoices & payments page only. Sample data: replace `I` with API data later. */
(function () {
  const A = window.AdDesk, $ = (s) => document.querySelector(s);
  const ic = (n, c = 'h-4 w-4') => `<i data-lucide="${n}" class="${c}"></i>`;
  const TODAY = '2026-11-18', PAGE = 8, ME = 'John Doe';
  const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
  const fd = (i) => new Date(i + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const fs = (i) => new Date(i + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const days = (a, b) => Math.round((new Date(a + 'T00:00:00') - new Date(b + 'T00:00:00')) / 864e5);
  A.clients = ['Sharma Garments', 'Kapoor Jewellers', 'Urban Brew Café', 'FitZone Gym', 'Glow Salon', 'Green Basket', 'Bright Smiles Dental', 'Nest Interiors', 'EduSpark Classes', 'Zenith Motors', 'Royal Tiffin'];

  /* no, client, issued, due, items [desc, qty, rate], gst %, payments [date, amount, mode, ref], flag */
  const mk = (no, client, issued, due, items, gst, pays = [], flag = '') => ({
    id: no, no, client, issued, due, items: items.map(([desc, qty, rate]) => ({ desc, qty, rate })), gst, note: '', flag,
    pays: pays.map(([date, amount, mode, ref]) => ({ date, amount, mode, ref, by: ME })),
    log: [[ME, flag === 'draft' ? 'Created the invoice as a draft' : 'Created and sent the invoice', fs(issued)]],
  });
  let I = [
    mk(148, 'Sharma Garments', '2026-11-10', '2026-11-25', [['Premium retainer, Nov 2026', 1, 60000]], 18),
    mk(147, 'Zenith Motors', '2026-11-05', '2026-11-20', [['Premium retainer, Nov 2026', 1, 60000]], 18, [['2026-11-12', 26000, 'Bank transfer', 'UTR4021']]),
    mk(146, 'Nest Interiors', '2026-11-03', '2026-11-22', [['Growth retainer, Nov 2026', 1, 30000]], 18, [['2026-11-10', 17400, 'UPI', 'UPI8832']]),
    mk(142, 'Urban Brew Café', '2026-10-25', '2026-11-09', [['Growth retainer, Oct 2026', 1, 30000]], 18, [['2026-10-30', 3000, 'UPI', '']]),
    mk(143, 'FitZone Gym', '2026-10-28', '2026-11-12', [['Growth retainer, Oct 2026', 1, 30000]], 18, [['2026-11-02', 9400, 'Cash', '']]),
    mk(149, 'Glow Salon', '2026-11-12', '2026-11-27', [['Starter retainer, Nov 2026', 1, 15000]], 18, [['2026-11-15', 17700, 'UPI', 'UPI9921']]),
    mk(150, 'Kapoor Jewellers', '2026-11-01', '2026-11-16', [['Premium retainer, Nov 2026', 1, 60000]], 18, [['2026-11-08', 70800, 'Bank transfer', 'UTR3310']]),
    mk(144, 'Green Basket', '2026-10-30', '2026-11-14', [['Growth retainer, Oct 2026', 1, 30000]], 18, [['2026-11-05', 35400, 'Cheque', 'CHQ0912']]),
    mk(145, 'EduSpark Classes', '2026-11-01', '2026-11-16', [['Growth retainer, Nov 2026', 1, 30000]], 18, [['2026-11-14', 35400, 'UPI', 'UPI7710']]),
    mk(141, 'Bright Smiles Dental', '2026-10-20', '2026-11-04', [['Starter retainer, Oct 2026', 1, 15000]], 18, [['2026-11-01', 17700, 'UPI', 'UPI6620']]),
    mk(140, 'Sharma Garments', '2026-10-10', '2026-10-25', [['Premium retainer, Oct 2026', 1, 60000]], 18, [['2026-10-22', 70800, 'Bank transfer', 'UTR2290']]),
    mk(139, 'Kapoor Jewellers', '2026-10-01', '2026-10-16', [['Premium retainer, Oct 2026', 1, 60000]], 18, [['2026-10-12', 70800, 'Bank transfer', 'UTR2105']]),
    mk(151, 'Glow Salon', '2026-11-18', '2026-12-03', [['Starter retainer, Dec 2026', 1, 15000]], 18, [], 'draft'),
    mk(138, 'Royal Tiffin', '2026-09-15', '2026-09-30', [['Starter retainer, Sep 2026', 1, 15000]], 18, [], 'cancelled'),
  ];
  const find = (id) => I.find((x) => x.id === +id);

  /* Money and status are always worked out from items, payments and dates */
  const sub = (x) => x.items.reduce((t, i) => t + i.qty * i.rate, 0), tax = (x) => (sub(x) * x.gst) / 100, total = (x) => sub(x) + tax(x);
  const paid = (x) => x.pays.reduce((t, p) => t + p.amount, 0), bal = (x) => (x.flag ? 0 : Math.max(total(x) - paid(x), 0));
  const status = (x) => (x.flag === 'cancelled' ? 'Cancelled' : x.flag === 'draft' ? 'Draft' : bal(x) <= 0 ? 'Paid' : x.due < TODAY ? 'Overdue' : paid(x) > 0 ? 'Partially paid' : 'Sent');
  const owing = (x) => ['Sent', 'Partially paid', 'Overdue'].includes(status(x));
  const label = (x) => 'INV-' + String(x.no).padStart(4, '0');
  const log = (x, text) => x.log.unshift([ME, text, 'Just now']);
  $('#fc').innerHTML = '<option value="">All clients</option>' + A.clients.map((n) => `<option>${n}</option>`).join('');

  const SS = { Paid: '', Sent: 'background:var(--soft);color:var(--or)', 'Partially paid': 'am', Overdue: 'dn', Draft: 'g', Cancelled: 'g' };
  const chip = (s) => { const v = SS[s]; return v === 'am' || v === 'dn' ? `<span class="chip whitespace-nowrap ${v}">${s}</span>` : `<span class="chip whitespace-nowrap" ${v === 'g' ? 'style="background:var(--hover);color:var(--mute)"' : v ? `style="${v}"` : ''}>${s}</span>`; };
  const ib = (act, id, icon, lbl) => `<button class="ibtn" data-act="${act}" data-id="${id}" aria-label="${lbl}" title="${lbl}">${ic(icon, 'h-3.5 w-3.5')}</button>`;
  const actions = (x) => { const s = status(x); return ib('view', x.id, 'eye', 'View') + (owing(x) ? ib('pay', x.id, 'wallet', 'Record payment') + ib('remind', x.id, 'bell-ring', 'Send reminder') : s === 'Draft' ? ib('send', x.id, 'send', 'Send invoice') : ''); };
  const amountCell = (x) => { const t = total(x), p = Math.min(paid(x), t), pc = t ? Math.round((p / t) * 100) : 0; return `<div class="min-w-[110px]"><b class="whitespace-nowrap">${inr(t)}</b><div class="mt-1 h-1.5 overflow-hidden rounded-full bg-hov"><div class="h-full rounded-full ${status(x) === 'Overdue' ? 'bg-[var(--red)]' : 'bg-brand'}" style="width:${pc}%"></div></div><div class="truncate text-[11px] ${status(x) === 'Overdue' ? 'text-[var(--red)]' : 'text-mute'}">${x.flag ? '-' : bal(x) > 0 ? 'Balance ' + inr(bal(x)) : 'Paid in full'}</div></div>`; };
  const dueTxt = (x) => { const s = status(x); return owing(x) && s === 'Overdue' ? `<span class="font-medium text-[var(--red)]">${fs(x.due)}</span><div class="text-[11px] text-[var(--red)]">${days(TODAY, x.due)} days late</div>` : `<span>${fs(x.due)}</span>`; };

  const st = { tab: 'All', q: '', c: '', so: 'new', page: 1, view: 'table', narrow: false };
  const TABS = ['All', 'Draft', 'Sent', 'Partially paid', 'Overdue', 'Paid'];
  const base = () => { const q = st.q.trim().toLowerCase(); return I.filter((x) => (!q || label(x).toLowerCase().includes(q) || x.client.toLowerCase().includes(q)) && (!st.c || x.client === st.c)); };
  function filtered() {
    const by = { new: (a, b) => b.issued.localeCompare(a.issued) || b.no - a.no, due: (a, b) => a.due.localeCompare(b.due), amt: (a, b) => total(b) - total(a), bal: (a, b) => bal(b) - bal(a) };
    return base().filter((x) => st.tab === 'All' || status(x) === st.tab).sort(by[st.so]);
  }

  function summary() {
    const live = I.filter((x) => !x.flag), since = '2026-10-19';
    const billed = live.filter((x) => x.issued >= since).reduce((t, x) => t + total(x), 0), coll = I.flatMap((x) => x.pays).filter((p) => p.date >= since).reduce((t, p) => t + p.amount, 0);
    const out = I.filter(owing), od = I.filter((x) => status(x) === 'Overdue');
    const paidInv = I.filter((x) => status(x) === 'Paid' && x.pays.length), avg = paidInv.length ? Math.round(paidInv.reduce((t, x) => t + days(x.pays[x.pays.length - 1].date, x.issued), 0) / paidInv.length) : 0;
    const K = [['file-text', 'Billed (30 days)', inr(billed)], ['circle-check', 'Collected (30 days)', inr(coll)], ['hourglass', 'Outstanding', inr(out.reduce((t, x) => t + bal(x), 0))], ['alert-triangle', `Overdue (${od.length})`, inr(od.reduce((t, x) => t + bal(x), 0))], ['timer', 'Avg days to pay', avg + ' days']];
    $('#kpis').innerHTML = K.map(([i, l, v]) => `<div class="card flex min-w-0 items-center gap-2.5 p-3"><div class="ico">${ic(i)}</div><div class="min-w-0"><div class="ttl">${l}</div><div class="truncate text-lg font-bold leading-tight">${v}</div></div></div>`).join('');
    $('#alert').innerHTML = od.length ? `<div class="flex flex-wrap items-center gap-2 rounded-xl bg-[var(--redbg)] px-3 py-2.5 text-[13px] text-[var(--red)]"><span class="shrink-0">${ic('alert-triangle')}</span><span class="min-w-0 flex-1"><b>${od.length} invoice${od.length > 1 ? 's are' : ' is'} overdue</b>, ${inr(od.reduce((t, x) => t + bal(x), 0))} to collect. Send a reminder or record the payment if it was received.</span><button class="btn-o shrink-0 bg-card" data-tab="Overdue">Show overdue</button></div>` : '';
    const b = base();
    $('#tabs').innerHTML = TABS.map((t) => { const n = t === 'All' ? b.length : b.filter((x) => status(x) === t).length, on = st.tab === t; return `<button role="tab" aria-selected="${on}" data-tab="${t}" class="-mb-px shrink-0 whitespace-nowrap border-b-2 px-3 pb-2 text-xs font-medium ${on ? 'border-brand text-ink' : 'border-transparent text-mute hover:text-ink'}">${t} <span class="ml-0.5 text-[11px] text-mute">${n}</span></button>`; }).join('');
  }

  function render() {
    summary();
    const rows = filtered(), pages = Math.max(1, Math.ceil(rows.length / PAGE));
    st.page = Math.min(st.page, pages);
    const sl = rows.slice((st.page - 1) * PAGE, st.page * PAGE), cards = st.narrow || st.view === 'cards';
    $('#vt').classList.toggle('hidden', st.narrow);
    document.querySelectorAll('#vt button').forEach((b) => { const on = b.dataset.v === (cards ? 'cards' : 'table'); b.classList.toggle('bg-card', on); b.classList.toggle('shadow-sm', on); b.classList.toggle('text-mute', !on); });
    if (!sl.length) {
      $('#list').innerHTML = `<div class="grid place-items-center gap-2 px-4 py-12 text-center"><div class="ico">${ic('search-x')}</div><b>No invoices found</b><span class="text-xs text-mute">Change the filters or create a new invoice.</span><button class="btn-o" data-act="clear">Clear filters</button></div>`;
    } else if (cards) {
      $('#list').innerHTML = `<div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-3 p-3">${sl.map((x) => `
        <div class="min-w-0 rounded-xl border border-line p-3"><div class="flex min-w-0 items-start gap-2"><div class="min-w-0 flex-1"><b class="block truncate text-[13px]">${label(x)}</b><span class="block truncate text-xs text-mute">${x.client}</span></div>${chip(status(x))}</div>
          <div class="mt-3">${amountCell(x)}</div>
          <div class="mt-3 flex items-center justify-between gap-2"><span class="min-w-0 truncate text-xs text-mute">Due ${fs(x.due)}</span><div class="flex shrink-0 gap-1.5">${actions(x)}</div></div></div>`).join('')}</div>`;
    } else {
      $('#list').innerHTML = `<div class="overflow-x-auto"><table class="w-full min-w-[820px] text-[13px]"><thead><tr class="text-left text-xs text-mute"><th class="py-2 pl-3 pr-2 font-medium">Invoice</th><th class="px-2 font-medium">Issued</th><th class="px-2 font-medium">Due</th><th class="px-2 font-medium">Amount</th><th class="px-2 font-medium">Status</th><th class="py-2 pl-2 pr-3 text-right font-medium">Actions</th></tr></thead><tbody>${sl.map((x) => `
        <tr class="border-t border-line hover:bg-hov/50"><td class="max-w-[230px] py-2 pl-3 pr-2"><b class="block truncate">${label(x)}</b><span class="block truncate text-xs text-mute">${x.client}</span></td>
          <td class="whitespace-nowrap px-2 text-xs">${fs(x.issued)}</td><td class="whitespace-nowrap px-2 text-xs">${dueTxt(x)}</td><td class="px-2">${amountCell(x)}</td><td class="px-2">${chip(status(x))}</td>
          <td class="py-2 pl-2 pr-3"><div class="flex justify-end gap-1.5">${actions(x)}</div></td></tr>`).join('')}</tbody></table></div>`;
    }
    const from = rows.length ? (st.page - 1) * PAGE + 1 : 0;
    $('#pager').innerHTML = `<span>Showing ${from}–${Math.min(st.page * PAGE, rows.length)} of ${rows.length} invoices</span><div class="flex items-center gap-2"><button class="ibtn disabled:opacity-40" data-act="prev" aria-label="Previous page" ${st.page <= 1 ? 'disabled' : ''}>${ic('chevron-left', 'h-3.5 w-3.5')}</button><span>Page ${st.page} of ${pages}</span><button class="ibtn disabled:opacity-40" data-act="next" aria-label="Next page" ${st.page >= pages ? 'disabled' : ''}>${ic('chevron-right', 'h-3.5 w-3.5')}</button></div>`;
    A.icons();
  }

  /* Invoice view: centered overlay, can be printed or saved as PDF */
  function closeDetail() { const d = $('#detail'); if (d) d.remove(); document.body.classList.remove('overflow-hidden'); }
  function detail(id) {
    const x = find(id); if (!x) return;
    closeDetail();
    const s = status(x);
    const row = (k, v) => `<div class="grid grid-cols-[88px_minmax(0,1fr)] gap-2 py-1.5 text-[13px]"><span class="text-mute">${k}</span><span class="min-w-0 break-words font-medium">${v}</span></div>`;
    const tot = (k, v, b) => `<div class="flex justify-between gap-3 py-1 text-[13px] ${b ? 'border-t border-line pt-2 text-sm font-bold' : ''}"><span class="${b ? '' : 'text-mute'}">${k}</span><span class="whitespace-nowrap">${v}</span></div>`;
    const note = s === 'Overdue' ? `<div class="flex items-center gap-1.5 rounded-lg bg-[var(--redbg)] p-3 text-[13px] font-semibold text-[var(--red)]">${ic('alert-triangle')}Overdue by ${days(TODAY, x.due)} days. Balance ${inr(bal(x))}.</div>` : s === 'Paid' ? `<div class="flex items-center gap-1.5 rounded-lg bg-[var(--grnbg)] p-3 text-[13px] font-semibold text-[var(--grn)]">${ic('circle-check')}Paid in full</div>` : s === 'Cancelled' ? `<div class="rounded-lg bg-[var(--hover)] p-3 text-[13px] font-semibold text-mute">This invoice was cancelled.</div>` : '';
    const B = (act, lbl, icon, cls) => `<button class="${cls}" data-act="${act}" data-id="${x.id}">${ic(icon, 'h-3.5 w-3.5')}${lbl}</button>`;
    const btns = [];
    if (owing(x)) btns.push(B('pay', 'Record payment', 'wallet', 'btn-p'), B('remind', 'Send reminder', 'bell-ring', 'btn-o'));
    if (s === 'Draft') btns.push(B('send', 'Send invoice', 'send', 'btn-p'), B('edit', 'Edit', 'pencil', 'btn-o'));
    btns.push(B('print', 'Print / PDF', 'printer', 'btn-o'));
    if (s !== 'Cancelled' && s !== 'Paid') btns.push(B('cancel', 'Cancel invoice', 'ban', 'btn-d ml-auto'));
    const el = document.createElement('div');
    el.id = 'detail'; el.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6';
    el.innerHTML = `<div role="dialog" aria-modal="true" aria-label="Invoice" class="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl sm:max-h-[90dvh]">
      <div class="flex shrink-0 items-center gap-2.5 border-b border-line p-4"><div class="min-w-0 flex-1"><h2 class="truncate text-base font-semibold">${label(x)}</h2><span class="block truncate text-xs text-mute">${x.client}</span></div>${chip(s)}<button data-close aria-label="Close" class="ibtn no-print">${ic('x')}</button></div>
      <div class="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        ${note}
        <div class="divide-y divide-line">${row('Billed to', x.client)}${row('Issued', fd(x.issued))}${row('Due', fd(x.due))}</div>
        <div class="overflow-x-auto"><table class="w-full min-w-[360px] text-[13px]"><thead><tr class="text-left text-xs text-mute"><th class="py-1.5 pr-2 font-medium">Description</th><th class="px-2 font-medium">Qty</th><th class="px-2 font-medium">Rate</th><th class="py-1.5 pl-2 text-right font-medium">Amount</th></tr></thead><tbody>${x.items.map((i) => `<tr class="border-t border-line"><td class="py-2 pr-2">${i.desc}</td><td class="px-2">${i.qty}</td><td class="whitespace-nowrap px-2">${inr(i.rate)}</td><td class="whitespace-nowrap py-2 pl-2 text-right">${inr(i.qty * i.rate)}</td></tr>`).join('')}</tbody></table></div>
        <div class="rounded-lg bg-bg p-3">${tot('Subtotal', inr(sub(x)))}${tot(x.gst ? 'GST ' + x.gst + '%' : 'GST', inr(tax(x)))}${tot('Total', inr(total(x)), 1)}${tot('Paid', inr(paid(x)))}${tot('Balance due', inr(bal(x)), 1)}</div>
        ${x.note ? `<p class="break-words text-[13px] text-mute">${x.note}</p>` : ''}
        <div><h3 class="mb-2 text-xs font-semibold text-mute">Payments</h3>${x.pays.length ? `<div class="space-y-2">${x.pays.map((p) => `<div class="flex min-w-0 items-center gap-2 text-[13px]"><span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[var(--grnbg)] text-[var(--grn)]">${ic('indian-rupee', 'h-3.5 w-3.5')}</span><div class="min-w-0 flex-1"><b class="block">${inr(p.amount)}</b><span class="block truncate text-xs text-mute">${p.mode}${p.ref ? ', ' + p.ref : ''}</span></div><span class="shrink-0 text-xs text-mute">${fs(p.date)}</span></div>`).join('')}</div>` : '<p class="text-[13px] text-mute">No payments recorded yet.</p>'}</div>
        <div class="no-print"><h3 class="mb-2 text-xs font-semibold text-mute">Activity</h3><div class="space-y-2.5">${x.log.map(([who, text, when]) => `<div class="flex gap-2.5 text-[13px]"><span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand"></span><div class="min-w-0"><div class="break-words">${text}</div><div class="text-xs text-mute">${who}, ${when}</div></div></div>`).join('')}</div></div>
      </div>
      <div class="no-print flex shrink-0 flex-wrap gap-2 border-t border-line p-3">${btns.join('')}</div></div>`;
    el.addEventListener('click', (e) => { if (e.target === el || e.target.closest('[data-close]')) closeDetail(); });
    document.body.append(el); document.body.classList.add('overflow-hidden'); A.icons();
  }
  const refresh = (id) => { render(); if ($('#detail')) (find(id) ? detail(id) : closeDetail()); };

  function exportCsv() {
    const rows = filtered(), esc = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
    const csv = [['Invoice', 'Client', 'Issued', 'Due', 'Subtotal', 'GST', 'Total', 'Paid', 'Balance', 'Status'], ...rows.map((x) => [label(x), x.client, x.issued, x.due, sub(x), tax(x), total(x), paid(x), bal(x), status(x)])].map((r) => r.map(esc).join(',')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'invoices.csv'; document.body.append(a); a.click(); a.remove();
    A.toast(`Exported ${rows.length} invoices`);
  }

  /* Clicks */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-tab]'); if (t) { st.tab = t.dataset.tab; st.page = 1; render(); return; }
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act, x = find(b.dataset.id);
    if (a === 'csv') exportCsv();
    else if (a === 'view') detail(x.id);
    else if (a === 'print') window.print();
    else if (a === 'pay') A.openForm('payment', { id: x.id, invoice: label(x) + ', ' + x.client, balance: inr(bal(x)), amount: Math.round(bal(x)), date: TODAY, mode: 'UPI' });
    else if (a === 'remind') A.openForm('remind', { id: x.id, client: x.client, msg: `Hello, invoice ${label(x)} for ${inr(bal(x))} ${status(x) === 'Overdue' ? 'was due on ' + fs(x.due) : 'is due on ' + fs(x.due)}. Please arrange the payment. Thank you.` });
    else if (a === 'send') { x.flag = ''; log(x, 'Sent the invoice to the client'); A.toast(label(x) + ' sent to ' + x.client); refresh(x.id); }
    else if (a === 'edit') { const i = x.items[0]; A.openForm('invoiceEdit', { id: x.id, client: x.client, due: x.due, desc: i.desc, qty: i.qty, rate: i.rate, gst: x.gst ? x.gst + '%' : 'No GST', note: x.note }); }
    else if (a === 'cancel') A.openForm('invoiceCancel', { id: x.id, invoice: label(x) + ', ' + x.client });
    else if (a === 'prev') { st.page--; render(); } else if (a === 'next') { st.page++; render(); }
    else if (a === 'clear') { Object.assign(st, { tab: 'All', q: '', c: '', page: 1 }); $('#q').value = ''; $('#fc').value = ''; render(); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !e.defaultPrevented) closeDetail(); });
  const bind = (id, key, ev = 'change') => $(id).addEventListener(ev, (e) => { st[key] = e.target.value; st.page = 1; render(); });
  bind('#q', 'q', 'input'); bind('#fc', 'c'); bind('#so', 'so');
  $('#vt').onclick = (e) => { const b = e.target.closest('button'); if (b) { st.view = b.dataset.v; render(); } };

  /* Overlay forms */
  const gstOf = (g) => (g === 'No GST' ? 0 : parseInt(g, 10));
  document.addEventListener('form:saved', ({ detail: { key, data, vals } }) => {
    const x = vals && vals.id ? find(vals.id) : null;
    if (key === 'invoice') {
      const no = Math.max(0, ...I.map((i) => i.no)) + 1, send = data.action === 'Create and send';
      const n = mk(no, data.client, TODAY, data.due, [[data.desc, +data.qty || 1, +data.rate || 0]], gstOf(data.gst), [], send ? '' : 'draft');
      n.note = data.note || ''; n.log = [[ME, send ? 'Created and sent the invoice' : 'Created the invoice as a draft', 'Just now']];
      I.unshift(n); Object.assign(st, { tab: 'All', so: 'new', page: 1 }); $('#so').value = 'new';
      if (send) A.toast(label(n) + ' sent to ' + data.client);
    } else if (key === 'invoiceEdit' && x) {
      Object.assign(x, { client: data.client, due: data.due, gst: gstOf(data.gst), note: data.note || '', items: [{ desc: data.desc, qty: +data.qty || 1, rate: +data.rate || 0 }] }); log(x, 'Edited the draft');
    } else if (key === 'payment' && x) {
      const amt = +data.amount;
      if (!(amt > 0) || amt > Math.round(bal(x))) { A.toast('Payment not saved: enter an amount up to ' + inr(bal(x))); return; }
      x.pays.push({ date: data.date, amount: amt, mode: data.mode, ref: data.ref || '', by: ME });
      log(x, `Recorded ${inr(amt)} via ${data.mode}${data.ref ? ' (' + data.ref + ')' : ''}${bal(x) <= 0 ? '. Invoice is now paid.' : ''}`);
      A.toast(bal(x) <= 0 ? label(x) + ' paid in full' : 'Payment recorded. Balance ' + inr(bal(x)));
    } else if (key === 'invoiceCancel' && x) { x.flag = 'cancelled'; log(x, 'Cancelled: ' + data.reason + (data.note ? ' (' + data.note + ')' : '')); }
    else if (key === 'remind' && x) log(x, 'Payment reminder sent to client');
    else return;
    refresh(x ? x.id : undefined);
  });

  const cq = document.querySelector('.cq');
  new ResizeObserver(() => { const n = cq.clientWidth < 720; if (n !== st.narrow) { st.narrow = n; render(); } }).observe(cq);
  st.narrow = cq.clientWidth < 720;
  render();
})();