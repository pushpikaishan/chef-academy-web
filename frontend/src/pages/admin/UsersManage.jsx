import { useEffect, useState } from 'react'
import { getAllUsers, updateUser, deleteUser } from '../../services/authService'

const Field = ({label, children}) => (
  <label style={{display:'grid',gap:6}}>
    <span style={{fontSize:'0.85rem',color:'#555'}}>{label}</span>
    {children}
  </label>
)

export default function UsersManage(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState({})
  const goRegister = () => (window.location.href = '/register')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAllUsers()
      setItems(data)
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const startEdit = (id) => setEditing(prev => ({...prev, [id]: true}))
  const stopEdit = (id) => setEditing(prev => ({...prev, [id]: false}))

  const onChange = (id, field, value) => {
    setItems(list => list.map(it => it._id === id ? {...it, [field]: value} : it))
  }

  const save = async (id) => {
    const item = items.find(x => x._id === id)
    try {
      await updateUser(id, { name: item.name, email: item.email, status: item.status, role: item.role })
      stopEdit(id)
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Failed to update user')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this user?')) return
    try {
      await deleteUser(id)
      setItems(list => list.filter(x => x._id !== id))
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Failed to delete user')
    }
  }

  return (
    <div>
      <h1>Manage Users</h1>
      <div style={{margin:'8px 0 16px'}}>
        <button onClick={goRegister} style={{padding:'8px 12px'}}>Add User</button>
      </div>
      {error && <div style={{color:'crimson',marginBottom:12}}>{error}</div>}
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div style={{display:'grid',gap:12}}>
          {items.map(item => (
            <div key={item._id} style={{border:'1px solid #ddd',borderRadius:8,padding:12}}>
              {editing[item._id] ? (
                <div style={{display:'grid',gap:8}}>
                  <Field label="Name">
                    <input value={item.name||''} onChange={e=>onChange(item._id,'name',e.target.value)} />
                  </Field>
                  <Field label="Email">
                    <input value={item.email||''} onChange={e=>onChange(item._id,'email',e.target.value)} />
                  </Field>
                  <Field label="Status">
                    <input value={item.status||''} onChange={e=>onChange(item._id,'status',e.target.value)} />
                  </Field>
                  <Field label="Role">
                    <select value={item.role||''} onChange={e=>onChange(item._id,'role',e.target.value)}>
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </Field>
                  <div style={{display:'flex',gap:8}}>
                    <button onClick={()=>save(item._id)}>Save</button>
                    <button onClick={()=>stopEdit(item._id)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div>
                    <div style={{fontWeight:600}}>{item.name}</div>
                    <div style={{fontSize:'0.9rem',color:'#555'}}>{item.email}</div>
                    {item.status && <div style={{fontSize:'0.9rem',color:'#555'}}>Status: {item.status}</div>}
                    {item.role && <div style={{fontSize:'0.9rem',color:'#555'}}>Role: {item.role}</div>}
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <button onClick={()=>startEdit(item._id)}>Update</button>
                    <button onClick={()=>remove(item._id)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {items.length === 0 && <div>No users found.</div>}
        </div>
      )}
    </div>
  )
}
