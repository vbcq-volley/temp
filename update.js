const path = require("path")
const fs = require("fs")
const simpleGit = require('simple-git');
async function manageRepo(repo) {
    const { name, url, path: repoPath } = repo;
    let isSyncing = false; // Flag pour suivre l'état de synchronisation

    // Fonction pour créer un répertoire s'il n'existe pas
    function ensureDirectoryExistence(dirPath) {
        try {
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
                console.log(`Répertoire créé: ${dirPath}`);
            }
        } catch (err) {
            console.log(err);
        }
    }

    // Fonction pour cloner un dépôt
    async function cloneRepo(repoPath, repoUrl) {
        try {
            console.log(`Clonage du dépôt ${repoUrl}...`);
            await simpleGit().clone(repoUrl, repoPath);
            console.log(`Dépôt ${repoUrl} cloné avec succès.`);
        } catch (err) {
            console.log(err);
        }
    }

    // Fonction pour commit des modifications
    async function commitChanges(repoPath) {
        const git = simpleGit(repoPath);
        try {
            const status = await git.status();
            if (status.modified.length > 0 || status.not_added.length > 0 || status.deleted.length > 0) {
                console.log(`Des modifications ont été détectées dans ${repoPath}. Commit en cours...`);
                await git.add(['*', '*/*']);
                //await git.rebase(await git.branch())
                await git.commit('Mise à jour automatique des fichiers');
                console.log(`Modifications commitées pour ${repoPath}.`);
                return true;
            } else {
                console.log(`Aucune modification détectée dans ${repoPath}.`);
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    // Fonction pour synchroniser un dépôt
    async function syncRepo(repoPath) {
        if (isSyncing) {
            console.log(`Une synchronisation est déjà en cours pour ${repoPath}, nouvelle demande ignorée.`);
            return;
        }

        isSyncing = true;
        const git = simpleGit(repoPath);
        try {
            console.log(`Synchronisation du dépôt ${repoPath}...`);
            const changesCommitted = await commitChanges(repoPath);
           
            console.log(`Dépôt ${repoPath} synchronisé avec succès.`);
            if (changesCommitted) {
                await git.pull();
                await git.push();
                console.log(`Modifications poussées pour ${repoPath}.`);
            } else {
                // Vérifier s'il y a des fichiers non commités
                const status = await git.status();
                if (status.modified.length > 0 || status.not_added.length > 0 || status.deleted.length > 0) {
                    console.log(`Des fichiers non commités détectés, nouvelle tentative de synchronisation...`);
                    await syncRepo(repoPath);
                }
            }
        } catch (err) {
            console.log(`Erreur lors de la synchronisation: ${err.message}`);
            
        } finally {
            isSyncing = false;
        }
    }

    // Fonction pour surveiller les changements
    function watchRepo(repoPath) {
        const watcher = fs.watch(repoPath, { recursive: true }, async (eventType, filename) => {
            const FORBIDDEN_FILES = [
                '.git',
                '.gitignore', 
                '.gitattributes',
                'index.lock',
                ".git\\index.lock"
            ];

            if (filename && !FORBIDDEN_FILES.some(forbidden => filename.endsWith(forbidden))) {
                console.log(`Changement détecté dans ${filename}`);
                await syncRepo(repoPath);
            }
        });
        console.log(`Surveillance du dépôt ${repoPath} activée`);
        return watcher;
    }

    try {
        ensureDirectoryExistence(repoPath);
        if (fs.existsSync(path.join(repoPath, '.git'))) {
            await syncRepo(repoPath);
            watchRepo(repoPath);
        } else {
            await cloneRepo(repoPath, url);
            watchRepo(repoPath);
        }
    } catch (err) {
        console.log(err)
    }
}
const main =async () => {
    await manageRepo({ name: 'main', url: 'https://github.com/vbcq-volley/temp.git', path: '.' })
    await manageRepo({ name: 'plugins', url: 'https://github.com/vbcq-volley/plugin-build.git', path: './dist' });
    await manageRepo({ name: 'source', url: 'https://github.com/vbcq-volley/content.git', path: './source' });
        
}
main()