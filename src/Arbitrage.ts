import * as _ from "lodash";
import { BigNumber, Contract, Wallet, ethers } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import { WETH_ADDRESS } from "./addresses";
import { EthMarket } from "./EthMarket";
import { ETHER, bigNumberToDecimal } from "./utils";
import {UniswappyV2EthPair} from "./UniswappyV2EthPair";

// export interface CrossedMarketDetails {
//   profit: BigNumber,
//   volume: BigNumber,
//   tokenAddress: string,
//   buyFromMarket: EthMarket,
//   sellToMarket: EthMarket,
// }

export interface arbitrageDataRawDetails {
  cycle: Array<string>,
  pools: Array<EthMarket>,
  cycleWeight: Array<Number>
}

export interface CrossedMarketDetails {
  profit: BigNumber,
  volume: BigNumber,
  tokenAddress: Array<string>,
  poolAddress: Array<EthMarket>
}

export type MarketsByToken = { [tokenAddress: string]: Array<EthMarket> }

// TODO: implement binary search (assuming linear/exponential global maximum profitability)
const decimals = 18
const TEST_VOLUMES = [
  ETHER.div(100),
  ETHER.div(10),
  ETHER.div(6),
  ETHER.div(4),
  ETHER.div(2),
  ETHER.div(1),
  ETHER.mul(2),
  ETHER.mul(5),
  ETHER.mul(10),
  //   BigNumber.from(10**20),
  // BigNumber.from(10**19),
  // BigNumber.from(10).pow(decimals+2),
  // BigNumber.from(10).pow(decimals+1),
  // BigNumber.from(10).pow(decimals),
  // BigNumber.from(10).pow(decimals-1),
]

export function getBestCrossedMarket(arbitrageData: Array<arbitrageDataRawDetails>): Array<CrossedMarketDetails> | undefined {
  // let bestCrossedMarket: CrossedMarketDetails | undefined = undefined;
  // for (const crossedMarket of arbitrageData) {
  
  const bestCrossedMarkets = []
  for (const bestCrossedMarket of arbitrageData) {
    // console.log("Send this much WETH", bestCrossedMarket.volume.toString(), "get this much profit", bestCrossedMarket.profit.toString())
    // const inter = bestCrossedMarket.volume
    //
    // }
    // const sellToMarket = crossedMarket[0]
    // const buyFromMarket = crossedMarket[1]
    const profits = []
    for (const size of TEST_VOLUMES) {
      let temp_size = size
      for (let i = 0; i < bestCrossedMarket.pools.length - 1; i++) {
        // const buyCalls = bestCrossedMarket.pools[i].getTokensOut(bestCrossedMarket.cycle[i], temp_size, bestCrossedMarket.pools[i+1]);
        // console.log(typeof(temp_size))
        temp_size = bestCrossedMarket.pools[i].getTokensOut(bestCrossedMarket.cycle[i], bestCrossedMarket.cycle[i + 1], temp_size)
      }

      // const tokensOutFromBuyingSize = buyFromMarket.getTokensOut(WETH_ADDRESS, tokenAddress, size);
      const l = bestCrossedMarket.pools.length
      const proceedsFromSellingTokens = bestCrossedMarket.pools[l - 1].getTokensOut(bestCrossedMarket.cycle[l - 1], bestCrossedMarket.cycle[l], BigNumber.from(temp_size))
      const profit = proceedsFromSellingTokens.sub(size);
      profits.push(profit)
      // const maxProfit = Math.max(profits)
      const maxProfit = profits.reduce((a, b) => Math.max(a, b), -Infinity);
      const bestMarket = {
        volume: TEST_VOLUMES[profits.indexOf(maxProfit)],
        profit: maxProfit,
        tokenAddress: bestCrossedMarket.cycle,
        poolAddress: bestCrossedMarket.pools
      }
      bestCrossedMarkets.push(bestMarket)
    }

  }
  return bestCrossedMarkets;
}

export class Arbitrage {
  private flashbotsProvider: FlashbotsBundleProvider;
  private bundleExecutorContract: Contract;
  private executorWallet: Wallet;

  constructor(executorWallet: Wallet, flashbotsProvider: FlashbotsBundleProvider, bundleExecutorContract: Contract) {
    this.executorWallet = executorWallet;
    this.flashbotsProvider = flashbotsProvider;
    this.bundleExecutorContract = bundleExecutorContract;
  }

  // static printCrossedMarket(crossedMarket: CrossedMarketDetails): void {
  //   const buyTokens = crossedMarket.buyFromMarket.tokens
  //   const sellTokens = crossedMarket.sellToMarket.tokens
  //   console.log(
  //     `Profit: ${bigNumberToDecimal(crossedMarket.profit)} Volume: ${bigNumberToDecimal(crossedMarket.volume)}\n` +
  //     `${crossedMarket.buyFromMarket.protocol} (${crossedMarket.buyFromMarket.marketAddress})\n` +
  //     `  ${buyTokens[0]} => ${buyTokens[1]}\n` +
  //     `${crossedMarket.sellToMarket.protocol} (${crossedMarket.sellToMarket.marketAddress})\n` +
  //     `  ${sellTokens[0]} => ${sellTokens[1]}\n` +
  //     `\n`
  //   )
  // }


