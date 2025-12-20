import { useEffect, useState } from 'react'
import { getAllTools, createTool, updateTool, deleteTool, updateToolPhoto } from '../../services/toolService'

const Field = ({label, children}) => (
  <label style={{display:'grid',gap:6}}>
    <span style={{fontSize:'0.85rem',color:'#555'}}>{label}</span>
    {children}
  </label>
)

export default function ToolsManage(){
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
  const CATEGORY_BY_DEPT = {
    'Kitchen': [
      'Cutting Tools',
      'Cooking Equipment',
      'Preparation Tools',
      'Cooking Utensils',
      'Pots & Containers',
      'Storage Equipment',
      'Presentation Tools',
      'Measuring Tools',
      'Safety Tools',
    ],
    'Bakery': [
      'Measuring Tools',
      'Mixing Tools',
      'Baking Equipment',
      'Shaping Tools',
      'Pastry Tools',
    ],
    'Butchery': [
      'Cutting Tools',
      'Sharpening Tools',
      'Processing Tools',
      'Holding Tools',
      'Safety Tools',
    ],
  }
  const getCategoryOptions = (dept) => CATEGORY_BY_DEPT[dept] || []
  const makeCategoryOptions = (dept, current) => {
    const opts = getCategoryOptions(dept)
    if (current && !opts.includes(current)) return [current, ...opts]
    return opts
  }

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState({})
  const [creating, setCreating] = useState(false)
  const [draft, setDraft] = useState({ name:'', description:'', category:'', department:'', photo:'' })
  const [draftPhotoFile, setDraftPhotoFile] = useState(null)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAllTools()
      setItems(data)
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Failed to load tools')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    const opts = getCategoryOptions(draft.department)
    if (!opts.includes(draft.category)) {
      setDraft(d => ({ ...d, category: '' }))
    }
  }, [draft.department])

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
      await updateTool(id, {
        name: item.name,
        description: item.description,
        category: item.category,
        department: item.department,
        photo: item.photo,
      })
      stopEdit(id)
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Failed to update tool')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this tool?')) return
    try {
      await deleteTool(id)
      setItems(list => list.filter(x => x._id !== id))
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Failed to delete tool')
    }
  }

  const create = async () => {
    if (!draft.name.trim()) { setError('Name is required'); return }
    try {
      const created = await createTool({
        name: draft.name,
        description: draft.description,
        category: draft.category,
        department: draft.department,
        photo: draft.photo
      })
      if (draftPhotoFile) {
        const updated = await updateToolPhoto(created._id, draftPhotoFile)
        setItems(list => [updated, ...list])
      } else {
        setItems(list => [created, ...list])
      }
      setDraft({ name:'', description:'', category:'', department:'', photo:'' })
      setDraftPhotoFile(null)
      setCreating(false)
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Failed to create tool')
    }
  }

  return (
    <div>
      <h1>Manage Tools</h1>
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
          <button onClick={()=>setCreating(true)} style={{padding:'8px 12px'}}>Add Tool</button>
        ) : (
          <div style={{border:'1px solid #ddd',borderRadius:8,padding:12,display:'grid',gap:8}}>
            <Field label="Name">
              <input value={draft.name} onChange={e=>setDraft(d=>({...d,name:e.target.value}))} />
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
              <Field label="Category">
                <select
                  value={draft.category}
                  onChange={e=>setDraft(d=>({ ...d, category: e.target.value }))}
                  disabled={!draft.department}
                >
                  <option value="">{draft.department ? 'Select category' : 'Select department first'}</option>
                  {getCategoryOptions(draft.department).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </Field>
              
            </div>
            <div style={{display:'flex',gap:8}}>
              <Field label="Photo URL">
                <input value={draft.photo} onChange={e=>setDraft(d=>({...d,photo:e.target.value}))} placeholder="Optional external URL" />
              </Field>
              <Field label="Upload Photo">
                <input type="file" accept="image/*" onChange={e=>setDraftPhotoFile(e.target.files?.[0] || null)} />
              </Field>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={create}>Create</button>
              <button onClick={()=>{setCreating(false); setDraft({ name:'', description:'', category:'', department:'', photo:'' })}}>Cancel</button>
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
                  <Field label="Name">
                    <input value={item.name||''} onChange={e=>onChange(item._id,'name',e.target.value)} />
                  </Field>
                  <Field label="Description">
                    <textarea value={item.description||''} onChange={e=>onChange(item._id,'description',e.target.value)} />
                  </Field>
                  <div style={{display:'flex',gap:8}}>
                    <Field label="Category">
                      <select
                        value={item.category||''}
                        onChange={e=>onChange(item._id,'category',e.target.value)}
                        disabled={!item.department}
                      >
                        <option value="">{item.department ? 'Select category' : 'Select department first'}</option>
                        {makeCategoryOptions(item.department||'', item.category||'').map(cat => (
                          <option key={`${item._id}-${cat}`} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </Field>
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
                    <Field label="Photo URL">
                      <input value={item.photo||''} onChange={e=>onChange(item._id,'photo',e.target.value)} />
                    </Field>
                    <Field label="Upload New Photo">
                      <input type="file" accept="image/*" onChange={async (e)=>{
                        const file = e.target.files?.[0]
                        if (!file) return
                        try {
                          const updated = await updateToolPhoto(item._id, file)
                          setItems(list => list.map(x => x._id === item._id ? updated : x))
                        } catch (err) {
                          setError(err?.response?.data?.error || err?.message || 'Photo upload failed')
                        }
                      }} />
                    </Field>
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <button onClick={()=>save(item._id)}>Save</button>
                    <button onClick={()=>stopEdit(item._id)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div>
                    <div style={{fontWeight:600}}>{item.name}</div>
                    {item.photo && (
                      <img
                        src={resolveSrc(item.photo)}
                        alt={item.name || 'Tool'}
                        style={{width:'80px',height:'80px',objectFit:'cover',borderRadius:'6px',background:'#f2f2f2',margin:'6px 0'}}
                        onError={(e)=>{ e.currentTarget.style.display='none' }}
                      />
                    )}
                    {item.category && <div style={{fontSize:'0.9rem',color:'#555'}}>Category: {item.category}</div>}
                    {item.department && <div style={{fontSize:'0.9rem',color:'#555'}}>Department: {item.department}</div>}
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <button onClick={()=>startEdit(item._id)}>Update</button>
                    <button onClick={()=>remove(item._id)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {items.length === 0 && <div>No tools found.</div>}
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
