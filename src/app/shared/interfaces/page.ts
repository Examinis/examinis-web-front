export interface Page<T> {
  total: number;
  page: number;
  size: number;
  results: T[];
}