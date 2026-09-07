import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const docs = join(scriptDirectory, '..', '..')
const locales = ['es', 'en']
const translatedSlugs = new Map([
  ['guide/arquitectura.md', 'guide/architecture.md'],
  ['guide/glosario.md', 'guide/glossary.md'],
  ['guide/errores-telemetria.md', 'guide/errors-telemetry.md'],
  ['guide/catalogo.md', 'guide/catalog.md'],
])
const retiredRoutes = [
  'guide/action-vs-feature',
  'guide/catalog-reference',
  'guide/email-reference',
  'guide/feature-migration',
  'guide/feature-session',
  'guide/legacy-migration',
  'guide/login-reference',
  'guide/quickstart-feature',
  'guide/roadmap',
  'guide/sandbox-backend',
  'project/chapter-1',
  'project/chapter-2',
  'project/chapter-3',
  'project/chapter-4',
  'project/introduction',
  'project/references',
]
const retiredSpanishRoutes = [
  'project/capitulo-1',
  'project/capitulo-2',
  'project/capitulo-3',
  'project/capitulo-4',
  'project/introduccion',
  'project/referencias',
]
const retiredTerms = [
  'quickstart-feature',
  'feature-session',
  'login-reference',
  'catalog-reference',
  'email-reference',
  'action-vs-feature',
  'feature-migration',
  'legacy-migration',
  'sandbox-backend',
]
const forbiddenPublicPatterns = [
  ['personal Windows user path', /[A-Za-z]:[\\/]+Users[\\/]/i],
  ['personal macOS user path', /\/Users\/[^/\s]+/i],
  ['personal Linux home path', /\/home\/[^/\s]+/i],
  ['personal cloud-storage path', /\bOneDrive\b/i],
  ['internal harness reference', /\bshared-harness\b/i],
  ['internal IA path', /(^|[^A-Za-z0-9])IA[\\/]/i],
  ['worktree-specific instruction', /\bworktrees?\b/i],
  ['local checkout wording', /\b(?:local\s+checkouts?|checkouts?\s+local(?:es)?)\b/i],
  ['internal Maven Local flag', /leaf\.(?:useMavenLocal|consumer\.usePublished)/i],
  ['internal consumer project', /\bclean-consumer\b/i],
  ['story-like English metaphor', /\b(?:story|stories|journey|journeys|conversation|conversations)\b/i],
  ['story-like Spanish metaphor', /\b(?:historia|historias|viaje|viajes|conversación|conversaciones)\b/i],
  ['retired catalog name', /Catálogo de superficies|Surface catalog/i],
]
const failures = []

function cardDescriptions(markdown) {
  return [...markdown.matchAll(/\bdescription:\s*'([^']+)'/g)].map((match) => match[1])
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = join(directory, entry.name)
    return entry.isDirectory() ? walk(full) : entry.name.endsWith('.md') ? [full] : []
  })
}

function text(file) {
  return readFileSync(file, 'utf8').replace(/\r\n/g, '\n')
}

