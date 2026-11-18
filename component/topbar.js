/* Shared topbar. Add <div id="topbar-root"></div> to any page and load this file after sidebar.js. */
(function () {
  const A = window.AdDesk, H = document.documentElement;
  try { const s = localStorage.getItem('theme'); H.classList.toggle('dark', s ? s === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches); } catch (e) {}
  const ib = 'relative grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-card text-mute hover:bg-hov';
  const ACTIONS = [['user-plus', 'New client', 'client'], ['megaphone', 'New campaign', 'campaign'], ['file-up', 'Upload creative', 'creative'], ['users', 'Add lead', 'lead'], ['receipt', 'Create invoice', 'invoice']];

  document.getElementById('topbar-root').innerHTML = `
  <header class="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-line bg-card px-3 sm:px-5">
    <button id="burger" aria-label="Open menu" class="${ib} lg:hidden"><i data-lucide="menu" class="h-[18px] w-[18px]"></i></button>
    <label class="hidden h-9 min-w-0 max-w-sm flex-1 items-center gap-2 rounded-lg border border-line px-3 text-mute sm:flex"><i data-lucide="search" class="h-4 w-4 shrink-0"></i><input aria-label="Search" placeholder="Search clients, campaigns, leads" class="w-full min-w-0 bg-transparent text-ink outline-none"></label>
    <div class="flex-1"></div>
    <button id="theme" aria-label="Switch theme" class="${ib}"><i data-lucide="moon" class="h-[18px] w-[18px]"></i></button>
    <button data-toast="8 items need attention" aria-label="Notifications" class="${ib}"><i data-lucide="bell" class="h-[18px] w-[18px]"></i><span class="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-card bg-brand"></span></button>
    <div class="relative">
      <button id="create" aria-haspopup="true" class="flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3 font-semibold text-white"><i data-lucide="plus" class="h-4 w-4"></i><span class="hidden sm:inline">Create</span><i data-lucide="chevron-down" class="h-4 w-4"></i></button>
      <div id="cmenu" class="absolute right-0 top-11 z-30 hidden w-52 max-w-[calc(100vw-1.5rem)] rounded-xl border border-line bg-card p-1.5 shadow-xl">
        ${ACTIONS.map(([i, l, k]) => `<button data-form="${k}" class="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-hov"><i data-lucide="${i}" class="h-4 w-4 shrink-0 text-brand"></i><span class="truncate">${l}</span></button>`).join('')}
      </div>
    </div>
  </header>`;

  const menu = document.getElementById('cmenu');
  document.getElementById('burger').onclick = () => A.openSidebar(true);
  document.getElementById('create').onclick = (e) => { e.stopPropagation(); menu.classList.toggle('hidden'); };
  document.addEventListener('click', () => menu.classList.add('hidden'));
  document.getElementById('theme').onclick = () => { const d = H.classList.toggle('dark'); try { localStorage.setItem('theme', d ? 'dark' : 'light'); } catch (e) {} };
})();