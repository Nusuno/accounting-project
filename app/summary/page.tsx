'use client';
import { useEffect, useState } from 'react';

type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  createdAt: string;
};

export default function SummaryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetch('/api/transactions')
      .then((res) => res.json())
      .then(setTransactions);
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-4">สรุปรายการเดือนนี้</h1>

      <div className="grid grid-cols-2 gap-4 text-white text-center mb-6">
        <div className="bg-green-500 rounded-lg p-4">
          <p className="text-lg">รายรับ</p>
          <p className="text-2xl font-bold">฿{totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-red-500 rounded-lg p-4">
          <p className="text-lg">รายจ่าย</p>
          <p className="text-2xl font-bold">฿{totalExpense.toFixed(2)}</p>
        </div>
      </div>

      <ul className="space-y-3">
        {transactions.map((t) => (
          <li key={t.id} className="bg-white rounded shadow p-4">
            <p className="font-semibold">{t.title} ({t.category})</p>
            <p className={t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}>
              {t.type === 'INCOME' ? '+' : '-'}฿{t.amount.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">{new Date(t.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