function headings(markdown) {
  let fenced = false
  return markdown.split('\n').flatMap((line) => {
    if (line.startsWith('```')) fenced = !fenced
    if (fenced) return []
    const match = /^(#{1,6})\s+/.exec(line)
    return match ? [match[1].length] : []
  })
}

function fences(markdown) {
  return [...markdown.matchAll(/^```([^\n]*)$/gm)].map((match) => match[1].trim())
}

function kotlinSamples(markdown) {
  return [...markdown.matchAll(/^```kotlin\s*\n([\s\S]*?)^```$/gm)]
    .map((match) => match[1]
      .replace(/"(?:\\.|[^"\\])*"/g, '"<text>"')
      .replace(/\/\/.*$/gm, '')
      .trim())
}

function coordinates(markdown) {
  return [...markdown.matchAll(/com\.opside-leaf:[a-z0-9-]+:[0-9.]+/gi)]
    .map((match) => match[0])
    .sort()
}

function anchorIds(markdown) {
  let fenced = false
  return markdown.split('\n').flatMap((line) => {
    if (line.startsWith('```')) fenced = !fenced
    if (fenced) return []
    const match = /^(#{1,6})\s+(.+)$/.exec(line)
    if (!match) return []
    const id = match[2]
      .replace(/`/g, '')
      .normalize('NFD')
      .replace(/\p{Mark}/gu, '')
      .toLowerCase()
      .replace(/[^\p{Letter}\p{Number}_ -]/gu, '')
      .trim()
      .replace(/[ _]+/g, '-')
    return id ? [id] : []
  })
}

function counterpart(locale, sourceRelative) {
  if (locale === 'es') return translatedSlugs.get(sourceRelative) ?? sourceRelative
  return [...translatedSlugs].find(([, english]) => english === sourceRelative)?.[0] ?? sourceRelative
}

function renderedHref(locale, sourceRelative) {
  const route = sourceRelative
    .replace(/(^|\/)index\.md$/, '$1')
    .replace(/\.md$/, '.html')
  return `/${locale}/${route}`
}

function routeExists(locale, url) {
  const path = url.replace(/#.*/, '').replace(new RegExp(`^/${locale}/?`), '')
  const base = join(docs, locale, path)
  return existsSync(`${base}.md`) || existsSync(join(base, 'index.md')) ||
    (path === '' && existsSync(join(docs, locale, 'index.md')))
}

function verifyInternalLinks(locale, file) {
  for (const match of text(file).matchAll(/\]\(\/(es|en)\/([^\s)#]*)[^)]*\)/g)) {
    const [, destinationLocale] = match
    const url = match[0].slice(match[0].indexOf('](') + 2, -1).split(/\s+/)[0]
    if (destinationLocale !== locale) failures.push(`${relative(docs, file)} links to another locale: ${url}`)
    if (!routeExists(locale, url)) failures.push(`${relative(docs, file)} has missing destination: ${url}`)
  }
}

const byLocale = Object.fromEntries(locales.map((locale) => [locale, walk(join(docs, locale))]))
const esFiles = new Map(byLocale.es.map((file) => [relative(join(docs, 'es'), file).replace(/\\/g, '/'), file]))
const enFiles = new Map(byLocale.en.map((file) => [relative(join(docs, 'en'), file).replace(/\\/g, '/'), file]))
const publicMarkdownFiles = [
  ...byLocale.es,
  ...byLocale.en,
  join(docs, '..', 'README.md'),
  join(docs, '..', 'README-es.md'),
].filter(existsSync)

for (const file of publicMarkdownFiles) {
  const markdown = text(file)
  for (const [label, pattern] of forbiddenPublicPatterns) {
    const match = pattern.exec(markdown)
    if (match) {
      const line = markdown.slice(0, match.index).split('\n').length
      failures.push(`Forbidden ${label}: ${relative(join(docs, '..'), file)}:${line}`)
    }
  }
}

if (!text(join(docs, 'es', 'guide', 'maven-local.md')).includes('Su uso es opcional.')) {
  failures.push('Spanish Maven Local guide must present Maven Local as optional testing.')
}
if (!text(join(docs, 'en', 'guide', 'maven-local.md')).includes('Using it is optional.')) {
  failures.push('English Maven Local guide must present Maven Local as optional testing.')
}
if (!text(join(docs, 'es', 'guide', 'catalogo.md')).startsWith('# Catálogo de módulos')) {
  failures.push('Spanish catalog must be named Catálogo de módulos.')
}
if (!text(join(docs, 'en', 'guide', 'catalog.md')).startsWith('# Module catalog')) {
  failures.push('English catalog must be named Module catalog.')
}

for (const [esRelative, esFile] of esFiles) {
  const enRelative = translatedSlugs.get(esRelative) ?? esRelative
  const enFile = enFiles.get(enRelative)
  if (!enFile) {
    failures.push(`Missing English counterpart for es/${esRelative}: expected en/${enRelative}`)
    continue
  }
  const esMarkdown = text(esFile)
  const enMarkdown = text(enFile)
  for (const [label, left, right] of [
    ['heading levels', headings(esMarkdown), headings(enMarkdown)],
    ['code fences', fences(esMarkdown), fences(enMarkdown)],
    ['Kotlin samples', kotlinSamples(esMarkdown), kotlinSamples(enMarkdown)],
    ['Maven coordinates', coordinates(esMarkdown), coordinates(enMarkdown)],
  ]) {
    if (JSON.stringify(left) !== JSON.stringify(right)) {
      failures.push(`Parity mismatch in ${label}: es/${esRelative} vs en/${enRelative}`)
    }
  }
}

for (const [enRelative] of enFiles) {
  const expectedEs = counterpart('en', enRelative)
  if (!esFiles.has(expectedEs)) failures.push(`Missing Spanish counterpart for en/${enRelative}: expected es/${expectedEs}`)
}

for (const locale of locales) {
  for (const file of byLocale[locale]) verifyInternalLinks(locale, file)
  const sidebar = text(join(docs, '.vitepress', 'languages', `${locale}.ts`))
  for (const match of sidebar.matchAll(/link:\s*'([^']+)'/g)) {
    if (!routeExists(locale, match[1])) failures.push(`Sidebar ${locale} has missing destination: ${match[1]}`)
  }
}

for (const locale of locales) {
  const home = text(join(docs, locale, 'index.md'))
  const descriptions = cardDescriptions(home)
  if (descriptions.length !== 9) {
    failures.push(`Home ${locale} must provide nine CardGrid descriptions; found ${descriptions.length}`)
  }
  if (/\bdetails:\s*'/.test(home)) {
    failures.push(`Home ${locale} uses CardGrid's unsupported details property`)
  }
}

for (const route of retiredRoutes) {
  for (const locale of locales) {
    const source = join(docs, locale, `${route}.md`)
    if (existsSync(source)) failures.push(`Retired source remains: ${relative(docs, source)}`)
  }
}
for (const route of retiredSpanishRoutes) {
  const source = join(docs, 'es', `${route}.md`)
  if (existsSync(source)) failures.push(`Retired source remains: ${relative(docs, source)}`)
}
for (const locale of locales) {
  for (const file of byLocale[locale]) {
    const markdown = text(file)
    for (const term of retiredTerms) {
      if (markdown.includes(term)) failures.push(`Retired term remains: ${relative(docs, file)} (${term})`)
    }
  }
}

const dist = join(docs, '.vitepress', 'dist')
if (existsSync(dist)) {
  for (const locale of locales) {
    for (const file of byLocale[locale]) {
      const sourceRelative = relative(join(docs, locale), file).replace(/\\/g, '/')
      const rendered = join(dist, locale, sourceRelative.replace(/\.md$/, '.html'))
      if (!existsSync(rendered)) {
        failures.push(`Missing rendered route: ${relative(docs, rendered)}`)
        continue
      }
      const html = text(rendered)
      if (!html.includes(`<html lang="${locale}"`)) failures.push(`Wrong rendered language: ${relative(docs, rendered)}`)
      for (const anchor of anchorIds(text(file))) {
        if (!html.includes(`id="${anchor}"`)) failures.push(`Missing rendered anchor ${anchor}: ${relative(docs, rendered)}`)
      }
      const otherLocale = locale === 'es' ? 'en' : 'es'
      const expectedLanguageHref = renderedHref(otherLocale, counterpart(locale, sourceRelative))
      if (!html.includes(`href="${expectedLanguageHref}"`)) {
        failures.push(`Language switch is missing or wrong in ${relative(docs, rendered)}: ${expectedLanguageHref}`)
      }
    }
    const home = text(join(docs, locale, 'index.md'))
    const renderedHome = text(join(dist, locale, 'index.html'))
    for (const description of cardDescriptions(home)) {
      if (!renderedHome.includes(description)) {
        failures.push(`Home card description is not rendered in ${locale}: ${description}`)
      }
    }
    for (const route of retiredRoutes) {
      const rendered = join(dist, locale, `${route}.html`)
      if (existsSync(rendered)) failures.push(`Retired route remains: ${relative(docs, rendered)}`)
    }
  }
  for (const route of retiredSpanishRoutes) {
    const rendered = join(dist, 'es', `${route}.html`)
    if (existsSync(rendered)) failures.push(`Retired route remains: ${relative(docs, rendered)}`)
  }
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(`Parity OK: ${esFiles.size} Spanish pages and ${enFiles.size} English pages.`)
