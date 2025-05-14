import React, { useState } from 'react';
import { Search, Filter, Calendar, CreditCard, AlertTriangle, CheckCircle, Clock, ChevronDown, ChevronUp, User, DollarSign, Eye, ArrowRight, TrendingUp, ArrowUpRight, BarChart, Send, Ban, Download, FileText } from 'lucide-react';
import { Payment } from '../../types';

interface PaymentWithDetails extends Payment {
  customerName: string;
  productName: string;
}

const MOCK_PAYMENTS: PaymentWithDetails[] = [
  {
    id: '1',
    saleId: '1',
    amount: 120000,
    dueDate: new Date('2025-03-18'),
    status: 'pending',
    customerName: 'Jean Dupont',
    productName: 'Téléviseur Samsung UA55NU7100'
  },
  {
    id: '2',
    saleId: '2',
    amount: 85000,
    dueDate: new Date('2025-03-20'),
    paidDate: new Date('2025-03-19'),
    method: 'orange_money',
    status: 'paid',
    transactionId: 'OM123456789',
    customerName: 'Marie Diallo',
    productName: 'Smart TV LG 88 pouces'
  },
  {
    id: '3',
    saleId: '3',
    amount: 45000,
    dueDate: new Date('2025-03-01'),
    status: 'late',
    customerName: 'Robert Johnson',
    productName: 'Téléviseur Led TORNADO 55 pouces'
  }
];

