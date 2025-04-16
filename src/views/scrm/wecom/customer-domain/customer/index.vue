<!--
 * @Description:客户管理 
 * @Author: George
 * @Date: 2023-06-13 23:39:18
 * @LastEditors: George
 * @LastEditTime: 2023-07-30 23:04:59
-->
<template>
  <div class="container">
    <a-card>
      <a-form
        :model="customersParams"
        layout="vertical"
        auto-label-width
        @submit="handleSubmit"
      >
        <a-space>
          <a-form-item field="name" label-width="0">
            <a-input
              v-model="customersParams.name"
              allow-clear
              placeholder="请输入客户名称"
            />
          </a-form-item>
          <a-form-item field="name" label-width="0">
            <a-input
              v-model="customersParams.userId"
              allow-clear
              placeholder="请输入客户归属"
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit">搜索</a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleReset">重置</a-button>
          </a-form-item>
        </a-space>
      </a-form>
      <a-row :gutter="{ xs: 24, sm: 24, md: 24, lg: 24 }">
        <a-col :xs="24" :sm="24" :md="24" :lg="24">
          <a-card>
            <a-table
              :data="customersList.list"
              :loading="state.loading"
              column-resizable
              scrollbar
            >
              <template #columns>
                <a-table-column
                  title="userId"
                  :width="310"
                  :ellipsis="true"
                  :tooltip="true"
                >
                  <template #cell="{ record }">
                    {{ record.externalContact.externalUserId }}
                  </template>
                </a-table-column>
                <a-table-column
                  title="用户头像"
                  :ellipsis="true"
                  :tooltip="true"
                >
                  <template #cell="{ record }">
                    <img class="header" :src="record.externalContact.avatar" />
                  </template>
                </a-table-column>
                <a-table-column
                  title="姓名"
                  :width="180"
                  :ellipsis="true"
                  :tooltip="true"
                >
                  <template #cell="{ record }">
                    {{ record.externalContact.name }}
                  </template>
                </a-table-column>
                <a-table-column
                  title="标签"
                  :width="300"
                  :ellipsis="true"
                  :tooltip="true"
                >
                  <template #cell="{ record }">
                    <div
                      v-if="
                        record &&
                        record.followUser.tagsInfo &&
                        record.followUser.tagsInfo.length > 3
                      "
                    >
                      <a-popover style="width: 300px">
                        <div v-if="record.followUser.tagsInfo.length > 3">
                          <a-tag
                            v-for="(
                              item, index
                            ) in record.followUser.tagsInfo.slice(0, 3)"
                            :key="index"
                            style="margin: 0 8px"
                            color="arcoblue"
                          >
                            {{ item.name }}
                          </a-tag>
                          <a-tag style="margin: 0 8px" color="arcoblue">
                            ···
                          </a-tag>
                        </div>
                        <div v-else>
                          <a-tag
                            v-for="(item, index) in record.followUser.tagsInfo"
                            :key="index"
                            style="margin: 0 8px"
                            color="arcoblue"
                          >
                            {{ item.name }}
                          </a-tag>
                        </div>
                        <template
                          v-if="record.followUser.tagsInfo.length > 3"
                          #content
                        >
                          <a-tag
                            v-for="(item, index) in record.followUser.tagsInfo"
                            :key="index"
                            style="margin: 4px 8px"
                            color="arcoblue"
                          >
                            {{ item.name }}
                          </a-tag>
                        </template>
                      </a-popover>
                    </div>
                    <div v-else>
                      <span
                        v-for="(item, index) of record.followUser.tagsInfo"
                        :key="index"
                      >
                        <a-tag style="margin: 0 4px" color="arcoblue">{{
                          item.name
                        }}</a-tag>
                      </span>
                    </div>
                  </template>
                </a-table-column>
                <a-table-column
                  title="性别"
                  :width="100"
                  :ellipsis="true"
                  :tooltip="true"
                >
                  <template #cell="{ record }">
                    <span>{{
                      getGenderLabel(record.externalContact.gender)
                    }}</span>
                  </template>
                </a-table-column>
                <a-table-column
                  title="客户归属"
                  :width="160"
                  :ellipsis="true"
                  :tooltip="true"
                >
                  <template #cell="{ record }">
                    <span v-if="record && record.externalContact">{{
                      record.externalContact.userId
                    }}</span>
                  </template>
                </a-table-column>
                <a-table-column
                  fixed="right"
                  title="操作"
                  fiexd="right"
                  :width="100"
                >
                  <template #cell="{ record }">
                    <a-link @click="handleTag(record)"> 打标签 </a-link>
                  </template>
                </a-table-column>
              </template>
            </a-table>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
    <a-drawer
      v-model:visible="state.visible"
      width="500px"
      ok-text="关闭抽屉"
      title="选择标签"
      :hide-cancel="true"
    >
      <add-tag
        :edit-data="state.recordObj"
        @submit-success="handleEditSuccess"
      ></add-tag>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref, toRaw } from 'vue';
  import { corpOption } from '@/api/scrm/tag';
  import { getCustomers, GetCustomersRequest } from '@/api/scrm/customer';

  const state = reactive({
    loading: false,
    visible: false,
    recordObj: {
      userId: '',
      externalUserId: '',
      tags: [],
    },
    tagKeyValue: {},
  });
  const customersParams = ref({
    userId: '',
    name: '',
    unionid: '',
    pageIndex: 1,
    pageSize: 10,
  } as GetCustomersRequest);

  const customersList = reactive<any>({
    list: [],
  });
  async function fetchCustomers() {
    state.loading = true;
    const res = await getCustomers({
      ...customersParams.value,
    });
    const tagKeys: string[] = [];
    Object.keys(state.tagKeyValue).forEach((key) => {
      tagKeys.push(key);
    });
    interface TagOptions {
      [key: string]: {
        tagId: string;
        name: string;
      };
    }
    const tagKeyObj: TagOptions = state.tagKeyValue;
    try {
      customersList.list = res.data?.list.map((data: any) => {
        const arr: any = [];
        data.followUser.tagIds.forEach((params: string) => {
          if (params && tagKeys.includes(params)) {
            arr.push(tagKeyObj[params]);
            data.followUser.tagsInfo = arr;
          }
        });
        return data;
      });
    } finally {
      state.loading = false;
    }
  }
  async function fetchCorpOption() {
    const res = await corpOption();
    try {
      state.tagKeyValue = res.data?.list;
    } finally {
      state.loading = false;
    }
  }
  const handleSubmit = () => {
    fetchCustomers();
  };
  const form = toRaw({
    ...customersParams.value,
  });
  const handleReset = () => {
    customersParams.value = { ...form };
    fetchCustomers();
  };
  const handleTag = (data: any) => {
    state.visible = true;
    state.recordObj.userId = data.externalContact.userId;
    state.recordObj.externalUserId = data.externalContact.externalUserId;
    state.recordObj.tags = data.followUser.tagIds;
  };
  const handleEditSuccess = () => {
    state.visible = false;
    fetchCustomers();
  };
  function getGenderLabel(gender: number): string {
    const genderText = '';
    if (gender === 2) {
      return '女';
    }
    if (gender === 1) {
      return '男';
    }
    return genderText;
  }
  onMounted(async () => {
    await fetchCorpOption();
    await fetchCustomers();
  });
</script>

<style lang="less" scoped>
  .header {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  :deep(.arco-table-cell) {
    display: block;
    width: 100%;
    text-align: center;
  }
  :deep(.arco-table-td-content) {
    display: block;
    width: 100%;
    text-align: center;
  }
  .arco-table-cell .arco-table-th-title {
    display: inline-block;
    width: 100%;
    text-align: center;
  }
</style>
