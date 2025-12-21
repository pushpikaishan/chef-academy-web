import { useEffect, useState } from 'react'
import { getAllTheories, createTheory, updateTheory, deleteTheory, addTheoryPhotos } from '../../services/theoryService'

const Field = ({label, children}) => (
  <label style={{display:'grid',gap:6}}>
    <span style={{fontSize:'0.85rem',color:'#555'}}>{label}</span>
    {children}
  </label>
)

export default function TheoriesManage(){
  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
  const resolveSrc = (src) => {
    if (!src) return ''
    if (/^https?:\/\//i.test(src)) return src
    return `${apiBase}${src.startsWith('/') ? '' : '/'}${src}`
  }

  const DEPARTMENT_OPTIONS = [
    'Kitchen',
    'Bakery',
    'Butchery'
  ]

  const asArray = (val) => {
    if (Array.isArray(val)) return val
    const s = (val || '').toString()
    return s.split(/\r?\n|,/).map(x => x.trim()).filter(Boolean)
  }

  const toDateInput = (d) => {
    if (!d) return ''
    try { return new Date(d).toISOString().slice(0,10) } catch { return '' }
  }
  const todayInput = () => {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    return `${y}-${m}-${dd}`
  }

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState({})
  const [creating, setCreating] = useState(false)
  const [draft, setDraft] = useState({ title:'', description:'', department:'', submitDate: todayInput(), photosText:'' })
  const [draftPhotoFiles, setDraftPhotoFiles] = useState([])
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAllTheories()
      setItems(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Failed to load theories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(items.length / pageSize) - 1)
    if (page > maxPage) setPage(maxPage)
  }, [items, pageSize])

  const startEdit = (id) => setEditing(prev => ({...prev, [id]: true}))
  const stopEdit = (id) => setEditing(prev => ({...prev, [id]: false}))

  const onChange = (id, field, value) => {
    setItems(list => list.map(it => it._id === id ? {...it, [field]: value} : it))
  }

  const save = async (id) => {
    const item = items.find(x => x._id === id)
    try {
      await updateTheory(id, {
        title: item.title,
        description: item.description,
        department: item.department,
        submitDate: item.submitDate,
      })
      stopEdit(id)
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Failed to update theory')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this theory?')) return
    try {
      await deleteTheory(id)
      setItems(list => list.filter(x => x._id !== id))
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Failed to delete theory')
    }
  }

  const create = async () => {
    if (!draft.title.trim()) { setError('Title is required'); return }
    try {
      const payload = {
        title: draft.title,
        description: draft.description,
        department: draft.department,
        submitDate: draft.submitDate || todayInput(),
        photos: asArray(draft.photosText)
      }
      const created = await createTheory(payload)
      let withUploads = created
      if (draftPhotoFiles && draftPhotoFiles.length > 0) {
        withUploads = await addTheoryPhotos(created._id, draftPhotoFiles)
      }
      setItems(list => [withUploads, ...list])
      setDraft({ title:'', description:'', department:'', submitDate:'', photosText:'' })
      setDraftPhotoFiles([])
      setCreating(false)
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Failed to create theory')
    }
  }

  return (
    <div>
      <h1>Manage Theory</h1>
      <div style={{display:'flex',alignItems:'center',gap:12,margin:'4px 0 12px'}}>
        <label style={{display:'flex',alignItems:'center',gap:6}}>
          <span style={{color:'#555'}}>Page size</span>
          <select value={pageSize} onChange={e=>{ setPageSize(Number(e.target.value)); setPage(0) }}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>
        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:8}}>
          <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0}>Prev</button>
          <button onClick={()=>setPage(p=>p+1)} disabled={(page+1) * pageSize >= items.length}>Next</button>
          <span style={{color:'#555',fontSize:'0.9rem'}}>
            {items.length === 0 ? '0 of 0' : `${page*pageSize+1}-${Math.min((page+1)*pageSize, items.length)} of ${items.length}`}
          </span>
        </div>
      </div>
      <div style={{margin:'8px 0 16px'}}>
        {!creating ? (
          <button onClick={()=>setCreating(true)} style={{padding:'8px 12px'}}>Add Theory</button>
        ) : (
          <div style={{border:'1px solid #ddd',borderRadius:8,padding:12,display:'grid',gap:8}}>
            <Field label="Title">
              <input value={draft.title} onChange={e=>setDraft(d=>({...d,title:e.target.value}))} />
            </Field>
            <Field label="Description">
              <textarea value={draft.description} onChange={e=>setDraft(d=>({...d,description:e.target.value}))} />
            </Field>
            <div style={{display:'flex',gap:8}}>
              <Field label="Department">
                <select value={draft.department} onChange={e=>setDraft(d=>({...d,department:e.target.value}))}>
                  <option value="">Select department</option>
                  {DEPARTMENT_OPTIONS.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div style={{display:'flex',gap:8}}>
              <Field label="Photo URLs (one per line or comma)">
                <textarea value={draft.photosText} onChange={e=>setDraft(d=>({...d,photosText:e.target.value}))} placeholder="Optional external URLs" />
              </Field>
              <Field label="Upload Photos">
                <input type="file" accept="image/*" multiple onChange={e=>setDraftPhotoFiles(Array.from(e.target.files||[]))} />
              </Field>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={create}>Create</button>
              <button onClick={()=>{setCreating(false); setDraft({ title:'', description:'', department:'', submitDate:'', photosText:'' }); setDraftPhotoFiles([])}}>Cancel</button>
            </div>
          </div>
        )}
      </div>
      {error && <div style={{color:'crimson',marginBottom:12}}>{error}</div>}
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div style={{display:'grid',gap:12}}>
          {items.slice(page*pageSize, page*pageSize + pageSize).map(item => (
            <div key={item._id} style={{border:'1px solid #ddd',borderRadius:8,padding:12}}>
              {editing[item._id] ? (
                <div style={{display:'grid',gap:8}}>
                  <Field label="Title">
                    <input value={item.title||''} onChange={e=>onChange(item._id,'title',e.target.value)} />
                  </Field>
                  <Field label="Description">
                    <textarea value={item.description||''} onChange={e=>onChange(item._id,'description',e.target.value)} />
                  </Field>
                  <div style={{display:'flex',gap:8}}>
                    <Field label="Department">
                      <select value={item.department||''} onChange={e=>onChange(item._id,'department',e.target.value)}>
                        <option value="">Select department</option>
                        {DEPARTMENT_OPTIONS.map(dep => (
                          <option key={`${item._id}-${dep}`} value={dep}>{dep}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <Field label="Upload New Photos">
                      <input type="file" accept="image/*" multiple onChange={async (e)=>{
                        const files = Array.from(e.target.files||[])
                        if (!files.length) return
                        try {
                          const updated = await addTheoryPhotos(item._id, files)
                          setItems(list => list.map(x => x._id === item._id ? updated : x))
                        } catch (err) {
                          setError(err?.response?.data?.error || err?.message || 'Photo upload failed')
                        }
                      }} />
                    </Field>
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <button onClick={()=>{ onChange(item._id,'submitDate', item.submitDate || todayInput()); save(item._id) }}>Save</button>
                    <button onClick={()=>stopEdit(item._id)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div>
                    <div style={{fontWeight:600}}>{item.title}</div>
                    {/* Preview first photo if exists */}
                    {Array.isArray(item.photos) && item.photos[0] && (
                      <img
                        src={resolveSrc(item.photos[0])}
                        alt={item.title || 'Theory'}
                        style={{width:'80px',height:'80px',objectFit:'cover',borderRadius:'6px',background:'#f2f2f2',margin:'6px 0'}}
                        onError={(e)=>{ e.currentTarget.style.display='none' }}
                      />
                    )}
                    {item.department && <div style={{fontSize:'0.9rem',color:'#555'}}>Department: {item.department}</div>}
                    {item.submitDate && <div style={{fontSize:'0.9rem',color:'#555'}}>Submit: {toDateInput(item.submitDate)}</div>}
                    {Array.isArray(item.photos) && item.photos.length > 0 && (
                      <div style={{fontSize:'0.9rem',color:'#555'}}>Photos: {item.photos.length}</div>
                    )}
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <button onClick={()=>startEdit(item._id)}>Update</button>
                    <button onClick={()=>remove(item._id)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {items.length === 0 && <div>No theory items found.</div>}
        </div>
      )}
      <div style={{display:'flex',alignItems:'center',gap:8,marginTop:12}}>
        <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0}>Prev</button>
        <button onClick={()=>setPage(p=>p+1)} disabled={(page+1) * pageSize >= items.length}>Next</button>
        <span style={{color:'#555',fontSize:'0.9rem'}}>
          {items.length === 0 ? '0 of 0' : `${page*pageSize+1}-${Math.min((page+1)*pageSize, items.length)} of ${items.length}`}
        </span>
      </div>
    </div>
  )
}

