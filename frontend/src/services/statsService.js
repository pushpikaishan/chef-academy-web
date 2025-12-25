import { api } from './api'

export async function getCountsByDepartment(department){
  const { data } = await api.get('/stats', { params: { department } })
  return data
}

export async function getGlobalCounts(){
  const { data } = await api.get('/stats')
  return data
}
