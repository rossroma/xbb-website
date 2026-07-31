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
  Authorization: `Bearer ${token}`,
}

async function api(url) {
  const res = await fetch(`${API_BASE}${url}`, { headers })
  const json = await res.json()
  if (json.code !== 200) throw new Error(`${url} -> ${JSON.stringify(json)}`)
  return json.data
}

async function run() {
  const list = await api('/v1/admin/templates?page=1&limit=10')
  const template = (list.items || []).find((i) => i.template_name)
  if (!template?.id) throw new Error('no template found')

  const globalData = await api(`/v1/admin/templates/${template.id}/sample-data?mode=global`)
  if (globalData.data.category !== null) throw new Error('global mode should not include category')
  if (Array.isArray(globalData.data.items) && globalData.data.items.length) throw new Error('global mode should not include items')

  const listData = await api(`/v1/admin/templates/${template.id}/sample-data?mode=list`)
  if (!Array.isArray(listData.data.items)) throw new Error('list mode should include items array')
  if (!listData.data.pagination || typeof listData.data.pagination !== 'object') throw new Error('list mode should include pagination')

  const detailData = await api(`/v1/admin/templates/${template.id}/sample-data?mode=detail`)
  if (detailData.data.article === null) {
    console.log('ℹ️ detail mode returned null article (no articles in db), acceptable')
  }

  const pageData = await api(`/v1/admin/templates/${template.id}/sample-data?mode=page`)
  if (Array.isArray(pageData.data.items) && pageData.data.items.length) throw new Error('page mode should not include items')

  console.log('✅ sample-data mode test ok')
}

run().catch((err) => {
  console.error('❌ sample-data mode test failed:', err.message)
  process.exit(1)
})
