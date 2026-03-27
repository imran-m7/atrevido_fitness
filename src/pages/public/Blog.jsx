import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, User } from 'lucide-react'
 
const featuredPost = {
  id: 1,
  title: '10 Essential Tips for Building a Sustainable Fitness Routine',
  excerpt: 'Discover the key strategies that will help you create a fitness routine you can stick to for life. From setting realistic goals to finding activities you love, these tips will transform your approach to health and wellness.',
  category: 'Fitness Tips',
  author: 'Elena Rodriguez',
  date: 'March 15, 2024',
  readTime: '8 min read',
}
 
const blogPosts = [
  { id: 2, title: 'Nutrition Myths Debunked: What Really Works',                   excerpt: 'Separating fact from fiction in the world of nutrition. Learn what science actually says about popular diet trends.',                                       category: 'Nutrition',     author: 'Elena Rodriguez', date: 'March 12, 2024',    readTime: '6 min read' },
  { id: 3, title: 'The Power of Group Fitness: Why Working Out Together Works',     excerpt: 'Research shows that exercising in groups can significantly boost motivation and results. Here\'s why community matters.',                                    category: 'Motivation',    author: 'Elena Rodriguez', date: 'March 8, 2024',     readTime: '5 min read' },
  { id: 4, title: "Beginner's Guide to Strength Training for Women",                excerpt: 'Everything you need to know to start your strength training journey with confidence and safety.',                                                              category: 'Fitness Tips',  author: 'Elena Rodriguez', date: 'March 5, 2024',     readTime: '10 min read' },
  { id: 5, title: 'How to Stay Motivated When Progress Feels Slow',                excerpt: "Plateaus happen to everyone. Learn strategies to stay committed even when results aren't immediately visible.",                                               category: 'Motivation',    author: 'Elena Rodriguez', date: 'March 1, 2024',     readTime: '7 min read' },
  { id: 6, title: 'The Importance of Rest Days in Your Fitness Journey',            excerpt: 'Recovery is just as important as training. Understand why rest days are essential for progress.',                                                              category: 'Lifestyle',     author: 'Elena Rodriguez', date: 'February 26, 2024', readTime: '5 min read' },
  { id: 7, title: 'Meal Prep 101: Save Time and Eat Healthy',                       excerpt: 'Simple meal prep strategies that will help you maintain a healthy diet even on your busiest days.',                                                             category: 'Nutrition',     author: 'Elena Rodriguez', date: 'February 22, 2024', readTime: '8 min read' },
]
 
const categories = ['All', 'Fitness Tips', 'Nutrition', 'Motivation', 'Lifestyle']
 
export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All')
 
  const filtered = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter((p) => p.category === activeCategory)
 
  return (
    <div className="min-h-screen bg-background">
 
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 px-4 py-16 lg:py-24">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="inline-block mb-4 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
            Blog
          </span>
          <h1 className="mb-4 text-4xl font-bold text-foreground lg:text-5xl">
            Fitness Tips & Inspiration
          </h1>
          <p className="text-lg text-muted-foreground">
            Expert advice, workout tips, nutrition guidance, and motivation
            to help you on your fitness journey.
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
      <section className="container mx-auto px-4 py-12">
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="grid lg:grid-cols-2">
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 lg:aspect-auto">
              <div className="text-center text-muted-foreground">
                <div className="mx-auto mb-2 h-16 w-16 rounded-full bg-primary/20" />
                <p className="text-sm">Featured Image</p>
              </div>
            </div>
            <div className="flex flex-col justify-center p-6 lg:p-8">
              <span className="mb-3 inline-block w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {featuredPost.category}
              </span>
              <h2 className="mb-3 text-2xl font-bold text-foreground lg:text-3xl">
                {featuredPost.title}
              </h2>
              <p className="mb-4 text-muted-foreground">{featuredPost.excerpt}</p>
              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><User size={14} />{featuredPost.author}</span>
                <span className="flex items-center gap-1"><Calendar size={14} />{featuredPost.date}</span>
                <span className="flex items-center gap-1"><Clock size={14} />{featuredPost.readTime}</span>
              </div>
              <Link
                to={`/blog/${featuredPost.id}`}
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Read Article <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
 
      {/* Blog Grid */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="mb-8 text-2xl font-bold text-foreground">Latest Articles</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <div key={post.id} className="flex flex-col rounded-lg border border-border bg-card shadow-sm overflow-hidden">
              <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="h-10 w-10 rounded-full bg-primary/20" />
              </div>
              <div className="p-4 pb-2">
                <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  {post.category}
                </span>
              </div>
              <div className="flex-1 px-4">
                <h3 className="mb-2 font-semibold text-foreground line-clamp-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
              </div>
              <div className="flex items-center justify-between p-4 pt-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar size={12} />{post.date}
                </span>
                <Link
                  to={`/blog/${post.id}`}
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Read <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
 
        <div className="mt-8 text-center">
          <button className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            Load More Articles
          </button>
        </div>
      </section>
 
    </div>
  )
}
