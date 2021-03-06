var root = __dirname
var fs = require('fs-extra'),
    entrypoints = require('./conf/entrypoints'),
    exec = require('child_process').exec,
    _ = require('lodash'),
    distDir = root + '/dist/',
    versionBase = '1.1.',
    currentVersion = parseFloat(require(distDir + 'salad-ui/package.json').version.split('.')[2]),
    version = versionBase + (currentVersion + 1)

console.log('Attempt to publish all entrypoints... version: ', version)
console.log('Please verify /usr/local/bin/npm is available')

// manually add non JS Components
entrypoints['salad-ui.transitions'] = 'transitions.css'

const childPackage = {
  "name": "salad-ui",
  "version": "1.0.0",
  "description": "Reusable React UI Components Toolkit",
  "main":"./salad-ui.js",
  "repository":{
    "type":"git",
    "url":"https://github.com/dailymotion/salad-ui.git"
  },
  "keywords":[
    "react",
    "react-component",
    "react-chart",
    "react-graph"
  ]
}

_.map(entrypoints, function(entrypoint, name){
  console.log('Creating', name)
  var pk = _.merge(childPackage, {name: name, version: version, main: './'+name+'.js'})
  if(name !== 'salad-ui.lib'){
    pk['peerDependencies'] = {
      "react": "^15.0.0",
      "react-dom": "^15.0.0",
      "react-router": "^2.4.1",
    }
  }
  fs.writeFile(distDir + name + '/package.json', JSON.stringify(pk), function(err){
    if(err){
      console.log('Could not save package.json!', err)
    }
    exec('cd ' + distDir + name + ' && /usr/local/bin/npm publish', function(error, stdout, stderr){
      if(error) console.log('Error: ', error)
      console.log(stdout)
    })
  })
})
