const fs =require('fs')
let msg=``
for (let index = 535; index < 679; index++) {
    msg +=`closes #${index}\n`
    
}
fs.writeFileSync("./msg.txt",msg)