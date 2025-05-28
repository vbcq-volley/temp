const hexo = require("hexo")
const path = require("path")
const fs = require("fs")
const simpleGit = require('simple-git');
const { Octokit } = require('@octokit/rest');
const t =require("git-credential-node")
const login=t.fillSync("https://github.com")
async function getGitConfig() {
    const config = {};
    try {
        config.user = login.username
     
        config.remoteUrl = "https://github.com/vbcq-volley/temp.git"
    } catch (error) {
        console.error('Error getting Git config:', error.message);
    }
    return config;
}

// Fonction pour extraire le propriétaire et le dépôt à partir de l'URL du dépôt distant
function extractRepoInfo(remoteUrl) {
    const match = remoteUrl.match(/github\.com[:\/](.+?)\/(.+?)(?:\.git)?$/);
    if (match) {
        return {
            owner: match[1],
            repo: match[2]
        };
    }
    return null;
}

// Fonction pour créer une issue pour une erreur
async function createIssueForError(context,errorMessage) {
    const config = await getGitConfig();
    if (!config.remoteUrl) {
        console.error('Remote URL not found in Git config');
        return;
    }

    const repoInfo = extractRepoInfo(config.remoteUrl);
    if (!repoInfo) {
        console.error('Could not extract repository information from remote URL');
        return;
    }

    const { owner, repo } = repoInfo;

    // Initialiser Octokit avec authentification (si nécessaire)
    const octokit = new Octokit({
        auth: login.password // Utilisez un token si nécessaire
    });

    try {
        const response = await octokit.issues.create({
            owner,
            repo,
            title: `Error Report: ${new Date().toISOString()} ${context}`,
            body: `An error occurred:\n\n\`\`\`\n${errorMessage}\n\`\`\``,
            labels: ['bug']
        });

        console.log(`Issue created: ${response.data.html_url}`);
    } catch (error) {
        console.error('Error creating issue:', error.message);
    }
}
// Classe pour gérer les erreurs
class ErrorCollector {
    constructor() {
        this.errors = [];
    }

    addError(error, context) {
        this.errors.push({
            timestamp: new Date(),
            error: error,
            context: context
        });
        createIssueForError(`Erreur dans ${context}:`, error);
    }

    getErrors() {
        return this.errors;
    }

    clearErrors() {
        this.errors = [];
    }

    hasErrors() {
        return this.errors.length > 0;
    }
}

const errorCollector = new ErrorCollector();

// Exemple d'utilisation de la fonction manageRepo
async function manageRepo(repo) {
    const { name, url, path: repoPath } = repo;

    // Fonction pour créer un répertoire s'il n'existe pas
    function ensureDirectoryExistence(dirPath) {
        try {
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
                console.log(`Répertoire créé: ${dirPath}`);
            }
        } catch (err) {
            errorCollector.addError(err, `ensureDirectoryExistence(${dirPath})`);
        }
    }

    // Fonction pour cloner un dépôt
    async function cloneRepo(repoPath, repoUrl) {
        try {
            console.log(`Clonage du dépôt ${repoUrl}...`);
            await simpleGit().clone(repoUrl, repoPath);
            console.log(`Dépôt ${repoUrl} cloné avec succès.`);
        } catch (err) {
            errorCollector.addError(err, `cloneRepo(${repoUrl})`);
        }
    }

    // Fonction pour commit des modifications
    async function commitChanges(repoPath) {
        const git = simpleGit(repoPath);
        try {
            const status = await git.status();
            if (status.modified.length > 0 || status.not_added.length > 0 || status.deleted.length > 0) {
                console.log(`Des modifications ont été détectées dans ${repoPath}. Commit en cours...`);
                await git.add('*');
                await git.add('*/*');
                await git.commit('Mise à jour automatique des fichiers');
                console.log(`Modifications commitées pour ${repoPath}.`);
                return true;
            } else {
                console.log(`Aucune modification détectée dans ${repoPath}.`);
                return false;
            }
        } catch (err) {
            errorCollector.addError(err, `commitChanges(${repoPath})`);
            return false;
        }
    }

    // Fonction pour synchroniser un dépôt
    async function syncRepo(repoPath) {
        const git = simpleGit(repoPath);
        try {
            console.log(`Synchronisation du dépôt ${repoPath}...`);
            const changesCommitted = await commitChanges(repoPath);
            await git.pull();
            console.log(`Dépôt ${repoPath} synchronisé avec succès.`);
            if (changesCommitted) {
                await git.push();
                console.log(`Modifications poussées pour ${repoPath}.`);
            }
        } catch (err) {
            errorCollector.addError(err, `syncRepo(${repoPath})`);
        }
    }

    try {
        ensureDirectoryExistence(repoPath);
        if (fs.existsSync(path.join(repoPath, '.git'))) {
            await syncRepo(repoPath);
        } else {
            await cloneRepo(repoPath, url);
        }
    } catch (err) {
        errorCollector.addError(err, `manageRepo(${name})`);
    }
}

const parsepath = (p) => {
    try {
        if (fs.existsSync(p)) {
            return p;
        }
        if (fs.existsSync(p + ".js")) {
            return p + ".js";
        }
    } catch (err) {
        errorCollector.addError(err, `parsepath(${p})`);
    }
    return null;
}

// Configuration Hexo
const admin = new hexo(process.cwd(), {
    debug: true,
    silent: false,
});

async function main() {
    try {
        await manageRepo({ name: 'plugins', url: 'https://github.com/vbcq-volley/plugin-build.git', path: './dist' });
        await manageRepo({ name: 'source', url: 'https://github.com/vbcq-volley/content.git', path: './source' });
        
        await admin.init();
        await admin.load();
        
        await Promise.all(fs.readdirSync("./dist")
            .filter(item => !fs.statSync(path.join("./dist", item)).isDirectory())
            .map(value => admin.loadPlugin(path.join("./dist", value))));
            
        console.log(admin.log);
        console.log(admin.env);
        await admin.call("server", { i: "127.0.0.1", port: 8080 });
    } catch (err) {
        errorCollector.addError(err, 'main()');
    }
}

main();

process.on("SIGKILL", () => {
    try {
        admin.exit();
    } catch (err) {
        errorCollector.addError(err, 'SIGKILL handler');
    }
});

