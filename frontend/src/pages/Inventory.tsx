import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import ItemModal from '../components/modals/ItemModal';
import SupplierModal from '../components/modals/SupplierModal';
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';

const Inventory: React.FC = () => {
  const { isOffline } = useSelector((state: RootState) => state.ui);
  const { items, suppliers } = useSelector((state: RootState) => state.inventory);
  
  const [activeTab, setActiveTab] = useState<'items' | 'suppliers' | 'orders'>('items');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [currentItem, setCurrentItem] = useState<any | null>(null);
  const [currentSupplier, setCurrentSupplier] = useState<any | null>(null);
  const [currentOrder, setCurrentOrder] = useState<any | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: number, type: string, name?: string } | null>(null);
  
  const [demoItems, setDemoItems] = useState([
    { id: 1, name: 'Rice', unit: 'kg', quantity: 50, minimumThreshold: 10, costPerUnit: 120, supplierId: 1, expiryDate: '2025-12-31', lastRestocked: '2025-03-15' },
    { id: 2, name: 'Chicken', unit: 'kg', quantity: 25, minimumThreshold: 5, costPerUnit: 450, supplierId: 2, expiryDate: '2025-04-25', lastRestocked: '2025-04-10' },
    { id: 3, name: 'Tomatoes', unit: 'kg', quantity: 15, minimumThreshold: 3, costPerUnit: 80, supplierId: 3, expiryDate: '2025-04-20', lastRestocked: '2025-04-12' },
    { id: 4, name: 'Onions', unit: 'kg', quantity: 20, minimumThreshold: 5, costPerUnit: 60, supplierId: 3, expiryDate: '2025-05-15', lastRestocked: '2025-04-05' },
    { id: 5, name: 'Cooking Oil', unit: 'liters', quantity: 30, minimumThreshold: 5, costPerUnit: 200, supplierId: 1, expiryDate: '2025-08-30', lastRestocked: '2025-03-20' },
  ]);
  
  const [demoSuppliers, setDemoSuppliers] = useState([
    { id: 1, name: 'Metro Suppliers Ltd', contactPerson: 'John Doe', phone: '0712345678', email: 'john@metrosuppliers.com', address: 'Nairobi, Kenya', isActive: true },
    { id: 2, name: 'Fresh Foods Inc', contactPerson: 'Jane Smith', phone: '0723456789', email: 'jane@freshfoods.com', address: 'Mombasa, Kenya', isActive: true },
    { id: 3, name: 'Organic Farms', contactPerson: 'Peter Kamau', phone: '0734567890', email: 'peter@organicfarms.com', address: 'Nakuru, Kenya', isActive: false },
  ]);
  
  const filteredItems = demoItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredSuppliers = demoSuppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const [demoOrders, setDemoOrders] = useState([
    {
      id: 1,
      orderNumber: 'PO-2025-001',
      supplierId: 1,
      supplierName: 'Metro Suppliers Ltd',
      orderDate: '2025-04-01',
      expectedDelivery: '2025-04-05',
      status: 'delivered',
      totalAmount: 12000,
      items: [
        { id: 1, itemId: 1, itemName: 'Rice', quantity: 100, unitPrice: 120, total: 12000 }
      ]
    },
    {
      id: 2,
      orderNumber: 'PO-2025-002',
      supplierId: 2,
      supplierName: 'Fresh Foods Inc',
      orderDate: '2025-04-10',
      expectedDelivery: '2025-04-15',
      status: 'pending',
      totalAmount: 9000,
      items: [
        { id: 2, itemId: 2, itemName: 'Chicken', quantity: 20, unitPrice: 450, total: 9000 }
      ]
    }
  ]);
  
  const lowStockItems = demoItems.filter(item => item.quantity <= item.minimumThreshold);
  
  const filteredOrders = demoOrders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddItem = () => {
    setCurrentItem(null);
    setIsItemModalOpen(true);
  };
  
  const handleEditItem = (item: any) => {
    setCurrentItem(item);
    setIsItemModalOpen(true);
  };
  
  const handleAddSupplier = () => {
    setCurrentSupplier(null);
    setIsSupplierModalOpen(true);
  };
  
  const handleEditSupplier = (supplier: any) => {
    setCurrentSupplier(supplier);
    setIsSupplierModalOpen(true);
  };
  
  const handleAddOrder = () => {
    setCurrentOrder(null);
    setIsOrderModalOpen(true);
  };
  
  const handleDeleteConfirmation = (id: number, type: string, name?: string) => {
    setItemToDelete({ id, type, name });
    setIsDeleteModalOpen(true);
  };
  
  const handleSaveItem = (formData: any) => {
    if (currentItem) {
      setDemoItems(demoItems.map(item => 
        item.id === currentItem.id ? { ...item, ...formData } : item
      ));
    } else {
      const newItem = {
        id: Math.max(0, ...demoItems.map(item => item.id)) + 1,
        ...formData
      };
      setDemoItems([...demoItems, newItem]);
    }
    setIsItemModalOpen(false);
  };
  
  const handleSaveSupplier = (formData: any) => {
    if (currentSupplier) {
      setDemoSuppliers(demoSuppliers.map(supplier => 
        supplier.id === currentSupplier.id ? { ...supplier, ...formData } : supplier
      ));
    } else {
      const newSupplier = {
        id: Math.max(0, ...demoSuppliers.map(supplier => supplier.id)) + 1,
        ...formData
      };
      setDemoSuppliers([...demoSuppliers, newSupplier]);
    }
    setIsSupplierModalOpen(false);
  };
  
  const handleDelete = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'item') {
      setDemoItems(demoItems.filter(item => item.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'supplier') {
      setDemoSuppliers(demoSuppliers.filter(supplier => supplier.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'order') {
      setDemoOrders(demoOrders.filter(order => order.id !== itemToDelete.id));
    }
    
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <div className={`px-3 py-1 rounded-full text-white text-sm ${isOffline ? 'bg-warning' : 'bg-success'}`}>
          {isOffline ? 'Offline Mode' : 'Online'}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('items')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'items'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-light hover:text-text hover:border-gray-300'
            }`}
          >
            Inventory Items
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'suppliers'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-light hover:text-text hover:border-gray-300'
            }`}
          >
            Suppliers
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-light hover:text-text hover:border-gray-300'
            }`}
          >
            Purchase Orders
          </button>
        </nav>
      </div>
      
      {/* Search and Actions */}
      <div className="flex justify-between">
        <div className="w-1/3">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div>
          <button 
            onClick={() => {
              if (activeTab === 'items') handleAddItem();
              else if (activeTab === 'suppliers') handleAddSupplier();
              else if (activeTab === 'orders') handleAddOrder();
            }}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            {activeTab === 'items' && 'Add Item'}
            {activeTab === 'suppliers' && 'Add Supplier'}
            {activeTab === 'orders' && 'Create Purchase Order'}
          </button>
        </div>
      </div>
      
      {/* Low Stock Alert */}
      {activeTab === 'items' && lowStockItems.length > 0 && (
        <div className="bg-warning bg-opacity-10 border border-warning text-warning px-4 py-3 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-warning" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-warning">
                Low Stock Alert
              </h3>
              <div className="mt-2 text-sm">
                <p>
                  {lowStockItems.length} items are below minimum threshold.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Content based on active tab */}
      <div className="bg-white shadow overflow-hidden rounded-md">
        {activeTab === 'items' && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Item
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Unit
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Cost
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Expiry Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Last Restocked
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${item.quantity <= item.minimumThreshold ? 'text-danger font-bold' : 'text-text'}`}>
                      {item.quantity} {item.quantity <= item.minimumThreshold && '(Low)'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text">{item.unit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text">KES {item.costPerUnit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text">{item.expiryDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text">{item.lastRestocked}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEditItem(item)} 
                      className="text-primary hover:text-primary-dark mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteConfirmation(item.id, 'item', item.name)} 
                      className="text-danger hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {activeTab === 'suppliers' && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Supplier
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Contact Person
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text">{supplier.name}</div>
                    <div className="text-sm text-text-light">{supplier.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text">{supplier.contactPerson}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text">{supplier.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text">{supplier.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      supplier.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {supplier.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEditSupplier(supplier)} 
                      className="text-primary hover:text-primary-dark mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteConfirmation(supplier.id, 'supplier', supplier.name)} 
                      className="text-danger hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {activeTab === 'orders' && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Order Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Supplier
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Expected Delivery
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-text">{order.orderNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text">{order.supplierName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text">{order.orderDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text">{order.expectedDelivery}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'delivered' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text">KES {order.totalAmount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleDeleteConfirmation(order.id, 'order', order.orderNumber)} 
                        className="text-danger hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-text-light">
                    No purchase orders available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Modals */}
      <ItemModal 
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        item={currentItem}
        suppliers={demoSuppliers}
      />
      
      <SupplierModal 
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        onSave={handleSaveSupplier}
        supplier={currentSupplier}
      />
      
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        itemType={itemToDelete?.type || ''}
        itemName={itemToDelete?.name}
      />
    </div>
  );
};

export default Inventory;
