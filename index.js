const hexo = require("hexo")
const path =require("path")
const fs=require("fs")


// Exemple d'utilisation de la fonction manageRepo


const parsepath=(p)=>{
    //console.log(p)
    if(fs.existsSync(p)){
        return p
    }
    if(fs.existsSync(p+".js")){
        return p+".js"
    }
}

const admin=new hexo(process.cwd(), {

})
require("./hs")(admin)
async function main() {
   
    await admin.init()
    await admin.load()
    await admin.call("list", { _: ["post","pages","draft"] })
    await Promise.all(fs.readdirSync("./plugin").filter((item)=>{
        return fs.statSync(path.join("./plugin",item)).isDirectory()
    }).map((value)=>{
        const pkg=require(path.join(__dirname,"plugin",value,"package.json"))
        console.log(value)
        const lp=parsepath(path.normalize(path.join("./plugin",value,pkg.main||"index.js")))
        if(lp){
            return admin.loadPlugin(lp)
        }else{
            return null
        }
        
    }))
    console.log(admin.log)
    admin.call("server",{i:"127.0.0.1",port:8080})
    
}
main()

process.on("SIGKILL",()=>{
    admin.exit()
})

    
    
 
   
  
    
      
        
            //console.log(res)
            
        
 

