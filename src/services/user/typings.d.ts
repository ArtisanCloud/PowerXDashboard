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

  export interface RSAuthUser extends APIResponse {
    data: Employee | null;
  }

  export interface Employee {
    uuid: string;
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
  }
}
