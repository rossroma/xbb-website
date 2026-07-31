/*
 * @Author: luoteen
 * @Date: 2021-06-29 09:23:07
 * @LastEditors: luoteen
 * @LastEditTime: 2021-07-05 10:28:13
 * @Description: 百度落地页
 */
$(document).ready(function () {

  const BASE_URL = 'http://appwebfront.xbongbong.com'

  let oldPhone = ''

  // 监听滑动
  window.onscroll = () => {
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
    var footerHeight = $('.footer')[0].offsetHeight
    var footerInfoHeight = $('.footerInfo')[0].offsetHeight
    // 底部的高度
    var countHeight = floatingWindowHeight + footerHeight + footerInfoHeight
    if (scrolllBtmHeight <= countHeight) {
      $('.floating-window__box').removeClass('fixed')
    } else {
      $('.floating-window__box').addClass('fixed')
    }
  }

  const noteCodeBlur = () => {
    const mobile = $('#phoneCode').val()
    const code = $('#noteCode').val()
    if (['', null, undefined].includes(mobile)) {
      layer.msg('请先填写手机号！')
      $('#phoneCode').focus()
      $('#noteCode').val('')
      $('#phoneCode').attr('flag', 'false')
    } else if (['', null, undefined].includes(code)) {
      $('.note-code__format').text('验证码不能为空')
      $('#noteCode').attr('flag', 'false')
    } else if (code.length !== 4) {
      $('.note-code__format').text('验证码错误')
      $('#noteCode').attr('flag', 'false')
    } else {
      $.ajax({
        type: "post",
        contentType: 'application/json',
        url: `${BASE_URL}/pro/v1/xbb/sms/verify/code`,
        data: JSON.stringify({
          mobile,
          code
        }),
        dataType: "json",
        success: function (data) {
          if (data.success) {
            $('.note-code__format').text('')
            $('#noteCode').attr('flag', 'true')
            if ($("input[flag='true']").length === 3) {
              $('#form_message').submit()
            }
          } else {
            layer.msg(data.msg || '验证码错误')
            $('#noteCode').attr('flag', 'false')
          }
        }
      })
    }
  }

  // 企业名称失去焦点时
  $('#enterpriseName').blur(() => {
    emptyFormat('#enterpriseName', '.enterprise-name__format', '企业名称')
  })
  // 手机号码失去焦点时
  $('#phoneCode').blur(() => {
    validatePhone('#phoneCode', '.phone-code__format', '手机号码')
  })



  // 获取验证码
  $('.get-code').click(() => {
    const mobile = $('#phoneCode').val()
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
  $('.form-btn').click(async () => {
    emptyFormat('#enterpriseName', '.enterprise-name__format', '企业名称')
    validatePhone('#phoneCode', '.phone-code__format', '手机号码')
    // 防止用户验证了验证码后 又要换其他号码
    $("#phoneCode").bind("input propertychange", () => {
      if (oldPhone !== $("#phoneCode").val()) {
        $('#noteCode').attr('flag', 'false')
        $('#noteCode').val('')
      }
    })
    // 当用户提交时 企业名称未填 然后验证码又已经验证过了，
    if ($('#noteCode').attr('flag') !== 'true') {
      noteCodeBlur()
    } else if ($("input[flag='true']").length === 3) {
      $('#form_message').submit()
    }
  })

  // 点击浮窗的立即获取
  $('.floating-window__btn').click(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  })

  function emptyFormat(idName, className, text) {
    const val = $(idName).val().trim()
    if (['', null, undefined].includes(val)) {
      $(className).text(text + '不能为空')
      $(idName).attr('flag', 'false')
    } else {
      $(idName).attr('flag', 'true')
      $(className).text('')
    }
  }
  function validatePhone(idName, className, text) {
    const val = $(idName).val().trim()
    const reg = /^1(3|4|5|6|7|8|9)\d{9}$/
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