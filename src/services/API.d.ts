declare namespace API {
  export interface APIResponse {
    meta: Meta;
    data: any;
  }

  export interface Meta {
    locale?: string;
    result_code: number;
    result_message?: string;
    return_code: number;
    return_message?: string;
    timezone?: string;
  }

  export interface PaginationData {
    limit: number;
    page: number;
    sort: string;
    totalRows: number;
    totalPages: number;
  }

  // ---------------------------------------------------------------------------

  export interface ResponseToken extends APIResponse {
    data: Token | null;
  }

  export interface Token {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    token_type: string;
  }
}
