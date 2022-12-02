import React, { useRef, useState } from 'react';
import { SyncOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Alert, Button, message, Space } from 'antd';
import Text from 'antd/es/typography/Text';
import styles from './index.less';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table/es';
import DepartmentList from '@/components/Department';
import { SyncEmployees } from '@/services/user/UserController';
import { API_RETURN_CODE_INIT } from '@/constants/api';

const EmployeeList: React.FC = () => {
  const [syncLoading, setSyncLoading] = useState<boolean>(false);
  const [currentDepartment, setCurrentDepartment] = useState('0');
  const actionRef = useRef<ActionType>();

  const getDepartmentKey = (key: string) => {
    setCurrentDepartment(key);
  };

  const columns: ProColumns<API.Employee>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '员工',
      dataIndex: 'name',
      valueType: 'text',
      hideInSearch: false,
      render: (dom, item) => {
        return (
          <Space>
            <div className={'tag-like-staff-item'}>
              <img src={item.wxAvatar} className={'icon'} alt={item.name} />
              <span className={'text'}>{item.name}</span>
            </div>
          </Space>
        );
      },
    },
    {
      title: '所在部门',
      dataIndex: 'departments',
      valueType: 'text',
      hideInSearch: true,
      render: (dom) => {
        // @ts-ignore
        const arr = dom?.length > 1 ? dom?.slice(1) : dom;
        return (
          <Space>
            {arr?.map((i: any) => (
              <span key={i.id}>{i.name}</span>
            ))}
          </Space>
        );
      },
    },
    {
      title: '角色',
      dataIndex: 'role_type',
      order: 100,
      hideInSearch: false,
      valueType: 'select',
      valueEnum: {
        // '': {text: '全部账号', role_type: ''},
        // superAdmin: {text: '超级管理员', role_type: 'superAdmin'},
        // admin: {text: '管理员', role_type: 'admin'},
        // departmentAdmin: {text: '部门管理员', role_type: 'departmentAdmin'},
        // staff: {text: '普通员工', role_type: 'staff'},
      },
    },
    {
      title: '状态',
      dataIndex: 'external',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 180,
      render: (text, dom) => {
        console.log(text, dom);
        return (
          <Space>
            {
              // dom.enable_msg_arch === 2 ? <Tooltip placement="topLeft" title="该员工暂未开启消息存档">
              //     <Button type={'link'} disabled={true}>聊天记录</Button>
              //   </Tooltip>
              //   :
              //   <Button type={'link'}
              //           onClick={() => history.push(`/staff-admin/corp-risk-control/chat-session?staff=${dom.ext_staff_id}`)}
              //   >聊天记录</Button>
            }
            {/*<Button type={'link'}*/}
            {/*        onClick={() => history.push(`/staff-admin/company-management/role?ext_staff_id=${dom.ext_staff_id}`)}>管理权限</Button>*/}
          </Space>
        );
      },
    },
  ];
  return (
    <PageContainer
      header={{
        title: '员工管理',
      }}
      extra={[
        <Button
          key={'sync'}
          type="dashed"
          icon={
            <SyncOutlined style={{ fontSize: 16, verticalAlign: '-3px' }} />
          }
          loading={syncLoading}
          onClick={async () => {
            setSyncLoading(true);
            const res: API.APIResponse = await SyncEmployees();
            if (res.meta.return_code === API_RETURN_CODE_INIT) {
              setSyncLoading(false);
              // @ts-ignore
              actionRef?.current.reset();
              message.success('同步成功');
            } else {
              setSyncLoading(false);
              message.error(res.meta.result_message);
            }
          }}
        >
          同步数据
        </Button>,
      ]}
    >
      {!localStorage.getItem('customerLossMemberManagementTipsClosed') && (
        <Alert
          showIcon={true}
          closable={true}
          style={{ marginBottom: 16 }}
          type="info"
          message={
            <Text type={'secondary'}>
              部门数据与企业微信同步，若需要修改员工部门请前往企业微信设置
              <Button
                type={'link'}
                onClick={() =>
                  window.open(
                    'https://work.weixin.qq.com/wework_admin/loginpage_wx?from=myhome',
                  )
                }
              >
                去设置
              </Button>
            </Text>
          }
          onClick={() => {
            localStorage.setItem('customerLossMemberManagementTipsClosed', '1');
          }}
        />
      )}
      <ProTable
        actionRef={actionRef}
        className={'table'}
        scroll={{ x: 'max-content' }}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSizeOptions: ['5', '10', '20', '50', '100'],
          pageSize: 5,
        }}
        toolBarRender={false}
        bordered={false}
        tableAlertRender={false}
        tableRender={(_, dom) => (
          <div className={styles.mixedTable}>
            <div className={styles.leftPart}>
              <DepartmentList callback={getDepartmentKey} />
            </div>
            <div className={styles.rightPart}>
              <div className={styles.tableWrap}>{dom}</div>
            </div>
          </div>
        )}
        params={{
          ext_department_ids:
            currentDepartment !== '0' ? currentDepartment : '0',
        }}
        // request={async (params, sort, filter) => {
        //   return ProTableRequestAdapter(params, sort, filter, QueryEmployeesList);
        // }}
        dateFormatter="string"
      />
    </PageContainer>
  );
};

export default EmployeeList;
