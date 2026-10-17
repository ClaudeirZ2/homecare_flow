// Logo "Home Care Flow": coração em azul petróleo + verde-água (cores da identidade visual)
export default function Logo({ tamanho = 30, escuro = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={tamanho} height={tamanho} viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id="hcf-verde" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4fd1b5" />
            <stop offset="100%" stopColor="#1a9e86" />
          </linearGradient>
        </defs>
        <path d="M16 28 C6 21 2 15 2 10 a7 7 0 0 1 14 -2 Z" fill="#4b7fa8" />
        <path d="M16 28 C26 21 30 15 30 10 a7 7 0 0 0 -14 -2 Z" fill="url(#hcf-verde)" />
        <circle cx="25" cy="4" r="2" fill="#4fd1b5" />
      </svg>
      <span style={{ fontWeight: 700, fontSize: '1.15rem', color: escuro ? 'var(--color-primary-dark)' : '#fff' }}>
        Home Care <span style={{ color: 'var(--color-accent-light)', fontStyle: 'italic' }}>Flow</span>
      </span>
    </div>
  );
}
