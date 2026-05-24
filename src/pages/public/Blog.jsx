import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, User } from 'lucide-react'
import { useBlog } from '../../context/BlogContext'

import trcanje3 from '../../assets/trcanje31.jpeg'
 
const categories = ['Sve', 'Fitness savjeti', 'Ishrana', 'Motivacija', 'Lifestyle']

export default function Blog() {
  const { blogs: blogPosts } = useBlog()
  const [activeCategory, setActiveCategory] = useState('Sve')

  const getExcerpt = (content) => {
    return content.length > 150 ? content.substring(0, 150) + '...' : content
  }

  const getReadTime = (content) => {
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return `${minutes} min čitanja`
  }
 
  const filtered = activeCategory === 'Sve'
    ? blogPosts
    : blogPosts.filter((p) => p.category === activeCategory)

  const featuredPost = filtered.length > 0 ? filtered[0] : null
  const otherPosts = filtered.slice(1)
 
  return (
    <div className="min-h-screen bg-background">
 
      {/* Hero */}
      <section
        className="relative px-4 py-16 lg:py-24 overflow-hidden bg-cover bg-no-repeat min-h-[400px]"
        style={{
          backgroundImage: `url(${trcanje3})`,
          backgroundPosition: 'center 20%',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 container mx-auto max-w-4xl text-center">

          <span className="inline-block mb-4 rounded-full bg-white/20 px-4 py-1.5 text-2xl font-medium text-white">
            Blog
          </span>

          <h1 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
            Fitness savjeti & inspiracija
          </h1>

          <p className="text-lg text-white/90 mt-7">
            Stručni savjeti, preporuke za trening i ishranu, motivacijski sadržaj i korisne smjernice koje će vam pomoći da 
            ostvarite svoje ciljeve i izgradite zdraviji način života. Kroz naše članke dijelimo znanje, iskustva i 
            praktične savjete koji će vas podržati na putu prema boljoj formi, većoj energiji i dugoročnom očuvanju zdravlja.
          </p>

        </div>
      </section>
 
      {/* Category Filter */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={[
                  'shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                ].join(' ')}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>
 
      {/* Featured Post */}
      {featuredPost && (
        <section className="container mx-auto px-4 py-12">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="grid lg:grid-cols-2">
              <div className="flex items-center justify-center overflow-hidden bg-linear-to-br from-primary/20 to-accent/20 p-6 min-h-[200px]">
                {featuredPost.image ? (
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="max-w-[300px] max-h-[300px] w-auto h-auto object-contain"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <div className="mx-auto mb-2 h-16 w-16 rounded-full bg-primary/20" />
                    <p className="text-sm">Featured Image</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center p-6 lg:p-8">
                <span className="mb-3 inline-block w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  {featuredPost.category}
                </span>
                <h2 className="mb-3 text-2xl font-bold text-foreground lg:text-3xl">
                  {featuredPost.title}
                </h2>
                <p className="mb-4 text-muted-foreground">{getExcerpt(featuredPost.content)}</p>
                <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar size={14} />{featuredPost.date}</span>
                  <span className="flex items-center gap-1"><Clock size={14} />{getReadTime(featuredPost.content)}</span>
                </div>
                <Link
                  to={`/blog/${featuredPost.id}`}
                  className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Pročitaj Članak <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
 
      {/* Blog Grid */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="mb-8 text-2xl font-bold text-foreground mt-7">Najnoviji članci</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {otherPosts.map((post) => (
            <div key={post.id} className="flex flex-col rounded-lg border border-border bg-card shadow-sm overflow-hidden">
              <div className="flex items-center justify-center bg-linear-to-br from-primary/10 to-accent/10 p-4 min-h-[160px]">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="max-w-[220px] max-h-[190px] w-auto h-auto object-contain"
                  />
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
                  to={`/blog/${post.id}`}
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Čitaj <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
 
        {otherPosts.length === 0 && featuredPost === null && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nema dostupnih članaka u ovoj kategoriji.</p>
          </div>
        )}
 
        <div className="mt-8 text-center">
          <button className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            Učitaj više članaka
          </button>
        </div>
      </section>
 
    </div>
  )
}
