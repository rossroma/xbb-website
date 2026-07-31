#!/usr/bin/env node

const jwt = require('jsonwebtoken')
const Handlebars = require('handlebars')

const API_BASE = 'http://localhost:3000'
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

const token = jwt.sign(
  { sub: 1, username: 'admin', type: 1, group_id: 1 },
  JWT_SECRET,
  { expiresIn: '2h' },
)

const adminHeaders = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
}

async function requestJson(method, url, body, headers) {
  const res = await fetch(`${API_BASE}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json()
  return { status: res.status, json }
}

async function admin(method, url, body) {
  const { json } = await requestJson(method, url, body, adminHeaders)
  if (json.code !== 200) {
    throw new Error(`${url} -> ${JSON.stringify(json)}`)
  }
  return json.data
}

async function client(method, url) {
  const { json } = await requestJson(method, url, undefined, { 'Content-Type': 'application/json' })
  if (json.code !== 200) {
    throw new Error(`${url} -> ${JSON.stringify(json)}`)
  }
  return json.data
}

async function run() {
  const ts = Date.now()
  const english = `tpl-test-${ts}`

  const category = await admin('POST', '/v1/admin/categories', {
    title: `模板测试栏目${ts}`,
    english,
    pid: 0,
    type: 'list',
    pagesize: 5,
    template_list: 'news_list_classic',
    template_view: 'news_detail_clean',
    status: 1,
    is_nav: 1,
    is_lower: 0,
    is_delete: 1,
    ord: 10,
    descs: '用于模板渲染自动化测试',
  })

  const article = await admin('POST', '/v1/admin/articles', {
    title: `模板测试文章${ts}`,
    bid: category.id,
    author: 'tester',
    descs: '文章摘要',
    content: '<p>文章正文</p>',
    status: 1,
    ord: 10,
  })

  const listPayload = await client('GET', `/v1/client/pages/render?english=${encodeURIComponent(english)}&page=1`)
  if (!listPayload.templateContent || typeof listPayload.templateContent !== 'string') {
    throw new Error('list render missing templateContent')
  }
  if (!listPayload.data || typeof listPayload.data !== 'object') {
    throw new Error('list render missing data')
  }

  const listHtml = Handlebars.compile(listPayload.templateContent)(listPayload.data)
  if (!String(listHtml).includes('模板测试')) {
    throw new Error('list render output does not include expected content')
  }

  const detailPayload = await client(
    'GET',
    `/v1/client/pages/render?english=${encodeURIComponent(english)}&id=${article.id}`,
  )
  const detailHtml = Handlebars.compile(detailPayload.templateContent)(detailPayload.data)
  if (!String(detailHtml).includes(article.title)) {
    throw new Error('detail render output does not include article title')
  }

  await admin('DELETE', `/v1/admin/articles/${article.id}`)
  await admin('DELETE', `/v1/admin/categories/${category.id}`)

  console.log('✅ client pages render ok')
}

run().catch((err) => {
  console.error('❌ client pages render test failed:', err.message)
  process.exit(1)
})
