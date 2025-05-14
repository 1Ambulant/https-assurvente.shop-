import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Percent } from 'lucide-react';
import { Sale, PaymentPlan, PaymentFrequency } from '../../../types';

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sale: Omit<Sale, 'id' | 'createdAt'>) => void;
  paymentPlans: PaymentPlan[];
}

const FREQUENCY_OPTIONS: { value: PaymentFrequency; label: string }[] = [
  { value: 'daily', label: 'Quotidien' },
  { value: 'weekly', label: 'Hebdomadaire' },
  { value: 'biweekly', label: 'Bimensuel' },
  { value: 'monthly', label: 'Mensuel' },
  { value: 'bimonthly', label: 'Bimestriel' },
  { value: 'quarterly', label: 'Trimestriel' },
  { value: 'semiannual', label: 'Semestriel' },
  { value: 'annual', label: 'Annuel' }
];

const SaleModal: React.FC<SaleModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  paymentPlans
}) => {
  const [formData, setFormData] = useState({
    productId: '',
    customerId: '',
    initialAmount: '',
    totalAmount: '',
    remainingAmount: '',
    paymentPlanId: '',
    startDate: '',
    endDate: '',
    status: 'active' as const
  });

  const [customPlan, setCustomPlan] = useState({
    frequency: 'monthly' as PaymentFrequency,
    duration: 12,
    paymentType: 'fixed' as const,
    paymentValue: 0,
    initialPaymentRequired: true,
    initialPaymentValue: 20,
    gracePeriod: 3,
    lateFees: {
      type: 'percentage' as const,
      value: 5
    },
    specificDates: [] as string[]
  });

  const [useCustomPlan, setUseCustomPlan] = useState(false);
  const [useSpecificDates, setUseSpecificDates] = useState(false);

  const calculateEndDate = (startDate: string, frequency: PaymentFrequency, duration: number) => {
    if (!startDate) return '';
    
    const date = new Date(startDate);
    switch (frequency) {
      case 'daily':
        date.setDate(date.getDate() + duration);
        break;
      case 'weekly':
        date.setDate(date.getDate() + (duration * 7));
        break;
      case 'biweekly':
        date.setDate(date.getDate() + (duration * 14));
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + duration);
        break;
      case 'bimonthly':
        date.setMonth(date.getMonth() + (duration * 2));
        break;
      case 'quarterly':
        date.setMonth(date.getMonth() + (duration * 3));
        break;
      case 'semiannual':
        date.setMonth(date.getMonth() + (duration * 6));
        break;
      case 'annual':
        date.setFullYear(date.getFullYear() + duration);
        break;
    }
    return date.toISOString().split('T')[0];
  };

  const addPaymentDate = () => {
    const newDate = prompt('Entrez une date de paiement (YYYY-MM-DD):');
    if (newDate && isValidDate(newDate)) {
      setCustomPlan(prev => ({
        ...prev,
        specificDates: [...prev.specificDates, newDate].sort()
      }));
    }
  };

  const removePaymentDate = (dateToRemove: string) => {
    setCustomPlan(prev => ({
      ...prev,
      specificDates: prev.specificDates.filter(date => date !== dateToRemove)
    }));
  };

  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  useEffect(() => {
    if (!useSpecificDates && formData.startDate) {
      const endDate = calculateEndDate(
        formData.startDate,
        useCustomPlan ? customPlan.frequency : (paymentPlans.find(p => p.id === formData.paymentPlanId)?.frequency || 'monthly'),
        useCustomPlan ? customPlan.duration : (paymentPlans.find(p => p.id === formData.paymentPlanId)?.duration || 12)
      );
      setFormData(prev => ({ ...prev, endDate }));
    }
  }, [formData.startDate, formData.paymentPlanId, useCustomPlan, customPlan.frequency, customPlan.duration, useSpecificDates]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      initialAmount: Number(formData.initialAmount),
      totalAmount: Number(formData.totalAmount),
      remainingAmount: Number(formData.remainingAmount),
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate)
    });
    setFormData({
      productId: '',
      customerId: '',
      initialAmount: '',
      totalAmount: '',
      remainingAmount: '',
      paymentPlanId: '',
      startDate: '',
      endDate: '',
      status: 'active'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30"></div>
        
        <div className="relative bg-white rounded-lg w-full max-w-2xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Nouvelle Vente
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID Produit
                </label>
                <input
                  type="text"
                  required
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID Client
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  id="useCustomPlan"
                  checked={useCustomPlan}
                  onChange={(e) => {
                    setUseCustomPlan(e.target.checked);
                    if (!e.target.checked) {
                      setUseSpecificDates(false);
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="useCustomPlan" className="text-sm font-medium text-gray-700">
                  Utiliser un plan personnalisé
                </label>
              </div>

              {!useCustomPlan ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Plan de Paiement Prédéfini
                  </label>
                  <select
                    required
                    value={formData.paymentPlanId}
                    onChange={(e) => setFormData({ ...formData, paymentPlanId: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Sélectionner un plan</option>
                    {paymentPlans.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} ({plan.duration} paiements, {
                          plan.paymentType === 'fixed' 
                            ? `${plan.paymentValue} FCFA` 
                            : `${plan.paymentValue}%`
                        })
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id="useSpecificDates"
                      checked={useSpecificDates}
                      onChange={(e) => setUseSpecificDates(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="useSpecificDates" className="text-sm font-medium text-gray-700">
                      Utiliser des dates spécifiques
                    </label>
                  </div>

                  {useSpecificDates ? (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Dates de paiement
                          </label>
                          <button
                            type="button"
                            onClick={addPaymentDate}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            Ajouter une date
                          </button>
                        </div>
                        <div className="space-y-2">
                          {customPlan.specificDates.map(date => (
                            <div key={date} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span className="text-sm text-gray-700">{date}</span>
                              <button
                                type="button"
                                onClick={() => removePaymentDate(date)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Fréquence
                          </label>
                          <select
                            value={customPlan.frequency}
                            onChange={(e) => setCustomPlan({ 
                              ...customPlan, 
                              frequency: e.target.value as PaymentFrequency 
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          >
                            {FREQUENCY_OPTIONS.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Nombre de paiements
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={customPlan.duration}
                            onChange={(e) => setCustomPlan({ 
                              ...customPlan, 
                              duration: parseInt(e.target.value) 
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Type de paiement
                    </label>
                    <div className="mt-1 flex items-center space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="fixed"
                          checked={customPlan.paymentType === 'fixed'}
                          onChange={(e) => setCustomPlan({ 
                            ...customPlan, 
                            paymentType: e.target.value as 'fixed' | 'percentage' 
                          })}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">Montant fixe</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="percentage"
                          checked={customPlan.paymentType === 'percentage'}
                          onChange={(e) => setCustomPlan({ 
                            ...customPlan, 
                            paymentType: e.target.value as 'fixed' | 'percentage' 
                          })}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">Pourcentage</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {customPlan.paymentType === 'fixed' ? 'Montant par paiement' : 'Pourcentage par paiement'}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="number"
                        value={customPlan.paymentValue}
                        onChange={(e) => setCustomPlan({ 
                          ...customPlan, 
                          paymentValue: parseFloat(e.target.value) 
                        })}
                        className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="0.00"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <span className="h-full inline-flex items-center px-3 border-l border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                          {customPlan.paymentType === 'fixed' ? (
                            <DollarSign className="h-4 w-4" />
                          ) : (
                            <Percent className="h-4 w-4" />
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id="initialPaymentRequired"
                      checked={customPlan.initialPaymentRequired}
                      onChange={(e) => setCustomPlan({ 
                        ...customPlan, 
                        initialPaymentRequired: e.target.checked 
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="initialPaymentRequired" className="text-sm font-medium text-gray-700">
                      Paiement initial requis
                    </label>
                  </div>

                  {customPlan.initialPaymentRequired && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Valeur du paiement initial (%)
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={customPlan.initialPaymentValue}
                          onChange={(e) => setCustomPlan({ 
                            ...customPlan, 
                            initialPaymentValue: parseFloat(e.target.value) 
                          })}
                          className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          <span className="h-full inline-flex items-center px-3 border-l border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                            <Percent className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Période de grâce (jours)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={customPlan.gracePeriod}
                        onChange={(e) => setCustomPlan({ 
                          ...customPlan, 
                          gracePeriod: parseInt(e.target.value) 
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Pénalités de retard (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={customPlan.lateFees.value}
                        onChange={(e) => setCustomPlan({ 
                          ...customPlan, 
                          lateFees: {
                            ...customPlan.lateFees,
                            value: parseFloat(e.target.value)
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date de début
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date de fin {useSpecificDates ? '' : '(calculée)'}
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => useSpecificDates && setFormData({ ...formData, endDate: e.target.value })}
                      disabled={!useSpecificDates}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Montant Initial
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.initialAmount}
                    onChange={(e) => setFormData({ ...formData, initialAmount: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Montant Total
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Montant Restant
                </label>
                <input
                  type="number"
                  required
                  value={formData.remainingAmount}
                  onChange={(e) => setFormData({ ...formData, remainingAmount: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
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
                  Créer la Vente
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SaleModal;