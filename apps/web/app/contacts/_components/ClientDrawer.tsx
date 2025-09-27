'use client';

import { Client } from '../_types';

interface ClientDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

export function ClientDrawer({ isOpen, onClose, client }: ClientDrawerProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen || !client) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      <div 
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-4 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 id="drawer-title" className="text-lg font-semibold text-gray-900">
            Client Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-md p-1"
            aria-label="Close drawer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Client Information */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Basic Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                <p className="text-sm text-gray-900">{client.name}</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  client.type === 'Individual' 
                    ? 'bg-blue-100 text-blue-800 border-blue-200' 
                    : 'bg-green-100 text-green-800 border-green-200'
                }`}>
                  {client.type}
                </span>
              </div>

              {client.contactPerson && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Contact Person</label>
                  <p className="text-sm text-gray-900">{client.contactPerson}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-3">
              {client.email && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                  <p className="text-sm text-gray-900">{client.email}</p>
                </div>
              )}

              {client.phone && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                  <p className="text-sm text-gray-900">{client.phone}</p>
                </div>
              )}

              {client.altPhone && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Alternative Phone</label>
                  <p className="text-sm text-gray-900">{client.altPhone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          {(client.address1 || client.city || client.state || client.pincode) && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Address</h3>
              <div className="space-y-3">
                {client.address1 && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Street Address</label>
                    <p className="text-sm text-gray-900">{client.address1}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {client.city && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                      <p className="text-sm text-gray-900">{client.city}</p>
                    </div>
                  )}

                  {client.state && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">State</label>
                      <p className="text-sm text-gray-900">{client.state}</p>
                    </div>
                  )}
                </div>

                {client.pincode && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Pincode</label>
                    <p className="text-sm text-gray-900">{client.pincode}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tax Information */}
          {(client.pan || client.gstin) && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Tax Information</h3>
              <div className="space-y-3">
                {client.pan && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">PAN</label>
                    <p className="text-sm text-gray-900 font-mono">{client.pan}</p>
                  </div>
                )}

                {client.gstin && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">GSTIN</label>
                    <p className="text-sm text-gray-900 font-mono">{client.gstin}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {client.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Notes</h3>
              <div>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{client.notes}</p>
              </div>
            </div>
          )}

          {/* Created Date */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Record Information</h3>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Created</label>
              <p className="text-sm text-gray-900">
                {new Date(client.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}











