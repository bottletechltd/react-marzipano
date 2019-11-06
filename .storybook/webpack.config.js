const path = require('path')
const custom = require('../webpack.config.js')

module.exports = async ({ config, mode }) => {
  config.resolve.modules.push(path.resolve(__dirname, '../src'))

  return { ...config, module: { ...config.module, rules: custom.module.rules } }
}
