/*
 * @Author: 黄旭
 * @Date: 2021-07-15 10:04:34
 * @LastEditors: 黄旭
 * @LastEditTime: 2021-07-21 14:01:06
 * @Description: 
 */
$(document).ready(function () {

    var BASE_URL = 'http://appwebfront.xbongbong.com'
    var REQUEST_URL = 'http://ptnewadmin.xbongbong.com.cn'
  
    let oldPhone = ''
  
    // 监听滑动
    window.onscroll = function () {
      if (document.documentElement.scrollTop > 400) {
        $('.floating-window').removeClass('display-none')
      }
      else {
        $('.floating-window').addClass('display-none')
      }
      // 浏览器可见区域高度为：
      var viewHeight = document.documentElement.clientHeight
      // 窗口滚动条高度
      var scrollHeight = document.documentElement.scrollTop
      // 文档内容实际高度：
      var contentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
      // 滚动条距离底部的高度
      scrolllBtmHeight = contentHeight - scrollHeight - viewHeight
      var floatingWindowHeight = $('.floating-window__box')[0].offsetHeight
      // 底部的高度
      var countHeight = floatingWindowHeight
      if (scrolllBtmHeight <= countHeight) {
        $('.floating-window__box').removeClass('fixed')
      } else {
        $('.floating-window__box').addClass('fixed')
      }
    }
    
    // 姓名失去焦点时
    $('#personalName').blur(function () {
      emptyFormat('#personalName', '.personal-name__format', '姓名')
    })
    // 企业名称失去焦点时
    $('#enterpriseName').blur(function () {
      emptyFormat('#enterpriseName', '.enterprise-name__format', '企业名称')
    })
    // 手机号码失去焦点时
    $('#phoneCode').blur(function () {
      validatePhone('#phoneCode', '.phone-code__format', '手机号码')
    })
  // 验证码失去焦点时
  $('#noteCode').blur(function () {
    emptyFormat('#noteCode', '.note-code__format', '验证码')
  })
  
  
    // 获取验证码
    $('.get-code').click(function () {
      var mobile = $('#phoneCode').val()
      if (['', null, undefined].includes(mobile)) {
        layer.msg('请先填写手机号！')
        $('#phoneCode').focus()
        $('#noteCode').val('')
        $('#phoneCode').attr('flag', 'false')
      } else {
        $.ajax({
          type: "post",
          contentType: 'application/json',
          url: `${BASE_URL}/pro/v1/xbb/sms/send/code`,
          data: JSON.stringify({
            mobile
          }),
          dataType: "json",
          success: function (data) {
            if (data.success) {
              layer.msg('验证码已发送到你的手机！')
              $('.get-code').addClass('display-none')
              $('.count-down').removeClass('display-none')
              let count = 60
              let timer = setInterval(function () {
                count--
                $('.count-down i').text(count)
                if (count === 0) {
                  clearInterval(timer)
                  $('.count-down').addClass('display-none')
                  $('.get-code').removeClass('display-none')
                }
              }, 1000)
            } else {
              layer.msg(data.msg)
            }
          }
        })
      }
    })
  
    // 点击立即获取
    $('.form-btn').click(function () {
      emptyFormat('#personalName', '.personal-name__format', '姓名')
      validatePhone('#phoneCode', '.phone-code__format', '手机号码')
      emptyFormat('#enterpriseName', '.enterprise-name__format', '企业名称')
      emptyFormat('#noteCode', '.note-code__format', '验证码')
      var text_2 = $('#personalName').val() // 姓名
      var subForm_1 =  $('#phoneCode').val() // 电话
      var code = $('#noteCode').val() // 验证码
      var text_1 =  $('#enterpriseName').val() // 公司名称
      var text_4 = '官网'
      var corpid = 'dinge3fa697f86d461d2'
      var formId = 2795678
      var dataList = {
        text_2, // 姓名
        subForm_1, // 电话
        code, // 验证码
        text_1, // 公司名称
        text_4
      }
      if (text_2 && subForm_1 && code && text_1) {
        $.ajax({
          type: "post",
          contentType: 'application/json',
          url: `${REQUEST_URL}/pro/v1/api/paas/clue/add`,
          data: JSON.stringify({
            dataList,
            corpid,
            formId
          }),
          dataType: "json",
          success: function (data) {
            if (data.success) {
              layer.msg('已发送申请！')
            } else {
              layer.msg(data.msg)
            }
          }
        })
      } else {
        layer.msg('请检查信息是否完整')
      }
    })
  
    // 点击浮窗的立即获取
    $('.floating-window__btn').click(function () {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    })
    // 点击页面按钮的申请
    $('.operation-btn').click(function () {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;   
    })
  
    function emptyFormat(idName, className, text) {
      var value = $(idName).val().trim()
      if (['', null, undefined].includes(value)) {
        $(className).text(text + '不能为空')
        $(idName).attr('flag', 'false')
      } else {
        $(idName).attr('flag', 'true')
        $(className).text('')
      }
    }
    function validatePhone(idName, className, text) {
      var val = $(idName).val().trim()
      var reg = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (['', null, undefined].includes(val)) {
        $(className).text(text + '不能为空')
        $(idName).attr('flag', 'false')
      } else if (!reg.test(val)) {
        $(className).text(text + '格式错误')
        $(idName).attr('flag', 'false')
      } else {
        oldPhone = val
        $(className).text('')
        $(idName).attr('flag', 'true')
      }
    }
  })