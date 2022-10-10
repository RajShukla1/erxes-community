import { Model } from 'mongoose';

import { PAYMENT_KINDS } from '../constants';
import { IModels } from '../connectionResolver';
import * as qpayUtils from '../api/qPay/utils';
import * as socialPayUtils from '../api/socialPay/utils';
import {
  IInvoice,
  IInvoiceDocument,
  invoiceSchema
} from './definitions/invoices';
import redisUtils from '../redisUtils';

export interface IInvoiceModel extends Model<IInvoiceDocument> {
  getInvoice(doc: any): IInvoiceDocument;
  createInvoice(doc: IInvoice): Promise<IInvoiceDocument>;
  cancelInvoice(_id: string): Promise<String>;
}

export const loadInvoiceClass = (models: IModels) => {
  class Invoices {
    public static async getInvoice(doc: any) {
      const invoice = await models.Invoices.findOne(doc);

      if (!invoice) {
        throw new Error('Invoice not found');
      }

      return invoice;
    }

    public static async createInvoice(doc: IInvoice) {
      if (!doc.amount && doc.amount === 0) {
        throw new Error('Amount is required');
      }

      if (!doc.paymentConfigId) {
        throw new Error('Payment config id is required');
      }

      const paymentConfig = await models.PaymentConfigs.getPaymentConfig(
        doc.paymentConfigId
      );

      const invoice = await models.Invoices.create(doc);

      try {
        switch (paymentConfig.kind) {
          case PAYMENT_KINDS.QPAY:
            // create qpay invoice
            invoice.apiResponse = await qpayUtils.createInvoice(
              invoice,
              paymentConfig
            );
            break;
          case PAYMENT_KINDS.SOCIAL_PAY:
            // create socialpay invoice
            invoice.apiResponse = await socialPayUtils.createInvoice(
              invoice,
              paymentConfig
            );
            break;
          default:
            break;
        }

        await invoice.save();

        return invoice;
      } catch (e) {
        // remove invoice if error
        models.Invoices.deleteOne({ _id: invoice._id });

        throw new Error(e.message);
      }
    }

    public static async cancelInvoice(_id: string) {
      const invoice = await models.Invoices.getInvoice({ _id });

      if (invoice.status !== 'pending') {
        throw new Error('Already settled');
      }

      const paymentConfig = await models.PaymentConfigs.getPaymentConfig(
        invoice.paymentConfigId
      );

      switch (paymentConfig.kind) {
        case PAYMENT_KINDS.QPAY:
          // cancel qpay invoice
          qpayUtils.cancelInvoice(
            invoice.apiResponse.invoice_id,
            paymentConfig
          );
          break;
        case PAYMENT_KINDS.SOCIAL_PAY:
          // cancel socialpay invoice
          socialPayUtils.cancelInvoice(invoice, paymentConfig);
          break;
        default:
          break;
      }

      await models.Invoices.deleteOne({ _id });

      redisUtils.removeInvoice(_id);

      return 'success';
    }
  }
  invoiceSchema.loadClass(Invoices);
  return invoiceSchema;
};
