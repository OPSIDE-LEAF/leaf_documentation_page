import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, resolve, relative, isAbsolute } from 'node:path'
import { fileURLToPath } from 'node:url'
import { zipSync, unzipSync } from 'fflate'

const docs = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const root = resolve(docs, 'public/skills/leaf-module-builder')
const archive = resolve(docs, 'public/downloads/leaf-module-builder.zip')
const checkOnly = process.argv.includes('--check')
const compareIndex = process.argv.indexOf('--compare')
if (compareIndex >= 0 && !process.argv[compareIndex + 1]) throw new Error('--compare needs a directory')
const compare = compareIndex >= 0 ? resolve(process.argv[compareIndex + 1]) : null

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (entry.isSymbolicLink()) throw new Error(`Skill must not contain symlinks: ${entry.name}`)
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) return walk(path)
    if (!entry.isFile() || !/\.(md|kt)$/.test(entry.name)) throw new Error(`Unexpected skill file: ${path}`)
    return [path]
  }).sort()
}

const files = walk(root)
const contents = new Map(files.map(file => [relative(root, file).replaceAll('\\', '/'), readFileSync(file)]))
const normalized = bytes => bytes.toString('utf8').replaceAll('\r\n', '\n').trimEnd()
const skill = contents.has('SKILL.md') ? normalized(contents.get('SKILL.md')) : null
if (!skill?.startsWith('---\nname: leaf-module-builder\ndescription: >-\n')) {
  throw new Error('Missing or invalid skill frontmatter')
}
const forbidden = /(?:^|[\s"'(])[A-Za-z]:[\\/]|\/Users\/|\/home\/|\bOneDrive\b|shared-harness|\bIA[\\/]|leaf\.useMavenLocal|%LEAF_VERSION%/i
for (const [name, bytes] of contents) {
  const content = bytes.toString('utf8')
  if (forbidden.test(content)) throw new Error(`Nonportable content in ${name}`)
  if (name.endsWith('.md')) {
    for (const [, href] of content.matchAll(/\]\(([^)]+)\)/g)) {
      if (/^https?:\/\//.test(href) || href.startsWith('#')) continue
      const target = resolve(root, dirname(name), href.split('#')[0])
      const within = relative(root, target)
      if (within.startsWith('..') || isAbsolute(within) || !files.includes(target)) {
        throw new Error(`Skill link must resolve inside its package: ${name} -> ${href}`)
      }
    }
  }
  if (compare) {
    const installed = resolve(compare, name)
    if (!existsSync(installed) || normalized(readFileSync(installed)) !== normalized(bytes)) {
      throw new Error(`Installed skill differs: ${name}`)
    }
  }
}
if (compare) {
  const installedNames = walk(compare).map(file => relative(compare, file).replaceAll('\\', '/')).sort()
  if (JSON.stringify(installedNames) !== JSON.stringify([...contents.keys()].sort())) {
    throw new Error('Installed skill file list differs')
  }
}

if (!checkOnly) {
  mkdirSync(dirname(archive), { recursive: true })
  const entries = Object.fromEntries([...contents].map(([name, bytes]) => [`leaf-module-builder/${name}`, bytes]))
  writeFileSync(archive, zipSync(entries, { level: 9, mtime: new Date('2020-01-01T00:00:00Z') }))
}
const packed = unzipSync(readFileSync(archive))
if (Object.keys(packed).length !== contents.size) throw new Error('Archive file count differs')
for (const [name, bytes] of contents) {
  const entry = packed[`leaf-module-builder/${name}`]
  if (!entry || !Buffer.from(entry).equals(bytes)) throw new Error(`Archive differs: ${name}`)
}
console.log(`Skill OK: ${contents.size} portable files; ZIP verified${compare ? '; local installation matches' : ''}.`)
