//TODO: 한글를 가지고 각 식재료로 분리할 수 있는 과정이 필요하다.


// 여기서 데이터 확인해서 
import axios from 'axios'
import { convertArrayToCSV } from 'convert-array-to-csv'
import fs from 'fs-extra'
import * as cheerio from 'cheerio'
import UserAgent from 'user-agents'
const sleep = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));

export const headers =  {
  'user-agent': new UserAgent().toString(),
}
export const category = ['과일','채소','축산물','수산물/건어물','쌀/잡곡','견과류/건과류','면/통조림','치즈/유가공품','떡','오일/과일/향신료','소스/잼/시럽','김치']

export const FoodTypes = {
  fruit : [100007792,50000960],
  vegetable : [100007820,50001077],
  meat : [100002365,50000145],
  meatProcess: [100002430,50001174], //축산 가공
  egg: [100002429,50001173], //알류
  dryfish: [100002519,50001051], //건어물
  fish : [100002373,50000159],
  fishProcess: [100002522,50013900], //수산 가공\
  rice: [100002524,50001052],
  cereals : [100007815,50001052],
  nut : [100002527,50001078],
  dryFruit: [100002528,50001093], //건과류
  water:[100000832,50000148],
  ramen : [100002459,50013961], //
  noodle:[100002460,50014020],
  can:[100007933,50011940],
  dairy : [100002378,50001085], //유가공품
  sauce : [100007965,50013881],
  oil : [100007966,50012620],
  kimchi : [100007771,50000147],
  sideDish: [100002366,50000146],
  Fermented:[100002518,50001050],
}

export type FoodTypes = keyof typeof FoodTypes

export async function crawlAll(){
  // await Promise.all(Object.keys(FoodTypes).map( async (value) => {
  //   await crawl(value as FoodTypes)
  // }))

  for(const value of Object.keys(FoodTypes)){
    await crawl(value as FoodTypes)
  }
}

export async function crawl(key:FoodTypes){
  const section = FoodTypes[key]
  //                    과일,        채소,        축산물,      수산물/건어물,   쌀/잡곡,     견과류/건과류,  면/통조림,   치즈/유가공품,  장류/조미료,          오일/과일/향신료,   김치
  const csvArray = await run(section[0],section[1])
  const Header = ['상품','카테고리']
  const csv = convertArrayToCSV(csvArray, {header: Header, separator: ','})
  fs.writeFileSync(`./src/data/csv${key}.csv`, csv)

}

async function run(catName:number,catId:number):Promise<string[][]>{
  let csvArray:any[] = []

  for (const j of Array(1200).keys()){
    try{
      const cooldown = Math.random()*2000 + 1500
      await sleep(cooldown)
      const res = await axios.get(`https://search.shopping.naver.com/search/category/${catName}?catId=${catId}&origQuery&pagingIndex=${j}&pagingSize=100`,{headers:headers})
      const $ = cheerio.load(res.data)
      const json = JSON.parse($('script#__NEXT_DATA__').text())
      const list = json['props']['pageProps']['initialState']['products']['list']
      console.log(`${j + 1}/1200 getting ${list.length} datas... wait ${(cooldown / 1000).toFixed(2)} sec`)
      if(list === undefined) break;
      const subCsv = list.map((e:any) => {
        return [e['item']['productTitle'],e['item']['category3Name']]
      })
      csvArray = csvArray.concat(subCsv)
    }
    catch(e:any){
      console.log('error: ', e.name,catName,j)
      throw new Error("error");
    }
  }
  return csvArray
}




