import { api } from './api'

export async function registerAdmin(payload){
  const { data } = await api.post('/admins', payload)
  return data
}

export async function updateAdminPhoto(adminId, file){
  const form = new FormData()
  form.append('photo', file)
  const { data } = await api.patch(`/admins/${adminId}/photo`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

export async function getAdminById(id){
  const { data } = await api.get(`/admins/${id}`)
  return data
}

export async function getAllAdmins(){
  const { data } = await api.get('/admins')
  return data
}

export async function updateAdmin(id, payload){
  const { data } = await api.put(`/admins/${id}`, payload)
  return data
}

export async function deleteAdmin(id){
  const { data } = await api.delete(`/admins/${id}`)
  return data
}
