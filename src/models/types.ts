export interface Product {
  id: string;
  name: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
}

export interface CartItem extends Product {
  cartQty: number;
}

export interface TransactionItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  date: string;
  items: TransactionItem[];
  total: number;
  receiptNumber: string;
}

export const initialProducts: Product[] = [
  { id: 'P001', name: 'Filter Oli Excavator PC200', buyPrice: 150000, sellPrice: 200000, stock: 45 },
  { id: 'P002', name: 'V-Belt B-72', buyPrice: 75000, sellPrice: 110000, stock: 12 },
  { id: 'P003', name: 'Oli Mesin Diesel 15W-40 (Pail 20L)', buyPrice: 850000, sellPrice: 1050000, stock: 8 },
  { id: 'P004', name: 'Gigi Bucket Komatsu', buyPrice: 320000, sellPrice: 450000, stock: 0 },
  { id: 'P005', name: 'Water Pump Assy', buyPrice: 1250000, sellPrice: 1600000, stock: 5 },
];

export const initialTransactions: Transaction[] = [
  {
    id: 'T001',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    receiptNumber: 'INV-001',
    items: [{ productId: 'P001', name: 'Filter Oli Excavator PC200', qty: 5, price: 200000, subtotal: 1000000 }],
    total: 1000000
  }
];
