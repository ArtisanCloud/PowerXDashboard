import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import styles from './index.less';
import { Button, Menu, Space, Tabs } from 'antd';
import { PlusOutlined, PlusSquareFilled } from '@ant-design/icons';
import { URI_SETTING_ROLE_CREATE } from '@/constants/uri';
import { history } from 'umi';
import { useRef, useState } from 'react';
import Search from 'antd/es/input/Search';
import TabPane from 'antd/es/tabs/TabPane';
import { QueryEmployeeList } from '@/services/user/UserController';
import { DEFAULT_PAGE, MAX_PAGE_SIZE } from '@/constants';
import { UseRoles } from '@/models/role';
import { UseDepartments } from '@/models/department';
import { GetDepartmentByID } from '@/utils/department';
import { GetRoleByID } from '@/utils/role';

const SetupMenu: React.FC = () => {
  const { roles } = UseRoles();
  const { departments } = UseDepartments();

  const [currentRole, setCurrentRole] = useState<API.Role>();
  const [activeTabPaneKey, setActiveTabPaneKey] = useState<string>('employee');
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<API.Employee>[] = [
    {
      title: 'UUID',
      dataIndex: 'uuid',
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
        // console.log(dom, item);
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
      dataIndex: 'wxDepartment',
      valueType: 'text',
      hideInSearch: true,
      render: (dom, item) => {
        // console.log("department:", dom)
        const arr = JSON.parse(dom!.toString());
        // console.log(arr)

        return (
          <Space>
            {arr?.map((i: number) => {
              // console.log(item.uuid + i)
              const dep = GetDepartmentByID(departments, i);
              return <span key={item.uuid + i}>{dep?.name}</span>;
            })}
          </Space>
        );
      },
    },
    {
      title: '角色',
      dataIndex: 'role_id',
      hideInSearch: true,
      valueType: 'text',
      width: 200,
      render: (dom, item) => {
        const role = GetRoleByID(roles, item.roleID);
        // console.log(dom, role)
        return (
          <Space>
            <span>{role ? role.name : ''}</span>
          </Space>
        );
      },
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 100,
      render: (_, item) => {
        console.log(item.roleID);
        return (
          <a
            type={'link'}
            onClick={() => {
              // setCurrentRole(item);
              // setAssignRoleModalVisible(true);
            }}
          >
            更换角色
          </a>
        );
      },
    },
  ];

  return (
    <PageContainer
      header={{
        title: '配置系统权限功能',
      }}
      className={styles.roleListContainer}
      extra={[
        <Button
          key="create"
          type="primary"
          icon={
            <PlusOutlined style={{ fontSize: 16, verticalAlign: '-3px' }} />
          }
          onClick={() => {
            history.push(URI_SETTING_ROLE_CREATE);
          }}
        >
          新添角色
        </Button>,
      ]}
    >
      <ProCard gutter={8} ghost>
        <ProCard
          colSpan={{
            md: '240px',
          }}
          bordered
          className={styles.leftPart}
        >
          <div className={styles.header}>
            <Button
              key="newRole"
              className={styles.button}
              type="text"
              icon={
                <PlusSquareFilled
                  style={{ color: 'rgb(154,173,193)', fontSize: 15 }}
                />
              }
              onClick={() => {
                history.push(URI_SETTING_ROLE_CREATE);
              }}
            >
              新添角色
            </Button>
          </div>
          <Menu
            onSelect={() => {}}
            defaultSelectedKeys={['0']}
            mode="inline"
            className={styles.menuList}
          >
            <Menu.Item
              key="AllRole"
              onClick={() => {
                // console.log('set null role')
                setCurrentRole(undefined);
                setActiveTabPaneKey('employee');
              }}
            >
              全部
            </Menu.Item>
            {roles.map((item) => (
              <Menu.Item
                key={item.roleID}
                onClick={() => {
                  // console.log(item)
                  setCurrentRole(item);
                }}
              >
                <div className={styles.menuItem}>
                  {item.name}
                  <span className={styles.count} style={{ marginRight: 16 }}>
                    {' '}
                    {item.employees ? item.employees.length : 0}
                  </span>
                </div>
              </Menu.Item>
            ))}
          </Menu>
        </ProCard>
        <ProCard bordered className={styles.rightPart}>
          <Tabs
            activeKey={activeTabPaneKey}
            onChange={(key) => {
              setActiveTabPaneKey(key);
            }}
            tabBarExtraContent={{
              right: (
                <>
                  {activeTabPaneKey === 'employee' && (
                    <Search
                      placeholder="搜索员工"
                      allowClear={true}
                      // onSearch={setKeyword}
                    />
                  )}
                  {activeTabPaneKey === 'permission' && (
                    <Button
                      key="edit"
                      type="dashed"
                      onClick={() => {
                        history.push(
                          `/setting/permission/role/edit?id=${currentRole?.roleID}`,
                        );
                      }}
                    >
                      修改角色
                    </Button>
                  )}
                </>
              ),
            }}
          >
            <TabPane className={styles.tabPane} tab="员工列表" key="employee">
              <ProTable
                actionRef={actionRef}
                className={'table'}
                columns={columns}
                rowKey="id"
                pagination={{
                  pageSizeOptions: ['5', '10', '20', '50', '100'],
                  pageSize: 50,
                }}
                toolBarRender={false}
                search={false}
                bordered={true}
                tableAlertRender={false}
                // initialValue={currentRole?.employees}
                params={{
                  roleID: currentRole?.roleID,
                }}
                request={async () => {
                  // console.log(currentRole);
                  if (currentRole) {
                    return {
                      data: currentRole?.employees || [],
                    };
                  } else {
                    const roleID = '';
                    const rs: API.ResponseGetEmployeeList =
                      await QueryEmployeeList({
                        roleID: roleID,
                        page: DEFAULT_PAGE,
                        pageSize: MAX_PAGE_SIZE,
                      });
                    // console.log(rs.data)
                    return {
                      data: rs.data?.data || [],
                    };
                  }
                }}
                dateFormatter="string"
              />
            </TabPane>

            <TabPane
              className={styles.tabPane}
              tab="权限范围"
              key="permission"
              disabled={!currentRole?.roleID}
            >
              {/*<RoleForm*/}
              {/*	mode={'simpleEdit'}*/}
              {/*	currentItem={currentRole}*/}
              {/*	// @ts-ignore*/}
              {/*	formRef={roleForm}*/}
              {/*	onFinish={async (params) => {*/}
              {/*		const hide = message.loading('修改中');*/}
              {/*		const res: CommonResp = await Update(params);*/}
              {/*		hide();*/}
              {/*		if (res.code === 0) {*/}
              {/*			message.success('修改成功');*/}
              {/*			return true;*/}
              {/*		}*/}

              {/*		if (res.message) {*/}
              {/*			message.error(res.message);*/}
              {/*			return false;*/}
              {/*		}*/}

              {/*		message.error('修改失败');*/}
              {/*		return false;*/}
              {/*	}}*/}
              {/*/>*/}
            </TabPane>
          </Tabs>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};
export default SetupMenu;
