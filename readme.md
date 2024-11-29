# Google Script for Average APY Calculation

This Google Script provides functions to calculate the average Annual Percentage Yield (APY) for different vaults and pools from specified URLs. It supports fetching data from Beefy Finance and DeFi Llama.

## Features

- **Calculate Average APY**: Retrieve and calculate the average APY for a given vault or pool over a specified number of days.
- **Error Handling**: Provides meaningful error messages for invalid URLs or data fetching issues.
- **Custom Functionality**: Can be used as a custom function in Google Sheets.

## Functions

### 1. `getBeefyAverageApy(url, days=30)`

Calculates the average APY for a Beefy Finance vault.

- **Parameters**:
  - `url` (string): The URL of the Beefy vault.
  - `days` (number, optional): The number of days to calculate the APY over (default is 30).

- **Returns**: Average APY as a number or an error message.

### 2. `getDefillamaAverageApy(url, days)`

Calculates the average APY for a DeFi Llama pool.

- **Parameters**:
  - `url` (string): The URL of the DeFi Llama pool.
  - `days` (number, optional): The number of days to calculate the APY over (default is 30).

- **Returns**: Average APY as a number or an error message.

### 3. `getAverageApy(url, days=30)`

Main function to determine which APY calculation function to call based on the URL.

- **Parameters**:
  - `url` (string): The URL to check.
  - `days` (number, optional): The number of days to calculate the APY over (default is 30).

- **Returns**: Average APY as a number or an error message.

## Usage

To use this script, you can call the `getAverageApy` function in your Google Sheets:
