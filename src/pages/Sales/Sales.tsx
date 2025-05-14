import React, { useState } from 'react';
import { Search, Plus, Filter, CreditCard, Calendar, User, CheckCircle, AlertTriangle, Ban, Phone, Mail, MapPin } from 'lucide-react';
import { Sale, PaymentPlan } from '../../types';
import SaleModal from './components/SaleModal';

const MOCK_CLIENTS = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    phone: '+221 77 123 45 67',
    address: 'Dakar, Sénégal'
  },
  {
    id: '2',
    name: 'Marie Diallo',
    email: 'marie.diallo@email.com',
    phone: '+221 76 234 56 78',
    address: 'Thiès, Sénégal'
  }
];

const MOCK_PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: '1',
    name: 'Plan Mensuel Standard',
    frequency: 'monthly',
    duration: 12,
    interestRate: 5
  },
  {
    id: '2',
    name: 'Plan Hebdomadaire Flexible',
    frequency: 'weekly',
    duration: 52,
    interestRate: 8
  },
  {
    id: '3',
    name: 'Plan Journalier Court',
    frequency: 'daily',
    duration: 90,
    interestRate: 10
  }
];

const MOCK_SALES: Sale[] = [
  {
    id: '1',
    productId: '13481',
    customerId: '1',
    initialAmount: 150000,
    totalAmount: 175000,
    remainingAmount: 100000,
    paymentPlanId: '1',
    startDate: new Date('2025-03-01'),
    endDate: new Date('2026-03-01'),
    status: 'active',
    createdAt: new Date('2025-03-01')
  },
  {
    id: '2',
    productId: '13553',
    customerId: '2',
    initialAmount: 200000,
    totalAmount: 240000,
    remainingAmount: 180000,
    paymentPlanId: '2',
    startDate: new Date('2025-02-15'),
    endDate: new Date('2026-02-15'),
    status: 'active',
    createdAt: new Date('2025-02-15')
  }
];

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>(MOCK_SALES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Sale['status']>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [expandedSales, setExpandedSales] = useState<Set<string>>(new Set());

  const toggleSaleExpansion = (saleId: string) => {
    const newExpanded = new Set(expandedSales);
    if (newExpanded.has(saleId)) {
      newExpanded.delete(saleId);
    } else {
      newExpanded.add(saleId);
    }
    setExpandedSales(newExpanded);
  };

  const filteredSales = sales.filter(sale => {
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    const client = MOCK_CLIENTS.find(c => c.id === sale.customerId);
    const matchesSearch = 
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client?.phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleAddSale = (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    const newSale: Sale = {
      ...saleData,
      id: String(Date.now()),
      createdAt: new Date()
    };
    setSales(prev => [newSale, ...prev]);
    setIsModalOpen(false);
  };

  const handleSaleAction = async (saleId: string, action: 'complete' | 'default' | 'reactivate') => {
    setIsLoading(prev => ({ ...prev, [saleId]: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSales(prev => prev.map(sale => {
        if (sale.id === saleId) {
          return {
            ...sale,
            status: action === 'complete' ? 'completed' :
                    action === 'default' ? 'defaulted' : 'active'
          };
        }
        return sale;
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, [saleId]: false }));
    }
  };

  const getStatusIcon = (status: Sale['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'defaulted':
        return <Ban className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: Sale['status']) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'completed':
        return 'Terminé';
      case 'defaulted':
        return 'En défaut';
      default:
        return status;
    }
  };

  const getStatusClass = (status: Sale['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'defaulted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Ventes</h1>
          <p className="text-gray-500">Gérez vos ventes et plans de paiement</p>
        </div>
        
        <button 
          onClick={() => {
            setSelectedSale(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:border-blue-800 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Vente
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Rechercher par client ou référence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | Sale['status'])}
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="completed">Terminé</option>
              <option value="defaulted">En défaut</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Référence
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan de Paiement
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.map((sale) => {
                const client = MOCK_CLIENTS.find(c => c.id === sale.customerId);
                const paymentPlan = MOCK_PAYMENT_PLANS.find(p => p.id === sale.paymentPlanId);
                const isExpanded = expandedSales.has(sale.id);

                return (
                  <React.Fragment key={sale.id}>
                    <tr 
                      className={`hover:bg-gray-50 cursor-pointer ${isExpanded ? 'bg-blue-50' : ''}`}
                      onClick={() => toggleSaleExpansion(sale.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {sale.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{client?.name}</div>
                            <div className="text-sm text-gray-500">{client?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(sale.totalAmount)}</div>
                        <div className="text-sm text-gray-500">
                          Restant: {formatCurrency(sale.remainingAmount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm text-gray-900">
                              {paymentPlan?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(sale.startDate).toLocaleDateString('fr-FR')} - {new Date(sale.endDate).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(sale.status)}
                          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(sale.status)}`}>
                            {getStatusText(sale.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          {sale.status === 'active' && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSaleAction(sale.id, 'complete');
                                }}
                                disabled={isLoading[sale.id]}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Terminer
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSaleAction(sale.id, 'default');
                                }}
                                disabled={isLoading[sale.id]}
                                className="text-red-600 hover:text-red-900"
                              >
                                Défaut
                              </button>
                            </>
                          )}
                          {sale.status === 'defaulted' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaleAction(sale.id, 'reactivate');
                              }}
                              disabled={isLoading[sale.id]}
                              className="text-green-600 hover:text-green-900"
                            >
                              Réactiver
                            </button>
                          )}
                          {isLoading[sale.id] && (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-gray-50">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-900">Informations Client</h4>
                              <div className="flex items-center text-sm text-gray-600">
                                <User className="h-4 w-4 mr-2" />
                                {client?.name}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="h-4 w-4 mr-2" />
                                {client?.email}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-4 w-4 mr-2" />
                                {client?.phone}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-4 w-4 mr-2" />
                                {client?.address}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-900">Détails du Plan</h4>
                              <div className="text-sm text-gray-600">
                                <strong>Plan:</strong> {paymentPlan?.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                <strong>Fréquence:</strong> {paymentPlan?.frequency}
                              </div>
                              <div className="text-sm text-gray-600">
                                <strong>Durée:</strong> {paymentPlan?.duration} paiements
                              </div>
                              <div className="text-sm text-gray-600">
                                <strong>Taux d'intérêt:</strong> {paymentPlan?.interestRate}%
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <SaleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSale(null);
        }}
        onSubmit={handleAddSale}
        paymentPlans={MOCK_PAYMENT_PLANS}
      />
    </div>
  );
};

export default Sales;