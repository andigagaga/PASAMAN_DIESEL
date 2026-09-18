import { useMemo, useState } from "react";
import type { Product } from "../models/types";
import { formatIDR, generateId } from "../utils";
import { CheckCircle, Download, Plus, Search, XCircle } from "lucide-react";

export const MasterDataView = ({ products, onAddProduct, onToast }: { products: Product[], onAddProduct: (p: Product) => void, onToast: (m: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isAdding, setIsAdding] = useState(false);
  const [newP, setNewP] = useState({ name: '', buyPrice: '', sellPrice: '', stock: '' });

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const status = p.stock > 0 ? 'AVAILABLE' : 'EMPTY';
      return matchSearch && (filterStatus === 'ALL' || status === filterStatus);
    });
  }, [products, searchTerm, filterStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newP.name || !newP.buyPrice) return onToast('Nama dan Harga Modal wajib diisi!');
    onAddProduct({
      id: generateId('P'), name: newP.name, buyPrice: Number(newP.buyPrice),
      sellPrice: Number(newP.sellPrice) || 0, stock: Number(newP.stock) || 0
    });
    setIsAdding(false); setNewP({ name: '', buyPrice: '', sellPrice: '', stock: '' });
  };

  const downloadExcel = () => {
    const table = `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><body><table border="1">
      <tr><th>ID</th><th>Nama Barang</th><th>Harga Modal</th><th>Harga Jual</th><th>Stok</th></tr>
      ${products.map(p => `<tr><td>${p.id}</td><td>${p.name}</td><td>${p.buyPrice}</td><td>${p.sellPrice}</td><td>${p.stock}</td></tr>`).join('')}
    </table></body></html>`;
    const url = URL.createObjectURL(new Blob([table], { type: 'application/vnd.ms-excel' }));
    const a = document.createElement("a"); a.href = url; a.download = "Master_Data_Pasaman.xls"; a.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Master Data Barang</h2>
        <div className="flex gap-2">
          <button onClick={downloadExcel} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 shadow-sm"><Download size={16} /> Ekspor Excel</button>
          <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm"><Plus size={16} /> Tambah Barang</button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-top-4">
          <div><label className="text-xs font-bold text-gray-600">Nama Barang *</label><input required value={newP.name} onChange={e => setNewP({ ...newP, name: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Misal: Filter Oli" /></div>
          <div><label className="text-xs font-bold text-gray-600">Harga Modal (Rp) *</label><input required type="number" value={newP.buyPrice} onChange={e => setNewP({ ...newP, buyPrice: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" /></div>
          <div><label className="text-xs font-bold text-gray-600">Harga Jual (Rp)</label><input type="number" value={newP.sellPrice} onChange={e => setNewP({ ...newP, sellPrice: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" /></div>
          <div>
            <label className="text-xs font-bold text-gray-600">Stok Awal *</label>
            <div className="flex gap-2 mt-1">
              <input required type="number" value={newP.stock} onChange={e => setNewP({ ...newP, stock: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 rounded text-sm font-medium">Simpan</button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 flex flex-col sm:flex-row gap-4 border-b border-gray-200">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input type="text" placeholder="Cari nama barang..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-auto">
            <option value="ALL">Semua Status</option>
            <option value="AVAILABLE">Tersedia</option>
            <option value="EMPTY">Stok Habis</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-100 text-gray-700 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Nama Barang</th>
                <th className="p-4 text-right font-semibold">Harga Modal</th>
                <th className="p-4 text-right font-semibold">Harga Jual</th>
                <th className="p-4 text-center font-semibold">Sisa Stok</th>
                <th className="p-4 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length > 0 ? filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-mono text-xs text-gray-500">{p.id}</td>
                  <td className="p-4 font-medium text-gray-900">{p.name}</td>
                  <td className="p-4 text-right">{formatIDR(p.buyPrice)}</td>
                  <td className="p-4 text-right text-blue-600 font-medium">{formatIDR(p.sellPrice)}</td>
                  <td className="p-4 text-center font-bold text-gray-800">{p.stock}</td>
                  <td className="p-4 text-center">
                    {p.stock > 0 ?
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium"><CheckCircle size={12} /> Tersedia</span> :
                      <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-medium"><XCircle size={12} /> Habis</span>
                    }
                  </td>
                </tr>
              )) : <tr><td colSpan={6} className="p-8 text-center text-gray-500">Tidak ada data ditemukan</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};