const fs =require('fs')
let msg=``
for (let index = 106; index < 535; index++) {
    msg +=`closes #${index}\n`
    
}
fs.writeFileSync("./msg.txt",msg)