import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, AlertTriangle, Users, Truck, CreditCard, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import SalesChart from './components/SalesChart';
import PaymentStatusChart from './components/PaymentStatusChart';
import RecentSalesList from './components/RecentSalesList';
import UpcomingPaymentsList from './components/UpcomingPaymentsList';

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Tableau de bord</h1>
          <p className="text-gray-500">Bienvenue, {user?.name}</p>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="day">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="Ventes Totales" 
          value={formatCurrency(24780000)}
          change="+12.5%" 
          isPositive={true}
          icon={<DollarSign className="h-8 w-8 text-blue-500" />}
          details={[
            { label: 'Moyenne journalière', value: formatCurrency(826000) },
            { label: 'Objectif mensuel', value: '85%' }
          ]}
        />
        <DashboardCard 
          title="Prêts Actifs" 
          value="42" 
          change="+8.1%" 
          isPositive={true}
          icon={<CreditCard className="h-8 w-8 text-green-500" />}
          details={[
            { label: 'Taux de remboursement', value: '95%' },
            { label: 'Montant total', value: formatCurrency(15350000) }
          ]}
        />
        <DashboardCard 
          title="Paiements en Retard" 
          value="7" 
          change="-2.3%" 
          isPositive={true}
          icon={<AlertTriangle className="h-8 w-8 text-orange-500" />}
          details={[
            { label: 'Montant total', value: formatCurrency(2450000) },
            { label: 'Délai moyen', value: '15 jours' }
          ]}
        />
        <DashboardCard 
          title="Clients Actifs" 
          value="125" 
          change="+5.4%" 
          isPositive={true}
          icon={<Users className="h-8 w-8 text-purple-500" />}
          details={[
            { label: 'Nouveaux ce mois', value: '12' },
            { label: 'Taux de fidélisation', value: '92%' }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-800">Aperçu des Ventes</h2>
              <div className="flex items-center space-x-2">
                <span className="flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +15.3%
                </span>
              </div>
            </div>
            <SalesChart />
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Objectif mensuel: {formatCurrency(35000000)}</span>
              <span className="font-medium text-green-600">75% atteint</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-800">État des Paiements</h2>
              <div className="flex items-center space-x-2">
                <span className="flex items-center text-sm text-red-600">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -2.4%
                </span>
              </div>
            </div>
            <PaymentStatusChart />
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Taux de recouvrement global</span>
              <span className="font-medium text-blue-600">92.5%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-800">Ventes Récentes</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                Voir tout
              </button>
            </div>
            <RecentSalesList />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-800">Paiements à Venir</h2>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Prochains 7 jours</span>
              </div>
            </div>
            <UpcomingPaymentsList />
          </div>
        </div>
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  details: Array<{ label: string; value: string }>;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  change, 
  isPositive, 
  icon,
  details
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 transform transition-transform duration-300 hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-gray-50 p-3 rounded-full">{icon}</div>
        <span className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          {change}
        </span>
      </div>
      
      <h3 className="text-gray-500 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-semibold mb-4">{value}</p>
      
      <div className="space-y-2 pt-2 border-t border-gray-100">
        {details.map((detail, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-500">{detail.label}</span>
            <span className="font-medium text-gray-900">{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;