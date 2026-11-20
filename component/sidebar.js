/* Shared sidebar. Add <div id="sidebar-root"></div> to any page and load this file. */
(function () {
  const A = window.AdDesk, H = document.documentElement;
  /* Pages that exist. Add a file name here when you build a new page. */
  const BUILT = ['dashboard.html', 'clients.html', 'campaigns.html', 'creatives.html', 'media.html', 'products.html', 'tasks.html', 'leads.html'];
  const NAV = [
    ['Overview', [['layout-dashboard', 'Dashboard', 'dashboard.html'], ['building-2', 'Clients', 'clients.html'], ['megaphone', 'Campaigns', 'campaigns.html']]],
    ['Work', [['image', 'Creatives & approvals', 'creatives.html', 6], ['folder-open', 'Media library', 'media.html'], ['tags', 'Products & prices', 'products.html'], ['list-checks', 'Tasks', 'tasks.html']]],
    ['Growth', [['users', 'Leads', 'leads.html'], ['bar-chart-3', 'Reports', 'reports.html']]],
    ['Finance', [['receipt', 'Invoices & payments', 'invoices.html'], ['badge-indian-rupee', 'Agency pricing', 'pricing.html']]],
    ['Management', [['user-cog', 'Users & roles', 'users.html'], ['plug', 'Integrations', 'integrations.html'], ['scroll-text', 'Audit log', 'audit.html'], ['settings', 'Settings', 'settings.html']]],
  ];
  const cur = location.pathname.split('/').pop() || 'dashboard.html';
  const ib = 'h-8 w-8 shrink-0 place-items-center rounded-lg border border-line text-mute hover:bg-hov';

  document.getElementById('sidebar-root').innerHTML = `
  <div id="scrim" class="fixed inset-0 z-30 hidden bg-black/40 lg:hidden"></div>
  <aside id="sidebar" aria-label="Main navigation" class="fixed inset-y-0 left-0 z-40 flex w-[248px] -translate-x-full flex-col overflow-hidden border-r border-line bg-card transition-[width,transform] duration-200 lg:w-[var(--sw)] lg:translate-x-0">
    <div class="flex h-14 shrink-0 items-center gap-2 px-3">
      <a href="dashboard.html" class="brandlink flex min-w-0 items-center gap-2 text-lg font-bold text-brand"><span class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand text-white">A</span><span class="truncate">AdDesk</span></a>
      <button id="collapse" aria-label="Collapse or expand sidebar" class="${ib} ml-auto hidden lg:grid"><i data-lucide="panel-left-close" class="ic-close h-4 w-4"></i><i data-lucide="panel-left-open" class="ic-open h-4 w-4"></i></button>
      <button id="sclose" aria-label="Close menu" class="${ib} ml-auto grid lg:hidden"><i data-lucide="x" class="h-4 w-4"></i></button>
    </div>
    <nav class="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 pb-3">
      ${NAV.map(([g, items]) => `<div class="lbl px-2.5 pb-1 pt-4 text-[11px] font-semibold text-mute">${g}</div>` + items.map(([i, l, h, n]) => {
        const on = h === cur;
        return `<a href="${h}" title="${l}" class="nav flex h-9 min-w-0 items-center gap-3 rounded-lg px-2.5 font-medium hover:bg-hov ${on ? 'bg-hov font-semibold text-ink' : 'text-mute hover:text-ink'}"><i data-lucide="${i}" class="h-[18px] w-[18px] shrink-0 ${on ? 'text-brand' : ''}"></i><span class="lbl truncate">${l}</span>${n ? `<span class="lbl ml-auto rounded-full bg-brand px-1.5 text-[11px] font-semibold leading-[18px] text-white">${n}</span>` : ''}</a>`;
      }).join('')).join('')}
    </nav>
    <div class="me m-2 flex min-w-0 shrink-0 items-center gap-2 rounded-xl border border-line p-2"><div class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-soft text-xs font-bold text-brand">JD</div><div class="lbl min-w-0"><b class="block truncate text-xs">John Doe</b><span class="block truncate text-xs text-mute">Agency owner</span></div></div>
  </aside>`;

  const side = document.getElementById('sidebar'), scrim = document.getElementById('scrim');
  const setCollapsed = (c) => { H.classList.toggle('collapsed', c); try { localStorage.setItem('sb-collapsed', c ? '1' : '0'); } catch (e) {} };
  try { H.classList.toggle('collapsed', localStorage.getItem('sb-collapsed') === '1'); } catch (e) {}

  A.openSidebar = (o) => { side.classList.toggle('-translate-x-full', !o); scrim.classList.toggle('hidden', !o); };
  document.getElementById('collapse').onclick = () => setCollapsed(!H.classList.contains('collapsed'));
  document.getElementById('sclose').onclick = scrim.onclick = () => A.openSidebar(false);
  side.addEventListener('click', (e) => {
    const a = e.target.closest('a.nav'); if (!a) return;
    const f = a.getAttribute('href');
    if (!BUILT.includes(f)) { e.preventDefault(); A.toast(a.title + ' page is not built yet'); }
    A.openSidebar(false);
  });
  addEventListener('resize', () => { if (innerWidth >= 1024) A.openSidebar(false); });
})();