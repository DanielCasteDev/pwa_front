import { useEffect, useState, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  features: string[];
  quantity: number;
}

export default function StorePage() {
  const [cart, setCart] = useState<Product[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const { isOffline } = useNetworkStatus();
  const lastNetworkStatusRef = useRef<boolean | null>(null);
  const isInitialLoadRef = useRef(true);

  // Productos de la tienda
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      price: 24999,
      originalPrice: 27999,
      image: "/iphone.png",
      description: "El iPhone más avanzado con cámara de 48MP y chip A17 Pro",
      category: "celulares",
      rating: 4.8,
      reviews: 1247,
      inStock: true,
      features: ["Cámara 48MP", "A17 Pro", "Titanio", "5G"],
      quantity: 0
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      price: 21999,
      originalPrice: 24999,
      image: "/samsung.webp",
      description: "Smartphone premium con S Pen y cámara de 200MP",
      category: "celulares",
      rating: 4.7,
      reviews: 892,
      inStock: true,
      features: ["200MP Camera", "S Pen", "S24 Ultra", "5G"],
      quantity: 0
    },
    {
      id: 3,
      name: "Google Pixel 8 Pro",
      price: 18999,
      originalPrice: 21999,
      image: "/google.png",
      description: "El mejor Android con IA de Google y cámara excepcional",
      category: "celulares",
      rating: 4.6,
      reviews: 634,
      inStock: true,
      features: ["Google AI", "Tensor G3", "50MP Camera", "Android 14"],
      quantity: 0
    },
    {
      id: 4,
      name: "OnePlus 12",
      price: 16999,
      originalPrice: 18999,
      image: "/oneplus.png",
      description: "Flagship killer con carga súper rápida y pantalla 120Hz",
      category: "celulares",
      rating: 4.5,
      reviews: 423,
      inStock: true,
      features: ["100W Charging", "120Hz Display", "Snapdragon 8 Gen 3"],
      quantity: 0
    },
    {
      id: 5,
      name: "AirPods Pro 2",
      price: 5499,
      originalPrice: 6299,
      image: "/airpod.png",
      description: "Auriculares inalámbricos con cancelación de ruido activa",
      category: "audio",
      rating: 4.9,
      reviews: 2156,
      inStock: true,
      features: ["Noise Cancellation", "Spatial Audio", "H2 Chip"],
      quantity: 0
    },
    {
      id: 6,
      name: "Sony WH-1000XM5",
      price: 8999,
      originalPrice: 9999,
      image: "/sony.png",
      description: "Auriculares premium con la mejor cancelación de ruido",
      category: "audio",
      rating: 4.8,
      reviews: 1873,
      inStock: true,
      features: ["30h Battery", "Noise Cancellation", "Hi-Res Audio"],
      quantity: 0
    },
    {
      id: 7,
      name: "MacBook Air M3",
      price: 25999,
      originalPrice: 28999,
      image: "/mac.png",
      description: "Laptop ultraportátil con chip M3 y batería de 18 horas",
      category: "laptops",
      rating: 4.9,
      reviews: 967,
      inStock: true,
      features: ["M3 Chip", "18h Battery", "13.6\" Display", "8GB RAM"],
      quantity: 0
    },
    {
      id: 8,
      name: "Dell XPS 13",
      price: 27999,
      originalPrice: 30999,
      image: "/dell.png",
      description: "Laptop premium con pantalla InfinityEdge y Intel i7",
      category: "laptops",
      rating: 4.7,
      reviews: 743,
      inStock: true,
      features: ["Intel i7", "InfinityEdge", "16GB RAM", "512GB SSD"],
      quantity: 0
    },
    {
      id: 9,
      name: "Apple Watch Series 9",
      price: 8999,
      originalPrice: 9999,
      image: "/watch.png",
      description: "Smartwatch con GPS, monitor de salud y pantalla Always-On",
      category: "wearables",
      rating: 4.8,
      reviews: 1456,
      inStock: true,
      features: ["GPS", "Health Monitor", "Always-On", "Water Resistant"],
      quantity: 0
    },
    {
      id: 10,
      name: "Samsung Galaxy Watch 6",
      price: 6499,
      originalPrice: 7499,
      image: "/reloj_samsu.png",
      description: "Smartwatch Android con monitor de sueño y deporte",
      category: "wearables",
      rating: 4.6,
      reviews: 892,
      inStock: true,
      features: ["Sleep Monitor", "Sport Tracking", "Android", "40h Battery"],
      quantity: 0
    }
  ]);

  const categories = [
    { id: 'all', name: 'Todos', icon: '✨' },
    { id: 'celulares', name: 'Celulares', icon: '📱' },
    { id: 'audio', name: 'Audio', icon: '🎧' },
    { id: 'laptops', name: 'Laptops', icon: '💻' },
    { id: 'wearables', name: 'Wearables', icon: '⌚' },
    { id: 'tablets', name: 'Tablets', icon: '📱' }
  ];

  useEffect(() => {
    // Cargar carrito guardado
    const savedCart = localStorage.getItem('techStoreCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Guardar carrito
    localStorage.setItem('techStoreCart', JSON.stringify(cart));
    
    // Calcular totales
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartTotal(total);
    setCartCount(count);
  }, [cart]);

  // Mostrar toast cuando no hay WiFi
  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      lastNetworkStatusRef.current = isOffline;
      return;
    }
    
    if (lastNetworkStatusRef.current !== isOffline) {
      lastNetworkStatusRef.current = isOffline;
      
      if (isOffline) {
        toast.error('📡 Sin conexión', {
          description: 'Algunas funciones pueden estar limitadas',
          duration: 3000,
          position: 'top-center',
          style: {
            background: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            backdropFilter: 'blur(20px)',
          },
        });
      } else {
        toast.success('🟢 Conexión restaurada', {
          description: 'Sincronizando acciones pendientes...',
          duration: 2500,
          position: 'top-center',
          style: {
            background: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            backdropFilter: 'blur(20px)',
          },
        });
        // Pedir al SW que procese la cola (preferir registration.active)
        navigator.serviceWorker?.ready.then((reg) => {
          if (reg.active) {
            reg.active.postMessage({ type: 'PROCESS_CART_QUEUE' });
          } else if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'PROCESS_CART_QUEUE' });
          }
        }).catch(() => {/* no-op */});
      }
    }
  }, [isOffline]);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    // Encolar en SW si estamos offline para sincronizarlo luego
    if (isOffline && navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'QUEUE_CART_ITEM',
        payload: { action: 'add', product, quantity: 1 }
      });

      // Intentar registrar Background Sync
      navigator.serviceWorker.ready
        .then((reg) => {
          const registration = reg as unknown as ServiceWorkerRegistration & {
            sync?: { register: (tag: string) => Promise<void> }
          };
          return registration.sync?.register('sync-cart');
        })
        .catch(() => {/* no-op */});
    }
    toast.success('✅ Agregado al carrito', {
      description: `${product.name} se agregó correctamente`,
      duration: 2000,
      style: {
        background: 'rgba(0, 0, 0, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
        backdropFilter: 'blur(20px)',
      },
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
    toast.success('🗑️ Eliminado del carrito', {
      duration: 1500,
      style: {
        background: 'rgba(0, 0, 0, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
        backdropFilter: 'blur(20px)',
      },
    });
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const getDiscount = (originalPrice: number, currentPrice: number) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-x-hidden">
        
        {/* Header */}
        <header className="bg-black/80 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10">
                  <span className="text-white text-3xl">📱</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    TechStore
                  </h1>
                  <p className="text-gray-400 text-sm font-medium">Premium Electronics</p>
                </div>
              </div>

              {/* Carrito */}
              <button
                onClick={() => setShowCart(true)}
                className="relative group flex items-center space-x-3 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-4 rounded-2xl font-medium hover:bg-white/20 transition-all duration-300 shadow-2xl"
              >
                <span className="text-xl">🛒</span>
                <span className="font-semibold">Carrito</span>
                {cartCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full w-7 h-7 flex items-center justify-center font-bold shadow-lg">
                    {cartCount}
                  </div>
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-12">
          
          {/* Hero Section */}
          <div className="relative mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-12">
              <div className="max-w-4xl">
                <h2 className="text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-6 leading-tight">
                  Descubre la tecnología del futuro
                </h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Los últimos celulares, laptops, auriculares y dispositivos premium al mejor precio
                </p>
                
                {/* Buscador */}
                <div className="relative max-w-2xl">
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-8 py-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/20 focus:border-white/30 transition-all duration-300 text-lg"
                  />
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                    🔍
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Categorías */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-8">Categorías</h3>
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`group flex items-center space-x-3 px-8 py-4 rounded-2xl font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-blue-500/30 shadow-2xl'
                      : 'bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{category.icon}</span>
                  <span className="font-semibold">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-8 rounded-3xl hover:border-white/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-2">Productos</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{products.length}</p>
                  <p className="text-green-400 text-sm font-medium mt-2">Disponibles</p>
                </div>
                <div className="text-5xl group-hover:scale-110 transition-transform duration-300">📱</div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-8 rounded-3xl hover:border-white/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-2">En Carrito</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{cartCount}</p>
                  <p className="text-blue-400 text-sm font-medium mt-2">Items</p>
                </div>
                <div className="text-5xl group-hover:scale-110 transition-transform duration-300">🛒</div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-8 rounded-3xl hover:border-white/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-2">Total</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{formatPrice(cartTotal)}</p>
                  <p className="text-green-400 text-sm font-medium mt-2">A pagar</p>
                </div>
                <div className="text-5xl group-hover:scale-110 transition-transform duration-300">💰</div>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-8">
              {selectedCategory === 'all' ? 'Todos los Productos' : categories.find(c => c.id === selectedCategory)?.name}
              <span className="text-gray-400 text-lg ml-3 font-normal">({filteredProducts.length} productos)</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover:border-white/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  {/* Imagen del producto */}
                  <div className="h-56 bg-gradient-to-br from-gray-800/50 to-gray-900/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                  
                  {/* Contenido */}
                  <div className="p-8">
                    {/* Precio y descuento */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{formatPrice(product.price)}</p>
                        {product.originalPrice && (
                          <div className="flex items-center space-x-3 mt-1">
                            <p className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</p>
                            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                              -{getDiscount(product.originalPrice, product.price)}%
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-400 text-lg">⭐</span>
                          <span className="font-bold text-lg">{product.rating}</span>
                        </div>
                        <p className="text-xs text-gray-400">({product.reviews})</p>
                      </div>
                    </div>

                    {/* Nombre y descripción */}
                    <h4 className="text-xl font-bold text-white mb-3 group-hover:text-gray-200 transition-colors">{product.name}</h4>
                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">{product.description}</p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {product.features.slice(0, 2).map((feature, index) => (
                        <span key={index} className="px-3 py-1 bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs rounded-full font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Botones */}
                    <div className="space-y-3">
                      <button
                        onClick={() => openProductModal(product)}
                        className="w-full py-3 rounded-2xl font-medium text-lg bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 text-white"
                      >
                        📋 Ver Detalles
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                          product.inStock
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-2xl hover:shadow-blue-500/25 hover:scale-105'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                        }`}
                      >
                        {product.inStock ? '🛒 Agregar al Carrito' : '❌ Sin Stock'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <div className="text-8xl mb-6">🔍</div>
                <h4 className="text-2xl font-bold text-white mb-4">No se encontraron productos</h4>
                <p className="text-gray-400 text-lg">Intenta con otros términos de búsqueda</p>
              </div>
            )}
          </div>
        </main>

        {/* Modal del Carrito */}
        {showCart && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl border border-white/20 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
              {/* Header del modal */}
              <div className="flex items-center justify-between p-8 border-b border-white/10">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">🛒 Mi Carrito</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300"
                >
                  <span className="text-2xl">✕</span>
                </button>
              </div>

              {/* Contenido del carrito */}
              <div className="p-8 overflow-y-auto max-h-96">
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-8xl mb-6">🛒</div>
                    <h4 className="text-2xl font-bold text-white mb-4">Tu carrito está vacío</h4>
                    <p className="text-gray-400 text-lg">Agrega algunos productos para comenzar</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-6 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                        <div className="w-16 h-16 bg-gray-800/50 rounded-xl flex items-center justify-center overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-lg">{item.name}</h4>
                          <p className="text-blue-400 font-bold text-lg">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
                          >
                            <span className="text-xl">➖</span>
                          </button>
                          <span className="font-bold text-xl w-12 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
                          >
                            <span className="text-xl">➕</span>
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                          >
                            <span className="text-xl">🗑️</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer del modal */}
              {cart.length > 0 && (
                <div className="p-8 border-t border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-3xl font-bold text-white">Total:</span>
                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{formatPrice(cartTotal)}</span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-5 rounded-2xl font-bold text-xl transition-all duration-300 shadow-2xl hover:shadow-green-500/25 hover:scale-105">
                    💳 Proceder al Pago
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal de Producto Detallado */}
        {showProductModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl border border-white/20 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Header del modal */}
              <div className="flex items-center justify-between p-8 border-b border-white/10">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  📋 Detalles del Producto
                </h3>
                <button
                  onClick={closeProductModal}
                  className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300"
                >
                  <span className="text-2xl">✕</span>
                </button>
              </div>

              {/* Contenido del modal */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Imagen del producto */}
                  <div className="space-y-6">
                    <div className="aspect-square bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl flex items-center justify-center overflow-hidden border border-white/10">
                      <img 
                        src={selectedProduct.image} 
                        alt={selectedProduct.name}
                        className="w-full h-full object-contain p-8"
                      />
                    </div>
                    
                    {/* Precio destacado */}
                    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm font-medium">Precio Especial</p>
                          <p className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            {formatPrice(selectedProduct.price)}
                          </p>
                          {selectedProduct.originalPrice && (
                            <p className="text-lg text-gray-500 line-through mt-1">
                              {formatPrice(selectedProduct.originalPrice)}
                            </p>
                          )}
                        </div>
                        {selectedProduct.originalPrice && (
                          <div className="text-right">
                            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xl px-4 py-2 rounded-full font-bold">
                              -{getDiscount(selectedProduct.originalPrice, selectedProduct.price)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Información del producto */}
                  <div className="space-y-6">
                    
                    {/* Nombre y rating */}
                    <div>
                      <h4 className="text-3xl font-bold text-white mb-4">{selectedProduct.name}</h4>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-400 text-2xl">⭐</span>
                          <span className="font-bold text-xl">{selectedProduct.rating}</span>
                        </div>
                        <span className="text-gray-400">({selectedProduct.reviews} reseñas)</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedProduct.inStock 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {selectedProduct.inStock ? '✅ En Stock' : '❌ Sin Stock'}
                        </span>
                      </div>
                    </div>

                    {/* Descripción */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                      <h5 className="text-xl font-bold text-white mb-3">📝 Descripción</h5>
                      <p className="text-gray-300 leading-relaxed">{selectedProduct.description}</p>
                    </div>

                    {/* Características */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                      <h5 className="text-xl font-bold text-white mb-4">⚡ Características Principales</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedProduct.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                            <span className="text-gray-300 font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Información adicional */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                        <h6 className="text-sm font-medium text-gray-400 mb-2">Categoría</h6>
                        <p className="text-white font-semibold capitalize">{selectedProduct.category}</p>
                      </div>
                      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                        <h6 className="text-sm font-medium text-gray-400 mb-2">Disponibilidad</h6>
                        <p className={`font-semibold ${selectedProduct.inStock ? 'text-green-400' : 'text-red-400'}`}>
                          {selectedProduct.inStock ? 'Disponible' : 'Agotado'}
                        </p>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="space-y-4 pt-4">
                      <button
                        onClick={() => {
                          addToCart(selectedProduct);
                          closeProductModal();
                        }}
                        disabled={!selectedProduct.inStock}
                        className={`w-full py-4 rounded-2xl font-bold text-xl transition-all duration-300 ${
                          selectedProduct.inStock
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-2xl hover:shadow-blue-500/25 hover:scale-105'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                        }`}
                      >
                        {selectedProduct.inStock ? '🛒 Agregar al Carrito' : '❌ Sin Stock'}
                      </button>
                      
                      <button
                        onClick={closeProductModal}
                        className="w-full py-3 rounded-2xl font-medium text-lg bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 text-white"
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster richColors />
    </>
  );
}
