type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-mocha">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl text-truffle sm:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-cocoa/75">{description}</p>
    </div>
  );
}
