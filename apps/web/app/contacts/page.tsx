'use client';

import { useState, useMemo } from 'react';
import { Client, ClientType, seedClients } from './_types';
import { NewClientModal } from './_components/NewClientModal';
import { ClientTable } from './_components/ClientTable';
import { ClientDrawer } from './_components/ClientDrawer';

export default function ContactsPage() {
  const [clients, setClients] = useState<Client[]>(seedClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<ClientType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = useMemo(() => {
    let filtered = clients;

    // Apply type filter
    if (typeFilter !== 'All') {
      filtered = filtered.filter(client => client.type === typeFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(lowercaseQuery) ||
        (client.email && client.email.toLowerCase().includes(lowercaseQuery)) ||
        (client.phone && client.phone.toLowerCase().includes(lowercaseQuery)) ||
        (client.contactPerson && client.contactPerson.toLowerCase().includes(lowercaseQuery))
      );
    }

    return filtered;
  }, [clients, typeFilter, searchQuery]);

  const handleAddClient = (clientData: {
    type: ClientType;
    name: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    altPhone?: string;
    address1?: string;
    city?: string;
    state?: string;
    pincode?: string;
    pan?: string;
    gstin?: string;
    notes?: string;
  }) => {
    if (editingClient) {
      // Update existing client
      setClients(prev =>
        prev.map(client =>
          client.id === editingClient.id
            ? { ...client, ...clientData }
            : client
        )
      );
    } else {
      // Add new client
      const newClient: Client = {
        ...clientData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setClients(prev => [...prev, newClient]);
    }
    setEditingClient(null);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(prev => prev.filter(client => client.id !== clientId));
  };

  const handleViewClient = (client: Client) => {
    setViewingClient(client);
    setIsDrawerOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setViewingClient(null);
  };

  const handleNewClient = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-2">
            Manage your clients and their information
          </p>
        </div>
        <button
          onClick={handleNewClient}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          aria-label="Add new client"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Client
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">
              Search clients
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name, email, or phone..."
              />
            </div>
          </div>
          <div className="sm:w-48">
            <label htmlFor="type-filter" className="sr-only">
              Filter by client type
            </label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ClientType | 'All')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Individual">Individual</option>
              <option value="Company">Company</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Clients ({filteredClients.length})
          </h2>
          {filteredClients.length !== clients.length && (
            <p className="text-sm text-gray-500">
              Showing {filteredClients.length} of {clients.length} clients
            </p>
          )}
        </div>
      </div>

      <ClientTable
        clients={filteredClients}
        onEditClient={handleEditClient}
        onDeleteClient={handleDeleteClient}
        onViewClient={handleViewClient}
      />

      {/* Modal */}
      <NewClientModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddClient={handleAddClient}
        editingClient={editingClient}
      />

      {/* Drawer */}
      <ClientDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        client={viewingClient}
      />
    </div>
  );
}
