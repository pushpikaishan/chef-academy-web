import { api } from './api'

export async function getAllLessonVideos(){
  const { data } = await api.get('/lessonvideos')
  return data
}

export async function getLessonVideoById(id){
  const { data } = await api.get(`/lessonvideos/${id}`)
  return data
}

export async function createLessonVideo(payload){
  const { data } = await api.post('/lessonvideos', payload)
  return data
}

export async function updateLessonVideo(id, payload){
  const { data } = await api.put(`/lessonvideos/${id}`, payload)
  return data
}

export async function deleteLessonVideo(id){
  const { data } = await api.delete(`/lessonvideos/${id}`)
  return data
}

export async function updateLessonVideoFile(id, file, onProgress){
  const form = new FormData()
  form.append('video', file)
  const { data } = await api.patch(`/lessonvideos/${id}/video`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (typeof onProgress === 'function') {
        try {
          const total = event.total || event?.progress ? (event?.progress * event.loaded) : undefined
          if (event.total) {
            const percent = Math.round((event.loaded / event.total) * 100)
            onProgress(percent)
          } else if (event?.loaded && event?.progress) {
            const percent = Math.round((event.progress) * 100)
            onProgress(percent)
          }
        } catch (_) {
          // ignore progress errors
        }
      }
    }
  })
  return data
}
