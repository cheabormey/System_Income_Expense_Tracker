// formateNameById.js

/**
 * Formats a customer ID into a customer username.
 * * @param {String} id - The customerId from the invoice.
 * @param {Array} customersList - The array of fetched customer objects.
 * @returns {String} - The matching username or a fallback string.
 */
export const formatNameById = (id, customersList) => {
  // Return early if data is missing
  if (!id || !customersList || !Array.isArray(customersList)) {
    return "Unknown Customer";
  }

  // Find the customer where the _id matches the provided id
  const foundCustomer = customersList.find((c) => c._id === id);

  // Return the username if found, otherwise return a fallback
  return foundCustomer ? foundCustomer.username : "Unknown Customer";
};
