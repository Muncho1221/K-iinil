import { Icon } from './Icons'

export const Sidebar = ({ activeTab, setActiveTab, setCreateOpen, cartCount }: any) => {
  const navItems = [
    { key: 'home', label: 'Inicio', Icon: Icon.Home },
    { key: 'explore', label: 'Explorar', Icon: Icon.Explore },
    { key: 'shop', label: 'Tienda', Icon: Icon.Shop },
  ]
  return (
    <aside className="hidden lg:flex flex-col w-60 xl:w-64 shrink-0 sticky top-0 h-screen py-6 pl-4 pr-3 gap-1 overflow-y-auto">
      <div className="flex items-center gap-2 px-3 mb-6">
        <span className="font-serif text-2xl font-bold text-plum-800">K'iinil</span>
        <span className="w-1.5 h-1.5 rounded-full bg-blush-400 mt-1" />
      </div>

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

      <button
        onClick={() => setCreateOpen(true)}
        className="mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-plum-700 text-white text-sm font-semibold hover:bg-plum-800 transition-colors shadow-[0_4px_15px_rgba(107,33,168,0.25)]"
      >
        <Icon.Plus /> Publicar
      </button>

      <button className="mt-2 flex items-center gap-3.5 px-3 py-2.5 rounded-2xl text-sm font-medium text-plum-700 hover:bg-lavender-100 transition-colors relative">
        <Icon.Cart /> Carrito
        {cartCount > 0 && (
          <span className="ml-auto w-5 h-5 rounded-full bg-blush-500 text-white text-xs font-bold flex items-center justify-center">{cartCount}</span>
        )}
      </button>

      <div className="mt-auto pt-4 border-t border-lavender-200 flex items-center gap-3 px-2">
        <img
          src="https://images.unsplash.com/photo-1573977040523-e16e112ccd3e?w=80&h=80&fit=crop&auto=format"
          alt="Mi perfil"
          className="w-9 h-9 rounded-full object-cover border-2 border-plum-300"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-plum-900 truncate">Tu nombre</p>
          <p className="text-xs text-plum-400 truncate">@tu_usuario</p>
        </div>
      </div>
    </aside>
  )
}
