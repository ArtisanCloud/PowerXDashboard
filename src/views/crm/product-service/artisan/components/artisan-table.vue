<template>
  <a-card>

    <a-table :data="artisanList"
             :loading="state.loading"
             row-key="id" :columns="columns"
             column-resizable
             :pagination="pagination"
             @page-change="pageChanged"
             @page-size-change="pageSizeChanged"
             :bordered="{cell:true}">

      <template #optional="{ record }">
        <a-space align="center">

          <!--编辑品类按钮-->
          <a-button @click="openEditArtisan(record)">
            <template #icon>
              <icon-edit :style="{fontSize:'16px', color:'green'}"/>
            </template>
          </a-button>

          <!--配置价格按钮-->
          <a-button @click="openEditArtisan(record)">
            <template #icon>
              <icon-book :style="{fontSize:'16px', color:'#d7ee8f'}"/>
            </template>
          </a-button>

          <!--删除品类按钮-->
          <a-popconfirm
              content="该操作会删除相关子品类,确定要删除此品类吗？"
              @ok="deleteArtisanById(record.id)"
          >
            <a-button v-if="!record.isStandard">
              <template #icon>
                <icon-delete :style="{fontSize:'16px', color:'red'}"/>
              </template>
            </a-button>
          </a-popconfirm>

        </a-space>
      </template>

    </a-table>

    <a-drawer v-model:visible="state.editArtisan.visible" width="800px">
      <EditArtisan
          @submitSuccess="fetchArtisanList"
          v-if="state.editArtisan.visible"
          :node="state.editArtisan.node"
      />
    </a-drawer>
  </a-card>
</template>


<script lang="ts" setup>


import {onMounted, reactive, ref} from "vue";
import {listArtisans, deleteArtisan, Artisan, ListArtisanPageRequest} from "@/api/crm/product-service/artisan";

// import CreateArtisan from '@/views/crm/artisan-service/artisan-management/components/create-artisan.vue'
// import EditArtisan from '@/views/crm/artisan-service/artisan-management/components/edit-artisan.vue'
import {Message} from "@arco-design/web-vue";

import useOptionsStore from "@/store/modules/data-dictionary";
import {dayjs} from "@arco-design/web-vue/es/_utils/date";
import {DefaultPageSize} from "@/api/common";

const options = useOptionsStore()

const artisanList = ref<Artisan[]>([]);

const columns = reactive([
  {
    title: 'ID',
    dataIndex: 'id',
    width: 60,
  },
    {
    title: '品类名称',
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
    width: 200,
  },
  {
    title: '操作',
    slotName: 'optional'
  },
]);

const pagination = reactive({
  total: 0,
  currentPage: 0,
  "pageSize": DefaultPageSize,
  "show-more": true,
  "show-total": true,
  "show-jumper": true,
  "show-page-size": true,

})

const state = reactive({
  loading: false,
  createArtisan: {
    visible: false,
    parentNode: {},
  },
  editArtisan: {
    visible: false,
    node: {},
  },
  submitLoading: false
});


const fetchArtisanList = async (req: ListArtisanPageRequest) => {
  state.loading = true;
  try {
    const res = await listArtisans(req);
    artisanList.value = res.data.list;
    pagination.currentPage = res.data.pageIndex
    pagination.pageSize = res.data.pageSize
    pagination.total = res.data.total
    // console.log(categoryTree)

  } finally {
    state.loading = false;
  }
};


const openEditArtisan = (cat: Artisan) => {
  // console.log(cat)
  state.editArtisan.node = cat;
  state.editArtisan.visible = true;
};

const deleteArtisanById = async (bookId: number) => {
  try {
    const rep = await deleteArtisan({id: bookId});
    if (rep.data.id && rep.data.id > 0) {
      Message.success('删除成功');
      await fetchArtisanList({pageIndex: pagination.currentPage, pageSize: pagination.pageSize});
    }

  } catch (error) {
    console.error(error);
  }
};

const pageChanged = (page: number) => {
  // console.log("page", page)
  fetchArtisanList({pageIndex: page, pageSize: pagination.pageSize})
}

const pageSizeChanged = (pageSize: number) => {
  // console.log("pagesize", pageSize)
  fetchArtisanList({pageIndex: pagination.currentPage, pageSize})
}


defineExpose({fetchArtisanList})

onMounted(() => {

  // options.fetchArtisanTypeOptions()
  // options.fetchArtisanPlanOptions()

  fetchArtisanList({});

});

</script>


<style scoped></style>
