import {
  EditableProTable,
  PageContainer,
  ProCard,
  ProColumns,
  ProFormField,
} from '@ant-design/pro-components';
import { useState } from 'react';
import { globalMenus } from '@/models/menu';
import { GetParentPermissionModule } from '@/utils/Menu';
import CreateForm from '@/pages/Setting/Menu/components/CreateForm';
import UpdateForm from '@/pages/Setting/Menu/components/UpdateForm';
import styles from '@/pages/Setting/Menu/index.less';
import { message, Popconfirm } from 'antd';
import { DeletePermissionModule } from '@/services/permission/PermissionController';
import { API_RETURN_CODE_INIT } from '@/constants/api';

const SetupMenu: React.FC = () => {
  const [menus, setMenus] = useState<API.Menu[]>(globalMenus);

  const columns: ProColumns<API.Menu>[] = [
    {
      title: '功能模块名称',
      dataIndex: 'name',
      width: '20%',
    },
    {
      title: '上级模块名称',
      dataIndex: 'parentID',
      renderText: (text: any, record: API.Menu) => {
        const parentMenu: API.Menu | undefined = GetParentPermissionModule(
          menus,
          record.parentID,
        );
        // console.log(record.parentID,parentMenu)
        if (parentMenu === undefined) {
          return '';
        } else {
          return parentMenu.name;
        }
      },
      width: '20%',
    },
    {
      title: 'URI',
      dataIndex: 'uri',
      width: '20%',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'date',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record) => [
        <UpdateForm key="edit" menu={record} />,
        <Popconfirm
          key="delete"
          title="确定要删除此模块么？"
          onConfirm={async () => {
            const rs: API.APIResponse = await DeletePermissionModule({
              permissionModuleIDs: [record.permissionModuleID],
            });
            if (rs.meta.return_code === API_RETURN_CODE_INIT) {
              message.success('删除成功');
              window.location.reload();
            } else {
              message.error(rs.meta.result_message);
            }
          }}
          // onCancel={cancel}
          okText="Yes"
          cancelText="No"
        >
          <a href="#">删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer
      header={{
        title: '配置系统功能菜单',
      }}
    >
      <div className={styles.btnNew}>
        <CreateForm />
      </div>

      <EditableProTable<API.Menu>
        params={{}}
        expandable={{
          // 使用 request 请求数据时无效
          defaultExpandAllRows: true,
        }}
        scroll={{
          x: 960,
        }}
        rowKey="permissionModuleID"
        headerTitle="可编辑表格"
        maxLength={5}
        recordCreatorProps={false}
        columns={columns}
        value={menus}
        onChange={setMenus}
      />

      <ProCard title="表格数据" headerBordered collapsible defaultCollapsed>
        <ProFormField
          ignoreFormItem
          fieldProps={{
            style: {
              width: '100%',
            },
          }}
          mode="read"
          valueType="jsonCode"
          text={JSON.stringify(menus)}
        />
      </ProCard>
    </PageContainer>
  );
};
export default SetupMenu;
