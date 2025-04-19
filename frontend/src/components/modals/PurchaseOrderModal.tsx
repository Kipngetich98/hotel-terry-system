import React, { useState, useEffect } from 'react';

interface OrderItem {
  id?: number;
  itemId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PurchaseOrder {
  id?: number;
  orderNumber?: string;
  supplierId: number;
  supplierName?: string;
  orderDate: string;
  expectedDelivery: string;
  status: 'pending' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
}

interface PurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: PurchaseOrder) => void;
  order: PurchaseOrder | null;
  suppliers: any[];
  inventoryItems: any[];
}

const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  order,
  suppliers,
  inventoryItems
}) => {
  const [formData, setFormData] = useState<PurchaseOrder>({
    supplierId: 0,
    orderDate: new Date().toISOString().split('T')[0],
    expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'pending',
    totalAmount: 0,
    items: []
  });
  
  const [currentItem, setCurrentItem] = useState<{
    itemId: number;
    quantity: number;
  }>({
    itemId: 0,
    quantity: 1
  });
  
  useEffect(() => {
    if (order) {
      setFormData({
        ...order,
        orderDate: order.orderDate,
        expectedDelivery: order.expectedDelivery
      });
    } else {
      setFormData({
        supplierId: suppliers.length > 0 ? suppliers[0].id : 0,
        orderDate: new Date().toISOString().split('T')[0],
        expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pending',
        totalAmount: 0,
        items: []
      });
    }
  }, [order, suppliers]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: name === 'itemId' ? parseInt(value) : value
    });
  };
  
  const addItem = () => {
    if (currentItem.itemId === 0 || currentItem.quantity <= 0) {
      return;
    }
    
    const selectedItem = inventoryItems.find(item => item.id === currentItem.itemId);
    if (!selectedItem) return;
    
    const newItem: OrderItem = {
      itemId: currentItem.itemId,
      itemName: selectedItem.name,
      quantity: currentItem.quantity,
      unitPrice: selectedItem.costPerUnit,
      total: currentItem.quantity * selectedItem.costPerUnit
    };
    
    const updatedItems = [...formData.items, newItem];
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.total, 0);
    
    setFormData({
      ...formData,
      items: updatedItems,
      totalAmount
    });
    
    setCurrentItem({
      itemId: 0,
      quantity: 1
    });
  };
  
  const removeItem = (index: number) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.total, 0);
    
    setFormData({
      ...formData,
      items: updatedItems,
      totalAmount
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.supplierId === 0 || formData.items.length === 0) {
      return;
    }
    
    onSave(formData);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {order ? 'Edit Purchase Order' : 'Create Purchase Order'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <select
                id="supplierId"
                name="supplierId"
                value={formData.supplierId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
              >
                <option value="pending">Pending</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700 mb-1">
                Order Date
              </label>
              <input
                type="date"
                id="orderDate"
                name="orderDate"
                value={formData.orderDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="expectedDelivery" className="block text-sm font-medium text-gray-700 mb-1">
                Expected Delivery
              </label>
              <input
                type="date"
                id="expectedDelivery"
                name="expectedDelivery"
                value={formData.expectedDelivery}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Order Items</h3>
            
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="itemId" className="block text-sm font-medium text-gray-700 mb-1">
                    Item
                  </label>
                  <select
                    id="itemId"
                    name="itemId"
                    value={currentItem.itemId}
                    onChange={handleItemChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select Item</option>
                    {inventoryItems.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} (KES {item.costPerUnit})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={currentItem.quantity}
                    onChange={handleItemChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addItem}
                    className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
            
            {formData.items.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.itemName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          KES {item.unitPrice.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          KES {item.total.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        Total Amount:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        KES {formData.totalAmount.toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-md">
                No items added yet. Add items to create a purchase order.
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={formData.items.length === 0}
            >
              {order ? 'Update Order' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseOrderModal;
