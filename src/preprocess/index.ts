import { convertArrayToCSV } from 'convert-array-to-csv'
import fs from 'fs-extra'
import path from 'path'

__dirname = path.resolve('.')

// 이모티콘 제거
// , 제거

async function open(){
  const foodmap = new Map()
  let union:string[][] = [];
  const files = fs.readdirSync(path.join(__dirname,'src','data','csv'))
  files.forEach(file => {
    const data = fs.readFileSync(path.join(__dirname,'src','data','csv',file),'utf8')


    let array = data.split("\n").map(function (line) {
        if(line.split(',').length > 2){
          const lineArray = line.split(',')
          const left = lineArray.splice(0,lineArray.length-1)
          let rest = left.join(' ')
          rest = rest.replace('  ',' ')
          return [rest,lineArray[0]]
        }
        return line.split(",");
    });

    //remove headers
    array.splice(0,1)

    array = array.map((item,_) => {
      return item.map(e => {
        // emoji 삭제
        e = e.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
        // 작은 따옴표 삭제
        e = e.replace('"','')
        // 쉼표 삭제
        e = e.replace(',',' ')
        return e.replace(/(\[|\()(.*?)(\]|\))(\s|)/g,'')
      })
    })


    union = union.concat(array)

  })
  union = union.filter((item,index) => {
    return index === union.indexOf(item)
  })

  console.log(union.length)
  // union.forEach((item,_) => {
  //   foodmap.set(item[0],item[1])
  // })

  console.log(foodmap.size)

  // const Header = ['상품','카테고리']
  // const csv = convertArrayToCSV(union, {header: Header, separator: ','})
  // fs.writeFileSync(path.join(__dirname,'src','preprocess','csv',`union.csv`), csv)
}

open()