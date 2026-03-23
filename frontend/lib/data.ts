export type Cake = {
  slug: string;
  name: string;
  price: number;
  rating: number;
  flavour: string;
  type: string;
  image: string;
  gallery: string[];
  description: string;
  badge?: string;
};

export type Category = {
  title: string;
  emoji?: string;
  image: string;
  description: string;
};
