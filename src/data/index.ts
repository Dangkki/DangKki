import { crawl, crawlAll } from "./naverShopCrawl"

async function runAsync(){
  await crawlAll()
}

runAsync()