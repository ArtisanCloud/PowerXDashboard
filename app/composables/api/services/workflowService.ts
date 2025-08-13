import { useApiClient } from '../index';
import type { ApiResponse } from '../types';
import type { KindSpec, PaletteItem, Workflow, WfNode, Edge } from '~/types/workflow';

// 工作流相关接口类型定义
export interface WorkflowCreateParams {
  name: string;
  description?: string;
}

export interface WorkflowUpdateParams {
  name?: string;
  description?: string;
  nodes?: WfNode[];
  edges?: Edge[];
}

export interface WorkflowListResponse {
  workflows: Array<{
    id: string;
    name: string;
    description?: string;
    updatedAt: string;
  }>;
}

export interface KindsResponse {
  apiVersion: string;
  kinds: KindSpec[];
}

export interface PaletteResponse {
  apiVersion: string;
  palette: PaletteItem[];
}

/**
 * 工作流服务 API
 */
export const useWorkflowService = () => {
  const apiClient = useApiClient();
  const baseUrl = '/workflow';

  return {
    /**
     * 获取节点类型规格
     */
    getKinds: (): Promise<KindsResponse> => {
      // 模拟数据
      const mockKinds: KindsResponse = {
        apiVersion: "corex.wf/v1",
        kinds: [
          {
            kind: "llm",
            version: "1.0.0",
            label: "大模型",
            ports: {
              inputs: [{ name: "in" }],
              outputs: [{ name: "out" }, { name: "error" }]
            },
            defaultProps: {
              model: "gpt-4o",
              prompt: "",
              temperature: 0.3
            },
            schema: {
              type: "object",
              required: ["model", "prompt"],
              properties: {
                model: { type: "string" },
                prompt: { type: "string", minLength: 0 },
                temperature: { type: "number", minimum: 0, maximum: 1 }
              }
            },
            ui: {
              shape: "card",
              colorToken: "primary",
              icon: "i-heroicons-cpu-chip",
              size: { w: 220, h: 96 },
              badges: ["AI"],
              handles: {
                left: ["in"],
                right: ["out", "error"]
              }
            }
          },
          {
            kind: "http",
            version: "1.0.0",
            label: "HTTP 请求",
            ports: {
              inputs: [{ name: "in" }],
              outputs: [{ name: "ok" }, { name: "fail" }]
            },
            defaultProps: {
              method: "GET",
              url: "",
              headers: {},
              body: {}
            },
            schema: {
              type: "object",
              required: ["method", "url"],
              properties: {
                method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE"] },
                url: { type: "string" },
                headers: { type: "object", additionalProperties: { type: "string" } },
                body: { type: "object" }
              }
            },
            ui: {
              shape: "card",
              colorToken: "info",
              icon: "i-heroicons-globe-alt",
              size: { w: 260, h: 110 },
              badges: ["IO"]
            }
          },
          {
            kind: "selector",
            version: "1.0.0",
            label: "条件",
            ports: {
              inputs: [{ name: "in" }],
              outputs: [{ name: "true" }, { name: "false" }]
            },
            defaultProps: {
              expr: "vars.score >= 80"
            },
            schema: {
              type: "object",
              required: ["expr"],
              properties: {
                expr: { type: "string" }
              }
            },
            ui: {
              shape: "diamond",
              colorToken: "warning",
              icon: "i-heroicons-arrow-path",
              size: { w: 160, h: 120 }
            }
          }
        ]
      };

      return Promise.resolve(mockKinds);
    },

    /**
     * 获取节点模板清单
     */
    getPalette: (): Promise<PaletteResponse> => {
      // 模拟数据
      const mockPalette: PaletteResponse = {
        apiVersion: "corex.wf/v1",
        palette: [
          {
            id: "llm.basic",
            kind: "llm",
            label: "LLM（通用）",
            icon: "i-heroicons-cpu-chip",
            defaultProps: {
              model: "gpt-4o",
              temperature: 0.2,
              prompt: "请根据输入生成摘要"
            },
            uiOverrides: {
              colorToken: "primary",
              previewTpl: "{{props.model}} · T={{props.temperature}}"
            }
          },
          {
            id: "llm.summarize",
            kind: "llm",
            label: "LLM（摘要）",
            icon: "i-heroicons-document-text",
            defaultProps: {
              model: "gpt-4o",
              temperature: 0.1,
              prompt: "请对以下内容进行摘要，提取关键信息："
            },
            uiOverrides: {
              colorToken: "success",
              previewTpl: "摘要生成器"
            }
          },
          {
            id: "http.get",
            kind: "http",
            label: "HTTP GET",
            icon: "i-heroicons-arrow-down-on-square",
            defaultProps: {
              method: "GET",
              url: "https://api.example.com/v1/items"
            },
            uiOverrides: {
              colorToken: "info",
              previewTpl: "{{props.method}} {{props.url}}"
            }
          },
          {
            id: "http.post.json",
            kind: "http",
            label: "HTTP POST(JSON)",
            icon: "i-heroicons-arrow-up-on-square",
            defaultProps: {
              method: "POST",
              url: "https://api.example.com/v1/items",
              headers: { "Content-Type": "application/json" },
              body: { "name": "" }
            },
            uiOverrides: {
              colorToken: "success"
            }
          },
          {
            id: "selector.score",
            kind: "selector",
            label: "高意向？(score>=80)",
            icon: "i-heroicons-adjustments-horizontal",
            defaultProps: {
              expr: "vars.score >= 80"
            }
          }
        ]
      };

      return Promise.resolve(mockPalette);
    },

    /**
     * 获取工作流列表
     */
    getWorkflowList: (): Promise<WorkflowListResponse> => {
      // 模拟数据
      const mockList: WorkflowListResponse = {
        workflows: [
          {
            id: "wf-1",
            name: "客户意向分析流程",
            description: "分析客户意向并根据分数进行不同处理",
            updatedAt: "2024-08-10T12:30:00Z"
          },
          {
            id: "wf-2",
            name: "内容生成工作流",
            description: "根据输入生成多种格式的内容",
            updatedAt: "2024-08-12T09:15:00Z"
          },
          {
            id: "wf-3",
            name: "数据处理流程",
            description: "从API获取数据并进行处理",
            updatedAt: "2024-08-13T15:45:00Z"
          }
        ]
      };

      return Promise.resolve(mockList);
    },

    /**
     * 获取指定工作流
     */
    getWorkflow: (id: string): Promise<Workflow> => {
      // 模拟数据
      const workflows: Record<string, Workflow> = {
        "wf-1": {
          id: "wf-1",
          name: "客户意向分析流程",
          description: "分析客户意向并根据分数进行不同处理",
          nodes: [
            {
              id: "llm.basic-1",
              kind: "llm",
              paletteId: "llm.basic",
              label: "LLM（通用）",
              props: {
                model: "gpt-4o",
                temperature: 0.2,
                prompt: "请分析以下客户反馈，并给出一个0-100的意向分数："
              },
              ui: {
                shape: "card",
                colorToken: "primary",
                icon: "i-heroicons-cpu-chip",
                previewTpl: "{{props.model}} · T={{props.temperature}}",
                size: { w: 220, h: 96 },
                badges: ["AI"]
              },
              position: { x: 100, y: 100 }
            }
          ],
          edges: [],
          version: "1.0.0",
          createdAt: "2024-08-10T12:30:00Z",
          updatedAt: "2024-08-10T12:30:00Z"
        }
      };

      if (workflows[id]) {
        return Promise.resolve(workflows[id]);
      } else {
        return Promise.reject(new Error(`工作流 ${id} 不存在`));
      }
    },

    /**
     * 创建工作流
     */
    createWorkflow: (data: WorkflowCreateParams): Promise<ApiResponse<Workflow>> => {
      const newWorkflow: Workflow = {
        id: `wf-${crypto.randomUUID()}`,
        name: data.name,
        description: data.description || '',
        nodes: [],
        edges: [],
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return Promise.resolve({
        code: 0,
        message: 'success',
        data: newWorkflow
      });
    },

    /**
     * 更新工作流
     */
    updateWorkflow: (id: string, data: WorkflowUpdateParams): Promise<ApiResponse<Workflow>> => {
      // 模拟更新
      const updatedWorkflow: Workflow = {
        id,
        name: data.name || '工作流',
        description: data.description || '',
        nodes: data.nodes || [],
        edges: data.edges || [],
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return Promise.resolve({
        code: 0,
        message: 'success',
        data: updatedWorkflow
      });
    },

    /**
     * 删除工作流
     */
    deleteWorkflow: (id: string): Promise<ApiResponse<null>> => {
      return Promise.resolve({
        code: 0,
        message: 'success',
        data: null
      });
    }
  };
};