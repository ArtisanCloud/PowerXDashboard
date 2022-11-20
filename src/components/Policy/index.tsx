import type { FormInstance } from 'antd';
import { Alert, Divider, Table } from 'antd';
import ProForm, { ProFormProps, ProFormRadio } from '@ant-design/pro-form';
import styles from './index.less';
import type { ColumnsType } from 'antd/es/table';

import Icon, { createFromIconfontCN } from '@ant-design/icons';
import { ProFormText } from '@ant-design/pro-form/es';
import { defaultSettings } from '@ant-design/pro-layout/es/defaultSettings';
import { isImg, isUrl } from '@ant-design/pro-utils';
import { UsePolicies } from '@/models/policy';
import { useEffect, useState } from 'react';
import { globalMenus } from '@/models/menu';
import {
  RBAC_CONTROL_ALL,
  RBAC_CONTROL_NONE,
  RBAC_CONTROL_READ,
} from '@/constants';
import { GetCompactRoleIDByRole } from '@/utils/role';
import { GetCompactPermissionIDByPermission } from '@/utils/policy';

const IconFont = createFromIconfontCN({
  scriptUrl: defaultSettings.iconfontUrl,
});

const getIcon = (
  icon?: string | React.ReactNode,
  iconPrefixes: string = 'icon-',
): React.ReactNode => {
  if (typeof icon === 'string' && icon !== '') {
    if (isUrl(icon) || isImg(icon)) {
      return (
        <Icon
          component={() => (
            <img src={icon} alt="icon" className="ant-pro-sider-menu-icon" />
          )}
        />
      );
    }
    if (icon.startsWith(iconPrefixes)) {
      return <IconFont type={icon} />;
    }
    return null;
    // return React.createElement(allIcons[icon] || allIcons[`${icon}Outlined`]);
  }

  return icon;
};

export type RoleFormProps = Omit<
  ProFormProps,
  'onFinish' | 'visible' | 'initialValues'
> & {
  mode: 'create' | 'edit' | 'simpleEdit';
  onFinish: (params: any) => void;
  currentItem: API.Role | undefined;
  formRef: React.MutableRefObject<
    FormInstance & {
      getFieldsFormatValue?: () => any;
    }
  >;
};

