import { useState, useEffect } from 'react'
import { Icon } from './components/Icons'
import { Post } from './components/Post'
import { sqlService } from './services/sqlService'
import { noSqlService } from './services/noSqlService'

// ── APP ────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'shop'>('home')
  const [posts, setPosts] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [following, setFollowing] = useState<Record<number, boolean>>({})
  const [createOpen, setCreateOpen] = useState(false)
  const [newPost, setNewPost] = useState('')
  const [commentOpen, setCommentOpen] = useState<number | null>(null)
  const [commentText, setCommentText] = useState('')
  const [mobileNav, setMobileNav] = useState(false)

  // Cargar datos al iniciar
  useEffect(() => {
    async function fetchData() {
      // Cargamos posts de SQL
      const { data: sqlPosts } = await sqlService.getAll('posts')
      if (sqlPosts) setPosts(sqlPosts)

      // Cargamos productos de NoSQL
      const { data: noSqlProducts } = await noSqlService.getDocuments('products')
      if (noSqlProducts) {
        setProducts(noSqlProducts.map((p: any) => ({ ...p.attributes, id: p.id })))
      }
    }
    fetchData()
  }, [])

  const toggleLike = (id: number) => {
    setPosts(ps => ps.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ))
  }

  const toggleSave = (id: number) => {
    setPosts(ps => ps.map(p => p.id === id ? { ...p, saved: !p.saved } : p))
  }

  const toggleCart = (id: number) => {
    setProducts(ps => ps.map(p => {
      if (p.id !== id) return p
      const next = !p.inCart
      setCartCount(c => next ? c + 1 : c - 1)
      return { ...p, inCart: next }
    }))
  }

  const toggleFollow = (id: number) => {
    setFollowing(f => ({ ...f, [id]: !f[id] }))
  }

  const submitPost = async () => {
    if (!newPost.trim()) return
    const newPostData = {
      user: 'Tú',
      caption: newPost,
      created_at: new Date().toISOString(),
    }
    
    // Guardar en SQL
    await sqlService.insert('posts', [newPostData])
    
    setPosts(ps => [newPostData, ...ps])
    setNewPost('')
    setCreateOpen(false)
  }

  const navItems: { key: 'home' | 'explore' | 'shop'; label: string; Icon: React.FC<any> }[] = [
    { key: 'home', label: 'Inicio', Icon: Icon.Home },
    { key: 'explore', label: 'Explorar', Icon: Icon.Explore },
    { key: 'shop', label: 'Tienda', Icon: Icon.Shop },
  ]

  return (
    <div className="min-h-screen bg-[#faf0ff] font-sans flex flex-col">

      {/* ── TOP BAR (mobile) ─────────────────────────────────── */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#faf0ff]/90 backdrop-blur-md border-b border-lavender-200 flex items-center justify-between px-4 py-3">
        <span className="font-serif text-xl font-bold text-plum-800">K'iinil</span>
        <div className="flex items-center gap-3">
          <button onClick={() => setCreateOpen(true)} className="w-8 h-8 rounded-full bg-plum-700 text-white flex items-center justify-center">
            <Icon.Plus />
          </button>
          <button className="relative text-plum-600">
            <Icon.Cart />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-blush-500 text-white text-[10px] font-bold flex items-center justify-center">{cartCount}</span>
            )}
          </button>
        </div>
      </header>

      <div className="flex flex-1 max-w-[1400px] mx-auto w-full">

        {/* ── LEFT SIDEBAR ─────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-60 xl:w-64 shrink-0 sticky top-0 h-screen py-6 pl-4 pr-3 gap-1 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 px-3 mb-6">
            <span className="font-serif text-2xl font-bold text-plum-800">K'iinil</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blush-400 mt-1" />
          </div>

          {/* Nav links */}
          {navItems.map(({ key, label, Icon: NavIcon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-3.5 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                activeTab === key
                  ? 'bg-plum-700 text-white shadow-[0_4px_15px_rgba(107,33,168,0.3)]'
                  : 'text-plum-700 hover:bg-lavender-100'
              }`}
            >
              <NavIcon active={activeTab === key} />
              {label}
            </button>
          ))}

          <button className="flex items-center gap-3.5 px-3 py-2.5 rounded-2xl text-sm font-medium text-plum-700 hover:bg-lavender-100 transition-colors">
            <Icon.Bell /> Notificaciones
          </button>

          {/* Create post */}
          <button
            onClick={() => setCreateOpen(true)}
            className="mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-plum-700 text-white text-sm font-semibold hover:bg-plum-800 transition-colors shadow-[0_4px_15px_rgba(107,33,168,0.25)]"
          >
            <Icon.Plus /> Publicar
          </button>

          {/* Cart */}
          <button className="mt-2 flex items-center gap-3.5 px-3 py-2.5 rounded-2xl text-sm font-medium text-plum-700 hover:bg-lavender-100 transition-colors relative">
            <Icon.Cart /> Carrito
            {cartCount > 0 && (
              <span className="ml-auto w-5 h-5 rounded-full bg-blush-500 text-white text-xs font-bold flex items-center justify-center">{cartCount}</span>
            )}
          </button>

          {/* Profile */}
          <div className="mt-auto pt-4 border-t border-lavender-200 flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-plum-300" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-plum-900 truncate">Tu nombre</p>
              <p className="text-xs text-plum-400 truncate">@tu_usuario</p>
            </div>
          </div>
        </aside>

        {/* ── MAIN FEED ─────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 px-0 lg:px-4 xl:px-6 py-0 lg:py-6">

          {/* HOME VIEW */}
          {activeTab === 'home' && (
            <div className="max-w-[600px] mx-auto space-y-1">
              {/* Create post quick bar */}
              <div className="bg-white rounded-2xl border border-lavender-100 p-4 mb-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-plum-300" />
                <button
                  onClick={() => setCreateOpen(true)}
                  className="flex-1 text-left px-4 py-2.5 rounded-full bg-lavender-50 border border-lavender-200 text-sm text-plum-400 hover:bg-lavender-100 transition-colors"
                >
                  ¿Qué look usas hoy? ✨
                </button>
                <button
                  onClick={() => setCreateOpen(true)}
                  className="px-4 py-2 rounded-full bg-plum-700 text-white text-xs font-semibold hover:bg-plum-800 transition-colors"
                >
                  Publicar
                </button>
              </div>

              {/* Posts */}
              {posts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  onToggleLike={toggleLike}
                  onToggleSave={toggleSave}
                  onToggleComment={(id: number) => setCommentOpen(commentOpen === id ? null : id)}
                  isCommentOpen={commentOpen === post.id}
                  commentText={commentText}
                  setCommentText={setCommentText}
                />
              ))}
            </div>
          )}

          {/* SHOP VIEW */}
          {activeTab === 'shop' && (
            <div className="max-w-[700px] mx-auto">
              <div className="mb-6">
                <h2 className="font-serif text-2xl font-bold text-plum-900">Tienda K'iinil</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {products.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl border border-lavender-100 overflow-hidden">
                    <div className="p-4">
                      <h3 className="font-serif font-bold text-plum-900 text-sm">{p.name}</h3>
                      <p className="font-serif text-lg font-bold text-plum-700">{p.price}</p>
                      <button
                        onClick={() => toggleCart(p.id)}
                        className="mt-2 w-full px-3 py-1.5 rounded-full text-xs font-semibold bg-plum-700 text-white"
                      >
                        {p.inCart ? '✓ Agregado' : 'Agregar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
