import React from 'react' 
import { Link } from 'react-router-dom' 
import { Calendar, Clock, ArrowRight } from 'lucide-react' 
import { useBlog } from '../../context/BlogContext' 

const formatDate = (post) => { 
  const d = post.publishedAt || post.createdAt 
  if (!d) return '' 
  return new Date(d).toLocaleDateString('bs-BA', { year: 'numeric', month: 'long', day: 'numeric' }) 
} 

const getImage = (post) => post.imageBase64 || post.imageUrl || null 
  
export default function MemberBlog() { 
  const { blogs: blogPosts } = useBlog() 
  const getExcerpt = (content) => content.length > 150 ? content.substring(0, 150) + '...' : content 
  const getReadTime = (content) => Math.ceil(content.split(/s+/).length / 200) + ' min citanja' 
  const featured = blogPosts[0] || null 
  const others = blogPosts.slice(1) 
  
  return ( 
    <div className="p-4 lg:p-8"> 
      <div className="mb-8"> 
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Blog</h1> 
        <p className="text-muted-foreground">Savjeti za trening, ishranu i motivaciju</p> 
      </div> 
      {featured && ( 
        <div className="mb-8 overflow-hidden rounded-lg border border-border bg-card shadow-sm"> 
          <div className="grid lg:grid-cols-2"> 
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 lg:aspect-auto lg:min-h-[300px]"> 
              {getImage(featured) ? ( 
                <img src={getImage(featured)} alt={featured.title} className="w-full h-full object-cover" /> 
              ) : <div className="h-16 w-16 rounded-full bg-primary/20" />} 
            </div> 
            <div className="flex flex-col justify-center p-6"> 
              <span className="mb-3 inline-block w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{featured.category}</span> 
              <h2 className="mb-3 text-xl font-bold text-foreground lg:text-2xl">{featured.title}</h2> 
              <p className="mb-4 text-muted-foreground">{getExcerpt(featured.content)}</p> 
              <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground"> 
                <span className="flex items-center gap-1"><Calendar size={14} />{formatDate(featured)}</span> 
                <span className="flex items-center gap-1"><Clock size={14} />{getReadTime(featured.content)}</span> 
              </div> 
              <Link to={'/member/blog/' + featured.id} 
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"> 
                Procitaj clanak <ArrowRight size={16} /> 
              </Link> 
            </div> 
          </div> 
        </div> 
      )} 
      <h2 className="mb-4 text-xl font-semibold text-foreground">Najnoviji clanci</h2> 
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"> 
        {others.map((post) => ( 
          <div key={post.id} className="flex flex-col rounded-lg border border-border bg-card shadow-sm overflow-hidden"> 
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10"> 
              {getImage(post) ? ( 
                <img src={getImage(post)} alt={post.title} className="w-full h-full object-cover" /> 
              ) : <div className="h-10 w-10 rounded-full bg-primary/20" />} 
            </div> 
            <div className="p-4 pb-2"> 
              <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{post.category}</span> 
            </div> 
            <div className="flex-1 px-4"> 
              <h3 className="mb-2 font-semibold text-foreground line-clamp-2">{post.title}</h3> 
              <p className="text-sm text-muted-foreground line-clamp-3">{getExcerpt(post.content)}</p> 
            </div> 
            <div className="flex items-center justify-between p-4 pt-3"> 
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar size={12} />{formatDate(post)}</span> 
              <Link to={'/member/blog/' + post.id} className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"> 
                Procitaj <ArrowRight size={12} /> 
              </Link> 
            </div> 
          </div> 
        ))} 
      </div> 
      {blogPosts.length === 0 && <div className="text-center py-12"><p className="text-muted-foreground">Nema dostupnih clanaka.</p></div>} 
    </div> 
  ) 
}