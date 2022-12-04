import { GetDepartmentByID } from '@/utils/department';

export const GetEmployeesByDepartmentID = (
  departments: API.Department[],
  departmentID: number,
): API.Employee[] => {
  const department = GetDepartmentByID(departments, departmentID);
  // console.log(departments, departmentID,department)

  if (department) {
    return department.employees;
  }

  return [];
};
