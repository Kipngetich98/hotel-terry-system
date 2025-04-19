/**
 * M-Pesa Payment Modal Component
 * 
 * This component provides a user interface for M-Pesa mobile money payments.
 * It offers two payment options:
 * 1. STK Push - Collects phone number and initiates an STK push request
 * 2. Manual Transaction Code - Allows entering M-Pesa transaction code manually
 * 
 * The component handles:
 * - Phone number validation for Kenyan numbers
 * - Number formatting to ensure compatibility with M-Pesa API
 * - M-Pesa transaction code validation
 * - Visual feedback during payment processing
 * - Error state management and user feedback
 */
import React, { useState } from 'react';

interface MpesaPaymentModalProps {
  /**
   * The total amount to be paid (including tax)
   */
  amount: number;
  
  /**
   * Callback function triggered when the user submits a valid phone number for STK push
   * @param phoneNumber - Formatted phone number (254XXXXXXXXX)
   */
  onSubmitStkPush: (phoneNumber: string) => Promise<void>;
  
  /**
   * Callback function triggered when the user submits a manual transaction code
   * @param transactionCode - M-Pesa transaction code (e.g., QKA12345XY)
   */
  onSubmitManualCode: (transactionCode: string) => Promise<void>;
  
  /**
   * Callback function triggered when the user cancels the payment
   */
  onCancel: () => void;
  
  /**
   * Flag indicating whether a payment is currently being processed
   * Used to disable inputs and show loading state
   */
  isProcessing: boolean;
}

type PaymentMethod = 'stk_push' | 'manual_code';

const MpesaPaymentModal: React.FC<MpesaPaymentModalProps> = ({ 
  amount, 
  onSubmitStkPush,
  onSubmitManualCode,
  onCancel,
  isProcessing
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stk_push');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transactionCode, setTransactionCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles form submission for M-Pesa STK push payment
   * 
   * This function:
   * 1. Validates the phone number using a regex for Kenyan mobile numbers
   * 2. Formats the phone number to the standard format required by M-Pesa API (254XXXXXXXXX)
   * 3. Calls the onSubmitStkPush callback with the formatted number
   * 
   * @param e - React form event
   */
  const handleStkPushSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const phoneRegex = /^(?:254|\+254|0)?(7[0-9]{8})$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Please enter a valid Kenyan phone number');
      return;
    }

    setError(null);
    
    // Format phone number to standard format (254XXXXXXXXX)
    let formattedNumber = phoneNumber;
    if (phoneNumber.startsWith('0')) {
      formattedNumber = '254' + phoneNumber.substring(1);
    } else if (!phoneNumber.startsWith('254') && !phoneNumber.startsWith('+254')) {
      formattedNumber = '254' + phoneNumber;
    } else if (phoneNumber.startsWith('+254')) {
      formattedNumber = phoneNumber.substring(1);
    }
    
    // Submit the formatted phone number
    onSubmitStkPush(formattedNumber);
  };

  /**
   * Handles form submission for manual M-Pesa transaction code
   * 
   * This function:
   * 1. Validates the transaction code format
   * 2. Calls the onSubmitManualCode callback with the transaction code
   * 
   * @param e - React form event
   */
  const handleManualCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionCode || transactionCode.length < 8) {
      setError('Please enter a valid M-Pesa transaction code');
      return;
    }

    setError(null);
    
    // Submit the transaction code
    onSubmitManualCode(transactionCode);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">M-Pesa Payment</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
            disabled={isProcessing}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            Complete your payment of:
          </p>
          <p className="text-xl font-bold text-primary mb-4">
            KES {amount.toFixed(2)}
          </p>
          
          <div className="flex border border-gray-300 rounded-md overflow-hidden mb-4">
            <button
              type="button"
              onClick={() => { setPaymentMethod('stk_push'); setError(null); }}
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                paymentMethod === 'stk_push'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              disabled={isProcessing}
            >
              STK Push
            </button>
            <button
              type="button"
              onClick={() => { setPaymentMethod('manual_code'); setError(null); }}
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                paymentMethod === 'manual_code'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              disabled={isProcessing}
            >
              Enter M-Pesa Code
            </button>
          </div>
        </div>

        {paymentMethod === 'stk_push' ? (
          <form onSubmit={handleStkPushSubmit} className="space-y-4">
            <div>
              <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone-number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. 0712345678"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                disabled={isProcessing}
                required
              />
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Enter your phone number in the format: 07XXXXXXXX, 254XXXXXXXXX, or +254XXXXXXXXX
              </p>
              <p className="mt-2 text-sm text-gray-600">
                An STK push will be sent to your phone to complete the payment.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Request STK Push'
                )}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleManualCodeSubmit} className="space-y-4">
            <div>
              <label htmlFor="transaction-code" className="block text-sm font-medium text-gray-700">
                M-Pesa Transaction Code
              </label>
              <input
                type="text"
                id="transaction-code"
                value={transactionCode}
                onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
                placeholder="e.g. QKA12345XY"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                disabled={isProcessing}
                required
              />
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Enter the M-Pesa transaction code you received after making the payment
              </p>
              <p className="mt-2 text-sm text-gray-600">
                If you've already paid via M-Pesa app or Paybill, enter the transaction code here.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Verify Payment'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MpesaPaymentModal;
