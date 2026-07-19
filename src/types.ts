// Shared HTTP contracts for the dashboard and public frontend.
// Dates returned by the API are JSON strings, even though the database uses Date.

export type ISODateString = string;
export type SortOrder = "asc" | "desc";
export type CategoryType = "tour" | "activity";
export type BookingItemType = "tour" | "activity";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type ReviewStatus = "published" | "hidden";

export interface PaginationQuery {
  page: number;
  perPage: number;
}

export interface ApiSuccessResponse {
  statusCode: number;
  message: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}

export type DataResponse<T> = ApiSuccessResponse & { data: T };

// List handlers return their query keys at the top level with data and total.
export type PaginatedResponse<
  T,
  TQuery extends PaginationQuery = PaginationQuery,
> = ApiSuccessResponse &
  TQuery & {
    data: T[];
    total: number;
  };

export interface IdParams {
  id: string;
}

export interface AdminAccount {
  id: string;
  username: string;
  email: string;
  role: number;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface UpdateAdminRequest {
  id: string;
  username: string;
  email: string;
  password: string | null;
  role: number;
}

export interface AdminLoginUser {
  id: string;
  email: string;
  password: null;
}

export type AdminLoginResponse = ApiSuccessResponse & {
  user: AdminLoginUser;
  token: string;
};

export type AdminListResponse = ApiSuccessResponse & {
  data: Array<Pick<AdminAccount, "id" | "email" | "role">>;
  count: number;
};

export interface CustomerAccount {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  registeredAt: ISODateString;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

export interface Customer extends CustomerAccount {
  totalBookings: number;
  totalSpent: number;
}

export interface CustomerSession extends CustomerAccount {
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CustomerQuery extends PaginationQuery {
  query?: string;
  sortBy?: string;
  orderBy?: SortOrder;
}

export interface CustomerLoginRequest {
  email: string;
  password: string;
}

export interface CustomerSignupRequest {
  name: string;
  email: string;
  password: string;
  avatar?: string | null;
  removedImageUrls?: Array<string | null>;
}

export interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  password?: string | null;
  avatar?: string | null;
  removedImageUrls?: Array<string | null>;
}

export type CustomerLoginResponse = ApiSuccessResponse & {
  customer: CustomerSession;
  token: string;
};

export type CustomerListResponse = PaginatedResponse<Customer, CustomerQuery>;
export type CustomerResponse = DataResponse<CustomerAccount>;

export interface Category {
  id: string;
  slug: string;
  label: string;
  image: string | null;
  type: CategoryType;
}

export interface CategoryQuery extends PaginationQuery {
  query?: string;
  type?: CategoryType;
  sortBy?: string;
  orderBy?: SortOrder;
}

export interface AllCategoriesQuery {
  type: CategoryType;
}

export interface CreateCategoryRequest {
  slug: string;
  label: string;
  image?: string | null;
  type: CategoryType;
  removedImageUrls?: Array<string | null>;
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest> & {
  id: string;
};

export type CategoryListResponse = PaginatedResponse<Category, CategoryQuery>;
export type AllCategoriesResponse = DataResponse<Category[]>;
export type CategoryResponse = DataResponse<Category>;

export interface Review {
  id: string;
  customer: string;
  name: string;
  avatar: string | null;
  tour?: string;
  tourId: string;
  rating: number;
  comment: string;
  date: ISODateString;
  status: ReviewStatus;
}

export interface PublicReview {
  id: string;
  name: string;
  avatar: string | null;
  date: ISODateString;
  rating: number;
  comment: string;
}

export interface ReviewQuery extends PaginationQuery {
  query?: string;
  tourId?: string;
  status?: ReviewStatus;
  sortBy?: string;
  orderBy?: SortOrder;
}

export interface CreateReviewRequest {
  tourId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewRequest {
  id: string;
  rating?: number;
  comment?: string;
  status?: ReviewStatus;
}

export type ReviewListResponse = PaginatedResponse<Review, ReviewQuery>;
export type ReviewResponse = DataResponse<Review>;

export interface TourImageInput {
  id?: string;
  url: string;
}

export interface TourHighlightInput {
  id?: string;
  label: string;
}

export interface ItineraryDayInput {
  id?: string;
  day: number;
  title: string;
  description: string;
}

export interface TourImage extends TourImageInput {
  id: string;
}

export interface TourHighlight extends TourHighlightInput {
  id: string;
}

export interface ItineraryDay extends ItineraryDayInput {
  id: string;
}

export interface Tour {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  duration: number;
  difficulty: string;
  categoryId: string;
  category: string;
  capacity: number;
  rating: number;
  reviewCount: number;
  popularity: number;
  images: TourImage[];
  highlights: TourHighlight[];
  itinerary: ItineraryDay[];
  reviews: PublicReview[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface TourQuery extends PaginationQuery {
  query?: string;
  categoryId?: string;
  difficulty?: string;
  sortBy?: string;
  orderBy?: SortOrder;
}

export interface CreateTourRequest {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  duration: number;
  difficulty: string;
  categoryId: string;
  capacity: number;
  rating?: number;
  reviewCount?: number;
  popularity?: number;
  images?: TourImageInput[];
  highlights?: TourHighlightInput[];
  itinerary?: ItineraryDayInput[];
  removedImageUrls?: Array<string | null>;
}

export type UpdateTourRequest = Partial<CreateTourRequest> & { id: string };

export type TourListResponse = PaginatedResponse<Tour, TourQuery>;
export type TourResponse = DataResponse<Tour>;

export interface ActivityImageInput {
  id?: string;
  url: string;
}

export interface ActivityLabelInput {
  id?: string;
  label: string;
}

export interface ActivityImage extends ActivityImageInput {
  id: string;
}

export interface ActivityLabel extends ActivityLabelInput {
  id: string;
}

export interface Activity {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string | null;
  price: number;
  duration: number;
  categoryId: string;
  category: string;
  rating: number;
  meetingPoint: string | null;
  images: ActivityImage[];
  highlights: ActivityLabel[];
  included: ActivityLabel[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface ActivityQuery extends PaginationQuery {
  query?: string;
  categoryId?: string;
  sortBy?: string;
  orderBy?: SortOrder;
}

export interface CreateActivityRequest {
  slug: string;
  title: string;
  description: string;
  longDescription?: string | null;
  price: number;
  duration: number;
  categoryId: string;
  rating?: number;
  meetingPoint?: string | null;
  images?: ActivityImageInput[];
  highlights?: ActivityLabelInput[];
  included?: ActivityLabelInput[];
  removedImageUrls?: Array<string | null>;
}

export type UpdateActivityRequest = Partial<CreateActivityRequest> & {
  id: string;
};

export type ActivityListResponse = PaginatedResponse<Activity, ActivityQuery>;
export type ActivityResponse = DataResponse<Activity>;

export interface BookingCustomer {
  name: string;
  email: string;
  avatar: string | null;
}

export interface BookingEvent {
  at: ISODateString;
  label: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customer: BookingCustomer | null;
  tour: { name: string; type: BookingItemType };
  tourId: string | null;
  activityId: string | null;
  customerId: string;
  travelDate: string;
  createdAt: ISODateString;
  guests: { adults: number; children: number };
  totalPrice: number;
  status: BookingStatus;
  activity: BookingEvent[];
}

export interface BookingQuery extends PaginationQuery {
  query?: string;
  status?: BookingStatus;
  itemType?: BookingItemType;
  sortBy?: string;
  orderBy?: SortOrder;
}

interface CreateBookingBase {
  travelDate: string;
  adults: number;
  children?: number;
}

export type CreateBookingRequest = CreateBookingBase &
  (
    | {
        itemType: "tour";
        tourId: string;
        activityId?: null;
      }
    | {
        itemType: "activity";
        tourId?: null;
        activityId: string;
      }
  );

export interface UpdateBookingRequest {
  travelDate?: string;
  adults?: number;
  children?: number;
  status?: BookingStatus;
}

export type BookingListResponse = PaginatedResponse<Booking, BookingQuery>;
export type BookingResponse = DataResponse<Booking>;

export interface Testimonial {
  id: string;
  name: string;
  avatar: string | null;
  quote: string;
  rating: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface TestimonialQuery extends PaginationQuery {
  query?: string;
  sortBy?: string;
  orderBy?: SortOrder;
}

export interface CreateTestimonialRequest {
  name: string;
  avatar?: string | null;
  quote: string;
  rating: number;
  removedImageUrls?: Array<string | null>;
}

export type UpdateTestimonialRequest = Partial<CreateTestimonialRequest> & {
  id: string;
};

export type TestimonialListResponse = PaginatedResponse<
  Testimonial,
  TestimonialQuery
>;
export type TestimonialResponse = DataResponse<Testimonial>;

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  bookings: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  activeTours: number;
  newCustomers: number;
  trends: {
    revenue: number;
    bookings: number;
    tours: number;
    customers: number;
  };
}

export interface TopTour {
  name: string;
  bookings: number;
  revenue: number;
  rating: number;
}

export interface DashboardData {
  monthlyRevenue: MonthlyRevenue[];
  dashboardStats: DashboardStats;
  topTours: TopTour[];
}

// The dashboard endpoint spreads these fields directly into the response.
export type DashboardResponse = ApiSuccessResponse & DashboardData;

export interface UploadFileRequest {
  url: string;
}

export interface FileUpload {
  url: string;
  filename?: string;
}

export type FileUploadResponse = DataResponse<FileUpload>;
export type BatchFileUploadResponse = DataResponse<string[]>;
