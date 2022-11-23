import { GetCompactRoleIDByRole } from '@/utils/role';

export const GetCompactPermissionIDByPermission = (menu: API.Menu): string => {
  // console.log(menu)
  if (!menu) {
    return '';
  }
  return menu!.name + '-' + menu!.permissionModuleID.substring(0, 5);
};

export const GetObjectControl = (
  policies: PowerDictionary<any>,
  object: API.Menu,
): string => {
  if (!policies) {
    console.error('GetRoleObjectControl: policies is null');
    return '';
  }

  const objectKey = GetCompactPermissionIDByPermission(object);
  const policy: PowerDictionary<any> = policies![objectKey];
  // console.log(objectKey,policies,policy)
  if (!policy) {
    console.error('GetRoleObjectControl: objectKey is not available');
    return '';
  }

  return policy['control'];
};

export const ConvertPolicyFormToUpdateParams = (
  role: API.Role,
  policies: PowerDictionary<any>,
): API.RequestUpdatePolicies => {
  let params: API.RequestUpdatePolicies = {
    policies: [],
  };
  const roleID: string = GetCompactRoleIDByRole(role);
  Object.keys(policies).forEach((key) => {
    // console.log(key);
    const policy: API.Policy = {
      roleID: roleID,
      objectID: key,
      control: policies[key],
    };
    params.policies.push(policy);
  });

  return params;
};
