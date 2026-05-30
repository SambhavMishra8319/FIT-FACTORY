export const getMembershipStatus = (expiryDate) => {
  if (!expiryDate) return "pending";

  const today = new Date();
  today.setHours(0,0,0,0);

  const expiry = new Date(expiryDate);
  expiry.setHours(0,0,0,0);

  const diffDays = (expiry - today) / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return "expired";

  if (diffDays <= 7) return "expiring";

  return "active";
};