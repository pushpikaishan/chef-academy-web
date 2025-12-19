import { api } from './api'

export async function register(payload){
  const { data } = await api.post('/users', payload)
  return data
}
