import { api } from './api'

export async function registerAdmin(payload){
  const { data } = await api.post('/admins', payload)
  return data
}
