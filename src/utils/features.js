export const getLastMonths = () => {
  const currentDate = new Date();
  currentDate.setDate(1);

  const last6Months = [];
  const last12Months = [];

  for (let i = 0; i < 6; i++) {
    const monthDate = new Date(currentDate);
    monthDate.setMonth(monthDate.getMonth() - i);
    const monthName = monthDate.toLocaleString('default', { month: 'long' });
    last6Months.unshift(monthName);
  }

  for (let i = 0; i < 12; i++) {
    const monthDate = new Date(currentDate);
    monthDate.setMonth(monthDate.getMonth() - i);
    const monthName = monthDate.toLocaleString('default', { month: 'long' });
    last12Months.unshift(monthName);
  }

  return {
    last12Months,
    last6Months,
  };
};
