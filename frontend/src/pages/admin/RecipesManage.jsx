import { useEffect, useState } from 'react'
import { getAllRecipes, createRecipe, updateRecipe, deleteRecipe, updateRecipePhoto } from '../../services/recipeService'

const Field = ({label, children}) => (
  <label style={{display:'grid',gap:6}}>
    <span style={{fontSize:'0.85rem',color:'#555'}}>{label}</span>
    {children}
  </label>
)

export default function RecipesManage(){
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
    name:'',
    description:'',
    category:'',
    serving:'',
    time:'',
    department:'',
    ingredients:'',
    directions:'',
    photo:'',
    videolink:''
  })
  const [draftPhotoFile, setDraftPhotoFile] = useState(null)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAllRecipes()
      setItems(data)
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Failed to load recipes')
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
      const ingredients = Array.isArray(item.ingredients)
        ? item.ingredients
        : (item.ingredients || '')
            .split(/\r?\n/)
            .map(s => s.trim())
            .filter(Boolean)
      const directions = Array.isArray(item.directions)
        ? item.directions
        : (item.directions || '')
            .split(/\r?\n/)
            .map(s => s.trim())
            .filter(Boolean)
      await updateRecipe(id, {
        name: item.name,
        description: item.description,
        category: item.category,
        serving: item.serving,
        time: item.time,
        department: item.department,
        ingredients,
        directions,
        photo: item.photo,
        video: item.video,
        link: item.link
      })
      stopEdit(id)
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Failed to update recipe')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this recipe?')) return
    try {
      await deleteRecipe(id)
      setItems(list => list.filter(x => x._id !== id))
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Failed to delete recipe')
    }
  }

  const create = async () => {
    if (!draft.name.trim()) { setError('Name is required'); return }
    try {
      const payload = {
        name: draft.name,
        description: draft.description,
        category: draft.category,
        serving: draft.serving,
        time: draft.time,
        department: draft.department,
        photo: draft.photo,
        videolink: draft.videolink,
        ingredients: (draft.ingredients || '')
          .split(/\r?\n/)
          .map(s => s.trim())
          .filter(Boolean),
        directions: (draft.directions || '')
          .split(/\r?\n/)
          .map(s => s.trim())
          .filter(Boolean)
      }
      const created = await createRecipe(payload)
      if (draftPhotoFile) {
        const updated = await updateRecipePhoto(created._id, draftPhotoFile)
        // prefer updated recipe with photo
        setItems(list => [updated, ...list])
      } else {
        setItems(list => [created, ...list])
      }
      setDraft({ name:'', description:'', category:'', serving:'', time:'', department:'', ingredients:'', directions:'', photo:'', videolink:'' })
      setDraftPhotoFile(null)
      setCreating(false)
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Failed to create recipe')
    }
  }

  return (
    <div>
      <h1>Manage Recipes</h1>
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
          <button onClick={()=>setCreating(true)} style={{padding:'8px 12px'}}>Add Recipe</button>
        ) : (
          <div style={{border:'1px solid #ddd',borderRadius:8,padding:12,display:'grid',gap:8}}>
            <Field label="Name">
              <input value={draft.name} onChange={e=>setDraft(d=>({...d,name:e.target.value}))} />
            </Field>
            <Field label="Description">
              <textarea value={draft.description} onChange={e=>setDraft(d=>({...d,description:e.target.value}))} />
            </Field>
            <Field label="Category">
              <input value={draft.category} onChange={e=>setDraft(d=>({...d,category:e.target.value}))} />
            </Field>
            <Field label="Department">
              <select value={draft.department} onChange={e=>setDraft(d=>({...d,department:e.target.value}))}>
                <option value="">Select department</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Bakery">Bakery</option>
                <option value="Butchery">Butchery</option>
              </select>
            </Field>
            <div style={{display:'flex',gap:8}}>
              <Field label="Serving">
                <input value={draft.serving} onChange={e=>setDraft(d=>({...d,serving:e.target.value}))} />
              </Field>
              <Field label="Time">
                <input value={draft.time} onChange={e=>setDraft(d=>({...d,time:e.target.value}))} />
              </Field>
            </div>
            <Field label="Ingredients (one per line)">
              <textarea value={draft.ingredients} onChange={e=>setDraft(d=>({...d,ingredients:e.target.value}))} />
            </Field>
            <Field label="Directions (one per line)">
              <textarea value={draft.directions} onChange={e=>setDraft(d=>({...d,directions:e.target.value}))} />
            </Field>
            <div style={{display:'flex',gap:8}}>
              <Field label="Photo URL">
                <input value={draft.photo} onChange={e=>setDraft(d=>({...d,photo:e.target.value}))} placeholder="Optional external URL" />
              </Field>
              <Field label="Upload Photo">
                <input type="file" accept="image/*" onChange={e=>setDraftPhotoFile(e.target.files?.[0] || null)} />
              </Field>
              <Field label="Video URL">
                <input value={draft.videolink} onChange={e=>setDraft(d=>({...d,videolink:e.target.value}))} />
              </Field>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={create}>Create</button>
              <button onClick={()=>{setCreating(false); setDraft({ name:'', description:'', category:'', serving:'', time:'' })}}>Cancel</button>
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
                  <Field label="Category">
                    <input value={item.category||''} onChange={e=>onChange(item._id,'category',e.target.value)} />
                  </Field>
                  <Field label="Department">
                    <select value={item.department||''} onChange={e=>onChange(item._id,'department',e.target.value)}>
                      <option value="">Select department</option>
                      <option value="Hot & Cold Kitchen">Hot & Cold Kitchen</option>
                      <option value="Bakery & Pastry">Bakery & Pastry</option>
                      <option value="Butchery & Fish">Butchery & Fish</option>
                    </select>
                  </Field>
                  <div style={{display:'flex',gap:8}}>
                    <Field label="Serving">
                      <input value={item.serving||''} onChange={e=>onChange(item._id,'serving',e.target.value)} />
                    </Field>
                    <Field label="Time">
                      <input value={item.time||''} onChange={e=>onChange(item._id,'time',e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Ingredients (one per line)">
                    <textarea value={Array.isArray(item.ingredients) ? item.ingredients.join('\n') : (item.ingredients||'')} onChange={e=>onChange(item._id,'ingredients',e.target.value)} />
                  </Field>
                  <Field label="Directions (one per line)">
                    <textarea value={Array.isArray(item.directions) ? item.directions.join('\n') : (item.directions||'')} onChange={e=>onChange(item._id,'directions',e.target.value)} />
                  </Field>
                  <div style={{display:'flex',gap:8}}>
                    <Field label="Photo URL">
                      <input value={item.photo||''} onChange={e=>onChange(item._id,'photo',e.target.value)} />
                    </Field>
                    <Field label="Upload New Photo">
                      <input type="file" accept="image/*" onChange={async (e)=>{
                        const file = e.target.files?.[0]
                        if (!file) return
                        try {
                          const updated = await updateRecipePhoto(item._id, file)
                          setItems(list => list.map(x => x._id === item._id ? updated : x))
                        } catch (err) {
                          setError(err?.response?.data?.error || err?.message || 'Photo upload failed')
                        }
                      }} />
                    </Field>
                    <Field label="Video URL">
                      <input value={item.videolink||''} onChange={e=>onChange(item._id,'videolink',e.target.value)} />
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
                        alt={item.name || 'Recipe'}
                        style={{width:'80px',height:'80px',objectFit:'cover',borderRadius:'6px',background:'#f2f2f2',margin:'6px 0'}}
                        onError={(e)=>{ e.currentTarget.style.display='none' }}
                      />
                    )}
                    {item.category && <div style={{fontSize:'0.9rem',color:'#555'}}>Category: {item.category}</div>}
                    {item.department && <div style={{fontSize:'0.9rem',color:'#555'}}>Department: {item.department}</div>}
                    {item.time && <div style={{fontSize:'0.9rem',color:'#555'}}>Time: {item.time}</div>}
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <button onClick={()=>startEdit(item._id)}>Update</button>
                    <button onClick={()=>remove(item._id)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {items.length === 0 && <div>No recipes found.</div>}
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
