import React, { useState, useEffect } from 'react';

interface MenuItemCustomization {
  spiceLevel?: 'mild' | 'medium' | 'spicy' | 'extra spicy';
  cookingPreference?: 'rare' | 'medium rare' | 'medium' | 'medium well' | 'well done';
  specialInstructions?: string;
}

interface MenuItemCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customization: MenuItemCustomization) => void;
  itemName: string;
  initialCustomization?: MenuItemCustomization;
  itemType: 'meat' | 'vegetarian' | 'other';
}

const MenuItemCustomizationModal: React.FC<MenuItemCustomizationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemName,
  initialCustomization = {},
  itemType
}) => {
  const [customization, setCustomization] = useState<MenuItemCustomization>(initialCustomization);

  useEffect(() => {
    if (isOpen) {
      setCustomization(initialCustomization);
    }
  }, [isOpen, initialCustomization]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomization(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(customization);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Customize {itemName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Spice Level - for all items */}
          <div>
            <label htmlFor="spiceLevel" className="block text-sm font-medium text-gray-700 mb-1">
              Spice Level
            </label>
            <select
              id="spiceLevel"
              name="spiceLevel"
              value={customization.spiceLevel || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">Select Spice Level</option>
              <option value="mild">Mild</option>
              <option value="medium">Medium</option>
              <option value="spicy">Spicy</option>
              <option value="extra spicy">Extra Spicy</option>
            </select>
          </div>

          {/* Cooking Preference - only for meat items */}
          {itemType === 'meat' && (
            <div>
              <label htmlFor="cookingPreference" className="block text-sm font-medium text-gray-700 mb-1">
                Cooking Preference
              </label>
              <select
                id="cookingPreference"
                name="cookingPreference"
                value={customization.cookingPreference || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="">Select Cooking Preference</option>
                <option value="rare">Rare</option>
                <option value="medium rare">Medium Rare</option>
                <option value="medium">Medium</option>
                <option value="medium well">Medium Well</option>
                <option value="well done">Well Done</option>
              </select>
            </div>
          )}

          {/* Special Instructions - for all items */}
          <div>
            <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-1">
              Special Instructions
            </label>
            <textarea
              id="specialInstructions"
              name="specialInstructions"
              value={customization.specialInstructions || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Any special requests or allergies..."
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark"
            >
              Add to Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemCustomizationModal;
