const { Octokit } = require("@octokit/rest");
const t = require("git-credential-node")
const login = t.fillSync("https://github.com")
const fs = require('fs');

// Initialisation du client Octokit
const octokit = new Octokit({
  auth: login.password
});

<<<<<<< HEAD
async function deleteAllReleases(owner, repo) {
  try {
    // Récupérer toutes les releases
    const releases = await octokit.rest.repos.listReleases({
      owner,
      repo
    });

    // Supprimer chaque release
    for (const release of releases.data) {
      await octokit.rest.repos.deleteRelease({
        owner,
        repo,
        release_id: release.id
      });
      console.log(`Release ${release.tag_name} supprimée`);
    }

    // Récupérer tous les tags
    const tags = await octokit.rest.repos.listTags({
      owner,
      repo
    });

    // Supprimer chaque tag
    for (const tag of tags.data) {
      await octokit.rest.git.deleteRef({
        owner,
        repo,
        ref: `tags/${tag.name}`
      });
      console.log(`Tag ${tag.name} supprimé`);
    }

    // Mettre à jour la version dans package.json
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    packageJson.version = '1.0.0';
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    console.log('Version mise à jour à 1.0.0 dans package.json');

  } catch (error) {
    console.error('Erreur lors de la suppression des releases et tags:', error.message);
=======
async function closeAllIssues(owner, repo) {
  try {
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await octokit.rest.issues.listForRepo({
        owner: owner,
        repo: repo,
        state: 'open',
        per_page: 100,
        page: page
      });

      // Fermer chaque issue
      for (const issue of response.data) {
        await octokit.rest.issues.update({
          owner,
          repo,
          issue_number: issue.number,
          state: 'closed'
        });
        console.log(`Issue #${issue.number} fermée avec succès.`);
      }
      
      hasMore = response.data.length === 100;
      page++;
    }

    console.log('Toutes les issues ont été fermées avec succès.');
  } catch (error) {
    console.error('Erreur lors de la fermeture des issues:', error.message);
>>>>>>> 4418c6e ( t)
  }
}

// Exemple d'utilisation
const owner = 'vbcq-volley';
const repo = 'temp';

<<<<<<< HEAD
deleteAllReleases(owner, repo);
=======
closeAllIssues(owner, repo);
>>>>>>> 4418c6e ( t)
