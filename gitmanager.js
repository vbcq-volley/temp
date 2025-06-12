const process=require("child_process")
const fs=require("fs")
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
	fs.writeFileSync("./git-options.ini",`
[Setup]
Lang=default
Dir=C:\\Program Files\\Git
Group=Git
NoIcons=0
SetupType=default
Components=gitlfs,assoc,assoc_sh,windowsterminal
Tasks=
EditorOption=VIM
CustomEditorPath=
DefaultBranchOption=main
PathOption=Cmd
SSHOption=OpenSSH
TortoiseOption=false
CURLOption=WinSSL
CRLFOption=CRLFCommitAsIs
BashTerminalOption=MinTTY
GitPullBehaviorOption=Merge
UseCredentialManager=Enabled
PerformanceTweaksFSCache=Enabled
EnableSymlinks=Disabled
EnablePseudoConsoleSupport=Disabled
EnableFSMonitor=Disabled
Group=Git
NoIcons=0
SetupType=default
Components=gitlfs,assoc,assoc_sh,windowsterminal
Tasks=
EditorOption=notepad
CustomEditorPath=
DefaultBranchOption=main
PathOption=Cmd
SSHOption=OpenSSH
TortoiseOption=false
CURLOption=WinSSL
CRLFOption=CRLFCommitAsIs
BashTerminalOption=MinTTY
GitPullBehaviorOption=Merge
UseCredentialManager=Enabled
PerformanceTweaksFSCache=Enabled
EnableSymlinks=Disabled
EnablePseudoConsoleSupport=Disabled
EnableFSMonitor=Disabled`)
    download("https://github.com/git-for-windows/git/releases/download/v2.49.0.windows.1/Git-2.49.0-64-bit.exe","gitinstall.exe")
    run("gitinstall /VERYSILENT /NORESTART /NOCANCEL /LOADINF=git_options.ini")
}