export * from "../data/blog";
import { BLOG_POSTS, type BlogPost } from "../data/blog";

export default function Blog({ selectedSlug }: { selectedSlug?: string; onNavigate?: (path: string) => void }) {
  const post = selectedSlug ? BLOG_POSTS.find(p => p.slug === selectedSlug) : null;

  if (post) {
    return (
      <article className="prose prose-blue max-w-none text-left">
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {BLOG_POSTS.map(p => (
        <div key={p.id} className="p-6 bg-white rounded-2xl border border-gray-100">
          <h2 className="text-xl font-bold">{p.title}</h2>
          <p className="text-gray-600 text-sm mt-2">{p.excerpt}</p>
          <a href={`/blog/${p.slug}`} className="text-blue-600 font-bold text-sm mt-4 inline-block">
            Leer más →
          </a>
        </div>
      ))}
    </div>
  );
}
