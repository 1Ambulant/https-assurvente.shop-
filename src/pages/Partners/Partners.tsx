import React, { useState } from 'react';
import { Search, Plus, Filter, User, Mail, Phone, MapPin, Settings, X, DollarSign, Percent } from 'lucide-react';
import { Partner } from '../../types';
import { useUser } from '../../contexts/UserContext';
import PartnerModal from './components/PartnerModal';

const MOCK_PARTNERS: Partner[] = [
  {
    id: '1',
    name: 'Entreprise ABC',
    email: 'contact@abc.com',
    phone: '+221 77 123 45 67',
    address: 'Dakar, Sénégal',
    commission: {
      type: 'percentage',
      value: 10
    },
    createdAt: new Date('2025-01-15'),
    permissions: {
      canViewCustomers: true,
      canManageCustomers: true,
      canViewSales: true,
      canManageSales: true,
      canViewPayments: true,
      canManagePayments: false,
      canViewReports: true,
      canAccessRemoteControl: true,
      canAccessGeolocation: true
    }
  },
  {
    id: '2',
    name: 'XYZ Solutions',
    email: 'contact@xyz.com',
    phone: '+221 76 234 56 78',
    address: 'Thiès, Sénégal',
    commission: {
      type: 'fixed',
      value: 50000,
      minAmount: 200000,
      maxAmount: 1000000
    },
    createdAt: new Date('2025-02-01'),
    permissions: {
      canViewCustomers: true,
      canManageCustomers: false,
      canViewSales: true,
      canManageSales: true,
      canViewPayments: true,
      canManagePayments: false,
      canViewReports: true,
      canAccessRemoteControl: true,
      canAccessGeolocation: true
    }
  }
];

const Partners: React.FC = () => {
  const { hasPermission } = useUser();
  const [partners, setPartners] = useState<Partner[]>(MOCK_PARTNERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const filteredPartners = partners.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.phone.includes(searchTerm)
  );

  const getCommissionIcon = (type: 'percentage' | 'fixed') => {
    if (type === 'percentage') {
      return (
        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-100">
          <Percent className="h-4 w-4 text-purple-600" />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100">
        <DollarSign className="h-4 w-4 text-green-600" />
      </div>
    );
  };

  const formatCommission = (commission: Partner['commission']) => {
    const formatter = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    });

    if (commission.type === 'percentage') {
      return (
        <div className="flex items-center space-x-2">
          {getCommissionIcon('percentage')}
          <span className="text-purple-600 font-medium">{commission.value}%</span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        {getCommissionIcon('fixed')}
        <div>
          <span className="text-green-600 font-medium">{formatter.format(commission.value)}</span>
          {commission.minAmount && commission.maxAmount && (
            <div className="text-xs text-gray-500">
              Pour ventes entre {formatter.format(commission.minAmount)} et {formatter.format(commission.maxAmount)}
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleAddPartner = (partnerData: Omit<Partner, 'id' | 'createdAt'>) => {
    const newPartner: Partner = {
      ...partnerData,
      id: String(Date.now()),
      createdAt: new Date()
    };
    setPartners(prev => [newPartner, ...prev]);
    setIsModalOpen(false);
  };

  const handleEditPartner = (partnerData: Omit<Partner, 'id' | 'createdAt'>) => {
    if (!selectedPartner) return;
    
    setPartners(prev => prev.map(partner => 
      partner.id === selectedPartner.id 
        ? { ...partner, ...partnerData }
        : partner
    ));
    setIsModalOpen(false);
    setSelectedPartner(null);
  };

  const handleDeletePartner = (partnerId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) {
      setPartners(prev => prev.filter(partner => partner.id !== partnerId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Partenaires</h1>
          <p className="text-gray-500">Gérez vos partenaires et leurs accès</p>
        </div>
        
        {hasPermission('admin') && (
          <button 
            onClick={() => {
              setModalMode('add');
              setSelectedPartner(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un partenaire
          </button>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Rechercher des partenaires..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredPartners.map(partner => (
            <div 
              key={partner.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xl font-semibold text-blue-600">
                        {partner.name.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{partner.name}</h3>
                      <div className="mt-1">
                        {formatCommission(partner.commission)}
                      </div>
                    </div>
                  </div>
                  {hasPermission('admin') && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedPartner(partner);
                          setModalMode('edit');
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-500"
                      >
                        <Settings className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeletePartner(partner.id)}
                        className="p-2 text-red-400 hover:text-red-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-4 w-4 mr-2" />
                    {partner.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="h-4 w-4 mr-2" />
                    {partner.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    {partner.address}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Permissions</h4>
                  <div className="space-y-2">
                    {Object.entries(partner.permissions).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {value ? 'Oui' : 'Non'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PartnerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPartner(null);
        }}
        onSubmit={modalMode === 'add' ? handleAddPartner : handleEditPartner}
        partner={selectedPartner}
        mode={modalMode}
      />
    </div>
  );
};

export default Partners;