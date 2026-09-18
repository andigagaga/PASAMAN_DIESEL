import { Printer } from "lucide-react";
import type { Product, Transaction } from "../models/types";
import { formatIDR } from "../utils";

export const LaporanView = ({ products, transactions }: { products: Product[], transactions: Transaction[] }) => {
  const totalVal = products.reduce((sum, p) => sum + (p.buyPrice * p.stock), 0);
  const totalRev = transactions.reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Laporan & Rekapitulasi</h2>
          <p className="text-sm text-gray-500">Cetak rekapitulasi masuk dan keluar barang</p>
        </div>
        <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex gap-2 items-center shadow-md transition-colors">
          <Printer size={18} /> Cetak Laporan (A4)
        </button>
      </div>

      {/* Area yang akan dicetak */}
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm print:shadow-none print:border-none print:p-0 print:block">
        <div className="text-center mb-10 pb-6 border-b-4 border-double border-gray-300">
          <h1 className="text-3xl font-black text-gray-900">PASAMAN DIESEL</h1>
          <h2 className="text-xl font-bold text-gray-700 mt-2">LAPORAN INVENTORI & PENJUALAN</h2>
          <p className="text-sm text-gray-500 mt-1">Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="font-bold text-lg text-gray-800 border-b border-gray-300 pb-2 mb-4 uppercase">Rekapitulasi Stok Gudang (Aset)</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-100"><td className="py-3 text-gray-600">Total Macam Barang</td><td className="py-3 text-right font-bold text-gray-900">{products.length} SKU</td></tr>
                <tr className="border-b border-gray-100"><td className="py-3 text-gray-600">Total Kuantitas Fisik</td><td className="py-3 text-right font-bold text-gray-900">{products.reduce((a, b) => a + b.stock, 0)} Pcs</td></tr>
                <tr><td className="py-3 text-gray-600">Estimasi Valuasi (Harga Modal)</td><td className="py-3 text-right font-black text-blue-700 text-lg">{formatIDR(totalVal)}</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800 border-b border-gray-300 pb-2 mb-4 uppercase">Rekapitulasi Penjualan (Keluar)</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-100"><td className="py-3 text-gray-600">Total Transaksi (Nota)</td><td className="py-3 text-right font-bold text-gray-900">{transactions.length} Transaksi</td></tr>
                <tr className="border-b border-gray-100"><td className="py-3 text-gray-600">Total Barang Terjual</td><td className="py-3 text-right font-bold text-gray-900">{transactions.reduce((sum, t) => sum + t.items.reduce((a, i) => a + i.qty, 0), 0)} Pcs</td></tr>
                <tr><td className="py-3 text-gray-600">Total Pendapatan</td><td className="py-3 text-right font-black text-green-700 text-lg">{formatIDR(totalRev)}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg text-gray-800 border-b border-gray-300 pb-2 mb-4 uppercase">Histori 5 Transaksi Terakhir</h3>
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border border-gray-200">Tanggal</th>
                <th className="p-3 border border-gray-200">No. Nota</th>
                <th className="p-3 border border-gray-200">Detail Item</th>
                <th className="p-3 border border-gray-200 text-right">Total Nominal</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map(t => (
                <tr key={t.id}>
                  <td className="p-3 border border-gray-200 whitespace-nowrap">{new Date(t.date).toLocaleDateString('id-ID')}</td>
                  <td className="p-3 border border-gray-200 font-mono">{t.receiptNumber}</td>
                  <td className="p-3 border border-gray-200">
                    <ul className="list-disc pl-4 text-xs text-gray-600">
                      {t.items.map((it, i) => <li key={i}>{it.name} ({it.qty}x)</li>)}
                    </ul>
                  </td>
                  <td className="p-3 border border-gray-200 text-right font-bold">{formatIDR(t.total)}</td>
                </tr>
              ))}
              {transactions.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-gray-500 border border-gray-200">Belum ada transaksi tercatat.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}