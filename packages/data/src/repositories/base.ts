import { PrismaClient } from '@prisma/client'

// Base pagination interface
export interface PaginationOptions {
  page?: number
  limit?: number
  offset?: number
}

export interface PaginationResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Base repository interface
export interface BaseRepository<T, CreateInput, UpdateInput, FilterOptions> {
  create(data: CreateInput): Promise<T>
  findById(id: string): Promise<T | null>
  findMany(filters?: FilterOptions, pagination?: PaginationOptions): Promise<PaginationResult<T>>
  update(id: string, data: UpdateInput): Promise<T>
  delete(id: string): Promise<void>
  count(filters?: FilterOptions): Promise<number>
}

// Common filter options
export interface BaseFilterOptions {
  search?: string
  status?: string
  createdFrom?: Date
  createdTo?: Date
  updatedFrom?: Date
  updatedTo?: Date
}

// Pagination helper function
export function createPaginationResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginationResult<T> {
  const totalPages = Math.ceil(total / limit)
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}

// Repository base class
export abstract class BaseRepositoryImpl<T, CreateInput, UpdateInput, FilterOptions> 
  implements BaseRepository<T, CreateInput, UpdateInput, FilterOptions> {
  
  constructor(protected prisma: PrismaClient) {}

  abstract create(data: CreateInput): Promise<T>
  abstract findById(id: string): Promise<T | null>
  abstract findMany(filters?: FilterOptions, pagination?: PaginationOptions): Promise<PaginationResult<T>>
  abstract update(id: string, data: UpdateInput): Promise<T>
  abstract delete(id: string): Promise<void>
  abstract count(filters?: FilterOptions): Promise<number>

  protected buildPaginationOptions(pagination?: PaginationOptions) {
    const page = pagination?.page || 1
    const limit = Math.min(pagination?.limit || 20, 100) // Max 100 items per page
    const offset = pagination?.offset || (page - 1) * limit

    return { page, limit, offset }
  }

  protected buildSearchFilter(search?: string, fields: string[] = []) {
    if (!search) return {}
    
    return {
      OR: fields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive' as const,
        },
      })),
    }
  }

  protected buildDateRangeFilter(
    fromField: string,
    toField: string,
    fromDate?: Date,
    toDate?: Date
  ) {
    const filter: any = {}
    
    if (fromDate) {
      filter[fromField] = { gte: fromDate }
    }
    
    if (toDate) {
      filter[toField] = { lte: toDate }
    }
    
    return filter
  }
}
