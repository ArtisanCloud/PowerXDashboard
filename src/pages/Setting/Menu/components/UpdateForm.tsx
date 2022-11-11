import {
  ModalForm,
  ProForm,
  ProFormField,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import { GetMenuSelections } from '@/utils/menu';
import { globalMenus } from '@/models/menu';
import { MenuSelection } from '@/pages/Setting/Menu/typing';
import { API_RETURN_CODE_INIT } from '@/constants/api';
import { UpdatePermissionModule } from '@/services/permission/PermissionController';

const UpdateForm = (Props: { menu: API.Menu }) => {
  const [form] = Form.useForm<API.Menu>();
  return (
    <ModalForm<API.Menu>
      title="修改菜单功能"
      trigger={<Button type="primary">修改</Button>}
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('cancel'),
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        console.log(values);
        const rs: API.ResponsePermissionModule = await UpdatePermissionModule(
          values,
        );
        if (rs.meta.return_code === API_RETURN_CODE_INIT) {
          window.location.reload();
          message.success('修改成功');
        } else {
          message.error(rs.meta.result_message);
        }
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormField
          name="permissionModuleID"
          hidden={true}
          initialValue={Props.menu.permissionModuleID}
        />
        <ProFormText
          width="md"
          name="name"
          label="模块名称"
          tooltip="菜单需要的模块名称"
          placeholder="请输入模块名称"
          initialValue={Props.menu.name}
          rules={[{ required: true }]}
        />

        <ProFormText
          width="md"
          name="uri"
          label="URI"
          placeholder="例如：/setting/menu"
          initialValue={Props.menu.uri}
          rules={[{ required: true }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="component"
          label="前端组件访问路径"
          placeholder="例如：/Setting/Menu"
          initialValue={Props.menu.component}
        />
        <ProFormText
          width="md"
          name="icon"
          label="图标"
          tooltip="ant design的icon"
          placeholder="例如：EditOutlined"
          initialValue={Props.menu.icon}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTreeSelect
          width="md"
          request={async () => {
            let menuSelections = GetMenuSelections(globalMenus);
            const noneSelection: MenuSelection = {
              title: '无',
              value: '',
              children: [],
            };
            menuSelections.unshift(noneSelection);
            return menuSelections;
          }}
          name="parentID"
          label="父模块"
          initialValue={Props.menu.parentID}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea
          width={'lg'}
          name={'description'}
          label={'描述'}
          tooltip={'请输入模块描述'}
          placeholder=""
          initialValue={Props.menu.description}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default UpdateForm;
