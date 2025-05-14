import React from 'react';

const UpcomingPaymentsList: React.FC = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const upcomingPayments = [
    {
      id: '1',
      customer: 'Jean Dupont',
      amount: 120000,
      dueDate: '2025-03-18',
      product: 'Téléviseur Samsung UA55NU7100',
      status: 'pending'
    },
    {
      id: '2',
      customer: 'Marie Diallo',
      amount: 85000,
      dueDate: '2025-03-20',
      product: 'Réfrigérateur Combiné SAMSUNG',
      status: 'pending'
    },
    {
      id: '3',
      customer: 'Robert Johnson',
      amount: 45000,
      dueDate: '2025-03-22',
      product: 'Machine à laver ASTECH 9Kg',
      status: 'pending'
    },
    {
      id: '4',
      customer: 'Mary Williams',
      amount: 230000,
      dueDate: '2025-03-25',
      product: 'Smart TV LG 88 pouces',
      status: 'pending'
    }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Produit
            </th>
            <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Montant
            </th>
            <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Échéance
            </th>
            <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {upcomingPayments.map((payment) => (
            <tr key={payment.id} className="hover:bg-gray-50">
              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {payment.customer}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                {payment.product}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatCurrency(payment.amount)}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(payment.dueDate).toLocaleDateString('fr-FR')}
              </td>
              <td className="px-3 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {payment.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpcomingPaymentsList;