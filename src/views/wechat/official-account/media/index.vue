<template>
  <div class="content">
    <w-offi-account-media
      action="/api/wechat/media/uploadOtherMedia"
      :media-data="mediaData"
      :total="total"
      :current="current"
      :page-size="pageSize"
      :page-size-options="[10, 20, 30, 50, 100]"
      :tem-url="temUrl"
      @on-down-load="downLoadImage"
      @on-delete="deleteImg"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
      @on-change-tab="onChangeTab"
      @on-preview="onPreview"
    />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { WOffiAccountMedia } from '@yaoyaochi/weyui';
  import {
    GetMedia,
    GetMediaOtherList,
  } from '@/api/wechat/official-account/media';

  const total = ref(0); // 总条数
  const pageSize = ref(10); // 每页条数
  const current = ref(1); // 当前页码
  const dataType = ref('image'); // 素材类型

  const mediaData = ref({} as any); // 素材数据
  const temUrl = ref(''); // 临时url

  const refreshMediaList = async (type: string) => {
    const res = await GetMediaOtherList({
      type: dataType.value,
      offset: current.value,
      count: pageSize.value,
    });
    mediaData.value.item = res.data.item;
    total.value = res.data.total_count;
  };

  const getMediaById = async (mediaId: string, type: string) => {
    // 获取素材
    const res: any = await GetMedia({ mediaId });
    if ((res.data && type === 'video') || type === 'news') {
      temUrl.value = res.data.data.down_url;
      return;
    }
    if (res.data) {
      temUrl.value = URL.createObjectURL(res.data);
    }
  };

  const onChangeTab = async (item: any) => {
    // 切换tab
    dataType.value = item;
    await refreshMediaList(item);
    console.log(dataType.value);
  };
  const downLoadImage = (item: any) => {
    // 获取图片URL
    console.log(item);
  };

  const deleteImg = (item: any) => {
    // 删除图片
    console.log(item);
  };

  const pageChange = async (page: number) => {
    // 页码改变 建议offset = (page - 1) * pageSize
    current.value = page;
    refreshMediaList(dataType.value);
  };

  const pageSizeChange = async (size: number) => {
    // 每页条数改变
    pageSize.value = size;
    mediaData.value.item = [];
    refreshMediaList(dataType.value);
  };

  const onPreview = async (mediaId: string, type: string) => {
    // 预览素材 仅用于语音 视频'
    // console.log(mediaId, type);
    await getMediaById(mediaId, type);
  };

  onMounted(() => {
    refreshMediaList('image');
  });
</script>

<style scoped lang="less">
  .content {
    padding: 20px;
  }
</style>