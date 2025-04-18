/**
 * M-Pesa Payment Modal Component
 * 
 * This component provides a user interface for M-Pesa mobile money payments.
 * It collects and validates the user's phone number, formats it to the required
 * standard format (254XXXXXXXXX), and initiates an STK push request.
 * 
 * The component handles:
 * - Phone number validation for Kenyan numbers
 * - Number formatting to ensure compatibility with M-Pesa API
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
   * Callback function triggered when the user submits a valid phone number
   * The function should initiate the M-Pesa STK push process
   * @param phoneNumber - Formatted phone number (254XXXXXXXXX)
   */
  onSubmit: (phoneNumber: string) => Promise<void>;
  
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

const MpesaPaymentModal: React.FC<MpesaPaymentModalProps> = ({ 
  amount, 
  onSubmit,
  onCancel,
  isProcessing
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles form submission for M-Pesa payment
   * 
   * This function:
   * 1. Validates the phone number using a regex for Kenyan mobile numbers
   * 2. Formats the phone number to the standard format required by M-Pesa API (254XXXXXXXXX)
   * 3. Calls the onSubmit callback with the formatted number
   * 
   * @param e - React form event
   */
  const handleSubmit = (e: React.FormEvent) => {
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
    onSubmit(formattedNumber);
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
            An STK push will be sent to your phone to complete the payment of:
          </p>
          <p className="text-xl font-bold text-primary">
            KES {amount.toFixed(2)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                'Pay with M-Pesa'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MpesaPaymentModal;
