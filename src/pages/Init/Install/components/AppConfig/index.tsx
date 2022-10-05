import { ProForm, ProFormText } from '@ant-design/pro-components';

export default () => {
  return (
    <ProForm.Group>
      <ProFormText
        name={'name'}
        label={'系统名称'}
        tooltip={'比如 - PowerX后台系统'}
        placeholder={'如：PowerX后台系统'}
        initialValue={'PowerX后台系统'}
        rules={[{ required: true }]}
      />
      <ProFormText
        name={'env'}
        label={'部署环境'}
        tooltip={'dev | test | production'}
        placeholder={'如：dev'}
        initialValue={'dev'}
        rules={[{ required: true }]}
      />
      <ProFormText
        name={'locale'}
        label={'本地化'}
        tooltip={'比如 - zh_CN | en_US'}
        initialValue={'zh_CN'}
        placeholder={'当前系统默认zh_CN'}
      />
      <ProFormText
        name={'timezone'}
        label={'时差'}
        tooltip={"比如 - 'Asia/Shanghai' | 'America/New_York'"}
        initialValue={'Asia/Shanghai'}
        placeholder={"当前系统默认 'Asia/Shanghai'"}
      />
    </ProForm.Group>
  );
};
