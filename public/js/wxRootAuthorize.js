import {LS_WX_API_CONFIG} from "../../src/constants";

const jsonWXAPIConfig = localStorage.getItem(LS_WX_API_CONFIG);

const config = JSON.parse(jsonWXAPIConfig);

// console.log(config)

if (config) {
  const wwLogin = new WwLogin({
    id: 'root-qrcode-container',
    appid: config?.weCom_api_config.corp_id,
    agentid: config?.weCom_api_config.weCom_agent_id,
    redirect_uri:
      config?.weCom_api_config.weCom_oauth_api.weCom_oauth_callback_url +
      '/install/root/system/authorized',
    state: config?.weCom_api_config.state,
    href: '',
    lang: 'zh',
  });
} else {
  console.error('please check local storage, wx config has been loaded');
}
