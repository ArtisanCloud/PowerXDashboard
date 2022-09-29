declare namespace API {
  export interface RSSystemInstalledStatus extends APIResponse {
    data: SystemInstalledStatus[];
  }
  export interface SystemInstalledStatus {
    name: string;
    status: string;
    errMsg: string;
  }
}
