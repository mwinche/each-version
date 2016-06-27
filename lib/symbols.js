require('colors');

const symbols = {
  ok: '✓'.green.bold,
  err: '✖'.red.bold
};

// With node.js on Windows: use symbols available in terminal default fonts
if (process && process.platform === 'win32') {
  symbols.ok = '\u221A'.green.bold;
  symbols.err = '\u00D7'.red.bold;
}

module.exports = symbols;
