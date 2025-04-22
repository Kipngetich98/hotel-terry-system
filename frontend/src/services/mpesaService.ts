/**
 * M-Pesa payment integration service
 * Handles STK push requests and payment status checking
 * This is a simulation service for demonstration purposes only
 */

import logger from '../utils/logger';
import errorHandler, { ErrorCategory, ErrorSeverity } from '../utils/errorHandler';

interface MpesaSTKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

interface MpesaSTKPushStatusResponse {
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: string;
  ResultDesc: string;
}

interface MpesaConfig {
  paybillNumber: string;
  callbackUrl: string;
  baseUrl: string;
}

/**
 * M-Pesa Service - Simulated implementation
 * In a production environment, this would integrate with the actual M-Pesa API
 * using proper authentication and secure credential management
 */
class MpesaService {
  private static instance: MpesaService;
  private config: MpesaConfig;
  
  private ongoingTransactions: Map<string, {
    phoneNumber: string;
    amount: number;
    timestamp: Date;
    callback?: (success: boolean, transactionId?: string) => void;
  }> = new Map();

  private constructor() {
    this.config = {
      paybillNumber: import.meta.env.VITE_MPESA_PAYBILL_NUMBER || 'DEMO_PAYBILL',
      callbackUrl: import.meta.env.VITE_MPESA_CALLBACK_URL || '/api/mpesa/callback',
      baseUrl: import.meta.env.VITE_MPESA_API_BASE_URL || '/api/mpesa',
    };
  }

  /**
   * Get the singleton instance of the M-Pesa service
   */
  public static getInstance(): MpesaService {
    if (!MpesaService.instance) {
      MpesaService.instance = new MpesaService();
    }
    return MpesaService.instance;
  }

  /**
   * Update M-Pesa configuration
   */
  public configure(config: Partial<MpesaConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Initiate STK push to customer's phone
   * This is a simulated implementation for demonstration purposes
   */
  public async initiateSTKPush(
    phoneNumber: string, 
    amount: number, 
    reference: string,
    callback?: (success: boolean, transactionId?: string) => void
  ): Promise<{ success: boolean; requestId?: string; message: string }> {
    try {
      logger.info('Initiating M-Pesa STK push', { 
        phoneNumber, 
        amount, 
        reference 
      });

      if (!this.validatePhoneNumber(phoneNumber)) {
        const error = errorHandler.createValidationError(
          'Invalid phone number format',
          undefined,
          { 
            userMessage: 'Please enter a valid Kenyan phone number',
            severity: ErrorSeverity.LOW
          }
        );
        logger.warn('M-Pesa validation error', { error: error.message });
        return { success: false, message: error.metadata.userMessage || error.message };
      }

      const requestId = this.generateRequestId();
      
      this.ongoingTransactions.set(requestId, {
        phoneNumber,
        amount,
        timestamp: new Date(),
        callback
      });

      await new Promise(resolve => setTimeout(resolve, 1500));

      const response: MpesaSTKPushResponse = {
        MerchantRequestID: requestId,
        CheckoutRequestID: this.generateRequestId(),
        ResponseCode: '0',
        ResponseDescription: 'Success. Request accepted for processing',
        CustomerMessage: 'Success. Request accepted for processing'
      };

      logger.info('M-Pesa STK push initiated successfully', { 
        requestId: response.MerchantRequestID,
        responseCode: response.ResponseCode
      });

      this.checkTransactionStatus(requestId);

      return { 
        success: true, 
        requestId: response.MerchantRequestID, 
        message: 'STK push sent to your phone. Please enter your M-Pesa PIN to complete payment.' 
      };
    } catch (error) {
      const appError = errorHandler.handleError(
        error instanceof Error ? error : new Error(String(error)),
        {
          severity: ErrorSeverity.HIGH,
          category: ErrorCategory.PAYMENT,
          userMessage: 'Failed to initiate M-Pesa payment. Please try again.'
        }
      );
      
      logger.error('M-Pesa STK push failed', appError);
      return { success: false, message: appError.metadata.userMessage || 'Payment processing failed' };
    }
  }

  /**
   * Check the status of an STK push transaction
   * This is a simulated implementation for demonstration purposes
   */
  private async checkTransactionStatus(requestId: string): Promise<void> {
    try {
      const transaction = this.ongoingTransactions.get(requestId);
      if (!transaction) {
        logger.warn('Transaction not found for status check', { requestId });
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 5000));

      const isSuccessful = Math.random() < 0.8;
      
      if (isSuccessful) {
        logger.info('M-Pesa transaction completed successfully', { 
          requestId,
          phoneNumber: transaction.phoneNumber,
          amount: transaction.amount
        });

        const transactionId = `MPESA-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        
        if (transaction.callback) {
          transaction.callback(true, transactionId);
        }
      } else {
        logger.warn('M-Pesa transaction failed or was cancelled by user', { 
          requestId,
          phoneNumber: transaction.phoneNumber
        });
        
        if (transaction.callback) {
          transaction.callback(false);
        }
      }

      this.ongoingTransactions.delete(requestId);
    } catch (error) {
      logger.error('Error checking M-Pesa transaction status', error instanceof Error ? error : new Error(String(error)));
      
      const transaction = this.ongoingTransactions.get(requestId);
      if (transaction?.callback) {
        transaction.callback(false);
      }
      
      this.ongoingTransactions.delete(requestId);
    }
  }

  /**
   * Validate a Kenyan phone number
   */
  private validatePhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^(?:254|\+254|0)?(7[0-9]{8})$/;
    return phoneRegex.test(phoneNumber);
  }

  /**
   * Generate a unique request ID
   */
  private generateRequestId(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
  }
}

export const mpesaService = MpesaService.getInstance();

export function getMpesaService(): MpesaService {
  return MpesaService.getInstance();
}

export default mpesaService;
