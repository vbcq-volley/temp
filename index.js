const hexo = require("hexo")
const path =require("path")
const fs=require("fs")
const simpleGit = require('simple-git');

// Exemple d'utilisation de la fonction manageRepo
async function manageRepo(repo) {
    const { name, url, path: repoPath } = repo;

    // Fonction pour créer un répertoire s'il n'existe pas
    function ensureDirectoryExistence(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`Répertoire créé: ${dirPath}`);
        }
    }

    // Fonction pour cloner un dépôt
    async function cloneRepo(repoPath, repoUrl) {
        try {
            console.log(`Clonage du dépôt ${repoUrl}...`);
            await simpleGit().clone(repoUrl, repoPath);
            console.log(`Dépôt ${repoUrl} cloné avec succès.`);
        } catch (err) {
            console.error(`Erreur lors du clonage du dépôt ${repoUrl}:`, err);
        }
    }

    // Fonction pour commit des modifications
    async function commitChanges(repoPath) {
        const git = simpleGit(repoPath);
        try {
            // Vérifier s'il y a des modifications
            const status = await git.status();
            if (status.modified.length > 0 || status.not_added.length > 0 || status.deleted.length > 0) {
                console.log(`Des modifications ont été détectées dans ${repoPath}. Commit en cours...`);

                // Ajouter tous les fichiers modifiés
                await git.add('*');
                await git.add('*/*');
                
                // Effectuer un commit
                await git.commit('Mise à jour automatique des fichiers');
                console.log(`Modifications commitées pour ${repoPath}.`);
                return true;
            } else {
                console.log(`Aucune modification détectée dans ${repoPath}.`);
                return false;
            }
        } catch (err) {
            console.error(`Erreur lors du commit pour ${repoPath}:`, err);
            return false;
        }
    }

    // Fonction pour synchroniser un dépôt
    async function syncRepo(repoPath) {
        const git = simpleGit(repoPath);
        try {
            console.log(`Synchronisation du dépôt ${repoPath}...`);

            // D'abord, commit les modifications locales
            const changesCommitted = await commitChanges(repoPath);

            // Ensuite, pull les dernières modifications
            await git.pull();
            console.log(`Dépôt ${repoPath} synchronisé avec succès.`);

            // Si des modifications ont été commitées, push vers le dépôt distant
            if (changesCommitted) {
                await git.push();
                console.log(`Modifications poussées pour ${repoPath}.`);
            }
        } catch (err) {
            console.error(`Erreur lors de la synchronisation du dépôt ${repoPath}:`, err);
        }
    }

    // Exécuter les fonctions pour le dépôt
    ensureDirectoryExistence(repoPath);
    let isSyncing = false;

    if (fs.existsSync(path.join(repoPath, '.git'))) {
        await syncRepo(repoPath);
        
        // Surveiller les modifications du dépôt en excluant le dossier .git
      
           
        
    } else {
        await cloneRepo(repoPath, url);
        
        // Configurer la surveillance après le clonage en excluant le dossier .git
       
        
           
        
    }
}

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
debug: true,
silent: false,

})

async function main() {
    await manageRepo({ name: 'plugins', url: 'https://github.com/vbcq-volley/plugin-build.git', path: './dist' })
    await admin.init()
   
    await admin.load()
    //await admin.call("list", { _: ["post","pages","draft"] })
    await Promise.all(fs.readdirSync("./dist").filter((item)=>{
        return !fs.statSync(path.join("./dist",item)).isDirectory()
    }).map((value)=>{
       
      
            return admin.loadPlugin(path.join("./dist",value))
       
        
    }))
    console.log(admin.log)
  //  admin.log._debug=true
    console.log(admin.env)
    //  admin.exit()
    await admin.call("server",{i:"127.0.0.1",port:8080})
    
}
main()

process.on("SIGKILL",()=>{
    admin.exit()
})

    
    
 
   
  
    
      
        
            //console.log(res)
            
        
 

