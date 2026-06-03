export function convertToCrores(value, unit) {
  const num = Number(value);
  if (isNaN(num) || !value) return 0;
  switch (unit) {
    case '₹':
      return num / 10000000; // Rupees to Crores
    case 'Lakh':
      return num / 100; // Lakhs to Crores
    case 'Cr':
      return num; // Already Crores
    default:
      return num;
  }
}

// New helper: convert any unit to absolute Rupees
export function convertToRupees(value, unit) {
  const num = Number(value);
  if (isNaN(num) || !value) return 0;
  switch (unit) {
    case '₹':
      return num; // Rupees stay as is
    case 'Lakh':
      return num * 100000; // Lakhs to Rupees
    case 'Cr':
      return num * 10000000; // Crores to Rupees
    default:
      return num;
  }
}

