import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { 
  createOrder, 
  addOrderItem, 
  removeOrderItem, 
  updateOrderItemQuantity,
  setPaymentMethod,
  completeOrder
} from '../store/slices/orderSlice';

interface MenuItemDisplay {
  id: number;
  name: string;
  price: number;
  categoryId: number;
}

const POS: React.FC = () => {
  const dispatch = useDispatch();
  const { currentOrder } = useSelector((state: RootState) => state.order);
  const { items: menuItems, categories } = useSelector((state: RootState) => state.menu);
  const { isOffline } = useSelector((state: RootState) => state.ui);
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [tableNumber, setTableNumber] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const demoMenuItems: MenuItemDisplay[] = [
    { id: 1, name: 'Chicken Curry', price: 850, categoryId: 1 },
    { id: 2, name: 'Beef Stew', price: 950, categoryId: 1 },
    { id: 3, name: 'Fish Fillet', price: 1200, categoryId: 1 },
    { id: 4, name: 'Vegetable Rice', price: 450, categoryId: 2 },
    { id: 5, name: 'Chapati', price: 50, categoryId: 2 },
    { id: 6, name: 'Ugali', price: 100, categoryId: 2 },
    { id: 7, name: 'Fresh Juice', price: 200, categoryId: 3 },
    { id: 8, name: 'Soda', price: 100, categoryId: 3 },
    { id: 9, name: 'Water', price: 50, categoryId: 3 },
  ];
  
  const demoCategories = [
    { id: 1, name: 'Main Dishes' },
    { id: 2, name: 'Sides' },
    { id: 3, name: 'Drinks' },
  ];
  
  useEffect(() => {
    if (!currentOrder) {
      dispatch(createOrder({ tableNumber }));
    }
  }, [dispatch, currentOrder, tableNumber]);
  
  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };
  
  const handleAddItem = (item: MenuItemDisplay) => {
    dispatch(addOrderItem({
      menuItemId: item.id,
      menuItemName: item.name,
      quantity: 1,
      unitPrice: item.price,
      totalPrice: item.price,
    }));
  };
  
  const handleRemoveItem = (menuItemId: number) => {
    dispatch(removeOrderItem(menuItemId));
  };
  
  const handleQuantityChange = (menuItemId: number, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateOrderItemQuantity({ menuItemId, quantity }));
    } else {
      dispatch(removeOrderItem(menuItemId));
    }
  };
  
  const handlePaymentMethodSelect = (method: 'mpesa' | 'cash' | 'card') => {
    dispatch(setPaymentMethod(method));
    handleCompleteOrder();
  };
  
  const handleCompleteOrder = () => {
    dispatch(completeOrder());
    setShowPaymentModal(false);
    alert('Order completed successfully!');
  };
  
  const filteredMenuItems = selectedCategoryId
    ? demoMenuItems.filter(item => item.categoryId === selectedCategoryId)
    : demoMenuItems;
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Point of Sale</h1>
        <div className={`px-3 py-1 rounded-full text-white text-sm ${isOffline ? 'bg-warning' : 'bg-success'}`}>
          {isOffline ? 'Offline Mode' : 'Online'}
        </div>
      </div>
      
      <div className="flex flex-1 gap-4 h-full">
        {/* Menu Section */}
        <div className="w-2/3 bg-white rounded-lg shadow overflow-hidden flex flex-col">
          {/* Categories */}
          <div className="p-4 border-b">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategoryId(null)}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategoryId === null
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text hover:bg-gray-200'
                }`}
              >
                All
              </button>
              
              {demoCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    selectedCategoryId === category.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-text hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Menu Items Grid */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMenuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleAddItem(item)}
                  className="bg-white border rounded-lg p-4 text-left hover:shadow-md transition-shadow"
                >
                  <div className="h-24 bg-gray-200 rounded-md mb-2"></div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-primary font-bold">KES {item.price.toFixed(2)}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Order Section */}
        <div className="w-1/3 bg-white rounded-lg shadow overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Current Order</h2>
            <div className="mt-2">
              <label htmlFor="table-number" className="block text-sm text-text-light">
                Table Number
              </label>
              <input
                id="table-number"
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Enter table number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              />
            </div>
          </div>
          
          {/* Order Items */}
          <div className="flex-1 p-4 overflow-y-auto">
            {currentOrder && currentOrder.items.length > 0 ? (
              <ul className="space-y-4">
                {currentOrder.items.map(item => (
                  <li key={item.menuItemId} className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{item.menuItemName}</h4>
                      <p className="text-sm text-text-light">KES {item.unitPrice.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.menuItemId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-text hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.menuItemId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-text hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-text-light">
                No items in order. Add items from the menu.
              </div>
            )}
          </div>
          
          {/* Order Summary */}
          <div className="p-4 border-t">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>KES {currentOrder?.totalAmount.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Tax (16%)</span>
              <span>KES {((currentOrder?.totalAmount || 0) * 0.16).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>KES {((currentOrder?.totalAmount || 0) * 1.16).toFixed(2)}</span>
            </div>
            
            <button
              onClick={() => setShowPaymentModal(true)}
              disabled={!currentOrder || currentOrder.items.length === 0}
              className="mt-4 w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>
            
            <div className="space-y-4">
              <button
                onClick={() => handlePaymentMethodSelect('mpesa')}
                className="w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
              >
                M-Pesa
              </button>
              
              <button
                onClick={() => handlePaymentMethodSelect('cash')}
                className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
              >
                Cash
              </button>
              
              <button
                onClick={() => handlePaymentMethodSelect('card')}
                className="w-full py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600"
              >
                Card
              </button>
              
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-3 bg-gray-200 text-text rounded-lg font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;
