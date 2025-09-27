'use client';

import { useState, useEffect } from 'react';
import { Client, ClientType } from '../_types';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (client: {
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
  }) => void;
  editingClient?: Client | null;
}

export function NewClientModal({ isOpen, onClose, onAddClient, editingClient }: NewClientModalProps) {
  const [type, setType] = useState<ClientType>('Individual');
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [address1, setAddress1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [pan, setPan] = useState('');
  const [gstin, setGstin] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingClient) {
      setType(editingClient.type);
      setName(editingClient.name);
      setContactPerson(editingClient.contactPerson || '');
      setEmail(editingClient.email || '');
      setPhone(editingClient.phone || '');
      setAltPhone(editingClient.altPhone || '');
      setAddress1(editingClient.address1 || '');
      setCity(editingClient.city || '');
      setState(editingClient.state || '');
      setPincode(editingClient.pincode || '');
      setPan(editingClient.pan || '');
      setGstin(editingClient.gstin || '');
      setNotes(editingClient.notes || '');
    } else {
      setType('Individual');
      setName('');
      setContactPerson('');
      setEmail('');
      setPhone('');
      setAltPhone('');
      setAddress1('');
      setCity('');
      setState('');
      setPincode('');
      setPan('');
      setGstin('');
      setNotes('');
    }
  }, [editingClient, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddClient({
      type,
      name: name.trim(),
      contactPerson: contactPerson.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      altPhone: altPhone.trim() || undefined,
      address1: address1.trim() || undefined,
      city: city.trim() || undefined,
      state: state.trim() || undefined,
      pincode: pincode.trim() || undefined,
      pan: pan.trim() || undefined,
      gstin: gstin.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setType('Individual');
    setName('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setAltPhone('');
    setAddress1('');
    setCity('');
    setState('');
    setPincode('');
    setPan('');
    setGstin('');
    setNotes('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="text-lg font-semibold text-gray-900 mb-4">
          {editingClient ? 'Edit Client' : 'Add New Client'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type and Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Client Type *
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as ClientType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="Individual">Individual</option>
                <option value="Company">Company</option>
              </select>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {type === 'Company' ? 'Company Name' : 'Full Name'} *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={type === 'Company' ? 'Enter company name' : 'Enter full name'}
                required
                autoFocus
              />
            </div>
          </div>

          {/* Contact Person (for Company) */}
          {type === 'Company' && (
            <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person
              </label>
              <input
                id="contactPerson"
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter contact person name"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional: Primary contact person for the company
              </p>
            </div>
          )}

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div>
            <label htmlFor="altPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Alternative Phone
            </label>
            <input
              id="altPhone"
              type="tel"
              value={altPhone}
              onChange={(e) => setAltPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter alternative phone number"
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              id="address1"
              type="text"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter street address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter city"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                id="state"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter state"
              />
            </div>

            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                Pincode
              </label>
              <input
                id="pincode"
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter pincode"
              />
            </div>
          </div>

          {/* Tax Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-1">
                PAN
              </label>
              <input
                id="pan"
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter PAN number"
              />
            </div>

            <div>
              <label htmlFor="gstin" className="block text-sm font-medium text-gray-700 mb-1">
                GSTIN
              </label>
              <input
                id="gstin"
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter GSTIN number"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter any additional notes"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {editingClient ? 'Update Client' : 'Add Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}











