function quoteYahoo(ticker) {
    const url = `https://finance.yahoo.com/quote/${ticker}`;
    
    try {
      // Fetch the HTML content of the Yahoo Finance page for the given ticker
      const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
      const html = response.getContentText();
      
      // Use a regex to dynamically match the 'data-symbol' and extract the 'data-value' for the ticker
      const priceRegex = new RegExp(`<fin-streamer[^>]*data-symbol="${ticker}"[^>]*data-value="([\\d.]+)"`);
      const match = html.match(priceRegex);
      
      if (match && match[1]) {
        return parseFloat(match[1]); // Return the extracted price as a number
      } else {
        return `${ticker} price is not found`;
      }
    } catch (error) {
      return `Error: ${error.message}`;
    }
  }