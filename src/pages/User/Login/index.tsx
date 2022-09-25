// https://developer.work.weixin.qq.com/document/path/91025
// 获取环境变量中的oauth 地址

export default () => {
  const oauthURL = '' + APP_OAUTH_URL;
  // console.log(oauthURL)
  return (window.location.href = oauthURL);
};
