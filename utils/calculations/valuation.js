export function calculateValuation({ totalPricePaid, superArea, projectType }) {
  const price = Number(totalPricePaid) || 10000000;
  const area = Number(superArea) || 2500;
  const purchaseRate = Math.round(price / area);

  // Simulated 4-source median logic
  const src1 = Math.round(purchaseRate * 1.08);
  const src2 = Math.round(purchaseRate * 1.15);
  const src3 = Math.round(purchaseRate * 1.1);
  const src4 = Math.round(purchaseRate * 0.72);
  
  const sources = [src1, src2, src3, src4].sort((a, b) => a - b);
  const medianRate = Math.round((sources[1] + sources[2]) / 2);
  const currentMarketValue = medianRate * area;
  
  const gain = currentMarketValue - price;
  const gainPct = ((gain / price) * 100).toFixed(1);

  // Fallback image based on type
  const image =
    projectType === "Commercial"
      ? "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
      : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80";

  return {
    price,
    purchaseRate,
    medianRate,
    currentMarketValue,
    gain,
    gainPct,
    image,
  };
}
