#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testFrontendCRUD() {
  console.log('🚀 开始测试前端CRUD功能');

  const browser = await puppeteer.launch({
    headless: false, // 设置为false可以看到浏览器操作
    defaultViewport: { width: 1280, height: 800 }
  });

  try {
    const page = await browser.newPage();

    // 1. 访问登录页面
    console.log('1. 访问登录页面...');
    await page.goto('http://localhost:5173/admin/login');
    await page.waitForSelector('input[type="text"]');

    // 2. 登录
    console.log('2. 执行登录...');
    await page.type('input[type="text"]', 'admin');
    await page.type('input[type="password"]', '123456');
    await page.click('button[type="submit"]');

    // 等待跳转到文章列表页面
    await page.waitForNavigation();
    console.log('✅ 登录成功，已跳转到文章列表');

    // 3. 测试文章创建
    console.log('3. 测试文章创建...');
    await page.waitForSelector('.btn-primary');
    await page.click('.btn-primary'); // 点击新增文章按钮

    // 等待模态框出现
    await page.waitForSelector('.modal-content');

    // 填写文章信息
    await page.type('input[placeholder="请输入文章标题"]', '前端测试文章');
    await page.type('input[placeholder="请输入作者"]', '测试作者');
    await page.type('textarea[placeholder="请输入文章描述"]', '这是前端测试创建的文章');
    await page.type('textarea[placeholder="请输入文章内容"]', '这是文章内容，用于测试前端CRUD功能');

    // 提交表单
    await page.click('.btn-save');

    // 等待操作完成
    await page.waitForTimeout(2000);
    console.log('✅ 文章创建测试完成');

    // 4. 测试栏目管理
    console.log('4. 测试栏目管理...');
    await page.click('a[href="/admin/categories"]'); // 点击栏目管理
    await page.waitForSelector('.category-table');

    // 点击新增栏目
    await page.click('.btn-primary');
    await page.waitForSelector('.modal-content');

    // 填写栏目信息
    await page.type('input[placeholder="请输入栏目名称"]', '前端测试栏目');
    await page.type('input[placeholder="请输入英文名称"]', 'frontend-test-' + Date.now());
    await page.type('textarea[placeholder="请输入栏目描述"]', '这是前端测试创建的栏目');

    // 提交表单
    await page.click('.btn-save');

    // 等待操作完成
    await page.waitForTimeout(2000);
    console.log('✅ 栏目创建测试完成');

    console.log('🎉 前端CRUD功能测试完成！');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  } finally {
    await browser.close();
  }
}

// 检查是否安装了puppeteer
try {
  require('puppeteer');
  testFrontendCRUD().catch(console.error);
} catch {
  console.log('⚠️  需要安装puppeteer来运行前端测试');
  console.log('请运行: npm install puppeteer');
  console.log('或者手动在浏览器中访问: http://localhost:5173/admin/login');
  console.log('使用用户名: admin, 密码: 123456 进行测试');
}
