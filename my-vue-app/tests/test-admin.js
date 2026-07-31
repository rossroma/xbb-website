// Admin功能自动化测试脚本
import axios from 'axios'

const BASE_URL = 'http://localhost:3000'
let authToken = ''

// 测试结果记录
const testResults = {
  passed: 0,
  failed: 0,
  tests: [],
}

function logTest(name, passed, message = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL'
  console.log(`${status} ${name}${message ? ': ' + message : ''}`)

  testResults.tests.push({ name, passed, message })
  if (passed) {
    testResults.passed++
  } else {
    testResults.failed++
  }
}

async function testLogin() {
  console.log('\n=== 测试登录功能 ===')

  try {
    // 测试正确登录
    const response = await axios.post(`${BASE_URL}/v1/admin/auth/login`, {
      username: 'admin',
      password: '123456',
    })

    if (response.data.code === 200 && response.data.data.access_token) {
      authToken = response.data.data.access_token
      logTest('正确登录', true, '获取到access_token')
    } else {
      logTest('正确登录', false, '未获取到access_token')
    }
  } catch (error) {
    logTest('正确登录', false, error.message)
  }

  try {
    // 测试错误登录
    const _response = await axios.post(`${BASE_URL}/v1/admin/auth/login`, {
      username: 'admin',
      password: 'wrong',
    })
    logTest('错误登录', false, '应该返回错误但成功了')
  } catch (error) {
    if (error.response && error.response.status === 400) {
      logTest('错误登录', true, '正确返回400错误')
    } else {
      logTest('错误登录', false, '错误类型不正确')
    }
  }
}

async function testArticles() {
  console.log('\n=== 测试文章功能 ===')

  if (!authToken) {
    logTest('文章列表', false, '没有认证token')
    return
  }

  try {
    // 测试文章列表
    const response = await axios.get(`${BASE_URL}/v1/admin/articles`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    if (response.data.code === 200 && response.data.data.items) {
      const articles = response.data.data.items
      logTest('文章列表', true, `获取到${articles.length}篇文章`)

      // 测试文章详情
      if (articles.length > 0) {
        const articleId = articles[0].id
        const detailResponse = await axios.get(`${BASE_URL}/v1/admin/articles/${articleId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        })

        if (detailResponse.data.code === 200 && detailResponse.data.data.id === articleId) {
          logTest('文章详情', true, `获取文章${articleId}详情成功`)
        } else {
          logTest('文章详情', false, '文章详情数据不正确')
        }
      }
    } else {
      logTest('文章列表', false, '返回数据格式不正确')
    }
  } catch (error) {
    logTest('文章列表', false, error.message)
  }
}

async function testCategories() {
  console.log('\n=== 测试栏目功能 ===')

  if (!authToken) {
    logTest('栏目列表', false, '没有认证token')
    return
  }

  try {
    const response = await axios.get(`${BASE_URL}/v1/admin/categories`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    if (response.data.code === 200 && response.data.data.items) {
      const categories = response.data.data.items
      logTest('栏目列表', true, `获取到${categories.length}个栏目`)
    } else {
      logTest('栏目列表', false, '返回数据格式不正确')
    }
  } catch (error) {
    logTest('栏目列表', false, error.message)
  }
}

async function testAuth() {
  console.log('\n=== 测试权限验证 ===')

  try {
    // 测试无token访问
    const _response = await axios.get(`${BASE_URL}/v1/admin/articles`)
    logTest('无token访问', false, '应该返回401但成功了')
  } catch (error) {
    if (error.response && error.response.status === 401) {
      logTest('无token访问', true, '正确返回401错误')
    } else {
      logTest('无token访问', false, '错误类型不正确')
    }
  }
}

async function runTests() {
  console.log('🚀 开始Admin功能测试...\n')

  await testLogin()
  await testArticles()
  await testCategories()
  await testAuth()

  console.log('\n=== 测试结果汇总 ===')
  console.log(`总计: ${testResults.passed + testResults.failed} 个测试`)
  console.log(`通过: ${testResults.passed} 个`)
  console.log(`失败: ${testResults.failed} 个`)

  if (testResults.failed > 0) {
    console.log('\n失败的测试:')
    testResults.tests
      .filter((t) => !t.passed)
      .forEach((t) => {
        console.log(`  ❌ ${t.name}: ${t.message}`)
      })
  }

  console.log(`\n测试${testResults.failed === 0 ? '全部通过' : '存在失败'}! 🎉`)
}

// 运行测试
runTests().catch(console.error)
