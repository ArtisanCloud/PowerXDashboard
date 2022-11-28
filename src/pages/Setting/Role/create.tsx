import { FormInstance, ProCard } from '@ant-design/pro-components';
import { message } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import PolicyForm from '@/components/Policy';
import { CreateRolePolicies } from '@/services/permission/PermissionController';
import { API_RETURN_CODE_INIT } from '@/constants/api';
import { URI_SETTING_PERMISSION } from '@/constants/uri';
import {
  CheckRoleNameIsAvailable,
  ConvertPolicyFormToCreateRoleParams,
} from '@/utils/policy';
import { history } from '@@/core/history';

const Create: React.FC = () => {
  const [currentRole] = useState<API.Role>();
  const roleForm = useRef<FormInstance>();

  return (
    <PageContainer
      onBack={() => history.back()}
      backIcon={<LeftOutlined />}
      header={{
        title: '创建角色',
      }}
    >
      <ProCard>
        <PolicyForm
          // @ts-ignore
          formRef={roleForm}
          mode={'create'}
          onFinish={async (values) => {
            // console.log(values)
            const result: boolean = CheckRoleNameIsAvailable(
              values['roleName'],
            );
            if (!result) {
              history.push(URI_SETTING_PERMISSION);
              message.error('该角色名字已存在');
              return false;
            }
            const formData: API.RequestCreateRolePolicies =
              ConvertPolicyFormToCreateRoleParams(values);
            // console.log(formData)
            // return false
            const hide = message.loading('处理中');
            const rs: API.APIResponse = await CreateRolePolicies(formData);
            hide();
            if (rs.meta.return_code === API_RETURN_CODE_INIT) {
              history.push(URI_SETTING_PERMISSION);
              message.success('添加成功');
              return true;
            }

            message.error(rs.meta.result_message);
            return false;
          }}
          currentRole={currentRole}
        />
      </ProCard>
    </PageContainer>
  );
};

export default Create;
