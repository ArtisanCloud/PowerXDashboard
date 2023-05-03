<template>
  <a-card>
    <FullCalendar ref="RefCalendar" :options='calendarOptions'/>
    <ReservationList ref="RefReservationList" :schedule="calEvents.currentSchedule"/>
  </a-card>
</template>


<script lang="ts" setup>


import {onMounted, PropType, reactive, ref} from "vue";
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import zhLocale from '@fullcalendar/core/locales/zh-cn'


import ReservationList from '@/views/custom/reservation-center/schedule/calendar/components/reservation-list.vue'
import {Message} from "@arco-design/web-vue";


import {
  deleteSchedule,
  ListScheduleRequest,
  listSchedules, PivotScheduleToArtisan,
  Schedule, ScheduleStatusFull,
  ScheduleStatusIdle, ScheduleStatusNormal, ScheduleStatusWarning
} from "@/api/custom/reservation-center/schedule";
import {convertCSTDateToUTCDate, initDayJs} from "@/utils/dayjs";
import useOptionsStore from "@/store/modules/data-dictionary";
import {Store} from "@/api/crm/product-service/store";


const props = defineProps({
  currentStore: Object as PropType<Store>,
  initDate: {
    type: Date
  }
});


const RefCalendar = ref<any>();
const RefReservationList = ref<any>();
const currentDate = ref<Date>();
const scheduleList = ref<Schedule[]>([]);

const options = useOptionsStore();


const calEvents = reactive({
  selectedEvent: Object as any,
  currentSchedule: {} as Schedule,
})


const colors = reactive({
  idle: {
    backgroundColor: '#9deeee',
    borderColor: '#c3c6e3',
  },
  normal: {
    backgroundColor: '#9cf04e',
    borderColor: '#14d22f',
  },
  warning: {
    backgroundColor: '#F0AD4E',
    borderColor: '#e79113',
  },
  full: {
    backgroundColor: '#e52448',
    borderColor: '#a10f0f',
  },
  selected: {
    backgroundColor: '#e5d2b4',
    borderColor: '#c49292',
  }
})
const drawScheduleBuckets = (info: any) => {
  const scheduleStatus = info?.event?.extendedProps?.status; // Optional chaining to avoid TypeError
  // console.log(info.event)
  if (info.el) {
    // Check if scheduleStatus is not undefined or null before proceeding
    // Set reminder color
    let bgColor = colors.idle.backgroundColor
    let bgBorderColor = colors.idle.borderColor
    let opacity = 0.8

    switch (scheduleStatus) {
      case ScheduleStatusNormal:
        bgColor = colors.normal.backgroundColor
        bgBorderColor = colors.normal.borderColor
        break;
      case ScheduleStatusWarning:
        bgColor = colors.warning.backgroundColor
        bgBorderColor = colors.warning.borderColor
        break;
      case ScheduleStatusFull:
        bgColor = colors.full.backgroundColor
        bgBorderColor = colors.full.borderColor
        break;
      default:
        opacity = 0.5
        break;
    }


    // console.log(bgColor, bgBorderColor)
    info.el.style.backgroundColor = bgColor; // Set background color
    info.el.style.borderColor = bgBorderColor; // Set border color
    info.el.style.opacity = opacity; // Set opacity
  }

}


const handleDateSelect = (selectInfo: any) => {
  // console.log("selectInfo:", selectInfo)
};

const handleEventReRender = (clickInfo: any) => {
  // console.log("clickInfo:", clickInfo)

  if (calEvents.selectedEvent !== undefined) {
    // console.log("selectedEvent:", calEvents.selectedEvent)
    drawScheduleBuckets(calEvents.selectedEvent)
  }


  // // 将当前点击的事件背景颜色更改为选中颜色
  // clickInfo.el.style.backgroundColor = colors.selected.backgroundColor; // Set background color
  clickInfo.el.style.borderColor = colors.selected.borderColor; // Set border color
  clickInfo.el.style.opacity = 1

  calEvents.selectedEvent = clickInfo
  // console.log("after selectedEvent:", calEvents.selectedEvent)

};


const columns = reactive([
  {
    title: '店铺名称',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: 120,
    slotName: 'type'
  },
  {
    title: '描述',
    dataIndex: 'description',
    width: 300,
  },
  {
    title: '操作',
    slotName: 'optional'
  },
]);


const state = reactive({
  loading: false,
});

