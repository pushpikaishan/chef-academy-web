import { api } from './api'

export async function sendQuestion(payload){
  const { data } = await api.post('/userquestions', payload)
  return data
}

export async function getAllQuestions(){
  const { data } = await api.get('/userquestions')
  return data
}

export async function deleteQuestion(id){
  const { data } = await api.delete(`/userquestions/${id}`)
  return data
}
