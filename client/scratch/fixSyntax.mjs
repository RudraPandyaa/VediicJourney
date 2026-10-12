import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDir = path.join(__dirname, '../app/data')

const files = [
  'statesData.ts',
  'europeData.ts',
  'africaData.ts',
  'southAmericaData.ts',
  'middleEastData.ts'
]

for (const file of files) {
  const filePath = path.join(dataDir, file)
  let content = fs.readFileSync(filePath, 'utf8')
  
  // Find all description: '...'
  // We know the description property ends where the next property or object end is.
  // In our case, after description, we either have `, image:` or ` }` or `\n    ],`
  
  // A regex to match description: '...' up to the LAST quote before `, image:` or ` }`
  // Actually, let's just match description: '(.*?)'(?:, image: | \})
  // Wait, .*? will match up to the FIRST quote.
  // If we match description: '(.*?)'(?:, image:| \}) but we want to eat up the garbage.
  // The garbage is like: description: 'Good text.'s garbage text.',
  
  // Let's replace: description: '([^']*)'s [^']*',
  // with: description: '$1',
  
  // Wait, there are multiple unescaped quotes in the garbage!
  // e.g. `...'s tallest statue... indep...'s tallest statue, dedicated... Patel.'`
  
  // Let's just write a custom replacer.
  // We look for `description: '`
  let offset = 0
  while (true) {
    const startIdx = content.indexOf(`description: '`, offset)
    if (startIdx === -1) break
    
    const contentStart = startIdx + `description: '`.length
    
    // Find the next `, image:` or ` }` or `\n` that clearly marks the end of the property.
    let endIdx1 = content.indexOf(`, image:`, contentStart)
    let endIdx2 = content.indexOf(` }`, contentStart)
    let endIdx3 = content.indexOf(`\n`, contentStart)
    
    let endIdx = Math.min(
      endIdx1 !== -1 ? endIdx1 : Infinity,
      endIdx2 !== -1 ? endIdx2 : Infinity,
      endIdx3 !== -1 ? endIdx3 : Infinity
    )
    
    if (endIdx === Infinity) {
      offset = contentStart
      continue
    }
    
    // The full text of the description value including garbage and quotes
    const fullVal = content.substring(contentStart, endIdx)
    
    // If it has syntax errors (multiple unescaped quotes), we fix it.
    // Let's count unescaped quotes.
    let unescapedQuotes = 0
    let firstUnescapedQuoteIdx = -1
    for (let i = 0; i < fullVal.length; i++) {
      if (fullVal[i] === "'" && (i === 0 || fullVal[i-1] !== "\\")) {
        unescapedQuotes++
        if (firstUnescapedQuoteIdx === -1) {
          firstUnescapedQuoteIdx = i
        }
      }
    }
    
    if (unescapedQuotes > 1) {
      // It's corrupted! We take the string up to the first unescaped quote.
      const fixedVal = fullVal.substring(0, firstUnescapedQuoteIdx)
      
      console.log(`Fixing in ${file}:`)
      console.log(`Old: ${fullVal}`)
      console.log(`New: ${fixedVal}'`)
      
      content = content.substring(0, contentStart) + fixedVal + "'" + content.substring(endIdx)
      offset = contentStart + fixedVal.length + 1
    } else {
      offset = endIdx
    }
  }
  
  fs.writeFileSync(filePath, content)
}
console.log("Syntax fix complete.")
