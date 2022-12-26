/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！

declare namespace API {


	// ----- response ----
	export interface ResponseQueryContactWayGroupList extends APIResponse {
		data: ContactWayGroup[];
	}

	export interface ResponseUpdateContactWayGroup extends APIResponse {
		data: ContactWayGroup;
	}


	export interface ResponseQueryContactWayList extends APIResponse {
		data: ContactWay[];
	}

	// ----- request ----
	export interface RequestUpdateContactWayGroup {
		uuid: string,
		groupName: string
	}


	export interface RequestQueryContactWayList{
		groupUUID:string,
		name: string,
		userID: string
	}


	// ----- object ----


	export interface Link {
		url: string;
		desc: string;
		title: string;
		picurl: string;
		pic_url: string;
	}

	export interface Image {
		pic_url: string;
		media_id: string;
	}

	export interface MiniProgram {
		page: string;
		appid: string;
		title: string;
		pic_media_id: string;
	}

	export interface Video {
		media_id: string;
	}

	export interface File {
		media_id: string;
	}

	export interface Attachment {
		content: string;
		msgtype: string;
		link: Link;
		image: Image;
		miniprogram: MiniProgram;
		video: Video;
		file: File;
	}

	export interface Conclusions {
		link: Link;
		text: Text;
		image: Image;
		miniprogram: MiniProgram;
	}

	export interface ContactWay {
		uuid: string;
		createdAt: Date;
		updatedAt: Date;
		wxTags: any[];
		name: string;
		groupUUID: string;
		allowEmployeeChangeOnlineStatus: boolean;
		remarkAccount: string;
		remarkAccountPrefix: boolean;
		sendWelcomeMessageType: number;
		codeURL: string;
		customizedCodeImage: string;
		attachments: Attachment[];
		status: number;
		configID: string;
		type: number;
		scene: number;
		style: number;
		remark: string;
		skipVerify: boolean;
		state: string;
		user: string[];
		party: any[];
		isTemp: boolean;
		expiresIn: number;
		chatExpiresIn: number;
		unionID?: any;
		conclusions: Conclusions;
	}

	export interface ContactWayGroup {
		uuid: string;
		createdAt: Date;
		updatedAt: Date;
		contactWays?: any;
		name: string;
	}

}
