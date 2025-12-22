import { useEffect, useState } from 'react'
import { getAllLessonVideos, createLessonVideo, updateLessonVideo, deleteLessonVideo, updateLessonVideoFile } from '../../services/lessonVideoService'

const Field = ({label, children}) => (
  <label style={{display:'grid',gap:6}}>
    <span style={{fontSize:'0.85rem',color:'#555'}}>{label}</span>
    {children}
  </label>
)

export default function LessonsManage(){
  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
  const resolveSrc = (src) => {
    if (!src) return ''
    if (/^https?:\/\//i.test(src)) return src
    return `${apiBase}${src.startsWith('/') ? '' : '/'}${src}`
  }
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState({})
  const [creating, setCreating] = useState(false)
  const [draft, setDraft] = useState({
    title:'',
    description:'',
    video:'',
    department:''
  })
  const [draftVideoFile, setDraftVideoFile] = useState(null)
  const [draftUploadProgress, setDraftUploadProgress] = useState(0)
  const [isDraftUploading, setIsDraftUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({}) // per-item percentage
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAllLessonVideos()
      setItems(data)
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Failed to load lessons')
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
      await updateLessonVideo(id, {
        title: item.title,
        description: item.description,
        video: item.video,
        department: item.department,
      })
      stopEdit(id)
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Failed to update lesson')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this lesson?')) return
    try {
      await deleteLessonVideo(id)
      setItems(list => list.filter(x => x._id !== id))
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Failed to delete lesson')
    }
  }

  const create = async () => {
    if (!draft.title.trim()) { setError('Title is required'); return }
    try {
      const created = await createLessonVideo({
        title: draft.title,
        description: draft.description,
        video: draft.video,
        department: draft.department,
      })
      let final = created
      if (draftVideoFile) {
        setIsDraftUploading(true)
        setDraftUploadProgress(0)
        const updated = await updateLessonVideoFile(created._id, draftVideoFile, (p)=>{
          setDraftUploadProgress(p ?? 0)
        })
        final = updated
      }
      setItems(list => [final, ...list])
      setDraft({ title:'', description:'', video:'', department:'' })
      setDraftVideoFile(null)
      setDraftUploadProgress(0)
      setIsDraftUploading(false)
      setCreating(false)
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Failed to create lesson')
      setIsDraftUploading(false)
    }
  }

  return (
    <div>
      <h1>Manage Lesson Videos</h1>
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
          <button onClick={()=>setCreating(true)} style={{padding:'8px 12px'}}>Add Lesson Video</button>
        ) : (
          <div style={{border:'1px solid #ddd',borderRadius:8,padding:12,display:'grid',gap:8}}>
            <Field label="Title">
              <input value={draft.title} onChange={e=>setDraft(d=>({...d,title:e.target.value}))} />
            </Field>
            <Field label="Description">
              <textarea value={draft.description} onChange={e=>setDraft(d=>({...d,description:e.target.value}))} />
            </Field>
            <Field label="Department">
              <select value={draft.department} onChange={e=>setDraft(d=>({...d,department:e.target.value}))}>
                <option value="">Select department</option>
                <option value="Kitchen">Hot & Cold Kitchen</option>
                <option value="Bakery">Bakery & Pastry</option>
                <option value="Butchery">Butchery & Fish</option>
              </select>
            </Field>
            <div style={{display:'flex',gap:8}}>
              <Field label="Video URL">
                <input value={draft.video} onChange={e=>setDraft(d=>({...d,video:e.target.value}))} placeholder="https://..." />
              </Field>
              <Field label="Upload Video">
                <input type="file" accept="video/*" onChange={e=>setDraftVideoFile(e.target.files?.[0] || null)} />
                {draftVideoFile && (
                  <div style={{display:'grid',gap:6}}>
                    <span style={{fontSize:'0.85rem',color:'#555'}}>
                      {isDraftUploading ? `Uploading… ${draftUploadProgress}%` : 'Ready to upload'}
                    </span>
                    <div style={{height:8,background:'#eee',borderRadius:4,overflow:'hidden',width:180}}>
                      <div style={{height:'100%',width:`${draftUploadProgress}%`,background:'#4a90e2',transition:'width 200ms ease'}} />
                    </div>
                  </div>
                )}
              </Field>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={create} disabled={isDraftUploading}>Create</button>
              <button onClick={()=>{setCreating(false); setDraft({ title:'', description:'', video:'', department:'' })}}>Cancel</button>
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
                  <Field label="Department">
                    <select value={item.department||''} onChange={e=>onChange(item._id,'department',e.target.value)}>
                      <option value="">Select department</option>
                      <option value="Hot & Cold Kitchen">Hot & Cold Kitchen</option>
                      <option value="Bakery & Pastry">Bakery & Pastry</option>
                      <option value="Butchery & Fish">Butchery & Fish</option>
                    </select>
                  </Field>
                  <Field label="Video URL">
                    <input value={item.video||''} onChange={e=>onChange(item._id,'video',e.target.value)} />
                  </Field>
                  <Field label="Upload New Video">
                    <input type="file" accept="video/*" onChange={async (e)=>{
                      const file = e.target.files?.[0]
                      if (!file) return
                      try {
                        setUploadProgress(prev => ({...prev, [item._id]: 0}))
                        const updated = await updateLessonVideoFile(item._id, file, (p)=>{
                          setUploadProgress(prev => ({...prev, [item._id]: p ?? 0}))
                        })
                        setItems(list => list.map(x => x._id === item._id ? updated : x))
                        // briefly show 100% then clear indicator
                        setUploadProgress(prev => ({...prev, [item._id]: 100}))
                        setTimeout(() => {
                          setUploadProgress(prev => {
                            const next = {...prev}
                            delete next[item._id]
                            return next
                          })
                        }, 1200)
                      } catch (err) {
                        setError(err?.response?.data?.error || err?.message || 'Video upload failed')
                        setUploadProgress(prev => {
                          const next = {...prev}
                          delete next[item._id]
                          return next
                        })
                      }
                    }} />
                    {uploadProgress[item._id] !== undefined && (
                      <div style={{display:'grid',gap:6,marginTop:6}}>
                        <span style={{fontSize:'0.85rem',color:'#555'}}>
                          Uploading… {uploadProgress[item._id]}%
                        </span>
                        <div style={{height:8,background:'#eee',borderRadius:4,overflow:'hidden',width:180}}>
                          <div style={{height:'100%',width:`${uploadProgress[item._id]}%`,background:'#4a90e2',transition:'width 200ms ease'}} />
                        </div>
                      </div>
                    )}
                  </Field>
                  <div style={{display:'flex',gap:8}}>
                    <button onClick={()=>save(item._id)}>Save</button>
                    <button onClick={()=>stopEdit(item._id)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div>
                    <div style={{fontWeight:600}}>{item.title}</div>
                    {item.department && <div style={{fontSize:'0.9rem',color:'#555'}}>Department: {item.department}</div>}
                    {item.video && (
                      <div style={{fontSize:'0.9rem',color:'#555'}}>
                        Video: <a href={resolveSrc(item.video)} target="_blank" rel="noopener noreferrer">{resolveSrc(item.video)}</a>
                        <div style={{marginTop:6}}>
                          <video
                            src={resolveSrc(item.video)}
                            controls
                            style={{width:'220px',borderRadius:6,background:'#000'}}
                            onError={(e)=>{ e.currentTarget.style.display='none' }}
                          />
                        </div>
                      </div>
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
          {items.length === 0 && <div>No lessons found.</div>}
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
