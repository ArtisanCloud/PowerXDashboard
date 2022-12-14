import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import { API_RETURN_CODE_INIT } from '@/constants/api';
import { InitRoot } from '@/services/boot/BootController';

const RegisterRootForm = () => {
  const [form] = Form.useForm<API.RequestInitRoot>();
  return (
    <ProForm<API.RequestInitRoot>
      title="初始化Root账号"
      form={form}
      autoFocusFirstInput
      onFinish={async (values: API.RequestInitRoot) => {
        // console.log(values);
        const rs: API.ResponseToken = await InitRoot(values);
        if (rs.meta.return_code === API_RETURN_CODE_INIT) {
          message.success('授权成功');
          window.location.reload();
        } else {
          message.error(rs.meta.result_message);
        }
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="email"
          label="邮箱地址"
          tooltip="请使用您的邮箱地址"
          placeholder="请使用您的邮箱地址"
          rules={[{ required: true }]}
        />

        <ProFormText.Password
          width="md"
          name="password"
          label="URI"
          placeholder="请牢记您输入的密码"
          rules={[{ required: true }]}
        />
      </ProForm.Group>
    </ProForm>
  );
};

export default RegisterRootForm;
