import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import { useBlog } from '../../context/BlogContext'

export default function MemberBlogDetail() {
  const { id } = useParams()
  const { blogs } = useBlog()
  
  const blog = blogs.find(b => b.id === parseInt(id))

  if (!blog) {
    return (
      <div className="p-4 lg:p-8 min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Članak nije pronađen</h1>
          <Link to="/member/blog" className="text-primary hover:underline">Nazad na Blog</Link>
        </div>
      </div>
    )
  }

  // Get related blogs (excluding current)
  const relatedBlogs = blogs.filter(b => b.id !== blog.id).slice(0, 2)

  // Calculate read time
  const getReadTime = (content) => {
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return `${minutes} min čitanja`
  }

  return (
    <div className="p-4 lg:p-8">
      
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/member/blog"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> Nazad na Blog
        </Link>
        <span className="inline-block mb-4 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
          {blog.category}
        </span>
        <h1 className="text-3xl font-bold text-foreground lg:text-4xl mb-4">{blog.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar size={14} />{blog.date}</span>
          <span className="flex items-center gap-1"><Clock size={14} />{getReadTime(blog.content)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl">
        {/* Image */}
        <div className="mb-8 flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
          {blog.image ? (
            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-muted-foreground">
              <div className="mx-auto mb-2 h-16 w-16 rounded-full bg-primary/20" />
              <p className="text-sm">Article Image</p>
            </div>
          )}
        </div>

        {/* Article body */}
        <article className="text-muted-foreground leading-relaxed mb-12">
          {blog.content}
        </article>
      </div>

      {/* Related Articles */}
      {relatedBlogs.length > 0 ? (
        <div className="max-w-3xl border-t border-border pt-12">
          <h2 className="mb-6 text-xl font-bold text-foreground">Nastavi Sa Čitanjem</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {relatedBlogs.map((rp) => (
              <div key={rp.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <span className="inline-block mb-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  {rp.category}
                </span>
                <h3 className="mb-2 font-semibold text-foreground line-clamp-2">{rp.title}</h3>
                <Link
                  to={`/member/blog/${rp.id}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Pročitaj Članak
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-3xl border-t border-border pt-12">
          <h2 className="mb-6 text-xl font-bold text-foreground">Nastavi Sa Čitanjem</h2>
          <p className="text-muted-foreground">Nema dostupnih blogova.</p>
        </div>
      )}

    </div>
  )
}
