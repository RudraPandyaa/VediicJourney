import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import https from 'https'

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

async function fetchWikiExtract(searchTerm) {
  return new Promise((resolve) => {
    const term = encodeURIComponent(searchTerm.split(' (')[0].trim())
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${term}`
    
    https.get(url, { headers: { 'User-Agent': 'VedicJourney/1.0 (test@example.com)' } }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          if (parsed.extract && parsed.extract.length > 50) {
            resolve(parsed.extract)
          } else {
            resolve(null)
          }
        } catch (e) {
          resolve(null)
        }
      })
    }).on('error', () => resolve(null))
  })
}

// Fallback generic long descriptions if Wikipedia fails
const fallbackState = "Experience a journey like no other, where ancient traditions blend seamlessly with modern wonders. This breathtaking destination offers visitors an unparalleled opportunity to explore rich cultural heritage, stunning architectural marvels, and pristine natural landscapes. From vibrant local markets teeming with life to serene historic sites that whisper tales of the past, every moment here is designed to captivate your senses and leave you with unforgettable memories."

const fallbackPlace = "A mesmerizing location that stands as a testament to history and natural beauty. Visitors are often left in awe of its majestic presence and the vibrant atmosphere that surrounds it. Whether you are exploring its intricate details, enjoying the sweeping views, or simply soaking in the local culture, this iconic spot offers a truly immersive experience that highlights the unique charm of the region."

async function processFiles() {
  for (const file of files) {
    const filePath = path.join(dataDir, file)
    let content = fs.readFileSync(filePath, 'utf8')
    console.log(`Processing ${file}...`)
    
    // Process States
    const stateRegex = /name:\s*'([^']+)',\s*(?:tagline:\s*'[^']+',\s*)?description:\s*'([^']+)'/g
    let stateMatches = [...content.matchAll(stateRegex)]
    for (const match of stateMatches) {
      const fullMatch = match[0]
      const name = match[1]
      const oldDesc = match[2]
      
      let newDesc = await fetchWikiExtract(name)
      if (!newDesc) newDesc = `${oldDesc} ${fallbackState}`
      
      // Limit to ~300 chars
      if (newDesc.length > 300) newDesc = newDesc.substring(0, 300) + '...'
      
      // Remove newlines and escape single quotes
      newDesc = newDesc.replace(/\n/g, ' ').replace(/'/g, "\\'")
      
      const replaced = fullMatch.replace(`description: '${oldDesc}'`, `description: '${newDesc}'`)
      content = content.replace(fullMatch, replaced)
    }
    
    // Process Places
    const placeRegex = /\{\s*name:\s*'([^']+)',\s*description:\s*'([^']+)'/g
    let placeMatches = [...content.matchAll(placeRegex)]
    for (const match of placeMatches) {
      const fullMatch = match[0]
      const name = match[1]
      const oldDesc = match[2]
      
      let newDesc = await fetchWikiExtract(name)
      if (!newDesc) newDesc = `${oldDesc} ${fallbackPlace}`
      
      // Limit to ~250 chars
      if (newDesc.length > 250) newDesc = newDesc.substring(0, 250) + '...'
      
      // Remove newlines and escape single quotes
      newDesc = newDesc.replace(/\n/g, ' ').replace(/'/g, "\\'")
      
      const replaced = fullMatch.replace(`description: '${oldDesc}'`, `description: '${newDesc}'`)
      content = content.replace(fullMatch, replaced)
    }
    
    fs.writeFileSync(filePath, content)
    console.log(`Updated ${file}`)
  }
}

processFiles().then(() => console.log('Done!'))
