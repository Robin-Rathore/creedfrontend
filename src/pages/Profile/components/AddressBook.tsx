import React, { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2, 
  Home, 
  Building, 
  CheckCircle, 
  X,
  Save,
  Star,
  StarOff
} from 'lucide-react';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  label: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface AddressBookProps {
  initialAddresses?: Address[];
  onSave?: (addresses: Address[]) => void;
}

const AddressBook: React.FC<AddressBookProps> = ({
  initialAddresses = [
    {
      id: '1',
      type: 'home',
      label: 'Home',
      firstName: 'John',
      lastName: 'Doe',
      addressLine1: '123 Main Street, Apartment 4B',
      addressLine2: 'Near Central Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India',
      phone: '+91 98765 43210',
      isDefault: true
    },
    {
      id: '2',
      type: 'work',
      label: 'Office',
      firstName: 'John',
      lastName: 'Doe',
      addressLine1: '456 Business District',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400070',
      country: 'India',
      phone: '+91 98765 43210',
      isDefault: false
    }
  ],
  onSave
}) => {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const emptyAddress: Omit<Address, 'id'> = {
    type: 'home',
    label: '',
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    phone: '',
    isDefault: false
  };

  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>(emptyAddress);
  const [editAddress, setEditAddress] = useState<Address | null>(null);

  const handleAddAddress = () => {
    setNewAddress(emptyAddress);
    setIsAdding(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditAddress(address);
    setEditingId(address.id);
  };

  const handleSaveNew = async () => {
    if (!newAddress.firstName || !newAddress.addressLine1 || !newAddress.city || !newAddress.pincode) {
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const addressToAdd: Address = {
        ...newAddress,
        id: Date.now().toString(),
        label: newAddress.label || `${newAddress.type.charAt(0).toUpperCase()}${newAddress.type.slice(1)} Address`
      };

      const updatedAddresses = [...addresses, addressToAdd];
      setAddresses(updatedAddresses);
      setIsAdding(false);
      setNewAddress(emptyAddress);
      showSuccessMessage();
      onSave?.(updatedAddresses);
    } catch (error) {
      console.error('Failed to save address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editAddress) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedAddresses = addresses.map(addr => 
        addr.id === editAddress.id ? editAddress : addr
      );
      setAddresses(updatedAddresses);
      setEditingId(null);
      setEditAddress(null);
      showSuccessMessage();
      onSave?.(updatedAddresses);
    } catch (error) {
      console.error('Failed to update address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const updatedAddresses = addresses.filter(addr => addr.id !== id);
      setAddresses(updatedAddresses);
      showSuccessMessage();
      onSave?.(updatedAddresses);
    } catch (error) {
      console.error('Failed to delete address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }));
      setAddresses(updatedAddresses);
      showSuccessMessage();
      onSave?.(updatedAddresses);
    } catch (error) {
      console.error('Failed to set default address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="w-5 h-5" />;
      case 'work': return <Building className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  const renderAddressForm = (
    address: Omit<Address, 'id'> | Address,
    onChange: (field: string, value: string | boolean) => void,
    isEdit = false
  ) => (
    <div className="space-y-4">
      {/* Address Type and Label */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address Type
          </label>
          <select
            value={address.type}
            onChange={(e) => onChange('type', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Label (Optional)
          </label>
          <input
            type="text"
            value={address.label}
            onChange={(e) => onChange('label', e.target.value)}
            placeholder="e.g., Main Home, Office"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={address.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={address.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>
      </div>

      {/* Address Lines */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address Line 1 *
        </label>
        <input
          type="text"
          value={address.addressLine1}
          onChange={(e) => onChange('addressLine1', e.target.value)}
          placeholder="House/Flat/Building No., Street Name"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address Line 2 (Optional)
        </label>
        <input
          type="text"
          value={address.addressLine2 || ''}
          onChange={(e) => onChange('addressLine2', e.target.value)}
          placeholder="Landmark, Area"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      {/* City, State, Pincode */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => onChange('city', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <input
            type="text"
            value={address.state}
            onChange={(e) => onChange('state', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pincode *
          </label>
          <input
            type="text"
            value={address.pincode}
            onChange={(e) => onChange('pincode', e.target.value)}
            pattern="[0-9]{6}"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>
      </div>

      {/* Country and Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country *
          </label>
          <select
            value={address.country}
            onChange={(e) => onChange('country', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={address.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>
      </div>

      {/* Default Address Checkbox */}
      {!isEdit && (
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isDefault"
            checked={address.isDefault}
            onChange={(e) => onChange('isDefault', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
            Set as default address
          </label>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Address Book</h1>
          <p className="text-gray-600 mt-1">Manage your saved addresses for faster checkout</p>
        </div>
        
        {showSuccess && (
          <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Address updated successfully!</span>
          </div>
        )}
      </div>

      {/* Add New Address Button */}
      {!isAdding && (
        <button
          onClick={handleAddAddress}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mb-6"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add New Address</span>
        </button>
      )}

      {/* Add New Address Form */}
      {isAdding && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Add New Address</h2>
            <button
              onClick={() => setIsAdding(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {renderAddressForm(
            newAddress,
            (field, value) => setNewAddress(prev => ({ ...prev, [field]: value }))
          )}

          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setIsAdding(false)}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNew}
              disabled={isLoading || !newAddress.firstName || !newAddress.addressLine1}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : 'Save Address'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Address List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div key={address.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {editingId === address.id && editAddress ? (
              /* Edit Mode */
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Edit Address</h3>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditAddress(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {renderAddressForm(
                  editAddress,
                  (field, value) => setEditAddress(prev => prev ? { ...prev, [field]: value } : null),
                  true
                )}

                <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditAddress(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-blue-600">
                        {getAddressTypeIcon(address.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {address.label}
                          {address.isDefault && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                              Default
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">{address.type} Address</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        disabled={address.isDefault || isLoading}
                        className="p-2 text-gray-500 hover:text-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={address.isDefault ? 'Already default' : 'Set as default'}
                      >
                        {address.isDefault ? 
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" /> : 
                          <StarOff className="w-5 h-5" />
                        }
                      </button>
                      <button
                        onClick={() => handleEditAddress(address)}
                        className="p-2 text-gray-500 hover:text-blue-600"
                        title="Edit address"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        disabled={address.isDefault}
                        className="p-2 text-gray-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={address.isDefault ? 'Cannot delete default address' : 'Delete address'}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-gray-700">
                    <p className="font-medium">{address.firstName} {address.lastName}</p>
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>{address.city}, {address.state} {address.pincode}</p>
                    <p>{address.country}</p>
                    <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {addresses.length === 0 && !isAdding && (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
          <p className="text-gray-600 mb-6">Add your first address to get started</p>
          <button
            onClick={handleAddAddress}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            <span>Add Address</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressBook;
