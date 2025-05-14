import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard, ShoppingCart, Users, CreditCard, Banknote, Settings, Map, Power, Building, HelpCircle, Mail, Phone, Send } from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userRole: UserRole;
}

interface TicketFormData {
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  type: 'technical' | 'billing' | 'general';
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, userRole }) => {
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketForm, setTicketForm] = useState<TicketFormData>({
    subject: '',
    message: '',
    priority: 'medium',
    type: 'general'
  });

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const navigationItems = [
    { name: 'Tableau de bord', icon: <LayoutDashboard className="h-5 w-5" />, to: '/dashboard', roles: ['admin', 'partner', 'customer'] },
    { name: 'Produits', icon: <ShoppingCart className="h-5 w-5" />, to: '/products', roles: ['admin', 'partner', 'customer'] },
    { name: 'Clients', icon: <Users className="h-5 w-5" />, to: '/customers', roles: ['admin', 'partner'] },
    { name: 'Ventes', icon: <CreditCard className="h-5 w-5" />, to: '/sales', roles: ['admin', 'partner'] },
    { name: 'Paiements', icon: <Banknote className="h-5 w-5" />, to: '/payments', roles: ['admin', 'partner', 'customer'] },
    { name: 'Partenaires', icon: <Building className="h-5 w-5" />, to: '/partners', roles: ['admin'] },
    { name: 'Contrôle à distance', icon: <Power className="h-5 w-5" />, to: '/remote-control', roles: ['admin', 'partner'] },
    { name: 'Géolocalisation', icon: <Map className="h-5 w-5" />, to: '/geolocation', roles: ['admin', 'partner'] },
    { name: 'Paramètres', icon: <Settings className="h-5 w-5" />, to: '/settings', roles: ['admin'] }
  ];

  const phoneNumbers = [
    { number: '76 637 80 95', primary: true },
    { number: '78 437 07 07', primary: false },
    { number: '70 338 01 40', primary: false }
  ];

  const filteredNavItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form and close modal
      setTicketForm({
        subject: '',
        message: '',
        priority: 'medium',
        type: 'general'
      });
      setShowTicketModal(false);
      
      // Show success message
      alert('Votre ticket a été créé avec succès. Notre équipe vous contactera dans les plus brefs délais.');
    } catch (error) {
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition duration-300 ease-in-out md:translate-x-0 md:relative ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-blue-600">secursales.shop</span>
          <button 
            className="md:hidden"
            onClick={closeSidebar}
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <nav className="px-3 pt-4 flex flex-col h-[calc(100%-4rem)] overflow-y-auto">
          <div className="space-y-1">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    closeSidebar();
                  }
                }}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="mt-auto mb-6">
            <div className="bg-blue-50 rounded-lg overflow-hidden">
              <div className="p-4 bg-blue-600">
                <div className="flex items-center">
                  <HelpCircle className="h-6 w-6 text-white" />
                  <h3 className="ml-2 text-lg font-medium text-white">Besoin d'aide ?</h3>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <p className="text-sm text-blue-900">
                  Notre équipe de support est disponible 24/7 pour vous aider avec vos questions.
                </p>
                <div className="space-y-3">
                  <a 
                    href="mailto:ambulantenligne@gmail.com" 
                    className="flex items-center text-sm text-blue-700 hover:text-blue-800"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    ambulantenligne@gmail.com
                  </a>
                  {phoneNumbers.map((phone, index) => (
                    <a 
                      key={phone.number}
                      href={`tel:+221${phone.number.replace(/\s/g, '')}`}
                      className={`flex items-center text-sm ${
                        phone.primary 
                          ? 'text-blue-700 hover:text-blue-800 font-medium'
                          : 'text-gray-600 hover:text-gray-700'
                      }`}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {phone.number}
                      {phone.primary && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Principal
                        </span>
                      )}
                    </a>
                  ))}
                </div>
                <button
                  onClick={() => setShowTicketModal(true)}
                  className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Ouvrir un ticket
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-30"></div>
            
            <div className="relative bg-white rounded-lg w-full max-w-md">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Ouvrir un ticket</h2>
                <button
                  onClick={() => setShowTicketModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitTicket} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sujet
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Ex: Problème de paiement"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type de problème
                  </label>
                  <select
                    required
                    value={ticketForm.type}
                    onChange={(e) => setTicketForm({ ...ticketForm, type: e.target.value as TicketFormData['type'] })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="technical">Technique</option>
                    <option value="billing">Facturation</option>
                    <option value="general">Général</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Priorité
                  </label>
                  <select
                    required
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value as TicketFormData['priority'] })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Décrivez votre problème en détail..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTicketModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;