import { api } from './api'

export async function getAllTheories(){
  const { data } = await api.get('/theories')
  return data
}

export async function getTheoryById(id){
  const { data } = await api.get(`/theories/${id}`)
  return data
}

export async function createTheory(payload){
  const { data } = await api.post('/theories', payload)
  return data
}

export async function updateTheory(id, payload){
  const { data } = await api.put(`/theories/${id}`, payload)
  return data
}

export async function deleteTheory(id){
  const { data } = await api.delete(`/theories/${id}`)
  return data
}

export async function addTheoryPhotos(id, files){
  const form = new FormData()
  ;(files || []).forEach(f => form.append('photos', f))
  const { data } = await api.patch(`/theories/${id}/photos`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}
