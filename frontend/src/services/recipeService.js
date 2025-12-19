import { api } from './api'

export async function getAllRecipes(){
  const { data } = await api.get('/recipes')
  return data
}
