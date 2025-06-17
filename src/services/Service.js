
const fakeShippingData = {
  SH87556849: {
    recipient: 'Victor',
    contact: '+7977-797-02-28',
    address: '4 Lesnaya St, Peski, Kolomensky, Moscow, RU',
    method: 'Express (2-3 days)',
    status: 'Pending Payment',
    trackingId: 'SH87556849',
    orderSummary: {
      shippingFee: { amount: 350.99, paid: true },
      clearance: { amount: 265.00, paid: false },
      tax: { amount: 23.22, paid: false },
      total: 288.22
    }
  },
  SHIP67890: {
    recipient: 'Jane Smith',
    contact: '(555) 987-6543',
    address: '456 Sunset Blvd, Los Angeles, CA',
    method: 'Standard (5-7 days)',
    status: 'Pending Payment',
    trackingId: 'TRK987654321',
    orderSummary: {
      shippingFee: { amount: 10.00, paid: true },
      clearance: { amount: 3.00, paid: false },
      tax: { amount: 2.00, paid: true },
      total: 15.00
    },
    SH87577841: {
    recipient: 'Shinya Ohno',
    contact: '----',
    address: 'Tokyo Kikaku Co., Ltd. 2-6-1 Shinobu, Gyoda-shi Saitama 361-0077 JAPAN',
    method: 'Express (2-3 days)',
    status: 'In Transit',
    trackingId: 'SH87577841',
    orderSummary: {
      shippingFee: { amount: 350.99, paid: true },
      clearance: { amount: 265.00, paid: false },
      tax: { amount: 23.22, paid: false },
      total: 288.22
    }
  }
};

export const getShippingDetails = async (shippingNumber) => {
  // simulate async (could be fetch from API or Firebase etc)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const details = fakeShippingData[shippingNumber];
      if (details) {
        // Format the total with currency symbol
        const formattedDetails = {
          ...details,
          total: `$${details.orderSummary.total.toFixed(2)}`
        };
        resolve(formattedDetails);
      }
      else reject(new Error('Shipping number not found.'));
    }, 500);
  });
};
