export interface Activity {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  price: number;
  duration: number; // hours
  category: string;
  images: ActivityImage[];
  rating: number;
  highlights?: ActivityLabel[];
  included?: ActivityLabel[];
  meetingPoint?: string;
}

export interface ActivityImage {
  id?: string;
  url: string;
}

export interface ActivityLabel {
  id?: string;
  label: string;
}
