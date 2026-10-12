export default function LibraryStat({ label, value, note, tone = "blue" }) {
  return (
    <article className={`stat-card tone-${tone}`}>
      <div className="stat-top"><span>{label}</span><span className="stat-dot" /></div>
      <strong className="stat-value">{value}</strong>
      <small>{note}</small>
    </article>
  );
}