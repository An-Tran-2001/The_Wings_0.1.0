export interface PagePaginationResponse {
    count: number;
    next: string | null;
    previous: string | null;
}

export interface PagePaginationRequest {
    page: number;
    page_size: number;
}
