function quoteFinviz(ticker) {
    try {
      // Fetch the HTML content of the Finviz page for the given ticker
      const url = `https://finviz.com/quote.ashx?t=${ticker}&p=d`;
      const response = UrlFetchApp.fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
        }
      });
  
      // Get the content as text
      const html = response.getContentText();
  
      // Extract the price from the <strong class="quote-price_wrapper_price"> tag
      const regex = /<strong class="quote-price_wrapper_price">([\d.]+)<\/strong>/;
      const match = html.match(regex);
  
      if (match && match[1]) {
        // Return the extracted price
        return parseFloat(match[1]);
      } else {
        throw new Error('Price not found on the page. The structure might have changed.');
      }
    } catch (error) {
      // Log and return the error message
      console.error(`Error fetching price for ${ticker}: ${error.message}`);
      return `Error: ${error.message}`;
    }
  }