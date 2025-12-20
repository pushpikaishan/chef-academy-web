import { api } from './api'

export async function getAllRecipes(){
  const { data } = await api.get('/recipes')
  return data
}

export async function createRecipe(payload){
  const { data } = await api.post('/recipes', payload)
  return data
}

export async function updateRecipe(id, payload){
  const { data } = await api.put(`/recipes/${id}`, payload)
  return data
}

export async function deleteRecipe(id){
  const { data } = await api.delete(`/recipes/${id}`)
  return data
}

export async function updateRecipePhoto(id, file){
  const form = new FormData()
  form.append('photo', file)
  const { data } = await api.patch(`/recipes/${id}/photo`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}
