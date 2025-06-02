const { Octokit } = require("@octokit/rest");
const t = require("git-credential-node")
const login = t.fillSync("https://github.com")

// Initialisation du client Octokit
const octokit = new Octokit({
  auth: login.password
});

// Gestionnaire d'issues local
class IssueManager {
  constructor() {
    this.issues = [];
  }

  // Mise à jour d'une issue dans le tableau local
  updateIssue(issueNumber, updates) {
    const issue = this.issues.find(i => i.number === issueNumber);
    if (issue) {
      Object.assign(issue, updates);
    }
  }

  // Ajout d'une issue au tableau local
  addIssue(issue) {
    this.issues.push(issue);
  }

  // Récupération d'une issue par son numéro
  getIssue(issueNumber) {
    return this.issues.find(i => i.number === issueNumber);
  }

  // Mise à jour de plusieurs issues
  updateIssues(issues) {
    issues.forEach(issue => {
      const existingIssue = this.issues.find(i => i.number === issue.number);
      if (existingIssue) {
        Object.assign(existingIssue, issue);
      } else {
        this.addIssue(issue);
      }
    });
  }
}

const issueManager = new IssueManager();

async function closeReferencedIssue(owner, repo, issueNumber, issue, openIssues) {
    try {
      console.log(`Vérification de l'issue #${issueNumber}...`);
  
      const referencedIssue = issueManager.getIssue(issueNumber);
  
      if (referencedIssue) {
        console.log(`Issue #${issueNumber} trouvée et ouverte. Tentative de fermeture...`);
        const updatedBody = `${referencedIssue.body} \nCette issue ferme l'issue #${issueNumber}`;
        
        // Mise à jour sur GitHub
        await octokit.rest.issues.update({
          owner,
          repo,
          issue_number: issue,
          body: updatedBody
        });

        // Mise à jour locale
        issueManager.updateIssue(issue, { body: updatedBody });
        console.log(`Commentaire ajouté pour fermer l'issue #${issueNumber} avec succès.`);
      } else {
        console.log(`Issue #${issueNumber} non trouvée dans la liste des issues ouvertes.`);
      }
    } catch (error) {
      console.error(`Erreur lors de la fermeture de l'issue #${issueNumber}:`, error.message);
    }
}

async function linkIssuesToPR(owner, repo, prNumber, issues) {
  try {
    const openIssues = issues.filter(issue => issue.state === 'open');
    const prBody = openIssues.slice(0, 10).map(issue => `fixes #${issue.number}`).join('\n');
    
    // Mise à jour sur GitHub
    await octokit.rest.pulls.update({
      owner,
      repo,
      pull_number: prNumber,
      body: prBody
    });

    // Mise à jour locale
    issueManager.updateIssue(prNumber, { body: prBody });

    console.log(`Commentaires ajoutés pour les issues #${openIssues.map(issue => issue.number).join(', #')}`);
    console.log(`Issues ouvertes liées à la PR #${prNumber}`);
  } catch (error) {
    console.error(`Erreur lors de la liaison des issues à la PR #${prNumber}:`, error.message);
  }
}

async function listOpenIssues(owner, repo) {
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

      // Mise à jour du gestionnaire d'issues
      issueManager.updateIssues(response.data);
      
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
      await linkIssuesToPR(owner, repo, prs.data[0].number, issueManager.issues);
    }

    console.log('Issues ouvertes :');
    const openIssues = issueManager.issues.filter(issue => issue.state === 'open').slice(0, 10);
    
    for (const issue of openIssues) {
      const matches = issue.title.match(/\[#(\d+)\]/g);
      if (matches) {
        for (const match of matches) {
          const referencedIssueNumber = parseInt(match.match(/\d+/)[0]);
          await closeReferencedIssue(owner, repo, referencedIssueNumber, issue.number, issueManager.issues);
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