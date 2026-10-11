const { run } = require('./content-pipeline.cjs');
const result = run();
console.log('Drawing assets verified: ' + result.drawings + ' drawings, ' + result.regions + ' regions.');
