import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    color: '#333333',
    fontFamily: 'Helvetica',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#00D4FF',
    paddingBottom: 15,
    marginBottom: 20,
  },
  pharmacyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#050E1A',
  },
  pharmacyInfo: {
    lineHeight: 1.4,
    color: '#555555',
  },
  invoiceTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#050E1A',
    textAlign: 'right',
  },
  invoiceMeta: {
    textAlign: 'right',
    marginTop: 4,
    lineHeight: 1.4,
  },
  customerSection: {
    marginBottom: 20,
    lineHeight: 1.4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#050E1A',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 3,
  },
  table: {
    width: 'auto',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingVertical: 6,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 2,
    borderBottomColor: '#E2E8F0',
  },
  col1: { width: '35%' },
  col2: { width: '15%' },
  col3: { width: '10%', textAlign: 'center' as const },
  col4: { width: '15%', textAlign: 'right' as const },
  col5: { width: '10%', textAlign: 'center' as const },
  col6: { width: '15%', textAlign: 'right' as const },
  tableHeaderText: {
    fontWeight: 'bold',
    color: '#475569',
  },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  qrCode: {
    width: 80,
    height: 80,
  },
  totalsContainer: {
    width: '40%',
    lineHeight: 1.6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#00D4FF',
    paddingTop: 5,
    marginTop: 5,
    fontWeight: 'bold',
  },
  signatureContainer: {
    marginTop: 40,
    alignItems: 'flex-end' as const,
  },
  signatureLine: {
    width: 150,
    borderTopWidth: 1,
    borderTopColor: '#999999',
    marginTop: 30,
    textAlign: 'center' as const,
    paddingTop: 5,
    color: '#666666',
  },
});

interface InvoiceProps {
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  sales: {
    name: string;
    batchNumber: string;
    quantity: number;
    sellingPrice: number;
    gstPercentage: number;
    total: number;
  }[];
  subtotal: number;
  totalGST: number;
  discount: number;
  finalAmount: number;
  qrCodeUrl?: string;
}

export const InvoiceDocument = ({
  invoiceNumber,
  date,
  customerName,
  customerPhone,
  sales,
  subtotal,
  totalGST,
  discount,
  finalAmount,
  qrCodeUrl,
}: InvoiceProps) => {
  return React.createElement(Document, {},
    React.createElement(Page, { size: 'A4', style: styles.page },
      React.createElement(View, { style: styles.headerContainer },
        React.createElement(View, {},
          React.createElement(Text, { style: styles.pharmacyName }, 'PharmaOS Rx Solutions'),
          React.createElement(Text, { style: styles.pharmacyInfo }, '128 Medical Center Blvd, Suite A'),
          React.createElement(Text, { style: styles.pharmacyInfo }, 'Boston, MA 02118'),
          React.createElement(Text, { style: styles.pharmacyInfo }, 'License No: RX-992-0012A')
        ),
        React.createElement(View, {},
          React.createElement(Text, { style: styles.invoiceTitle }, 'INVOICE'),
          React.createElement(Text, { style: styles.invoiceMeta }, `Invoice #: ${invoiceNumber}`),
          React.createElement(Text, { style: styles.invoiceMeta }, `Date: ${date}`)
        )
      ),

      React.createElement(View, { style: styles.customerSection },
        React.createElement(Text, { style: styles.sectionTitle }, 'BILL TO:'),
        React.createElement(Text, {}, `Customer: ${customerName || 'Walk-in Customer'}`),
        React.createElement(Text, {}, `Contact: ${customerPhone || 'N/A'}`)
      ),

      React.createElement(View, { style: styles.table },
        React.createElement(View, { style: [styles.tableRow, styles.tableHeader] },
          React.createElement(Text, { style: [styles.col1, styles.tableHeaderText] }, 'Medicine Item'),
          React.createElement(Text, { style: [styles.col2, styles.tableHeaderText] }, 'Batch'),
          React.createElement(Text, { style: [styles.col3, styles.tableHeaderText] }, 'Qty'),
          React.createElement(Text, { style: [styles.col4, styles.tableHeaderText] }, 'Price'),
          React.createElement(Text, { style: [styles.col5, styles.tableHeaderText] }, 'GST %'),
          React.createElement(Text, { style: [styles.col6, styles.tableHeaderText] }, 'Total')
        ),
        sales.map((item, index) =>
          React.createElement(View, { key: index, style: styles.tableRow },
            React.createElement(Text, { style: styles.col1 }, item.name),
            React.createElement(Text, { style: styles.col2 }, item.batchNumber),
            React.createElement(Text, { style: styles.col3 }, item.quantity),
            React.createElement(Text, { style: styles.col4 }, `Rs. ${item.sellingPrice.toFixed(2)}`),
            React.createElement(Text, { style: styles.col5 }, `${item.gstPercentage}%`),
            React.createElement(Text, { style: styles.col6 }, `Rs. ${item.total.toFixed(2)}`)
          )
        )
      ),
 
      React.createElement(View, { style: styles.summarySection },
        React.createElement(View, {},
          qrCodeUrl
            ? React.createElement(Image, { style: styles.qrCode, src: qrCodeUrl })
            : React.createElement(View, { style: styles.qrCode })
        ),
        React.createElement(View, { style: styles.totalsContainer },
          React.createElement(View, { style: styles.totalRow },
            React.createElement(Text, {}, 'Subtotal:'),
            React.createElement(Text, {}, `Rs. ${subtotal.toFixed(2)}`)
          ),
          React.createElement(View, { style: styles.totalRow },
            React.createElement(Text, {}, 'Total GST:'),
            React.createElement(Text, {}, `Rs. ${totalGST.toFixed(2)}`)
          ),
          React.createElement(View, { style: styles.totalRow },
            React.createElement(Text, {}, 'Discount:'),
            React.createElement(Text, {}, `-Rs. ${discount.toFixed(2)}`)
          ),
          React.createElement(View, { style: styles.grandTotalRow },
            React.createElement(Text, {}, 'Grand Total:'),
            React.createElement(Text, {}, `Rs. ${finalAmount.toFixed(2)}`)
          )
        )
      ),

      React.createElement(View, { style: styles.signatureContainer },
        React.createElement(Text, { style: styles.signatureLine }, 'Authorized Signature')
      )
    )
  );
};
