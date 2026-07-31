import prettier from 'prettier/standalone'
import htmlPlugin from 'prettier/plugins/html'

const input = '<!doctype html><html><body><h1>{{title}}</h1>{{#if items}}<ul>{{#each items}}<li>{{this.title}}</li>{{/each}}</ul>{{/if}}</body></html>'

const tokens = []
const tokenPrefix = '__HB_EXPR_'
const tokenSuffix = '__'

const replaced = input.replace(/{{{[\s\S]*?}}}|{{[\s\S]*?}}/g, (match) => {
  const index = tokens.length
  tokens.push(match)
  return `${tokenPrefix}${String(index).padStart(4, '0')}${tokenSuffix}`
})

const pretty = await prettier.format(replaced, {
  parser: 'html',
  plugins: [htmlPlugin],
  printWidth: 80,
  tabWidth: 2,
  htmlWhitespaceSensitivity: 'css',
  bracketSameLine: false,
  singleAttributePerLine: true,
})

const formatted = pretty.replace(/__HB_EXPR_\d{4}__/g, (token) => {
  const index = Number(token.slice(tokenPrefix.length, token.length - tokenSuffix.length))
  return tokens[index] ?? token
})

if (!formatted.includes('{{title}}')) {
  throw new Error('format output missing mustache token')
}

if (!formatted.includes('\n')) {
  throw new Error('format output should be expanded with newlines')
}

console.log('--- formatted ---')
console.log(formatted)
console.log('✅ template format ok')
