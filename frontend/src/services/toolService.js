import { api } from './api'

export async function getAllTools(){
  const { data } = await api.get('/tools')
  return data
}

export async function createTool(payload){
  const { data } = await api.post('/tools', payload)
  return data
}

export async function updateTool(id, payload){
  const { data } = await api.put(`/tools/${id}`, payload)
  return data
}

export async function deleteTool(id){
  const { data } = await api.delete(`/tools/${id}`)
  return data
}

export async function updateToolPhoto(id, file){
  const form = new FormData()
  form.append('photo', file)
  const { data } = await api.patch(`/tools/${id}/photo`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}
