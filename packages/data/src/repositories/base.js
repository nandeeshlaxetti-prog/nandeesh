"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepositoryImpl = void 0;
exports.createPaginationResult = createPaginationResult;
// Pagination helper function
function createPaginationResult(data, total, page, limit) {
    const totalPages = Math.ceil(total / limit);
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
    };
}
// Repository base class
class BaseRepositoryImpl {
    constructor(prisma) {
        this.prisma = prisma;
    }
    buildPaginationOptions(pagination) {
        const page = pagination?.page || 1;
        const limit = Math.min(pagination?.limit || 20, 100); // Max 100 items per page
        const offset = pagination?.offset || (page - 1) * limit;
        return { page, limit, offset };
    }
    buildSearchFilter(search, fields = []) {
        if (!search)
            return {};
        return {
            OR: fields.map(field => ({
                [field]: {
                    contains: search,
                    mode: 'insensitive',
                },
            })),
        };
    }
    buildDateRangeFilter(fromField, toField, fromDate, toDate) {
        const filter = {};
        if (fromDate) {
            filter[fromField] = { gte: fromDate };
        }
        if (toDate) {
            filter[toField] = { lte: toDate };
        }
        return filter;
    }
}
exports.BaseRepositoryImpl = BaseRepositoryImpl;
