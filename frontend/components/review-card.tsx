type ReviewCardProps = {
  name: string;
  text: string;
  rating: number;
};

export function ReviewCard({ name, text, rating }: ReviewCardProps) {
  return (
    <div className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-soft backdrop-blur-sm">
      <p className="text-gold">Rating: {rating}/5</p>
      <p className="mt-5 text-base leading-7 text-cocoa/80">{text}</p>
      <p className="mt-6 font-semibold text-truffle">{name}</p>
    </div>
  );
}
