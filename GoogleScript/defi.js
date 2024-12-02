function getBeefyAverageApy(url, days=30) {
    var vaultMatch = url.match(/vault\/([^/]+)/);
    if (!vaultMatch) {
        return "Invalid URL: Vault ID not found.";
    }
    var vault = vaultMatch[1];

    var response = UrlFetchApp.fetch("https://data.beefy.finance/api/v2/apys?vault=" + vault + "&bucket=1d_1Y");
    var data = JSON.parse(response.getContentText());

    var recentData = data.filter(function(item) {
        var timestamp = item.t * 1000; // Convert to milliseconds
        return Date.now() - timestamp <= days * 24 * 60 * 60 * 1000; // Last 90 days
    });

    if (recentData.length === 0) {
        return "No recent data available for this vault.";
    }

    var averageAPY = recentData.reduce(function(sum, item) {
        return sum + item.v;
    }, 0) / recentData.length;

    return averageAPY;
}

function getDefillamaAverageApy(url, days) {
    // Default days to 30 if not provided
    days = days || 30;

    // Step 1: Extract the pool ID from the URL
    var poolIdMatch = url.match(/pool\/([a-f0-9-]+)/);
    if (!poolIdMatch) {
        throw new Error("Invalid URL: Pool ID not found.");
    }
    var poolId = poolIdMatch[1];

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
    var recentData = jsonResponse.data.filter(function(item) {
        var timestamp = new Date(item.timestamp).getTime(); // Convert to milliseconds
        return now.getTime() - timestamp <= daysInMilliseconds; // Filter for the last 'days' days
    });

    if (recentData.length === 0) {
        return "No recent data available for this pool.";
    }

    var averageAPY = recentData.reduce(function(sum, item) {
        return sum + item.apy;
    }, 0) / recentData.length;

    return averageAPY / 100;
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
