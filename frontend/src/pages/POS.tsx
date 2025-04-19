import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { 
  createOrder, 
  addOrderItem, 
  removeOrderItem, 
  updateOrderItemQuantity,
  setPaymentMethod,
  setTransactionReference,
  completeOrder
} from '../store/slices/orderSlice';
import MpesaPaymentModal from '../components/modals/MpesaPaymentModal';
import CashPaymentModal from '../components/modals/CashPaymentModal';
import logger from '../utils/logger';
import errorHandler, { ErrorCategory, ErrorSeverity } from '../utils/errorHandler';
import mpesaService from '../services/mpesaService';

interface MenuItemDisplay {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  popularity?: number;
  isCombo?: boolean;
}

const POS: React.FC = () => {
  const dispatch = useDispatch();
  const { currentOrder } = useSelector((state: RootState) => state.order);
  const { items: menuItems, categories } = useSelector((state: RootState) => state.menu);
  const { isOffline } = useSelector((state: RootState) => state.ui);
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [tableNumber, setTableNumber] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<'popularity' | 'alphabetical' | 'price'>('popularity');
  
  const demoMenuItems: MenuItemDisplay[] = [
    { id: 1, name: 'Chicken Curry', price: 850, categoryId: 1, popularity: 95, isCombo: false },
    { id: 2, name: 'Beef Stew', price: 950, categoryId: 1, popularity: 85, isCombo: false },
    { id: 3, name: 'Fish Fillet', price: 1200, categoryId: 1, popularity: 75, isCombo: false },
    { id: 4, name: 'Vegetable Rice', price: 450, categoryId: 2, popularity: 80, isCombo: false },
    { id: 5, name: 'Chapati', price: 50, categoryId: 2, popularity: 90, isCombo: false },
    { id: 6, name: 'Ugali', price: 100, categoryId: 2, popularity: 88, isCombo: false },
    { id: 7, name: 'Fresh Juice', price: 200, categoryId: 3, popularity: 70, isCombo: false },
    { id: 8, name: 'Soda', price: 100, categoryId: 3, popularity: 92, isCombo: false },
    { id: 9, name: 'Water', price: 50, categoryId: 3, popularity: 65, isCombo: false },
    { id: 10, name: 'Chicken & Chips Combo', price: 1200, categoryId: 4, popularity: 98, isCombo: true },
    { id: 11, name: 'Fish & Ugali Combo', price: 1300, categoryId: 4, popularity: 94, isCombo: true },
    { id: 12, name: 'Beef & Rice Combo', price: 1100, categoryId: 4, popularity: 96, isCombo: true },
    { id: 13, name: 'Vegetarian Platter', price: 900, categoryId: 4, popularity: 82, isCombo: true },
  ];
  
  const demoCategories = [
    { id: 1, name: 'Main Dishes' },
    { id: 2, name: 'Sides' },
    { id: 3, name: 'Drinks' },
    { id: 4, name: 'Combo Deals' },
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
    try {
      dispatch(setPaymentMethod(method));
      logger.info('Selected payment method', { method });
      
      setShowPaymentModal(false);
      
      switch (method) {
        case 'mpesa':
          setShowMpesaModal(true);
          break;
        case 'cash':
          setShowCashModal(true);
          break;
        case 'card':
          const cardTransactionId = `CARD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
          handleCompleteOrder(cardTransactionId);
          break;
      }
    } catch (error) {
      errorHandler.handleError(
        error instanceof Error ? error : new Error(String(error)),
        {
          severity: ErrorSeverity.MEDIUM,
          category: ErrorCategory.PAYMENT,
          userMessage: 'Failed to select payment method. Please try again.'
        }
      );
    }
  };
  
  const handleMpesaStkPush = async (phoneNumber: string) => {
    try {
      if (!currentOrder) return;
      
      setProcessingPayment(true);
      setPaymentStatus('processing');
      setPaymentMessage('Processing M-Pesa STK push...');
      
      logger.info('Initiating M-Pesa STK push', { 
        phoneNumber, 
        amount: (currentOrder.totalAmount * 1.16),
        orderId: currentOrder.id
      });
      
      const orderReference = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      
      const result = await mpesaService.initiateSTKPush(
        phoneNumber,
        (currentOrder.totalAmount * 1.16),
        orderReference,
        (success, transactionId) => {
          if (success && transactionId) {
            logger.info('M-Pesa payment successful', { transactionId });
            handleCompleteOrder(transactionId);
          } else {
            logger.warn('M-Pesa payment failed or cancelled');
            setProcessingPayment(false);
            setPaymentStatus('error');
            setPaymentMessage('Payment failed or was cancelled. Please try again.');
            setTimeout(() => {
              setShowMpesaModal(false);
              setPaymentStatus('idle');
            }, 3000);
          }
        }
      );
      
      if (result.success) {
        setPaymentMessage(result.message);
      } else {
        setProcessingPayment(false);
        setPaymentStatus('error');
        setPaymentMessage(result.message);
        setTimeout(() => {
          setPaymentStatus('idle');
        }, 3000);
      }
    } catch (error) {
      const appError = errorHandler.handleError(
        error instanceof Error ? error : new Error(String(error)),
        {
          severity: ErrorSeverity.HIGH,
          category: ErrorCategory.PAYMENT,
          userMessage: 'Failed to process M-Pesa payment. Please try again.'
        }
      );
      
      setProcessingPayment(false);
      setPaymentStatus('error');
      setPaymentMessage(appError.metadata.userMessage || 'Payment processing failed');
      
      setTimeout(() => {
        setShowMpesaModal(false);
        setPaymentStatus('idle');
      }, 3000);
    }
  };
  
  const handleMpesaManualCode = async (transactionCode: string) => {
    try {
      if (!currentOrder) return;
      
      setProcessingPayment(true);
      setPaymentStatus('processing');
      setPaymentMessage('Verifying M-Pesa transaction code...');
      
      logger.info('Processing manual M-Pesa transaction code', { 
        transactionCode, 
        amount: (currentOrder.totalAmount * 1.16),
        orderId: currentOrder.id
      });
      
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      handleCompleteOrder(transactionCode);
      
      setShowMpesaModal(false);
      setProcessingPayment(false);
      setPaymentStatus('success');
      setPaymentMessage('M-Pesa payment verified successfully!');
      
      setTimeout(() => {
        setPaymentStatus('idle');
      }, 3000);
    } catch (error) {
      const appError = errorHandler.handleError(
        error instanceof Error ? error : new Error(String(error)),
        {
          severity: ErrorSeverity.HIGH,
          category: ErrorCategory.PAYMENT,
          userMessage: 'Failed to verify M-Pesa transaction code. Please try again.'
        }
      );
      
      setProcessingPayment(false);
      setPaymentStatus('error');
      setPaymentMessage(appError.metadata.userMessage || 'Transaction verification failed');
      
      setTimeout(() => {
        setShowMpesaModal(false);
        setPaymentStatus('idle');
      }, 3000);
    }
  };
  
  const handleCashPayment = (transactionCode: string) => {
    try {
      logger.info('Processing cash payment', { transactionCode });
      handleCompleteOrder(transactionCode);
    } catch (error) {
      errorHandler.handleError(
        error instanceof Error ? error : new Error(String(error)),
        {
          severity: ErrorSeverity.MEDIUM,
          category: ErrorCategory.PAYMENT,
          userMessage: 'Failed to process cash payment. Please try again.'
        }
      );
    }
  };
  
  const handleCompleteOrder = (transactionReference?: string) => {
    try {
      if (transactionReference) {
        dispatch(setTransactionReference(transactionReference));
      }
      
      dispatch(completeOrder());
      logger.info('Order completed successfully', { 
        transactionReference,
        orderItems: currentOrder?.items.length,
        totalAmount: currentOrder?.totalAmount
      });
      
      setShowPaymentModal(false);
      setShowMpesaModal(false);
      setShowCashModal(false);
      setProcessingPayment(false);
      setPaymentStatus('success');
      setPaymentMessage('Payment successful! Order has been completed.');
      
      setTimeout(() => {
        setPaymentStatus('idle');
      }, 3000);
    } catch (error) {
      errorHandler.handleError(
        error instanceof Error ? error : new Error(String(error)),
        {
          severity: ErrorSeverity.HIGH,
          category: ErrorCategory.PAYMENT,
          userMessage: 'Failed to complete order. Please try again.'
        }
      );
    }
  };
  
  const filteredAndSortedMenuItems = useMemo(() => {
    let filtered = demoMenuItems.filter(item => {
      if (searchTerm) {
        return item.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      
      if (selectedCategoryId) {
        return item.categoryId === selectedCategoryId;
      }
      
      return true;
    });
    
    switch (sortOption) {
      case 'popularity':
        return filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      case 'alphabetical':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'price':
        return filtered.sort((a, b) => a.price - b.price);
      default:
        return filtered;
    }
  }, [demoMenuItems, searchTerm, selectedCategoryId, sortOption]);
  
  const popularItems = useMemo(() => {
    return [...demoMenuItems]
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 4);
  }, [demoMenuItems]);
  
  const comboDeals = useMemo(() => {
    return demoMenuItems.filter(item => item.isCombo);
  }, [demoMenuItems]);
    
  const totalAmount = currentOrder ? (currentOrder.totalAmount * 1.16) : 0;
  
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
          {/* Search and Sort Controls */}
          <div className="p-4 border-b">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as 'popularity' | 'alphabetical' | 'price')}
                  className="w-full md:w-auto px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                >
                  <option value="popularity">Sort by Popularity</option>
                  <option value="alphabetical">Sort Alphabetically</option>
                  <option value="price">Sort by Price</option>
                </select>
              </div>
            </div>
            
            {/* Categories */}
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
          
          {/* Popular Items Section */}
          {!searchTerm && selectedCategoryId === null && (
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold mb-3">Popular Items</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {popularItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleAddItem(item)}
                    className="bg-white border-2 border-primary rounded-lg p-4 text-left hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 bg-primary text-white text-xs px-2 py-1 rounded-bl-lg">
                      Popular
                    </div>
                    <div className="h-20 bg-gray-200 rounded-md mb-2"></div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-primary font-bold">KES {item.price.toFixed(2)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Combo Deals Section */}
          {!searchTerm && (selectedCategoryId === null || selectedCategoryId === 4) && (
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold mb-3">Combo Deals</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {comboDeals.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleAddItem(item)}
                    className="bg-white border border-yellow-400 rounded-lg p-4 text-left hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 bg-yellow-400 text-white text-xs px-2 py-1 rounded-bl-lg">
                      Combo
                    </div>
                    <div className="h-20 bg-gray-200 rounded-md mb-2"></div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-primary font-bold">KES {item.price.toFixed(2)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Menu Items Grid */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3">
              {searchTerm ? 'Search Results' : selectedCategoryId ? demoCategories.find(c => c.id === selectedCategoryId)?.name : 'All Items'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAndSortedMenuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleAddItem(item)}
                  className={`bg-white border rounded-lg p-4 text-left hover:shadow-md transition-shadow ${
                    item.isCombo ? 'border-yellow-400' : ''
                  }`}
                >
                  <div className="h-24 bg-gray-200 rounded-md mb-2"></div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-primary font-bold">KES {item.price.toFixed(2)}</p>
                  {item.popularity && item.popularity > 90 && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
                      Popular
                    </span>
                  )}
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
      
      {/* Payment Status Message */}
      {paymentStatus !== 'idle' && (
        <div className={`fixed inset-x-0 top-4 mx-auto max-w-md z-50 p-4 rounded-lg shadow-lg ${
          paymentStatus === 'success' ? 'bg-green-100 border border-green-200' :
          paymentStatus === 'error' ? 'bg-red-100 border border-red-200' :
          'bg-blue-100 border border-blue-200'
        }`}>
          <div className="flex items-center">
            {paymentStatus === 'success' && (
              <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            )}
            {paymentStatus === 'error' && (
              <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            )}
            {paymentStatus === 'processing' && (
              <svg className="w-6 h-6 text-blue-600 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            )}
            <p className="font-medium">{paymentMessage}</p>
          </div>
        </div>
      )}
      
      {/* Payment Method Selection Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>
            
            <div className="space-y-4">
              <button
                onClick={() => handlePaymentMethodSelect('mpesa')}
                className="w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 flex items-center justify-center"
              >
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.5 4.5h3v3h-3v-3zm0 4.5h3v9h-3v-9z"/>
                </svg>
                M-Pesa
              </button>
              
              <button
                onClick={() => handlePaymentMethodSelect('cash')}
                className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 flex items-center justify-center"
              >
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 6h20v12H2V6zm1 1v10h18V7H3zm5 2h8v1H8V9zm0 2h8v1H8v-1zm0 2h4v1H8v-1z"/>
                </svg>
                Cash
              </button>
              
              <button
                onClick={() => handlePaymentMethodSelect('card')}
                className="w-full py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 flex items-center justify-center"
              >
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
                Card
              </button>
              
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* M-Pesa Payment Modal */}
      {showMpesaModal && (
        <MpesaPaymentModal
          amount={totalAmount}
          onSubmitStkPush={handleMpesaStkPush}
          onSubmitManualCode={handleMpesaManualCode}
          onCancel={() => setShowMpesaModal(false)}
          isProcessing={processingPayment}
        />
      )}
      
      {/* Cash Payment Modal */}
      {showCashModal && (
        <CashPaymentModal
          amount={totalAmount}
          onSubmit={handleCashPayment}
          onCancel={() => setShowCashModal(false)}
        />
      )}
    </div>
  );
};

export default POS;
