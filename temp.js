

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function installDependencies(directory) {
    try {
        // Vérifier si package.json existe
        if (fs.existsSync(path.join(directory, 'package.json'))) {
            console.log(`Modification des dépendances dans ${directory}`);
        
            // Lire le fichier package.json
            const packageJsonPath = path.join(directory, 'package.json');
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
            // Fonction pour supprimer les dépendances avec "file:"
            const removeFileDependencies = (dependencies) => {
                if (!dependencies) return;
                for (const [dep, version] of Object.entries(dependencies)) {
                    if (version.startsWith('file:')) {
                        console.log(dep)
                        delete dependencies[dep];
                    }
                }
            };
        
            // Appliquer à dependencies, devDependencies, etc.
            removeFileDependencies(packageJson.dependencies);
            removeFileDependencies(packageJson.devDependencies);
            // Ajoutez d'autres types de dépendances si nécessaire
        
            // Écrire les modifications dans package.json
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        
            console.log(`Installation des dépendances dans ${directory}`);
            execSync(' npm install', { cwd: directory, stdio: 'inherit' });
           // execSync("pnpm rebuild -r ", { cwd: directory, stdio: 'inherit' });
            //execSync('pnpm approve-builds ', { cwd: directory, stdio: 'inherit' });
            if(packageJson.main){
                fs.appendFileSync("./build.cmd", "npx esbuild ./" + packageJson.main + " --bundle --platform=node --outfile=../../dist/" + packageJson.name + ".js\n");
                execSync('npx esbuild ./' + packageJson.main + ' --bundle --platform=node --outfile=../../dist/' + packageJson.name + '.js', { cwd: directory, stdio: 'inherit' });

            }
        }
        
        
        
        // Lire le contenu du dossier
        const items = fs.readdirSync(directory);
        
        // Parcourir chaque élément
        
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

