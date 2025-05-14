import React, { useState } from 'react';
import { Search, Signal, Lock, Unlock, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, User, Power, Settings, MapPin, Calendar } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Device {
  id: string;
  name: string;
  status: 'online' | 'offline';
  locked: boolean;
  lastPing: Date;
  batteryLevel: number;
  signalStrength: number;
  location: {
    latitude: number;
    longitude: number;
    lastUpdate: Date;
  };
  settings: {
    powerSavingMode: boolean;
    autoLockEnabled: boolean;
    notificationsEnabled: boolean;
  };
  clientId: string;
  purchaseDate: Date;
  warrantyEnd: Date;
}

const MOCK_CLIENTS: Client[] = [
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

const MOCK_DEVICES: Device[] = [
  {
    id: '1',
    name: 'Téléviseur Samsung UA55NU7100',
    status: 'online',
    locked: false,
    lastPing: new Date(),
    batteryLevel: 85,
    signalStrength: 90,
    location: {
      latitude: 14.7167,
      longitude: -17.4677,
      lastUpdate: new Date()
    },
    settings: {
      powerSavingMode: true,
      autoLockEnabled: true,
      notificationsEnabled: true
    },
    clientId: '1',
    purchaseDate: new Date('2025-01-15'),
    warrantyEnd: new Date('2027-01-15')
  },
  {
    id: '2',
    name: 'Téléviseur LG 88 pouces',
    status: 'offline',
    locked: true,
    lastPing: new Date(Date.now() - 86400000), // 24 hours ago
    batteryLevel: 20,
    signalStrength: 45,
    location: {
      latitude: 14.7645,
      longitude: -17.3660,
      lastUpdate: new Date(Date.now() - 3600000)
    },
    settings: {
      powerSavingMode: false,
      autoLockEnabled: true,
      notificationsEnabled: true
    },
    clientId: '1',
    purchaseDate: new Date('2025-02-01'),
    warrantyEnd: new Date('2027-02-01')
  },
  {
    id: '3',
    name: 'Smart TV Sony 65"',
    status: 'online',
    locked: false,
    lastPing: new Date(),
    batteryLevel: 95,
    signalStrength: 98,
    location: {
      latitude: 14.7500,
      longitude: -17.4500,
      lastUpdate: new Date()
    },
    settings: {
      powerSavingMode: true,
      autoLockEnabled: false,
      notificationsEnabled: true
    },
    clientId: '2',
    purchaseDate: new Date('2025-02-15'),
    warrantyEnd: new Date('2027-02-15')
  }
];

const RemoteControl: React.FC = () => {
  const { hasPermission } = useUser();
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');

  const toggleClient = (clientId: string) => {
    setExpandedClients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(clientId)) {
        newSet.delete(clientId);
      } else {
        newSet.add(clientId);
      }
      return newSet;
    });
  };

  const handlePowerControl = async (deviceId: string) => {
    setIsLoading(prev => ({ ...prev, [deviceId]: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, status: device.status === 'online' ? 'offline' : 'online' }
          : device
      ));
    } finally {
      setIsLoading(prev => ({ ...prev, [deviceId]: false }));
    }
  };

  const handleToggleLock = async (deviceId: string) => {
    setIsLoading(prev => ({ ...prev, [deviceId]: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, locked: !device.locked }
          : device
      ));
    } finally {
      setIsLoading(prev => ({ ...prev, [deviceId]: false }));
    }
  };

  const handleSettingChange = async (deviceId: string, setting: keyof Device['settings']) => {
    setIsLoading(prev => ({ ...prev, [deviceId]: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? {
              ...device,
              settings: {
                ...device.settings,
                [setting]: !device.settings[setting]
              }
            }
          : device
      ));
    } finally {
      setIsLoading(prev => ({ ...prev, [deviceId]: false }));
    }
  };

  const formatLastPing = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours} heure${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'À l\'instant';
  };

  const getSignalStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-green-500';
    if (strength >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getBatteryLevelColor = (level: number) => {
    if (level >= 60) return 'text-green-500';
    if (level >= 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const devicesByClient = MOCK_CLIENTS.map(client => ({
    ...client,
    devices: filteredDevices.filter(device => device.clientId === client.id)
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Contrôle à Distance</h1>
        <p className="text-gray-500">Gérez et contrôlez les appareils de vos clients à distance</p>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Rechercher un appareil..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="block w-full md:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'online' | 'offline')}
          >
            <option value="all">Tous les statuts</option>
            <option value="online">En ligne</option>
            <option value="offline">Hors ligne</option>
          </select>
        </div>

        <div className="divide-y divide-gray-200">
          {devicesByClient.map(client => (
            <div key={client.id} className="p-4">
              <button
                onClick={() => toggleClient(client.id)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-500">{client.email}</p>
                  </div>
                </div>
                {expandedClients.has(client.id) ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {expandedClients.has(client.id) && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {client.devices.map(device => (
                    <div 
                      key={device.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{device.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          device.status === 'online' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <Signal className="w-3 h-3 mr-1" />
                          {device.status === 'online' ? 'En ligne' : 'Hors ligne'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Signal</span>
                            <span className={`text-xs font-medium ${getSignalStrengthColor(device.signalStrength)}`}>
                              {device.signalStrength}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Batterie</span>
                            <span className={`text-xs font-medium ${getBatteryLevelColor(device.batteryLevel)}`}>
                              {device.batteryLevel}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Dernier ping</span>
                            <span className="text-xs text-gray-700">
                              {formatLastPing(device.lastPing)}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Verrouillage</span>
                            <span className={`text-xs font-medium ${device.locked ? 'text-red-600' : 'text-green-600'}`}>
                              {device.locked ? 'Verrouillé' : 'Déverrouillé'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Mode éco</span>
                            <span className={`text-xs font-medium ${device.settings.powerSavingMode ? 'text-green-600' : 'text-gray-600'}`}>
                              {device.settings.powerSavingMode ? 'Activé' : 'Désactivé'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Auto-lock</span>
                            <span className={`text-xs font-medium ${device.settings.autoLockEnabled ? 'text-blue-600' : 'text-gray-600'}`}>
                              {device.settings.autoLockEnabled ? 'Activé' : 'Désactivé'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handlePowerControl(device.id)}
                          disabled={isLoading[device.id]}
                          className={`flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium ${
                            device.status === 'online'
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isLoading[device.id] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          ) : (
                            <>
                              <Power className="w-4 h-4 mr-2" />
                              {device.status === 'online' ? 'Éteindre' : 'Allumer'}
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleToggleLock(device.id)}
                          disabled={isLoading[device.id]}
                          className={`flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium ${
                            device.locked
                              ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isLoading[device.id] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          ) : (
                            <>
                              {device.locked ? (
                                <>
                                  <Lock className="w-4 h-4 mr-2" />
                                  Verrouillé
                                </>
                              ) : (
                                <>
                                  <Unlock className="w-4 h-4 mr-2" />
                                  Déverrouillé
                                </>
                              )}
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleSettingChange(device.id, 'powerSavingMode')}
                          className="flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Réglages
                        </button>
                      </div>

                      <div className="pt-4 space-y-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="w-4 h-4 mr-1" />
                          Dernière position: {device.location.latitude.toFixed(4)}, {device.location.longitude.toFixed(4)}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          Garantie jusqu'au {device.warrantyEnd.toLocaleDateString('fr-FR')}
                        </div>
                      </div>

                      {device.status === 'offline' && (
                        <div className="p-3 bg-yellow-50 rounded-md">
                          <div className="flex">
                            <AlertTriangle className="h-5 w-5 text-yellow-400" />
                            <div className="ml-3">
                              <p className="text-sm text-yellow-700">
                                L'appareil n'est pas connecté. Certaines fonctionnalités peuvent être limitées.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {client.devices.length === 0 && (
                    <div className="col-span-full p-4 text-center text-gray-500">
                      Aucun appareil trouvé pour ce client avec les filtres actuels.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RemoteControl;