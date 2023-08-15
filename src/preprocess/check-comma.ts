import path from 'path'
import fs from 'fs'

const data = fs.readFileSync(path.join(__dirname,'union.csv'),'utf8')

let array = data.split("\n").map(function (line) {
  return line.split(",");
});
array.splice(0,1)
array.forEach(element => {
  if(element.length > 2) {
    const left = element.splice(0,element.length-1)
    let rest = left.join(' ')
    rest = rest.replace('  ',' ')
    const rebond = rest + ',' + element[0]
    console.log(rebond)
  }
})