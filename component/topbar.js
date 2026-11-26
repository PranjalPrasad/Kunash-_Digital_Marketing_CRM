/* Shared topbar. Add <div id="topbar-root"></div> to any page and load this file after sidebar.js. */
(function () {
  const A = window.AdDesk, H = document.documentElement;
  try { const s = localStorage.getItem('theme'); H.classList.toggle('dark', s ? s === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches); } catch (e) {}
  const ib = 'tb-icon';
  const ACTIONS = [['user-plus', 'New client', 'client'], ['megaphone', 'New campaign', 'campaign'], ['search', 'Run Google ad', 'googleAd'], ['message-circle', 'Run WhatsApp campaign', 'waCampaign'], ['file-up', 'Upload creative', 'creative'], ['users', 'Add lead', 'lead'], ['receipt', 'Create invoice', 'invoice']];

  document.getElementById('topbar-root').innerHTML = `
  <header class="sticky top-0 z-20 flex items-center">
    <button id="menuBtn" aria-label="Open menu" title="Menu" class="${ib} lg:hidden"><i data-lucide="menu" class="h-[18px] w-[18px]"></i></button>
    <div class="tb-welcome">Welcome to <span>Kunash CRM</span></div>
    <label class="tb-search hidden sm:flex"><input type="search" aria-label="Search" placeholder="Search clients, campaigns, leads"><span class="go"><i data-lucide="search" class="h-4 w-4"></i></span></label>
    <div class="flex-1"></div>
    <button id="theme" aria-label="Switch theme" class="${ib}"><i data-lucide="moon" class="h-[18px] w-[18px]"></i></button>
    <div class="relative" id="notifWrap">
      <button id="bellBtn" aria-label="Notifications" aria-haspopup="true" aria-expanded="false" aria-controls="notifPanel" class="${ib}"><i data-lucide="bell" class="h-[18px] w-[18px]"></i><span id="bellDot" class="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500"></span></button>
      <div id="notifPanel" role="dialog" aria-label="Notifications" class="np-panel hidden">
        <div class="np-head"><div><h4>Notifications</h4><small id="npSub"></small></div><button id="npReadAll" type="button" class="np-link">Mark all read</button></div>
        <div class="np-tabs" role="tablist"><button type="button" role="tab" data-f="all" class="is-active">All</button><button type="button" role="tab" data-f="unread">Unread</button></div>
        <ul id="npList" class="np-list"></ul>
        <button type="button" id="npAll" class="np-foot">View all notifications</button>
      </div>
    </div>
    <div class="relative">
      <button id="create" aria-haspopup="true" class="flex h-9 items-center gap-1.5 bg-brand px-4 font-semibold text-white"><i data-lucide="plus" class="h-4 w-4"></i><span class="hidden sm:inline">Create</span><i data-lucide="chevron-down" class="h-4 w-4"></i></button>
      <div id="cmenu" class="absolute right-0 top-11 z-30 hidden w-56 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-line bg-card p-1.5 shadow-xl">
        ${ACTIONS.map(([i, l, k]) => `<button data-form="${k}" class="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left hover:bg-soft hover:text-brand"><i data-lucide="${i}" class="h-4 w-4 shrink-0 text-brand"></i><span class="truncate">${l}</span></button>`).join('')}
      </div>
    </div>
    <div class="tb-avatar"><span class="av2">JD</span><div class="text-left"><strong>John Doe</strong><small>Agency owner</small></div></div>
  </header>`;

  const menu = document.getElementById('cmenu');
  document.getElementById('menuBtn').onclick = () => A.toggleMenu();
  document.getElementById('create').onclick = (e) => { e.stopPropagation(); document.getElementById('notifPanel').classList.add('hidden'); menu.classList.toggle('hidden'); };
  document.addEventListener('click', () => menu.classList.add('hidden'));
  document.getElementById('theme').onclick = () => { const d = H.classList.toggle('dark'); try { localStorage.setItem('theme', d ? 'dark' : 'light'); } catch (e) {} };

  /* ---------- Notification dropdown ---------- */
  const NOTES = [
    ['image', 'New creative waiting for approval', 'Sharma Garments · Diwali carousel', '5 min ago', 1],
    ['receipt', 'Invoice overdue', 'Urban Brew Café · INV-1042 · ₹ 48,500', '1 hr ago', 1],
    ['alert-triangle', 'Campaign budget almost used', 'Kapoor Jewellers · 92% of daily budget', '2 hr ago', 1],
    ['users', '12 new leads today', 'FitZone Gym · Meta lead form', '3 hr ago', 0],
    ['check-circle-2', 'Payment received', 'Glow Salon · ₹ 22,000', 'Yesterday', 0],
  ];
  const panel = document.getElementById('notifPanel'), bell = document.getElementById('bellBtn'), list = document.getElementById('npList');
  let filter = 'all';
  const unread = () => NOTES.filter((n) => n[4]).length;
  const draw = () => {
    const u = unread(), rows = NOTES.filter((n) => filter === 'all' || n[4]);
    document.getElementById('npSub').textContent = u ? u + ' unread' : "You're all caught up";
    document.getElementById('bellDot').classList.toggle('hidden', !u);
    list.innerHTML = rows.length ? rows.map((n, i) => `<li class="np-item ${n[4] ? 'is-unread' : ''}"><span class="np-ico"><i data-lucide="${n[0]}" class="h-4 w-4"></i></span><div class="min-w-0 flex-1"><b>${n[1]}</b><span>${n[2]}</span><small>${n[3]}</small></div>${n[4] ? '<i class="np-dot"></i>' : ''}</li>`).join('') : '<li class="np-empty">Nothing here</li>';
    if (window.lucide) lucide.createIcons();
  };
  const closeNotif = () => { panel.classList.add('hidden'); bell.setAttribute('aria-expanded', 'false'); };
  bell.onclick = (e) => { e.stopPropagation(); menu.classList.add('hidden'); const o = panel.classList.toggle('hidden') === false; bell.setAttribute('aria-expanded', o); if (o) draw(); };
  panel.addEventListener('click', (e) => e.stopPropagation());
  panel.querySelectorAll('.np-tabs button').forEach((t) => t.onclick = () => { filter = t.dataset.f; panel.querySelectorAll('.np-tabs button').forEach((x) => x.classList.toggle('is-active', x === t)); draw(); });
  document.getElementById('npReadAll').onclick = () => { NOTES.forEach((n) => n[4] = 0); draw(); };
  document.getElementById('npAll').onclick = () => { closeNotif(); A.toast && A.toast('Notifications page is not built yet'); };
  list.addEventListener('click', (e) => { const li = e.target.closest('.np-item'); if (!li) return; const i = [...list.children].indexOf(li); const row = NOTES.filter((n) => filter === 'all' || n[4])[i]; if (row) { row[4] = 0; draw(); } });
  document.addEventListener('click', closeNotif);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNotif(); });
  draw();
})();