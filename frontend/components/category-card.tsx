import Image from "next/image";

type CategoryCardProps = {
  title: string;
  emoji: string;
  image: string;
  description: string;
};

export function CategoryCard({ title, emoji, image, description }: CategoryCardProps) {
  return (
    <div className="group overflow-hidden rounded-[1.5rem] border border-white/60 bg-white/70 shadow-soft backdrop-blur-sm transition duration-500 hover:-translate-y-2 hover:shadow-glow">
      <div className="relative h-36 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-truffle/60 to-transparent" />
        <div className="absolute bottom-6 left-6 rounded-full bg-white/85 px-4 py-2 text-sm font-medium text-cocoa backdrop-blur">
          {emoji} {title}
        </div>
      </div>
      <div className="p-6">
        <p className="text-sm leading-7 text-cocoa/75">{description}</p>
      </div>
    </div>
  );
}
