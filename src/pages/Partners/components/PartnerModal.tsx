import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Partner } from '../../../types';

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (partner: Omit<Partner, 'id' | 'createdAt'>) => void;
  partner?: Partner;
  mode: 'add' | 'edit';
}

const PartnerModal: React.FC<PartnerModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  partner,
  mode 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    commission: {
      type: 'percentage' as const,
      value: 10,
      minAmount: undefined as number | undefined,
      maxAmount: undefined as number | undefined
    },
    permissions: {
      canViewCustomers: true,
      canManageCustomers: false,
      canViewSales: true,
      canManageSales: false,
      canViewPayments: true,
      canManagePayments: false,
      canViewReports: true,
      canAccessRemoteControl: true,
      canAccessGeolocation: true
    }
  });

  useEffect(() => {
    if (partner && mode === 'edit') {
      setFormData({
        name: partner.name,
        email: partner.email,
        phone: partner.phone,
        address: partner.address,
        commission: partner.commission,
        permissions: partner.permissions
      });
    }
  }, [partner, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      commission: {
        type: 'percentage',
        value: 10,
        minAmount: undefined,
        maxAmount: undefined
      },
      permissions: {
        canViewCustomers: true,
        canManageCustomers: false,
        canViewSales: true,
        canManageSales: false,
        canViewPayments: true,
        canManagePayments: false,
        canViewReports: true,
        canAccessRemoteControl: true,
        canAccessGeolocation: true
      }
    });
  };

  const handlePermissionChange = (permission: keyof Partner['permissions']) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30"></div>
        
        <div className="relative bg-white rounded-lg w-full max-w-md">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'add' ? 'Ajouter un Partenaire' : 'Modifier le Partenaire'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom de l'entreprise
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Adresse
                </label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de commission
                </label>
                <div className="flex items-center space-x-4 mb-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={formData.commission.type === 'percentage'}
                      onChange={() => setFormData({
                        ...formData,
                        commission: {
                          type: 'percentage',
                          value: 10
                        }
                      })}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Pourcentage</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={formData.commission.type === 'fixed'}
                      onChange={() => setFormData({
                        ...formData,
                        commission: {
                          type: 'fixed',
                          value: 50000,
                          minAmount: 200000,
                          maxAmount: 1000000
                        }
                      })}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Montant fixe</span>
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {formData.commission.type === 'percentage' ? 'Pourcentage (%)' : 'Montant (FCFA)'}
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max={formData.commission.type === 'percentage' ? "100" : undefined}
                      value={formData.commission.value}
                      onChange={(e) => setFormData({
                        ...formData,
                        commission: {
                          ...formData.commission,
                          value: Number(e.target.value)
                        }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  {formData.commission.type === 'fixed' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Montant minimum de vente (FCFA)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.commission.minAmount || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            commission: {
                              ...formData.commission,
                              minAmount: Number(e.target.value) || undefined
                            }
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Montant maximum de vente (FCFA)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.commission.maxAmount || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            commission: {
                              ...formData.commission,
                              maxAmount: Number(e.target.value) || undefined
                            }
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Permissions</h3>
                <div className="space-y-2">
                  {Object.entries(formData.permissions).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={key}
                        checked={value}
                        onChange={() => handlePermissionChange(key as keyof Partner['permissions'])}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={key} className="ml-2 block text-sm text-gray-900">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {mode === 'add' ? 'Ajouter' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PartnerModal;