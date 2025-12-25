import { useEffect, useState } from 'react'
import { getAllQuestions, deleteQuestion } from '../../services/userQuestionService'

export default function QuestionsManage(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getAllQuestions()
        setItems(Array.isArray(data) ? data : [])
      } catch (e) {
        setError(e?.response?.data?.error || e?.message || 'Failed to load questions')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const onDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return
    try {
      await deleteQuestion(id)
      setItems(prev => prev.filter(x => x._id !== id))
    } catch (e) {
      alert(e?.response?.data?.error || e?.message || 'Failed to delete')
    }
  }

  return (
    <div style={{ padding: '16px 20px' }}>
      <h1 style={{ marginBottom: 12 }}>User Questions</h1>
      {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}
      {loading ? (
        <div>Loading…</div>
      ) : items.length === 0 ? (
        <div>No questions found.</div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {items.map(q => (
            <div key={q._id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, display: 'grid', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 700 }}>{q.name} <span style={{ color: '#555', fontWeight: 400 }}>({q.email})</span></div>
                <button onClick={() => onDelete(q._id)} style={{ padding: '6px 10px', background: 'crimson', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Delete</button>
              </div>
              <div style={{ color: '#333' }}>{q.message}</div>
              <div style={{ color: '#666', fontSize: '0.85rem' }}>Submitted: {new Date(q.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
