declare namespace API {
  export interface ResponsePing extends APIResponse {
    data: string;
  }

  export interface ResponseSystemWXAPIConfig extends APIResponse {
    data: WXAPIConfig;
  }

  export interface WXAPIConfig {
    weCom_api_config: WeComAPIConfig;
  }

  export interface WeComOauthAPI {
    weCom_oauth_callback_url: string;
    state: string;
  }

  export interface WeComAPIConfig {
    corp_id: string;
    weCom_agent_id: number;
    weCom_oauth_api: WeComOauthAPI;
    app_message_callback_url: string;
    customer_message_callback_url: string;
    employee_message_callback_url: string;
  }
}
