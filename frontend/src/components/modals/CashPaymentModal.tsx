/**
 * Cash Payment Modal Component
 * 
 * This component provides a user interface for processing cash payments.
 * It automatically generates a unique transaction reference code and
 * requires staff confirmation that cash has been physically collected.
 * 
 * The component handles:
 * - Automatic generation of unique transaction reference codes
 * - Two-step confirmation process for cash collection
 * - Visual feedback for payment confirmation
 * - Secure transaction recording
 */
import React, { useState, useEffect } from 'react';

interface CashPaymentModalProps {
  /**
   * The total amount to be paid (including tax)
   */
  amount: number;
  
  /**
   * Callback function triggered when payment is confirmed
   * @param transactionCode - Unique transaction reference code
   */
  onSubmit: (transactionCode: string) => void;
  
  /**
   * Callback function triggered when the user cancels the payment
   */
  onCancel: () => void;
}

const CashPaymentModal: React.FC<CashPaymentModalProps> = ({ 
  amount, 
  onSubmit,
  onCancel
}) => {
  const [transactionCode, setTransactionCode] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  /**
   * Generate a transaction code on component mount
   */
  useEffect(() => {
    generateTransactionCode();
  }, []);

  /**
   * Generates a unique transaction reference code for cash payments
   * 
   * The code format is: CSH-{timestamp}-{random}
   * - timestamp: Last 6 digits of current timestamp
   * - random: 4-digit random number padded with zeros
   * 
   * This ensures each transaction has a unique, traceable reference
   */
  const generateTransactionCode = () => {
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setTransactionCode(`CSH-${timestamp}-${random}`);
  };

  /**
   * Handles confirmation of cash payment receipt
   * 
   * This function:
   * 1. Updates the UI to show confirmation state
   * 2. Submits the transaction code to the parent component
   *    for processing and recording the payment
   */
  const handleConfirm = () => {
    setIsConfirmed(true);
    onSubmit(transactionCode);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Cash Payment</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
            disabled={isConfirmed}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <p className="text-gray-600 mb-2">Amount to collect:</p>
            <p className="text-2xl font-bold text-primary">KES {amount.toFixed(2)}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 mb-2">Transaction Reference:</p>
            <p className="text-xl font-mono font-bold text-gray-800">{transactionCode}</p>
            <p className="text-xs text-gray-500 mt-1">
              This is a unique reference code for this transaction.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {!isConfirmed ? (
            <>
              <p className="text-gray-700">
                Please confirm that you have collected the cash payment from the customer.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Confirm Payment Received
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Confirmed</h3>
              <p className="text-gray-600 mb-4">
                Cash payment has been recorded successfully.
              </p>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CashPaymentModal;
