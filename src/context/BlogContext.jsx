import React, { createContext, useContext, useState, useEffect } from 'react'

const BlogContext = createContext(null)

export function BlogProvider({ children }) {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  // Load blogs from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('blogs')
      if (stored) {
        setBlogs(JSON.parse(stored))
      } else {
        // Initialize with empty array if first time
        setBlogs([])
      }
    } catch (err) {
      console.error('Error loading blogs from localStorage:', err)
      setBlogs([])
    }
    setLoading(false)
  }, [])

  // Save blogs to localStorage whenever they change
  const saveBlogs = (newBlogs) => {
    try {
      localStorage.setItem('blogs', JSON.stringify(newBlogs))
      setBlogs(newBlogs)
    } catch (err) {
      console.error('Error saving blogs to localStorage:', err)
    }
  }

  const createBlog = (blogData) => {
    const newBlog = {
      id: Date.now(), // Use timestamp as unique ID
      ...blogData,
      status: 'Objavljen',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      featured: false,
      createdAt: new Date().toISOString()
    }
    const updatedBlogs = [newBlog, ...blogs]
    saveBlogs(updatedBlogs)
    return newBlog
  }

  const updateBlog = (id, blogData) => {
    const updatedBlogs = blogs.map(blog =>
      blog.id === id ? { ...blog, ...blogData } : blog
    )
    saveBlogs(updatedBlogs)
  }

  const deleteBlog = (id) => {
    const filteredBlogs = blogs.filter(blog => blog.id !== id)
    saveBlogs(filteredBlogs)
  }

  const getBlog = (id) => {
    return blogs.find(blog => blog.id === id)
  }

  const getAllBlogs = () => {
    return blogs
  }

  return (
    <BlogContext.Provider value={{ blogs, loading, createBlog, updateBlog, deleteBlog, getBlog, getAllBlogs }}>
      {children}
    </BlogContext.Provider>
  )
}

export function useBlog() {
  const context = useContext(BlogContext)
  if (!context) {
    throw new Error('useBlog must be used within BlogProvider')
  }
  return context
}
