const { Octokit } = require("@octokit/rest");
const t = require("git-credential-node")
const login = t.fillSync("https://github.com")

// Initialisation du client Octokit
const octokit = new Octokit({
  auth: login.password
});

async function closeReferencedIssue(owner, repo, issueNumber, issue, openIssues) {
  try {
    // Vérifier si l'issue référencée est dans le tableau des issues ouvertes
    const referencedIssue = openIssues.find(i => i.number === issueNumber);

    if (referencedIssue) {
      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: issue,
        body: `closes #${issueNumber}`
      });
  //    console.log(`Issue #${issueNumber} fermée avec succès`);
    } else {
  //    console.log(`Issu#${issueNumber} est déjà fermée`);
    }
  } catch (error) {
    console.error(`Erreur lors de la fermeture de l'issue #${issueNumber}:`, error.message);
  }
}

async function linkIssuesToPR(owner, repo, prNumber, issues) {
  try {
    // Filtrer pour ne garder que les issues ouvertes
    const openIssues = issues.filter(issue => issue.state === 'open');
    const issueNumbers = openIssues.slice(0, 10).map(issue => `closes #${issue.number}`).join('\n   ');
    console.log(issueNumbers);
    if (issueNumbers) {
      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: prNumber,
        body: ` ${issueNumbers}`
      });
      console.log(`Issues ouvertes liées à la PR #${prNumber}`);
    } else {
      console.log('Aucune issue ouverte à lier');
    }
  } catch (error) {
    console.error(`Erreur lors de la liaison des issues à la PR #${prNumber}:`, error.message);
  }
}

async function listOpenIssues(owner, repo) {
  try {
    let allIssues = [];
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

      allIssues = allIssues.concat(response.data);
      
      // Vérifie s'il y a plus de pages
      hasMore = response.data.length === 100;
      page++;
    }

    // Vérifier s'il y a une PR ouverte
    const prs = await octokit.rest.pulls.list({
      owner,
      repo,
      state: 'open'
    });

    if (prs.data.length > 0) {
      // Lier toutes les issues à la première PR ouverte
      await linkIssuesToPR(owner, repo, prs.data[0].number, allIssues);
    }

    console.log('Issues ouvertes :');
    for (const issue of allIssues) {
      // console.log(`#${issue.number} - ${issue.title}`);
      
      // Recherche de références d'issues dans le titre
      const matches = issue.title.match(/\[#(\d+)\]/g);
      if (matches) {
        for (const match of matches) {
          const referencedIssueNumber = parseInt(match.match(/\d+/)[0]);
          //await closeReferencedIssue(owner, repo, referencedIssueNumber, issue.number, allIssues);
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des issues:', error.message);
  }
}

// Exemple d'utilisation
const owner = 'vbcq-volley';
const repo = 'temp';

listOpenIssues(owner, repo);