/* $Id: listtable.js 14980 2008-10-22 05:01:19Z testyang $ */
var listTable = new Object;
listTable.query = "query";
/**
 * 创建一个可编辑区
 */
listTable.edit = function(obj, act, id)
{

  var tag = obj.firstChild.tagName;

  if (typeof(tag) != "undefined" && tag.toLowerCase() == "input")
  {
    return;
  }

  /* 保存原始的内容 */
  var org = obj.innerHTML;
  var val = Browser.isIE ? obj.innerText : obj.textContent;

  /* 创建一个输入框 */
  var txt = document.createElement("INPUT");
  txt.value = (val == 'N/A') ? '' : val;
  txt.style.width = (obj.offsetWidth + 12) + "px" ;
  /* 隐藏对象中的内容，并将输入框加入到对象中 */
  obj.innerHTML = "";
  obj.appendChild(txt);
  txt.focus();

  /* 编辑区输入事件处理函数 */
  txt.onkeypress = function(e)
  {
    var evt = Utils.fixEvent(e);
    var obj = Utils.srcElement(e);

    if (evt.keyCode == 13)
    {
      obj.blur();

      return false;
    }

    if (evt.keyCode == 27)
    {
      obj.parentNode.innerHTML = org;
    }
  }

  /* 编辑区失去焦点的处理函数 */
  txt.onblur = function(e)
  {
    if (Utils.trim(txt.value).length > 0)
    {
      //res = Ajax.call(listTable.url, "act="+act+"&val=" + encodeURIComponent(Utils.trim(txt.value)) + "&id=" +id, null, "POST", "JSON", false);
        $.post("/admina/"+act,{'val':encodeURIComponent(Utils.trim(txt.value)),'id':id},function(data)
        {
            if(data == 'false')
            {
                alert('参数错误');
            } else {
                obj.innerHTML = data;
            }
        });
    }
    else
    {
      obj.innerHTML = org;
    }
  }
    /**
     * 切换状态
     */

}
listTable.typeedit = function(obj, act, id)
{
  var tag = obj.firstChild.tagName;

  if (typeof(tag) != "undefined" && tag.toLowerCase() == "input")
  {
    return;
  }

  /* 保存原始的内容 */
  var org = obj.innerHTML;
  var val = Browser.isIE ? obj.innerText : obj.textContent;

  /* 创建一个输入框 */
  var txt = document.createElement("INPUT");
  txt.value = (val == 'N/A') ? '' : val;
  txt.style.width = (obj.offsetWidth + 12) + "px" ;
  /* 隐藏对象中的内容，并将输入框加入到对象中 */
  obj.innerHTML = "";
  obj.appendChild(txt);
  txt.focus();

  /* 编辑区输入事件处理函数 */
  txt.onkeypress = function(e)
  {
    var evt = Utils.fixEvent(e);
    var obj = Utils.srcElement(e);

    if (evt.keyCode == 13)
    {
      obj.blur();

      return false;
    }

    if (evt.keyCode == 27)
    {
      obj.parentNode.innerHTML = org;
    }
  }

  /* 编辑区失去焦点的处理函数 */
  txt.onblur = function(e)
  {
    if (Utils.trim(txt.value).length > 0)
    {
      //res = Ajax.call(listTable.url, "act="+act+"&val=" + encodeURIComponent(Utils.trim(txt.value)) + "&id=" +id, null, "POST", "JSON", false);
        $.post('/admina/news/newstype_edit',{'val':encodeURIComponent(Utils.trim(txt.value)),'id':id},function(data)
        {
            if(data == 'false')
            {
                alert('参数错误');
            } else {
                obj.innerHTML = data;
            }
        });
    }
    else
    {
      obj.innerHTML = org;
    }
  }
    /**
     * 切换状态
     */

}
listTable.typetitleedit = function(obj, act, id)
{
  var tag = obj.firstChild.tagName;

  if (typeof(tag) != "undefined" && tag.toLowerCase() == "input")
  {
    return;
  }

  /* 保存原始的内容 */
  var org = obj.innerHTML;
  var val = Browser.isIE ? obj.innerText : obj.textContent;

  /* 创建一个输入框 */
  var txt = document.createElement("INPUT");
  txt.value = (val == 'N/A') ? '' : val;
  txt.style.width = (obj.offsetWidth + 12) + "px" ;
  /* 隐藏对象中的内容，并将输入框加入到对象中 */
  obj.innerHTML = "";
  obj.appendChild(txt);
  txt.focus();

  /* 编辑区输入事件处理函数 */
  txt.onkeypress = function(e)
  {
    var evt = Utils.fixEvent(e);
    var obj = Utils.srcElement(e);

    if (evt.keyCode == 13)
    {
      obj.blur();

      return false;
    }

    if (evt.keyCode == 27)
    {
      obj.parentNode.innerHTML = org;
    }
  }

  /* 编辑区失去焦点的处理函数 */
  txt.onblur = function(e)
  {
    if (Utils.trim(txt.value).length > 0)
    {
      //res = Ajax.call(listTable.url, "act="+act+"&val=" + encodeURIComponent(Utils.trim(txt.value)) + "&id=" +id, null, "POST", "JSON", false);
        $.post('/admina/news/newstypetitle_edit',{'val':encodeURIComponent(Utils.trim(txt.value)),'id':id},function(data)
        {
            if(data == 'false')
            {
                alert('参数错误');
            } else {
                obj.innerHTML = data;
            }
        });
    }
    else
    {
      obj.innerHTML = org;
    }
  }
    /**
     * 切换状态
     */

}
listTable.toggle = function(objs,act, id)
{
    if(id)
    {
        // $.post('/admina/'+obj+'/'+act,{'id':id},function(data)
        $.post(act,{'id':id},function(data)
        {
            if(data == 'false')
            {
                alert('参数错误');
            } else {
                objs.src = (data == 1) ? '/statics/admina/images/1.gif' : '/statics/admina/images/0.gif';
            }
        });
    }
}

