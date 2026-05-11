import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { useBlog } from '../../context/BlogContext'

export default function MemberBlog() {
  const { blogs: blogPosts } = useBlog()
  
  // Helper function to generate excerpt from content
  const getExcerpt = (content) => {
    return content.length > 150 ? content.substring(0, 150) + '...' : content
  }

  // Helper function to calculate read time
  const getReadTime = (content) => {
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / 200) // Average reading speed is 200 words per minute
    return `${minutes} min čitanja`
  }

  const featured = blogPosts.find(p => p.featured)
  const others   = blogPosts.filter(p => !p.featured)

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Blog</h1>
        <p className="text-muted-foreground">Savjeti za trening, ishranu i motivaciju</p>
      </div>

      {/* Featured */}
      {featured && (
        <div className="mb-8 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="grid lg:grid-cols-2">
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 lg:aspect-auto lg:min-h-[300px]">
              {featured.image ? (
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-primary/20" />
              )}
            </div>
            <div className="flex flex-col justify-center p-6">
              <span className="mb-3 inline-block w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {featured.category}
              </span>
              <h2 className="mb-3 text-xl font-bold text-foreground lg:text-2xl">{featured.title}</h2>
              <p className="mb-4 text-muted-foreground">{getExcerpt(featured.content)}</p>
              <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar size={14} />{featured.date}</span>
                <span className="flex items-center gap-1"><Clock size={14} />{getReadTime(featured.content)}</span>
              </div>
              <Link
                to={`/member/blog/${featured.id}`}
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Pročitaj članak <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <h2 className="mb-4 text-xl font-semibold text-foreground">Najnoviji članci</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {others.map((post) => (
          <div key={post.id} className="flex flex-col rounded-lg border border-border bg-card shadow-sm overflow-hidden">
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
              {post.image ? (
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary/20" />
              )}
            </div>
            <div className="p-4 pb-2">
              <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {post.category}
              </span>
            </div>
            <div className="flex-1 px-4">
              <h3 className="mb-2 font-semibold text-foreground line-clamp-2">{post.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">{getExcerpt(post.content)}</p>
            </div>
            <div className="flex items-center justify-between p-4 pt-3">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar size={12} />{post.date}
              </span>
              <Link
                to={`/member/blog/${post.id}`}
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Pročitaj <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
