export interface MenuItem {
  title: string
  icon?: string
  path: string
  roles?: string[]
  children?: MenuItem[]
} 