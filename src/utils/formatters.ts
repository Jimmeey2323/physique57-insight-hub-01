<<<<<<< HEAD
=======

>>>>>>> d8ca8b48532b3896a0d456fb80d7b6032addc6e7
export const formatCurrency = (value: number): string => {
  const absValue = Math.abs(value);
  
  if (absValue >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  } else if (absValue >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  } else if (absValue >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  
  return `₹${value.toLocaleString('en-IN')}`;
};

export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

export const formatNumber = (value: number): string => {
  return value.toLocaleString('en-IN');
};
