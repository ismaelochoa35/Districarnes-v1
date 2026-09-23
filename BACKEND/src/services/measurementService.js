const KG_PER_LB = 0.45359237;

function convertToBaseQuantity(quantity, saleUnit, baseUnit) {
  if (baseUnit === 'unidad') {
    return saleUnit === 'unidad' && Number.isInteger(quantity) ? quantity : NaN;
  }
  if (!['g', 'kg', 'lb'].includes(saleUnit)) return NaN;

  const kilograms = saleUnit === 'g'
    ? quantity / 1000
    : saleUnit === 'lb'
      ? quantity * KG_PER_LB
      : quantity;
  const baseQuantity = baseUnit === 'lb' ? kilograms / KG_PER_LB : kilograms;
  return Number(baseQuantity.toFixed(3));
}

module.exports = { convertToBaseQuantity };
