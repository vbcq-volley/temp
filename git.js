const process=require("child_process")
const run=(cmd)=>{
	const env=process.spawnSync(cmd,{
		shell:true
	})
	//console.log(env.output[1].toString())
	return env.output[1].toString()
}
console.log(run("where gite"))
if(run)