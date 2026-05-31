import React, { createContext, useContext, useState, useEffect } from 'react' 
import { blogApi } from '../services/api' 

const BlogContext = createContext(null) 

export function BlogProvider({ children }) { 
  const [blogs, setBlogs] = useState([]) 
  const [loading, setLoading] = useState(true) 

  const fetchBlogs = async () => { 
    try { 
      const data = await blogApi.getAll() 
      setBlogs(Array.isArray(data) ? data : []) 
    } catch (err) { 
      console.error('Greska pri ucitavanju blogova:', err) 
      setBlogs([]) 
    } finally { 
      setLoading(false) 
    } 
  } 
  
  useEffect(() => { fetchBlogs() }, []) 

  const createBlog = async (blogData) => { 
    const result = await blogApi.create({ 
      title: blogData.title, 
      content: blogData.content, 
      imageUrl: null, 
      imageBase64: blogData.image || null, 
      category: blogData.category, 
      isPublished: true, 
    }) 
    await fetchBlogs() 
    return result 
  } 

  const updateBlog = async (id, blogData) => { 
    await blogApi.update(id, { 
      title: blogData.title, 
      content: blogData.content, 
      imageUrl: null, 
      imageBase64: blogData.image || null, 
      category: blogData.category, 
      isPublished: true, 
    }) 
    await fetchBlogs() 
  } 

  const deleteBlog = async (id) => { 
    await blogApi.delete(id) 
    await fetchBlogs() 
  } 
  
  const getBlog = (id) => blogs.find(b => b.id === id) 

  return ( 
    <BlogContext.Provider value={{ blogs, loading, createBlog, updateBlog, deleteBlog, getBlog }}> 
      {children} 
    </BlogContext.Provider> 
  ) 
} 

export function useBlog() { 
  const context = useContext(BlogContext) 
  if (!context) throw new Error('useBlog must be used within BlogProvider') 
  return context 
}