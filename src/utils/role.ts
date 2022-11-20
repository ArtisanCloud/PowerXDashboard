export const GetRoleByID = (
  roles: API.Role[],
  roleID: string,
): API.Role | undefined => {
  for (const role of roles) {
    // 当前层是否找到符合的部门对象
    if (role.roleID === roleID) {
      return role;
    }

    // 看下层是否存在此对象
    if (role.children && role.children.length > 0) {
      const subRole = GetRoleByID(role.children, roleID);
      if (subRole !== undefined) {
        return subRole;
      }
    }
  }

  return undefined;
};

export const GetCompactRoleIDByRole = (role: API.Role): string => {
  if (!role) {
    return '';
  }

  return role!.name + '-' + role!.roleID.substring(0, 5);
};
