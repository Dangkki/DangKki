import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import * as cheerio from 'cheerio';
import UserAgent from 'user-agents';
import fs from 'fs-extra'
import path from 'path'


const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));
const userAgent = new UserAgent({ deviceCategory: 'mobile' });

__dirname = path.resolve('.')

const ID = 'pakmy210'
const PASSWORD = '~mimi0527~'

async function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// user agent 사용자 정보가 계속 바뀌면 막히는 듯해서 하나로 통일 시키기 위해서 저장한다.
let userAgentStr:string
if(!fs.existsSync(path.join(__dirname,'src','./cache'))){
  userAgentStr = userAgent.toString();
  fs.writeFileSync(path.join(__dirname,'src','./cache'),userAgentStr)
}
userAgentStr = fs.readFileSync(path.join(__dirname,'src','./cache'),'utf8')

const getHeader = {
  'Referer': 'https://www.ssg.com/myssg/main.ssg?gnb=myssg',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': userAgentStr,
}

const getCertCodeHeader = {
  'Cookie': 'PCID=16910439314487488012418;',
  'Referer': 'https://www.ssg.com/membership/gate.ssg',
  'User-Agent':userAgentStr,
}

const getLoginHeader = {
  'Accept': '*/*',
  'Origin': 'https://member.ssg.com',
  'Referer': 'https://member.ssg.com/member/login.ssg?retURL=https%3A%2F%2Fpay.ssg.com%2Fmyssg%2ForderList.ssg%3Fgnb%3Dorderlist',
  'User-Agent': userAgentStr,
}

const logoutHeader = 
{
  'Referer': 'https://pay.ssg.com/myssg/orderInfo.ssg?viewType=Ssg',
  'User-Agent': userAgentStr,
}

runAyscnc()

async function runAyscnc(){
  const certCodeResponse = await client.get('https://member.ssg.com/member/login.ssg?retURL=https%3A%2F%2Fpay.ssg.com%2Fmyssg%2ForderList.ssg%3Fgnb%3Dorderlist',{
    headers:getCertCodeHeader,
    withCredentials: true
  })
  let $ = cheerio.load(certCodeResponse.data)
  const loginCertCode = $('input[name=loginCertCode]').val()
  console.log(loginCertCode)

  const loginStatus = await client.post('https://member.ssg.com/login/process.ssg',
  new URLSearchParams({
    'mbrLoginId': ID,
    'password': PASSWORD,
    'loginCertCode': loginCertCode as string,
    'PCID': '16910439314487488012418'
  }),
  {
    headers: getLoginHeader,
    withCredentials: true
  })

  console.log(loginStatus.data)



  const params1 = {
    'gnb': 'orderlist',
  }
  await client.get('https://pay.ssg.com/myssg/orderList.ssg',{
    headers:getHeader,
    params:params1,
    withCredentials: true
  })
  
  //3개월 6
  //6개월 7
  //9개월 8
  //12개월 9
  //기간 5

  enum viewType {
    "period" = 5,
    "3month" = 6,
    "6month" = 7,
    "9month" = 8,
    "12month" = 9,
  }

  //Can change search range
  const params2 = {
    'viewType': viewType['3month'].toString(),
    'searchCheckBox':'',
    'page':1,
    'searchInfloSiteNo':'',
    'searchStartDt':'',
    'searchEndDt':'',
    'searchKeyword':''
  }
  const res = await client.get('https://pay.ssg.com/myssg/orderList.ssg',{
    headers:getHeader,
    params:params2,
    withCredentials: true
  })
  
  // console.log(jar.getCookies('https://member.ssg.com/login/process.ssg'));
  $ = cheerio.load(res.data)
  let orderList:string[] = []
  $('.codr_unit_name').map((i,el) => orderList.push($(el).text()))
  orderList = orderList.map(e => e.replace(/\s/g,''))
  console.log(orderList)
  await sleep(100)
  const logout = await axios.get('https://member.ssg.com/member/logout.ssg', {
    params: {
      'retURL': 'https://www.ssg.com',
      'gnb': 'logout'
    },
    headers: logoutHeader,
    withCredentials: true
  });
}

