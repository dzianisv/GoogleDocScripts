async function getAverageApy(url, days=90) {
    const vaultMatch = url.match(/vault\/([^/]+)/);
    if (!vaultMatch) {
        throw new Error("Invalid URL: Vault ID not found.");
    }
    const vault = vaultMatch[1];

    const response = await fetch(`https://data.beefy.finance/api/v2/apys?vault=${vault}&bucket=1d_1Y`, {
        "credentials": "omit",
        "referrer": "https://app.beefy.com/",
        "method": "GET",
        "mode": "cors"
    });

    const data = await response.json();
    // Compute average APY for the last 30 days
    const recentData = data.filter(item => {
        const timestamp = item.t * 1000; // Convert to milliseconds
        return Date.now() - timestamp <= 90 * 24 * 60 * 60 * 1000; // Last 30 days
    });

    const averageAPY = recentData.reduce((sum, item) => sum + item.v, 0) / recentData.length;
    return averageAPY;
}

async function main() {
    const days = 90;
    for (const url of [
        "https://app.beefy.com/vault/aero-cow-usdc-eusd-vault", 
        "https://app.beefy.com/vault/camelot-usdc-usdt-rp",
        "https://app.beefy.com/vault/aerodrome-usdc-eusd",
        "https://app.beefy.com/vault/uniswap-cow-op-usdc-susd-rp",
        "https://app.beefy.com/vault/curve-arb-eusd-usdc"
    ]) {
        console.log(`Average APY for ${url}`, await getAverageApy(url, days));
    }
}

main().catch(console.error);