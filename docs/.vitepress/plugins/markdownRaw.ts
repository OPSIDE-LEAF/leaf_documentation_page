import { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'
import { LEAF_VERSION } from '../leaf-version'

/**
 * Plugin de Vite que expone el contenido raw de los archivos .md
 * como un módulo virtual accesible desde los componentes Vue.
 */
export function markdownRawPlugin(docsDir: string): Plugin {
  const virtualModuleId = 'virtual:markdown-raw'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'vitepress-markdown-raw',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        // Generamos un mapa de todas las páginas .md y su contenido
        const mdFiles = getAllMdFiles(docsDir)
        const entries: Record<string, string> = {}

        for (const file of mdFiles) {
          const relativePath = path.relative(docsDir, file).replace(/\\/g, '/')
          // La clave será la ruta relativa sin extensión .md
          const key = relativePath.replace(/\.md$/, '')
          entries[key] = fs
            .readFileSync(file, 'utf-8')
            .replaceAll('%LEAF_VERSION%', LEAF_VERSION)
        }

        return `export default ${JSON.stringify(entries)}`
      }
    },
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.md') && file.startsWith(docsDir)) {
        const mod = server.moduleGraph.getModuleById(resolvedVirtualModuleId)
        if (mod) {
          server.moduleGraph.invalidateModule(mod)
        }
      }
    },
  }
}

function getAllMdFiles(dir: string): string[] {
  const results: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      // Ignorar .vitepress, node_modules, public
      if (['.vitepress', 'node_modules', 'public'].includes(entry.name)) continue
      results.push(...getAllMdFiles(fullPath))
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath)
    }
  }

  return results
}
