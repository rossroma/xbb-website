#!/usr/bin/env node

const jwt = require('jsonwebtoken')

const API_BASE = 'http://localhost:3000'
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

const token = jwt.sign(
  { sub: 1, username: 'admin', type: 1, group_id: 1 },
  JWT_SECRET,
  { expiresIn: '2h' },
)

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
}

async function api(method, url, body) {
  const res = await fetch(`${API_BASE}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const json = await res.json()
  if (json.code !== 200) {
    throw new Error(`${url} -> ${JSON.stringify(json)}`)
  }
  return json.data
}

async function run() {
  const list = await api('GET', '/v1/admin/templates?page=1&limit=5')
  const first = (list.items || [])[0]
  if (!first?.id) {
    throw new Error('no templates found')
  }

  const sample = await api('GET', `/v1/admin/templates/${first.id}/sample-data`)
  if (!sample?.data || typeof sample.data !== 'object') {
    throw new Error('sample-data should return an object')
  }

  const requiredKeys = ['title', 'description', 'site_name', 'site', 'items', 'pagination']
  const missing = requiredKeys.filter((k) => !(k in sample.data))
  if (missing.length) {
    throw new Error(`sample-data missing keys: ${missing.join(', ')}`)
  }

  const previewTpl = '<!doctype html><html><body><h1>{{site.title}}</h1><h2>{{title}}</h2>{{#if category}}<div>{{category.title}}</div>{{/if}}<ul>{{#each items}}<li>{{this.title}}</li>{{/each}}</ul></body></html>'
  const preview = await api('POST', `/v1/admin/templates/${first.id}/preview`, {
    content: previewTpl,
    data: sample.data,
  })

  if (!preview?.content || !String(preview.content).includes('<h2>')) {
    throw new Error('preview did not render expected html')
  }

  console.log('✅ sample-data and preview ok')
}

run().catch((err) => {
  console.error('❌ template sample-data test failed:', err.message)
  process.exit(1)
})
