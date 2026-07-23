import { Icon } from './Icons'

export const TopBar = ({ setCreateOpen, cartCount }: any) => (
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
)
