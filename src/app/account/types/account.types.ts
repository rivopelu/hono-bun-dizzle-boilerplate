export interface CreateAccountInput {
  email: string
  name: string
  password: string
  profile_picture?: string
  created_by: string
}

export interface AccountListQuery {
  page?: number
  size?: number
  q?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export interface AccountListResult {
  items: Array<{
    id: string
    email: string
    name: string
    profile_picture: string | null
    active: boolean
    created_date: number
  }>
  total: number
}
