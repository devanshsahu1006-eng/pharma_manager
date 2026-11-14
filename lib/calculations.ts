export function roundTo2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function calculateGST(price: number, gstPercentage: number): number {
  return roundTo2((price * gstPercentage) / 100);
}

export function calculateFinalPrice(price: number, gstAmount: number): number {
  return roundTo2(price + gstAmount);
}

export function calculateProfit(sellingPrice: number, purchasePrice: number, quantity: number): number {
  return roundTo2((sellingPrice - purchasePrice) * quantity);
}

export function calculateMargin(sellingPrice: number, purchasePrice: number): number {
  if (sellingPrice === 0) return 0;
  return roundTo2(((sellingPrice - purchasePrice) / sellingPrice) * 100);
}
