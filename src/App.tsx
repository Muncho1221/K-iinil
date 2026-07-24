import { useState, useEffect } from 'react'
import { Icon } from './components/Icons'
import { Post } from './components/Post'
import { sqlService } from './services/sqlService'
import { noSqlService } from './services/noSqlService'
import { useAuth } from './hooks/useAuth'
import { Auth } from './components/Auth'
import { CreatePostModal } from './components/CreatePostModal'
import { Sidebar } from './components/Sidebar'
import { supabase } from './lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'

// Vista con animación
const AnimatedView = ({ children, keyValue }: { children: React.ReactNode, keyValue: string }) => (
  <motion.div
    key={keyValue}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

// ── APP ────────────────────────────────────────────────────────────────────
export default function App() {
  const { user, loading } = useAuth();
  
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'shop' | 'profile' | 'sell'>('home')
  const [posts, setPosts] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [cartItems, setCartItems] = useState<any[]>([])
  const [showCart, setShowCart] = useState(false)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [following, setFollowing] = useState<Record<number, boolean>>({})
  const [createOpen, setCreateOpen] = useState(false)
  const [newPost, setNewPost] = useState('')
  const [newPostImage, setNewPostImage] = useState('')
  const [commentOpen, setCommentOpen] = useState<number | null>(null)
  const [commentText, setCommentText] = useState('')
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [mobileNav, setMobileNav] = useState(false)
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const submitProduct = async () => {
    if (!productName || !productPrice) return;
    const newProduct = {
      name: productName,
      price: parseFloat(productPrice),
      user_id: user?.id
    };
    const { error } = await noSqlService.insertDocument('products', newProduct);
    if (!error) {
      setProducts(prev => [...prev, { ...newProduct, id: Date.now().toString() }]);
      setProductName('');
      setProductPrice('');
      setActiveTab('shop');
    }
  };
  const deletePost = async (postId: string) => {
    const { error } = await sqlService.delete('posts', postId);
    if (!error) {
      setPosts(ps => ps.filter(p => p.id != postId));
    } else {
      console.error('Error al borrar post:', error);
    }
  };

  // Cargar datos al iniciar
  useEffect(() => {
    if (!user) return;
    
    let isMounted = true;

    async function fetchData() {
      // Cargar perfil
      if (user?.id) {
        const { data: profileData, error: profileErr } = await sqlService.getAll(`profiles?id=eq.${user.id}`);
        
        if (isMounted) {
            if (profileErr) {
                console.error('❌ Error cargando perfil:', profileErr);
            } else if (profileData && profileData.length > 0) {
                setProfile(profileData[0]);
            } else {
                const newProfile = {
                    id: user.id,
                    username: user.email?.split('@')[0] || 'usuario',
                    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.id,
                    bio: 'Nuevo usuario de Kiiinil'
                };
                const { data, error } = await sqlService.insert('profiles', [newProfile]);
                if (!error) {
                    setProfile(newProfile);
                }
            }
        }
      }

      // Diagnóstico SQL
      try {
        const { data: sqlData, error: sqlError } = await sqlService.getPostsWithProfiles();
        if (isMounted) {
            if (sqlError) {
              console.error('❌ Error SQL (Posts):', sqlError.message);
            } else {
              const formattedPosts = (sqlData || []).map((p: any) => ({
                  ...p,
                  user_name: p.profiles?.username || 'Usuario',
                  avatar: p.profiles?.avatar_url
              }));
              setPosts(formattedPosts);
            }
        }
      } catch (err) {
        console.error('❌ Fallo fatal SQL:', err);
      }

      // Diagnóstico NoSQL
      try {
        const { data: noSqlData, error: noSqlError } = await noSqlService.getDocuments('products');
        console.log('NoSQL Data (Products):', noSqlData);
        if (isMounted) {
            if (noSqlError) {
              console.error('❌ Error NoSQL (Products):', noSqlError.message);
            } else {
              if (noSqlData) {
                // Hacemos el mapeo más robusto por si 'attributes' no existe
                setProducts(noSqlData.map((p: any) => ({ 
                  ...(p.attributes || p), 
                  id: p.id 
                })));
              }
            }
        }
      } catch (err) {
        console.error('❌ Fallo fatal NoSQL:', err);
      }
    }
    fetchData();

    return () => { isMounted = false; };
  }, [user?.id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (!user) return <Auth />;

  const toggleLike = (id: number | string) => {
    setPosts(ps => ps.map(p =>
      p.id === id ? { 
        ...p, 
        liked: !p.liked, 
        likes: (p.liked ? (p.likes || 1) - 1 : (p.likes || 0) + 1) 
      } : p
    ))
  }

  const toggleSave = (id: number) => {
    setPosts(ps => ps.map(p => p.id === id ? { ...p, saved: !p.saved } : p))
  }

  const toggleCart = (product: any) => {
    const isAlreadyInCart = cartItems.find(item => item.id === product.id)
    if (isAlreadyInCart) {
        setCartItems(items => items.filter(item => item.id !== product.id))
        setCartCount(c => c - 1)
    } else {
        setCartItems(items => [...items, product])
        setCartCount(c => c + 1)
    }
  }

  const toggleFollow = (id: number) => {
    setFollowing(f => ({ ...f, [id]: !f[id] }))
  }

  const submitPost = async () => {
    if (!newPost.trim() || !user || !profile) {
        return;
    }
    
    let imageUrl = 'https://images.unsplash.com/photo-1596704017254-9b5c10898154?w=400&h=400&fit=crop';

    // Subir imagen si existe
    if (newPostImage) {
        const fileExt = newPostImage.name.split('.').pop();
        const fileName = `${user.id}/${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
            .from('posts')
            .upload(fileName, newPostImage);
            
        if (uploadError) {
            return;
        }
        
        const { data: publicUrlData } = supabase.storage.from('posts').getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
    }

    const newPostData = {
      user_id: user.id,
      caption: newPost,
      image_url: imageUrl,
      created_at: new Date().toISOString(),
    }
    
    // Guardar en SQL
    const { error } = await sqlService.insert('posts', [newPostData]);
    
    if (!error) {
        // Use the profile data directly to ensure the avatar is correct
        setPosts(ps => [{ ...newPostData, id: Date.now().toString(), user_name: profile.username, avatar: profile.avatar_url }, ...ps]);
        setNewPost('');
        setNewPostImage(null);
        setCreateOpen(false);
    }
  }

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

        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab: any) => { 
            setActiveTab(tab); 
            setShowCart(false); // No abrir el carrito por defecto
          }} 
          setCreateOpen={setCreateOpen} 
          cartCount={cartCount} 
          userProfile={profile}
        />

        {/* ── MAIN FEED ─────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 px-0 lg:px-4 xl:px-6 py-0 lg:py-6">

          {/* MAIN CONTENT ANIMATED */}
          <AnimatePresence mode="popLayout">
            {/* HOME VIEW */}
            {activeTab === 'home' && (
              <AnimatedView keyValue="home">
                <div className="max-w-[600px] mx-auto space-y-1">
                  {/* Create post quick bar */}
                  <div className="bg-white rounded-2xl border border-lavender-100 p-4 mb-4 flex items-center gap-3">
                    <img src={profile?.avatar_url} alt={profile?.username} className="w-9 h-9 rounded-full bg-plum-300" />
                    <button
                      onClick={() => setCreateOpen(true)}
                      className="flex-1 text-left px-4 py-2.5 rounded-full bg-lavender-50 border border-lavender-200 text-sm text-plum-400 hover:bg-lavender-100 transition-colors"
                    >
                      ¿Qué look usas hoy? ✨
                    </button>
                    <button
                      onClick={submitPost}
                      className="px-4 py-2 rounded-full bg-plum-700 text-white text-xs font-semibold hover:bg-plum-800 transition-colors"
                    >
                      Publicar
                    </button>
                  </div>

                  {/* Posts */}
                  {posts.length > 0 ? (
                    posts.map((post) => (
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
                    ))
                  ) : (
                    <div className="text-center py-10 text-plum-500">No hay posts todavía. ¡Sé el primero!</div>
                  )}
                </div>
              </AnimatedView>
            )}

            {/* EXPLORE VIEW */}
            {activeTab === 'explore' && (
              <AnimatedView keyValue="explore">
                <div className="max-w-[700px] mx-auto p-4">
                  <h2 className="font-serif text-2xl font-bold text-plum-900 mb-6">Explorar</h2>
                  <div className="grid grid-cols-3 gap-2">
                    {posts.filter(p => p.image_url && !p.image_url.includes('placehold.co')).map((post) => (
                      <button 
                        key={post.id} 
                        className="aspect-square bg-lavender-100 rounded-sm overflow-hidden hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedPost(post)}
                      >
                        <img src={post.image_url} alt={post.caption} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </AnimatedView>
            )}

            {/* SHOP VIEW */}
            {activeTab === 'shop' && !showCart && (
              <AnimatedView keyValue="shop">
                <div className="max-w-[700px] mx-auto p-4">
                  <div className="mb-6 flex justify-between items-center gap-4">
                    <h2 className="font-serif text-2xl font-bold text-plum-900">Tienda K'iinil</h2>
                    <input
                      type="text"
                      placeholder="Buscar productos..."
                      className="px-4 py-2 rounded-full border border-lavender-200 text-sm focus:outline-none focus:ring-2 focus:ring-plum-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button onClick={() => setShowCart(true)} className="px-4 py-2 rounded-full bg-plum-700 text-white text-sm">Carrito ({cartCount})</button>
                  </div>

                  {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                        <div key={p.id} className="bg-white rounded-2xl border border-lavender-100 overflow-hidden">
                          <div className="p-4">
                            <h3 className="font-serif font-bold text-plum-900 text-sm">{p.name}</h3>
                            <p className="font-serif text-lg font-bold text-plum-700">${p.price}</p>
                            <button
                              onClick={() => toggleCart(p)}
                              className="mt-2 w-full px-3 py-1.5 rounded-full text-xs font-semibold bg-plum-700 text-white"
                            >
                              {cartItems.find(item => item.id === p.id) ? '✓ Agregado' : 'Agregar'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-plum-500">
                      <p>No se encontraron productos.</p>
                    </div>
                  )}
                </div>
              </AnimatedView>
            )}
            
            {/* CART VIEW */}
            {showCart && !orderConfirmed && (
              <AnimatedView keyValue="cart">
                <div className="max-w-[700px] mx-auto p-4">
                  <h2 className="font-serif text-2xl font-bold text-plum-900 mb-6">Tu Carrito</h2>
                  {cartItems.length > 0 ? (
                      <div className="space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-lavender-100">
                                <span className="font-medium text-plum-800">{item.name}</span>
                                <span className="font-bold text-plum-700">${item.price}</span>
                            </div>
                        ))}
                        <div className="pt-4 border-t border-lavender-200">
                          <button 
                              onClick={() => setOrderConfirmed(true)}
                              className="w-full py-3 rounded-full bg-green-600 text-white font-bold hover:bg-green-700 transition-colors"
                          >
                              Confirmar Pedido
                          </button>
                          <button onClick={() => setShowCart(false)} className="w-full py-2 mt-2 text-plum-600 hover:text-plum-800">Volver a la tienda</button>
                        </div>
                      </div>
                  ) : (
                      <p className="text-plum-500">Carrito vacío</p>
                  )}
                </div>
              </AnimatedView>
            )}

            {/* CONFIRMATION VIEW */}
            {orderConfirmed && (
              <AnimatedView keyValue="confirmation">
                <div className="max-w-[500px] mx-auto p-8 mt-10 text-center bg-white rounded-3xl shadow-lg border border-lavender-100">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
                  <h2 className="font-serif text-3xl font-bold text-plum-900 mb-2">¡Gracias por tu compra!</h2>
                  <p className="text-plum-600 mb-8">Tu pedido ha sido recibido y estamos trabajando en él. ✨</p>
                  <button 
                      onClick={() => { setOrderConfirmed(false); setShowCart(false); setCartItems([]); setCartCount(0); setActiveTab('home'); }}
                      className="w-full py-3 rounded-full bg-plum-700 text-white font-bold hover:bg-plum-800 transition-colors"
                  >
                      Volver al Inicio
                  </button>
                </div>
              </AnimatedView>
            )}

            {/* PROFILE VIEW */}
            {activeTab === 'profile' && (
              <AnimatedView keyValue="profile">
                <div className="max-w-[600px] mx-auto p-4">
                  <h2 className="font-serif text-2xl font-bold text-plum-900 mb-6">Tu Perfil</h2>
                  <div className="bg-white p-6 rounded-3xl border border-lavender-100 mb-6 flex items-center gap-4">
                    <img src={profile?.avatar_url} alt={profile?.username} className="w-16 h-16 rounded-full" />
                    <div>
                      <h3 className="font-bold text-lg text-plum-900">{profile?.username}</h3>
                      <p className="text-plum-500">@{profile?.username}</p>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-plum-900 mb-4">Tus Publicaciones</h3>
                  <div className="space-y-4">
                    {posts.filter(p => p.user_id === user?.id).map((post) => (
                      <div key={post.id} className="bg-white p-4 rounded-2xl border border-lavender-100 flex justify-between items-center">
                        <p className="text-plum-800 text-sm">{post.caption}</p>
                        <button 
                          onClick={() => deletePost(post.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold"
                        >
                          Borrar
                        </button>
                      </div>
                    ))}
                  </div>

                  <h3 className="font-bold text-lg text-plum-900 mb-4 mt-8">Publicaciones que te gustan</h3>
                  <div className="space-y-4">
                    {posts.filter(p => p.liked).map((post) => (
                      <div key={post.id} className="bg-white p-4 rounded-2xl border border-lavender-100">
                        <p className="text-plum-800 text-sm font-medium mb-1">{post.user_name}</p>
                        <p className="text-plum-600 text-sm">{post.caption}</p>
                      </div>
                    ))}
                    {posts.filter(p => p.liked).length === 0 && (
                      <p className="text-plum-400 text-sm italic">Todavía no has dado me gusta a ninguna publicación.</p>
                    )}
                  </div>
                </div>
              </AnimatedView>
            )}

            {/* SELL VIEW */}
            {activeTab === 'sell' && (
              <AnimatedView keyValue="sell">
                <div className="max-w-[500px] mx-auto p-4">
                  <h2 className="font-serif text-2xl font-bold text-plum-900 mb-6">Vender Producto</h2>
                  <div className="bg-white p-6 rounded-3xl border border-lavender-100 space-y-4">
                    <input 
                      type="text" 
                      placeholder="Nombre del producto"
                      className="w-full p-3 rounded-xl border border-lavender-200"
                      value={productName}
                      onChange={e => setProductName(e.target.value)}
                    />
                    <input 
                      type="number" 
                      placeholder="Precio"
                      className="w-full p-3 rounded-xl border border-lavender-200"
                      value={productPrice}
                      onChange={e => setProductPrice(e.target.value)}
                    />
                    <button 
                      onClick={submitProduct}
                      className="w-full py-3 rounded-full bg-plum-700 text-white font-bold hover:bg-plum-800 transition-colors"
                    >
                      Publicar en Tienda
                    </button>
                  </div>
                </div>
              </AnimatedView>
            )}
          </AnimatePresence>
        </main>
      </div>

      <CreatePostModal 
        isOpen={createOpen} 
        onClose={() => setCreateOpen(false)} 
        newPost={newPost} 
        setNewPost={setNewPost} 
        newPostImage={newPostImage}
        setNewPostImage={setNewPostImage}
        onSubmit={submitPost}
        userProfile={profile}
      />

      {/* Post Details Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-plum-900/40 backdrop-blur-sm" 
              onClick={() => setSelectedPost(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <img src={selectedPost.image_url} alt={selectedPost.caption} className="w-full aspect-square object-cover" />
              <div className="p-6">
                <p className="text-plum-800 text-base leading-relaxed">{selectedPost.caption}</p>
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="mt-6 w-full py-2 rounded-full bg-lavender-100 text-plum-700 font-semibold"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