const STATUS_COLORS = {
  paid: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    label: 'Payé'
  },
  pending: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    icon: <Clock className="w-5 h-5 text-blue-500" />,
    label: 'En attente'
  },
  late: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
    label: 'En retard'
  }
};

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<PaymentWithDetails[]>(MOCK_PAYMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Payment['status']>('all');
  const [expandedPayments, setExpandedPayments] = useState<Set<string>>(new Set());
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [selectedPayment, setSelectedPayment] = useState<PaymentWithDetails | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const togglePaymentExpansion = (paymentId: string) => {
    const newExpanded = new Set(expandedPayments);
    if (newExpanded.has(paymentId)) {
      newExpanded.delete(paymentId);
    } else {
      newExpanded.add(paymentId);
    }
    setExpandedPayments(newExpanded);
  };

  const handleAction = async (paymentId: string, action: 'mark-paid' | 'send-reminder' | 'download' | 'cancel') => {
    setIsLoading(prev => ({ ...prev, [paymentId]: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      switch (action) {
        case 'mark-paid':
          setPayments(prev => prev.map(payment => 
            payment.id === paymentId
              ? {
                  ...payment,
                  status: 'paid',
                  paidDate: new Date(),
                  method: 'cash'
                }
              : payment
          ));
          break;
      
        case 'send-reminder':
          alert('Rappel envoyé au client');
          break;
      
        case 'download':
          const payment = payments.find(p => p.id === paymentId);
          if (!payment) return;

          // Generate receipt content
          const receiptContent = `
REÇU DE PAIEMENT
---------------
N° de référence: ${payment.id}
Date: ${payment.paidDate?.toLocaleDateString('fr-FR')}
Client: ${payment.customerName}
Produit: ${payment.productName}
Montant: ${formatCurrency(payment.amount)}
Méthode: ${payment.method === 'orange_money' ? 'Orange Money' : 
          payment.method === 'wave' ? 'Wave' :
          payment.method === 'card' ? 'Carte bancaire' : 'Espèces'}
Status: Payé
        `;

          // Create blob and download
          const blob = new Blob([receiptContent], { type: 'text/plain' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `recu-${payment.id}.txt`);
          document.body.appendChild(link);
          link.click();
          link.parentNode?.removeChild(link);
          window.URL.revokeObjectURL(url);
          break;
      
        case 'cancel':
          if (window.confirm('Êtes-vous sûr de vouloir annuler ce paiement ?')) {
            setPayments(prev => prev.filter(p => p.id !== paymentId));
          }
          break;
      }
    } finally {
      setIsLoading(prev => ({ ...prev, [paymentId]: false }));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateStats = () => {
    const total = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const paid = payments.filter(p => p.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
    const pending = payments.filter(p => p.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0);
    const late = payments.filter(p => p.status === 'late').reduce((sum, payment) => sum + payment.amount, 0);

    return {
      total,
      paid,
      pending,
      late,
      paidCount: payments.filter(p => p.status === 'paid').length,
      pendingCount: payments.filter(p => p.status === 'pending').length,
      lateCount: payments.filter(p => p.status === 'late').length
    };
  };

  const stats = calculateStats();

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.productName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;

    let matchesDate = true;
    const today = new Date();
    const paymentDate = payment.dueDate;

    switch (dateFilter) {
      case 'today':
        matchesDate = paymentDate.toDateString() === today.toDateString();
        break;
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = paymentDate >= weekAgo && paymentDate <= today;
        break;
      case 'month':
        matchesDate = 
          paymentDate.getMonth() === today.getMonth() &&
          paymentDate.getFullYear() === today.getFullYear();
        break;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Paiements</h1>
        <p className="text-gray-500">Gérez et suivez tous les paiements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total des Paiements</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.total)}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-500">{payments.length} paiements</span>
            <span className="text-blue-600 font-medium">
              <ArrowUpRight className="h-4 w-4 inline" />
              +12.5%
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paiements Reçus</p>
              <p className="text-2xl font-semibold text-green-600">{formatCurrency(stats.paid)}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-500">{stats.paidCount} paiements</span>
            <span className="text-green-600 font-medium">
              <TrendingUp className="h-4 w-4 inline mr-1" />
              68%
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Attente</p>
              <p className="text-2xl font-semibold text-blue-600">{formatCurrency(stats.pending)}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-500">{stats.pendingCount} paiements</span>
            <span className="text-blue-600 font-medium">
              <ArrowRight className="h-4 w-4 inline mr-1" />
              24%
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Retard</p>
              <p className="text-2xl font-semibold text-red-600">{formatCurrency(stats.late)}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-500">{stats.lateCount} paiements</span>
            <span className="text-red-600 font-medium">
              <BarChart className="h-4 w-4 inline mr-1" />
              8%
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Rechercher par client ou produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | Payment['status'])}
            >
              <option value="all">Tous les statuts</option>
              <option value="paid">Payé</option>
              <option value="pending">En attente</option>
              <option value="late">En retard</option>
            </select>

            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as 'all' | 'today' | 'week' | 'month')}
            >
              <option value="all">Toutes les dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client & Produit
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'échéance
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <React.Fragment key={payment.id}>
                  <tr 
                    className={`hover:bg-gray-50 cursor-pointer ${expandedPayments.has(payment.id) ? 'bg-blue-50' : ''}`}
                    onClick={() => togglePaymentExpansion(payment.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{payment.customerName}</div>
                          <div className="text-sm text-gray-500">{payment.productName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</div>
                      {payment.method && (
                        <div className="text-sm text-gray-500">
                          via {payment.method === 'orange_money' ? 'Orange Money' : 
                               payment.method === 'wave' ? 'Wave' :
                               payment.method === 'card' ? 'Carte bancaire' : 'Espèces'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {payment.dueDate.toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      {payment.paidDate && (
                        <div className="text-sm text-gray-500 mt-1">
                          Payé le {payment.paidDate.toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {STATUS_COLORS[payment.status].icon}
                        <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[payment.status].bg} ${STATUS_COLORS[payment.status].text}`}>
                          {STATUS_COLORS[payment.status].label}
                        </span>
                      </div>
                      {payment.transactionId && (
                        <div className="text-sm text-gray-500 mt-1">
                          Réf: {payment.transactionId}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {payment.status === 'pending' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(payment.id, 'mark-paid');
                            }}
                            disabled={isLoading[payment.id]}
                            className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-md text-sm font-medium transition-colors duration-200"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Marquer payé
                          </button>
                        )}
                        
                        {payment.status === 'late' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(payment.id, 'send-reminder');
                            }}
                            disabled={isLoading[payment.id]}
                            className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-medium transition-colors duration-200"
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Rappel
                          </button>
                        )}
                        
                        {payment.status === 'paid' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(payment.id, 'download');
                            }}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md text-sm font-medium transition-colors duration-200"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Reçu
                          </button>
                        )}
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPayment(payment);
                            setShowDetailsModal(true);
                          }}
                          className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </button>
                        
                        {payment.status !== 'paid' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(payment.id, 'cancel');
                            }}
                            className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors duration-200"
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Annuler
                          </button>
                        )}
                        
                        {isLoading[payment.id] && (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedPayments.has(payment.id) && (
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Détails du paiement</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">ID Transaction</span>
                                <span className="font-medium">{payment.transactionId || '-'}</span>
                              </div>
                              {payment.paidDate && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Date de paiement</span>
                                  <span className="font-medium">
                                    {payment.paidDate.toLocaleDateString('fr-FR')}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">ID Vente</span>
                                <span className="font-medium">{payment.saleId}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Actions</h4>
                            <div className="space-x-2">
                              {payment.status === 'pending' && (
                                <button
                                  onClick={() => handleAction(payment.id, 'mark-paid')}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                                >
                                  Marquer comme payé
                                </button>
                              )}
                              {payment.status === 'late' && (
                                <button
                                  onClick={() => handleAction(payment.id, 'send-reminder')}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                                >
                                  Envoyer un rappel
                                </button>
                              )}
                              <button
                                onClick={() => setShowDetailsModal(true)}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                              >
                                Voir les détails
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface DownloadOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentWithDetails;
  onDownload: (format: 'pdf' | 'txt' | 'csv') => void;
}

const DownloadOptionsModal: React.FC<DownloadOptionsModalProps> = ({
  isOpen,
  onClose,
  payment,
  onDownload
}) => {
  if (!isOpen) return null;

  const downloadOptions = [
    { format: 'pdf', label: 'PDF', icon: <FileText className="h-5 w-5" /> },
    { format: 'txt', label: 'Texte', icon: <FileText className="h-5 w-5" /> },
    { format: 'csv', label: 'CSV', icon: <FileText className="h-5 w-5" /> }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg w-full max-w-md">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Télécharger le reçu
            </h3>
            
            <div className="space-y-4">
              {downloadOptions.map(({ format, label, icon }) => (
                <button
                  key={format}
                  onClick={() => onDownload(format as 'pdf' | 'txt' | 'csv')}
                  className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    {icon}
                    <span className="ml-3">{label}</span>
                  </div>
                  <Download className="h-5 w-5 text-gray-400" />
                </button>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;