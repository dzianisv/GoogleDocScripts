/**
 * Returns the APR (Annual Percentage Rate) for a given pool address from Palette Finance
 * @param {string} pool_address The pool address to look up
 * @return {number} The APR value as a decimal (e.g., 0.0791 for 7.91%)
 * @customfunction
 */
function palette_yield(pool_address) {
  // API endpoint
  const url = "https://yield.palette.finance/api/v1/pools/?address=" + pool_address;
  
  try {
    // Make the HTTP request
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    
    // Check if we have items and the first item has info with apr
    if (data.items && data.items.length > 0 && data.items[0].info && data.items[0].info.apr !== undefined) {
      return data.items[0].info.apr / 100;
    } else {
      throw new Error("No APR data found for the given pool address");
    }
  } catch (error) {
    // Return error message if something goes wrong
    return "Error: " + error.message;
  }
}

function test_dedust_pool() {
  console.log(palette_yield("EQA-X_yo3fzzbDbJ_0bzFWKqtRuZFIRa1sJsveZJ1YpViO3r"))
}
