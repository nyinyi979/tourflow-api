export interface Review {
  id: string;
  name: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
}

export interface AdminReview {
  id: string;
  customer: string;
  avatar: string;
  tour: string;
  rating: number;
  comment: string;
  date: string;
  status: "published" | "hidden";
}
