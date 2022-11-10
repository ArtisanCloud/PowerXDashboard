import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import { GetMenuSelections } from '@/utils/Menu';
import { globalMenus } from '@/models/menu';
import { MenuSelection } from '@/pages/Setting/Menu/typing';
import { API_RETURN_CODE_INIT } from '@/constants/api';
import { CreatePermissionModule } from '@/services/permission/PermissionController';

const CreateForm = () => {
  const [form] = Form.useForm<API.Menu>();
  return (
    <ModalForm<API.Menu>
      title="新建菜单功能"
      trigger={
        <Button type="primary">
          <PlusOutlined />
          新建菜单功能
        </Button>
      }
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('cancel'),
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        // console.log(values);
        const rs: API.ResponsePermissionModule = await CreatePermissionModule(
          values,
        );
        if (rs.meta.return_code === API_RETURN_CODE_INIT) {
          message.success('提交成功');
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
          name="name"
          label="模块名称"
          tooltip="菜单需要的模块名称"
          placeholder="请输入模块名称"
          rules={[{ required: true }]}
        />

        <ProFormText
          width="md"
          name="uri"
          label="URI"
          placeholder="例如：/setting/menu"
          rules={[{ required: true }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="component"
          label="前端组件访问路径"
          placeholder="例如：/Setting/Menu"
        />
        <ProFormText
          width="md"
          name="icon"
          label="图标"
          tooltip="ant design的icon"
          placeholder="例如：EditOutlined"
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
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea
          width={'lg'}
          name={'description'}
          label={'描述'}
          tooltip={'请输入模块描述'}
          placeholder=""
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default CreateForm;
