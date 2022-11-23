declare namespace API {
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

  export interface Policy {
    roleID: string;
    objectID: string;
    control: string;
  }
}
