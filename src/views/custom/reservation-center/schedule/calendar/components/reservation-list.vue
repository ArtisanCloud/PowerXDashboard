<template>
  <a-list :data="reservationList">
    <template #item="{ item }">
      <a-list-item>
        <a-list-item-meta
            :title="item.reservedTime"
            :description="item.description"
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
        <template #actions>
          <icon-edit/>
          <icon-delete/>
        </template>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts" setup>


import {onMounted, PropType, reactive, ref} from "vue";
import {Schedule} from "@/api/custom/reservation-center/schedule";
import {ListReservationRequest, listReservations, Reservation} from "@/api/custom/reservation-center/reservation";

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


const fetchReservationList = async (req: ListReservationRequest) => {
  state.loading = true;
  try {
    const res = await listReservations(req);
    reservationList.value = res.data.list;

  } finally {
    state.loading = false;
  }
};

defineExpose({fetchReservationList})

onMounted(() => {

});
</script>

<style scoped>

</style>