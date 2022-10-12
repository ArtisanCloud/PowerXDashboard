declare namespace API {
  export interface ResponseSystemInstalledStatus extends APIResponse {
    data: SystemInstalledStatus[];
  }
  export interface SystemInstalledStatus {
    name: string;
    status: string;
    errMsg: string;
  }

  export interface RequestInstallSystem {
    appConfig: AppConfig;
  }

  export interface Server {
    host: string;
    port: string;
  }

  export interface JWT {
    public_key: string;
    private_key: string;
  }

  export interface System {
    maintenance: boolean;
  }

  export interface Log {
    log_path: string;
  }

  export interface Schemas {
    default: string;
    option: string;
  }

  export interface Pgsql {
    driver: string;
    url: string;
    host: string;
    port: string;
    database: string;
    username: string;
    password: string;
    charset: string;
    prefix: string;
    prefix_indexes: string;
    schemas: Schemas;
    search_path: string;
    ssl_mode: string;
    debug: boolean;
  }

  export interface Connections {
    pgsql: Pgsql;
    mysql?: any;
  }

  export interface Database {
    default: string;
    debug: boolean;
    connections: Connections;
  }

  export interface Redis {
    max_idle: number;
    max_active: number;
    expiration: number;
    timeout_connect: number;
    timeout_read: number;
    timeout_write: number;
    timeout_idle: number;
    protocol: string;
    host: string;
    password: string;
    db: number;
    ssl_enabled: boolean;
  }

  export interface Connections2 {
    redis: Redis;
    memory?: any;
  }

  export interface Cache {
    default: string;
    connections: Connections2;
  }

  export interface Wx {
    auth_callback_host: string;
  }

  export interface Wecom {
    corp_id: string;
    wecom_agent_id: number;
    wecom_secret: string;
    app_cert_public_key: string;
    app_message_aes_key: string;
    app_message_callback_url: string;
    app_message_token: string;
    app_oauth_callback_url: string;
    customer_message_aes_key: string;
    customer_message_callback_url: string;
    customer_message_token: string;
    employee_message_aes_key: string;
    employee_message_callback_url: string;
    employee_message_token: string;
    mch_id: string;
    mch_api_v3_key: string;
    wx_cert_path: string;
    wx_key_path: string;
    wx_pay_notify_url: string;
    notify_url: string;
  }

  export interface WxMiniGrogram {
    miniprogram_app_id: string;
    miniprogram_secret: string;
  }

  export interface AppConfig {
    name: string;
    env?: string;
    locale?: string;
    timezone?: string;
    server?: Server;
    jwt?: JWT;
    system?: System;
    log?: Log;
    database?: Database;
    cache?: Cache;
    wx?: Wx;
    wecom?: Wecom;
    wx_miniprogram?: WxMiniGrogram;
  }
}
