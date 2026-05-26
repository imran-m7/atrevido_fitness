import React, { useState } from 'react' 
import { Plus, Edit, Trash2, Search, Calendar, BookOpen, X } from 'lucide-react' 
import { useBlog } from '../../context/BlogContext' 

  
const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring' 
const labelClass = 'block mb-1.5 text-sm font-medium text-foreground' 

export default function AdminBlog() { 

  const { blogs: blogPosts, createBlog, updateBlog, deleteBlog } = useBlog() 
  const [search, setSearch] = useState('') 
  const [showModal, setShowModal] = useState(false) 
  const [editingId, setEditingId] = useState(null) 
  const [formData, setFormData] = useState({ title: '', category: 'Fitness Savjeti', content: '', image: null }) 

  const categories = ['Fitness Savjeti', 'Ishrana', 'Motivacija', 'Lifestyle', 'Oporavak'] 

  const filtered = blogPosts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase()) 
  ) 

  const stats = [ 
    { label: 'Ukupno objava', value: blogPosts.length, bg: 'bg-primary/10', color: 'text-primary', icon: BookOpen }, 
    { label: 'Objavljeni', value: blogPosts.filter(p => p.isPublished).length, bg: 'bg-green-100', color: 'text-green-600', icon: BookOpen }, 
  ] 

  

  const handleInputChange = (e) => { 
    const { name, value } = e.target 
    setFormData(prev => ({ ...prev, [name]: value })) 
  } 

  

  const handleImageChange = (e) => { 
    const file = e.target.files?.[0] 
    if (file) { 
      const reader = new FileReader() 
      reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result })) 
      reader.readAsDataURL(file) 
    } 
  } 

  const handleOpenAddModal = () => { 
    setEditingId(null) 
    setFormData({ title: '', category: 'Fitness Savjeti', content: '', image: null }) 
    setShowModal(true) 
  } 

  const handleOpenEditModal = (post) => { 
    setEditingId(post.id) 
    setFormData({ 
      title: post.title, 
      category: post.category, 
      content: post.content, 
      image: post.imageBase64 || post.imageUrl || null 
    }) 
    setShowModal(true) 
  } 
  
  const handleSubmit = async (e) => { 
    e.preventDefault() 
    try { 
      if (editingId) { await updateBlog(editingId, formData) } 
      else { await createBlog(formData) } 
      setShowModal(false) 
      setFormData({ title: '', category: 'Fitness Savjeti', content: '', image: null }) 
    } catch (err) { alert('Greska: ' + err.message) } 
  } 

  const handleDelete = async (id) => { 
    if (!confirm('Jesi li sigurna da zelis obrisati ovu objavu?')) return 
    try { await deleteBlog(id) } catch (err) { alert('Greska pri brisanju: ' + err.message) } 
  } 

  const formatDate = (post) => { 
    const d = post.publishedAt || post.createdAt 
    if (!d) return '' 
    return new Date(d).toLocaleDateString('bs-BA', { year: 'numeric', month: 'long', day: 'numeric' }) 
  } 

  return ( 
    <div className="p-4 lg:p-8"> 
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"> 
        <div> 
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Upravljanje blogom</h1> 
          <p className="text-muted-foreground">Napravi i upravljaj blog objavama</p> 
        </div> 
        <button onClick={handleOpenAddModal} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"> 
          <Plus size={16} /> Nova objava 
        </button> 
      </div> 

      {showModal && ( 
        <div className="fixed inset-0 z-50 flex items-center justify-center"> 
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} /> 
          <div className="relative z-10 w-full max-w-2xl rounded-lg border border-border bg-card p-8 shadow-lg max-h-[90vh] overflow-y-auto"> 
            <div className="flex items-center justify-between mb-6"> 
              <h2 className="text-2xl font-bold text-foreground">{editingId ? 'Uredi blog' : 'Kreiraj novi blog'}</h2> 
              <button onClick={() => setShowModal(false)}><X size={24} /></button> 
            </div> 
            <form onSubmit={handleSubmit} className="space-y-5"> 
              <div> 
                <label htmlFor="title" className={labelClass}>Naslov bloga</label> 
                <input id="title" name="title" type="text" className={inputClass} 
                  placeholder="Unesite naslov bloga" value={formData.title} onChange={handleInputChange} required /> 
              </div> 
              <div> 
                <label htmlFor="category" className={labelClass}>Kategorija</label> 
                <select id="category" name="category" className={inputClass} value={formData.category} onChange={handleInputChange}> 
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)} 
                </select> 
              </div> 
              <div> 
                <label htmlFor="content" className={labelClass}>Sadrzaj bloga</label> 
                <textarea id="content" name="content" className={inputClass + ' min-h-40 resize-none'} 
                  placeholder="Unesite sadrzaj bloga..." value={formData.content} onChange={handleInputChange} required /> 
              </div> 
              <div> 
                <label className={labelClass}>Slika</label> 
                <div className="flex items-center gap-4"> 
                  {formData.image && ( 
                    <div className="relative"> 
                      <img src={formData.image} alt="Preview" className="h-20 w-20 rounded-lg object-cover border border-border" /> 
                      <button type="button" onClick={() => setFormData(prev => ({ ...prev, image: null }))} 
                        className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"> 
                        <X size={16} /> 
                      </button> 
                    </div> 
                  )} 
                  <label className="flex items-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-3 cursor-pointer hover:border-primary transition-colors"> 
                    <span className="text-sm font-medium text-foreground">Izaberi sliku</span> 
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" /> 
                  </label> 
                </div> 
              </div> 
              <div className="flex gap-3 pt-6"> 
                <button type="button" onClick={() => setShowModal(false)} 
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">Otkazi</button> 
                <button type="submit" 
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"> 
                  {editingId ? 'Azuriraj objavu' : 'Objavi objavu'} 
                </button> 
              </div> 
            </form> 
          </div> 
        </div> 
      )} 
      <div className="mb-6 grid gap-4 md:grid-cols-2 w-fit"> 
        {stats.map(({ label, value, bg, color, icon: Icon }) => ( 
          <div key={label} className="rounded-lg border border-border bg-card p-5 shadow-sm"> 
            <div className="flex items-center gap-3"> 
              <div className={'flex h-10 w-10 items-center justify-center rounded-full ' + bg}> 
                <Icon size={20} className={color} /> 
              </div> 
              <div> 
                <p className="text-2xl font-bold text-foreground">{value}</p> 
                <p className="text-sm text-muted-foreground">{label}</p> 
              </div> 
            </div> 
          </div> 
        ))} 
      </div> 
      <div className="mb-6 rounded-lg border border-border bg-card p-4 shadow-sm"> 
        <div className="relative"> 
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /> 
          <input className={inputClass + ' pl-9'} placeholder="Istrazi objave..." value={search} onChange={e => setSearch(e.target.value)} /> 
        </div> 
      </div> 
      <div className="rounded-lg border border-border bg-card shadow-sm"> 
        <div className="p-5 border-b border-border"><h3 className="font-semibold text-foreground">Blog objave</h3></div> 
        <div className="p-5 overflow-x-auto"> 
          <table className="w-full"> 
            <thead> 
              <tr className="border-b border-border"> 
                {['Objava', 'Kategorija', 'Status', 'Datum', 'Radnje'].map((h, i) => ( 
                  <th key={h} className={'pb-3 text-sm font-medium text-muted-foreground ' + (i === 4 ? 'text-right' : 'text-left')}>{h}</th> 
                ))} 
              </tr> 
            </thead> 
            <tbody> 
              {filtered.map((post, i) => ( 
                <tr key={post.id} className={i < filtered.length - 1 ? 'border-b border-border' : ''}> 
                  <td className="py-4"> 
                    <div className="flex items-center gap-3"> 
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0"> 
                        <BookOpen size={20} className="text-primary" /> 
                      </div> 
                      <p className="font-medium text-foreground line-clamp-1">{post.title}</p> 
                    </div> 
                  </td> 
                  <td className="py-4"><span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">{post.category}</span></td> 
                  <td className="py-4"><span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">Objavljeno</span></td> 
                  <td className="py-4"><div className="flex items-center gap-1 text-sm text-muted-foreground"><Calendar size={12} />{formatDate(post)}</div></td> 

                  <td className="py-4"> 
                    <div className="flex justify-end gap-1"> 
                      <button onClick={() => handleOpenEditModal(post)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><Edit size={16} /></button> 
                      <button onClick={() => handleDelete(post.id)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors text-destructive"><Trash2 size={16} /></button> 
                    </div> 
                  </td> 
                </tr> 
              ))} 
            </tbody> 
          </table> 
        </div> 
      </div> 
    </div> 
  ) 
} 