<template>
  <a-list :data="reservationList">
    <template #item="{ item }">
      <a-list-item>
        <a-list-item-meta
            :title="`预约时间：${formatReservedTime(item.reservedTime)}  ---  预约发型师：${item.reservedArtisan.name}`"
            :description="`服务名称：${item.reservedService.name}    需用时:${item.reservedService.duration}分钟`"
        >
          <template #avatar>
            <a-avatar shape="square">
              <img
                  alt="avatar"
                  width="512"
                  src="/src/assets/images/default-avatar.webp"
              />
            </a-avatar>
          </template>
        </a-list-item-meta>
        <a-typography-text style="margin: 0;">客户：{{ item.reservedCustomer.name }}</a-typography-text>
        <template #actions>

          <a-space>
            <template #split>
              <a-divider direction="vertical"/>
            </template>

            <a-popconfirm
                content="该操作会将约单签到状态,确定要签到吗？"
                @ok="checkinReservationByItem(item)"
            >
              <icon-check-square v-if="isConfirmed(item)" :size="24"/>
            </a-popconfirm>


            <a-popconfirm
                content="该操作会取消该客户的约单,确定要取消吗？"
                @ok="cancelReservationByItem(item)"
            >
              <icon-minus-circle-fill v-if="isConfirmed(item)" :size="24"/>
            </a-popconfirm>


            <a-typography-text
                v-if="isConfirmed(item)"
                style="color:#d3ac0e"
            >已预约
            </a-typography-text>
            <a-typography-text
                v-else-if="isCheckedIn(item)"
                style="color:#077707"
            >已签到
            </a-typography-text>

            <a-typography-text
                v-else-if="isCancelled(item)"
                style="color:#ce051f"
            >已取消
            </a-typography-text>


          </a-space>

        </template>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts" setup>


import {computed, onMounted, PropType, reactive, ref} from "vue";
import {deleteSchedule, Schedule} from "@/api/custom/reservation-center/schedule";
import {
  ListReservationRequest,
  listReservations,
  Reservation,
  OperationStatusCancelled,
  OperationStatusNone,
  ReservationStatusConfirmed,
  OperationStatusCheckIn,
  cancelReservation,
  checkinReservation
} from "@/api/custom/reservation-center/reservation";
import dayjs from "dayjs";
import useOptionsStore from "@/store/modules/data-dictionary";
import {Message} from "@arco-design/web-vue";

defineProps({
  schedule: {
    type: Object as PropType<Schedule>,
    default() {
      return {};
    },
  },
});

const reservationList = ref<Reservation[]>([]);

const state = reactive({
  loading: false,
  cancelReservation: {
    visible: false,
    // parentNode: {},
  },
  checkin: {
    visible: false,
    // node: {},
  },
});

const options = useOptionsStore();

const isConfirmed = (item: Reservation): boolean => {
  // console.log(item)
  const operationDD = options.GetOptionByKey(options.reservationOperationStatus, OperationStatusNone)
  const statusDD = options.GetOptionByKey(options.reservationStatus, ReservationStatusConfirmed)
  if (operationDD && statusDD) {
    return (item.reservationStatus === statusDD.id && item.operationStatus === operationDD.id)
  }

  return false
}

const isCheckedIn = (item: Reservation): boolean => {
  const operationDD = options.GetOptionByKey(options.reservationOperationStatus, OperationStatusCheckIn)
  const statusDD = options.GetOptionByKey(options.reservationStatus, ReservationStatusConfirmed)
  if (operationDD && statusDD) {
    return (item.reservationStatus === statusDD.id && item.operationStatus === operationDD.id)
  }

  return false
}


const isCancelled = (item: Reservation): boolean => {
  const dd = options.GetOptionByKey(options.reservationStatus, OperationStatusCancelled)
  if (dd) {
    return (item.reservationStatus === dd.id)
  }

  return false
}


const formatReservedTime = (reservedTime: string) => {
  // console.log(reservedTime)
  return dayjs(reservedTime).utc().format('MM-DD HH:mm');
}



const fetchReservationList = async (req: ListReservationRequest) => {
  state.loading = true;
  try {
    const res = await listReservations(req);
    reservationList.value = res.data.list;

  } finally {
    state.loading = false;
  }
};



const checkinReservationByItem = async (reservation: Reservation) => {
  try {
    const rep = await checkinReservation({id: reservation.id});
    if (rep.data.id && rep.data.id > 0) {
      Message.success('签到成功');
      await fetchReservationList({scheduleId:reservation.scheduleId})

    }

  } catch (error) {
    console.error(error);
  }
};

const cancelReservationByItem = async (reservation: Reservation) => {
  try {
    const rep = await cancelReservation({id: reservation.id});
    if (rep.data.id && rep.data.id > 0) {
      Message.success('取消成功');
      await fetchReservationList({scheduleId:reservation.scheduleId})

    }

  } catch (error) {
    console.error(error);
  }
};

defineExpose({fetchReservationList})

onMounted(() => {

});
</script>

<style scoped>

</style>