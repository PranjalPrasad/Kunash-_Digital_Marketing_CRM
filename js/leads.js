/* Leads page only. Sample data: replace `L` with API data later. */
(function () {
  const A = window.AdDesk, $ = (s) => document.querySelector(s);
  const ic = (n, c = 'h-4 w-4') => `<i data-lucide="${n}" class="${c}"></i>`;
  const TODAY = '2026-11-18', PAGE = 10, ME = 'John Doe';
  const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
  const val = (n) => (n >= 100000 ? '₹' + +(n / 100000).toFixed(2) + 'L' : inr(n));
  const fd = (i) => new Date(i + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const AV = (n) => n.split(' ').map((w) => w[0]).slice(0, 2).join('');
  const STATUS = ['New', 'Contacted', 'Qualified', 'Won', 'Lost'];
  const SRC = { 'Meta Lead Ad': 'megaphone', 'Google Ads': 'search', Website: 'globe', Manual: 'user-plus' };
  A.clients = ['Sharma Garments', 'Kapoor Jewellers', 'Urban Brew Café', 'FitZone Gym', 'Glow Salon', 'Green Basket', 'Bright Smiles Dental', 'Nest Interiors', 'EduSpark Classes', 'Zenith Motors'];

  /* name, client, campaign, source, status, interest, owner, value, created, follow-up, note, lost reason */
  const R = [
    ['Aditi Verma', 'Sharma Garments', 'Diwali Sale 2026', 'Meta Lead Ad', 'New', 'Hot', '', 12000, '2026-11-18', '2026-11-18', 'Asked about silk sarees under ₹5,000.'],
    ['Rahul Deshmukh', 'Sharma Garments', 'Diwali Sale 2026', 'Google Ads', 'Contacted', 'Warm', 'Riya Shah', 8500, '2026-11-16', '2026-11-19', 'Will visit the store this weekend.'],
    ['Sunita Rao', 'Glow Salon', 'Bridal Package', 'Meta Lead Ad', 'Qualified', 'Hot', 'Neha Rao', 25000, '2026-11-14', '2026-11-18', 'Wedding on 12 Dec. Wants a trial makeup first.'],
    ['Mohit Jain', 'FitZone Gym', 'Membership Drive', 'Meta Lead Ad', 'New', 'Warm', '', 11999, '2026-11-18', '', ''],
    ['Kavita Patil', 'FitZone Gym', 'Membership Drive', 'Meta Lead Ad', 'Contacted', 'Cold', 'Kabir Jain', 11999, '2026-11-12', '2026-11-17', 'Not picking up calls. Try WhatsApp.'],
    ['Amit Shah', 'Urban Brew Café', 'Cold Coffee Offer', 'Website', 'Won', 'Warm', 'Neha Rao', 4500, '2026-11-05', '', 'Booked a corporate coffee order.'],
    ['Neha Kulkarni', 'Nest Interiors', 'Winter Collection', 'Website', 'Qualified', 'Hot', 'Kabir Jain', 32000, '2026-11-15', '2026-11-20', 'Interested in the 3-seater sofa.'],
    ['Rohan Mehta', 'Zenith Motors', 'Year-end Car Fest', 'Google Ads', 'New', 'Hot', '', 600000, '2026-11-18', '2026-11-18', 'Wants a test drive and exchange quote.'],
    ['Pooja Nair', 'Bright Smiles Dental', 'Dental Checkup Camp', 'Meta Lead Ad', 'New', 'Warm', 'Riya Shah', 3000, '2026-11-17', '2026-11-19', ''],
    ['Sanjay Gupta', 'Kapoor Jewellers', 'Dhanteras Gold Offer', 'Manual', 'Won', 'Hot', 'Kabir Jain', 76000, '2026-10-28', '', 'Bought two 10 g coins.'],
    ['Farah Khan', 'EduSpark Classes', 'Exam Prep Batch', 'Website', 'Contacted', 'Warm', 'Neha Rao', 10500, '2026-11-13', '2026-11-18', 'Asked about the fee after the price drop.'],
    ['Vikas Pawar', 'Green Basket', 'Fresh Veg Weekend', 'Google Ads', 'Lost', 'Cold', 'Riya Shah', 1200, '2026-11-09', '', '', 'Outside service area'],
    ['Divya Iyer', 'Glow Salon', 'Bridal Package', 'Meta Lead Ad', 'Contacted', 'Hot', 'Neha Rao', 24999, '2026-11-17', '2026-11-19', 'Comparing two salons.'],
    ['Arjun Kapoor', 'Kapoor Jewellers', 'Dhanteras Gold Offer', 'Meta Lead Ad', 'Lost', 'Cold', 'Kabir Jain', 38500, '2026-11-01', '', '', 'Price too high'],
    ['Meena Joshi', 'Sharma Garments', 'Diwali Sale 2026', 'Meta Lead Ad', 'Won', 'Hot', 'Riya Shah', 15000, '2026-11-02', '', 'Ordered 3 sarees.'],
    ['Tushar Bhosale', 'Zenith Motors', 'Year-end Car Fest', 'Manual', 'Qualified', 'Warm', 'Neha Rao', 450000, '2026-11-16', '2026-11-21', 'Wants to finalise after the exchange valuation.'],
    ['Isha Malhotra', 'Nest Interiors', 'Winter Collection', 'Meta Lead Ad', 'New', 'Cold', '', 25600, '2026-11-18', '', ''],
    ['Karan Singh', 'Urban Brew Café', 'Cold Coffee Offer', 'Meta Lead Ad', 'Contacted', 'Cold', 'Riya Shah', 800, '2026-11-15', '2026-11-16', ''],
  ];
  const mk = (id, [name, client, campaign, source, status, rating, owner, value, created, followup, notes, lost], log) => ({
    id, name, client, campaign, source, status, rating, owner, value, created, followup, notes, lost: lost || '',
    phone: '+91 9' + String(8000000000 + id * 7919317).slice(-9).replace(/(\d{4})(\d{5})/, '$1 $2'), email: name.split(' ')[0].toLowerCase() + '@example.com',
    log: log || [['System', 'Lead received from ' + source, fd(created)]],
  });
  let L = R.map((r, i) => mk(i + 1, r));
  const find = (id) => L.find((l) => l.id === +id);
  const open = (l) => l.status !== 'Won' && l.status !== 'Lost';
  const due = (l) => open(l) && l.followup && l.followup <= TODAY;
  const nextOf = (l) => ({ New: 'Contacted', Contacted: 'Qualified', Qualified: 'Won' })[l.status];
  const waDigits = (l) => l.phone.replace(/\D/g, '');
  $('#fc').innerHTML = '<option value="">All clients</option>' + A.clients.map((n) => `<option>${n}</option>`).join('');
  $('#fa').innerHTML = '<option value="">All owners</option>' + A.owners.map((n) => `<option>${n}</option>`).join('');

  /* UI helpers */
  const RT = { Hot: 'dn', Warm: 'am', Cold: 'g' };
  const ratingChip = (r) => `<span class="chip whitespace-nowrap ${RT[r] === 'g' ? '' : RT[r]}" ${RT[r] === 'g' ? 'style="background:var(--hover);color:var(--mute)"' : ''}>${r}</span>`;
  const stChip = (s) => `<span class="chip whitespace-nowrap" ${s === 'New' ? 'style="background:var(--soft);color:var(--or)"' : s === 'Contacted' ? 'style="background:var(--ambbg);color:var(--amb)"' : s === 'Lost' ? 'style="background:var(--redbg);color:var(--red)"' : ''}>${s}</span>`;
  const fuChip = (l) => (l.followup && open(l) ? `<span class="chip whitespace-nowrap ${l.followup < TODAY ? 'dn' : l.followup === TODAY ? 'am' : ''}" ${l.followup > TODAY ? 'style="background:var(--hover);color:var(--mute)"' : ''}>${ic('calendar', 'h-3 w-3')}${l.followup === TODAY ? 'Today' : fd(l.followup)}</span>` : '');
  const ownerHtml = (l) => (l.owner ? `<span class="av" title="${l.owner}">${AV(l.owner)}</span><span class="min-w-0 truncate text-xs text-mute">${l.owner}</span>` : '<span class="chip" style="background:var(--hover);color:var(--mute)">Unassigned</span>');
  const ib = (act, id, icon, label) => `<button class="ibtn" data-act="${act}" data-id="${id}" aria-label="${label}" title="${label}">${ic(icon, 'h-3.5 w-3.5')}</button>`;
  const lk = (href, icon, label) => `<a href="${href}" ${href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''} class="ibtn" aria-label="${label}" title="${label}">${ic(icon, 'h-3.5 w-3.5')}</a>`;
  const log = (l, text) => l.log.unshift([ME, text, 'Just now']);

  const st = { chip: 'All', q: '', c: '', s: '', a: '', view: 'board', page: 1, narrow: false };
  const CH = { All: () => true, 'Follow-up due': due, Unassigned: (l) => !l.owner && open(l), Hot: (l) => l.rating === 'Hot' && open(l) };
  const base = () => { const q = st.q.trim().toLowerCase(); return L.filter((l) => (!q || [l.name, l.phone, l.email, l.client].some((x) => x.toLowerCase().includes(q))) && (!st.c || l.client === st.c) && (!st.s || l.source === st.s) && (!st.a || (st.a === 'Unassigned' ? !l.owner : l.owner === st.a))); };
  const filtered = () => base().filter(CH[st.chip]).sort((a, b) => b.created.localeCompare(a.created) || b.id - a.id);

  function summary() {
    const won = L.filter((l) => l.status === 'Won').length;
    const K = [['users', 'Total leads', L.length], ['sparkles', 'New', L.filter((l) => l.status === 'New').length], ['badge-check', 'Qualified', L.filter((l) => l.status === 'Qualified').length], ['trophy', 'Won', won], ['percent', 'Conversion', Math.round((won / (L.length || 1)) * 100) + '%']];
    $('#kpis').innerHTML = K.map(([i, l, v]) => `<div class="card flex min-w-0 items-center gap-2.5 p-3"><div class="ico">${ic(i)}</div><div class="min-w-0"><div class="ttl">${l}</div><div class="truncate text-lg font-bold leading-tight">${v}</div></div></div>`).join('');
    const b = base();
    $('#chips').innerHTML = Object.keys(CH).map((k) => { const on = st.chip === k; return `<button data-chip="${k}" class="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium ${on ? 'border-brand bg-soft text-brand' : 'border-line text-mute hover:bg-hov hover:text-ink'}">${k}<span class="text-[11px] opacity-70">${b.filter(CH[k]).length}</span></button>`; }).join('');
  }

  const card = (l) => `<div draggable="true" data-id="${l.id}" class="min-w-0 cursor-grab rounded-lg border border-line bg-card p-2.5 shadow-sm active:cursor-grabbing">
    <div class="flex items-center justify-between gap-2">${ratingChip(l.rating)}<span class="flex min-w-0 items-center gap-1 text-[11px] text-mute" title="${l.source}">${ic(SRC[l.source], 'h-3 w-3 shrink-0')}<span class="truncate">${l.source}</span></span></div>
    <button data-act="view" data-id="${l.id}" class="mt-2 block w-full text-left"><b class="block truncate text-[13px]">${l.name}</b><span class="block truncate text-xs text-mute">${l.client}</span></button>
    <div class="mt-2 flex min-w-0 items-center justify-between gap-2"><div class="flex min-w-0 items-center gap-1.5">${ownerHtml(l)}</div>${fuChip(l)}</div>
    <div class="mt-2.5 flex items-center gap-1.5"><span class="min-w-0 flex-1 truncate text-xs font-semibold">${val(l.value)}</span>${lk('tel:' + l.phone.replace(/\s/g, ''), 'phone', 'Call')}${lk('https://wa.me/' + waDigits(l), 'message-circle', 'WhatsApp')}${nextOf(l) ? ib('next', l.id, 'arrow-right', 'Move to ' + nextOf(l)) : ''}</div></div>`;

  function render() {
    summary();
    const rows = filtered(), board = st.narrow || st.view === 'board';
    $('#vt').classList.toggle('hidden', st.narrow);
    document.querySelectorAll('#vt button').forEach((b) => { const on = b.dataset.v === (board ? 'board' : 'list'); b.classList.toggle('bg-card', on); b.classList.toggle('shadow-sm', on); b.classList.toggle('text-mute', !on); });
    $('#pager').classList.toggle('hidden', board);
    if (!rows.length) {
      $('#list').innerHTML = `<div class="grid place-items-center gap-2 px-4 py-12 text-center"><div class="ico">${ic('search-x')}</div><b>No leads found</b><span class="text-xs text-mute">Change the filters or add a new lead.</span><button class="btn-o" data-act="clear">Clear filters</button></div>`;
      $('#pager').classList.add('hidden');
    } else if (board) {
      $('#list').innerHTML = `<div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] gap-3 p-3">${STATUS.map((s) => { const col = rows.filter((l) => l.status === s), sum = col.reduce((t, l) => t + l.value, 0); return `
        <div data-col="${s}" class="min-w-0 rounded-xl bg-bg p-2"><div class="mb-2 flex items-center gap-2 px-1"><b class="text-xs">${s}</b><span class="rounded-full bg-card px-1.5 text-[11px] text-mute">${col.length}</span><span class="ml-auto truncate text-[11px] text-mute">${val(sum)}</span></div>
          <div class="min-h-[60px] space-y-2">${col.map(card).join('') || '<div class="rounded-lg border border-dashed border-line p-3 text-center text-xs text-mute">No leads</div>'}</div></div>`; }).join('')}</div>`;
    } else {
      const pages = Math.max(1, Math.ceil(rows.length / PAGE)); st.page = Math.min(st.page, pages);
      const sl = rows.slice((st.page - 1) * PAGE, st.page * PAGE), from = (st.page - 1) * PAGE + 1;
      $('#list').innerHTML = `<div class="overflow-x-auto"><table class="w-full min-w-[900px] text-[13px]"><thead><tr class="text-left text-xs text-mute"><th class="py-2 pl-3 pr-2 font-medium">Lead</th><th class="px-2 font-medium">Contact</th><th class="px-2 font-medium">Source</th><th class="px-2 font-medium">Interest</th><th class="px-2 font-medium">Owner</th><th class="px-2 font-medium">Follow-up</th><th class="px-2 font-medium">Status</th><th class="py-2 pl-2 pr-3 text-right font-medium">Actions</th></tr></thead><tbody>${sl.map((l) => `
        <tr class="border-t border-line hover:bg-hov/50"><td class="max-w-[220px] py-2 pl-3 pr-2"><b class="block truncate">${l.name}</b><span class="block truncate text-xs text-mute">${l.client} · ${val(l.value)}</span></td>
          <td class="max-w-[180px] px-2"><span class="block truncate">${l.phone}</span><span class="block truncate text-xs text-mute">${l.email}</span></td>
          <td class="whitespace-nowrap px-2 text-xs">${l.source}</td><td class="px-2">${ratingChip(l.rating)}</td>
          <td class="max-w-[150px] px-2"><div class="flex min-w-0 items-center gap-1.5">${ownerHtml(l)}</div></td><td class="px-2">${fuChip(l) || '<span class="text-xs text-mute">-</span>'}</td><td class="px-2">${stChip(l.status)}${l.status === 'Lost' && l.lost ? `<div class="truncate text-[11px] text-mute">${l.lost}</div>` : ''}</td>
          <td class="py-2 pl-2 pr-3"><div class="flex justify-end gap-1.5">${ib('view', l.id, 'eye', 'View')}${lk('tel:' + l.phone.replace(/\s/g, ''), 'phone', 'Call')}${nextOf(l) ? ib('next', l.id, 'arrow-right', 'Move to ' + nextOf(l)) : ''}</div></td></tr>`).join('')}</tbody></table></div>`;
      $('#pager').innerHTML = `<span>Showing ${from}–${Math.min(st.page * PAGE, rows.length)} of ${rows.length} leads</span><div class="flex items-center gap-2"><button class="ibtn disabled:opacity-40" data-act="prev" aria-label="Previous page" ${st.page <= 1 ? 'disabled' : ''}>${ic('chevron-left', 'h-3.5 w-3.5')}</button><span>Page ${st.page} of ${pages}</span><button class="ibtn disabled:opacity-40" data-act="next-page" aria-label="Next page" ${st.page >= pages ? 'disabled' : ''}>${ic('chevron-right', 'h-3.5 w-3.5')}</button></div>`;
    }
    A.icons();
  }

  /* Lead details: centered overlay */
  function closeDetail() { const d = $('#detail'); if (d) d.remove(); document.body.classList.remove('overflow-hidden'); }
  function detail(id) {
    const l = find(id); if (!l) return;
    closeDetail();
    const row = (k, v) => `<div class="grid grid-cols-[96px_minmax(0,1fr)] gap-2 py-1.5 text-[13px]"><span class="text-mute">${k}</span><span class="min-w-0 break-words font-medium">${v}</span></div>`;
    const warn = due(l) ? `<div class="flex items-center gap-1.5 rounded-lg bg-[var(--ambbg)] p-3 text-[13px] font-semibold text-[var(--amb)]">${ic('calendar-clock')}Follow-up ${l.followup < TODAY ? 'overdue since ' + fd(l.followup) : 'due today'}</div>` : l.status === 'Lost' ? `<div class="rounded-lg bg-[var(--redbg)] p-3 text-[13px] font-semibold text-[var(--red)]">Lost: ${l.lost || 'No reason recorded'}</div>` : l.status === 'Won' ? `<div class="flex items-center gap-1.5 rounded-lg bg-[var(--grnbg)] p-3 text-[13px] font-semibold text-[var(--grn)]">${ic('trophy')}Won, ${inr(l.value)}</div>` : '';
    const el = document.createElement('div');
    el.id = 'detail'; el.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6';
    el.innerHTML = `<div role="dialog" aria-modal="true" aria-label="Lead details" class="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl sm:max-h-[90dvh]">
      <div class="flex shrink-0 items-center gap-2.5 border-b border-line p-4"><div class="min-w-0 flex-1"><h2 class="truncate text-base font-semibold">${l.name}</h2><span class="block truncate text-xs text-mute">${l.client}</span></div>${ratingChip(l.rating)}<button data-close aria-label="Close" class="ibtn">${ic('x')}</button></div>
      <div class="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        <div class="grid grid-cols-3 gap-1 rounded-lg bg-bg p-1 sm:grid-cols-5">${STATUS.map((s) => `<button data-act="status" data-id="${l.id}" data-s="${s}" class="truncate rounded-md px-1.5 py-1.5 text-xs font-medium ${l.status === s ? 'bg-card text-ink shadow-sm' : 'text-mute hover:text-ink'}">${s}</button>`).join('')}</div>
        ${warn}
        <div class="flex flex-wrap gap-2"><a class="btn-o" href="tel:${l.phone.replace(/\s/g, '')}">${ic('phone', 'h-3.5 w-3.5')}Call</a><a class="btn-o" target="_blank" rel="noopener" href="https://wa.me/${waDigits(l)}">${ic('message-circle', 'h-3.5 w-3.5')}WhatsApp</a><a class="btn-o" href="mailto:${l.email}">${ic('mail', 'h-3.5 w-3.5')}Email</a></div>
        <div class="divide-y divide-line">${row('Phone', l.phone)}${row('Email', `<span class="break-all">${l.email}</span>`)}${row('Campaign', l.campaign || 'None')}${row('Source', l.source)}${row('Owner', l.owner || 'Unassigned')}${row('Follow-up', l.followup && open(l) ? fd(l.followup) : 'Not scheduled')}${row('Potential value', inr(l.value))}${row('Received', fd(l.created))}</div>
        ${l.notes ? `<div><h3 class="mb-1 text-xs font-semibold text-mute">Notes</h3><p class="break-words text-[13px]">${l.notes}</p></div>` : ''}
        <div><h3 class="mb-2 text-xs font-semibold text-mute">Activity</h3><div class="space-y-2.5">${l.log.map(([who, text, when]) => `<div class="flex gap-2.5 text-[13px]"><span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand"></span><div class="min-w-0"><div class="break-words">${text}</div><div class="text-xs text-mute">${who}, ${when}</div></div></div>`).join('')}</div></div>
      </div>
      <div class="flex shrink-0 flex-wrap gap-2 border-t border-line p-3"><button class="btn-p" data-act="edit" data-id="${l.id}">${ic('pencil', 'h-3.5 w-3.5')}Edit</button><button class="btn-o" data-act="followup" data-id="${l.id}">${ic('calendar-plus', 'h-3.5 w-3.5')}Follow-up</button><button class="btn-o" data-act="note" data-id="${l.id}">${ic('message-square-plus', 'h-3.5 w-3.5')}Add note</button><button class="btn-d ml-auto" data-act="delete" data-id="${l.id}">${ic('trash-2', 'h-3.5 w-3.5')}Delete</button></div></div>`;
    el.addEventListener('click', (e) => { if (e.target === el || e.target.closest('[data-close]')) closeDetail(); });
    document.body.append(el); document.body.classList.add('overflow-hidden'); A.icons();
  }
  const refresh = (id) => { render(); if ($('#detail')) (find(id) ? detail(id) : closeDetail()); };

  /* Moving a lead. Lost always asks for a reason. */
  function move(l, s) {
    if (!l || l.status === s) return;
    if (s === 'Lost') { A.openForm('leadLost', { id: l.id, label: l.name }); return; }
    const from = l.status; l.status = s; l.lost = '';
    log(l, `Moved from ${from} to ${s}`); A.toast(`${l.name}: ${s}`); refresh(l.id);
  }

  /* CSV export of the filtered list */
  function exportCsv() {
    const rows = filtered(), esc = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
    const head = ['Name', 'Phone', 'Email', 'Client', 'Campaign', 'Source', 'Status', 'Interest', 'Owner', 'Value', 'Received', 'Follow-up'];
    const csv = [head, ...rows.map((l) => [l.name, l.phone, l.email, l.client, l.campaign, l.source, l.status, l.rating, l.owner || 'Unassigned', l.value, l.created, l.followup])].map((r) => r.map(esc).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'leads.csv'; document.body.append(a); a.click(); a.remove();
    A.toast(`Exported ${rows.length} leads`);
  }

  /* Clicks */
  document.addEventListener('click', (e) => {
    const ch = e.target.closest('[data-chip]'); if (ch) { st.chip = ch.dataset.chip; st.page = 1; render(); return; }
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act, l = find(b.dataset.id);
    if (a === 'new') A.openForm('lead', { source: 'Manual', rating: 'Warm', owner: 'Unassigned', followup: TODAY });
    else if (a === 'export') exportCsv();
    else if (a === 'view') detail(l.id);
    else if (a === 'edit') A.openForm('leadEdit', { ...l, note: l.notes, owner: l.owner || 'Unassigned' });
    else if (a === 'next') move(l, nextOf(l));
    else if (a === 'status') move(l, b.dataset.s);
    else if (a === 'followup') A.openForm('followup', { id: l.id, label: l.name, followup: l.followup || TODAY });
    else if (a === 'note') A.openForm('leadNote', { id: l.id, label: l.name });
    else if (a === 'delete') A.openForm('leadDelete', { id: l.id, label: l.name });
    else if (a === 'prev') { st.page--; render(); } else if (a === 'next-page') { st.page++; render(); }
    else if (a === 'clear') { Object.assign(st, { chip: 'All', q: '', c: '', s: '', a: '', page: 1 }); $('#q').value = ''; ['fc', 'fs', 'fa'].forEach((i) => ($('#' + i).value = '')); render(); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !e.defaultPrevented) closeDetail(); });
  const bind = (id, key, ev = 'change') => $(id).addEventListener(ev, (e) => { st[key] = e.target.value; st.page = 1; render(); });
  bind('#q', 'q', 'input'); bind('#fc', 'c'); bind('#fs', 's'); bind('#fa', 'a');
  $('#vt').onclick = (e) => { const b = e.target.closest('button'); if (b) { st.view = b.dataset.v; render(); } };

  /* Drag and drop between pipeline columns */
  let dragId = null;
  document.addEventListener('dragstart', (e) => { const c = e.target.closest && e.target.closest('[data-id][draggable]'); if (c) { dragId = c.dataset.id; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', dragId); c.classList.add('opacity-50'); } });
  document.addEventListener('dragend', () => { dragId = null; document.querySelectorAll('[draggable].opacity-50').forEach((c) => c.classList.remove('opacity-50')); document.querySelectorAll('[data-col]').forEach((c) => c.classList.remove('ring-2', 'ring-[var(--or)]')); });
  document.addEventListener('dragover', (e) => { const col = e.target.closest && e.target.closest('[data-col]'); if (col && dragId) { e.preventDefault(); document.querySelectorAll('[data-col]').forEach((c) => c.classList.toggle('ring-2', c === col)); col.classList.add('ring-[var(--or)]'); } });
  document.addEventListener('drop', (e) => { const col = e.target.closest && e.target.closest('[data-col]'); if (col && dragId) { e.preventDefault(); move(find(dragId), col.dataset.col); dragId = null; } });

  /* Overlay forms (including "Add lead" from the topbar Create menu) */
  document.addEventListener('form:saved', ({ detail: { key, data, vals } }) => {
    const l = vals && vals.id ? find(vals.id) : null, owner = (data.owner || '') === 'Unassigned' ? '' : data.owner || '';
    if (key === 'lead') {
      const id = Math.max(0, ...L.map((x) => x.id)) + 1;
      L.unshift(mk(id, [data.name, data.client, data.campaign || '', data.source, 'New', data.rating, owner, +data.value || 0, TODAY, data.followup || '', data.note || ''], [[ME, 'Added the lead manually', 'Just now']]));
      Object.assign(st, { chip: 'All', page: 1 });
    } else if (key === 'leadEdit' && l) {
      const ch = [];
      if (owner !== l.owner) ch.push(owner ? 'Assigned to ' + owner : 'Unassigned');
      if (data.rating !== l.rating) ch.push('Interest changed to ' + data.rating);
      if ((data.followup || '') !== l.followup) ch.push(data.followup ? 'Follow-up set for ' + fd(data.followup) : 'Follow-up removed');
      Object.assign(l, { name: data.name, phone: data.phone, email: data.email, client: data.client, source: data.source, rating: data.rating, owner, value: +data.value || 0, followup: data.followup || '', campaign: data.campaign || '', notes: data.note || '' });
      (ch.length ? ch : ['Details updated']).reverse().forEach((x) => log(l, x));
    } else if (key === 'followup' && l) { l.followup = data.followup; log(l, 'Follow-up scheduled for ' + fd(data.followup) + (data.note ? ': ' + data.note : '')); }
    else if (key === 'leadNote' && l) log(l, data.comment);
    else if (key === 'leadLost' && l) { l.status = 'Lost'; l.lost = data.reason; l.followup = ''; log(l, 'Marked as lost: ' + data.reason + (data.note ? ' (' + data.note + ')' : '')); }
    else if (key === 'leadDelete' && l) { L = L.filter((x) => x.id !== l.id); }
    else return;
    refresh(l ? l.id : undefined);
  });

  const cq = document.querySelector('.cq');
  new ResizeObserver(() => { const n = cq.clientWidth < 720; if (n !== st.narrow) { st.narrow = n; render(); } }).observe(cq);
  st.narrow = cq.clientWidth < 720;
  render();
})();