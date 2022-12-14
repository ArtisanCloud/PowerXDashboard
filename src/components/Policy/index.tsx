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
  ROLE_SUPER_ADMIN_NAME,
} from '@/constants';
import { GetCompactRoleIDByRole } from '@/utils/role';
import { GetCompactPermissionIDByPermission } from '@/utils/policy';
import { globalAuthUser } from '@/models/auth';

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
  currentRole: API.Role | undefined;
  formRef: React.MutableRefObject<
    FormInstance & {
      getFieldsFormatValue?: () => any;
    }
  >;
};

const PolicyForm: React.FC<RoleFormProps> = (props) => {
  const { currentRole, mode, formRef } = props;
  const { policies } = UsePolicies();
  const [currentRolePolicies, setCurrentRolePolicies] =
    useState<PowerDictionary<any>>();
  const menuColumns: ColumnsType = [
    {
      title: '????????????',
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
      title: '????????????',
      dataIndex: 'control',
      key: 'control',
      render: (_, item: any) => {
        const policyKey = GetCompactPermissionIDByPermission(item);
        return (
          <ProFormRadio.Group
            disabled={
              currentRole?.name === ROLE_SUPER_ADMIN_NAME &&
              globalAuthUser!.role!.name !== ROLE_SUPER_ADMIN_NAME
            }
            noStyle={true}
            name={policyKey}
            options={[
              {
                label: `????????????`,
                value: RBAC_CONTROL_ALL,
              },
              {
                label: `???????????????`,
                value: RBAC_CONTROL_READ,
              },
              {
                label: '?????????',
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
    if (values) {
      // console.log(values)
      Object.keys(values).forEach((key) => {
        // console.log(key)
        let defaultValue = RBAC_CONTROL_NONE;
        if (rolePolicies) {
          const control = rolePolicies![key];
          if (control) {
            defaultValue = control['control'];
          }
        }
        // console.log(currentRole?.name, defaultValue)

        values[key] = defaultValue;
      });
      formRef.current?.setFieldsValue(values);
    }
  };

  useEffect(() => {
    const roleKey: string = GetCompactRoleIDByRole(currentRole!);
    // console.log(currentRole!.name, currentRole!.roleID.substring(0, 5), roleKey)
    const rolePolicies: PowerDictionary<any> = policies[roleKey];
    // console.log(policies)
    // console.log(rolePolicies)
    setCurrentRolePolicies(rolePolicies);
    if (!currentRolePolicies) {
      console.log('no currentRolePolicies');
    } else {
      console.log(
        'update currentRolePolicies',
        // currentRolePolicies,
        // rolePolicies,
      );
    }

    // refresh current form value
    // setCurrentRolePolicies ?????????????????????????????????rolePolicies?????????
    console.log(globalMenus);
    refreshFormValueByPolicies(rolePolicies);
  }, [globalMenus, currentRole, policies]);

  return (
    <ProForm
      layout={'horizontal'}
      // @ts-ignore
      submitter={{
        // ??????????????????
        // ???????????????????????????
        render: (props) => {
          return [
            <button
              disabled={
                currentRole?.name === ROLE_SUPER_ADMIN_NAME &&
                globalAuthUser!.role!.name !== ROLE_SUPER_ADMIN_NAME
              }
              type="button"
              key="submit"
              onClick={() => props.form?.submit?.()}
            >
              ??????
            </button>,
          ];
        },
      }}
      formRef={props.formRef}
      onFinish={async (values: any) => {
        return props.onFinish(values);
      }}
    >
      <>
        {currentRole?.name === ROLE_SUPER_ADMIN_NAME &&
          globalAuthUser!.role!.name !== ROLE_SUPER_ADMIN_NAME && (
            <Alert
              showIcon={true}
              style={{ maxWidth: '600px', marginBottom: 20 }}
              type="info"
              message={'???????????????????????????????????????????????????????????????'}
            />
          )}

        {['create', 'edit'].includes(mode) && (
          <>
            <h3>????????????</h3>
            <Divider />

            <ProFormText
              width={'md'}
              name="roleName"
              label="????????????"
              placeholder="?????????????????????"
              rules={[
                {
                  required: true,
                  message: '?????????????????????',
                },
              ]}
            />

            <h3>????????????</h3>
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
