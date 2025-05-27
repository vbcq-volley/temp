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

async function main() {
   
    await admin.init()
    admin.env.debug=true
    await admin.load()
    await admin.call("list", { _: ["post","pages","draft"] })
    await Promise.all(fs.readdirSync("./dist").filter((item)=>{
        return !fs.statSync(path.join("./dist",item)).isDirectory()
    }).map((value)=>{
       
      
            return admin.loadPlugin(path.join("./dist",value))
       
        
    }))
    console.log(admin.log)
  //  admin.log._debug=true
    console.log(admin.env)
    admin.exit()
    await admin.call("server",{i:"127.0.0.1",port:8080})
    
}
main()

process.on("SIGKILL",()=>{
    admin.exit()
})

    
    
 
   
  
    
      
        
            //console.log(res)
            
        
 

