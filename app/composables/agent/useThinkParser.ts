import { computed, type Ref } from "vue";

export interface ThinkBlock {
  content: string;
  index: number;
}

export interface ParsedMessage {
  thinkBlocks: ThinkBlock[];
  mainContent: string;
  hasThink: boolean;
}

/**
 * 解析消息中的 think 标签
 */
export function useThinkParser(content: Ref<string>) {
  const parsedMessage = computed<ParsedMessage>(() => {
    const contentValue = content.value || "";

    // 匹配所有 <think>...</think> 标签
    const thinkRegex = /<think>([\s\S]*?)<\/think>/gi;
    const thinkMatches = Array.from(contentValue.matchAll(thinkRegex));

    // 提取 think 内容
    const thinkBlocks: ThinkBlock[] = thinkMatches.map((match, index) => ({
      content: match[1].trim(),
      index,
    }));

    // 移除 think 标签，获取主要内容
    const mainContent = contentValue.replace(thinkRegex, "").trim();

    return {
      thinkBlocks,
      mainContent,
      hasThink: thinkBlocks.length > 0,
    };
  });

  return {
    parsedMessage,
  };
}

/**
 * 用于 SSE 流式输出的 think 解析器
 */
export function useStreamingThinkParser() {
  let buffer = "";
  let completedThinks: ThinkBlock[] = [];
  let currentThinkIndex = 0;

  const parseStreamingContent = (chunk: string) => {
    buffer += chunk;

    // 查找完整的 think 标签
    const completeThinkRegex = /<think>([\s\S]*?)<\/think>/gi;
    const matches = Array.from(buffer.matchAll(completeThinkRegex));

    // 处理新完成的 think 块
    const newThinks: ThinkBlock[] = [];
    matches.slice(completedThinks.length).forEach((match, index) => {
      newThinks.push({
        content: match[1].trim(),
        index: completedThinks.length + index,
      });
    });

    // 更新已完成的 think 块
    completedThinks = [...completedThinks, ...newThinks];

    // 检查是否有未完成的 think 标签
    const incompleteThinkMatch = buffer.match(
      /<think>(?![\s\S]*<\/think>)([\s\S]*)$/i
    );
    let currentThinkContent = "";
    if (incompleteThinkMatch) {
      currentThinkContent = incompleteThinkMatch[1];
    }

    // 获取主要内容（移除所有 think 标签）
    const mainContent = buffer
      .replace(/<think>[\s\S]*?<\/think>/gi, "") // 移除完整的 think 标签
      .replace(/<think>[\s\S]*$/i, "") // 移除未完成的 think 标签
      .trim();

    return {
      completedThinks: [...completedThinks],
      currentThinkContent,
      mainContent,
      hasActiveThink: !!incompleteThinkMatch,
      hasThink: completedThinks.length > 0 || !!incompleteThinkMatch,
    };
  };

  const reset = () => {
    buffer = "";
    completedThinks = [];
    currentThinkIndex = 0;
  };

  return {
    parseStreamingContent,
    reset,
  };
}
