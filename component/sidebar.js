/* Shared sidebar. Add <div id="sidebar-root"></div> to any page and load this file. */
(function () {
  const A = window.AdDesk, H = document.documentElement;
  /* Pages that exist. Add a file name here when you build a new page. */
  const BUILT = ['dashboard.html', 'clients.html', 'campaigns.html', 'creatives.html', 'media.html', 'products.html', 'tasks.html', 'leads.html', 'reports.html', 'invoices.html', 'pricing.html', 'users.html', 'integrations.html', 'audit.html', 'settings.html'];
  const NAV = [
    ['Overview', [['layout-dashboard', 'Dashboard', 'dashboard.html'], ['building-2', 'Clients', 'clients.html'], ['megaphone', 'Campaigns', 'campaigns.html']]],
    ['Work', [['image', 'Creatives & approvals', 'creatives.html', 6], ['folder-open', 'Media library', 'media.html'], ['tags', 'Products & prices', 'products.html'], ['list-checks', 'Tasks', 'tasks.html']]],
    ['Growth', [['users', 'Leads', 'leads.html'], ['bar-chart-3', 'Reports', 'reports.html']]],
    ['Finance', [['receipt', 'Invoices & payments', 'invoices.html'], ['badge-indian-rupee', 'Agency pricing', 'pricing.html']]],
    ['Management', [['user-cog', 'Users & roles', 'users.html'], ['plug', 'Integrations', 'integrations.html'], ['scroll-text', 'Audit log', 'audit.html'], ['settings', 'Settings', 'settings.html']]],
  ];
  const cur = location.pathname.split('/').pop() || 'dashboard.html';
  const GI = { Overview: 'layout-grid', Work: 'briefcase', Growth: 'trending-up', Finance: 'wallet', Management: 'settings-2' }; /* icon for each main module */
  const ib = 'grid place-items-center';
  let closed = []; try { closed = JSON.parse(localStorage.getItem('sb-groups') || '[]'); } catch (e) {}

  document.getElementById('sidebar-root').innerHTML = `
  <div id="scrim" class="fixed inset-0 z-30 hidden bg-black/40 lg:hidden"></div>
  <aside id="sidebar" aria-label="Main navigation" class="fixed inset-y-0 left-0 z-40 flex w-[256px] -translate-x-full flex-col overflow-hidden transition-[width,transform] duration-200 lg:w-[var(--sw)] lg:translate-x-0">
    <div class="sb-top">
      <a href="dashboard.html" class="sb-logo brandlink-keep" aria-label="Kunash Media – Dashboard"><img src="/assets/logo.png" alt="Kunash Media"></a>
      <button id="collapse" type="button" aria-label="Collapse or expand sidebar" title="Collapse / expand sidebar" class="sb-collapse hidden lg:grid"><i data-lucide="panel-left-close" class="ic-close h-[18px] w-[18px]"></i><i data-lucide="panel-left-open" class="ic-open h-[18px] w-[18px]"></i></button>
    </div>
    <button id="sclose" aria-label="Close menu" class="${ib} lg:hidden"><i data-lucide="x" class="h-4 w-4"></i></button>
    <nav class="sb-nav min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
      ${NAV.map(([g, items]) => `<div class="grp${closed.includes(g) && !items.some((x) => x[2] === cur) ? ' is-closed' : ''}" data-g="${g}"><button type="button" title="${g}" class="grp-head" aria-expanded="${closed.includes(g) && !items.some((x) => x[2] === cur) ? 'false' : 'true'}"><i data-lucide="${GI[g]}" class="h-[18px] w-[18px] shrink-0"></i><span class="truncate">${g}</span><i data-lucide="chevron-down" class="grp-chev h-4 w-4 shrink-0"></i></button><div class="grp-items">` + items.map(([i, l, h, n]) => {
        const on = h === cur;
        return `<a href="${h}" title="${l}" class="nav flex min-w-0 items-center ${on ? 'is-active' : ''}"><i data-lucide="${i}" class="h-[18px] w-[18px] shrink-0"></i><span class="lbl truncate">${l}</span>${n ? `<span class="lbl badge-n">${n}</span>` : ''}</a>`;
      }).join('') + '</div></div>').join('')}
    </nav>
    <svg class="sb-deco" viewBox="0 0 256 230" fill="#fff" aria-hidden="true"><path d="M0 230C20 135 92 100 148 128 116 148 96 188 106 230z" opacity=".11"/><path d="M70 230C90 160 170 118 270 148V230z" opacity=".08"/><path d="M140 230C158 180 198 160 262 170V230z" opacity=".11"/></svg>
  </aside>`;

  const side = document.getElementById('sidebar'), scrim = document.getElementById('scrim');
  const setCollapsed = (c) => { H.classList.toggle('collapsed', c); try { localStorage.setItem('sb-collapsed', c ? '1' : '0'); } catch (e) {} };
  try { H.classList.toggle('collapsed', localStorage.getItem('sb-collapsed') === '1'); } catch (e) {}

  A.openSidebar = (o) => { side.classList.toggle('-translate-x-full', !o); scrim.classList.toggle('hidden', !o); };
  /* The menu button now lives in the topbar (like the reference): desktop = collapse/expand, mobile = open drawer */
  document.getElementById('collapse').onclick = () => setCollapsed(!H.classList.contains('collapsed'));
  A.toggleMenu = () => { if (innerWidth >= 1024) setCollapsed(!H.classList.contains('collapsed')); else A.openSidebar(true); };
  document.getElementById('sclose').onclick = scrim.onclick = () => A.openSidebar(false);
  /* Expand / collapse each menu group (remembered across pages) */
  side.querySelectorAll('.grp-head').forEach((btn) => btn.addEventListener('click', () => {
    const grp = btn.parentElement, shut = grp.classList.toggle('is-closed');
    btn.setAttribute('aria-expanded', shut ? 'false' : 'true');
    const set = new Set(closed); shut ? set.add(grp.dataset.g) : set.delete(grp.dataset.g); closed = [...set];
    try { localStorage.setItem('sb-groups', JSON.stringify(closed)); } catch (e) {}
  }));
  side.addEventListener('click', (e) => {
    const a = e.target.closest('a.nav'); if (!a) return;
    const f = a.getAttribute('href');
    if (!BUILT.includes(f)) { e.preventDefault(); A.toast(a.title + ' page is not built yet'); }
    A.openSidebar(false);
  });
  addEventListener('resize', () => { if (innerWidth >= 1024) A.openSidebar(false); });
})();