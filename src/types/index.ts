export interface Event {
  id: number;
  name: string;
  date: string;
  time?: string;
  location: string;
  description?: string;
  price?: string;
  category?: string;
  url?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
