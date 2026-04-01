export const formatKHR = (amount) => {
  if (amount == null) return "0 ៛";

  // Formats the number with commas and appends the Cambodian Riel symbol (៛)
  return `${Number(amount).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })} ៛`;
};
