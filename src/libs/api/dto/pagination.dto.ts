export enum Order {
  DESC = "desc",
  ASC = "asc",
}

export interface PaginationQueryDto {
  page?: number;
  perPage?: number;
  order?: Order;
  orderKey?: string;
}

export interface CursorPaginationQueryDto {
  cursor?: string;
  limit?: number;
  order?: Order;
  orderKey?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
}

export interface CursorPaginatedResponse<T> {
  items: T[];
  hasMore: boolean;
  nextCursor?: string;
}
