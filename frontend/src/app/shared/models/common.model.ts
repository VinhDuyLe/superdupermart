// src/app/shared/models/common.model.ts
export type BigDecimal = number;
export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}