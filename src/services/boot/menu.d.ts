declare namespace API {
  export interface ResponseMenuList extends APIResponse {
    data: Menu[];
  }

  export interface Permission {
    createdAt?: Date;
    updatedAt?: Date;
    permissionModule?: any;
    permissionID: string;
    objectAlias: string;
    objectValue: string;
    action: string;
    description?: any;
    moduleID: string;
  }

  export interface Menu {
    createdAt?: Date;
    updatedAt?: Date;
    parent?: any;
    children: Menu[];
    permissions?: Permission[];
    permissionModuleID: string;
    name: string;
    uri: string;
    component: string;
    icon: string;
    description: string;
    parentID: string;
  }
}
