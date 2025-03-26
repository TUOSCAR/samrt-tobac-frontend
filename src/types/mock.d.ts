declare module 'vite-plugin-mock' {
  export interface MockMethod {
    url: string
    method?: string
    timeout?: number
    statusCode?: number
    response?: ((opt: { query: Record<string, string>; body: any }) => any) | any
    rawResponse?: (req: any, res: any) => void
  }
} 