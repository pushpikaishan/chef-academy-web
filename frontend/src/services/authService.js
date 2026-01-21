import { api } from './api'

export async function register(payload){
  const { data } = await api.post('/users', payload)
  return data
}

export async function updateUserPhoto(userId, file){
  const form = new FormData()
  form.append('photo', file)
  const { data } = await api.post(`/users/${userId}/photo`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

export async function login(payload){
  const { data } = await api.post('/auth/login', payload)
  return data
}

export async function getUserById(id){
  const { data } = await api.get(`/users/${id}`)
  return data
}

export async function getAllUsers(){
  const { data } = await api.get('/users')
  return data
}

export async function updateUser(id, payload){
  const { data } = await api.put(`/users/${id}`, payload)
  return data
}

export async function deleteUser(id){
  const { data } = await api.delete(`/users/${id}`)
  return data
}

export async function updateUserWatch(userId, department){
  const { data } = await api.patch(`/users/${userId}/watch`, { department })
  return data
}
