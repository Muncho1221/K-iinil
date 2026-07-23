import { Icon } from './Icons'

export const CreatePostModal = ({ isOpen, onClose, newPost, setNewPost, onSubmit }: any) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-plum-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl font-bold text-plum-900">Nueva publicación</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-lavender-100 text-plum-500 transition-colors">
            <Icon.Close />
          </button>
        </div>

        <div className="flex gap-3 mb-4">
          <img
            src="https://images.unsplash.com/photo-1573977040523-e16e112ccd3e?w=80&h=80&fit=crop&auto=format"
            alt="Tú"
            className="w-10 h-10 rounded-full object-cover border-2 border-plum-200"
          />
          <textarea
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            placeholder="Comparte tu look, tip o reseña... ✨ Usa #hashtags"
            rows={4}
            className="flex-1 resize-none text-sm text-plum-900 placeholder:text-plum-300 outline-none leading-relaxed"
          />
        </div>

        <div className="border-t border-lavender-100 pt-4 flex items-center justify-between">
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-plum-600 hover:bg-lavender-50 transition-colors border border-lavender-200">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              Foto
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-plum-600 hover:bg-lavender-50 transition-colors border border-lavender-200">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /></svg>
              Producto
            </button>
          </div>
          <button
            onClick={onSubmit}
            disabled={!newPost.trim()}
            className="px-6 py-2.5 rounded-full bg-plum-700 text-white text-sm font-semibold hover:bg-plum-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Publicar
          </button>
        </div>
      </div>
    </div>
  )
}
