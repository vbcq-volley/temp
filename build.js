const esbuild = require('esbuild');

async function build() {
  try {
    await esbuild.build({
      entryPoints: ['./index.js'],
      bundle: true,
      minify: true,
      outfile: 'bundle.js',
      platform: 'node',
      external: ['*.map', './node_modules/hexo','./node_modules/@yao-pkg/pkg'],
     
    });
    console.log('Build terminé avec succès');
  } catch (err) {
    console.error('Erreur lors du build:', err);
    process.exit(1);
  }
}

build();
