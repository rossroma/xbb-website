// 前端功能验证脚本
import axios from 'axios';

const FRONTEND_URL = 'http://localhost:5174';
const API_URL = 'http://localhost:3000';

async function checkFrontendPages() {
  console.log('🔍 检查前端页面可访问性...\n');

  const pages = [
    { name: 'Admin入口页面', url: `${FRONTEND_URL}/admin.html` },
    { name: 'Vite开发服务器', url: `${FRONTEND_URL}/` }
  ];

  for (const page of pages) {
    try {
      const response = await axios.get(page.url, { timeout: 5000 });
      if (response.status === 200) {
        console.log(`✅ ${page.name} - 可访问`);
      } else {
        console.log(`❌ ${page.name} - 状态码: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${page.name} - 错误: ${error.message}`);
    }
  }
}

async function checkAPIEndpoints() {
  console.log('\n🔍 检查API端点可访问性...\n');

  // 先登录获取token
  let token = '';
  try {
    const loginResponse = await axios.post(`${API_URL}/v1/admin/auth/login`, {
      username: 'admin',
      password: '123456'
    });
    token = loginResponse.data.data.access_token;
    console.log('✅ 登录成功，获取到token');
  } catch (error) {
    console.log('❌ 登录失败:', error.message);
    return;
  }

  const endpoints = [
    { name: '文章列表', url: `${API_URL}/v1/admin/articles` },
    { name: '文章详情', url: `${API_URL}/v1/admin/articles/1` },
    { name: '栏目列表', url: `${API_URL}/v1/admin/categories` }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(endpoint.url, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });

      if (response.data.code === 200) {
        console.log(`✅ ${endpoint.name} - 数据正常`);
      } else {
        console.log(`❌ ${endpoint.name} - 返回码: ${response.data.code}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name} - 错误: ${error.message}`);
    }
  }
}

async function checkDataStructure() {
  console.log('\n🔍 检查数据结构兼容性...\n');

  try {
    // 登录
    const loginResponse = await axios.post(`${API_URL}/v1/admin/auth/login`, {
      username: 'admin',
      password: '123456'
    });
    const token = loginResponse.data.data.access_token;

    // 检查文章数据结构
    const articlesResponse = await axios.get(`${API_URL}/v1/admin/articles`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const articles = articlesResponse.data.data.items;
    if (articles && articles.length > 0) {
      const article = articles[0];
      const requiredFields = ['id', 'title', 'descs', 'status', 'hit', 'addtime'];
      const missingFields = requiredFields.filter(field => !(field in article));

      if (missingFields.length === 0) {
        console.log('✅ 文章数据结构 - 包含所需字段');
      } else {
        console.log(`❌ 文章数据结构 - 缺少字段: ${missingFields.join(', ')}`);
      }
    }

    // 检查栏目数据结构
    const categoriesResponse = await axios.get(`${API_URL}/v1/admin/categories`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const categories = categoriesResponse.data.data.items;
    if (categories && categories.length > 0) {
      const category = categories[0];
      const requiredFields = ['id', 'title', 'english', 'descs', 'ord', 'status', 'is_nav', 'addtime'];
      const missingFields = requiredFields.filter(field => !(field in category));

      if (missingFields.length === 0) {
        console.log('✅ 栏目数据结构 - 包含所需字段');
      } else {
        console.log(`❌ 栏目数据结构 - 缺少字段: ${missingFields.join(', ')}`);
      }
    }

  } catch (error) {
    console.log('❌ 数据结构检查失败:', error.message);
  }
}

async function runVerification() {
  console.log('🚀 开始前端功能验证...\n');

  await checkFrontendPages();
  await checkAPIEndpoints();
  await checkDataStructure();

  console.log('\n✨ 验证完成！');
  console.log('\n📋 手动测试建议:');
  console.log('1. 访问 http://localhost:5174/admin.html');
  console.log('2. 使用 admin/123456 登录');
  console.log('3. 测试文章列表、详情页面');
  console.log('4. 测试栏目管理页面');
  console.log('5. 测试退出登录功能');
}

runVerification().catch(console.error);