const calScheduleStatus = (schedule: Schedule): string => {

  if (!props.currentStore) {
    return ScheduleStatusFull
  }

  const totalArtisan = props.currentStore.artisans.length
  const totalPivot = schedule.pivotScheduleToArtisan.length
  let notAvailableCount = 0
  for (let i = 0; i < totalPivot; i += 1) {
    const pivot = schedule.pivotScheduleToArtisan[i]
    if (!pivot.isAvailable) {
      notAvailableCount += 1
    }
  }

  let status = ScheduleStatusIdle
  const percentage = notAvailableCount / totalArtisan
  // console.log(totalArtisan, notAvailableCount, totalArtisan, percentage)
  if (percentage >= 1) {
    status = ScheduleStatusFull
  } else if (percentage > 0.75 && percentage < 1) {
    status = ScheduleStatusWarning
  } else if (percentage > 0.25 && percentage <= 0.75) {
    status = ScheduleStatusNormal
  }
  return status


}


const renderSchedulesToEvents = (schedules: Schedule[]) => {
  for (let i = 0; i < schedules.length; i += 1) {
    const startD = schedules[i].startTime
    const endD = schedules[i].endTime
    // console.log(startD, endD)

    const startDayJS = convertCSTDateToUTCDate(startD)
    const endDayJS = convertCSTDateToUTCDate(endD)
    // console.log(startDayJS, endDayJS)

    // const scheduleStatus = options.GetOptionById(options.scheduleStatus, schedules[i].status)
    const scheduleStatus = calScheduleStatus(schedules[i])

    const event = {
      id: schedules[i].id,
      title: `已预约人数：${schedules[i].reservations.length} `,
      // 发型师人数：${props.currentStore?.artisans.length}
      start: startDayJS,
      end: endDayJS,
      textColor: 'black',
      extendedProps: {
        status: scheduleStatus,
        index: i
      }
    }
    const cal = RefCalendar.value.calendar.currentData.viewApi.calendar
    cal.addEvent(event)


  }

}

const getCurrentSchedule = (): Schedule => {
  return calEvents.currentSchedule
}
const getCurrentDate = (): Date|undefined => {
  return currentDate.value
}

const clearCalendar = async () => {

  const cal = RefCalendar.value.calendar.currentData.viewApi.calendar
  cal.removeAllEventSources();
  cal.removeAllEvents();

}


const fetchScheduleList = async (req: ListScheduleRequest) => {
  state.loading = true;
  try {
    req.pageSize = 500
    const res = await listSchedules(req);
    scheduleList.value = res.data.list;

    renderSchedulesToEvents(scheduleList.value)
    if (calEvents.currentSchedule.id > 0) {
      await RefReservationList.value.fetchReservationList({scheduleId: calEvents.currentSchedule.id})
    }

  } finally {
    state.loading = false;
  }
};

//
// const openEditSchedule = (cat: Schedule) => {
//   // console.log(cat)
//   state.editSchedule.node = cat;
//   state.editSchedule.visible = true;
// };




const handleChangeReservationList = (clickInfo: any) => {

  const curEvent = calEvents.selectedEvent.event

  // console.log(curEvent.id, curEvent.extendedProps.index)
  calEvents.currentSchedule = scheduleList.value[curEvent.extendedProps.index]

  RefReservationList.value.fetchReservationList({scheduleId: calEvents.currentSchedule.id})

};


const handleEvents = (events: any) => {
  // console.log("events:",events)
};

const calendarOptions = reactive({
  // refer to: https://github.com/fullcalendar/fullcalendar-examples/blob/main/vue3/src/DemoApp.vue
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  locales: [zhLocale],
  locale: 'zh',
  // timeZone: 'local',
  weekends: true,
  views: {
    week: {
      // options apply to dayGridWeek and timeGridWeek views
      // titleFormat: { year: 'numeric', month: '2-digit', day: '2-digit' }
    },
  },
  headerToolbar: {
    left: 'prev,next',
    center: 'title',
    right: 'today timeGridWeek timeGridDay'
  },
  datesSet: (arg: any) => {
    // 切换日期范围
    currentDate.value = arg.start
    if (props.currentStore && props.currentStore.id > 0 && currentDate.value) {
      // console.log(currentDate.value)
      clearCalendar()
      fetchScheduleList({
        storeId: props.currentStore?.id,
        currentDate: currentDate.value?.toLocaleDateString()
      });
    }

  },
  editable: false,
  selectable: false,
  selectMirror: true,
  dayMaxEvents: true,
  eventClick: (e: any) => {
    // console.log('eventClick：', e.el,e.event);

    // 重新渲染格子
    handleEventReRender(e)

    // 刷新列表
    handleChangeReservationList(e)
  },
  eventsSet: (e: any) => {
    handleEvents(e)
  },
  eventDidMount: (e: any) => {
    // console.log('eventDidMount：', e.el,e.event);
    drawScheduleBuckets(e)
  }
})


defineExpose({fetchScheduleList, clearCalendar, getCurrentSchedule, getCurrentDate})

onMounted(() => {

  initDayJs()


});

</script>


<style scoped></style>
