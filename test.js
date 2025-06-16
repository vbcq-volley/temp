const { Octokit } = require("@octokit/rest");
const t = require("git-credential-node")
const login = t.fillSync("https://github.com")
const fs = require('fs');
t.rejectSync("https://github.com")
// Initialisation du client Octokit
const octokit = new Octokit({
  auth: login.password
});

async function closeAllIssues(owner, repo) {
  try {
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await octokit.rest.issues.listForRepo({
        owner: owner,
        repo: repo,
        state: 'closed',
        per_page: 100,
        page: page
      });

      // Fermer chaque issue
      for (const issue of response.data) {
        console.log(issue.number)
        if(issue.pull_request) continue;
        await octokit.rest.issues.update({
          owner,
          repo,
          issue_number: issue.number,
          state: 'open'
        });
        await octokit.rest.issues.update({
          owner,
          repo,
          issue_number: issue.number,
          state: 'close'
        });
        console.log(`Issue #${issue.number} fermée avec succès.`);
      }
      
      hasMore = response.data.length===100;
      page++;
    }

    console.log('Toutes les issues ont été fermées avec succès.');
  } catch (error) {
    console.error('Erreur lors de la fermeture des issues:', error.message);
  }
}

// Exemple d'utilisation
const owner = 'vbcq-volley';
const repo = 'temp';

//closeAllIssues(owner, repo);
