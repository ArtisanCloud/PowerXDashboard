declare namespace API {
  export interface ResponseMenuList extends APIResponse {
    data: Menu[];
  }

  export interface ResponsePermissionModule extends APIResponse {
    data: Menu;
  }

  export interface RequestCreatePermissionModule {
    name: string;
    uri: string;
    component: string;
    icon: string;
    description: string;
    parentID: string;
  }

  export interface RequestUpdatePermissionModule
    extends RequestCreatePermissionModule {
    permissionModuleID: string;
  }

  export interface RequestDeletePermissionModule {
    permissionModuleIDs: string[];
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
