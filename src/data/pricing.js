const BASE_PRICE_PER_KG = 120

const ROUTE_MULTIPLIERS = {
  神戸: 1.0,
  那覇: 1.6,
  福岡: 1.2,
}

const CAPACITY_DISCOUNTS = {
  high: 0.85,   // 空き70%以上
  medium: 1.0,
  low: 1.3,     // 空き30%未満
}

export function calcPricePerKg(flight, product, capacityPercent) {
  const route = ROUTE_MULTIPLIERS[flight.arrivalCity] ?? 1.0
  const surcharge = product.surcharge ?? 1.0

  let capacityFactor
  if (capacityPercent < 30) capacityFactor = CAPACITY_DISCOUNTS.low
  else if (capacityPercent > 70) capacityFactor = CAPACITY_DISCOUNTS.high
  else capacityFactor = CAPACITY_DISCOUNTS.medium

  return Math.round(BASE_PRICE_PER_KG * route * surcharge * capacityFactor)
}

export function calcTotal(pricePerKg, boxes, product) {
  const totalKg = boxes * product.box.weight
  return { totalKg, totalPrice: pricePerKg * totalKg }
}
