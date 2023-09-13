<template>
  <div class="container">
    <a-card class="custom-card">
      <div class="powerx-intro">
        <h1>PowerX - 一个灵活可扩展的基于CRM的产品项目</h1>
        <p
          >PowerX
          是一个开放式的项目，旨在创建基于CRM的产品套件，可用于各种业务场景。任何业务的核心都是其客户和产品，而
          PowerX 提供了一个灵活且可扩展的平台来管理这两个关键方面。</p
        >
        <h2>PowerX 支持的主要业务模型</h2>
        <ul>
          <li>以客户为中心的电商模型（B2C），支持客户裂变和SCRM。</li>
          <li
            >基于企业微信的社交CRM（SCRM）功能，以帮助企业管理私密客户互动。</li
          >
          <li
            >全域电商（PowerX-Pro）模型，具有渠道管理功能和多级定价和佣金模型。</li
          >
        </ul>
        <h2>可定制化的模块，用于行业特定的解决方案</h2>
        <p
          >PowerX 提供许多常见业务场景的标准模块和功能，但也高度可定制化，允许
          IT 团队开发行业特定的解决方案。PowerX
          以标准化和易用性为重点，旨在成为广泛采用的平台。</p
        >
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup></script>

<script lang="ts">
  export default {
    name: 'Home',
  };
</script>

<style scoped>
  .custom-card {
    border-radius: 8px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .powerx-intro {
    margin: 0 auto;
    padding: 40px 20px;
    text-align: justify;
  }

  h1,
  h2 {
    text-align: center;
    margin: 20px 0;
  }

  h1 {
    font-size: 28px;
    color: #3c3c3c;
  }

  h2 {
    font-size: 20px;
    color: #5c5c5c;
  }

  p {
    font-size: 16px;
    line-height: 1.6;
    color: #6c6c6c;
  }

  ul {
    list-style: disc;
    margin-left: 30px;
    font-size: 16px;
    line-height: 1.6;
    color: #444;
  }
</style>
