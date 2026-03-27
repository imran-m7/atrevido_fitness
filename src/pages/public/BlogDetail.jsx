import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Calendar, Clock, ArrowLeft, User, Share2 } from 'lucide-react'
 
const posts = {
  1: {
    id: 1,
    title: '10 Essential Tips for Building a Sustainable Fitness Routine',
    category: 'Fitness Tips',
    author: 'Elena Rodriguez',
    date: 'March 15, 2024',
    readTime: '8 min read',
    content: [
      { type: 'p',  text: "Building a sustainable fitness routine isn't about pushing yourself to the limit every day or following the latest trendy workout. It's about creating habits that fit into your lifestyle and that you can maintain for years to come." },
      { type: 'h2', text: '1. Start Small and Build Gradually' },
      { type: 'p',  text: "One of the biggest mistakes people make is trying to do too much too soon. If you're new to exercise, start with just 15–20 minutes a day, three times a week. As your fitness improves and the habit becomes established, you can gradually increase the duration and frequency." },
      { type: 'h2', text: '2. Find Activities You Actually Enjoy' },
      { type: 'p',  text: "Exercise shouldn't feel like punishment. If you dread your workouts, you won't stick with them. Experiment with different activities until you find something you genuinely look forward to." },
      { type: 'h2', text: '3. Schedule Your Workouts' },
      { type: 'p',  text: "Treat your workout time as a non-negotiable appointment. Put it in your calendar and protect that time. When exercise is scheduled, you're more likely to follow through." },
      { type: 'h2', text: '4. Set Realistic Goals' },
      { type: 'p',  text: 'Instead of vague goals like "get fit," set specific, measurable, achievable goals. For example, "complete three 30-minute workouts this week."' },
      { type: 'h2', text: '5. Prioritize Recovery' },
      { type: 'p',  text: "Rest days are just as important as workout days. Your body needs time to repair and grow stronger. Don't feel guilty about taking rest days – they're an essential part of any fitness program." },
      { type: 'h2', text: '6. Find an Accountability Partner' },
      { type: 'p',  text: "Working out with a friend or joining a fitness community can significantly boost your motivation. When someone is counting on you to show up, you're less likely to skip your workout." },
      { type: 'h2', text: '7. Track Your Progress' },
      { type: 'p',  text: "Keep a record of your workouts, measurements, and how you feel. Seeing your progress over time is incredibly motivating and helps you identify what's working." },
      { type: 'h2', text: '8. Be Flexible' },
      { type: 'p',  text: "Life happens. Sometimes you'll miss a workout, and that's okay. What matters is getting back on track as soon as possible." },
      { type: 'h2', text: '9. Focus on How You Feel' },
      { type: 'p',  text: 'While physical changes are great, pay attention to how exercise makes you feel. More energy, better sleep, improved mood – these benefits often show up before visible physical changes.' },
      { type: 'h2', text: '10. Celebrate Small Wins' },
      { type: 'p',  text: 'Every workout completed is a victory. Celebrate your consistency, your improvements, and your commitment to your health. Positive reinforcement helps build lasting habits.' },
    ],
  },
}
 
const relatedPosts = [
  { id: 2, title: 'Nutrition Myths Debunked: What Really Works',    category: 'Nutrition' },
  { id: 5, title: 'How to Stay Motivated When Progress Feels Slow', category: 'Motivation' },
]
 
export default function BlogDetail() {
  const { id } = useParams()
  const post = posts[id] || posts[1]
 
  return (
    <div className="min-h-screen bg-background">
 
      {/* Header */}
      <section className="bg-linear-to-br from-primary/10 to-accent/10 px-4 py-12">
        <div className="container mx-auto max-w-3xl">
          <Link
            to="/blog"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          <span className="inline-block mb-4 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
            {post.category}
          </span>
          <h1 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><User size={14} />{post.author}</span>
            <span className="flex items-center gap-1"><Calendar size={14} />{post.date}</span>
            <span className="flex items-center gap-1"><Clock size={14} />{post.readTime}</span>
          </div>
        </div>
      </section>
 
      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Image placeholder */}
          <div className="mb-8 flex aspect-video items-center justify-center rounded-lg bg-linear-to-br from-primary/20 to-accent/20">
            <div className="text-center text-muted-foreground">
              <div className="mx-auto mb-2 h-16 w-16 rounded-full bg-primary/20" />
              <p className="text-sm">Article Image</p>
            </div>
          </div>
 
          {/* Article body */}
          <article className="space-y-4">
            {post.content.map((block, i) => {
              if (block.type === 'h2') return (
                <h2 key={i} className="mt-8 text-xl font-bold text-foreground">{block.text}</h2>
              )
              return (
                <p key={i} className="text-muted-foreground leading-relaxed">{block.text}</p>
              )
            })}
          </article>
 
          {/* Share */}
          <div className="mt-12 flex items-center justify-between border-t border-border pt-8">
            <p className="text-sm text-muted-foreground">Share this article:</p>
            <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      </section>
 
      {/* Related Articles */}
      <section className="bg-muted/50 px-4 py-12">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-6 text-xl font-bold text-foreground">Continue Reading</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {relatedPosts.map((rp) => (
              <div key={rp.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <span className="inline-block mb-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  {rp.category}
                </span>
                <h3 className="mb-2 font-semibold text-foreground">{rp.title}</h3>
                <Link
                  to={`/blog/${rp.id}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Read Article
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
 
    </div>
  )
}