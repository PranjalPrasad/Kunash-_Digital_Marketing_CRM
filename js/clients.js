/* Clients page: client table (with product & price columns) + full client view in one place.
   Data comes from js/data.js (sample). Replace `C` and A.data with API data later. */
(function () {
  const A = window.AdDesk, D = A.data, $ = (s) => document.querySelector(s);
  const ic = (n, c = 'h-4 w-4') => `<i data-lucide="${n}" class="${c}"></i>`;
  const AV = (n) => n.split(' ').map((w) => w[0]).slice(0, 2).join('');
  const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
  const L = (n) => (n >= 100000 ? '₹' + +(n / 100000).toFixed(2) + 'L' : inr(n));
  const fd = (i) => (i ? new Date(i + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '-');
  const FEE = { Starter: 15000, Growth: 30000, Premium: 60000 };
  const PAGE = 8, TODAY = '2026-11-18';

  /* Channels: s = ok | reconnect | none. LinkedIn "Posting only" = we only post on their page, no ads. */
  const WA = [1, 3, 5, 7], IG = [1, 2, 3, 5], LI = { 2: 'Posting only', 8: 'Posting only', 10: 'Posting only', 12: 'Posting + ads', 13: 'Posting only' };
  const SCOPE = { 2: 'Ads + social posting', 8: 'Ads + social posting', 10: 'Ads + social posting', 12: 'Ads + social posting', 13: 'Social posting only' };
  const FULL = 'Full ad management', POST = 'Social posting only';
  const mk = (id, name, ind, contact, plan, manager, status, pending, meta, google, since) => {
    const slug = name.toLowerCase().replace(/[^a-z]/g, ''), partner = id % 3 === 0;
    return { id, name, ind, contact, plan, manager, status, pending, since, scope: SCOPE[id] || FULL, pay: id % 2 ? 'Monthly UPI AutoPay' : 'Bank transfer', docs: [['Service agreement signed', true], ['Access authorisation letter', id % 4 !== 0], ['Client GSTIN on file', id % 3 !== 1]], phone: '+91 98220 1' + String(1000 + id * 37).slice(-4), email: contact.split(' ').pop().toLowerCase() + '@' + slug + '.in', website: slug + '.in',
      ads: A.people.ads[id % 2], designer: A.people.designer[id % 2],
      ch: { meta: { s: meta, mode: meta === 'none' ? '' : partner ? 'Partner access (Business Manager)' : 'Client login (OAuth)', acct: meta === 'none' ? '' : 'act_' + (4100000 + id * 7919), exp: meta === 'ok' && !partner ? 10 + ((id * 17) % 50) : 0 },
        google: { s: google, cid: google === 'none' ? '' : '123-456-' + (7000 + id * 13) }, mc: { s: google === 'ok' ? 'ok' : 'none', id: google === 'ok' ? 'MC-' + (5200000 + id * 131) : '' },
        wa: { s: WA.includes(id) ? 'ok' : 'none', num: WA.includes(id) ? '+91 98220 1' + String(1000 + id * 37).slice(-4) : '' },
        li: { s: LI[id] ? 'ok' : 'none', scope: LI[id] || '' }, ig: { s: IG.includes(id) ? 'ok' : 'none', handle: IG.includes(id) ? '@' + slug : '' } } };
  };
  let C = [
    mk(1, 'Sharma Garments', 'Fashion retail', 'Rakesh Sharma', 'Premium', 'Riya Shah', 'Active', 0, 'ok', 'ok', 'Mar 2025'),
    mk(2, 'Kapoor Jewellers', 'Jewellery', 'Anita Kapoor', 'Premium', 'Kabir Jain', 'Active', 0, 'ok', 'none', 'Jan 2025'),
    mk(3, 'Urban Brew Café', 'Food and beverage', 'Vikram Nair', 'Growth', 'Neha Rao', 'Active', 32400, 'ok', 'ok', 'Jun 2025'),
    mk(4, 'FitZone Gym', 'Fitness', 'Sandeep Patil', 'Growth', 'Riya Shah', 'Active', 26000, 'reconnect', 'none', 'Aug 2025'),
    mk(5, 'Glow Salon', 'Beauty', 'Pooja Desai', 'Starter', 'Neha Rao', 'Active', 0, 'ok', 'none', 'Sep 2025'),
    mk(6, 'Green Basket', 'Grocery', 'Imran Shaikh', 'Growth', 'Kabir Jain', 'Active', 0, 'ok', 'ok', 'Oct 2025'),
    mk(7, 'Bright Smiles Dental', 'Healthcare', 'Meera Joshi', 'Starter', 'Riya Shah', 'Active', 0, 'ok', 'none', 'Nov 2025'),
    mk(8, 'Nest Interiors', 'Home decor', 'Karan Malhotra', 'Growth', 'Kabir Jain', 'Active', 18000, 'ok', 'reconnect', 'Dec 2025'),
    mk(9, 'Pune Pedal Cycles', 'Retail', 'Sachin More', 'Starter', 'Neha Rao', 'Inactive', 0, 'none', 'none', 'Feb 2025'),
    mk(10, 'EduSpark Classes', 'Education', 'Priya Kulkarni', 'Growth', 'Riya Shah', 'Active', 0, 'ok', 'none', 'Mar 2026'),
    mk(11, 'Royal Tiffin', 'Food delivery', 'Manoj Gaikwad', 'Starter', 'Kabir Jain', 'Inactive', 0, 'none', 'none', 'Apr 2025'),
    mk(12, 'Zenith Motors', 'Automotive', 'Rohit Bhosale', 'Premium', 'Neha Rao', 'Active', 0, 'ok', 'ok', 'May 2026'),
    mk(13, 'Heritage Patsanstha', 'Co-operative credit society', 'Suresh Kale', 'Starter', 'Kabir Jain', 'Active', 0, 'none', 'none', 'Nov 2026'),
  ];
  const find = (id) => C.find((c) => c.id === +id);
  const byName = (n) => C.find((c) => c.name === n);
  const nextId = (a) => Math.max(0, ...a.map((x) => x.id || 0)) + 1;
  const syncNames = () => { A.clients = C.map((c) => c.name); };
  syncNames();
  $('#fm').innerHTML = '<option value="">All managers</option>' + A.people.manager.map((m) => `<option>${m}</option>`).join('');

  /* Everything that belongs to one client, from the shared data */
  const eff = (p) => p.offer || p.price, disc = (p) => (p.offer ? Math.round((1 - p.offer / p.price) * 100) : 0);
  const S = (c) => {
    const f = (a) => a.filter((x) => x.client === c.name), prods = f(D.products), camps = f(D.campaigns), ef = prods.map(eff);
    return { prods, camps, leads: f(D.leads), crs: f(D.creatives), spend: camps.reduce((t, x) => t + x.spent, 0), leadN: camps.reduce((t, x) => t + x.leads, 0),
      out: prods.reduce((t, p) => t + p.creatives.filter((x) => x.s === 'out').length, 0), offers: prods.filter((p) => p.offer).length, maxd: Math.max(0, ...prods.map(disc)),
      chg: prods.filter((p) => p.recent).length, lo: Math.min(...ef), hi: Math.max(...ef) };
  };
  const attention = (c) => c.status === 'Active' && (c.ch.meta.s === 'reconnect' || c.ch.google.s === 'reconnect' || c.pending > 0 || S(c).out > 0);

  /* UI helpers */
  const GREY = 'style="background:var(--hover);color:var(--mute)"', ORG = 'style="background:var(--soft);color:var(--or)"';
  const chip = (t, k = '') => `<span class="chip whitespace-nowrap ${/^(am|dn)$/.test(k) ? k : ''}" ${k === 'g' ? GREY : k === 'o' ? ORG : ''}>${t}</span>`;
  const SC = { Active: '', Paused: 'am', Draft: 'g', Completed: 'g', Scheduled: 'o', 'Pending approval': 'o', New: 'o', Contacted: 'am', Qualified: '', Won: '', Lost: 'dn', Approved: '', 'Waiting for approval': 'o', 'Changes requested': 'am', Outdated: 'dn', Inactive: 'g' };
  const sc = (s) => chip(s, SC[s]);
  const empty = (m) => `<div class="rounded-xl border border-dashed border-line p-6 text-center text-xs text-mute">${m}</div>`;
  const tbl = (head, rows, min, msg) => rows.length ? `<div class="overflow-x-auto rounded-xl border border-line"><table class="w-full min-w-[${min}px] text-[13px]"><thead><tr class="text-left text-xs text-mute">${head.map((h, i) => `<th class="py-2 ${i ? 'px-2' : 'pl-3 pr-2'} whitespace-nowrap font-medium">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr class="border-t border-line">${r.map((x, i) => `<td class="py-2 ${i ? 'px-2' : 'pl-3 pr-2'}">${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : empty(msg);
  const add = (form, label, c, icon = 'plus', primary) => `<button class="${primary ? 'btn-p' : 'btn-o'}" data-form="${form}" data-client="${c.name}">${ic(icon, 'h-3.5 w-3.5')}${label}</button>`;
  const head = (t, btns = '') => `<div class="mb-2 flex flex-wrap items-center justify-between gap-2"><h3 class="text-xs font-semibold text-mute">${t}</h3><div class="flex flex-wrap gap-2">${btns}</div></div>`;
  const note = (m) => `<div class="mb-3 flex items-center gap-2 rounded-xl bg-bg px-3 py-2 text-[13px] text-mute">${ic('info')}<span>${m}</span></div>`;
  const nc = (n) => `<span class="whitespace-nowrap">${n}</span>`;

  /* Products & prices: all columns of the Products page, plus the Merchant Center feed status */
  const feedOf = (p, c) => (c.scope === POST ? 'N/A' : c.ch.mc.s !== 'ok' ? 'Not linked' : p.feed || 'Synced');
  const FEEDK = { Synced: '', Pending: 'o', 'Not linked': 'g', 'N/A': 'g' };
  const prodTable = (c) => {
    const ps = S(c).prods;
    return tbl(['Product', 'Type', 'Unit', 'Price', 'Offer price', 'Discount', 'Status', 'Merchant feed', 'Creatives', 'Updated', ''], ps.map((p) => {
      const o = p.creatives.filter((x) => x.s === 'out').length, f = feedOf(p, c);
      return [`<b>${p.name}</b>`, p.type, nc(p.unit), nc(inr(p.price)), p.offer ? nc(inr(p.offer)) : '-', p.offer ? chip('-' + disc(p) + '%') : '-', sc(p.status), chip(f, FEEDK[f]), `${nc(p.creatives.length)}${o ? ' ' + chip(o + ' outdated', 'dn') : ''}`, nc(p.updated),
        `<button class="ibtn" data-act="price" data-pid="${p.id}" title="Change price or offer" aria-label="Change price of ${p.name}">${ic('badge-indian-rupee', 'h-3.5 w-3.5')}</button>`];
    }), 960, 'No products yet. Add the first product or offer for this client.');
  };

  /* Client table */
  const st = { q: '', s: '', p: '', m: '', so: 'name', page: 1, view: 'table', narrow: false, open: new Set(), all: false, tab: 'Overview', cur: null };
  const filtered = () => {
    const q = st.q.trim().toLowerCase();
    const r = C.filter((c) => (!q || [c.name, c.contact, c.email].some((x) => x.toLowerCase().includes(q))) && (!st.s || c.status === st.s) && (!st.p || c.plan === st.p) && (!st.m || c.manager === st.m));
    const by = { name: (a, b) => a.name.localeCompare(b.name), spend: (a, b) => S(b).spend - S(a).spend, leads: (a, b) => S(b).leadN - S(a).leadN, new: (a, b) => b.id - a.id };
    return r.sort(by[st.so]);
  };
  const kpis = () => {
    const act = C.filter((c) => c.status === 'Active').length, all = C.map(S);
    const K = [['building-2', 'Total clients', C.length], ['circle-check', 'Active', act], ['circle-pause', 'Inactive', C.length - act], ['tags', 'Products', all.reduce((t, s) => t + s.prods.length, 0)], ['file-warning', 'Creatives to update', all.reduce((t, s) => t + s.out, 0)], ['alert-triangle', 'Need attention', C.filter(attention).length]];
    $('#kpis').innerHTML = K.map(([i, l, v]) => `<div class="card flex min-w-0 items-center gap-2.5 p-3"><div class="ico">${ic(i)}</div><div class="min-w-0"><div class="ttl">${l}</div><div class="truncate text-lg font-bold leading-tight">${v}</div></div></div>`).join('');
  };
  const actions = (c) => `<button class="ibtn" data-act="view" data-id="${c.id}" aria-label="View ${c.name}" title="View everything">${ic('eye', 'h-3.5 w-3.5')}</button><button class="ibtn" data-act="edit" data-id="${c.id}" aria-label="Edit ${c.name}" title="Edit">${ic('pencil', 'h-3.5 w-3.5')}</button>`;
  const CHN = [['meta', 'Meta', 'M'], ['google', 'Google', 'G'], ['wa', 'WhatsApp', 'W'], ['li', 'LinkedIn', 'L'], ['ig', 'Instagram', 'I']];
  const chans = (c) => `<div class="flex gap-1">${CHN.map(([k, n, l]) => { const s = c.ch[k].s; return `<span class="chip ${s === 'reconnect' ? 'dn' : ''}" ${s === 'none' ? GREY : ''} title="${n}: ${s === 'ok' ? 'Connected' : s === 'none' ? 'Not connected' : 'Reconnect'}">${l}</span>`; }).join('')}</div>`;
  const TH = ['', 'Client', 'Contact', 'Package', 'Manager', 'Campaigns', 'Ad spend', 'Leads', 'Products', 'Price range', 'Offers', 'Price changes (7d)', 'Outdated creatives', 'Channels', 'Status', 'Actions'];

  const row = (c) => {
    const s = S(c), open = st.all || st.open.has(c.id), td = 'px-2';
    return `<tr class="border-t border-line hover:bg-hov/50">
      <td class="py-2 pl-3 pr-1"><button class="ibtn" data-act="expand" data-id="${c.id}" aria-expanded="${open}" aria-label="Show products of ${c.name}" title="Products & prices">${ic(open ? 'chevron-down' : 'chevron-right', 'h-3.5 w-3.5')}</button></td>
      <td class="max-w-[220px] px-2 py-2"><div class="flex min-w-0 items-center gap-2.5"><div class="av">${AV(c.name)}</div><div class="min-w-0"><b class="block truncate">${c.name}</b><span class="block truncate text-xs text-mute">${c.ind}${c.scope !== FULL ? ' · ' + c.scope : ''}</span></div></div></td>
      <td class="max-w-[170px] ${td}"><span class="block truncate">${c.contact}</span><span class="block truncate text-xs text-mute">${c.phone}</span></td>
      <td class="${td}">${c.plan}</td><td class="max-w-[130px] truncate ${td}">${c.manager}</td><td class="${td}">${s.camps.length}</td><td class="whitespace-nowrap ${td}">${L(s.spend)}</td><td class="${td}">${s.leadN}</td>
      <td class="${td}">${s.prods.length}</td><td class="whitespace-nowrap ${td}">${s.prods.length ? (s.lo === s.hi ? L(s.lo) : L(s.lo) + ' – ' + L(s.hi)) : '-'}</td>
      <td class="whitespace-nowrap ${td}">${s.offers ? s.offers + ' <span class="text-xs text-mute">(up to ' + s.maxd + '%)</span>' : '-'}</td>
      <td class="${td}">${s.chg ? chip(s.chg, 'o') : '-'}</td><td class="${td}">${s.out ? chip(s.out, 'dn') : '-'}</td><td class="${td}">${chans(c)}</td>
      <td class="${td}">${sc(c.status)}${attention(c) ? `<span class="ml-1 inline-block align-middle text-[var(--amb)]" title="Needs attention">${ic('alert-triangle', 'h-3.5 w-3.5')}</span>` : ''}</td>
      <td class="py-2 pl-2 pr-3"><div class="flex justify-end gap-1.5">${actions(c)}</div></td></tr>
    ${open ? `<tr class="bg-bg/40"><td colspan="${TH.length}" class="p-3">${head('Products & prices · ' + c.name, add('product', 'Add product', c))}${prodTable(c)}</td></tr>` : ''}`;
  };

  function render() {
    kpis();
    const rows = filtered(), pages = Math.max(1, Math.ceil(rows.length / PAGE));
    st.page = Math.min(st.page, pages);
    const sl = rows.slice((st.page - 1) * PAGE, st.page * PAGE), cards = st.narrow || st.view === 'cards';
    $('#vt').classList.toggle('hidden', st.narrow);
    $('#xp').classList.toggle('hidden', cards); $('#xp').setAttribute('aria-pressed', st.all); $('#xp span').textContent = st.all ? 'Hide products' : 'Show products';
    document.querySelectorAll('#vt button').forEach((b) => { const on = b.dataset.v === (cards ? 'cards' : 'table'); b.classList.toggle('bg-card', on); b.classList.toggle('shadow-sm', on); b.classList.toggle('text-mute', !on); });
    if (!sl.length) {
      $('#list').innerHTML = `<div class="grid place-items-center gap-2 px-4 py-12 text-center"><div class="ico">${ic('search-x')}</div><b>No clients match these filters</b><span class="text-xs text-mute">Try a different search or clear the filters.</span><button class="btn-o" data-act="clear">Clear filters</button></div>`;
    } else if (cards) {
      $('#list').innerHTML = `<div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,250px),1fr))] gap-3 p-3">${sl.map((c) => { const s = S(c); const m = (v, l) => `<div class="min-w-0 rounded-lg bg-bg p-1.5"><div class="truncate text-sm font-bold">${v}</div><div class="truncate text-[11px] text-mute">${l}</div></div>`; return `
        <div class="min-w-0 rounded-xl border border-line p-3">
          <div class="flex min-w-0 items-center gap-2.5"><div class="av">${AV(c.name)}</div><div class="min-w-0 flex-1"><b class="block truncate text-[13px]">${c.name}</b><span class="block truncate text-xs text-mute">${c.ind}</span></div>${sc(c.status)}</div>
          <div class="mt-3 grid grid-cols-3 gap-2 text-center">${m(s.camps.length, 'Campaigns')}${m(L(s.spend), 'Spend')}${m(s.leadN, 'Leads')}${m(s.prods.length, 'Products')}${m(s.offers, 'Offers')}${m(s.out, 'Outdated')}</div>
          <div class="mt-3 flex min-w-0 items-center gap-2">${chans(c)}<span class="min-w-0 flex-1 truncate text-right text-xs text-mute">${c.plan}</span>${actions(c)}</div></div>`; }).join('')}</div>`;
    } else {
      $('#list').innerHTML = `<div class="overflow-x-auto"><table class="w-full min-w-[1380px] text-[13px]"><thead><tr class="text-left text-xs text-mute">${TH.map((h, i) => `<th class="py-2 ${i === 0 ? 'pl-3 pr-1' : i === TH.length - 1 ? 'pl-2 pr-3 text-right' : 'px-2'} whitespace-nowrap font-medium">${h}</th>`).join('')}</tr></thead><tbody>${sl.map(row).join('')}</tbody></table></div>`;
    }
    const from = rows.length ? (st.page - 1) * PAGE + 1 : 0;
    $('#pager').innerHTML = `<span>Showing ${from}–${Math.min(st.page * PAGE, rows.length)} of ${rows.length} clients</span><div class="flex items-center gap-2"><button class="ibtn disabled:opacity-40" data-act="prev" aria-label="Previous page" ${st.page <= 1 ? 'disabled' : ''}>${ic('chevron-left', 'h-3.5 w-3.5')}</button><span>Page ${st.page} of ${pages}</span><button class="ibtn disabled:opacity-40" data-act="next" aria-label="Next page" ${st.page >= pages ? 'disabled' : ''}>${ic('chevron-right', 'h-3.5 w-3.5')}</button></div>`;
    A.icons();
  }

  /* Whole-client view: one overlay, six tabs */
  const closeDetail = () => { const d = $('#detail'); if (d) d.remove(); st.cur = null; document.body.classList.remove('overflow-hidden'); };
  const TABS = ['Overview', 'Campaigns', 'Leads', 'Creatives & approvals', 'Products & prices', 'Ad & social accounts'];
  const row2 = (l, v) => `<div class="grid grid-cols-[96px_minmax(0,1fr)] gap-2 py-1.5 text-[13px]"><span class="text-mute">${l}</span><span class="min-w-0 break-words font-medium">${v}</span></div>`;
  const bar = (c) => { const p = c.budget ? Math.min(100, Math.round((c.spent / c.budget) * 100)) : 0; return `<div class="w-28"><div class="flex justify-between text-[11px] text-mute"><span>${L(c.spent)}</span><span>${p}%</span></div><div class="h-1.5 rounded-full bg-hov"><div class="h-1.5 rounded-full ${p >= 90 ? 'bg-[var(--red)]' : 'bg-brand'}" style="width:${p}%"></div></div></div>`; };
  const CHD = {
    meta: ['Meta (Facebook + Instagram ads)', 'megaphone', 'connectMeta', (c) => { const m = c.ch.meta; return `Ad account ${m.acct || '-'} · ${m.mode || '-'}${m.s === 'reconnect' ? ' · <b class="text-[var(--red)]">token expired</b>' : m.exp ? ` · token expires in ${m.exp} days` : m.s === 'ok' ? ' · no expiry' : ''}`; }],
    google: ['Google Ads', 'search', 'connectGoogle', (c) => `Customer ID ${c.ch.google.cid || '-'}`],
    mc: ['Google Merchant Center', 'shopping-bag', 'connectMerchant', (c) => (c.ch.mc.s === 'ok' ? `Merchant ID ${c.ch.mc.id} · prices pushed with Merchant API v1` : 'Not linked. Only needed if the client sells products on a website.')],
    wa: ['WhatsApp Business', 'message-circle', 'connectWA', (c) => `Number ${c.ch.wa.num || '-'}`],
    li: ['LinkedIn', 'linkedin', 'connectSocial', (c) => c.ch.li.scope || 'Not connected'],
    ig: ['Instagram profile', 'instagram', 'connectSocial', (c) => c.ch.ig.handle || 'Not connected'],
  };
  const TAB = {
    Overview: (c) => { const s = S(c), post = c.scope === POST, todo = [['Business profile added', true], ...(post ? [['LinkedIn page access granted', c.ch.li.s === 'ok']] : [['Meta connected', c.ch.meta.s === 'ok'], ['Google Ads connected', c.ch.google.s === 'ok'], ['Products added', s.prods.length > 0]]), ['Service package set', true]],
        list = (a) => a.map(([t, ok]) => `<div class="flex items-center gap-2 text-[13px] ${ok ? '' : 'text-mute'}"><span class="${ok ? 'text-[var(--grn)]' : 'text-mute'}">${ic(ok ? 'circle-check' : 'circle', 'h-4 w-4')}</span>${t}</div>`).join('');
      return `<div class="grid gap-4 sm:grid-cols-2"><div><h3 class="mb-1 text-xs font-semibold text-mute">Details</h3><div class="divide-y divide-line">${row2('Service scope', c.scope)}${row2('Package', `${c.plan} (${inr(FEE[c.plan])}/month)`)}${row2('Client since', c.since)}${row2('Contact', c.contact)}${row2('Phone', c.phone)}${row2('Email', c.email)}${row2('Website', c.website)}</div>
      <h3 class="mb-1 mt-4 text-xs font-semibold text-mute">Billing</h3><div class="divide-y divide-line">${row2('Monthly fee', inr(FEE[c.plan]) + ' + 18% GST')}${row2('Collected by', c.pay)}${row2('Next invoice', '1 Dec 2026')}${row2('Pending', c.pending ? inr(c.pending) : 'None')}</div><div class="mt-2">${add('payLink', 'Send payment link', c, 'send')}</div></div>
      <div class="space-y-4"><div><h3 class="mb-1 text-xs font-semibold text-mute">Team</h3><div class="divide-y divide-line">${row2('Manager', c.manager)}${row2('Ads manager', c.ads)}${row2('Designer', c.designer)}</div></div>
      <div><h3 class="mb-2 text-xs font-semibold text-mute">Onboarding</h3><div class="space-y-1.5">${list(todo)}</div></div>
      <div><h3 class="mb-2 text-xs font-semibold text-mute">Documents</h3><div class="space-y-1.5">${list(c.docs)}</div></div></div></div>`; },
    Campaigns: (c) => (c.scope === POST ? note('Posting-only client. Posts go through Creatives & approvals, so there are no ad campaigns here.') : head('Campaigns', add('campaign', 'New campaign', c) + add('googleAd', 'Run Google ad', c, 'search') + add('waCampaign', 'Run WhatsApp campaign', c, 'message-circle'))) +
      tbl(['Campaign', 'Platform', 'Objective', 'Budget used', 'Leads', 'Schedule', 'Status'], S(c).camps.map((x) => [`<b>${x.name}</b>`, nc(x.platform), x.objective, bar(x), x.leads, `<span class="whitespace-nowrap text-xs">${fd(x.start)} – ${fd(x.end)}</span>`, sc(x.status)]), 760, 'No campaigns yet.'),
    Leads: (c) => (c.scope === POST ? note('Posting-only client. Leads are not tracked here.') : head('Leads', add('lead', 'Add lead', c))) + tbl(['Name', 'Campaign', 'Source', 'Interest', 'Status', 'Owner', 'Value', 'Received'], S(c).leads.map((x) => [`<b>${x.name}</b>`, x.campaign, nc(x.source), chip(x.rating, x.rating === 'Hot' ? 'dn' : x.rating === 'Warm' ? 'am' : 'g'), sc(x.status), x.owner || '<span class="text-mute">Unassigned</span>', nc(L(x.value)), nc(fd(x.created))]), 780, 'No leads yet.'),
    'Creatives & approvals': (c) => { const s = S(c), n = s.crs.filter((x) => x.status === 'Outdated').length;
      return (n ? `<div class="mb-3 flex items-center gap-2 rounded-xl bg-[var(--redbg)] px-3 py-2 text-[13px] text-[var(--red)]">${ic('alert-triangle')}<span><b>${n} creative${n > 1 ? 's' : ''} use an old price.</b> Designer tasks are created; upload revised versions for approval.</span></div>` : '') +
        head('Creatives & approvals', add('creative', 'Upload creative', c)) + tbl(['Creative', 'Format', 'Version', 'Campaign', 'Approval', 'Waiting'], s.crs.map((x) => [`<b>${x.title}</b>`, x.format, 'v' + x.v, x.campaign || '-', sc(x.status), x.status === 'Waiting for approval' ? (x.days ? x.days + ' day' + (x.days > 1 ? 's' : '') : 'Today') : '-']), 640, 'No creatives yet.'); },
    'Products & prices': (c) => head('Products & prices', add('product', 'Add product', c)) + prodTable(c),
    'Ad & social accounts': (c) => `<div class="grid gap-3 sm:grid-cols-2">${Object.entries(CHD).map(([k, [n, i, f, info]]) => { const s = c.ch[k].s;
      return `<div class="min-w-0 rounded-xl border border-line p-3"><div class="flex items-center gap-2"><div class="ico">${ic(i)}</div><b class="min-w-0 flex-1 truncate text-[13px]">${n}</b>${s === 'ok' ? chip('Connected') : s === 'reconnect' ? chip('Reconnect', 'dn') : chip('Not connected', 'g')}</div>
        <p class="mt-2 break-words text-xs text-mute">${info(c)}</p><button class="${s === 'ok' ? 'btn-o' : 'btn-p'} mt-3" data-act="connect" data-id="${c.id}" data-ch="${k}">${s === 'ok' ? 'Update' : s === 'reconnect' ? 'Reconnect' : 'Connect'}</button></div>`; }).join('')}</div>
      <p class="mt-3 text-xs text-mute">Clients never share passwords. They log in on Meta or Google's own screen, or add our Business Manager or manager account as a partner.</p>`,
  };
  const TABN = { Campaigns: (s) => s.camps.length, Leads: (s) => s.leads.length, 'Creatives & approvals': (s) => s.crs.length, 'Products & prices': (s) => s.prods.length };

  function detail(id, tab) {
    const c = find(id); if (!c) return;
    const old = $('#detail .scr'), keep = old ? old.scrollTop : 0;
    if (tab) st.tab = tab;
    closeDetail(); st.cur = c.id;
    const s = S(c), stat = (l, v) => `<div class="min-w-0 rounded-lg bg-bg p-2.5"><div class="truncate text-[11px] text-mute">${l}</div><div class="truncate text-base font-bold">${v}</div></div>`;
    const el = document.createElement('div');
    el.id = 'detail'; el.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6';
    el.innerHTML = `<aside role="dialog" aria-modal="true" aria-label="Client details" class="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl sm:max-h-[90dvh]">
      <div class="flex shrink-0 items-center gap-2.5 border-b border-line p-4"><div class="av h-10 w-10 text-xs">${AV(c.name)}</div><div class="min-w-0 flex-1"><h2 class="truncate text-base font-semibold">${c.name}</h2><span class="block truncate text-xs text-mute">${c.ind} · ${c.scope} · ${c.plan} · ${c.manager}</span></div>${sc(c.status)}<button data-close aria-label="Close" class="ibtn">${ic('x', 'h-4 w-4')}</button></div>
      <div class="grid shrink-0 grid-cols-2 gap-2 border-b border-line p-3 sm:grid-cols-3 lg:grid-cols-6">${stat('Campaigns', s.camps.length)}${stat('Ad spend', L(s.spend))}${stat('Leads', s.leadN)}${stat('Products', s.prods.length)}${stat('Outdated creatives', s.out)}${stat('Pending payment', c.pending ? inr(c.pending) : 'None')}</div>
      <div role="tablist" class="flex shrink-0 gap-1 overflow-x-auto border-b border-line px-3 pt-2">${TABS.map((t) => `<button role="tab" aria-selected="${st.tab === t}" data-act="tab" data-tab="${t}" class="-mb-px shrink-0 whitespace-nowrap border-b-2 px-3 pb-2 text-xs font-medium ${st.tab === t ? 'border-brand text-ink' : 'border-transparent text-mute hover:text-ink'}">${t}${TABN[t] ? ` <span class="ml-0.5 text-[11px] text-mute">${TABN[t](s)}</span>` : ''}</button>`).join('')}</div>
      <div class="scr min-h-0 flex-1 overflow-y-auto p-4">${TAB[st.tab](c)}</div>
      <div class="flex shrink-0 flex-wrap gap-2 border-t border-line p-3"><button class="btn-p" data-act="edit" data-id="${c.id}">${ic('pencil', 'h-3.5 w-3.5')}Edit</button><button class="btn-o" data-act="team" data-id="${c.id}">${ic('users', 'h-3.5 w-3.5')}Assign team</button><button class="btn-o" data-act="invite" data-id="${c.id}">${ic('mail', 'h-3.5 w-3.5')}Invite</button><button class="btn-o ml-auto" data-act="toggle" data-id="${c.id}">${c.status === 'Active' ? 'Deactivate' : 'Activate'}</button></div></aside>`;
    el.addEventListener('click', (e) => { if (e.target === el || e.target.closest('[data-close]')) closeDetail(); });
    document.body.append(el); document.body.classList.add('overflow-hidden'); A.icons();
    $('#detail .scr').scrollTop = keep;
  }

  /* Clicks */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act, c = find(b.dataset.id);
    if (a === 'view') detail(b.dataset.id, 'Overview');
    else if (a === 'tab') { st.tab = b.dataset.tab; detail(st.cur); }
    else if (a === 'expand') { st.open.has(c.id) ? st.open.delete(c.id) : st.open.add(c.id); render(); }
    else if (a === 'price') { const p = D.products.find((x) => x.id === +b.dataset.pid); A.openForm('price', { id: p.id, product: `${p.name} (${p.client})`, current: p.offer ? `${inr(p.price)} (offer ${inr(p.offer)})` : inr(p.price), price: p.price, offer: p.offer || '', impact: 'Creatives using this product will be marked outdated and a task will be created for the designer.' }); }
    else if (a === 'connect') { const k = b.dataset.ch, f = CHD[k][2]; A.openForm(f, { client: c.name, platform: k === 'ig' ? 'Instagram' : 'LinkedIn' }); }
    else if (a === 'edit') A.openForm('clientEdit', c);
    else if (a === 'team') A.openForm('team', { id: c.id, client: c.name, manager: c.manager, ads: c.ads, designer: c.designer });
    else if (a === 'invite') A.openForm('invite', { client: c.name, email: c.email });
    else if (a === 'toggle') { c.status = c.status === 'Active' ? 'Inactive' : 'Active'; A.toast(`${c.name} is now ${c.status.toLowerCase()}`); render(); detail(c.id); }
    else if (a === 'prev') { st.page--; render(); } else if (a === 'next') { st.page++; render(); }
    else if (a === 'clear') { Object.assign(st, { q: '', s: '', p: '', m: '', page: 1 }); $('#q').value = ''; ['fs', 'fp', 'fm'].forEach((i) => ($('#' + i).value = '')); render(); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !e.defaultPrevented) closeDetail(); });

  /* Toolbar */
  const bind = (id, key, ev = 'change') => $(id).addEventListener(ev, (e) => { st[key] = e.target.value; st.page = 1; render(); });
  bind('#q', 'q', 'input'); bind('#fs', 's'); bind('#fp', 'p'); bind('#fm', 'm'); bind('#so', 'so');
  $('#vt').onclick = (e) => { const b = e.target.closest('button'); if (b) { st.view = b.dataset.v; render(); } };
  $('#xp').onclick = () => { st.all = !st.all; render(); };

  /* Saved forms (also the Create menu in the topbar) */
  const CHAN_SAVE = {
    connectMeta: (c, d) => { c.ch.meta = { s: 'ok', mode: d.method, acct: d.acct, exp: /partner|system/i.test(d.method) ? 0 : 60 }; if (d.ig) c.ch.ig = { s: 'ok', handle: 'ID ' + d.ig }; },
    connectGoogle: (c, d) => { c.ch.google = { s: 'ok', cid: d.cid }; if (d.mc) c.ch.mc = { s: 'ok', id: d.mc }; },
    connectMerchant: (c, d) => { c.ch.mc = { s: 'ok', id: d.mc }; },
    connectWA: (c, d) => { c.ch.wa = { s: 'ok', num: d.num }; },
    connectSocial: (c, d) => { d.platform === 'LinkedIn' ? (c.ch.li = { s: 'ok', scope: d.scope }) : (c.ch.ig = { s: 'ok', handle: d.url }); },
  };
  document.addEventListener('form:saved', ({ detail: { key, data, vals } }) => {
    const cl = byName(data.client), tabFor = { campaign: 'Campaigns', googleAd: 'Campaigns', waCampaign: 'Campaigns', lead: 'Leads', creative: 'Creatives & approvals', product: 'Products & prices', price: 'Products & prices' };
    if (key === 'client') {
      const id = nextId(C);
      C.unshift({ ...mk(id, data.name, 'New client', data.contact || 'Not set', data.plan, data.manager, 'Active', 0, 'none', 'none', 'Nov 2026'), scope: data.scope || FULL, phone: data.phone || '-', email: data.email, website: data.website || '-' });
      st.so = 'new'; $('#so').value = 'new';
    } else if (key === 'clientEdit') { const c = find(vals.id); if (c) Object.assign(c, data); }
    else if (key === 'team') { const c = byName(data.client); if (c) Object.assign(c, { manager: data.manager, ads: data.ads, designer: data.designer }); }
    else if (key === 'payLink') A.toast('Payment link sent (demo). In production: Razorpay payment link or subscription API.');
    else if (CHAN_SAVE[key] && cl) { CHAN_SAVE[key](cl, data); A.toast('Connection saved (demo). In production this comes from the OAuth callback.'); }
    else if (['campaign', 'googleAd', 'waCampaign'].includes(key)) {
      const pf = key === 'googleAd' ? 'Google Ads' : key === 'waCampaign' ? 'WhatsApp' : data.platform, need = key === 'googleAd' ? ['google', 'Google Ads'] : key === 'waCampaign' ? ['wa', 'WhatsApp Business'] : null;
      D.campaigns.unshift({ id: nextId(D.campaigns), name: data.name, client: data.client, platform: pf, objective: data.objective || 'Leads', budget: +data.budget || 0, spent: 0, leads: 0, start: data.start || '', end: data.end || '', status: 'Draft' });
      if (need && cl && cl.ch[need[0]].s !== 'ok') A.toast(`Saved as draft. Connect ${need[1]} for this client before publishing.`);
    } else if (key === 'lead') D.leads.unshift({ name: data.name, client: data.client, campaign: data.campaign, source: data.source, status: 'New', rating: data.rating, owner: data.owner === 'Unassigned' ? '' : data.owner, value: +data.value || 0, created: TODAY });
    else if (key === 'creative') D.creatives.unshift({ title: data.title, client: data.client, format: data.format, v: 1, campaign: '', status: 'Waiting for approval', days: 0 });
    else if (key === 'product') D.products.unshift({ id: nextId(D.products), name: data.name, client: data.client, type: data.type, unit: data.unit, price: +data.price || 0, offer: +data.offer || 0, status: 'Active', updated: 'Just now', creatives: [], recent: false, history: [['Just now', 'Added at ' + inr(+data.offer || +data.price), 'John Doe']] });
    else if (key === 'price') {
      const p = D.products.find((x) => x.id === vals.id), np = +data.price, no = +data.offer || 0;
      if (!p || !(np > 0) || (no && no >= np)) { A.toast('Price not updated: enter a valid price and an offer below it'); return; }
      if (np === p.price && no === p.offer) { A.toast('No change in price'); return; }
      const was = p.offer ? `${inr(p.price)} (offer ${inr(p.offer)})` : inr(p.price), now = no ? `${inr(np)} (offer ${inr(no)})` : inr(np), sync = data.sync && data.sync !== 'CRM only';
      const n = p.creatives.filter((x) => x.s === 'ok').length;
      p.creatives.forEach((x) => { if (x.s === 'ok') x.s = 'out'; });
      D.creatives.filter((x) => x.client === p.client && p.creatives.some((y) => y.t === x.title) && x.status === 'Approved').forEach((x) => (x.status = 'Outdated'));
      if (sync) { p.feed = 'Pending'; setTimeout(() => { p.feed = 'Synced'; render(); if (st.cur) detail(st.cur); }, 1800); }
      p.history.unshift(['Just now', `Price changed from ${was} to ${now} (${data.reason})${sync ? ' · ' + data.sync : ''}`, 'John Doe']);
      Object.assign(p, { price: np, offer: no, updated: 'Just now', recent: true });
      A.toast(`Price updated. ${n} creative${n === 1 ? '' : 's'} flagged outdated${sync ? '. Merchant feed update queued' : ''}`);
    } else return;
    syncNames(); render();
    if (st.cur) { if (tabFor[key]) st.tab = tabFor[key]; detail(st.cur); }
    else if (cl && tabFor[key] && key !== 'price') detail(cl.id, tabFor[key]);
  });

  /* Switch to cards automatically when the content area gets narrow */
  const cq = document.querySelector('.cq');
  new ResizeObserver(() => { const n = cq.clientWidth < 720; if (n !== st.narrow) { st.narrow = n; render(); } }).observe(cq);
  st.narrow = cq.clientWidth < 720;
  render();
})();