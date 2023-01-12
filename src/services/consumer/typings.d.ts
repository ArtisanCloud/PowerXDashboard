declare namespace API {
    export interface RequestListConsumer {
        page: number
        pageSize: number
        roleID?: number
        groupUUID?: number
    }

    export interface WXConsumer {
        corpId: string
        appId: string
        externalUserID: string
        openID: string
        UnionID: string
        Name: string
        mobile: string
        position: string
        avatar: string
        corpName: string
        corpFullName: string
        externalProfile: string
        gender: number
        wxType: number
    }

    export interface ResponseListConsumer extends APIResponse {
        data: PageData<WXConsumer>
    }
}