// app/plugins/app-init.client.ts
export default defineNuxtPlugin((nuxtApp) => {
  const { public: pub } = useRuntimeConfig();

  const lang = pub.forceLanguage ?? pub.defaultLanguage ?? "zh";
  const theme = pub.forceTheme ?? pub.defaultTheme ?? "auto"; // 'dark'|'light'|'auto'
  // 让 i18n 不被 cookie 顶回去
  document.cookie = "i18n_redirected=; Max-Age=0; path=/";

  // 为避免初始化竞态，等应用挂载后再“一锤定音”
  nuxtApp.hook("app:mounted", async () => {
    try {
      // 使用 Nuxt 的 i18n 实例来设置语言
      const { $i18n } = nuxtApp as any;
      if ($i18n && typeof $i18n.setLocale === "function") {
        await $i18n.setLocale(lang);
      } else if ($i18n && $i18n.locale) {
        $i18n.locale.value = lang;
      }
    } catch (e) {
      console.error("[init] setLocale failed:", e);
    }
    document.documentElement.lang = lang;

    // 使用和 ThemeSwitcher.vue 相同的全局状态和主题应用逻辑
    const themeState = useState<string>("theme", () => "auto");

    // 和 ThemeSwitcher.vue 相同的主题应用函数
    const applyTheme = (newTheme: string) => {
      themeState.value = newTheme;
      localStorage.setItem("theme", newTheme);

      if (newTheme === "auto") {
        document.documentElement.removeAttribute("data-color-mode");
        document.documentElement.classList.remove("light", "dark");
      } else {
        document.documentElement.setAttribute("data-color-mode", newTheme);
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(newTheme);
      }
    };

    // 应用主题设置
    console.log("🎯 init applying:", { lang, theme });
    if (theme && theme !== "auto") {
      applyTheme(theme);
    } else if (theme === "auto") {
      applyTheme("auto");
    }

    if (pub.debugMode) {
      console.log("🎯 init applied:", {
        lang,
        theme,
        htmlClass: document.documentElement.className,
      });
    }
  });
});
