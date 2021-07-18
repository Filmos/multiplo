fs = require('fs');
parser = require("./../parser.js")
symbols = parser.defaultOptions.symbols



let fullREADME = fs.readFileSync('readme_intro.md')

fs.readdirSync('./../commands/').forEach(file => {
  let comm = require("./../commands/"+file)
  fullREADME += makeCommandReadme(file.split(".")[0], comm)
});

fs.writeFile('./../README.md', fullREADME, function (err) {
  if (err) return console.error(err);
});



function makeCommandReadme(name, comm) {
  let args = comm.arguments || []
  let title = symbols.left+[name, ...args].join(symbols.split)+symbols.right
  
  let examples = []
  for(let ex of (comm.examples || [])) {
    let updated = updateSymbols(ex, comm.examplesVersion)
    examples.push('##### Input\n```\n'+updated+'\n```\n ##### Output\n```\n'+parser.parse(updated)+'\n```')
  }
  examples = examples.join("\n\n---\n")
  
  let description = comm.description
  if(description) for(let i=args.length-1;i>=0;i--)
    description = description.replace(new RegExp("\\$"+(i+1), 'g'), "`"+args[i]+"`")
  else if(examples) description = "No description is available for this command"
  else description = "No documentation is available for this command"
  
  
  return `
### ${title}
${description}`+(examples?`

#### Examples
${examples}
`:"")
}

function updateSymbols(string, symbolsVersion) {
  if(!symbolsVersion) return string
  
  let currentVersion = symbols.left+symbols.right+symbols.split+symbols.var
  if(currentVersion.length < symbolsVersion.length) {
    console.warn("Invalid symbols version: "+symbolsVersion)
    return string
  }
  if(currentVersion.indexOf(symbolsVersion)==0) return string
  
  for(let i=0;i<symbolsVersion.length;i++)
    string = string.replace(new RegExp(symbolsVersion[i], 'g'), currentVersion[i])
  return string
}