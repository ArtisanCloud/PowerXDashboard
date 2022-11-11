export const GetDepartmentByID = (
  departments: API.Department[],
  departmentID: number,
): API.Department | undefined => {
  for (const department of departments) {
    // 当前层是否找到符合的部门对象
    if (department.id === departmentID) {
      return department;
    }

    // 看下层是否存在此对象
    if (department.subDepartments.length > 0) {
      const subDepartment = GetDepartmentByID(
        department.subDepartments,
        departmentID,
      );
      if (subDepartment !== undefined) {
        return subDepartment;
      }
    }
  }

  return undefined;
};
