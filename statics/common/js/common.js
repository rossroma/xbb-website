/*
<a onclick="SetHome(window.location)" href="javascript:void(0)">设为首页</a>
<a onclick="AddFavorite(window.location,document.title)" href="javascript:void(0)">加入收藏</a>
*/
//加入收藏
function AddFavorite(sURL, sTitle)
{
  sURL = encodeURI(sURL); 
  try
	{   
		window.external.addFavorite(sURL, sTitle);   
	}
  catch(e)
	{   
	try
	{   
		window.sidebar.addPanel(sTitle, sURL, "");   
	}catch (e) 
	{   
		alert("加入收藏失败，请使用Ctrl+D进行添加,或手动在浏览器里进行设置.");
	}   
  }
}
//设为首页
  function SetHome(url)
  {
	if (document.all)
	{
		document.body.style.behavior='url(#default#homepage)';
		document.body.setHomePage(url); 
	}
	else
	{ 
		alert("您好,您的浏览器不支持自动设置页面为首页功能,请您手动在浏览器里设置该页面为首页!"); 
	}
  }
  
//清除信息  
function clearDefault(el)
{
  if (el.defaultValue==el.value) el.value = "";}
  function resetDefault(el){
  if (el.value == '') el.value=el.defaultValue;
}
  
 //分页
 $(document).ready(function(){ 
		  $('#page_break .num li:first').addClass('on'); 
	  $('#page_break .num li').click(function(){ //隐藏所有页内容 
	  $("#page_break div[id^='page_']").hide(); 
	  //显示当前页内容。 
	  if ($(this).hasClass('on')) { 
	  $('#page_break #page_' + $(this).text()).show(); 
	  } else { 
	  $('#page_break .num li').removeClass('on'); 
	  $(this).addClass('on'); 
	  $('#page_break #page_' + $(this).text()).fadeIn('normal'); 
	  } 
	  }); 
});   

//留言验证
function checkDataSearch(theForm)
{
	if (Trim(theForm.kwd.value).length == 0||theForm.kwd.value=="搜索……")
	{
		alert("请输入搜索的关键词!");
		theForm.kwd.focus();
		return false;
	}
	return true;
}

/*
 *评论会员发布信息
 * */
function ck_comment(id)
{
    //var content=document.getElementById("comment_hf_"+t_id).value;
    jQuery.getJSON('/news/vote_add',{'id':id},function(exs)
        {
            //alert(exs.shuliang);
            if(exs.status ==1)
            {
                //不存在
                //alert("回复成功!");
                $("#vot_top").html(exs.shuliang);
            }
            else
            {
                //失败
                //alert("回复失败!");
            }
        }
    );
}


function Trim(str)
{
  return str.replace(/(^\s*)|(\s*$)/g,"");
}

/*
* 设置字体大小
* */
function setFontSize(objID,size){
    document.getElementById(objID).style.fontSize=size+'px';
}
//<a onclick="setFontSize('content',20)">大</a>