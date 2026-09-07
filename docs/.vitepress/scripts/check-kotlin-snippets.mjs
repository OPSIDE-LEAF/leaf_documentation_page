import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const docsRoot = resolve(scriptDirectory, '..', '..')
const fixtureRoot = join(
  docsRoot,
  '.vitepress',
  'kotlin-snippets',
  'src',
  'main',
  'kotlin',
  'docs',
  'snippets',
)
const failures = []

const compiledFixtures = {
  'quickstart-action': 'quickstartaction/QuickstartAction.kt',
  'modules-action': 'modules/ModulesAction.kt',
  'workflow-definition': 'workflow/WorkflowDefinition.kt',
  'workflow-usage': 'workflow/WorkflowUsage.kt',
  'compose-adapter': 'composeadapter/ComposeAdapter.kt',
  'compose-route-screen': 'routescreen/RouteScreen.kt',
  'visuals-guide': 'visualsguide/VisualsGuide.kt',
  'visuals-api': 'visualsapi/VisualsApi.kt',
  'payment-contracts': 'payment/PaymentContracts.kt',
}

const expectedKinds = {
  ...Object.fromEntries(Object.keys(compiledFixtures).map((id) => [id, 'compiled'])),
  'authentication-surface': 'reference',
  'compose-surface': 'reference',
  'contracts-action': 'reference',
  'contracts-workflow': 'reference',
  'core-entry': 'reference',
  'core-session': 'reference',
  'installation-dependencies': 'gradle',
}

function read(path) {
  if (!existsSync(path)) {
    failures.push(`Missing file: ${path}`)
    return ''
  }
  return readFileSync(path, 'utf8').replace(/\r\n/g, '\n')
}

function normalizeKotlin(code) {
  return code
    .replace(/"(?:\\.|[^"\\])*"/g, '"<text>"')
    .replace(/\/\/.*$/gm, '')
    .trim()
}

function snippetMap(locale) {
  const snippets = new Map()
  for (const relativePath of walk(join(docsRoot, locale))) {
    const markdown = read(relativePath)
    const classified = [...markdown.matchAll(
      /<!--\s*kotlin-snippet:\s*(compiled|reference|gradle):\s*([a-z0-9-]+)\s*-->\s*\n```kotlin\s*\n([\s\S]*?)^```/gm,
    )]
    const allKotlin = [...markdown.matchAll(/^```kotlin\s*$/gm)]
    if (classified.length !== allKotlin.length) {
      failures.push(`${locale}/${relativePath.slice(join(docsRoot, locale).length + 1)} has an unclassified Kotlin block`)
    }
    for (const [, kind, id, code] of classified) {
      if (snippets.has(id)) failures.push(`${locale} repeats snippet id ${id}`)
      snippets.set(id, { kind, code, file: relativePath })
    }
  }
  return snippets
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? walk(path) : entry.name.endsWith('.md') ? [path] : []
  })
}

const spanish = snippetMap('es')
const english = snippetMap('en')

for (const [id, expectedKind] of Object.entries(expectedKinds)) {
  const es = spanish.get(id)
  const en = english.get(id)
  if (!es) failures.push(`Spanish documentation is missing classified snippet ${id}`)
  if (!en) failures.push(`English documentation is missing classified snippet ${id}`)
  if (!es || !en) continue
  if (es.kind !== expectedKind || en.kind !== expectedKind) {
    failures.push(`${id} must be classified as ${expectedKind}`)
  }
  if (normalizeKotlin(es.code) !== normalizeKotlin(en.code)) {
    failures.push(`${id} differs technically between Spanish and English`)
  }
}

for (const [locale, snippets] of [['es', spanish], ['en', english]]) {
  for (const id of snippets.keys()) {
    if (!(id in expectedKinds)) failures.push(`${locale} has an unknown Kotlin snippet id ${id}`)
  }
}

for (const [id, relativeFixture] of Object.entries(compiledFixtures)) {
  const documentation = english.get(id)
  if (!documentation) continue
  const fixture = read(join(fixtureRoot, relativeFixture))
    .replace(/^package [^\n]+\n+/, '')
  if (normalizeKotlin(documentation.code) !== normalizeKotlin(fixture)) {
    failures.push(`${id} does not match its compilable fixture ${relativeFixture}`)
  }
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log('Kotlin snippets synchronized: 9 compiled, 6 API references, 1 Gradle declaration.')
