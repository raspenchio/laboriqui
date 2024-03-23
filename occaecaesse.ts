
const {
  Pool,
  Token,
  Fetcher,
  Route,
  Trade,
  WETH9,
  Percent,
  CurrencyAmount,
  Currency,
  TradeType,
  Uniswap,
  TokenAmount,
} = require('@uniswap/sdk');
const {ethers} = require('ethers');

const provider = new ethers.providers.JsonRpcProvider('https://www.example.com chainId = 1;

const tokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

const amountIn = 1000;
const amountOutMin = 10;

const initCodeHash = '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54'; // Uniswap V3 factory

const tokenIn = new Token(chainId, tokenAddress, 18);
const weth = WETH9[chainId];

const poolAddress = Pool.getAddress(tokenIn, weth, 3000);

const poolContract = new ethers.Contract(
  poolAddress,
  ['function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)'],
  provider
);

const block = await provider.getBlock('latest');

const pool = new Pool(
  tokenIn,
  weth,
  3000,
  poolContract.slot0().sqrtPriceX96,
  block.timestamp,
  poolContract.slot0().tick,
  poolContract.slot0().observationIndex,
  poolContract.slot0().observationCardinality
);

const route = new Route([new Trade(TradeType.EXACT_INPUT, new TokenAmount(tokenIn, amountIn), weth)], weth);

const trade = new Trade(route, new TokenAmount(weth, amountOutMin), TradeType.EXACT_OUTPUT);

const params = {
  tokenIn: tokenIn,
  tokenOut: weth,
  amountIn: amountIn,
  amountOutMin: amountOutMin,
  pool,
  trade,
};

const uniswap = new Uniswap(provider);

const result = await uniswap.addLiquidity(params);

console.log(result);

