/**
 * Function to get the price of a cryptocurrency from CoinMarketCap.
 * @param {string} name - The cryptocurrency name (e.g., "bitcoin", "ethereum").
 * @return {string|null} - The price of the cryptocurrency as a string, or null if not found.
 */
function coinmarketcap(name) {
  // Construct the URL using the cryptocurrency name
  const url = `https://coinmarketcap.com/currencies/${name}`;
  
  try {
    // Fetch the HTML content of the CoinMarketCap page
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const html = response.getContentText();
    
    // Use a regular expression to extract the price using the `data-test` attribute
    const priceRegex = /<span[^>]*data-test="text-cdp-price-display"[^>]*>([^<]+)<\/span>/;
    const match = html.match(priceRegex);
    
    // If a match is found, return the price
    if (match && match[1]) {
      return match[1].trim(); // Trim any extra whitespace
    } else {
      // If the price wasn't found, return null
      return "N/A"
    }
  } catch (error) {
    throw Error(`Error fetching price for ${name}: ${error.message}`)
  }
}