



import axios from 'axios';



// //TODO: 한글를 가지고 각 식재료로 분리할 수 있는 과정이 필요하다.
// import axios from 'axios'
// import { convertArrayToCSV } from 'convert-array-to-csv'
// import fs from 'fs-extra'
// import * as cheerio from 'cheerio'
// import UserAgent from 'user-agents'
// const sleep = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));

// const headers =  {
//   'user-agent': new UserAgent().toString(),
// }
// const category = ['과일','채소','축산물','수산물/건어물','쌀/잡곡','견과류/건과류','면/통조림','치즈/유가공품','떡','오일/과일/향신료','소스/잼/시럽','김치']


async function run(){

  const catNames = [  100007792,  100007820,  100002365,  100002373,    100007815,  100007784,    100002368,  100002378,    100007965,          100007966,        100002367]
  const catIds = [    50000960,   50001077,   50000145,   50000159,     50001052,   50001078,     50013960,   50000146,     50013881,           50012620,         50000147]
  const catNameAscii = ['fruit','vegetable','meat','fish','rice','nut','noddle','cheese','sauce','oil','kimchi']
  for(const i in catNames){

  }
  const response = await axios.get('https://openapi.naver.com/v1/search/shop.json', {
    params: {
      'query': '쌀',
      'display': '1',
      'start': '1',
    },
    headers: {
      'X-Naver-Client-Id': '9iKlodcKVFmhQkKtq19k',
      'X-Naver-Client-Secret': 'Wkb9czMZZ8'
    }
  });

  console.log(response.data)


}

run()




