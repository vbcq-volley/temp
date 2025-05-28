const { Octokit } = require('@octokit/rest');
const t =require("git-credential-node")
const login=t.fillSync("https://github.com")
const simpleGit = require('simple-git');

// Initialiser Git
const git = simpleGit();

// Fonction pour récupérer les informations de configuration Git
async function getGitConfig() {
    const config = {};
    try {
        config.user = login.username
        config.email = await git.raw(['config', 'user.email']);
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
async function createIssueForError(errorMessage) {
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
            title: `Error Report: ${new Date().toISOString()}`,
            body: `An error occurred:\n\n\`\`\`\n${errorMessage}\n\`\`\``,
            labels: ['bug']
        });

        console.log(`Issue created: ${response.data.html_url}`);
    } catch (error) {
        console.error('Error creating issue:', error.message);
    }
}

// Exemple d'utilisation
const errorMessages = [
    'Erreur 1: Une erreur est survenue lors de lexécution du script.',
    'Erreur 2: Une autre erreur est survenue.'
];

errorMessages.forEach(errorMessage => {
    createIssueForError(errorMessage);
});

