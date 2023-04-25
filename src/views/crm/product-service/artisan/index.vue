<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        <a-button type="primary" @click="openAddArtisan()"
        >新增元匠
        </a-button>
      </a-space>
    </a-card>
    <br/>
    <a-card>
      <ArtisanTable ref="RefArtisanTable"/>
    </a-card>
    <a-drawer
        v-model:visible="state.createArtisan.visible" width="800px">
      <CreateArtisan
          @submitSuccess="refreshArtisanList"
          v-if="state.createArtisan.visible"/>
    </a-drawer>
  </div>
</template>



<script lang="ts" setup>


import {reactive, ref} from 'vue';
import ArtisanTable from '@/views/crm/product-service/artisan/components/artisan-table.vue';
import CreateArtisan from '@/views/crm/product-service/artisan/components/create-artisan.vue';

const RefArtisanTable = ref<any>();

const openAddArtisan = () => {
  state.createArtisan.visible = true;
};

const pagination = reactive({
  total:0,
  currentPage: 0,
  "pageSize": 10,
  "show-more": true,
  "show-total": true,
  "show-jumper": true,
  "show-page-size": true,

})

const state = reactive({
  createArtisan: {
    visible: false,
    parentNode: {}
  },
});

const refreshArtisanList = () =>{
  RefArtisanTable.value.fetchArtisanList({
    pageIndex: pagination.currentPage,
    pageSize: pagination.pageSize
  })
}


</script>



<script lang="ts">
export default {
  name: '元匠管理',
};
</script>

<style scoped></style>
