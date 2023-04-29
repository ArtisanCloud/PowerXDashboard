import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

export const DateFormat = 'YYYY-MM-DD HH:mm:ss ZZ'
export const TimeZone = "Asia/Shanghai"

export function convertCSTDateToUTCDate(cstDateString: string): string {

// CST格式的日期字符串  "2023-04-23 10:00:00 +0800 CST";

// 将CST日期字符串转换为dayjs对象
	const date = dayjs(cstDateString, DateFormat)

// 将时区转换为本地时间
	const localDate = date.tz()

// 格式化日期字符串
	const formattedDate = localDate.format()

	return formattedDate
}


export function initDayJs(){
	// 添加dayjs插件
	dayjs.extend(utc)
	dayjs.extend(timezone)

// 设置本地时区
	dayjs.tz.setDefault(TimeZone)
}