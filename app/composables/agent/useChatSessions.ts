import { ref } from "vue";

// 和你的后端约定：分页游标 or 偏移量
interface ChatSessionDTO {
  id: number | string;
  title?: string;
  last_message?: string;
  updated_at?: string;
  unread?: number;
  pinned?: boolean;
}

export interface ChatSession {
  id: number | string;
  title?: string;
  lastMessage?: string;
  updatedAt?: string;
  unread?: number;
  pinned?: boolean;
}

export function useChatSessions(opts: { pageSize?: number } = {}) {
  const pageSize = opts.pageSize ?? 20;

  const sessionsByAgent = ref<Record<number, ChatSession[]>>({});
  const sessionsLoadingByAgent = ref<Record<number, boolean>>({});
  const hasMoreByAgent = ref<Record<number, boolean>>({});
  const cursorsByAgent = ref<Record<number, string | null>>({}); // 可选：游标分页

  function setLoading(agentId: number, v: boolean) {
    sessionsLoadingByAgent.value = {
      ...sessionsLoadingByAgent.value,
      [agentId]: v,
    };
  }

  function mapDTO(x: ChatSessionDTO): ChatSession {
    return {
      id: x.id,
      title: x.title,
      lastMessage: x.last_message,
      updatedAt: x.updated_at,
      unread: x.unread,
      pinned: x.pinned,
    };
  }

  async function listSessions(agentId: number) {
    if (sessionsByAgent.value[agentId]?.length) return; // 有缓存可按需跳过
    setLoading(agentId, true);
    try {
      const resp = await $fetch<{
        items: ChatSessionDTO[];
        next_cursor?: string | null;
      }>(`/api/v1/agents/${agentId}/sessions`, { query: { limit: pageSize } });
      sessionsByAgent.value = {
        ...sessionsByAgent.value,
        [agentId]: (resp.items || []).map(mapDTO),
      };
      hasMoreByAgent.value = {
        ...hasMoreByAgent.value,
        [agentId]: !!resp.next_cursor,
      };
      cursorsByAgent.value = {
        ...cursorsByAgent.value,
        [agentId]: resp.next_cursor ?? null,
      };
    } finally {
      setLoading(agentId, false);
    }
  }

  async function loadMore(agentId: number) {
    const cursor = cursorsByAgent.value[agentId];
    if (!hasMoreByAgent.value[agentId]) return;
    setLoading(agentId, true);
    try {
      const resp = await $fetch<{
        items: ChatSessionDTO[];
        next_cursor?: string | null;
      }>(`/api/v1/agents/${agentId}/sessions`, {
        query: { limit: pageSize, cursor },
      });
      sessionsByAgent.value = {
        ...sessionsByAgent.value,
        [agentId]: [
          ...(sessionsByAgent.value[agentId] || []),
          ...(resp.items || []).map(mapDTO),
        ],
      };
      hasMoreByAgent.value = {
        ...hasMoreByAgent.value,
        [agentId]: !!resp.next_cursor,
      };
      cursorsByAgent.value = {
        ...cursorsByAgent.value,
        [agentId]: resp.next_cursor ?? null,
      };
    } finally {
      setLoading(agentId, false);
    }
  }

  async function createSession(agentId: number): Promise<ChatSession> {
    const dto = await $fetch<ChatSessionDTO>(
      `/api/v1/agents/${agentId}/sessions`,
      { method: "POST" }
    );
    const s = mapDTO(dto);
    sessionsByAgent.value = {
      ...sessionsByAgent.value,
      [agentId]: [s, ...(sessionsByAgent.value[agentId] || [])],
    };
    return s;
  }

  async function deleteSession(agentId: number, sessionId: number | string) {
    await $fetch(`/api/v1/agents/${agentId}/sessions/${sessionId}`, {
      method: "DELETE",
    });
    sessionsByAgent.value = {
      ...sessionsByAgent.value,
      [agentId]: (sessionsByAgent.value[agentId] || []).filter(
        (x) => x.id !== sessionId
      ),
    };
  }

  return {
    sessionsByAgent,
    sessionsLoadingByAgent,
    hasMoreByAgent,
    listSessions,
    loadMore,
    createSession,
    deleteSession,
  };
}
