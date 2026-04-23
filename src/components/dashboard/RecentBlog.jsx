import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ArrowRight } from 'lucide-react'

const posts = [
  { title: '5 jutarnjih vježbi da započneš svoj dan',          category: 'Wellness',   readTime: '4 min čitanja' },
  { title: 'Visoko-proteinske doručak ideje za zauzete žene',          category: 'Ishrana',  readTime: '6 min čitanja' },
  { title: 'Kako ostati motivisan tokom svog fitnes putovanja?',    category: 'Mindset',    readTime: '5 min čitanja' },
]

export default function RecentBlog() {
  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Najnoviji članci</h3>
        </div>
        <Link
          to="/member/blog"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Pogledaj sve <ArrowRight size={16} />
        </Link>
      </div>
      <div className="p-5 space-y-3">
        {posts.map((post, i) => (
          <div
            key={i}
            className="group cursor-pointer rounded-lg border border-border p-4 transition-colors hover:bg-muted/50 hover:border-primary/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </h4>
                <p className="text-xs text-muted-foreground">{post.readTime}</p>
              </div>
              <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {post.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
