const fs = require('fs-extra');

const copyFiles = async () => {
  try {
    //When we upgrade the pdfTron in package.json frile from version 8.3.1 then we need to update the core and for the same uncomene the below
    // await fs.copy('./node_modules/@pdftron/webviewer/public/core', './public/webviewer/core');
    console.log('WebViewer files copied over successfully');
  } catch (err) {
    console.error(err);
  }
};

copyFiles();