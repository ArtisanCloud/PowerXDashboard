<script lang="ts" setup>
  import { onMounted, reactive, ref, toRaw } from 'vue';
  import { corpOption } from '@/api/scrm/wecom/tag/corp-tag';
  import { getCustomers, GetCustomersRequest } from '@/api/scrm/wecom/customer';
  import useLoadingStore from '@/store/modules/loading';
  import styles from './index.module.less';

  const loadingStore = useLoadingStore();
  const state = reactive({
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
    unionId: '',
    pageIndex: 1,
    pageSize: 10,
  } as GetCustomersRequest);

  const customersList = reactive<any>({
    list: [],
  });
  async function fetchCustomers() {
    loadingStore.setLoading(true);
    try {
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
      loadingStore.setLoading(false);
    }
  }

  const onChangeFilterDateRange = () => {
    console.log('onChangeFilterDateRange');
  };
  const onSelectFilterDateRange = () => {
    console.log('onSelectFilterDateRange');
  };
  const onOkFilterDateRange = () => {
    console.log('onOkFilterDateRange');
  };

  async function fetchCorpOption() {
    const res = await corpOption();
    loadingStore.setLoading(true);
    try {
      state.tagKeyValue = res.data?.list;
    } finally {
      loadingStore.setLoading(false);
    }
  }

  onMounted(async () => {
    await fetchCorpOption();
    await fetchCustomers();
  });
</script>

<template>
  <div :class="styles.container">
    <div :class="styles.titleBox"
      ><span :class="styles.title">企业全部客户</span></div
    >
    <div :class="styles.mainBox">
      <div :class="styles.filter">
        <a-button-group>
          <span>标签：</span>
          <a-button :class="styles.btnFilter">不限</a-button>
          <a-button>
            <template #icon>
              <icon-down />
            </template>
          </a-button>
        </a-button-group>
        <a-button-group>
          <span>添加人：</span>
          <a-button :class="styles.btnFilter">全部</a-button>
          <a-button>
            <template #icon>
              <icon-down />
            </template>
          </a-button>
        </a-button-group>
        <div>
          <span>时间：</span>
          <a-range-picker
            :class="styles.btnFilter"
            style="width: 360px"
            show-time
            :time-picker-props="{ defaultValue: ['00:00:00', '09:09:06'] }"
            format="YYYY-MM-DD HH:mm"
            @change="onChangeFilterDateRange"
            @select="onSelectFilterDateRange"
            @ok="onOkFilterDateRange"
          />
        </div>
      </div>
      <a-divider />
      <div :class="styles.resultBox">
        <div :class="styles.totalBox"
          >共{{ customersList.list.length }}个客户</div
        >
        <a-table :data="customersList.list" column-resizable scrollbar>
          <template #columns>
            <a-table-column
              title="客户名称"
              :width="150"
              :ellipsis="true"
              :tooltip="true"
            >
              <template #cell="{ record }">
                {{ record.externalContact.name }}
              </template>
            </a-table-column>
            <!--          <a-table-column-->
            <!--            title="userId"-->
            <!--            :width="310"-->
            <!--            :ellipsis="true"-->
            <!--            :tooltip="true"-->
            <!--          >-->
            <!--            <template #cell="{ record }">-->
            <!--              {{ record.externalContact.externalUserId }}-->
            <!--            </template>-->
            <!--          </a-table-column>-->
            <a-table-column
              :width="100"
              title="用户头像"
              :ellipsis="true"
              :tooltip="true"
            >
              <template #cell="{ record }">
                <img
                  :class="styles.header"
                  :src="record.externalContact.avatar"
                />
              </template>
            </a-table-column>

            <a-table-column
              title="标签"
              :width="200"
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
              title="添加人"
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
              title="添加时间"
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
            <!--          <a-table-column fixed="right" title="操作" fiexd="right" :width="100">-->
            <!--            <template #cell="{ record }">-->
            <!--              <a-link @click="handleTag(record)"> 打标签 </a-link>-->
            <!--            </template>-->
            <!--          </a-table-column>-->
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>
