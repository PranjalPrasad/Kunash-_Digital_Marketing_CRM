/* Products & prices page only. Sample data: replace `P` with API data later. */
(function () {
  const A = window.AdDesk, $ = (s) => document.querySelector(s);
  const ic = (n, c = 'h-4 w-4') => `<i data-lucide="${n}" class="${c}"></i>`;
  const PAGE = 8;
  const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
  A.clients = ['Sharma Garments', 'Kapoor Jewellers', 'Urban Brew Café', 'FitZone Gym', 'Glow Salon', 'Green Basket', 'Nest Interiors', 'EduSpark Classes', 'Zenith Motors'];

  const cr = (t, s) => ({ t, s }); /* creative status: ok | wait | out | chg */
  /* id, name, client, type, unit, price, offer(0 = none), status, updated, recent, desc, creatives, history [[when, text, by]] */
  const mk = (id, name, client, type, unit, price, offer, status, updated, recent, desc, creatives = [], history) => ({
    id, name, client, type, unit, price, offer, status, updated, recent, desc, creatives,
    history: history || [[updated, 'Added at ' + inr(offer || price), 'Riya Shah']], seq: id,
  });
  let P = [
    mk(1, 'Cold Coffee', 'Urban Brew Café', 'Product', 'per glass', 160, 0, 'Active', '1 hr ago', true, 'Signature cold coffee, 300 ml.', [cr('Offer banner', 'out'), cr('Menu story', 'ok')], [['1 hr ago', 'Price changed from ₹180 to ₹160 (Client request)', 'Neha Rao'], ['2 Sep', 'Added at ₹180', 'Neha Rao']]),
    mk(2, 'Iced Latte', 'Urban Brew Café', 'Product', 'per glass', 210, 0, 'Active', '2 Sep', false, 'Iced latte with single-origin beans.', [cr('Menu story', 'ok')]),
    mk(3, 'Brownie', 'Urban Brew Café', 'Product', 'per piece', 120, 99, 'Active', '10 Nov', false, 'Warm walnut brownie. Combo offer price.', []),
    mk(4, 'Silk Saree Collection', 'Sharma Garments', 'Product', 'per piece', 4999, 3499, 'Active', '9 Nov', false, 'Festive silk sarees, 30% off.', [cr('Diwali carousel', 'ok'), cr('Festive reel', 'ok')], [['9 Nov', 'Offer price set to ₹3,499 (Festival offer)', 'Riya Shah'], ['12 Mar 2025', 'Added at ₹4,999', 'Riya Shah']]),
    mk(5, 'Cotton Kurta Set', 'Sharma Garments', 'Product', 'per set', 1499, 0, 'Active', '12 Mar 2025', false, 'Everyday cotton kurta and pyjama set.'),
    mk(6, 'Gold Coin 5 g', 'Kapoor Jewellers', 'Product', 'per coin', 38500, 0, 'Active', '15 Nov', true, 'BIS hallmarked 24K gold coin.', [], [['15 Nov', 'Price changed from ₹37,900 to ₹38,500 (Cost change)', 'Kabir Jain'], ['25 Oct', 'Added at ₹37,900', 'Kabir Jain']]),
    mk(7, 'Annual Membership', 'FitZone Gym', 'Package', 'per year', 14999, 11999, 'Active', '5 Nov', false, 'All-branch annual pass, 20% off.', [cr('Membership reel', 'ok')]),
    mk(8, 'Monthly Membership', 'FitZone Gym', 'Package', 'per month', 1499, 0, 'Inactive', '1 Aug', false, 'Paused while the annual plan runs.'),
    mk(9, 'Bridal Makeup Package', 'Glow Salon', 'Package', 'per booking', 24999, 0, 'Active', '1 Nov', false, 'Bridal makeup, hair and draping.', [cr('Bridal reel', 'ok')]),
    mk(10, 'Board Exam Crash Course', 'EduSpark Classes', 'Service', 'per batch', 10500, 0, 'Active', 'Yesterday', true, '60 day crash course for board exams.', [cr('Batch fee banner', 'out')], [['Yesterday', 'Price changed from ₹12,000 to ₹10,500 (Competitor pricing)', 'Riya Shah'], ['3 Mar', 'Added at ₹12,000', 'Riya Shah']]),
    mk(11, 'Exchange Bonus', 'Zenith Motors', 'Offer', 'per car', 40000, 0, 'Active', '3 hrs ago', true, 'Exchange bonus on old cars.', [cr('Exchange offer banner', 'out'), cr('Showroom video', 'wait')], [['3 hrs ago', 'Offer changed from ₹30,000 to ₹40,000 (Festival offer)', 'Neha Rao'], ['10 Nov', 'Added at ₹30,000', 'Neha Rao']]),
    mk(12, '3-Seater Sofa', 'Nest Interiors', 'Product', 'per piece', 32000, 25600, 'Active', '14 Nov', false, 'Fabric 3-seater sofa, 20% off.', [cr('Sofa offer banner', 'chg')]),
  ];
  const find = (id) => P.find((p) => p.id === +id);
  const TABS = ['All', 'Active', 'Inactive', 'Price changed'];
  $('#fc').innerHTML = '<option value="">All clients</option>' + A.clients.map((n) => `<option>${n}</option>`).join('');

  const eff = (p) => p.offer || p.price;
  const pct = (p) => (p.offer ? Math.round((1 - p.offer / p.price) * 100) : 0);
  const outCount = (p) => p.creatives.filter((c) => c.s === 'out').length;
  const priceHtml = (p) => `<div class="whitespace-nowrap"><b>${inr(eff(p))}</b>${p.offer ? ` <s class="text-xs text-mute">${inr(p.price)}</s> <span class="chip">-${pct(p)}%</span>` : ''}</div><div class="truncate text-[11px] text-mute">${p.unit || ''}</div>`;
  const chip = (s) => `<span class="chip whitespace-nowrap" ${s === 'Active' ? '' : 'style="background:var(--hover);color:var(--mute)"'}>${s}</span>`;
  const CRS = { ok: ['Approved', ''], wait: ['Waiting for client', 'am'], out: ['Outdated', 'dn'], chg: ['Changes requested', 'am'] };
  const ib = (act, id, icon, label) => `<button class="ibtn" data-act="${act}" data-id="${id}" aria-label="${label}" title="${label}">${ic(icon, 'h-3.5 w-3.5')}</button>`;
  const actions = (p) => ib('view', p.id, 'eye', 'View') + ib('price', p.id, 'badge-indian-rupee', 'Change price') + ib('edit', p.id, 'pencil', 'Edit');
  const usedChip = (p) => `<span class="whitespace-nowrap">${p.creatives.length} creative${p.creatives.length === 1 ? '' : 's'}</span>${outCount(p) ? ` <span class="chip dn">${outCount(p)} outdated</span>` : ''}`;

  const st = { tab: 'All', q: '', c: '', t: '', so: 'upd', page: 1, view: 'table', narrow: false };
  const base = () => { const q = st.q.trim().toLowerCase(); return P.filter((p) => (!q || p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q)) && (!st.c || p.client === st.c) && (!st.t || p.type === st.t)); };
  function filtered() {
    const by = { upd: (a, b) => b.recent - a.recent || b.seq - a.seq, name: (a, b) => a.name.localeCompare(b.name), high: (a, b) => eff(b) - eff(a), low: (a, b) => eff(a) - eff(b) };
    return base().filter((p) => st.tab === 'All' || (st.tab === 'Price changed' ? p.recent : p.status === st.tab)).sort(by[st.so]);
  }

  function summary() {
    const out = P.reduce((t, p) => t + outCount(p), 0);
    const K = [['package', 'Total products', P.length], ['circle-check', 'Active', P.filter((p) => p.status === 'Active').length], ['badge-indian-rupee', 'Price changes (7 days)', P.filter((p) => p.recent).length], ['file-warning', 'Creatives to update', out], ['users', 'Clients with products', new Set(P.map((p) => p.client)).size]];
    $('#kpis').innerHTML = K.map(([i, l, v]) => `<div class="card flex min-w-0 items-center gap-2.5 p-3"><div class="ico">${ic(i)}</div><div class="min-w-0"><div class="ttl">${l}</div><div class="truncate text-lg font-bold leading-tight">${v}</div></div></div>`).join('');
    $('#alert').innerHTML = out ? `<div class="flex flex-wrap items-center gap-2 rounded-xl bg-[var(--redbg)] px-3 py-2.5 text-[13px] text-[var(--red)]"><span class="shrink-0">${ic('alert-triangle')}</span><span class="min-w-0 flex-1"><b>${out} creative${out > 1 ? 's' : ''} use an old price</b>. Designers have been given revision tasks. Upload revised versions and get them approved again.</span><a href="creatives.html" class="btn-o shrink-0 bg-card">Open creatives</a></div>` : '';
    const b = base();
    $('#tabs').innerHTML = TABS.map((t) => { const n = t === 'All' ? b.length : b.filter((p) => (t === 'Price changed' ? p.recent : p.status === t)).length, on = st.tab === t; return `<button role="tab" aria-selected="${on}" data-tab="${t}" class="-mb-px shrink-0 whitespace-nowrap border-b-2 px-3 pb-2 text-xs font-medium ${on ? 'border-brand text-ink' : 'border-transparent text-mute hover:text-ink'}">${t} <span class="ml-0.5 text-[11px] text-mute">${n}</span></button>`; }).join('');
  }

  function render() {
    summary();
    const rows = filtered(), pages = Math.max(1, Math.ceil(rows.length / PAGE));
    st.page = Math.min(st.page, pages);
    const sl = rows.slice((st.page - 1) * PAGE, st.page * PAGE), cards = st.narrow || st.view === 'cards';
    $('#vt').classList.toggle('hidden', st.narrow);
    document.querySelectorAll('#vt button').forEach((b) => { const on = b.dataset.v === (cards ? 'cards' : 'table'); b.classList.toggle('bg-card', on); b.classList.toggle('shadow-sm', on); b.classList.toggle('text-mute', !on); });
    if (!sl.length) {
      $('#list').innerHTML = `<div class="grid place-items-center gap-2 px-4 py-12 text-center"><div class="ico">${ic('search-x')}</div><b>No products found</b><span class="text-xs text-mute">Change the filters or add a new product.</span><button class="btn-o" data-act="clear">Clear filters</button></div>`;
    } else if (cards) {
      $('#list').innerHTML = `<div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,250px),1fr))] gap-3 p-3">${sl.map((p) => `
        <div class="min-w-0 rounded-xl border border-line p-3">
          <div class="flex min-w-0 items-start gap-2"><div class="min-w-0 flex-1"><b class="block truncate text-[13px]">${p.name}</b><span class="block truncate text-xs text-mute">${p.client} · ${p.type}</span></div>${chip(p.status)}</div>
          <div class="mt-3">${priceHtml(p)}</div>
          <div class="mt-2 flex min-w-0 flex-wrap items-center gap-1.5 text-xs text-mute">${usedChip(p)}</div>
          <div class="mt-3 flex items-center justify-between gap-2"><span class="min-w-0 truncate text-[11px] ${p.recent ? 'font-medium text-[var(--amb)]' : 'text-mute'}">Updated ${p.updated}</span><div class="flex shrink-0 gap-1.5">${actions(p)}</div></div>
        </div>`).join('')}</div>`;
    } else {
      $('#list').innerHTML = `<div class="overflow-x-auto"><table class="w-full min-w-[800px] text-[13px]"><thead><tr class="text-left text-xs text-mute"><th class="py-2 pl-3 pr-2 font-medium">Product</th><th class="px-2 font-medium">Type</th><th class="px-2 font-medium">Price</th><th class="px-2 font-medium">Used in</th><th class="px-2 font-medium">Updated</th><th class="px-2 font-medium">Status</th><th class="py-2 pl-2 pr-3 text-right font-medium">Actions</th></tr></thead><tbody>${sl.map((p) => `
        <tr class="border-t border-line hover:bg-hov/50">
          <td class="max-w-[240px] py-2 pl-3 pr-2"><b class="block truncate">${p.name}</b><span class="block truncate text-xs text-mute">${p.client}</span></td>
          <td class="px-2">${p.type}</td><td class="px-2">${priceHtml(p)}</td><td class="px-2 text-xs">${usedChip(p)}</td>
          <td class="whitespace-nowrap px-2 text-xs ${p.recent ? 'font-medium text-[var(--amb)]' : 'text-mute'}">${p.updated}</td><td class="px-2">${chip(p.status)}</td>
          <td class="py-2 pl-2 pr-3"><div class="flex justify-end gap-1.5">${actions(p)}</div></td></tr>`).join('')}</tbody></table></div>`;
    }
    const from = rows.length ? (st.page - 1) * PAGE + 1 : 0;
    $('#pager').innerHTML = `<span>Showing ${from}–${Math.min(st.page * PAGE, rows.length)} of ${rows.length} products</span><div class="flex items-center gap-2"><button class="ibtn disabled:opacity-40" data-act="prev" aria-label="Previous page" ${st.page <= 1 ? 'disabled' : ''}>${ic('chevron-left', 'h-3.5 w-3.5')}</button><span>Page ${st.page} of ${pages}</span><button class="ibtn disabled:opacity-40" data-act="next" aria-label="Next page" ${st.page >= pages ? 'disabled' : ''}>${ic('chevron-right', 'h-3.5 w-3.5')}</button></div>`;
    A.icons();
  }

  /* Product details: centered overlay */
  function closeDetail() { const d = $('#detail'); if (d) d.remove(); document.body.classList.remove('overflow-hidden'); }
  function detail(id) {
    const p = find(id); if (!p) return;
    closeDetail();
    const stat = (l, v) => `<div class="min-w-0 rounded-lg bg-bg p-2.5"><div class="truncate text-[11px] text-mute">${l}</div><div class="truncate text-base font-bold">${v}</div></div>`;
    const o = outCount(p);
    const el = document.createElement('div');
    el.id = 'detail'; el.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6';
    el.innerHTML = `<div role="dialog" aria-modal="true" aria-label="Product details" class="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl sm:max-h-[90dvh]">
      <div class="flex shrink-0 items-center gap-2.5 border-b border-line p-4"><div class="min-w-0 flex-1"><h2 class="truncate text-base font-semibold">${p.name}</h2><span class="block truncate text-xs text-mute">${p.client} · ${p.type}${p.unit ? ' · ' + p.unit : ''}</span></div>${chip(p.status)}<button data-close aria-label="Close" class="ibtn">${ic('x')}</button></div>
      <div class="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">${stat('Price', inr(p.price))}${stat('Offer price', p.offer ? inr(p.offer) : 'None')}${stat('Discount', p.offer ? pct(p) + '%' : '-')}${stat('Creatives', p.creatives.length)}</div>
        ${p.desc ? `<p class="break-words text-[13px] text-mute">${p.desc}</p>` : ''}
        ${o ? `<div class="rounded-lg bg-[var(--redbg)] p-3 text-[13px] text-[var(--red)]"><b class="flex items-center gap-1.5">${ic('file-warning')}${o} creative${o > 1 ? 's' : ''} outdated</b><p class="mt-1">The price changed after these were approved. Revised versions are needed.</p><a href="creatives.html" class="btn-o mt-2 bg-card">Open creatives</a></div>` : ''}
        <div><h3 class="mb-2 text-xs font-semibold text-mute">Linked creatives</h3>${p.creatives.length ? `<div class="space-y-1.5">${p.creatives.map((c) => `<div class="flex min-w-0 items-center gap-2 text-[13px]"><span class="min-w-0 flex-1 truncate">${c.t}</span><span class="chip ${CRS[c.s][1]} shrink-0">${CRS[c.s][0]}</span></div>`).join('')}</div>` : '<p class="text-[13px] text-mute">No creatives use this product yet.</p>'}</div>
        <div><h3 class="mb-2 text-xs font-semibold text-mute">Price history</h3><div class="space-y-2.5">${p.history.map(([when, text, by]) => `<div class="flex gap-2.5 text-[13px]"><span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand"></span><div class="min-w-0"><div class="break-words">${text}</div><div class="text-xs text-mute">${by}, ${when}</div></div></div>`).join('')}</div></div>
      </div>
      <div class="flex shrink-0 flex-wrap gap-2 border-t border-line p-3"><button class="btn-p" data-act="price" data-id="${p.id}">${ic('badge-indian-rupee', 'h-3.5 w-3.5')}Change price</button><button class="btn-o" data-act="edit" data-id="${p.id}">${ic('pencil', 'h-3.5 w-3.5')}Edit</button><button class="btn-o ml-auto" data-act="toggle" data-id="${p.id}">${p.status === 'Active' ? 'Deactivate' : 'Activate'}</button></div></div>`;
    el.addEventListener('click', (e) => { if (e.target === el || e.target.closest('[data-close]')) closeDetail(); });
    document.body.append(el); document.body.classList.add('overflow-hidden'); A.icons();
  }
  const refresh = (id) => { render(); if ($('#detail')) detail(id); };

  /* Clicks */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-tab]'); if (t) { st.tab = t.dataset.tab; st.page = 1; render(); return; }
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act, p = find(b.dataset.id);
    if (a === 'view') detail(p.id);
    else if (a === 'edit') A.openForm('productEdit', p);
    else if (a === 'price') {
      const n = p.creatives.filter((c) => c.s === 'ok').length;
      A.openForm('price', { id: p.id, product: p.name + ' (' + p.client + ')', current: inr(p.price) + (p.offer ? ', offer ' + inr(p.offer) : ''), price: p.price, offer: p.offer || '', impact: n ? `${n} approved creative${n > 1 ? 's' : ''} will be marked outdated and a revision task will be created for the designer.` : 'No approved creatives use this product, so nothing else needs to change.' });
    }
    else if (a === 'toggle') { p.status = p.status === 'Active' ? 'Inactive' : 'Active'; p.history.unshift(['Just now', p.status === 'Active' ? 'Activated' : 'Deactivated', 'John Doe']); A.toast(p.name + ' is now ' + p.status.toLowerCase()); refresh(p.id); }
    else if (a === 'prev') { st.page--; render(); } else if (a === 'next') { st.page++; render(); }
    else if (a === 'clear') { Object.assign(st, { tab: 'All', q: '', c: '', t: '', page: 1 }); $('#q').value = ''; $('#fc').value = ''; $('#ft').value = ''; render(); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !e.defaultPrevented) closeDetail(); });
  const bind = (id, key, ev = 'change') => $(id).addEventListener(ev, (e) => { st[key] = e.target.value; st.page = 1; render(); });
  bind('#q', 'q', 'input'); bind('#fc', 'c'); bind('#ft', 't'); bind('#so', 'so');
  $('#vt').onclick = (e) => { const b = e.target.closest('button'); if (b) { st.view = b.dataset.v; render(); } };

  /* Overlay forms */
  document.addEventListener('form:saved', ({ detail: { key, data, vals } }) => {
    const p = vals && vals.id ? find(vals.id) : null;
    if (key === 'product') {
      const id = Math.max(0, ...P.map((x) => x.id)) + 1;
      P.unshift(mk(id, data.name, data.client, data.type, data.unit, +data.price || 0, +data.offer || 0, 'Active', 'Just now', false, data.desc, [], [['Just now', 'Added at ' + inr(+data.offer || +data.price || 0), 'John Doe']]));
      Object.assign(st, { tab: 'All', so: 'upd', page: 1 }); $('#so').value = 'upd';
    } else if (key === 'productEdit' && p) {
      Object.assign(p, { name: data.name, client: data.client, type: data.type, unit: data.unit, desc: data.desc });
    } else if (key === 'price' && p) {
      const np = +data.price, no = +data.offer || 0;
      if (!(np > 0) || (no && no >= np)) { A.toast('Price not updated: enter a valid price and an offer price below it'); return; }
      if (np === p.price && no === p.offer) { A.toast('No change in price'); return; }
      const was = p.offer ? `${inr(p.price)} (offer ${inr(p.offer)})` : inr(p.price), now = no ? `${inr(np)} (offer ${inr(no)})` : inr(np);
      const flagged = p.creatives.filter((c) => c.s === 'ok');
      flagged.forEach((c) => (c.s = 'out'));
      Object.assign(p, { price: np, offer: no, updated: 'Just now', recent: true, seq: Math.max(...P.map((x) => x.seq)) + 1 });
      p.history.unshift(['Just now', `Price changed from ${was} to ${now} (${data.reason})${data.note ? '. ' + data.note : ''}`, 'John Doe']);
      A.toast(flagged.length ? `Price updated. ${flagged.length} creative${flagged.length > 1 ? 's' : ''} flagged outdated, task created.` : 'Price updated');
    } else return;
    refresh(p ? p.id : undefined);
  });

  const cq = document.querySelector('.cq');
  new ResizeObserver(() => { const n = cq.clientWidth < 720; if (n !== st.narrow) { st.narrow = n; render(); } }).observe(cq);
  st.narrow = cq.clientWidth < 720;
  render();
})();