import { Icon } from './Icons'

export const CreatePostModal = ({ isOpen, onClose, newPost, setNewPost, newPostImage, setNewPostImage, onSubmit, userProfile }: any) => {
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

        <div className="flex flex-col gap-3 mb-4">
          <div className="flex gap-3">
            <img
              src={userProfile?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
              alt={userProfile?.username || 'Tú'}
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
          <input
            type="file"
            accept="image/*"
            onChange={e => setNewPostImage(e.target.files?.[0] || null)}
            className="w-full text-sm text-plum-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-plum-50 file:text-plum-700 hover:file:bg-plum-100"
          />
        </div>

        <div className="border-t border-lavender-100 pt-4 flex items-center justify-end">
          <button
            onClick={() => {
                console.log('Botón publicar presionado');
                onSubmit();
            }}
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
