const process=require("child_process")
const run=(cmd)=>{
	const env=process.spawnSync(cmd,{
		shell:true
	})
	//console.log(env.output[1].toString())
	return env.output[1].toString()
}
const download=(url,file)=>{
    return run(`curl "${url}" -o "${file}"`)
}
console.log(run("where gite"))
if(run("where git")){
    console.log("git existe")
}else{
    download("https://github.com/git-for-windows/git/releases/download/v2.49.0.windows.1/Git-2.49.0-64-bit.exe","gitinstal")
}