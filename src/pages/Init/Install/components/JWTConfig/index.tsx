import { ProForm, ProFormTextArea } from '@ant-design/pro-components';

export default (Props: { required: boolean; config: API.JWTConfig }) => {
  return (
    <ProForm.Group>
      <ProFormTextArea
        width={'lg'}
        name={'publicKey'}
        label={'公钥'}
        tooltip={'请收入公钥字符串'}
        placeholder="比如 - -----BEGIN PUBLIC KEY-----
        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
				xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
				xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
				xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        -----END PUBLIC KEY-----"
        rules={[{ required: Props.required }]}
      />
      <ProFormTextArea
        width={'lg'}
        name={'privateKey'}
        label={'密钥'}
        tooltip={'请收入密钥字符串'}
        placeholder="比如 - -----BEGIN RSA PRIVATE KEY-----
        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
				xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
				xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
				xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        -----END RSA PRIVATE KEY-----"
        rules={[{ required: Props.required }]}
      />
    </ProForm.Group>
  );
};
