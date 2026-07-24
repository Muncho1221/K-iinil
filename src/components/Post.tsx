import { Icon } from './Icons'

export const Post = ({ post, onToggleLike, onToggleSave, onToggleComment, isCommentOpen, commentText, setCommentText }: any) => {
  return (
    <article className="card mb-4">
      {/* Post header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        <img src={post.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${post.user_id || 'default'}`} alt={post.user_name || 'User'} className="w-10 h-10 rounded-full object-cover border-2 border-plum-200" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-plum-900">{post.user_name || 'Usuario'}</p>
          <p className="text-xs text-plum-400">{post.handle} · {post.created_at ? new Date(post.created_at).toLocaleDateString() : ''}</p>
        </div>
        <button className="text-plum-400 hover:text-plum-700 transition-colors px-1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
        </button>
      </div>

      {/* Caption */}
      <p className="px-4 pb-2 text-sm text-plum-800 leading-relaxed">{post.caption}</p>
      {post.tags && post.tags.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-1">
          {post.tags.map((tag: string) => (
            <span key={tag} className="text-xs text-plum-500 font-medium hover:text-plum-700 cursor-pointer">{tag}</span>
          ))}
        </div>
      )}

      {/* Post image */}
      <div className="relative bg-lavender-100">
        <img src="https://images.unsplash.com/photo-1596704017254-9b5c10898154?w=400&h=400&fit=crop" alt={post.caption} className="w-full aspect-square object-cover" />
        {/* Shop tag overlay */}
        {post.shopTag && (
          <button className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg border border-lavender-100 hover:bg-lavender-50 transition-colors">
            <span className="text-plum-700">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /></svg>
            </span>
            <span className="text-xs font-semibold text-plum-800">{post.shopTag.name}</span>
            <span className="text-xs font-bold text-plum-500">{post.shopTag.price}</span>
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 flex items-center gap-4">
        <button
          onClick={() => onToggleLike(post.id)}
          className="flex items-center gap-1.5 text-sm text-plum-500 hover:text-pink-500 transition-colors"
        >
          <Icon.Heart filled={post.liked} />
          <span className={`font-medium ${post.liked ? 'text-pink-500' : ''}`}>{(post.likes || 0).toLocaleString()}</span>
        </button>
        <button
          onClick={() => onToggleComment(post.id)}
          className="flex items-center gap-1.5 text-sm text-plum-500 hover:text-plum-700 transition-colors"
        >
          <Icon.Comment />
          <span className="font-medium">{post.comments || 0}</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm text-plum-500 hover:text-plum-700 transition-colors">
          <Icon.Share />
        </button>
        <button
          onClick={() => onToggleSave(post.id)}
          className={`ml-auto transition-colors ${post.saved ? 'text-plum-700' : 'text-plum-400 hover:text-plum-700'}`}
        >
          <Icon.Save filled={post.saved} />
        </button>
      </div>

      {/* Comment box */}
      {isCommentOpen && (
        <div className="px-4 pb-4 border-t border-lavender-50 pt-3 flex gap-2">
          <img
            src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=80&h=80&fit=crop&auto=format"
            alt="Tú"
            className="w-7 h-7 rounded-full object-cover shrink-0 mt-1"
          />
          <div className="flex-1 flex gap-2">
            <input
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Escribe un comentario..."
              className="flex-1 px-3 py-1.5 rounded-full text-xs border border-lavender-200 bg-lavender-50 text-plum-900 outline-none focus:border-plum-400 focus:ring-1 focus:ring-plum-200"
              onKeyDown={e => { if (e.key === 'Enter') setCommentText('') }}
            />
            <button
              onClick={() => setCommentText('')}
              className="text-xs font-semibold text-plum-600 hover:text-plum-800 px-1"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </article>
  )
}
