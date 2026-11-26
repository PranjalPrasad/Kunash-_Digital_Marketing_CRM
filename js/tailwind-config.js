/* Shared Tailwind theme. Load right after the Tailwind CDN script on every page. */
tailwind.config = { theme: { extend: {
  colors: { bg: 'var(--bg)', card: 'var(--card)', line: 'var(--line)', ink: 'var(--ink)', mute: 'var(--mute)', hov: 'var(--hover)', brand: 'var(--or)', soft: 'var(--soft)' },
  fontFamily: { sans: ['Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'] } } } };