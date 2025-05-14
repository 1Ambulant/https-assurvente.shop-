import React from 'react';

const RecentSalesList: React.FC = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const recentSales = [
    {
      id: '1',
      product: 'Téléviseur Samsung UA55NU7100',
      customer: 'Jean Dupont',
      date: '2025-03-12',
      amount: 575000,
      status: 'active'
    },
    {
      id: '2',
      product: 'Réfrigérateur Combiné SAMSUNG',
      customer: 'Marie Diallo',
      date: '2025-03-10',
      amount: 435000,
      status: 'active'
    },
    {
      id: '3',
      product: 'Machine à laver ASTECH 9Kg',
      customer: 'Robert Johnson',
      date: '2025-03-08',
      amount: 217500,
      status: 'active'
    },
    {
      id: '4',
      product: 'Smart TV LG 88 pouces',
      customer: 'Mary Williams',
      date: '2025-03-05',
      amount: 1535000,
      status: 'active'
    }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Produit
            </th>
            <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Montant
            </th>
            <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {recentSales.map((sale) => (
            <tr key={sale.id} className="hover:bg-gray-50">
              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {sale.product}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                {sale.customer}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(sale.date).toLocaleDateString('fr-FR')}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatCurrency(sale.amount)}
              </td>
              <td className="px-3 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {sale.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentSalesList;