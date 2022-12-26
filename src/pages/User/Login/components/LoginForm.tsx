import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import { HashPlainPassword } from '@/utils/security';
import { LoginEmployee } from '@/services/user/UserController';
import * as APIConstant from '@/constants/api';
import { history } from '@@/core/history';
import {LS_AUTH} from "@/constants";

const LoginEmployeeForm = () => {
  const [form] = Form.useForm<API.RequestLoginEmployee>();
  return (
    <ProForm<API.RequestLoginEmployee>
      title="使用账号登陆"
      form={form}
      autoFocusFirstInput
      onFinish={async (values: API.RequestLoginEmployee) => {
        values.password = HashPlainPassword(values.password);
        // console.log(values)

        const rs: API.ResponseToken = await LoginEmployee(values);
        if (rs?.meta.return_code === APIConstant.API_RETURN_CODE_INIT) {
          message.success('登陆成功');
          localStorage.setItem(LS_AUTH, JSON.stringify(rs));

          // 跳转首页
          location.pathname = '/';
          history.push(location.pathname);
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
          label="密码"
          placeholder="请输入登陆密码"
          rules={[{ required: true }]}
        />
      </ProForm.Group>
    </ProForm>
  );
};

export default LoginEmployeeForm;
