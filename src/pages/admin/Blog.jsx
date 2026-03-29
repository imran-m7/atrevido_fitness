import React, { useState } from 'react'
import { Plus, Edit, Trash2, Search, Eye, Calendar, BookOpen } from 'lucide-react'

const blogPosts = [
  { id: 1, title: '10 Essential Tips for Building a Sustainable Fitness Routine', category: 'Fitness Tips', status: 'Published', date: 'March 15, 2024', views: 342, featured: true },
  { id: 2, title: 'Nutrition Myths Debunked: What Really Works',                  category: 'Nutrition',    status: 'Published', date: 'March 12, 2024', views: 256, featured: false },
  { id: 3, title: 'The Power of Group Fitness: Why Working Out Together Works',   category: 'Motivation',   status: 'Published', date: 'March 8, 2024',  views: 189, featured: false },
  { id: 4, title: "Beginner's Guide to Strength Training for Women",              category: 'Fitness Tips', status: 'Published', date: 'March 5, 2024',  views: 412, featured: false },
  { id: 5, title: 'How to Stay Motivated When Progress Feels Slow',               category: 'Motivation',   status: 'Published', date: 'March 1, 2024',  views: 298, featured: false },
  { id: 6, title: 'The Importance of Rest Days in Your Fitness Journey',          category: 'Lifestyle',    status: 'Draft',     date: 'March 20, 2024', views: 0,   featured: false },
]

const statusColors = {
  Published: 'bg-green-100 text-green-700',
  Draft:     'bg-yellow-100 text-yellow-700',
}

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'

export default function AdminBlog() {
  const [search, setSearch] = useState('')
  const filtered = blogPosts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Manage Blog</h1>
          <p className="text-muted-foreground">Create and manage blog posts</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus size={16} /> New Post
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Posts', value: '6',     bg: 'bg-primary/10', color: 'text-primary',    icon: BookOpen },
          { label: 'Published',   value: '5',     bg: 'bg-green-100',  color: 'text-green-600',  icon: BookOpen },
          { label: 'Drafts',      value: '1',     bg: 'bg-yellow-100', color: 'text-yellow-600', icon: BookOpen },
          { label: 'Total Views', value: '1,497', bg: 'bg-blue-100',   color: 'text-blue-600',   icon: Eye },
        ].map(({ label, value, bg, color, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${bg}`}>
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

      {/* Search */}
      <div className="mb-6 rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className={inputClass + ' pl-9'} placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">Filter</button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Blog Posts</h3>
        </div>
        <div className="p-5 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Post','Category','Status','Date','Views','Actions'].map((h, i) => (
                  <th key={h} className={`pb-3 text-sm font-medium text-muted-foreground ${i === 5 ? 'text-right' : 'text-left'}`}>{h}</th>
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
                      <div>
                        <p className="font-medium text-foreground line-clamp-1 max-w-[220px]">{post.title}</p>
                        {post.featured && (
                          <span className="inline-block mt-1 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">Featured</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">{post.category}</span>
                  </td>
                  <td className="py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[post.status]}`}>{post.status}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar size={12} />{post.date}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye size={12} />{post.views}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex justify-end gap-1">
                      {[Eye, Edit].map((Icon, j) => (
                        <button key={j} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                          <Icon size={16} />
                        </button>
                      ))}
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors text-destructive">
                        <Trash2 size={16} />
                      </button>
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
