declare module 'vite-plugin-mock' {
  export interface MockMethod {
    url: string
    method?: string
    timeout?: number
    statusCode?: number
    response?: (options?: any) => any
    rawResponse?: (req: any, res: any) => any
  }
}

// 声明mockjs模块
declare module 'mockjs' {
  export const Random: {
    guid(): string
    integer(min: number, max: number): number
    float(min: number, max: number, dmin?: number, dmax?: number): number
    datetime(format?: string): string
    date(format?: string): string
    image(size?: string): string
    cname(): string
    cparagraph(min?: number, max?: number): string
    cword(pool?: string | number, min?: number, max?: number): string
    boolean(): boolean
    pick<T>(arr: T[]): T
  }
} 