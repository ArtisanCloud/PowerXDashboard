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
  const { currentItem, mode } = props;
  const { policies } = UsePolicies();
  const routeColumns: ColumnsType = [
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
      dataIndex: 'authority',
      key: 'authority',
      render: (_, item: any) => {
        const authority = [...item?.authority];
        const biz = authority.pop()?.split('_')?.shift();
        return (
          <ProFormRadio.Group
            disabled={currentItem?.name === '超级管理员'}
            noStyle={true}
            name={biz}
            options={[
              {
                label: `全权控制`,
                value: `${biz}_Full`,
              },
              {
                label: `仅查看权限`,
                value: `${biz}_Read`,
              },
              {
                label: '无权限',
                value: '',
              },
            ]}
          />
        );
      },
    },
  ];
  const formatParams = (values: any) => {
    const params = { ...values };
    if (mode === 'edit' || mode === 'simpleEdit') {
      params.id = currentItem?.roleID;
    }
    let permissionIDs: any[] = [];
    Object.keys(params).forEach((key) => {
      if (key.startsWith('Biz') && params[key]) {
        permissionIDs.push(params[key]);
        delete params[key];
      }
    });
    // permissionIDs = lodash.uniq<string>(permissionIDs);
    // permissionIDs = lodash.filter<string>(permissionIDs);
    params.permission_ids = permissionIDs;
    return params;
  };

  // useEffect(() => {
  //   const values = formRef.current?.getFieldsValue();
  //   if (values) {
  //     Object.keys(values).forEach((key) => {
  //       if (!key.startsWith('Biz')) {
  //         return;
  //       }
  //       let defaultValue = '';
  //       if (currentItem?.permission_ids?.includes(`${key}_Full`)) {
  //         defaultValue = `${key}_Full`;
  //       } else if (currentItem?.permission_ids?.includes(`${key}_Read`)) {
  //         defaultValue = `${key}_Read`;
  //       }
  //       values[key] = defaultValue;
  //     });
  //     formRef.current?.setFieldsValue(values);
  //   }
  // }, [currentItem, formRef]);

  return (
    <ProForm
      layout={'horizontal'}
      // @ts-ignore
      // submitter={currentItem?.is_default === False}
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

        <div className={styles.permissionList}>
          {policies.map((topPolicy: any) => {
            return (
              <div key={topPolicy.key} className={styles.permissionItem}>
                <div className={styles.title}>
                  <span className={styles.icon}>{getIcon(topPolicy.icon)}</span>
                  <span className={styles.name}>{topPolicy.name}</span>
                </div>
                <Table
                  rowKey={'path'}
                  className={styles.routeTable}
                  bordered={true}
                  pagination={false}
                  dataSource={topPolicy.routes.filter(
                    (item: any) => item.name && item.authority,
                  )}
                  // @ts-ignore
                  columns={routeColumns}
                />
              </div>
            );
          })}
        </div>
      </>
    </ProForm>
  );
};

export default PolicyForm;
