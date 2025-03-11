function getBeefyAverageApy(url, days = 30) {
    let cache = CacheService.getScriptCache();

    // Extract vault ID from the URL
    var vaultMatch = url.match(/vault\/([^/]+)/);
    if (!vaultMatch) {
        return "Invalid URL: Vault ID not found.";
    }
    var vault = vaultMatch[1];

    // Try to get cached data
    var cacheKey = "beefyApy_" + vault;
    var cachedData = cache.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData).averageAPY; 
    }

    try {
        // Fetch new data from the API
        var response = UrlFetchApp.fetch("https://data.beefy.finance/api/v2/apys?vault=" + vault + "&bucket=1d_1Y");
        var data = JSON.parse(response.getContentText());

        // Filter data to recent entries
        var recentData = data.filter(function(item) {
            var timestamp = item.t * 1000; // Convert to milliseconds
            return Date.now() - timestamp <= days * 24 * 60 * 60 * 1000;
        });

        if (recentData.length === 0) {
            return "No recent data available for this vault.";
        }

        // Calculate average APY
        var averageAPY = recentData.reduce(function(sum, item) {
            return sum + item.v;
        }, 0) / recentData.length;

        // Cache the result for a specific duration (e.g., 6 hours)
        cache.put(cacheKey, JSON.stringify({ averageAPY: averageAPY }), 21600); // 21600 seconds = 6 hours

        return averageAPY;
    } catch (error) {
        return "Failed to fetch APY data and no cache available.";
    }
}

function getDefillamaAverageApy(url, days) {
    // Default days to 30 if not provided
    days = days || 30;

    var cache = CacheService.getScriptCache();

    // Step 1: Extract the pool ID from the URL
    var poolIdMatch = url.match(/pool\/([a-f0-9-]+)/);
    if (!poolIdMatch) {
        throw new Error("Invalid URL: Pool ID not found.");
    }
    var poolId = poolIdMatch[1];

    // Generate a cache key specific to the pool and days
    var cacheKey = "defillamaApy_" + poolId + "_" + days;
    var cachedData = cache.get(cacheKey);

    // If cached data is available, return it
    if (cachedData) {
        return JSON.parse(cachedData).averageAPY;
    }

    try {
        // Step 2: Fetch JSON data from the endpoint
        var response = UrlFetchApp.fetch("https://yields.llama.fi/chart/" + poolId);
        var jsonResponse = JSON.parse(response.getContentText());

        // Check if the response status is success
        if (jsonResponse.status !== "success") {
            throw new Error("Failed to fetch data: " + jsonResponse.status);
        }

        // Step 3: Calculate the average APY for the last 'days' days
        var now = new Date();
        var daysInMilliseconds = days * 24 * 60 * 60 * 1000;
        var recentData = jsonResponse.data.filter(function (item) {
            var timestamp = new Date(item.timestamp).getTime(); // Convert to milliseconds
            return now.getTime() - timestamp <= daysInMilliseconds; // Filter for the last 'days' days
        });

        if (recentData.length === 0) {
            return "No recent data available for this pool.";
        }

        var averageAPY = recentData.reduce(function (sum, item) {
            return sum + item.apy;
        }, 0) / recentData.length;

        // Cache the result for a specific duration (e.g., 6 hours)
        cache.put(cacheKey, JSON.stringify({ averageAPY: averageAPY / 100 }), 21600); // 21600 seconds = 6 hours

        return averageAPY / 100;
    } catch (error) {
        return "Failed to fetch APY data and no cache available.";
    }
}

/**
 * Calculates the average APY based on a given URL and optional number of days.
 *
 * @param {string} url - The URL to check.
 * @param {number} [days=30] - The number of days to calculate the APY over (default: 30).
 * @return {number|string} The calculated APY or an error message.
 * @customfunction
 */
function getAverageApy(url, days = 30) {
  // Ensure the input is valid (url must be a string)
  if (typeof url !== "string") {
    return "Error: The provided URL is not a valid string.";
  }
  
  // Check if the URL starts with the expected prefix
  if (url.indexOf("https://app.beefy.com") === 0) {
    // Call the helper function to calculate the APY
    return getBeefyAverageApy(url, days);
  } else if (url.indexOf("https://defillama.com") == 0) {
    return getDefillamaAverageApy(url, days);
  } else {
    // Return an error message if the URL is not supported
    return "Error: Unsupported URL. Use URLs starting with 'https://app.beefy.com'.";
  }
}

/**
 * Function to get the price of a cryptocurrency from CoinMarketCap.
 * @param {string} name - The cryptocurrency name (e.g., "bitcoin", "ethereum").
 * @return {string|null} - The price of the cryptocurrency as a string, or null if not found.
 */
function quoteCoinmarketcap(name) {
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

function test1() {
  console.log(getAverageApy("https://app.beefy.com/vault/compound-base-usdc"));
  console.log(getAverageApy("https://defillama.com/yields/pool/e2f0e83e-e07b-44bd-9718-e25b96295468"));
}
