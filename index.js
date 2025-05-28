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
fs.writeFileSync("_config.yml",`# Hexo Configuration
## Docs: https://hexo.io/docs/configuration.html
## Source: https://github.com/hexojs/hexo/

# Site
title: Hexo
subtitle: ''
description: ''
keywords:
author: John Doe
language: en
timezone: 'Europe/Paris'

# URL
## Set your site url here. For example, if you use GitHub Page, set url as 'https://username.github.io/project'


permalink: :year/:month/:day/:title/
permalink_defaults:
pretty_urls:
  trailing_index: true # Set to false to remove trailing 'index.html' from permalinks
  trailing_html: true # Set to false to remove trailing '.html' from permalinks

# Directory

source_dir: source
public_dir: public
tag_dir: tags
archive_dir: archives
category_dir: categories
code_dir: downloads/code
i18n_dir: :lang
skip_render: false 
plugins_dir: plugin
# Writing
new_post_name: :title.md # File name of new posts
default_layout: post
titlecase: false # Transform title into titlecase
external_link:
  enable: true # Open external links in new tab
  field: site # Apply to the whole site
  exclude: ''
filename_case: 0
render_drafts: true
post_asset_folder: false
relative_link: false
future: true
syntax_highlighter: highlight.js
highlight:
  line_number: true
  auto_detect: false
  tab_replace: ''
  wrap: true
  hljs: false
prismjs:
  preprocess: true
  line_number: true
  tab_replace: ''

# Home page setting
# path: Root path for your blogs index page. (default = '')
# per_page: Posts displayed per page. (0 = disable pagination)
# order_by: Posts order. (Order by date descending by default)
index_generator:
  path: ''
  per_page: 10
  order_by: -date

# Category & Tag
default_category: uncategorized
category_map:
tag_map:

# Metadata elements
## https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta
meta_generator: true

# Date / Time format
## Hexo uses Moment.js to parse and display date
## You can customize the date format as defined in
## http://momentjs.com/docs/#/displaying/format/
date_format: YYYY-MM-DD
time_format: HH:mm:ss
## updated_option supports 'mtime', 'date', 'empty'
updated_option: 'mtime'

# Pagination
## Set per_page to 0 to disable pagination
per_page: 10
pagination_dir: page

# Include / Exclude file(s)
## include:/exclude: options only apply to the 'source/' folder


# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: landscape

# Deployment
## Docs: https://hexo.io/docs/one-command-deployment
deploy:
  type: ''
`)
const admin=new hexo(process.cwd(), {
debug: true,
silent: false,

})

async function main() {
    await manageRepo({ name: 'plugins', url: 'https://github.com/vbcq-volley/plugin-build.git', path: './dist' })
    await manageRepo({ name: 'source', url: 'https://github.com/vbcq-volley/content.git', path: './source' }

    )
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
            
        
 

