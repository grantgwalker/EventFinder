export interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  description?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
