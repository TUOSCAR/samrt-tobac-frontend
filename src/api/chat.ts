import request from './index'
import { ApiResponse, ChatSession, ChatMessage, QuestionTemplate } from '@/types/api'
import { 
  getChatSessions as mockGetChatSessions, 
  getChatSessionDetail as mockGetSessionDetail, 
  sendChatMessage as mockSendMessage,
  getQuestionTemplates as mockGetTemplates
} from '@/mock/chat'

// 获取用户会话列表
export const getUserChatSessions = (userId: number): Promise<ApiResponse<ChatSession[]>> => {
  // 直接使用模拟数据
  return Promise.resolve(mockGetChatSessions(userId))
}

// 获取会话详情
export const getChatSession = (sessionId: string): Promise<ApiResponse<ChatSession>> => {
  // 直接使用模拟数据
  return Promise.resolve(mockGetSessionDetail(sessionId))
}

// 发送消息
export const sendMessage = (
  sessionId: string, 
  message: string, 
  userId: number, 
  fieldId?: number, 
  taskId?: number
): Promise<ApiResponse<{
  userMessage: ChatMessage,
  aiMessage: ChatMessage
}>> => {
  // 直接使用模拟数据
  return Promise.resolve(mockSendMessage(sessionId, message, userId, fieldId, taskId))
}

// 获取问题模板
export const getTemplates = (): Promise<ApiResponse<QuestionTemplate[]>> => {
  // 直接使用模拟数据
  return Promise.resolve(mockGetTemplates())
}

// 实际项目中，上述API会改为调用后端接口，例如：
/*
// 获取用户会话列表
export const getUserChatSessions = (userId: number) => {
  return request.get<ApiResponse<ChatSession[]>>('/api/llm/chat/history/', { params: { user_id: userId } })
}

// 获取会话详情
export const getChatSession = (sessionId: string) => {
  return request.get<ApiResponse<ChatSession>>(`/api/llm/chat/session/${sessionId}/`)
}

// 发送消息
export const sendMessage = (sessionId: string, message: string, userId: number, fieldId?: number, taskId?: number) => {
  return request.post<ApiResponse<{
    userMessage: ChatMessage,
    aiMessage: ChatMessage
  }>>('/api/llm/chat/', {
    session_id: sessionId,
    message,
    user_id: userId,
    field_id: fieldId,
    task_id: taskId
  })
}

// 获取问题模板
export const getTemplates = () => {
  return request.get<ApiResponse<QuestionTemplate[]>>('/api/llm/chat/templates/')
}
*/ 