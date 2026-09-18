import { useState } from "react";
import type { CartItem, Product, Transaction } from "../models/types";
import { formatIDR } from "../utils";
import { Plus, Printer, ShoppingCart, Trash2, XCircle } from "lucide-react";

export const KasirPOSView = ({ products, onCheckout, onToast }: { products: Product[], onCheckout: (cart: CartItem[], total: number) => Transaction | null, onToast: (m: string) => void }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [qty, setQty] = useState(1);
  const [receipt, setReceipt] = useState<Transaction | null>(null);

  const available = products.filter(p => p.stock > 0);
  const selected = products.find(p => p.id === selectedId);
  const grandTotal = cart.reduce((sum, item) => sum + (item.sellPrice * item.cartQty), 0);

  const handleAdd = () => {
    if (!selected) return onToast('Silakan pilih barang terlebih dahulu!');
    if (qty <= 0) return onToast('Kuantitas tidak valid!');
    if (qty > selected.stock) return onToast(`Stok tidak cukup! Sisa stok: ${selected.stock}`);

    const exist = cart.find(c => c.id === selected.id);
    if (exist && exist.cartQty + qty > selected.stock) return onToast(`Melebihi stok! Maksimal bisa tambah ${selected.stock - exist.cartQty} lagi.`);

    if (exist) {
      setCart(cart.map(c => c.id === selected.id ? { ...c, cartQty: c.cartQty + qty } : c));
    } else {
      setCart([...cart, { ...selected, cartQty: qty }]);
    }
    setSelectedId(''); setQty(1);
  };

  const processCheckout = () => {
    if (cart.length === 0) return;
    const tx = onCheckout(cart, grandTotal);
    if (tx) {
      setReceipt(tx);
      setCart([]);
      // Auto print immediately
      setTimeout(() => window.print(), 300);
    }
  };

  return (
    <div className={`space-y-6 animate-in fade-in duration-300 ${receipt ? 'print:hidden' : ''}`}>
      <h2 className="text-2xl font-bold text-gray-800">Kasir / POS</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
            <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Form Pembelian</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Pilih Barang (Stok Tersedia)</label>
                <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Pilih Barang --</option>
                  {available.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Sisa: {p.stock}) - {formatIDR(p.sellPrice)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Kuantitas</label>
                <input type="number" min="1" value={qty} onChange={e => setQty(Number(e.target.value))} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button onClick={handleAdd} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                <Plus size={16} /> Tambah ke Keranjang
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-[500px]">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
            <ShoppingCart size={18} className="text-gray-600" />
            <h3 className="font-bold text-gray-700">Keranjang Belanja</h3>
          </div>

          <div className="flex-1 p-4 overflow-auto">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <ShoppingCart size={48} className="mb-3 opacity-20" />
                <p>Keranjang masih kosong</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-4 border border-gray-100 bg-white shadow-sm rounded-lg hover:border-blue-200 transition-colors">
                    <div>
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500 mt-1">{item.cartQty} Pcs x <span className="font-medium text-blue-600">{formatIDR(item.sellPrice)}</span></p>
                    </div>
                    <div className="flex gap-6 items-center">
                      <p className="text-lg font-bold text-gray-900">{formatIDR(item.sellPrice * item.cartQty)}</p>
                      <button onClick={() => setCart(cart.filter(c => c.id !== item.id))} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors" title="Hapus">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 bg-gray-800 text-white rounded-b-xl border-t-0 shadow-inner">
            <div className="flex justify-between items-end mb-4">
              <span className="text-gray-300 font-medium">Grand Total</span>
              <span className="text-3xl font-bold text-green-400">{formatIDR(grandTotal)}</span>
            </div>
            <button onClick={processCheckout} disabled={cart.length === 0} className={`w-full py-3 rounded-lg text-white font-bold flex justify-center items-center gap-2 transition-all ${cart.length === 0 ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-green-600 hover:bg-green-500 shadow-lg shadow-green-900/50'}`}>
              <Printer size={20} /> Proses & Cetak Struk
            </button>
          </div>
        </div>
      </div>

      {receipt && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center print:bg-white print:absolute print:inset-0 print:p-0 print:block">
          <div className="bg-white p-8 w-full max-w-md shadow-2xl rounded-xl print:shadow-none print:rounded-none print:w-full print:max-w-full print:p-0 relative">
            <button onClick={() => setReceipt(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 print:hidden"><XCircle size={24} /></button>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">PASAMAN DIESEL</h1>
              <p className="text-xs text-gray-500 mt-1">Jl. Raya Pasaman No. 123, Sumatera Barat</p>
            </div>

            <div className="text-center text-sm border-y-2 border-dashed border-gray-300 py-3 mb-4 space-y-1">
              <p className="font-bold">NOTA PENJUALAN</p>
              <p className="text-gray-600">No: {receipt.receiptNumber}</p>
              <p className="text-gray-600">{new Date(receipt.date).toLocaleString('id-ID')}</p>
            </div>

            <div className="space-y-3 mb-6 min-h-[150px]">
              {receipt.items.map((it, i) => (
                <div key={i} className="text-sm flex flex-col border-b border-gray-100 pb-2">
                  <span className="font-semibold text-gray-800">{it.name}</span>
                  <div className="flex justify-between text-gray-600 mt-1">
                    <span>{it.qty} x {it.price.toLocaleString('id-ID')}</span>
                    <span className="font-medium text-gray-900">{it.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-dashed border-gray-300 pt-4 flex justify-between items-center mb-8">
              <span className="font-bold text-gray-700 text-lg">TOTAL</span>
              <span className="font-black text-xl text-gray-900">{formatIDR(receipt.total)}</span>
            </div>

            <div className="text-center text-xs text-gray-500">
              <p>Terima kasih atas kunjungan Anda.</p>
              <p>Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.</p>
            </div>

            <div className="mt-8 flex gap-3 print:hidden">
              <button onClick={() => window.print()} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2 shadow-md shadow-blue-600/20">
                <Printer size={18} /> Cetak / PDF
              </button>
              <button onClick={() => setReceipt(null)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors">
                Tutup Nota
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};