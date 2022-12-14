declare namespace API {
  export interface ResponseSystemInstalledStatus extends APIResponse {
    data: SystemInstalledStatus[];
  }

  export interface ResponseRootInitStatus extends APIResponse {
    data: Employee;
  }

  export interface SystemInstalledStatus {
    name: string;
    status: string;
    errMsg: string;
  }

  export interface RequestInstallSystem {
    appConfig: AppConfig;
  }

  export interface RequestInitRoot {
    email: string;
    password: string;
  }
}
