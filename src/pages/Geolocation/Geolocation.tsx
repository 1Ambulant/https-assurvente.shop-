import React, { useState } from 'react';
import { MapPin, Search, Filter, AlertTriangle, Signal } from 'lucide-react';

interface DeviceLocation {
  id: string;
  name: string;
  status: 'online' | 'offline';
  lastUpdate: Date;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

const MOCK_DEVICES: DeviceLocation[] = [
  {
    id: '1',
    name: 'Téléviseur Samsung UA55NU7100',
    status: 'online',
    lastUpdate: new Date(),
    location: {
      latitude: 14.7167,
      longitude: -17.4677,
      address: 'Rue 10, Dakar, Sénégal'
    }
  },
  {
    id: '2',
    name: 'Téléviseur LG 88 pouces',
    status: 'online',
    lastUpdate: new Date(Date.now() - 3600000), // 1 hour ago
    location: {
      latitude: 14.7645,
      longitude: -17.3660,
      address: 'Avenue Cheikh Anta Diop, Dakar, Sénégal'
    }
  }
];

const Geolocation: React.FC = () => {
  const [devices, setDevices] = useState<DeviceLocation[]>(MOCK_DEVICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');

  const filteredDevices = devices.filter(device => {
    const matchesSearch = 
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatLastUpdate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours} heure${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'À l\'instant';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Géolocalisation</h1>
        <p className="text-gray-500">Suivez la localisation de vos appareils en temps réel</p>
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
              placeholder="Rechercher par nom ou adresse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'online' | 'offline')}
            >
              <option value="all">Tous les statuts</option>
              <option value="online">En ligne</option>
              <option value="offline">Hors ligne</option>
            </select>
            
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Filter className="h-4 w-4 mr-2" />
              Filtrer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredDevices.map(device => (
            <div 
              key={device.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{device.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    device.status === 'online' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <Signal className="w-3 h-3 mr-1" />
                    {device.status === 'online' ? 'En ligne' : 'Hors ligne'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Dernière mise à jour: {formatLastUpdate(device.lastUpdate)}
                </p>
              </div>

              <div className="p-4 bg-gray-50">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Localisation actuelle</h4>
                    <p className="text-sm text-gray-500">{device.location.address}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {device.location.latitude.toFixed(4)}, {device.location.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>

                {device.status === 'offline' && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          La localisation peut ne pas être à jour car l'appareil est hors ligne.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Geolocation;