const PolicyForm: React.FC<RoleFormProps> = (props) => {
  const { currentItem, mode, formRef } = props;
  // const {menuData} = UseMenu();
  const { policies } = UsePolicies();
  const [currentRolePolicies, setCurrentRolePolicies] =
    useState<PowerDictionary<any>>();
  const menuColumns: ColumnsType = [
    {
      title: '功能名称',
      dataIndex: 'name',
      key: 'name',
      width: '180px',
      render: (_, item: any) => {
        return (
          <>
            <span style={{ marginRight: 6 }}>{getIcon(item?.icon)}</span>
            <span>{item?.name}</span>
          </>
        );
      },
    },
    {
      title: '管理权限',
      dataIndex: 'control',
      key: 'control',
      render: (_, item: any) => {
        const policyKey = GetCompactPermissionIDByPermission(item);
        return (
          <ProFormRadio.Group
            disabled={currentItem?.name === '超级管理员'}
            noStyle={true}
            name={policyKey}
            options={[
              {
                label: `全权控制`,
                value: RBAC_CONTROL_ALL,
              },
              {
                label: `仅查看权限`,
                value: RBAC_CONTROL_READ,
              },
              {
                label: '无权限',
                value: RBAC_CONTROL_NONE,
              },
            ]}
          />
        );
      },
    },
  ];

  const refreshFormValueByPolicies = (rolePolicies: PowerDictionary<any>) => {
    const values = formRef.current?.getFieldsValue();
    if (values && rolePolicies) {
      // console.log(values)
      Object.keys(values).forEach((key) => {
        // console.log(key)
        let defaultValue = RBAC_CONTROL_NONE;
        const control = rolePolicies![key];
        if (control) {
          defaultValue = control['control'];
        }
        // console.log(currentItem?.name, control, defaultValue)

        values[key] = defaultValue;
      });
      formRef.current?.setFieldsValue(values);
    }
  };

  const formatParams = (values: any) => {
    console.log(values);
    // const params = {...values};
    // if (mode === 'edit' || mode === 'simpleEdit') {
    // 	params.id = currentItem?.roleID;
    // }
    // let permissionIDs: any[] = [];
    // Object.keys(params).forEach((key) => {
    // 	if (key.startsWith('Biz') && params[key]) {
    // 		permissionIDs.push(params[key]);
    // 		delete params[key];
    // 	}
    // });
    // permissionIDs = lodash.uniq<string>(permissionIDs);
    // permissionIDs = lodash.filter<string>(permissionIDs);
    // params.permission_ids = permissionIDs;
    // return params;
  };

  useEffect(() => {
    const roleKey: string = GetCompactRoleIDByRole(currentItem!);
    // console.log(currentItem!.name, currentItem!.roleID.substring(0, 5), roleKey)
    const rolePolicies: PowerDictionary<any> = policies[roleKey];
    // console.log(policies)
    // console.log(rolePolicies)
    setCurrentRolePolicies(rolePolicies);
    console.log(
      'update currentRolePolicies',
      currentRolePolicies,
      rolePolicies,
    );

    // refresh current form value
    // setCurrentRolePolicies 不能及时更新当前时刻的rolePolicies。。。
    refreshFormValueByPolicies(rolePolicies);
  }, [currentItem, policies]);

  return (
    <ProForm
      layout={'horizontal'}
      // @ts-ignore
      submitter={currentItem?.name === '超级管理员'}
      formRef={props.formRef}
      onFinish={async (values: any) => {
        return props.onFinish(formatParams(values));
      }}
    >
      <>
        {currentItem?.name === '超级管理员' && (
          <Alert
            showIcon={true}
            style={{ maxWidth: '600px', marginBottom: 20 }}
            type="info"
            message={'为了保证系统安全性，内置角色不允许修改权限'}
          />
        )}

        {['create', 'edit'].includes(mode) && (
          <>
            <h3>基础信息</h3>
            <Divider />

            <ProFormText
              width={'md'}
              name="name"
              label="角色名称"
              placeholder="请输入角色名称"
              rules={[
                {
                  required: true,
                  message: '请填写角色名称',
                },
              ]}
            />

            <h3>权限信息</h3>
            <Divider />
          </>
        )}

        <div className={styles.policyList}>
          {globalMenus?.map((TopModule: API.Menu) => {
            return (
              <div
                key={TopModule.permissionModuleID}
                className={styles.policyItem}
              >
                <div className={styles.title}>
                  <span className={styles.icon}>
                    {' '}
                    - {getIcon(TopModule.icon)}
                  </span>
                  <span className={styles.name}>{TopModule.name}</span>
                </div>
                {TopModule.children.map((SecondModule: API.Menu) => {
                  let functionMenus: API.Menu[] = [SecondModule];
                  if (SecondModule.children.length > 0) {
                    functionMenus = SecondModule.children;
                  }

                  return (
                    <div
                      key={SecondModule.permissionModuleID}
                      className={styles.policyItem}
                    >
                      <div className={styles.title}>
                        <span className={styles.icon}>
                          {getIcon(SecondModule.icon)}
                        </span>
                        <span className={styles.name}>{SecondModule.name}</span>
                      </div>
                      <Table
                        rowKey={'path'}
                        className={styles.routeTable}
                        bordered={true}
                        pagination={false}
                        expandable={{
                          expandIconColumnIndex: -1,
                        }}
                        dataSource={functionMenus.filter(
                          (item: any) => item.name,
                        )}
                        // @ts-ignore
                        columns={menuColumns}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    </ProForm>
  );
};

export default PolicyForm;
