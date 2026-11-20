/* Tasks page only. Sample data: replace `T` with API data later. */
(function () {
  const A = window.AdDesk, $ = (s) => document.querySelector(s);
  const ic = (n, c = 'h-4 w-4') => `<i data-lucide="${n}" class="${c}"></i>`;
  const TODAY = '2026-11-18', PAGE = 10, ME = 'John Doe';
  const fd = (i) => new Date(i + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const AV = (n) => n.split(' ').map((w) => w[0]).slice(0, 2).join('');
  const STATUS = ['To do', 'In progress', 'In review', 'Done'];
  const PR = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
  A.clients = ['Sharma Garments', 'Kapoor Jewellers', 'Urban Brew Café', 'FitZone Gym', 'Glow Salon', 'Green Basket', 'Bright Smiles Dental', 'Nest Interiors', 'EduSpark Classes', 'Zenith Motors', 'Internal'];

  /* id, title, client, related, assignee, priority, due, status, source, desc, log */
  const mk = (id, title, client, related, assignee, priority, due, status, source, desc, log) => ({
    id, title, client, related, assignee, priority, due, status, source: source || 'Manual', desc: desc || '',
    log: log || [[source === 'Price change' ? 'System' : 'Riya Shah', source === 'Price change' ? 'Task created automatically after a price change' : 'Created the task', 'Earlier']],
  });
  let T = [
    mk(1, 'Revise Offer banner for new price', 'Urban Brew Café', 'Creative: Offer banner', 'Priya Menon', 'Urgent', '2026-11-19', 'In progress', 'Price change', 'Cold coffee price changed from ₹180 to ₹160. Update the banner and resubmit for approval.'),
    mk(2, 'Revise Exchange offer banner', 'Zenith Motors', 'Creative: Exchange offer banner', 'Arjun Das', 'Urgent', '2026-11-19', 'To do', 'Price change', 'Exchange bonus changed from ₹30,000 to ₹40,000.'),
    mk(3, 'Revise Batch fee banner', 'EduSpark Classes', 'Creative: Batch fee banner', 'Priya Menon', 'High', '2026-11-18', 'To do', 'Price change', 'Batch fee changed from ₹12,000 to ₹10,500.'),
    mk(4, 'Reconnect Meta ad account', 'FitZone Gym', 'Campaign: Membership Drive', 'Rohan Gupta', 'High', '2026-11-17', 'To do', '', 'Meta token expired. Ask the client admin to reauthorise access.'),
    mk(5, 'Upload bridal reel v3', 'Glow Salon', 'Creative: Bridal reel', 'Arjun Das', 'Medium', '2026-11-20', 'In progress'),
    mk(6, 'Set up Winter Collection campaign', 'Nest Interiors', 'Campaign: Winter Collection', 'Kabir Jain', 'Medium', '2026-11-22', 'In review', '', 'Audience, budget and schedule ready for review.'),
    mk(7, 'Collect overdue payment', 'Urban Brew Café', 'Invoice: INV-0142', 'Riya Shah', 'High', '2026-11-16', 'To do'),
    mk(8, 'Prepare monthly performance report', 'Sharma Garments', 'Reports', 'Neha Rao', 'Medium', '2026-11-25', 'To do'),
    mk(9, 'Shoot product photos', 'Green Basket', 'Media library', 'Arjun Das', 'Low', '2026-11-27', 'To do'),
    mk(10, 'Check budget alert: Bridal Package at 92%', 'Glow Salon', 'Campaign: Bridal Package', 'Sneha Iyer', 'High', '2026-11-18', 'In progress'),
    mk(11, 'Approve Year-end Car Fest brief', 'Zenith Motors', 'Campaign: Year-end Car Fest', ME, 'Medium', '2026-11-19', 'In review'),
    mk(12, 'Client onboarding call', 'EduSpark Classes', '', ME, 'Medium', '2026-11-21', 'To do'),
    mk(13, 'Create Dhanteras campaign report', 'Kapoor Jewellers', 'Campaign: Dhanteras Gold Offer', 'Neha Rao', 'Low', '2026-11-12', 'Done'),
    mk(14, 'Publish Dental Checkup Camp', 'Bright Smiles Dental', 'Campaign: Dental Checkup Camp', 'Rohan Gupta', 'Medium', '2026-11-17', 'Done'),
    mk(15, 'Weekly performance deck', 'Sharma Garments', 'Reports', 'Neha Rao', 'Medium', '2026-11-15', 'Done'),
  ];
  const find = (id) => T.find((t) => t.id === +id);
  const open = (t) => t.status !== 'Done';
  const overdue = (t) => open(t) && t.due < TODAY;
  const today = (t) => open(t) && t.due === TODAY;
  $('#fa').innerHTML = '<option value="">All people</option>' + A.team.map((n) => `<option>${n}</option>`).join('');
  $('#fc').innerHTML = '<option value="">All clients</option>' + A.clients.map((n) => `<option>${n}</option>`).join('');

  const PRS = { Urgent: 'dn', High: 'am', Medium: 'o', Low: 'g' };
  const prChip = (p) => { const v = PRS[p]; return `<span class="chip whitespace-nowrap ${v === 'dn' || v === 'am' ? v : ''}" ${v === 'o' ? 'style="background:var(--soft);color:var(--or)"' : v === 'g' ? 'style="background:var(--hover);color:var(--mute)"' : ''}>${p}</span>`; };
  const dueChip = (t) => `<span class="chip whitespace-nowrap ${overdue(t) ? 'dn' : today(t) ? 'am' : ''}" ${overdue(t) || today(t) ? '' : 'style="background:var(--hover);color:var(--mute)"'}>${ic('calendar', 'h-3 w-3')}${today(t) ? 'Today' : fd(t.due)}</span>`;
  const stChip = (s) => `<span class="chip whitespace-nowrap" ${s === 'To do' ? 'style="background:var(--hover);color:var(--mute)"' : s === 'In progress' ? 'style="background:var(--soft);color:var(--or)"' : s === 'In review' ? 'style="background:var(--ambbg);color:var(--amb)"' : ''}>${s}</span>`;
  const ib = (act, id, icon, label) => `<button class="ibtn" data-act="${act}" data-id="${id}" aria-label="${label}" title="${label}">${ic(icon, 'h-3.5 w-3.5')}</button>`;
  const nextOf = (t) => STATUS[STATUS.indexOf(t.status) + 1];
  const log = (t, text) => t.log.unshift([ME, text, 'Just now']);

  const st = { chip: 'All', q: '', a: '', c: '', p: '', view: 'board', page: 1, narrow: false };
  const CH = { All: () => true, Mine: (t) => t.assignee === ME, 'Due today': today, Overdue: overdue, 'From price change': (t) => t.source === 'Price change' };
  const base = () => { const q = st.q.trim().toLowerCase(); return T.filter((t) => (!q || [t.title, t.client, t.assignee].some((x) => x.toLowerCase().includes(q))) && (!st.a || t.assignee === st.a) && (!st.c || t.client === st.c) && (!st.p || t.priority === st.p)); };
  const filtered = () => base().filter(CH[st.chip]).sort((a, b) => (a.status === 'Done') - (b.status === 'Done') || a.due.localeCompare(b.due) || PR[a.priority] - PR[b.priority]);

  function summary() {
    const K = [['list-checks', 'Open tasks', T.filter(open).length], ['calendar-clock', 'Due today', T.filter(today).length], ['alert-triangle', 'Overdue', T.filter(overdue).length], ['eye', 'In review', T.filter((t) => t.status === 'In review').length], ['circle-check', 'Done', T.filter((t) => t.status === 'Done').length]];
    $('#kpis').innerHTML = K.map(([i, l, v]) => `<div class="card flex min-w-0 items-center gap-2.5 p-3"><div class="ico">${ic(i)}</div><div class="min-w-0"><div class="ttl">${l}</div><div class="truncate text-lg font-bold leading-tight">${v}</div></div></div>`).join('');
    const b = base();
    $('#chips').innerHTML = Object.keys(CH).map((k) => { const on = st.chip === k; return `<button data-chip="${k}" class="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium ${on ? 'border-brand bg-soft text-brand' : 'border-line text-mute hover:bg-hov hover:text-ink'}">${k}<span class="text-[11px] opacity-70">${b.filter(CH[k]).length}</span></button>`; }).join('');
  }

  const card = (t) => `<div draggable="true" data-id="${t.id}" class="group min-w-0 cursor-grab rounded-lg border border-line bg-card p-2.5 shadow-sm active:cursor-grabbing">
    <div class="flex items-center justify-between gap-2">${prChip(t.priority)}${t.source === 'Price change' ? `<span class="text-brand" title="Created after a price change">${ic('zap', 'h-3.5 w-3.5')}</span>` : ''}</div>
    <button data-act="view" data-id="${t.id}" class="mt-2 block w-full text-left"><b class="line-clamp-2 break-words text-[13px]">${t.title}</b><span class="mt-0.5 block truncate text-xs text-mute">${t.client}</span></button>
    <div class="mt-2.5 flex items-center gap-1.5"><span class="av" title="${t.assignee}">${AV(t.assignee)}</span><span class="min-w-0 flex-1 truncate text-xs text-mute">${t.assignee}</span>${dueChip(t)}${nextOf(t) ? ib('next', t.id, 'arrow-right', 'Move to ' + nextOf(t)) : ''}</div></div>`;

  function render() {
    summary();
    const rows = filtered(), board = st.narrow || st.view === 'board';
    $('#vt').classList.toggle('hidden', st.narrow);
    document.querySelectorAll('#vt button').forEach((b) => { const on = b.dataset.v === (board ? 'board' : 'list'); b.classList.toggle('bg-card', on); b.classList.toggle('shadow-sm', on); b.classList.toggle('text-mute', !on); });
    $('#pager').classList.toggle('hidden', board);
    if (!rows.length) {
      $('#list').innerHTML = `<div class="grid place-items-center gap-2 px-4 py-12 text-center"><div class="ico">${ic('search-x')}</div><b>No tasks found</b><span class="text-xs text-mute">Change the filters or create a new task.</span><button class="btn-o" data-act="clear">Clear filters</button></div>`;
      $('#pager').classList.add('hidden');
    } else if (board) {
      $('#list').innerHTML = `<div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-3 p-3">${STATUS.map((s) => { const col = rows.filter((t) => t.status === s); return `
        <div data-col="${s}" class="min-w-0 rounded-xl bg-bg p-2"><div class="mb-2 flex items-center gap-2 px-1"><b class="text-xs">${s}</b><span class="rounded-full bg-card px-1.5 text-[11px] text-mute">${col.length}</span><button class="ibtn ml-auto h-6 w-6" data-act="add" data-s="${s}" aria-label="Add task to ${s}">${ic('plus', 'h-3.5 w-3.5')}</button></div>
          <div class="min-h-[60px] space-y-2">${col.map(card).join('') || '<div class="rounded-lg border border-dashed border-line p-3 text-center text-xs text-mute">No tasks</div>'}</div></div>`; }).join('')}</div>`;
    } else {
      const pages = Math.max(1, Math.ceil(rows.length / PAGE)); st.page = Math.min(st.page, pages);
      const sl = rows.slice((st.page - 1) * PAGE, st.page * PAGE), from = (st.page - 1) * PAGE + 1;
      $('#list').innerHTML = `<div class="overflow-x-auto"><table class="w-full min-w-[820px] text-[13px]"><thead><tr class="text-left text-xs text-mute"><th class="py-2 pl-3 pr-2 font-medium">Task</th><th class="px-2 font-medium">Assignee</th><th class="px-2 font-medium">Priority</th><th class="px-2 font-medium">Due</th><th class="px-2 font-medium">Status</th><th class="py-2 pl-2 pr-3 text-right font-medium">Actions</th></tr></thead><tbody>${sl.map((t) => `
        <tr class="border-t border-line hover:bg-hov/50"><td class="max-w-[280px] py-2 pl-3 pr-2"><div class="flex min-w-0 items-center gap-1.5"><b class="truncate">${t.title}</b>${t.source === 'Price change' ? `<span class="shrink-0 text-brand" title="Created after a price change">${ic('zap', 'h-3.5 w-3.5')}</span>` : ''}</div><span class="block truncate text-xs text-mute">${t.client}</span></td>
          <td class="max-w-[150px] px-2"><div class="flex min-w-0 items-center gap-1.5"><span class="av">${AV(t.assignee)}</span><span class="truncate">${t.assignee}</span></div></td>
          <td class="px-2">${prChip(t.priority)}</td><td class="px-2">${dueChip(t)}</td><td class="px-2">${stChip(t.status)}</td>
          <td class="py-2 pl-2 pr-3"><div class="flex justify-end gap-1.5">${ib('view', t.id, 'eye', 'View')}${ib('edit', t.id, 'pencil', 'Edit')}${nextOf(t) ? ib('next', t.id, 'arrow-right', 'Move to ' + nextOf(t)) : ''}</div></td></tr>`).join('')}</tbody></table></div>`;
      $('#pager').classList.remove('hidden');
      $('#pager').innerHTML = `<span>Showing ${from}–${Math.min(st.page * PAGE, rows.length)} of ${rows.length} tasks</span><div class="flex items-center gap-2"><button class="ibtn disabled:opacity-40" data-act="prev" aria-label="Previous page" ${st.page <= 1 ? 'disabled' : ''}>${ic('chevron-left', 'h-3.5 w-3.5')}</button><span>Page ${st.page} of ${pages}</span><button class="ibtn disabled:opacity-40" data-act="next-page" aria-label="Next page" ${st.page >= pages ? 'disabled' : ''}>${ic('chevron-right', 'h-3.5 w-3.5')}</button></div>`;
    }
    A.icons();
  }

  /* Task details: centered overlay */
  function closeDetail() { const d = $('#detail'); if (d) d.remove(); document.body.classList.remove('overflow-hidden'); }
  function detail(id) {
    const t = find(id); if (!t) return;
    closeDetail();
    const row = (l, v) => `<div class="grid grid-cols-[88px_minmax(0,1fr)] gap-2 py-1.5 text-[13px]"><span class="text-mute">${l}</span><span class="min-w-0 break-words font-medium">${v}</span></div>`;
    const warn = overdue(t) ? `<div class="flex items-center gap-1.5 rounded-lg bg-[var(--redbg)] p-3 text-[13px] font-semibold text-[var(--red)]">${ic('alert-triangle')}Overdue since ${fd(t.due)}</div>` : '';
    const el = document.createElement('div');
    el.id = 'detail'; el.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6';
    el.innerHTML = `<div role="dialog" aria-modal="true" aria-label="Task details" class="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl sm:max-h-[90dvh]">
      <div class="flex shrink-0 items-center gap-2.5 border-b border-line p-4"><div class="min-w-0 flex-1"><h2 class="break-words text-base font-semibold leading-snug">${t.title}</h2><span class="block truncate text-xs text-mute">${t.client}</span></div><button data-close aria-label="Close" class="ibtn">${ic('x')}</button></div>
      <div class="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        <div class="grid grid-cols-2 gap-1 rounded-lg bg-bg p-1 sm:grid-cols-4">${STATUS.map((s) => `<button data-act="status" data-id="${t.id}" data-s="${s}" class="truncate rounded-md px-2 py-1.5 text-xs font-medium ${t.status === s ? 'bg-card text-ink shadow-sm' : 'text-mute hover:text-ink'}">${s}</button>`).join('')}</div>
        ${warn}
        <div class="divide-y divide-line">${row('Assignee', t.assignee)}${row('Priority', prChip(t.priority))}${row('Due', fd(t.due) + (today(t) ? ' (today)' : ''))}${row('Related to', t.related || 'None')}${row('Source', t.source === 'Price change' ? 'Created automatically after a price change' : 'Created manually')}</div>
        ${t.desc ? `<div><h3 class="mb-1 text-xs font-semibold text-mute">Description</h3><p class="break-words text-[13px]">${t.desc}</p></div>` : ''}
        <div><h3 class="mb-2 text-xs font-semibold text-mute">Comments and activity</h3><div class="space-y-2.5">${t.log.map(([who, text, when]) => `<div class="flex gap-2.5 text-[13px]"><span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand"></span><div class="min-w-0"><div class="break-words">${text}</div><div class="text-xs text-mute">${who}, ${when}</div></div></div>`).join('')}</div></div>
      </div>
      <div class="flex shrink-0 flex-wrap gap-2 border-t border-line p-3"><button class="btn-p" data-act="edit" data-id="${t.id}">${ic('pencil', 'h-3.5 w-3.5')}Edit</button><button class="btn-o" data-act="comment" data-id="${t.id}">${ic('message-square-plus', 'h-3.5 w-3.5')}Add comment</button><button class="btn-d ml-auto" data-act="delete" data-id="${t.id}">${ic('trash-2', 'h-3.5 w-3.5')}Delete</button></div></div>`;
    el.addEventListener('click', (e) => { if (e.target === el || e.target.closest('[data-close]')) closeDetail(); });
    document.body.append(el); document.body.classList.add('overflow-hidden'); A.icons();
  }
  const refresh = (id) => { render(); if ($('#detail')) (find(id) ? detail(id) : closeDetail()); };
  function move(t, s) { if (!t || t.status === s) return; const from = t.status; t.status = s; log(t, `Moved from ${from} to ${s}`); A.toast(`${t.title}: ${s}`); refresh(t.id); }

  /* Clicks */
  document.addEventListener('click', (e) => {
    const ch = e.target.closest('[data-chip]'); if (ch) { st.chip = ch.dataset.chip; st.page = 1; render(); return; }
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act, t = find(b.dataset.id);
    if (a === 'new' || a === 'add') A.openForm('task', { priority: 'Medium', status: b.dataset.s || 'To do', assignee: A.team[0], due: TODAY });
    else if (a === 'view') detail(t.id);
    else if (a === 'edit') A.openForm('taskEdit', t);
    else if (a === 'next') move(t, nextOf(t));
    else if (a === 'status') move(t, b.dataset.s);
    else if (a === 'comment') A.openForm('taskComment', { id: t.id, label: t.title });
    else if (a === 'delete') A.openForm('taskDelete', { id: t.id, label: t.title });
    else if (a === 'prev') { st.page--; render(); } else if (a === 'next-page') { st.page++; render(); }
    else if (a === 'clear') { Object.assign(st, { chip: 'All', q: '', a: '', c: '', p: '', page: 1 }); $('#q').value = ''; ['fa', 'fc', 'fp'].forEach((i) => ($('#' + i).value = '')); render(); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !e.defaultPrevented) closeDetail(); });
  const bind = (id, key, ev = 'change') => $(id).addEventListener(ev, (e) => { st[key] = e.target.value; st.page = 1; render(); });
  bind('#q', 'q', 'input'); bind('#fa', 'a'); bind('#fc', 'c'); bind('#fp', 'p');
  $('#vt').onclick = (e) => { const b = e.target.closest('button'); if (b) { st.view = b.dataset.v; render(); } };

  /* Drag and drop between board columns */
  let dragId = null;
  document.addEventListener('dragstart', (e) => { const c = e.target.closest && e.target.closest('[data-id][draggable]'); if (c) { dragId = c.dataset.id; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', dragId); c.classList.add('opacity-50'); } });
  document.addEventListener('dragend', () => { dragId = null; document.querySelectorAll('[draggable].opacity-50').forEach((c) => c.classList.remove('opacity-50')); document.querySelectorAll('[data-col]').forEach((c) => c.classList.remove('ring-2', 'ring-[var(--or)]')); });
  document.addEventListener('dragover', (e) => { const col = e.target.closest && e.target.closest('[data-col]'); if (col && dragId) { e.preventDefault(); document.querySelectorAll('[data-col]').forEach((c) => c.classList.toggle('ring-2', c === col)); col.classList.add('ring-[var(--or)]'); } });
  document.addEventListener('drop', (e) => { const col = e.target.closest && e.target.closest('[data-col]'); if (col && dragId) { e.preventDefault(); move(find(dragId), col.dataset.col); dragId = null; } });

  /* Overlay forms */
  document.addEventListener('form:saved', ({ detail: { key, data, vals } }) => {
    const t = vals && vals.id ? find(vals.id) : null;
    const f = (d) => ({ title: d.title, client: d.client, assignee: d.assignee, priority: d.priority, due: d.due, status: d.status, related: d.related || '', desc: d.desc || '' });
    if (key === 'task') {
      const id = Math.max(0, ...T.map((x) => x.id)) + 1, d = f(data);
      T.push(mk(id, d.title, d.client, d.related, d.assignee, d.priority, d.due, d.status, '', d.desc, [[ME, 'Created the task and assigned it to ' + d.assignee, 'Just now']]));
      st.chip = 'All';
    } else if (key === 'taskEdit' && t) {
      const ch = [], d = f(data);
      if (d.assignee !== t.assignee) ch.push('Reassigned to ' + d.assignee);
      if (d.due !== t.due) ch.push('Due date changed to ' + fd(d.due));
      if (d.priority !== t.priority) ch.push('Priority changed to ' + d.priority);
      if (d.status !== t.status) ch.push('Status changed to ' + d.status);
      Object.assign(t, d); (ch.length ? ch : ['Details updated']).reverse().forEach((x) => log(t, x));
    } else if (key === 'taskComment' && t) log(t, data.comment);
    else if (key === 'taskDelete' && t) { T = T.filter((x) => x.id !== t.id); }
    else return;
    refresh(t ? t.id : undefined);
  });

  const cq = document.querySelector('.cq');
  new ResizeObserver(() => { const n = cq.clientWidth < 720; if (n !== st.narrow) { st.narrow = n; render(); } }).observe(cq);
  st.narrow = cq.clientWidth < 720;
  render();
})();