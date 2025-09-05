export type PaginationOptions = {
  page?: number;
  limit?: number;
};

export type PaginationResult<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  
  export function calculatePagination<T>(
    total: number,
    page: number = 1,
    limit: number = 10
  ): PaginationResult<T>['pagination'] {
    const pages = Math.ceil(total / limit);
    
    return {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1
    };
  }
  
  export function buildPaginationSkipLimit(
    page: number = 1,
    limit: number = 10
  ): { skip: number; take: number } {
    return {
      skip: (page - 1) * limit,
      take: limit
    };
  }