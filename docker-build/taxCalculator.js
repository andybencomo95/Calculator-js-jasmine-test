function calculateTax(amount, taxRate) {
  if (typeof amount !== 'number' || typeof taxRate !== 'number') {
    throw new Error('Amount and tax rate must be numbers');
  }
  if (amount < 0 || taxRate < 0) {
    throw new Error('Amount and tax rate must be non-negative');
  }
  const tax = amount * (taxRate / 100);
  return {
    amount: amount,
    taxRate: taxRate,
    tax: Math.round(tax * 100) / 100,
    total: Math.round((amount + tax) * 100) / 100
  };
}
