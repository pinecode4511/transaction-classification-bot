'use client';

import { find_industry } from '@/actions/quickbooks';
import { getSession } from 'next-auth/react';
import { use, useEffect, useState } from 'react';
import prisma from '@/lib/db';

const formatPrice = (price: number) => {
  return price.toLocaleString('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function Home() {
  const [purchases, setPurchases] = useState<any>([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch('/api/quickbooks/test', {});
        if (!response.ok) {
          throw new Error('Failed to fetch purchases');
        }
        const data = await response.json();
        setPurchases(data);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      }
    };
    const updateIndustry = async () => {
      const industry = await find_industry();
      const session = await getSession();
      const email = session?.user?.email;

      if (email) {
        try {
          const response = await fetch('/api/update-industry', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ industry, email }),
          });

          if (!response.ok) {
            throw new Error('Failed to update industry');
          }

          const result = await response.json();
          console.log(result.message);
        } catch (error) {
          console.error('Error updating industry:', error);
        }
      } else {
        console.error('No user email found in session');
      }
    };
    fetchPurchases();
    updateIndustry();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">My Expenses</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-300 px-4 py-2 text-white">
                Date
              </th>
              <th className="border border-gray-300 px-4 py-2 text-white">
                No.
              </th>
              <th className="border border-gray-300 px-4 py-2 text-white">
                Payee
              </th>
              <th className="border border-gray-300 px-4 py-2 text-white">
                Category
              </th>
              <th className="border border-gray-300 px-4 py-2 text-white">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase: any, index: number) => (
              <tr key={index} className="border border-gray-300">
                <td className="border border-gray-300 px-4 py-2">
                  {purchase.TxnDate}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {purchase.DocNumber}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {purchase.EntityRef?.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {purchase.Line.map((lineItem: any, index: number) => (
                    <span key={index}>
                      {lineItem.AccountBasedExpenseLineDetail?.AccountRef
                        .name ||
                        lineItem.ItemBasedExpenseLineDetail?.ItemRef.name}
                      {index < purchase.Line.length - 1 && ', '}
                    </span>
                  ))}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {formatPrice(purchase.TotalAmt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
