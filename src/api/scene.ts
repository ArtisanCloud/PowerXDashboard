export interface SceneQRCode {
  qId?: string;
  name?: string;
  realQRCodeLink?: string;
  platform?: number;
  classify?: number;
  sceneLink?: string;
  safeThresholdValue?: number;
  isAutoActive?: boolean;
  cPA?: number;
  status?: number;
  type?: number;
  scene?: number;
  style?: number;
  desc?: string;
  skipVerify?: boolean;
  state?: string;
  owners?: string[];
  party?: number[];
  isTemp?: boolean;
  expiresIn?: string;
  chatExpiresIn?: string;
  unionId?: string;
  conclusions?: string;
  activeQRCodeLink?: string;
}
