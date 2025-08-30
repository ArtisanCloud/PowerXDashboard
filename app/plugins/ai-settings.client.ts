export default defineNuxtPlugin(async () => {
  console.log("🚀 AI Settings Plugin: 插件开始执行");

  try {
    const aiSettingsStore = useAISettingsStore();
    console.log("🔧 AI Settings Plugin: Store 获取成功");

    await aiSettingsStore.initialize();
    console.log("✅ AI Settings Plugin: 初始化完成");
  } catch (error) {
    console.error("❌ AI Settings Plugin: 初始化失败", error);
  }
});
