

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function installDependencies(directory) {
    try {
        // Vérifier si package.json existe
        if (fs.existsSync(path.join(directory, 'package.json'))) {
            console.log(`Installation des dépendances dans ${directory}`);
            execSync('npm install', { cwd: directory, stdio: 'inherit' });
        }
        
        // Lire le contenu du dossier
        const items = fs.readdirSync(directory);
        
        // Parcourir chaque élément
        items.forEach(item => {
            const fullPath = path.join(directory, item);
            
            // Vérifier si c'est un dossier
            if (fs.statSync(fullPath).isDirectory()) {
                // Ignorer node_modules
                if (item !== 'node_modules') {
                    installDependencies(fullPath);
                }
            }
        });
    } catch (error) {
        console.error(`Erreur lors de l'installation dans ${directory}:`, error);
    }
}

// Démarrer l'installation à partir du dossier courant
const startDirectory = "./plugin";
console.log(`Démarrage de l'installation des dépendances à partir de ${startDirectory}`);
fs.readdirSync(startDirectory).filter(item => fs.statSync(path.join(startDirectory, item)).isDirectory()).forEach(item => {
    installDependencies(path.join(startDirectory, item));
});

