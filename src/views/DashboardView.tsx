import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Product, Transaction } from "../models/types";
import { formatIDR } from "../utils";

export const DashboardView = ({ products, transactions }: { products: Product[], transactions: Transaction[] }) => {
  const totalValuasiMasuk = products.reduce((sum, p) => sum + (p.buyPrice * p.stock), 0);
  const totalKuantitasMasuk = products.reduce((sum, p) => sum + p.stock, 0);
  const totalPendapatan = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalBarangTerjual = transactions.reduce((sum, t) => sum + t.items.reduce((acc, item) => acc + item.qty, 0), 0);

  const chartData = [
    { name: 'Periode Ini', ValuasiStok: totalValuasiMasuk, Pendapatan: totalPendapatan },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Performa</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-blue-500">
          <p className="text-sm text-gray-500 font-medium">Kuantitas Stok Aset</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{totalKuantitasMasuk} <span className="text-sm font-normal text-gray-500">Pcs</span></p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-blue-700">
          <p className="text-sm text-gray-500 font-medium">Valuasi Stok Tersedia</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{formatIDR(totalValuasiMasuk)}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-green-500">
          <p className="text-sm text-gray-500 font-medium">Total Barang Terjual</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{totalBarangTerjual} <span className="text-sm font-normal text-gray-500">Pcs</span></p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-green-700">
          <p className="text-sm text-gray-500 font-medium">Total Pendapatan (Sales)</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{formatIDR(totalPendapatan)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-96">
        <h3 className="text-lg font-bold text-gray-700 mb-6">Grafik Komparasi Aset vs Penjualan</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `Rp ${v / 1000000}M`} />
            <Tooltip formatter={(value: number) => formatIDR(value)} cursor={{ fill: 'transparent' }} />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="ValuasiStok" name="Valuasi Stok Tersedia" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={60} />
            <Bar dataKey="Pendapatan" name="Total Pendapatan" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={60} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
