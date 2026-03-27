import { useState, useEffect, useRef } from "react";
import { menuData, MenuItem } from "./data/menu";

// ===================== TYPES =====================
interface CartItem extends MenuItem {
  quantity: number;
}

// ===================== MAIN APP =====================
export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("pollo-lena");
  const [addedItemId, setAddedItemId] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // ===================== THURSDAY PROMO LOGIC =====================
  const isThursday = new Date().getDay() === 4; // 4 = Jueves
  // Para pruebas: const isThursday = true;
  
  const thursdayPromo: MenuItem = {
    id: "promo-jueves",
    name: "🎁 PROMO JUEVES: 1/4 Pollo + Papas + Cremas",
    description: "Sabor de siempre a un precio especial (Solo Jueves)",
    price: 11.00,
    category: "promociones"
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      
      // Update active category based on scroll position
      const sections = menuData.map((cat) => ({
        id: cat.id,
        el: document.getElementById(cat.id),
      }));
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.el) {
          const rect = section.el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveCategory(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 600);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearCart = () => setCart([]);

  const sendWhatsApp = () => {
    const phone = "51929885945";
    let message = "🍗 *Pedido - Lima de Antaño*\n\n";
    cart.forEach((item) => {
      message += `• ${item.quantity}x ${item.name} — S/ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    message += `\n💰 *Total: S/ ${totalPrice.toFixed(2)}*`;
    message += "\n\n¡Gracias por su preferencia! 🙏";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const scrollToSection = (id: string) => {
    setActiveCategory(id);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-brand-darker text-white">
      {/* ============ HERO HEADER ============ */}
      <HeroHeader />

      {/* ============ THURSDAY PROMO BANNER ============ */}
      {isThursday && (
        <ThursdayPromoBanner onAdd={() => addToCart(thursdayPromo)} isAdded={addedItemId === "promo-jueves"} />
      )}

      {/* ============ CATEGORY NAV ============ */}
      <CategoryNav
        activeCategory={activeCategory}
        onSelect={scrollToSection}
      />

      {/* ============ MENU SECTIONS ============ */}
      <main className="max-w-5xl mx-auto px-4 pb-32">
        {menuData.map((category, idx) => (
          <MenuSection
            key={category.id}
            category={category}
            index={idx}
            onAdd={addToCart}
            addedItemId={addedItemId}
          />
        ))}

        {/* Slogan final */}
        <div className="text-center py-16">
          <p className="font-dancing text-3xl md:text-4xl text-brand-orange mb-2">
            Toda familia tiene una historia
          </p>
          <p className="text-brand-orange-light text-lg font-playfair tracking-wider">
            ¡Bienvenidos a la nuestra!
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <span className="text-3xl">🔥</span>
            <span className="text-3xl">🍗</span>
            <span className="text-3xl">🔥</span>
          </div>
        </div>
      </main>

      {/* ============ CART BUTTON (Floating) ============ */}
      {totalItems > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-24 right-4 z-40 bg-brand-orange hover:bg-brand-orange-light text-brand-dark rounded-full w-16 h-16 flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95"
        >
          <CartIcon />
          <span className="absolute -top-1 -right-1 bg-brand-red text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-bounce-subtle">
            {totalItems}
          </span>
        </button>
      )}

      {/* ============ WHATSAPP BUTTON (Floating) ============ */}
      <a
        href="https://wa.me/51929885945"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-4 z-40 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-2xl transition-all hover:scale-110 animate-pulse-glow"
      >
        <WhatsAppIcon />
      </a>

      {/* ============ SCROLL TO TOP ============ */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-4 z-40 bg-brand-charcoal/80 backdrop-blur text-brand-orange rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all hover:scale-110 border border-brand-orange/30"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      {/* ============ CART DRAWER ============ */}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          totalPrice={totalPrice}
          onClose={() => setCartOpen(false)}
          onAdd={addToCart}
          onRemove={removeFromCart}
          onClear={clearCart}
          onSend={sendWhatsApp}
        />
      )}

      {/* ============ FOOTER ============ */}
      <footer className="bg-brand-dark border-t border-white/5 py-8 text-center">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="font-playfair text-2xl text-white mb-1">Lima <span className="text-brand-orange">de</span> Antaño</h3>
          <p className="text-white/40 text-sm mb-4">Pollos a la Leña y Parrillas</p>
          <div className="flex justify-center items-center gap-3 text-white/50 text-sm">
            <span>📞</span>
            <a href="tel:929885945" className="hover:text-brand-orange transition-colors">929 885 945</a>
          </div>
          <p className="text-white/20 text-xs mt-6">© 2025 Lima de Antaño. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

// ===================== THURSDAY PROMO BANNER =====================
function ThursdayPromoBanner({ onAdd, isAdded }: { onAdd: () => void; isAdded: boolean }) {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-2">
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-orange to-brand-red rounded-2xl p-6 shadow-2xl shadow-brand-orange/20 animate-pulse-subtle border border-white/20">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white mb-3 tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Oferta del Día: Jueves de Antaño
            </div>
            <h2 className="font-playfair text-3xl md:text-4xl font-black text-white leading-tight">
              1/4 Pollo + Papas + Cremas
            </h2>
            <p className="text-white/80 font-medium mt-2 max-w-md">
              Disfruta de nuestro sabor tradicional al mejor precio. ¡Solo por hoy!
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-white/60 text-xs uppercase font-bold tracking-widest -mb-1">Solo por</p>
              <div className="text-5xl font-black text-white flex items-start gap-1">
                <span className="text-2xl mt-1">S/</span>
                11
                <span className="text-2xl mt-1">.00</span>
              </div>
            </div>

            <button
              onClick={onAdd}
              className={`px-8 py-4 rounded-xl font-bold transition-all shadow-xl flex items-center gap-2 group ${
                isAdded 
                  ? "bg-green-500 text-white" 
                  : "bg-white text-brand-dark hover:bg-brand-dark hover:text-white"
              }`}
            >
              {isAdded ? (
                <>
                  <svg className="w-5 h-5 animate-bounce-horizontal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Agregado!</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>¡Pedir Ahora!</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================== HERO HEADER =====================
function HeroHeader() {
  return (
    <header className="relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-chicken.jpg"
          alt="Pollo a la leña"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-brand-darker" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[420px] md:min-h-[500px] px-4 py-16 text-center">
        {/* Logo */}
        <div className="mb-6 animate-fade-in-up">
          <div className="inline-block">
            <h1 className="font-playfair text-6xl md:text-8xl font-black text-white leading-none tracking-tight">
              <span className="text-7xl md:text-9xl">L</span>IMA
            </h1>
            <p className="font-playfair text-2xl md:text-3xl text-brand-orange -mt-2 tracking-widest">
              DE
            </p>
            <h1 className="font-playfair text-5xl md:text-7xl font-black text-white leading-none tracking-tight -mt-1">
              <span className="text-6xl md:text-8xl">A</span>NTAÑO
            </h1>
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-12 bg-brand-orange/60"></span>
            <span className="text-brand-orange text-sm tracking-[0.3em] font-medium uppercase">
              Pollos a la Leña y Parrillas
            </span>
            <span className="h-px w-12 bg-brand-orange/60"></span>
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <p className="font-dancing text-xl md:text-2xl text-brand-cream/80 mt-2">
            Toda familia tiene una historia, ¡bienvenidos a la nuestra!
          </p>
        </div>

        <div className="animate-fade-in-up mt-8" style={{ animationDelay: "0.6s" }}>
          <button
            onClick={() => {
              const el = document.getElementById("pollo-lena");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-brand-orange hover:bg-brand-orange-light text-brand-dark font-bold px-8 py-3 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-orange/30 flex items-center gap-2"
          >
            <span>Ver Carta</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" className="w-full h-8 md:h-12">
          <path fill="#0d0d0d" d="M0,20 C480,60 960,0 1440,20 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </header>
  );
}

// ===================== CATEGORY NAV =====================
function CategoryNav({
  activeCategory,
  onSelect,
}: {
  activeCategory: string;
  onSelect: (id: string) => void;
}) {
  const navRef = useRef<HTMLDivElement>(null);

  return (
    <nav className="sticky top-0 z-30 bg-brand-dark/95 backdrop-blur-md border-b border-white/5 shadow-lg">
      <div
        ref={navRef}
        className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto scrollbar-hide py-3"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {menuData.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
              activeCategory === cat.id
                ? "bg-brand-orange text-brand-dark shadow-md shadow-brand-orange/20"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="mr-1.5">{cat.emoji}</span>
            {cat.title}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ===================== MENU SECTION =====================
function MenuSection({
  category,
  index,
  onAdd,
  addedItemId,
}: {
  category: (typeof menuData)[0];
  index: number;
  onAdd: (item: MenuItem) => void;
  addedItemId: string | null;
}) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={category.id}
      ref={sectionRef}
      className={`py-10 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Section header with image */}
      <div className="relative mb-8 rounded-2xl overflow-hidden">
        {category.image && (
          <div className="relative h-48 md:h-56">
            <img
              src={category.image}
              alt={category.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-darker via-brand-darker/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-darker/80 to-transparent" />
          </div>
        )}
        <div className={`${category.image ? "absolute bottom-0 left-0 right-0 p-6" : "p-6"}`}>
          <div className="flex items-center gap-3">
            <div className="ribbon-banner text-lg md:text-xl tracking-wide">
              <span className="mr-2">{category.emoji}</span>
              {category.title.toUpperCase()}
            </div>
          </div>
          {index === 0 && (
            <p className="text-white/50 text-sm mt-2 ml-1">
              Preparado al carbón con el sabor de siempre 🔥
            </p>
          )}
        </div>
      </div>

      {/* Menu items grid */}
      <div className="grid gap-3">
        {category.items.map((item, i) => (
          <MenuItemCard
            key={item.id}
            item={item}
            delay={i * 0.05}
            onAdd={onAdd}
            isAdded={addedItemId === item.id}
          />
        ))}
      </div>
    </section>
  );
}

// ===================== MENU ITEM CARD =====================
function MenuItemCard({
  item,
  delay,
  onAdd,
  isAdded,
}: {
  item: MenuItem;
  delay: number;
  onAdd: (item: MenuItem) => void;
  isAdded: boolean;
}) {
  return (
    <div
      className="menu-item-card bg-brand-dark/60 backdrop-blur rounded-xl p-4 flex items-center justify-between gap-3"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold text-base md:text-lg leading-tight">
          {item.name}
        </h3>
        <p className="text-white/40 text-sm mt-1 leading-snug">
          {item.description}
        </p>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="price-badge">
          S/ {item.price.toFixed(2)}
        </span>
        <button
          onClick={() => onAdd(item)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 ${
            isAdded
              ? "bg-green-500 text-white scale-110"
              : "bg-white/10 text-brand-orange hover:bg-brand-orange hover:text-brand-dark"
          }`}
        >
          {isAdded ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

// ===================== CART DRAWER =====================
function CartDrawer({
  cart,
  totalPrice,
  onClose,
  onAdd,
  onRemove,
  onClear,
  onSend,
}: {
  cart: CartItem[];
  totalPrice: number;
  onClose: () => void;
  onAdd: (item: MenuItem) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onSend: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-brand-dark border-l border-white/10 shadow-2xl animate-slide-in flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center">
              <CartIcon className="text-brand-orange" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Tu Pedido</h2>
              <p className="text-xs text-white/40">
                {cart.reduce((a, i) => a + i.quantity, 0)} productos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-white/30">
              <span className="text-5xl mb-4">🛒</span>
              <p className="text-lg">Tu carrito está vacío</p>
              <p className="text-sm mt-1">Agrega platos deliciosos</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 rounded-xl p-4 flex items-center gap-3 border border-white/5"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm leading-tight truncate">
                    {item.name}
                  </h4>
                  <p className="text-brand-orange font-bold text-sm mt-1">
                    S/ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRemove(item.id)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-500/20 text-white/60 hover:text-red-400 flex items-center justify-center transition-all text-lg font-bold"
                  >
                    −
                  </button>
                  <span className="text-white font-bold w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onAdd(item)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand-orange/20 text-white/60 hover:text-brand-orange flex items-center justify-center transition-all text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white/60">Total</span>
              <span className="text-2xl font-black text-brand-orange">
                S/ {totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              onClick={onSend}
              className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-[#25D366]/20"
            >
              <WhatsAppIcon />
              <span>Enviar Pedido por WhatsApp</span>
            </button>

            <button
              onClick={onClear}
              className="w-full text-white/30 hover:text-red-400 text-sm py-2 transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ===================== ICONS =====================
function CartIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`w-6 h-6 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
