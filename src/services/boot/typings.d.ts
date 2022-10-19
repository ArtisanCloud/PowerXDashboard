declare namespace API {
  export interface ResponseSystemInstalledStatus extends APIResponse {
    data: SystemInstalledStatus[];
  }

  export interface ResponseRootInitStatus extends APIResponse {
    data: Employee;
  }

  export interface SystemInstalledStatus {
    name: string;
    status: string;
    errMsg: string;
  }

  export interface RequestInstallSystem {
    appConfig: AppConfig;
  }

  export interface ServerConfig {
    host: string;
    port: string;
  }

  export interface JWTConfig {
    public_key: string;
    private_key: string;
  }

  export interface SystemConfig {
    maintenance: boolean;
  }

  export interface LogConfig {
    log_path: string;
  }

  export interface SchemasConfig {
    default?: string;
    option?: string;
  }

  export interface PgsqlConfig {
    driver?: string;
    url?: string;
    host?: string;
    port?: string;
    database?: string;
    username?: string;
    password?: string;
    charset?: string;
    prefix?: string;
    prefix_indexes?: string;
    schemas?: SchemasConfig;
    search_path?: string;
    ssl_mode?: string;
    debug?: boolean;
  }

  export interface DBConnectionsConfig {
    pgsql: PgsqlConfig;
    mysql?: any;
  }

  export interface DatabaseConfig {
    default?: string;
    debug?: boolean;
    connections?: DBConnectionsConfig;
  }

  export interface RedisConfig {
    max_idle?: number;
    max_active?: number;
    expiration?: number;
    timeout_connect?: number;
    timeout_read?: number;
    timeout_write?: number;
    timeout_idle?: number;
    protocol?: string;
    host?: string;
    password?: string;
    db?: number;
    ssl_enabled?: boolean;
  }

  export interface CacheConfig {
    default?: string;
    connections?: CacheConnectionsConfig;
  }

  export interface CacheConnectionsConfig {
    redis: RedisConfig;
    memory?: any;
  }

  export interface WXConfig {
    auth_callback_host?: string;
  }

  export interface WeComConfig {
    corp_id?: string;
    wecom_agent_id?: number;
    wecom_secret?: string;
    app_cert_public_key?: string;
    app_message_aes_key?: string;
    app_message_callback_url?: string;
    app_message_token?: string;
    app_oauth_callback_url?: string;
    customer_message_aes_key?: string;
    customer_message_callback_url?: string;
    customer_message_token?: string;
    employee_message_aes_key?: string;
    employee_message_callback_url?: string;
    employee_message_token?: string;
    mch_id?: string;
    mch_api_v3_key?: string;
    wx_cert_path?: string;
    wx_key_path?: string;
    wx_pay_notify_url?: string;
    notify_url?: string;
  }

  export interface WxMiniProgramConfig {
    miniprogram_app_id: string;
    miniprogram_secret: string;
  }

  export interface AppConfig {
    name: string;
    env?: string;
    locale?: string;
    timezone?: string;
    server?: ServerConfig;
    jwt?: JWTConfig;
    system?: SystemConfig;
    log?: LogConfig;
    database?: DatabaseConfig;
    cache?: CacheConfig;
    wx?: WXConfig;
    wecom?: WeComConfig;
    wx_miniprogram?: WxMiniProgramConfig;
  }
}
