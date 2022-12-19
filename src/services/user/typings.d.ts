declare namespace API {
  export interface QueryOAuthCallback {
    // query
    /** code */
    code: string;
    /** appid */
    appid?: string;
    /** state */
    state?: string;
  }

  // ----- response ----
  export interface ResponseAuthUser extends APIResponse {
    data: Employee | null;
  }

  export interface ResponseGetRoleList extends APIResponse {
    data: Role[];
  }

  export interface ResponseGetEmployeeList extends APIResponse {
    data: PaginationEmployees;
  }

  export interface ResponseGetDepartmentList extends APIResponse {
    data: Department[];
  }

  export interface PaginationEmployees extends PaginationData {
    data: Employee[];
  }

  // ----- request ----

  export interface RequestLoginEmployee {
    email: string;
    password: string;
  }

  export interface RequestGetRoleList {
    page: number;
    pageSize: number;
    // groupID: string;
    withEmployees: boolean;
  }

  export interface RequestGetEmployeeList {
    page: number;
    pageSize: number;
    roleID: string;
  }

  export interface RequestGetDepartmentList {
    departmentID?: number;
  }

  export interface RequestBindRoleToEmployees {
    roleID: string;
    employeeIDs: string[];
  }

  export interface RequestQueryGroupPolicyList {
    roleID: string;
  }

  export interface RequestCreateRolePolicies {
    roleName: string;
    policies: Policy[];
  }

  export interface RequestUpdatePolicies {
    policies: Policy[];
  }

  // ----- object ----
  export interface Employee {
    uuid: string;
    employeeID: string;
    createdAt?: string;
    updatedAt?: string;
    role?: Role;
    pivotCustomers?: any;
    followedEmployees?: any;
    wxDepartments?: any;
    roleID: string;
    locale?: string;
    email?: string;
    firstname?: string;
    lastname?: string;
    name?: string;
    mobile?: string;
    wxAlias?: string;
    wxAvatar?: string;
    wxDepartment?: string;
    wxEmail?: string;
    wxEnable?: number;
    wxEnglishName?: string;
    wxExtAttr?: string;
    wxExternalProfile?: string;
    wxGender?: string;
    wxHideMobile?: number;
    wxIsLeader?: number;
    wxIsLeaderInDept?: string;
    wxMainDepartment?: number;
    wxMobile?: string;
    wxName?: string;
    wxOrder?: string;
    wxPosition?: string;
    wxQrCode?: string;
    wxStatus?: number;
    wxTelephone?: string;
    wxThumbAvatar?: string;
    wxCorpID?: string;
    wxOpenUserID?: string;
    wxUserID: string;
    wxOpenID?: string;
  }

  export interface Role {
    createdAt: string;
    updatedAt: string;
    parent: any;
    children: any;
    roleID: string;
    name: string;
    parentID: string;
    type: number;
    employees?: Employee[];
  }

  export interface Department {
    subDepartments: Department[];
    id: number;
    name: string;
    name_en: string;
    parentid: number;
    order: number;
    employees: Employee[];
  }
}
