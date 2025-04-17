import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import TransactionModal from '../components/modals/TransactionModal';
import ExpenseModal from '../components/modals/ExpenseModal';
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';

interface Transaction {
  id: number;
  date: string;
  type: 'sale' | 'expense';
  amount: number;
  description: string;
  paymentMethod: string;
  reference: string;
}

interface Expense {
  id: number;
  date: string;
  category: string;
  amount: number;
  description: string;
  paymentMethod: string;
  reference: string;
  status: 'pending' | 'approved' | 'rejected';
}

const Accounting: React.FC = () => {
  const { isOffline } = useSelector((state: RootState) => state.ui);
  const [activeTab, setActiveTab] = useState<'transactions' | 'expenses' | 'reports'>('transactions');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'custom'>('today');
  
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Partial<Transaction> | null>(null);
  const [currentExpense, setCurrentExpense] = useState<Partial<Expense> | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; type: string; name: string } | null>(null);
  
  const [demoTransactions, setDemoTransactions] = useState<Transaction[]>([
    { id: 1, date: '2025-04-17', type: 'sale', amount: 2500, description: 'Order #1001', paymentMethod: 'mpesa', reference: 'MPESA123456' },
    { id: 2, date: '2025-04-17', type: 'sale', amount: 1800, description: 'Order #1002', paymentMethod: 'cash', reference: '' },
    { id: 3, date: '2025-04-17', type: 'expense', amount: -5000, description: 'Supplier payment', paymentMethod: 'mpesa', reference: 'MPESA654321' },
    { id: 4, date: '2025-04-16', type: 'sale', amount: 3200, description: 'Order #1000', paymentMethod: 'card', reference: 'CARD987654' },
    { id: 5, date: '2025-04-16', type: 'expense', amount: -1200, description: 'Utilities', paymentMethod: 'mpesa', reference: 'MPESA789012' },
  ]);
  
  const [demoExpenses, setDemoExpenses] = useState<Expense[]>([
    { id: 1, date: '2025-04-17', category: 'Inventory', amount: 5000, description: 'Supplier payment', paymentMethod: 'mpesa', reference: 'MPESA654321', status: 'approved' },
    { id: 2, date: '2025-04-16', category: 'Utilities', amount: 1200, description: 'Electricity bill', paymentMethod: 'mpesa', reference: 'MPESA789012', status: 'approved' },
    { id: 3, date: '2025-04-15', category: 'Rent', amount: 15000, description: 'Monthly rent', paymentMethod: 'bank', reference: 'BANK123456', status: 'approved' },
    { id: 4, date: '2025-04-14', category: 'Salaries', amount: 25000, description: 'Staff salaries', paymentMethod: 'bank', reference: 'BANK654321', status: 'pending' },
    { id: 5, date: '2025-04-13', category: 'Maintenance', amount: 2000, description: 'Kitchen equipment repair', paymentMethod: 'cash', reference: '', status: 'approved' },
  ]);
  
  const filteredTransactions = demoTransactions.filter(transaction => {
    return true; // Show all for demo
  });
  
  const filteredExpenses = demoExpenses.filter(expense => {
    return true; // Show all for demo
  });
  
  const handleAddTransaction = () => {
    setCurrentTransaction(null);
    setIsTransactionModalOpen(true);
  };
  
  const handleEditTransaction = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setIsTransactionModalOpen(true);
  };
  
  const handleAddExpense = () => {
    setCurrentExpense(null);
    setIsExpenseModalOpen(true);
  };
  
  const handleEditExpense = (expense: Expense) => {
    setCurrentExpense(expense);
    setIsExpenseModalOpen(true);
  };
  
  const handleDeleteConfirmation = (id: number, type: string, name: string) => {
    setItemToDelete({ id, type, name });
    setIsDeleteModalOpen(true);
  };
  
  const handleSaveTransaction = (transaction: Partial<Transaction>) => {
    if (transaction.id) {
      setDemoTransactions(demoTransactions.map(item => 
        item.id === transaction.id ? { ...item, ...transaction } as Transaction : item
      ));
    } else {
      const newTransaction = {
        ...transaction,
        id: Math.max(0, ...demoTransactions.map(t => t.id)) + 1
      } as Transaction;
      
      setDemoTransactions([newTransaction, ...demoTransactions]);
    }
    
    setIsTransactionModalOpen(false);
  };
  
  const handleSaveExpense = (expense: Partial<Expense>) => {
    if (expense.id) {
      setDemoExpenses(demoExpenses.map(item => 
        item.id === expense.id ? { ...item, ...expense } as Expense : item
      ));
    } else {
      const newExpense = {
        ...expense,
        id: Math.max(0, ...demoExpenses.map(e => e.id)) + 1
      } as Expense;
      
      setDemoExpenses([newExpense, ...demoExpenses]);
    }
    
    setIsExpenseModalOpen(false);
  };
  
  const handleDelete = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'transaction') {
      setDemoTransactions(demoTransactions.filter(item => item.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'expense') {
      setDemoExpenses(demoExpenses.filter(item => item.id !== itemToDelete.id));
    }
    
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };
  
  const totalSales = demoTransactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = demoTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netIncome = totalSales + totalExpenses; // expenses are negative
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Accounting</h1>
        <div className={`px-3 py-1 rounded-full text-white text-sm ${isOffline ? 'bg-warning' : 'bg-success'}`}>
          {isOffline ? 'Offline Mode' : 'Online'}
        </div>
      </div>
      
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-text-light text-sm font-medium">Total Sales</h3>
          <p className="text-2xl font-bold mt-2 text-success">KES {totalSales.toFixed(2)}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-text-light text-sm font-medium">Total Expenses</h3>
          <p className="text-2xl font-bold mt-2 text-danger">KES {Math.abs(totalExpenses).toFixed(2)}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-text-light text-sm font-medium">Net Income</h3>
          <p className={`text-2xl font-bold mt-2 ${netIncome >= 0 ? 'text-success' : 'text-danger'}`}>
            KES {netIncome.toFixed(2)}
          </p>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'transactions'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-light hover:text-text hover:border-gray-300'
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'expenses'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-light hover:text-text hover:border-gray-300'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reports'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-light hover:text-text hover:border-gray-300'
            }`}
          >
            Reports
          </button>
        </nav>
      </div>
      
      {/* Filters and Actions */}
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setDateRange('today')}
            className={`px-3 py-1 rounded-md text-sm ${
              dateRange === 'today'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-text hover:bg-gray-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateRange('week')}
            className={`px-3 py-1 rounded-md text-sm ${
              dateRange === 'week'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-text hover:bg-gray-200'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setDateRange('month')}
            className={`px-3 py-1 rounded-md text-sm ${
              dateRange === 'month'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-text hover:bg-gray-200'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setDateRange('custom')}
            className={`px-3 py-1 rounded-md text-sm ${
              dateRange === 'custom'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-text hover:bg-gray-200'
            }`}
          >
            Custom
          </button>
        </div>
        
        <div>
          <button 
            onClick={() => {
              if (activeTab === 'transactions') handleAddTransaction();
              else if (activeTab === 'expenses') handleAddExpense();
            }}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            {activeTab === 'transactions' && 'New Transaction'}
            {activeTab === 'expenses' && 'New Expense'}
            {activeTab === 'reports' && 'Generate Report'}
          </button>
        </div>
      </div>
      
      {/* Content based on active tab */}
      <div className="bg-white shadow overflow-hidden rounded-md">
        {activeTab === 'transactions' && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Payment Method
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Reference
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {demoTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text">{transaction.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text">{transaction.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.type === 'sale' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text capitalize">{transaction.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text">{transaction.reference || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${transaction.amount >= 0 ? 'text-success' : 'text-danger'}`}>
                      KES {Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEditTransaction(transaction)} 
                      className="text-primary hover:text-primary-dark mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteConfirmation(transaction.id, 'transaction', transaction.description)} 
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
        
        {activeTab === 'expenses' && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Payment Method
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {demoExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text">{expense.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text">{expense.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text">{expense.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text capitalize">{expense.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      expense.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-danger">
                      KES {expense.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEditExpense(expense)} 
                      className="text-primary hover:text-primary-dark mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteConfirmation(expense.id, 'expense', expense.description)} 
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
        
        {activeTab === 'reports' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Sales Report</h3>
                <button className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                  Generate Sales Report
                </button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Expense Report</h3>
                <button className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                  Generate Expense Report
                </button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Profit and Loss Statement</h3>
                <button className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                  Generate P and L Statement
                </button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Inventory Valuation</h3>
                <button className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                  Generate Inventory Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <TransactionModal 
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSave={handleSaveTransaction}
        transaction={currentTransaction}
      />
      
      <ExpenseModal 
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={handleSaveExpense}
        expense={currentExpense}
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

export default Accounting;
