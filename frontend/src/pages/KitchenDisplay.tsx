import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import logger from '../utils/logger';
import errorHandler, { ErrorCategory, ErrorSeverity } from '../utils/errorHandler';

interface KitchenOrder {
  id: number;
  tableNumber: string;
  items: {
    id: number;
    name: string;
    quantity: number;
    notes?: string;
    status: 'pending' | 'preparing' | 'ready' | 'delivered';
    station?: 'grill' | 'fryer' | 'cold_prep' | 'drinks' | 'dessert';
  }[];
  priority: 'normal' | 'high' | 'rush';
  createdAt: Date;
  estimatedTime: number; // in minutes
  completedAt?: Date;
  preparationTime?: number; // actual time taken in minutes
}

const KitchenDisplay: React.FC = () => {
  const dispatch = useDispatch();
  const { isOffline } = useSelector((state: RootState) => state.ui);
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('disconnected');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedStation, setSelectedStation] = useState<string>('all');
  const [showCompletedOrders, setShowCompletedOrders] = useState<boolean>(false);
  const [completedOrders, setCompletedOrders] = useState<KitchenOrder[]>([]);
  const [tableManagement, setTableManagement] = useState<{[key: string]: {status: string, orders: number}}>({}); 
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    avgPrepTime: number;
    ordersCompleted: number;
    pendingOrders: number;
  }>({
    avgPrepTime: 0,
    ordersCompleted: 0,
    pendingOrders: 0
  });

  const demoOrders: KitchenOrder[] = [
    {
      id: 1,
      tableNumber: 'T-12',
      items: [
        { id: 1, name: 'Chicken Curry', quantity: 2, status: 'pending', notes: 'Extra spicy', station: 'grill' },
        { id: 2, name: 'Chapati', quantity: 4, status: 'preparing', station: 'grill' },
        { id: 3, name: 'Fresh Juice', quantity: 2, status: 'ready', station: 'drinks' },
      ],
      priority: 'high',
      createdAt: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      estimatedTime: 20,
    },
    {
      id: 2,
      tableNumber: 'T-05',
      items: [
        { id: 4, name: 'Beef Stew', quantity: 1, status: 'preparing', station: 'grill' },
        { id: 5, name: 'Ugali', quantity: 2, status: 'pending', station: 'fryer' },
        { id: 6, name: 'Soda', quantity: 1, status: 'ready', station: 'drinks' },
      ],
      priority: 'normal',
      createdAt: new Date(Date.now() - 5 * 60000), // 5 minutes ago
      estimatedTime: 15,
    },
    {
      id: 3,
      tableNumber: 'T-08',
      items: [
        { id: 7, name: 'Fish Fillet', quantity: 3, status: 'pending', notes: 'No sauce', station: 'fryer' },
        { id: 8, name: 'Vegetable Rice', quantity: 3, status: 'pending', station: 'cold_prep' },
        { id: 9, name: 'Water', quantity: 3, status: 'ready', station: 'drinks' },
      ],
      priority: 'rush',
      createdAt: new Date(Date.now() - 2 * 60000), // 2 minutes ago
      estimatedTime: 25,
    },
  ];
  
  const demoCompletedOrders: KitchenOrder[] = [
    {
      id: 4,
      tableNumber: 'T-03',
      items: [
        { id: 10, name: 'Pilau Rice', quantity: 2, status: 'delivered', station: 'grill' },
        { id: 11, name: 'Chicken Wings', quantity: 1, status: 'delivered', station: 'fryer' },
        { id: 12, name: 'Soda', quantity: 2, status: 'delivered', station: 'drinks' },
      ],
      priority: 'normal',
      createdAt: new Date(Date.now() - 45 * 60000), // 45 minutes ago
      estimatedTime: 18,
      completedAt: new Date(Date.now() - 25 * 60000), // 25 minutes ago
      preparationTime: 20,
    },
    {
      id: 5,
      tableNumber: 'T-07',
      items: [
        { id: 13, name: 'Beef Burger', quantity: 1, status: 'delivered', station: 'grill' },
        { id: 14, name: 'French Fries', quantity: 1, status: 'delivered', station: 'fryer' },
        { id: 15, name: 'Milkshake', quantity: 1, status: 'delivered', station: 'dessert' },
      ],
      priority: 'high',
      createdAt: new Date(Date.now() - 60 * 60000), // 60 minutes ago
      estimatedTime: 15,
      completedAt: new Date(Date.now() - 40 * 60000), // 40 minutes ago
      preparationTime: 20,
    }
  ];

  useEffect(() => {
    if (isOffline) {
      setConnectionStatus('disconnected');
      return;
    }

    const connectWebSocket = () => {
      try {
        const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/v1/ws/kitchen`;
        const newSocket = new WebSocket(wsUrl);
        
        newSocket.onopen = () => {
          logger.info('WebSocket connection established');
          setConnectionStatus('connected');
        };
        
        newSocket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            logger.info('WebSocket message received', { data });
            
            if (data.type === 'order_update') {
              updateOrders(data.orders);
            }
          } catch (error) {
            errorHandler.handleError(
              error instanceof Error ? error : new Error(String(error)),
              {
                severity: ErrorSeverity.MEDIUM,
                category: ErrorCategory.NETWORK,
                userMessage: 'Failed to process kitchen update'
              }
            );
          }
        };
        
        newSocket.onclose = () => {
          logger.warn('WebSocket connection closed');
          setConnectionStatus('disconnected');
          
          setTimeout(() => {
            if (connectionStatus !== 'connected') {
              setConnectionStatus('reconnecting');
              connectWebSocket();
            }
          }, 5000);
        };
        
        newSocket.onerror = (error) => {
          errorHandler.handleError(
            new Error('WebSocket connection error'),
            {
              severity: ErrorSeverity.MEDIUM,
              category: ErrorCategory.NETWORK,
              userMessage: 'Connection to kitchen display system lost'
            }
          );
          setConnectionStatus('disconnected');
        };
        
        setSocket(newSocket);
      } catch (error) {
        errorHandler.handleError(
          error instanceof Error ? error : new Error(String(error)),
          {
            severity: ErrorSeverity.HIGH,
            category: ErrorCategory.NETWORK,
            userMessage: 'Failed to connect to kitchen display system'
          }
        );
      }
    };
    
    connectWebSocket();
    
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [isOffline]);

  useEffect(() => {
    setOrders(demoOrders);
    setCompletedOrders(demoCompletedOrders);
    setLastUpdated(new Date());
    
    const tables: {[key: string]: {status: string, orders: number}} = {};
    demoOrders.forEach(order => {
      tables[order.tableNumber] = {
        status: 'active',
        orders: 1
      };
    });
    setTableManagement(tables);
    
    const totalPrepTime = demoCompletedOrders.reduce((total, order) => 
      total + (order.preparationTime || 0), 0);
    const avgTime = demoCompletedOrders.length > 0 ? 
      totalPrepTime / demoCompletedOrders.length : 0;
    
    setPerformanceMetrics({
      avgPrepTime: Math.round(avgTime * 10) / 10, // Round to 1 decimal place
      ordersCompleted: demoCompletedOrders.length,
      pendingOrders: demoOrders.length
    });
  }, []);

  const updateOrders = (updatedOrders: KitchenOrder[]) => {
    setOrders(updatedOrders);
    setLastUpdated(new Date());
  };

  const handleStatusChange = (orderId: number, itemId: number, newStatus: 'pending' | 'preparing' | 'ready' | 'delivered') => {
    try {
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          const updatedItems = order.items.map(item => {
            if (item.id === itemId) {
              return { ...item, status: newStatus };
            }
            return item;
          });
          return { ...order, items: updatedItems };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'status_update',
          orderId,
          itemId,
          status: newStatus
        }));
        
        logger.info('Status update sent to server', { orderId, itemId, status: newStatus });
      } else if (!isOffline) {
        logger.warn('WebSocket not connected, update queued', { orderId, itemId, status: newStatus });
      }
    } catch (error) {
      errorHandler.handleError(
        error instanceof Error ? error : new Error(String(error)),
        {
          severity: ErrorSeverity.MEDIUM,
          category: ErrorCategory.SYSTEM,
          userMessage: 'Failed to update item status'
        }
      );
    }
  };
  
  const handleCompleteOrder = (orderId: number) => {
    try {
      const orderToComplete = orders.find(order => order.id === orderId);
      
      if (!orderToComplete) {
        logger.warn('Order not found for completion', { orderId });
        return;
      }
      
      const now = new Date();
      const prepTimeMinutes = Math.round((now.getTime() - orderToComplete.createdAt.getTime()) / 60000);
      
      const completedOrder: KitchenOrder = {
        ...orderToComplete,
        items: orderToComplete.items.map(item => ({
          ...item,
          status: 'delivered'
        })),
        completedAt: now,
        preparationTime: prepTimeMinutes
      };
      
      setCompletedOrders(prev => [completedOrder, ...prev]);
      
      setOrders(prev => prev.filter(order => order.id !== orderId));
      
      setTableManagement(prev => {
        const updated = { ...prev };
        if (updated[orderToComplete.tableNumber] && updated[orderToComplete.tableNumber].orders <= 1) {
          updated[orderToComplete.tableNumber] = {
            ...updated[orderToComplete.tableNumber],
            status: 'available',
            orders: 0
          };
        } else if (updated[orderToComplete.tableNumber]) {
          updated[orderToComplete.tableNumber] = {
            ...updated[orderToComplete.tableNumber],
            orders: updated[orderToComplete.tableNumber].orders - 1
          };
        }
        return updated;
      });
      
      setPerformanceMetrics(prev => {
        const newTotal = prev.ordersCompleted + 1;
        const newAvgTime = ((prev.avgPrepTime * prev.ordersCompleted) + prepTimeMinutes) / newTotal;
        
        return {
          avgPrepTime: Math.round(newAvgTime * 10) / 10,
          ordersCompleted: newTotal,
          pendingOrders: prev.pendingOrders - 1
        };
      });
      
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'order_complete',
          orderId,
          completedAt: now.toISOString(),
          preparationTime: prepTimeMinutes
        }));
        
        logger.info('Order completion sent to server', { 
          orderId, 
          preparationTime: prepTimeMinutes 
        });
      }
      
      logger.info('Order completed successfully', { orderId, preparationTime: prepTimeMinutes });
    } catch (error) {
      errorHandler.handleError(
        error instanceof Error ? error : new Error(String(error)),
        {
          severity: ErrorSeverity.MEDIUM,
          category: ErrorCategory.SYSTEM,
          userMessage: 'Failed to complete order'
        }
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'rush':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTimeElapsed = (createdAt: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins === 1) {
      return '1 minute ago';
    } else {
      return `${diffMins} minutes ago`;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Kitchen Display System</h1>
        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded-full text-white text-sm ${
            connectionStatus === 'connected' ? 'bg-success' : 
            connectionStatus === 'reconnecting' ? 'bg-warning' : 'bg-danger'
          }`}>
            {connectionStatus === 'connected' ? 'Connected' : 
             connectionStatus === 'reconnecting' ? 'Reconnecting...' : 'Disconnected'}
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>
      
      {/* Station Filter and Performance Metrics */}
      <div className="flex flex-col md:flex-row justify-between mb-6 bg-white p-4 rounded-lg shadow">
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-medium mb-2">Filter by Station</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStation('all')}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedStation === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              All Stations
            </button>
            <button
              onClick={() => setSelectedStation('grill')}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedStation === 'grill' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Grill
            </button>
            <button
              onClick={() => setSelectedStation('fryer')}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedStation === 'fryer' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Fryer
            </button>
            <button
              onClick={() => setSelectedStation('cold_prep')}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedStation === 'cold_prep' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Cold Prep
            </button>
            <button
              onClick={() => setSelectedStation('drinks')}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedStation === 'drinks' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Drinks
            </button>
            <button
              onClick={() => setSelectedStation('dessert')}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedStation === 'dessert' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Dessert
            </button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Performance Metrics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-500">Avg. Prep Time</p>
              <p className="text-xl font-bold">{performanceMetrics.avgPrepTime} min</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-xl font-bold">{performanceMetrics.ordersCompleted}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-bold">{performanceMetrics.pendingOrders}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Table Management */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">Table Status</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(tableManagement).map(([tableNumber, tableData]) => (
            <div 
              key={tableNumber}
              className={`px-4 py-2 rounded-md border ${
                tableData.status === 'active' 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-green-300 bg-green-50'
              }`}
            >
              <p className="font-medium">{tableNumber}</p>
              <p className="text-xs text-gray-500">
                {tableData.status === 'active' 
                  ? `${tableData.orders} order${tableData.orders > 1 ? 's' : ''}` 
                  : 'Available'}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {orders
          .filter(order => 
            selectedStation === 'all' || 
            order.items.some(item => item.station === selectedStation)
          )
          .map(order => (
          <div 
            key={order.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-blue-500"
          >
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Table {order.tableNumber}</h3>
                <p className="text-sm text-gray-500">{getTimeElapsed(order.createdAt)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(order.priority)}`}>
                  {order.priority.toUpperCase()}
                </span>
                <span className="text-sm font-medium">
                  Est: {order.estimatedTime} min
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <ul className="space-y-3">
                {order.items.map(item => (
                  <li key={item.id} className="flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="ml-2 text-sm text-gray-500">x{item.quantity}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                    
                    {item.notes && (
                      <p className="text-sm text-gray-500 italic mb-2">{item.notes}</p>
                    )}
                    
                    <div className="flex space-x-2 mt-1">
                      <button
                        onClick={() => handleStatusChange(order.id, item.id, 'pending')}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.status === 'pending' 
                            ? 'bg-yellow-500 text-white' 
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.id, item.id, 'preparing')}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.status === 'preparing' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        }`}
                      >
                        Preparing
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.id, item.id, 'ready')}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.status === 'ready' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        Ready
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.id, item.id, 'delivered')}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.status === 'delivered' 
                            ? 'bg-gray-500 text-white' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        Delivered
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 border-t flex justify-between">
              <button 
                onClick={() => handleCompleteOrder(order.id)}
                className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
              >
                Complete Order
              </button>
              <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">
                Print Ticket
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {orders.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Orders</h3>
            <p className="text-gray-500">
              When new orders are placed, they will appear here for kitchen staff to process.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenDisplay;
