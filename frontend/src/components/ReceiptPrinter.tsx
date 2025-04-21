import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import logger from '../utils/logger';

interface ReceiptPrinterProps {
  orderId: number;
  tableNumber: string;
  items: Array<{
    menuItemId: number;
    menuItemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    customization?: {
      spiceLevel?: string;
      cookingPreference?: string;
      specialInstructions?: string;
    };
  }>;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  transactionReference: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  isKitchenTicket?: boolean;
}

const ReceiptPrinter: React.FC<ReceiptPrinterProps> = ({
  orderId,
  tableNumber,
  items,
  subtotal,
  tax,
  total,
  paymentMethod,
  transactionReference,
  paymentStatus,
  timestamp,
  isKitchenTicket = false
}) => {
  const printReceipt = () => {
    try {
      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        logger.error('Failed to open print window. Pop-up might be blocked.');
        return;
      }
      
      const receiptHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${isKitchenTicket ? 'Kitchen Ticket' : 'Receipt'} #${orderId}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              width: 300px;
              margin: 0 auto;
              padding: 10px;
            }
            .header {
              text-align: center;
              margin-bottom: 10px;
            }
            .title {
              font-size: 16px;
              font-weight: bold;
            }
            .info {
              margin: 5px 0;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 10px 0;
            }
            .item {
              display: flex;
              justify-content: space-between;
              margin: 5px 0;
            }
            .item-details {
              font-style: italic;
              margin-left: 15px;
              font-size: 10px;
            }
            .totals {
              margin-top: 10px;
              text-align: right;
            }
            .payment {
              margin-top: 10px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 10px;
            }
            .payment-status {
              text-align: center;
              margin: 10px 0;
              padding: 5px;
              font-weight: bold;
            }
            .status-completed {
              border: 1px solid #4CAF50;
              background-color: #E8F5E9;
            }
            .status-pending {
              border: 1px solid #FFC107;
              background-color: #FFF8E1;
            }
            .status-failed {
              border: 1px solid #F44336;
              background-color: #FFEBEE;
            }
            @media print {
              body {
                width: 100%;
                margin: 0;
                padding: 0;
              }
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">AUNTY'S COMFORT FOOD LIMITED</div>
            <div>${isKitchenTicket ? 'KITCHEN TICKET' : 'RECEIPT'}</div>
          </div>
          
          <div class="info">
            <div>Order #: ${orderId}</div>
            <div>Table: ${tableNumber}</div>
            <div>Date: ${timestamp.toLocaleDateString()}</div>
            <div>Time: ${timestamp.toLocaleTimeString()}</div>
          </div>
          
          <div class="divider"></div>
          
          <div>
            ${items.map(item => `
              <div class="item">
                <div>${item.quantity}x ${item.menuItemName}</div>
                <div>${isKitchenTicket ? '' : `KES ${item.totalPrice.toFixed(2)}`}</div>
              </div>
              ${item.customization ? `
                <div class="item-details">
                  ${item.customization.spiceLevel ? `Spice: ${item.customization.spiceLevel}` : ''}
                  ${item.customization.cookingPreference ? `Cook: ${item.customization.cookingPreference}` : ''}
                  ${item.customization.specialInstructions ? `Notes: ${item.customization.specialInstructions}` : ''}
                </div>
              ` : ''}
            `).join('')}
          </div>
          
          <div class="divider"></div>
          
          ${!isKitchenTicket ? `
            <div class="totals">
              <div>Subtotal: KES ${subtotal.toFixed(2)}</div>
              <div>Tax (16%): KES ${tax.toFixed(2)}</div>
              <div style="font-weight: bold;">Total: KES ${total.toFixed(2)}</div>
            </div>
            
            <div class="divider"></div>
            
            <div class="payment">
              <div>Payment Method: ${paymentMethod.toUpperCase()}</div>
              <div>Transaction Ref: ${transactionReference}</div>
            </div>
          ` : ''}
          
          <div class="payment-status status-${paymentStatus}">
            Payment Status: ${paymentStatus.toUpperCase()}
          </div>
          
          <div class="footer">
            Thank you for dining with us!<br>
            AUNTY'S COMFORT FOOD LIMITED<br>
            Tel: +254 700 000000
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <button onclick="window.print(); window.close();">Print ${isKitchenTicket ? 'Ticket' : 'Receipt'}</button>
          </div>
        </body>
        </html>
      `;
      
      printWindow.document.open();
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      
      printWindow.onload = function() {
        printWindow.print();
      };
      
      logger.info(`${isKitchenTicket ? 'Kitchen ticket' : 'Receipt'} printed for order #${orderId}`);
    } catch (error) {
      logger.error('Failed to print receipt');
    }
  };

  return (
    <button
      onClick={printReceipt}
      className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 flex items-center justify-center"
    >
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      Print {isKitchenTicket ? 'Ticket' : 'Receipt'}
    </button>
  );
};

export default ReceiptPrinter;
