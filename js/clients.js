/* Clients page only. Sample data: replace `C` with API data later. */
(function () {
  const A = window.AdDesk, $ = (s) => document.querySelector(s);
  const ic = (n, c = 'h-4 w-4') => `<i data-lucide="${n}" class="${c}"></i>`;
  const AV = (n) => n.split(' ').map((w) => w[0]).slice(0, 2).join('');
  const inr = (n) => '₹' + n.toLocaleString('en-IN');
  const FEE = { Starter: 15000, Growth: 30000, Premium: 60000 };
  const PAGE = 8;

  /* id, name, industry, contact, plan, manager, status, campaigns, spend(₹L), leads, pending(₹), meta, google, since */
  const mk = (id, name, ind, contact, plan, manager, status, camp, spend, leads, pending, meta, google, since) => {
    const slug = name.toLowerCase().replace(/[^a-z]/g, '');
    return { id, name, ind, contact, plan, manager, status, camp, spend, leads, pending, meta, google, since,
      phone: '+91 98220 1' + String(1000 + id * 37).slice(-4), email: contact.split(' ').pop().toLowerCase() + '@' + slug + '.in', website: slug + '.in',
      ads: A.people.ads[id % 2], designer: A.people.designer[id % 2] };
  };
  let C = [
    mk(1, 'Sharma Garments', 'Fashion retail', 'Rakesh Sharma', 'Premium', 'Riya Shah', 'Active', 6, 1.64, 612, 0, 'ok', 'ok', 'Mar 2025'),
    mk(2, 'Kapoor Jewellers', 'Jewellery', 'Anita Kapoor', 'Premium', 'Kabir Jain', 'Active', 5, 1.48, 296, 0, 'ok', 'none', 'Jan 2025'),
    mk(3, 'Urban Brew Café', 'Food and beverage', 'Vikram Nair', 'Growth', 'Neha Rao', 'Active', 4, 1.12, 488, 32400, 'ok', 'ok', 'Jun 2025'),
    mk(4, 'FitZone Gym', 'Fitness', 'Sandeep Patil', 'Growth', 'Riya Shah', 'Active', 3, 0.96, 541, 26000, 'reconnect', 'none', 'Aug 2025'),
    mk(5, 'Glow Salon', 'Beauty', 'Pooja Desai', 'Starter', 'Neha Rao', 'Active', 4, 0.72, 377, 0, 'ok', 'none', 'Sep 2025'),
    mk(6, 'Green Basket', 'Grocery', 'Imran Shaikh', 'Growth', 'Kabir Jain', 'Active', 3, 0.64, 301, 0, 'ok', 'ok', 'Oct 2025'),
    mk(7, 'Bright Smiles Dental', 'Healthcare', 'Meera Joshi', 'Starter', 'Riya Shah', 'Active', 2, 0.41, 188, 0, 'ok', 'none', 'Nov 2025'),
    mk(8, 'Nest Interiors', 'Home decor', 'Karan Malhotra', 'Growth', 'Kabir Jain', 'Active', 3, 0.55, 142, 18000, 'ok', 'reconnect', 'Dec 2025'),
    mk(9, 'Pune Pedal Cycles', 'Retail', 'Sachin More', 'Starter', 'Neha Rao', 'Inactive', 0, 0, 0, 0, 'none', 'none', 'Feb 2025'),
    mk(10, 'EduSpark Classes', 'Education', 'Priya Kulkarni', 'Growth', 'Riya Shah', 'Active', 2, 0.38, 254, 0, 'ok', 'none', 'Mar 2026'),
    mk(11, 'Royal Tiffin', 'Food delivery', 'Manoj Gaikwad', 'Starter', 'Kabir Jain', 'Inactive', 0, 0, 0, 0, 'none', 'none', 'Apr 2025'),
    mk(12, 'Zenith Motors', 'Automotive', 'Rohit Bhosale', 'Premium', 'Neha Rao', 'Active', 5, 1.21, 167, 0, 'ok', 'ok', 'May 2026'),
  ];
  const find = (id) => C.find((c) => c.id === +id);
  const attention = (c) => c.status === 'Active' && (c.meta === 'reconnect' || c.google === 'reconnect' || c.pending > 0);
  const syncNames = () => { A.clients = C.map((c) => c.name); };
  syncNames();
  $('#fm').innerHTML = '<option value="">All managers</option>' + A.people.manager.map((m) => `<option>${m}</option>`).join('');

  const chip = (s) => s === 'Active' ? '<span class="chip">Active</span>' : '<span class="chip" style="background:var(--hover);color:var(--mute)">Inactive</span>';
  const ACC = { ok: ['', 'Connected'], reconnect: ['dn', 'Reconnect'], none: ['', 'Not connected'] };
  const accChip = (n, s) => `<span class="chip ${ACC[s][0]}" ${s === 'none' ? 'style="background:var(--hover);color:var(--mute)"' : ''}>${n}: ${ACC[s][1]}</span>`;

  /* State */
  const st = { q: '', s: '', p: '', m: '', so: 'name', page: 1, view: 'table', narrow: false };

  function filtered() {
    const q = st.q.trim().toLowerCase();
    const r = C.filter((c) => (!q || [c.name, c.contact, c.email].some((x) => x.toLowerCase().includes(q))) && (!st.s || c.status === st.s) && (!st.p || c.plan === st.p) && (!st.m || c.manager === st.m));
    const by = { name: (a, b) => a.name.localeCompare(b.name), spend: (a, b) => b.spend - a.spend, leads: (a, b) => b.leads - a.leads, new: (a, b) => b.id - a.id };
    return r.sort(by[st.so]);
  }

  function kpis() {
    const act = C.filter((c) => c.status === 'Active').length;
    const K = [['building-2', 'Total clients', C.length], ['circle-check', 'Active', act], ['circle-pause', 'Inactive', C.length - act], ['alert-triangle', 'Need attention', C.filter(attention).length]];
    $('#kpis').innerHTML = K.map(([i, l, v]) => `<div class="card flex min-w-0 items-center gap-2.5 p-3"><div class="ico">${ic(i)}</div><div class="min-w-0"><div class="ttl">${l}</div><div class="truncate text-lg font-bold leading-tight">${v}</div></div></div>`).join('');
  }

  const actions = (c) => `<button class="ibtn" data-act="view" data-id="${c.id}" aria-label="View ${c.name}" title="View">${ic('eye', 'h-3.5 w-3.5')}</button><button class="ibtn" data-act="edit" data-id="${c.id}" aria-label="Edit ${c.name}" title="Edit">${ic('pencil', 'h-3.5 w-3.5')}</button>`;

  function render() {
    kpis();
    const rows = filtered(), pages = Math.max(1, Math.ceil(rows.length / PAGE));
    st.page = Math.min(st.page, pages);
    const sl = rows.slice((st.page - 1) * PAGE, st.page * PAGE);
    const cards = st.narrow || st.view === 'cards';
    $('#vt').classList.toggle('hidden', st.narrow);
    document.querySelectorAll('#vt button').forEach((b) => { const on = b.dataset.v === (cards ? 'cards' : 'table'); b.classList.toggle('bg-card', on); b.classList.toggle('shadow-sm', on); b.classList.toggle('text-mute', !on); });

    if (!sl.length) {
      $('#list').innerHTML = `<div class="grid place-items-center gap-2 px-4 py-12 text-center"><div class="ico">${ic('search-x')}</div><b>No clients match these filters</b><span class="text-xs text-mute">Try a different search or clear the filters.</span><button class="btn-o" data-act="clear">Clear filters</button></div>`;
    } else if (cards) {
      $('#list').innerHTML = `<div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,250px),1fr))] gap-3 p-3">${sl.map((c) => `
        <div class="min-w-0 rounded-xl border border-line p-3">
          <div class="flex min-w-0 items-center gap-2.5"><div class="av">${AV(c.name)}</div><div class="min-w-0 flex-1"><b class="block truncate text-[13px]">${c.name}</b><span class="block truncate text-xs text-mute">${c.ind}</span></div>${chip(c.status)}</div>
          <div class="mt-3 grid grid-cols-3 gap-2 text-center"><div class="min-w-0 rounded-lg bg-bg p-1.5"><div class="truncate text-sm font-bold">${c.camp}</div><div class="truncate text-[11px] text-mute">Campaigns</div></div><div class="min-w-0 rounded-lg bg-bg p-1.5"><div class="truncate text-sm font-bold">₹${c.spend}L</div><div class="truncate text-[11px] text-mute">Spend</div></div><div class="min-w-0 rounded-lg bg-bg p-1.5"><div class="truncate text-sm font-bold">${c.leads}</div><div class="truncate text-[11px] text-mute">Leads</div></div></div>
          <div class="mt-3 flex min-w-0 items-center gap-2"><span class="min-w-0 flex-1 truncate text-xs text-mute">${c.plan} · ${c.manager}</span>${actions(c)}</div>
        </div>`).join('')}</div>`;
    } else {
      $('#list').innerHTML = `<div class="overflow-x-auto"><table class="w-full min-w-[760px] text-[13px]"><thead><tr class="text-left text-xs text-mute"><th class="py-2 pl-3 pr-2 font-medium">Client</th><th class="px-2 font-medium">Contact</th><th class="px-2 font-medium">Package</th><th class="px-2 font-medium">Manager</th><th class="px-2 font-medium">Campaigns</th><th class="px-2 font-medium">Ad spend</th><th class="px-2 font-medium">Status</th><th class="py-2 pl-2 pr-3 text-right font-medium">Actions</th></tr></thead><tbody>${sl.map((c) => `
        <tr class="border-t border-line hover:bg-hov/50">
          <td class="max-w-[220px] py-2 pl-3 pr-2"><div class="flex min-w-0 items-center gap-2.5"><div class="av">${AV(c.name)}</div><div class="min-w-0"><b class="block truncate">${c.name}</b><span class="block truncate text-xs text-mute">${c.ind}</span></div></div></td>
          <td class="max-w-[170px] px-2"><span class="block truncate">${c.contact}</span><span class="block truncate text-xs text-mute">${c.phone}</span></td>
          <td class="px-2">${c.plan}</td><td class="max-w-[130px] truncate px-2">${c.manager}</td><td class="px-2">${c.camp}</td><td class="whitespace-nowrap px-2">₹${c.spend}L</td>
          <td class="px-2">${chip(c.status)}${attention(c) ? `<span class="ml-1 inline-block align-middle text-[var(--amb)]" title="Needs attention">${ic('alert-triangle', 'h-3.5 w-3.5')}</span>` : ''}</td>
          <td class="py-2 pl-2 pr-3"><div class="flex justify-end gap-1.5">${actions(c)}</div></td></tr>`).join('')}</tbody></table></div>`;
    }

    const from = rows.length ? (st.page - 1) * PAGE + 1 : 0;
    $('#pager').innerHTML = `<span>Showing ${from}–${Math.min(st.page * PAGE, rows.length)} of ${rows.length} clients</span><div class="flex items-center gap-2"><button class="ibtn disabled:opacity-40" data-act="prev" aria-label="Previous page" ${st.page <= 1 ? 'disabled' : ''}>${ic('chevron-left', 'h-3.5 w-3.5')}</button><span>Page ${st.page} of ${pages}</span><button class="ibtn disabled:opacity-40" data-act="next" aria-label="Next page" ${st.page >= pages ? 'disabled' : ''}>${ic('chevron-right', 'h-3.5 w-3.5')}</button></div>`;
    A.icons();
  }

  /* Client details: centered overlay */
  function closeDetail() { const d = $('#detail'); if (d) d.remove(); document.body.classList.remove('overflow-hidden'); }
  function detail(id) {
    const c = find(id); if (!c) return;
    closeDetail();
    const row = (l, v) => `<div class="grid grid-cols-[96px_minmax(0,1fr)] gap-2 py-1.5 text-[13px]"><span class="text-mute">${l}</span><span class="min-w-0 break-words font-medium">${v}</span></div>`;
    const stat = (l, v) => `<div class="min-w-0 rounded-lg bg-bg p-2.5"><div class="truncate text-[11px] text-mute">${l}</div><div class="truncate text-base font-bold">${v}</div></div>`;
    const todo = [['Business profile added', true], ['Ad account connected', c.meta === 'ok' || c.google === 'ok'], ['Service package set', true]];
    const el = document.createElement('div');
    el.id = 'detail'; el.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6';
    el.innerHTML = `<aside role="dialog" aria-modal="true" aria-label="Client details" class="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl sm:max-h-[90dvh]">
      <div class="flex shrink-0 items-center gap-2.5 border-b border-line p-4"><div class="av h-10 w-10 text-xs">${AV(c.name)}</div><div class="min-w-0 flex-1"><h2 class="truncate text-base font-semibold">${c.name}</h2><span class="block truncate text-xs text-mute">${c.ind}</span></div>${chip(c.status)}<button data-close aria-label="Close" class="ibtn">${ic('x', 'h-4 w-4')}</button></div>
      <div class="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        <div class="grid grid-cols-2 gap-2">${stat('Campaigns', c.camp)}${stat('Ad spend (30d)', '₹' + c.spend + 'L')}${stat('Leads', c.leads)}${stat('Pending payment', c.pending ? inr(c.pending) : 'None')}</div>
        <div><h3 class="mb-1 text-xs font-semibold text-mute">Details</h3><div class="divide-y divide-line">${row('Package', `${c.plan} (${inr(FEE[c.plan])}/month)`)}${row('Client since', c.since)}${row('Contact', c.contact)}${row('Phone', c.phone)}${row('Email', c.email)}${row('Website', c.website)}</div></div>
        <div><h3 class="mb-1 text-xs font-semibold text-mute">Team</h3><div class="divide-y divide-line">${row('Manager', c.manager)}${row('Ads manager', c.ads)}${row('Designer', c.designer)}</div></div>
        <div><h3 class="mb-2 text-xs font-semibold text-mute">Ad accounts</h3><div class="flex flex-wrap gap-2">${accChip('Meta', c.meta)}${accChip('Google', c.google)}</div></div>
        <div><h3 class="mb-2 text-xs font-semibold text-mute">Onboarding</h3><div class="space-y-1.5">${todo.map(([t, ok]) => `<div class="flex items-center gap-2 text-[13px] ${ok ? '' : 'text-mute'}"><span class="${ok ? 'text-[var(--grn)]' : 'text-mute'}">${ic(ok ? 'circle-check' : 'circle', 'h-4 w-4')}</span>${t}</div>`).join('')}</div></div>
      </div>
      <div class="flex shrink-0 flex-wrap gap-2 border-t border-line p-3"><button class="btn-p" data-act="edit" data-id="${c.id}">${ic('pencil', 'h-3.5 w-3.5')}Edit</button><button class="btn-o" data-act="team" data-id="${c.id}">${ic('users', 'h-3.5 w-3.5')}Assign team</button><button class="btn-o" data-act="invite" data-id="${c.id}">${ic('mail', 'h-3.5 w-3.5')}Invite</button><button class="btn-o ml-auto" data-act="toggle" data-id="${c.id}">${c.status === 'Active' ? 'Deactivate' : 'Activate'}</button></div></aside>`;
    el.addEventListener('click', (e) => { if (e.target === el || e.target.closest('[data-close]')) closeDetail(); });
    document.body.append(el); document.body.classList.add('overflow-hidden'); A.icons();
  }

  /* Clicks */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act, c = find(b.dataset.id);
    if (a === 'view') detail(b.dataset.id);
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

  /* Forms saved from the overlay (including the Create menu in the topbar) */
  document.addEventListener('form:saved', ({ detail: { key, data, vals } }) => {
    if (key === 'client') {
      const id = Math.max(0, ...C.map((c) => c.id)) + 1;
      C.unshift({ ...mk(id, data.name, 'New client', data.contact || 'Not set', data.plan, data.manager, 'Active', 0, 0, 0, 0, 'none', 'none', 'Nov 2026'), phone: data.phone || '-', email: data.email, website: data.website || '-' });
      st.so = 'new'; $('#so').value = 'new';
    } else if (key === 'clientEdit') { const c = find(vals.id); if (c) Object.assign(c, data); }
    else if (key === 'team') { const c = C.find((x) => x.name === data.client); if (c) Object.assign(c, { manager: data.manager, ads: data.ads, designer: data.designer }); }
    else return;
    syncNames(); render();
    const d = $('#detail'); if (d && vals && vals.id) detail(vals.id);
  });

  /* Switch to cards automatically when the content area gets narrow (window resize or sidebar toggle) */
  const cq = document.querySelector('.cq');
  new ResizeObserver(() => { const n = cq.clientWidth < 720; if (n !== st.narrow) { st.narrow = n; render(); } }).observe(cq);
  st.narrow = cq.clientWidth < 720;
  render();
})();