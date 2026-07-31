#!/usr/bin/env node

const axios = require('axios');

const API_BASE = 'http://localhost:3000';
let authToken = '';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (data.code === 200) {
      return data.data;
    } else {
      throw new Error(data.message || '请求失败');
    }
  },
  (error) => {
    throw new Error(error.response?.data?.message || error.message);
  }
);

async function login() {
  console.log('🔐 测试登录...');
  try {
    const result = await api.post('/v1/admin/auth/login', {
      username: 'admin',
      password: '123456'
    });
    authToken = result.access_token;
    console.log('✅ 登录成功');
    return true;
  } catch (error) {
    console.error('❌ 登录失败:', error.message);
    return false;
  }
}

async function testArticleCRUD() {
  console.log('\n📝 测试文章CRUD操作...');

  try {
    // 1. 创建文章
    console.log('1. 创建文章...');
    const createData = {
      title: '测试文章标题',
      author: '测试作者',
      descs: '这是一个测试文章的描述',
      content: '这是测试文章的内容，用于验证CRUD功能是否正常工作。',
      status: 1,
      ord: 10,
      bid: 1
    };

    const createdArticle = await api.post('/v1/admin/articles', createData);
    console.log('✅ 文章创建成功，ID:', createdArticle.id);

    // 2. 获取文章详情
    console.log('2. 获取文章详情...');
    const articleDetail = await api.get(`/v1/admin/articles/${createdArticle.id}`);
    console.log('✅ 获取文章详情成功:', articleDetail.title);

    // 3. 更新文章
    console.log('3. 更新文章...');
    const updateData = {
      title: '更新后的文章标题',
      descs: '更新后的文章描述',
      status: 0
    };

    const updatedArticle = await api.patch(`/v1/admin/articles/${createdArticle.id}`, updateData);
    console.log('✅ 文章更新成功:', updatedArticle.title);

    // 4. 获取文章列表
    console.log('4. 获取文章列表...');
    const articleList = await api.get('/v1/admin/articles');
    console.log('✅ 获取文章列表成功，总数:', articleList.total);

    // 5. 删除文章
    console.log('5. 删除文章...');
    await api.delete(`/v1/admin/articles/${createdArticle.id}`);
    console.log('✅ 文章删除成功');

    return true;
  } catch (error) {
    console.error('❌ 文章CRUD测试失败:', error.message);
    return false;
  }
}

async function testCategoryCRUD() {
  console.log('\n📂 测试栏目CRUD操作...');

  try {
    // 1. 创建栏目
    console.log('1. 创建栏目...');
    const createData = {
      title: '测试栏目',
      english: 'test-category-' + Date.now(),
      descs: '这是一个测试栏目',
      ord: 10,
      status: 1,
      is_nav: 1,
      type: 'list'
    };

    const createdCategory = await api.post('/v1/admin/categories', createData);
    console.log('✅ 栏目创建成功，ID:', createdCategory.id);

    // 2. 获取栏目详情
    console.log('2. 获取栏目详情...');
    const categoryDetail = await api.get(`/v1/admin/categories/${createdCategory.id}`);
    console.log('✅ 获取栏目详情成功:', categoryDetail.title);

    // 3. 更新栏目
    console.log('3. 更新栏目...');
    const updateData = {
      title: '更新后的栏目名称',
      descs: '更新后的栏目描述',
      status: 0
    };

    const updatedCategory = await api.put(`/v1/admin/categories/${createdCategory.id}`, updateData);
    console.log('✅ 栏目更新成功:', updatedCategory.title);

    // 4. 获取栏目列表
    console.log('4. 获取栏目列表...');
    const categoryList = await api.get('/v1/admin/categories');
    console.log('✅ 获取栏目列表成功，总数:', categoryList.total);

    // 5. 删除栏目
    console.log('5. 删除栏目...');
    await api.delete(`/v1/admin/categories/${createdCategory.id}`);
    console.log('✅ 栏目删除成功');

    return true;
  } catch (error) {
    console.error('❌ 栏目CRUD测试失败:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 开始测试Admin CRUD功能\n');

  // 登录
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('\n❌ 测试终止：登录失败');
    return;
  }

  // 测试文章CRUD
  const articleSuccess = await testArticleCRUD();

  // 测试栏目CRUD
  const categorySuccess = await testCategoryCRUD();

  // 总结
  console.log('\n📊 测试结果总结:');
  console.log('- 登录功能:', loginSuccess ? '✅ 通过' : '❌ 失败');
  console.log('- 文章CRUD:', articleSuccess ? '✅ 通过' : '❌ 失败');
  console.log('- 栏目CRUD:', categorySuccess ? '✅ 通过' : '❌ 失败');

  if (loginSuccess && articleSuccess && categorySuccess) {
    console.log('\n🎉 所有测试通过！Admin CRUD功能完全正常！');
  } else {
    console.log('\n⚠️  部分测试失败，请检查相关功能');
  }
}

// 运行测试
runTests().catch(console.error);
