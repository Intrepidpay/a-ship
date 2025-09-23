
const fakeShippingData = {
 SH82352287: {
    sender: 'Olivia Tooley',
    recipient: 'Ryo Kuratomi',
    contact: '+81 (80) 3788-7802',
    address: 'Apt 204 Gran Paseo/Primal, 2-17-46 Okubo, Shinjuku-ku, Tokyo 169-0072, Japan',
    method: 'Express (2-3 days)',
    status: 'In Transit',
    trackingId: 'SH82352287',
    orderSummary: {
      shippingFee: { amount: 350.99, paid: true },
      clearance: { amount: 265.00, paid: false },
      tax: { amount: 23.22, paid: false },
      total: 288.22
    }
   },
  SH82437295: {
    sender: 'Olivia Tooley',
    recipient: 'Satoru Ueno',
    contact: '+81 (90) 7716-1223',
    address: '4-13-3 Tatekawa Sumida-ku, Tokyo 130-0023 Japan',
    method: 'Express (2-3 days)',
    status: 'Pending Payment',
    trackingId: 'SH82437295',
    orderSummary: {
      shippingFee: { amount: 350.99, paid: true },
      clearance: { amount: 265.00, paid: false },
      tax: { amount: 23.22, paid: false },
      total: 288.22
   }
  },
  SH86737495: {
    sender: 'Olivia Tooley',
    recipient: 'Joey',
    contact: '+1 (478) 538-8354',
    address: '103 Witherspoon Court, Warner Robins, GA 31088, USA',
    method: 'Express (2-3 days)',
    status: 'Pending Payment',
    trackingId: 'SH86737495',
    orderSummary: {
      shippingFee: { amount: 350.99, paid: true },
      clearance: { amount: 285.00, paid: false },
      tax: { amount: 43.22, paid: false },
      total: 328.22
     }
    },
    SH82152286: {
    sender: 'Olivia Tooley',
    recipient: 'Hiromi Kubo',
    contact: '----',
    address: 'Prejiel 101, Sakaecho 4-166, Ushiku, Ibaraki 300-1233, Japan',
    method: 'Express (2-3 days)',
    status: 'In Transit',
    trackingId: 'SH82152286',
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













