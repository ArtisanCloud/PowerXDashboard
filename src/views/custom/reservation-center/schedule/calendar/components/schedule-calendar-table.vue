<template>
  <a-card>
    <FullCalendar ref="RefCalendar" :options='calendarOptions'/>
    <a-list>
      <a-list-item v-for="idx in 4" :key="idx">
        <a-list-item-meta
            title="预约项目"
            description="当前状态"
        >
          <template #avatar>
            <a-avatar shape="square">
              <img
                  alt="avatar"
                  src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
              />
            </a-avatar>
          </template>
        </a-list-item-meta>
        <template #actions>
          <icon-edit/>
          <icon-delete/>
        </template>
      </a-list-item>
    </a-list>
    <!--    <a-drawer v-model:visible="state.createSchedule.visible" width="500px">-->
    <!--      <CreateSchedule-->
    <!--          @submitSuccess="fetchScheduleList"-->
    <!--          v-if="state.createSchedule.visible"-->
    <!--      />-->
    <!--    </a-drawer>-->
    <!--    <a-drawer v-model:visible="state.editSchedule.visible" width="500px">-->
    <!--      <EditSchedule-->
    <!--          @submitSuccess="fetchScheduleList"-->
    <!--          v-if="state.editSchedule.visible"-->
    <!--          :node="state.editSchedule.node"-->
    <!--      />-->
    <!--    </a-drawer>-->
  </a-card>
</template>


<script lang="ts" setup>


import {computed, onMounted, PropType, reactive, ref} from "vue";
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import zhLocale from '@fullcalendar/core/locales/zh-cn'


// import CreateSchedule from '@/views/crm/product-service/price-book/components/create-price-book.vue'
// import EditSchedule from '@/views/crm/product-service/price-book/components/edit-price-book.vue'
import {Message} from "@arco-design/web-vue";


import {deleteSchedule, ListScheduleRequest, listSchedules, Schedule} from "@/api/custom/reservation-center/schedule";
import {convertCSTDateToUTCDate, initDayJs} from "@/utils/dayjs";
import convert from "lodash/fp/convert";


const props = defineProps({
  currentStoreId: Number,
  initDate: {
    type: Date
  }
});


const RefCalendar = ref<any>();
const currentDate = ref<Date>();
const scheduleList = ref<Schedule[]>([]);


// const today = computed(() => {
//
// });
//


const handleDateSelect = (selectInfo: any) => {
  // console.log("selectInfo:", selectInfo)
};
const handleEventClick = (clickInfo: any) => {
  console.log("clickInfo:",clickInfo)
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
  editable: false,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  select: (e: any) => {
    handleDateSelect(e)
  },
  eventClick: (e: any) => {
    handleEventClick(e)
  },
  eventsSet: (e: any) => {
    handleEvents(e)
  },
})


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
  createSchedule: {
    visible: false,
    parentNode: {},
  },
  editSchedule: {
    visible: false,
    node: {},
  },
});


const renderSchedulesToEvents = (schedules: Schedule[]) => {


  for (let i = 0; i < schedules.length; i += 1) {
    const startD = schedules[i].startTime
    const endD = schedules[i].endTime
    // console.log(startD, endD)

    const startDayJS = convertCSTDateToUTCDate(startD)
    const endDayJS = convertCSTDateToUTCDate(endD)
    // console.log(startDayJS, endDayJS)

    const event = {
      id: schedules[i].id,
      title: schedules[i].name,
      start: startDayJS,
      end: endDayJS,
      backgroundColor: '#F0AD4E',
      borderColor: '#e79113'
    }
    const cal = RefCalendar.value.calendar.currentData.viewApi.calendar
    cal.addEvent(event)
  }

}

const fetchScheduleList = async (req: ListScheduleRequest) => {
  state.loading = true;
  try {
    const res = await listSchedules(req);
    scheduleList.value = res.data.list;

    renderSchedulesToEvents(scheduleList.value)


  } finally {
    state.loading = false;
  }
};


const openEditSchedule = (cat: Schedule) => {
  // console.log(cat)
  state.editSchedule.node = cat;
  state.editSchedule.visible = true;
};

const deleteScheduleById = async (bookId: number) => {
  try {
    const rep = await deleteSchedule({id: bookId});
    if (rep.data.id && rep.data.id > 0) {
      Message.success('删除成功');
      await fetchScheduleList({
        storeId: props.currentStoreId,
        currentDate: currentDate.value
      });
    }

  } catch (error) {
    console.error(error);
  }
};


defineExpose({fetchScheduleList})

onMounted(() => {

  initDayJs()


});

</script>


<style scoped></style>
