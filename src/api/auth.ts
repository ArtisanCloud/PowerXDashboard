import axios from 'axios';

export interface LoginRequest {
  userName?: string;
  phoneNumber?: string;
  email?: string;
  password: string;
}

export interface LoginReply {
  token: string;
  refreshToken: string;
}

export interface ExchangeRequest {
  type?: string;
  code: string;
}

export interface ExchangeReply {
  token: string;
  refreshToken: string;
}

export function login(request: LoginRequest) {
  return axios.post<LoginReply>(
    '/api/v1/admin/auth/access/actions/basic-login',
    request
  );
}

export function exchangeToken(request: ExchangeRequest) {
  return axios.post<ExchangeReply>(
    '/api/v1/admin/auth/access/actions/exchange-token',
    request
  );
}
