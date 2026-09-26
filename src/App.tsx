import {
  CheckCircle,
  Database,
  FileText,
  LayoutDashboard,
  LogOut,
  ShoppingCart,
  User
} from 'lucide-react';
import { useState } from 'react';
import { initialProducts, initialTransactions, type CartItem, type Product, type Transaction } from './models/types';
import { generateId } from './utils';
import { DashboardView } from './views/DashboardView';
import { KasirPOSView } from './views/KasirPOSView';
import { LaporanView } from './views/LaporanView';
import { LoginView } from './views/LoginView';
import { MasterDataView } from './views/MasterDataView';

export default function App() {
  // --- States ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'master' | 'pos' | 'laporan'>('dashboard');

  // Model Data States
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  // UI State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Logic / Controller Methods ---
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogin = (u: string, p: string) => {
    if (u === 'adminpasamandiesel' && p === 'pasaman123') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Username atau password tidak valid!');
    }
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts([newProduct, ...products]);
    showToast('Barang berhasil ditambahkan ke database!');
  };

  const handleCheckout = (cart: CartItem[], total: number): Transaction | null => {
    if (cart.length === 0) return null;

    // 1. Buat Data Transaksi Baru
    const newTx: Transaction = {
      id: generateId('T'),
      date: new Date().toISOString(),
      receiptNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        qty: item.cartQty,
        price: item.sellPrice,
        subtotal: item.sellPrice * item.cartQty
      })),
      total
    };

    // 2. Kalkulasi Pengurangan Stok secara presisi
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(c => c.id === p.id);
      return cartItem ? { ...p, stock: p.stock - cartItem.cartQty } : p;
    });

    // 3. Mutasi State (Update Database)
    setProducts(updatedProducts);
    setTransactions([newTx, ...transactions]);
    return newTx; // Return transaksi untuk dicetak resinya oleh View
  };

  // --- Router / Layout Render ---
  // Jika belum login, render LoginView saja (Early Return)
  if (!isLoggedIn) {
    return <LoginView onLogin={handleLogin} error={loginError} />;
  }

  // Layout Utama (Setelah Login)
  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in slide-in-from-top-2">
          <CheckCircle size={18} className="text-green-400" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Nav */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 print:hidden flex flex-col z-20 shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-extrabold text-blue-700 tracking-tight">PASAMAN DIESEL</h1>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'master', icon: Database, label: 'Master Data' },
            { id: 'pos', icon: ShoppingCart, label: 'Kasir (POS)' },
            { id: 'laporan', icon: FileText, label: 'Laporan' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'} /> {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden print:overflow-visible print:block bg-gray-50">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-8 flex-shrink-0 print:hidden z-10 shadow-sm">
          <div className="md:hidden flex items-center">
            <h1 className="text-xl font-extrabold text-blue-700">PASAMAN</h1>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-gray-400 font-medium text-sm">App</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700 font-semibold text-sm capitalize">{activeTab.replace('pos', 'Kasir (POS)')}</span>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 py-1.5 px-3 rounded-full border border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-700 leading-tight">Administrator</p>
              <p className="text-[10px] text-gray-500">admin@pasamandiesel.com</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
              <User size={16} />
            </div>
          </div>
        </header>

        {/* View Switcher Container */}
        <div className="flex-1 overflow-auto p-4 md:p-8 print:p-0 print:overflow-visible print:block print:h-auto">
          {activeTab === 'dashboard' && <DashboardView products={products} transactions={transactions} />}
          {activeTab === 'master' && <MasterDataView products={products} onAddProduct={handleAddProduct} onToast={showToast} />}
          {activeTab === 'pos' && <KasirPOSView products={products} onCheckout={handleCheckout} onToast={showToast} />}
          {activeTab === 'laporan' && <LaporanView products={products} transactions={transactions} />}
        </div>
      </main>
    </div>
  );
}