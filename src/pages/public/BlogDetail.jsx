import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import { useBlog } from '../../context/BlogContext'
 
const formatDate = (post) => {
  const d = post.publishedAt || post.createdAt
  if (!d) return ''
  return new Date(d).toLocaleDateString('bs-BA', { year: 'numeric', month: 'long', day: 'numeric' })
}
 
const getImage = (post) => post.imageBase64 || post.imageUrl || null
 
export default function BlogDetail() {
  const { id } = useParams()
  const { blogs } = useBlog()
 
  const blog = blogs.find(b => b.id === parseInt(id))
 
  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Članak nije pronađen</h1>
          <Link to="/blog" className="text-primary hover:underline">Nazad na Blog</Link>
        </div>
      </div>
    )
  }
 
  const relatedBlogs = blogs.filter(b => b.id !== blog.id).slice(0, 2)
 
  const getReadTime = (content) => {
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return `${minutes} min čitanja`
  }
 
  return (
    <div className="min-h-screen bg-background">
 
      {/* Header */}
      <section className="bg-linear-to-br from-primary/10 to-accent/10 px-4 py-12">
        <div className="container mx-auto max-w-3xl">
          <Link to="/blog"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Nazad na Blog
          </Link>
          <span className="inline-block mb-4 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
            {blog.category}
          </span>
          <h1 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">{blog.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar size={14} />{formatDate(blog)}</span>
            <span className="flex items-center gap-1"><Clock size={14} />{getReadTime(blog.content)}</span>
          </div>
        </div>
      </section>
 
      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center justify-center rounded-lg bg-linear-to-br from-primary/20 to-accent/20 overflow-hidden p-6 min-h-[280px]">
            {getImage(blog) ? (
              <img src={getImage(blog)} alt={blog.title}
                className="max-w-full max-h-[500px] w-auto h-auto object-contain rounded-lg" />
            ) : (
              <div className="text-center text-muted-foreground">
                <div className="mx-auto mb-2 h-16 w-16 rounded-full bg-primary/20" />
                <p className="text-sm">Article Image</p>
              </div>
            )}
          </div>
          <article className="space-y-4 text-muted-foreground leading-relaxed">
            {blog.content}
          </article>
        </div>
      </section>
 
      {/* Related Articles */}
      <section className="bg-muted/50 px-4 py-12">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-6 text-xl font-bold text-foreground">Nastavi Sa Čitanjem</h2>
          {relatedBlogs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {relatedBlogs.map((rp) => (
                <div key={rp.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                  <span className="inline-block mb-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                    {rp.category}
                  </span>
                  <h3 className="mb-2 font-semibold text-foreground line-clamp-2">{rp.title}</h3>
                  <Link to={`/blog/${rp.id}`} className="text-sm font-medium text-primary hover:underline">
                    Pročitaj Članak
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Nema dostupnih blogova.</p>
          )}
        </div>
      </section>
    </div>
  )
}