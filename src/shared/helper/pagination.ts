
export interface PaginationQuery {
    page?: number | string;
    limit?: number | string;
}

export interface PaginationResult {
    page: number;
    limit: number;
    skip: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export const getPagination = (query: PaginationQuery): PaginationResult => {

    let page = Number(query.page) || DEFAULT_PAGE;
    let limit = Number(query.limit) || DEFAULT_LIMIT;

    page = Math.max(page, 1);
    limit = Math.max(1, Math.min(limit, MAX_LIMIT));

    const skip = (page - 1) * limit;

    return {
        page, limit, skip,
    };
};

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
}

export const getPaginationMeta = ({ total, page, limit }: PaginationMeta) => {
    const totalPages = Math.ceil(total / limit);

    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
    };
};