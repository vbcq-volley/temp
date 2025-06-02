const fs = require('fs');
const path = require('path');
const util = require('util');
 const picocolors = require('picocolors');

const { Octokit } = require('@octokit/rest');
const t =require("git-credential-node")
const login=t.fillSync("https://github.com")
 async function getGitConfig() {
    const config = {};
    try {
        config.user = login.username
     
        config.remoteUrl = "https://github.com/vbcq-volley/temp.git"
    } catch (error) {
        logger.error(`Error getting Git config: ${error.message}`);
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
 async function createIssueForError(context,errorMessage) {
    const config = await getGitConfig();
    if (!config.remoteUrl) {
        logger.error('Remote URL not found in Git config');
        return;
    }

    const repoInfo = extractRepoInfo(config.remoteUrl);
    if (!repoInfo) {
        logger.error('Could not extract repository information from remote URL');
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
        logger.info(errorMessage)
        logger.info(`Issue created: ${response.data.html_url}`);
    } catch (error) {
        logger.error(`Error creating issue: ${error.message}`);
    }
}
const TRACE = 10;
const DEBUG = 20;
const INFO = 30;
const WARN = 40;
const ERROR = 50;
const FATAL = 60;

const LEVEL_NAMES = {
    10: 'TRACE',
    20: 'DEBUG',
    30: 'INFO ',
    40: 'WARN ',
    50: 'ERROR',
    60: 'FATAL'
};

const LEVEL_COLORS = {
    10: 'gray',
    20: 'gray',
    30: 'green',
    40: 'bgYellow',
    50: 'bgRed',
    60: 'bgRed'
};

class GlobalLogger {
    constructor({ debug = false, silent = false } = {}) {
        this.logDir = path.join(process.cwd(), 'logs');
        this.logFile = path.join(this.logDir, 'hexo.log');
        this.errorFile = path.join(this.logDir, 'error.log');
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.maxFiles = 5;
        //console.log(debug)
        this._silent = silent || false;
        this._debug = debug || true;
        this.level = INFO;

        if (silent) {
            this.level = FATAL + 10;
        }
        if (this._debug) {
            this.level = TRACE;
        }
        
        // Créer le dossier logs s'il n'existe pas
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    _rotateFile(filePath) {
        if (!fs.existsSync(filePath)) return;

        const stats = fs.statSync(filePath);
        if (stats.size >= this.maxFileSize) {
            // Rotation des fichiers
            for (let i = this.maxFiles - 1; i >= 0; i--) {
                const oldPath = i === 0 ? filePath : `${filePath}.${i}`;
                const newPath = `${filePath}.${i + 1}`;
                
                if (fs.existsSync(oldPath)) {
                    if (i === this.maxFiles - 1) {
                        fs.unlinkSync(oldPath);
                    } else {
                        fs.renameSync(oldPath, newPath);
                    }
                }
            }
        }
    }

    _writeLogOutput(level, ...args) {
       // console.log(LEVEL_NAMES[level])
       // console.log(level < this.level)
        if (level < this.level) return;

        let errArg;
        if (typeof args[0] === 'object') {
            errArg = args.shift();
            if (errArg.err && errArg.err instanceof Error) {
                errArg = errArg.err;
            }
        }

        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${LEVEL_NAMES[level]}] ${args.join(' ')}\n`;

        // Rotation des fichiers si nécessaire
        this._rotateFile(this.logFile);
        if (level >= ERROR) {
            this._rotateFile(this.errorFile);
        }

        // Écriture dans les fichiers
        fs.appendFileSync(this.logFile, logMessage);
        if (level >= ERROR) {
            fs.appendFileSync(this.errorFile, logMessage);
        }

        // Affichage console avec couleur
        
            const timeStr = timestamp.substring(11, 23) + ' ';
            if (level === TRACE || level >= WARN) {
                process.stderr.write(picocolors[LEVEL_COLORS[DEBUG]](timeStr));
            } else {
                process.stdout.write(picocolors[LEVEL_COLORS[DEBUG]](timeStr));
            }
        

        const levelStr = picocolors[LEVEL_COLORS[level]](LEVEL_NAMES[level]) + ' ';
        if (level === TRACE || level >= WARN) {
            process.stderr.write(levelStr);
        } else {
            process.stdout.write(levelStr);
        }

        if (level === TRACE) {
            console.trace(...args);
        } else if (level < INFO) {
            console.debug(...args);
        } else if (level < WARN) {
            console.info(...args);
        } else if (level < ERROR) {
            console.warn(...args);
        } else {
            console.error(...args);
        }

        if (errArg) {
            const err = errArg.stack || errArg.message;
            if (err) {
                const errStr = picocolors.yellow(err) + '\n';
                if (level === TRACE || level >= WARN) {
                    process.stderr.write(errStr);
                } else {
                    process.stdout.write(errStr);
                }
            }
        }

        // Créer une issue GitHub pour les erreurs
        //console.log(typeof createIssueForError)
        if (level >= ERROR && typeof createIssueForError === 'function') {
            createIssueForError(`Erreur dans ${args.join(' ')}:`, errArg || args.join(' '));
        }
    }

    trace(...args) {
        this._writeLogOutput(TRACE, ...args);
    }

    debug(...args) {
        this._writeLogOutput(DEBUG, ...args);
    }

    info(...args) {
        this._writeLogOutput(INFO, ...args);
    }

    warn(...args) {
        this._writeLogOutput(WARN, ...args);
    }

    error(...args) {
        this._writeLogOutput(ERROR, ...args);
    }

    fatal(...args) {
        this._writeLogOutput(FATAL, ...args);
    }

    // Alias pour la compatibilité
    d(...args) { this.debug(...args); }
    i(...args) { this.info(...args); }
    w(...args) { this.warn(...args); }
    e(...args) { this.error(...args); }
    log(...args) { this.info(...args); }
}

// Créer une instance unique du logger
const logger = new GlobalLogger();

// Exporter l'instance unique
module.exports = logger; 