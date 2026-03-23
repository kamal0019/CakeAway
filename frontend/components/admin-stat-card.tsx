type AdminStatCardProps = {
  label: string;
  value: string;
  note: string;
};

export function AdminStatCard({ label, value, note }: AdminStatCardProps) {
  return (
    <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-soft backdrop-blur-sm">
      <p className="text-sm uppercase tracking-[0.25em] text-mocha">{label}</p>
      <p className="mt-4 font-display text-4xl text-truffle">{value}</p>
      <p className="mt-3 text-sm text-cocoa/70">{note}</p>
    </div>
  );
}
