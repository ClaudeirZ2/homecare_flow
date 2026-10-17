// Card genérico usado em dashboards e listagens
export default function Card({ title, value, icon, children }) {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-card)',
        padding: 'var(--space-md)',
      }}
    >
      {title && (
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-xs)' }}>
          {icon} {title}
        </p>
      )}
      {value !== undefined && (
        <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
          {value}
        </p>
      )}
      {children}
    </div>
  );
}