  // async evaluateMarkets(marketsByToken: MarketsByToken): Promise<Array<CrossedMarketDetails>> {
  //   const bestCrossedMarkets = new Array<CrossedMarketDetails>()
  //
  //   for (const tokenAddress in marketsByToken) {
  //     const markets = marketsByToken[tokenAddress]
  //     const pricedMarkets = _.map(markets, (ethMarket: EthMarket) => {
  //       return {
  //         ethMarket: ethMarket,
  //         buyTokenPrice: ethMarket.getTokensIn(tokenAddress, WETH_ADDRESS, ETHER.div(100)),
  //         sellTokenPrice: ethMarket.getTokensOut(WETH_ADDRESS, tokenAddress, ETHER.div(100)),
  //       }
  //     });
  //
  //     const crossedMarkets = new Array<Array<EthMarket>>()
  //     for (const pricedMarket of pricedMarkets) {
  //       _.forEach(pricedMarkets, pm => {
  //         if (pm.sellTokenPrice.gt(pricedMarket.buyTokenPrice)) {
  //           crossedMarkets.push([pricedMarket.ethMarket, pm.ethMarket])
  //         }
  //       })
  //     }
  //
  //     const bestCrossedMarket = getBestCrossedMarket(arbitrageData);
  //     if (bestCrossedMarket !== undefined && bestCrossedMarket.profit.gt(ETHER.div(1000))) {
  //       bestCrossedMarkets.push(bestCrossedMarket)
  //     }
  //   }
  //   bestCrossedMarkets.sort((a, b) => a.profit.lt(b.profit) ? 1 : a.profit.gt(b.profit) ? -1 : 0)
  //   return bestCrossedMarkets
  // }

  // TODO: take more than 1
  async takeCrossedMarkets(blockNumber: number, minerRewardPercentage: number, arbitrageDataRaw:Array<any>): Promise<void> {
    // for (arbitrageDataRaw)
    // console.log(arbitrageDataRaw)
    let pools_ = []
    for (let i = 0; i< arbitrageDataRaw.length; i++){
      let arb = arbitrageDataRaw[i]
      for (let pool of arb.pools) {
        pools_.push(new UniswappyV2EthPair(pool, ["",""],""))
      }
      arbitrageDataRaw[i].pools = pools_
    }

    const arbitrageData = getBestCrossedMarket(arbitrageDataRaw);
    for (const bestCrossedMarket of arbitrageData) {
      const targets = new Array<string>()
      const payloads = new Array<string>()
      console.log("Send this much WETH", bestCrossedMarket.volume.toString(), "get this much profit", bestCrossedMarket.profit.toString())
      const inter = bestCrossedMarket.volume
      for (let i=0; i< bestCrossedMarket.poolAddress.length-1; i++) {
        const buyCalls = await bestCrossedMarket.poolAddress[i].sellTokensToNextMarket(bestCrossedMarket.tokenAddress[i], bestCrossedMarket.volume, bestCrossedMarket.poolAddress[i+1]);
        const inter = bestCrossedMarket.poolAddress[i].getTokensOut(bestCrossedMarket.tokenAddress[i], bestCrossedMarket.tokenAddress[i+1], bestCrossedMarket.volume)
        targets.push(buyCalls.targets[0])
        payloads.push(buyCalls.data[0])
      }
      const sellCallData = await bestCrossedMarket.poolAddress[bestCrossedMarket.poolAddress.length-1]
          .sellTokens(bestCrossedMarket.tokenAddress[bestCrossedMarket.tokenAddress.length-2], inter, this.bundleExecutorContract.address);
      targets.push(String(bestCrossedMarket.poolAddress[bestCrossedMarket.poolAddress.length-1]))
      payloads.push(sellCallData)
      // console.log(sellCallData)
      // const targets: Array<string> = [...buyCalls.targets, bestCrossedMarket.sellToMarket.marketAddress]
      // const payloads: Array<string> = [...buyCalls.data, sellCallData]
      console.log({targets, payloads})
      const minerReward = bestCrossedMarket.profit.mul(minerRewardPercentage).div(100);
      const transaction = await this.bundleExecutorContract.populateTransaction.uniswapERC20(bestCrossedMarket.tokenAddress, bestCrossedMarket.volume, minerReward, targets, payloads, {
        // gasPrice: BigNumber.from(5000000000),
        gasLimit: BigNumber.from(20000000),
      });

      try {
        const estimateGas = await this.bundleExecutorContract.provider.estimateGas(
          {
            ...transaction,
            from: this.executorWallet.address,
            maxFeePerGas: ethers.utils.parseUnits('10','gwei'),
          })
        if (estimateGas.gt(1400000)) {
          console.log("EstimateGas succeeded, but suspiciously large: " + estimateGas.toString())
          continue
        }
        transaction.gasLimit = estimateGas.mul(2)
      } catch (e) {
        console.log(e)
        // console.log(provider.get)
        console.warn(`Estimate gas failure for ${JSON.stringify(bestCrossedMarket)}`)
        continue
      }
      const bundledTransactions = [
        // you can just plug in new txs from mempool and add new txs to the front and behiind
        {
          signer: this.executorWallet,
          transaction: transaction
        }
      ];
      console.log(bundledTransactions)
      const signedBundle = await this.flashbotsProvider.signBundle(bundledTransactions)
      //
      const simulation = await this.flashbotsProvider.simulate(signedBundle, blockNumber + 1 )
      if ("error" in simulation || simulation.firstRevert !== undefined) {
        console.log(`Simulation Error on token ${bestCrossedMarket.tokenAddress}, skipping`)
        continue
      }
      console.log(`Submitting bundle, profit sent to miner: ${bigNumberToDecimal(simulation.coinbaseDiff)}, effective gas price: ${bigNumberToDecimal(simulation.coinbaseDiff.div(simulation.totalGasUsed), 9)} GWEI`)
      const bundlePromises =  _.map([blockNumber + 1, blockNumber + 2], targetBlockNumber =>
        this.flashbotsProvider.sendRawBundle(
          signedBundle,
          targetBlockNumber
        ))
      await Promise.all(bundlePromises)
      return
    }
    throw new Error("No arbitrage submitted to relay")
  }
}
