const fs = require('fs');
const path=require("path")
const simpleGit = require('simple-git');
;
(async () => {
    const repos = [
        { name: 'adminpanel', url: 'https://github.com/vbcq-volley/temp.git', path: '.' },
        { name: 'source', url: 'https://github.com/vbcq-volley/content.git', path: './source' }
        // Ajoutez d'autres dépôts ici
    ];

    for (const repo of repos) {
        await manageRepo(repo);
    }
})();
// Fonction pour gérer la synchronisation d'un dépôt Git

// Fonction pour gérer la synchronisation d'un dépôt Git
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

    // Fonction pour synchroniser un dépôt
    async function syncRepo(repoPath) {
        const git = simpleGit(repoPath);
        try {
            console.log(`Synchronisation du dépôt ${repoPath}...`);
            await git.pull();
            console.log(`Dépôt ${repoPath} synchronisé avec succès.`);
        } catch (err) {
            console.error(`Erreur lors de la synchronisation du dépôt ${repoPath}:`, err);
        }
    }

    // Fonction pour commit et push des modifications
    async function commitAndPush(repoPath) {
        const git = simpleGit(repoPath);
        try {
            // Vérifier s'il y a des modifications
            const status = await git.status();
            if (status.modified.length > 0 || status.not_added.length > 0 || status.deleted.length > 0) {
                console.log(`Des modifications ont été détectées dans ${repoPath}. Commit et push en cours...`);

                // Ajouter tous les fichiers modifiés
                await git.add('./*');

                // Effectuer un commit
                await git.commit('Mise à jour automatique des fichiers');

                // Pousser les modifications vers le dépôt distant
                await git.push();
                console.log(`Modifications commitées et poussées pour ${repoPath}.`);
            } else {
                console.log(`Aucune modification détectée dans ${repoPath}.`);
            }
        } catch (err) {
            console.error(`Erreur lors du commit ou du push pour ${repoPath}:`, err);
        }
    }

    // Exécuter les fonctions pour le dépôt
    ensureDirectoryExistence(repoPath);

    if (fs.existsSync(path.join(repoPath, '.git'))) {
        await syncRepo(repoPath);
        await commitAndPush(repoPath);
    } else {
        await cloneRepo(repoPath, url);
    }
}