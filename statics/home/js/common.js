if(typeof(Worker) == "undefined"){

$("body").addClass("ieBody");

}else{

animateImg();

if($(window).width() < 992){

	//$("video:not('#mPPmv')").attr("src","");

	$("body").wrapInner("<div class='wrapper'></div>");

}

function animateImg(){

   var wow = new WOW({

		mobile: false,

		live: true

  });

  wow.init();

  AOS.init({

	disable: 'mobile',

	easing: 'ease-out-back',

	duration: 1000

  });

}	

}





//导航

function webHeader(){

	if($(window).width() < 1335){

        $(".mMmenuLay dl").each(function(i) {

			var _this = $(this);

            if(_this.find("dd").size()>0){

				_this.find(".mToggle").show();

				}

        });

		$(".mToggle").click(function(e){

		if($(this).parents("dl").hasClass("on")){

			$(this).parents("dl").removeClass("on");

			$(this).removeClass("mToggle2");

			}else{

				$(".mMmenuLay dl").removeClass("on");

				$(".mToggle").removeClass("mToggle2");

				$(this).addClass("mToggle2");

				$(this).parents("dl").addClass("on");

				}

		});

		$(".mOpenBtn").click(function(e){

			$(".mMenuLayBg,.mMmenuLay,.mCloseBtn").addClass("on");

			$("body").css("overflow","hidden");
			
			$(".mHeader").addClass("mHeaderInnerClose");

			});

		$(".mCloseBtn,.mMenuLayBg").click(function(){

			$(".mMenuLayBg,.mMmenuLay,.mCloseBtn").removeClass("on");

			$("body").css("overflow","inherit");

			$(".mHeader").removeClass("mHeaderInnerClose");

			});
			
		$(".mMenu_a2.tryBtn").click(function(){
			$(".mMenuLayBg,.mMmenuLay,.mCloseBtn").removeClass("on");
			$("body").css("overflow","inherit");
			$(".mHeader").removeClass("mHeaderInnerClose");

		});	

	}

}

webHeader();


// $(window).scroll(function(){
//
// 	if($(document).scrollTop()>10){
//
// 		$(".backWpr").addClass("on");
//
// 		//$(".mRmenu").fadeIn(300);
//
// 		}else{
//
// 			$(".backWpr").removeClass("on");
//
// 			//$(".mRmenu").fadeOut(300);
//
// 			}
//
// 	if($(document).scrollTop()>10){
//
// 		$(".header").addClass("headerFixed");
//
// 		$(".topEmpty").addClass("topEmptyFixed");
//
// 		}else{
//
// 		$(".header").removeClass("headerFixed");
//
// 		$(".topEmpty").removeClass("topEmptyFixed");
//
// 	}
//
// });

//$(window).resize(function(){webHeader();});

jQuery(document).ready(function($) {

	

setTimeout(function(){$("body").addClass("bodyIn")},100);





if($(".m2abtc3Swiper").size()>0){

    $('.m2abtc3Swiper').slick({

        autoplay: true, 

        arrows: true,

        dots:false,

        infinite: false,

        speed: 500,

        autoplaySpeed: 2000,

        pauseOnHover: false,

        slidesToShow: 5,

        slidesToScroll: 1,

        //centerMode: true, 

		focusOnSelect: true,

        //centerPadding: '0px',

        responsive: [

          {

            breakpoint: 767,

            settings: {

              slidesToShow: 1,

            }

          }

        ]

    });

}





if($(".m2menuSwiper").size()>0){

    var m2menuSwiper = new Swiper('.m2menuSwiper .swiper-container', {

        nextButton: '.m2menu_next',

        prevButton: '.m2menu_prev',

        slidesPerView: 'auto',

        paginationClickable: true,

        spaceBetween: 30,

    });

	}

	

if($(".hmFocus").size()>0){

	$("#hmNm2").text($('.hmFocus_item').size()); 

	$('.hmFocus').slick({

		autoplay: true, 

		arrows: false,

		dots:true,

		infinite: true,

		speed: 500,

		autoplaySpeed: 6000,

		pauseOnHover: false,

		//fade: true,

	});	

	$('.hmFocus').init(function(slick){

		$('.hmFocus_item.slick-current').addClass('on').siblings().removeClass('on');

		$("#hmNm1").text($('.hmFocus').slick('slickCurrentSlide')+1); 

	})

	$('.hmFocus').on('afterChange',function(slick,currentSlide){

		$('.hmFocus_item.slick-current').addClass('on').siblings().removeClass('on');
		var myVideo1=document.getElementById("hangye_video_pc1");
		var myVideo2=document.getElementById("hangye_video_pc2");
		myVideo1.pause();
		myVideo2.pause();
		$("#hmNm1").text($('.hmFocus').slick('slickCurrentSlide')+1); 

	})

    $('.hmFsinfo .prev').click(function(){

      $('.hmFocus').slick('slickPrev')

    })

    $('.hmFsinfo .next').click(function(){

      $('.hmFocus').slick('slickNext');

    });

}

//if($(".m2proBomBox").size()){autoH(".m2proBomBox");}





$('input, textarea').placeholder();





$(".backTop").click(function(){$("body,html").animate({"scrollTop":0},500);});





//搜素

$(".topSerBtn").click(function(){

	$(".serBg,.serLayer").fadeIn(500);

	$(".serClose").removeClass("on");

	});

$(".serClose").click(function(){

	$(".serBg,.serLayer").fadeOut(500);

	$(".serClose").addClass("on");

	});

	

//分页样式

/*$(".page li:first a").text("<").css("font-size","18px");

$(".page li:last a").text(">").css("font-size","18px");*/



if($(".inxSwiper").size()){

    $('.inxSwiper').slick({

        autoplay: true, 

        arrows: true,

        dots:true,

        infinite: true,

        speed: 500,

        autoplaySpeed: 6000,

        pauseOnHover: false,

        fade: true,

    });

    $('.inxSwiper').init(function(slick){

        $('.inxSwiper .slick-current').addClass('on').siblings().removeClass('on')

    })

    $('.inxSwiper').on('afterChange',function(slick,currentSlide){

        $('.inxSwiper .slick-current').addClass('on').siblings().removeClass('on');

    })

}





if($(".m2cwPs").size()){

    $('.m2cwPs').slick({

        autoplay: true, 

        arrows: true,

        dots:false,

        infinite: true,

        speed: 500,

        autoplaySpeed: 6000,

        pauseOnHover: false,

    });

}


if($(".m2abtc2Cbox").size()>0){
	$('.m2abtc2Cbox').waypoint(function(direction){if(direction==='down'){
			setTimeout(function(){$(".m2abtc2Cbox").addClass("on")},100);
		}else{
			
		}},{offset:"80%" }
	);
}

if($(".m2proBomBtn .m2pub_btn").size()>0){
	$(".m2proBomBtn .m2pub_btn").attr("href","javascript:;");
	$(".m2proBomBtn .m2pub_btn").text("展开更多模块");
	if($(".m2proc2ul li").size()<6){
		$(".m2proBomBtn .m2pub_btn").hide();
		}else{
			$(".m2proc2ul li:gt(4)").hide();
			}
	$(".m2proBomBtn .m2pub_btn").click(function(){
			$(".m2proc2ul li").show();
			$(".m2proBomBtn .m2pub_btn").hide();
		});
	}

});





//百度分享

// if($(".bdsharebuttonbox").size()){
//
// window._bd_share_config = { "common": { "bdSign": "off", "bdSize": "24" }, "share": { "bdCustomStyle": "../css/style.css" } }
//
// with (document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5)];
//
// }
//




function picTxtHeight() {

$(".picTxtBox").each(function(i){if($(this).find(".txtBox").height()>$(this).find(".picBox").height()){$(this).height($(this).find(".txtBox").height());}else{$(this).height($(this).find(".picBox").height());}$(this).find(".picBox-wp,.txtBox-wp").css("min-height",$(this).height())})}

if($(document).width()>993){

	picTxtHeight(); setTimeout(function(){picTxtHeight();},300);

}

$(window).resize(function(){

	if($(document).width()>993){

		picTxtHeight();

	}

})



function autoH(className){

	var maxH = 0;

	$(className).each(function() {

    var cutH = $(this).innerHeight();

	if(cutH>maxH){

		maxH = cutH;

		}

    });



    $(className).innerHeight(maxH);

}

function autoW(className){

	var maxW = 0;

	$(className).each(function() {

    var cutW = $(this).innerWidth();

	if(cutW>maxW){

		maxW = cutW;

		}

    });



    $(className).innerWidth(maxW);

}



function addPreZero(num){

	 if(num<10){

	 var t = (num+'').length,

	  s = '';

	 for(var i=0; i<2-t; i++){

	  s += '0';

	 }

	 return s+num;

	 }else{

		 return num;

		 }

}



if ($(".statistic-data__num").size() > 0) {
  const duration = 2.5
  const options = {
    useEasing: true,
    useGrouping: true,
    separator: "",
    decimal: ".",
    prefix: "",
    suffix: "",
  };
  const num1 = new CountUp("num1", 0, $("#num1").text(), 0, duration, options);
  const num2 = new CountUp("num2", 0, $("#num2").text(), 0, duration, options);
  const num3 = new CountUp("num3", 0, $("#num3").text(), 0, duration, options);
  const num4 = new CountUp("num4", 0, $("#num4").text(), 0, duration, options);
  $(".statistic-data__num").waypoint(
    function (direction) {
        setTimeout(function () {
          num1.start();
          num2.start();
          num3.start();
          num4.start();
        }, 100);
    },
    { offset: "80%" }
  );
}

// if($(".m2pub_t").size()>0){
// 	var options = {
// 		useEasing: true,
// 		useGrouping: true,
// 		separator: ',',
// 		decimal: '.',
// 		prefix: '',
// 		suffix: ''
// 	};	
// 	var num5 = new CountUp("num5", 0, $("#num5").text(), 0, 3, options);
// 	var num6 = new CountUp("num6", 0, $("#num6").text(), 0, 3.6, options);
// 	$('.m2pub_t').waypoint(function(direction){if(direction==='down'){
// 			setTimeout(function(){num5.start();num6.start();},100);
// 		}else{
// 			num5.reset();num6.reset();
// 		}},{offset:"80%" }
// 	);
// }

// if($(".m2banTxtCenter h4").size()>0){
// 	var options = {
// 		useEasing: true,
// 		useGrouping: true,
// 		separator: ',',
// 		decimal: '.',
// 		prefix: '',
// 		suffix: ''
// 	};	
// 	var num7 = new CountUp("num7", 0, $("#num7").text(), 0, 3, options);
// 	var num8 = new CountUp("num8", 0, $("#num8").text(), 0, 3.6, options);
// 	$('.m2banTxtCenter').waypoint(function(direction){if(direction==='down'){
// 			setTimeout(function(){num7.start();num8.start();},100);
// 		}else{
// 			num7.reset();num8.reset();
// 		}},{offset:"80%" }
// 	);
// }


//屏蔽页面错误

jQuery(window).error(function(){

  return true;

});

jQuery("img").error(function(){

  $(this).hide();

});



/*2021 JS*/
if($(".m2ppc2Slick").length){
	$('.m2ppc2Slick').slick({
		autoplay: true,
		arrows: true,
		dots:true,
		infinite: true,
		speed: 500,
		autoplaySpeed: 6000,
		pauseOnHover: false,
		responsive: [
			{
				breakpoint: 767,
				settings: {
					arrows:false,
				}
			}
		]
	});
}
if($(".m2ppc3Slick").length){
	$('.m2ppc3Slick').slick({
		slidesToShow: 3,
		autoplay: true,
		arrows: true,
		dots:true,
		infinite: true,
		speed: 500,
		autoplaySpeed: 4000,
		pauseOnHover: false,
		responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 2,
				}
			},
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 1,
					arrows:false,
				}
			}
		]
	});
}

if($(".m2p3c2Swiper1").length){
	$('.m2p3c2Swiper1').slick({
		autoplay: false,
		arrows: true,
		dots:false,
		infinite: false,
		speed: 500,
		autoplaySpeed: 5000,
		pauseOnHover: false,
		slidesToShow: 3,
		rows: 4,
		//slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 2,
				}
			},
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 1,
				}
			}
		]
	});
}
if($(".m2p3c2Swiper2").length){
	$('.m2p3c2Swiper2').slick({
		autoplay: false,
		arrows: true,
		dots:false,
		infinite: false,
		speed: 500,
		autoplaySpeed: 6000,
		pauseOnHover: false,
		slidesToShow: 3,
		rows: 4,
		//slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 2,
				}
			},
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 1,
				}
			}
		]
	});
}


if($(".m2ppLswiper").length){
	$('.m2ppLswiper').slick({
		autoplay: true,
		arrows: false,
		dots:false,
		infinite: true,
		speed: 500,
		autoplaySpeed: 3000,
		pauseOnHover: false,
	});
	$('.m2ppLswiper').on('afterChange',function(slick,currentSlide){
		$('.focus .slick-current').addClass('on').siblings().removeClass('on');
		$('.m2ppc1_ra').removeClass("on");
		$('.m2ppc1_ra').eq($('.m2ppLswiper').slick('slickCurrentSlide')).addClass('on');
	})
	$('.m2ppc1_ra').click(function(){
		$('.m2ppLswiper').slick('slickGoTo',$('.m2ppc1_ra').index(this));
		$('.m2ppc1_ra').removeClass("on");
		$(this).addClass("on");
	});
}



/*2021 END JS*/

//<a onclick="setFontSize('content',20)">大</a>
/**
 * @description localStorage的获取，增加，删除
 * @class Storage
 */
class Storage {
  constructor() {
    this.source = window.localStorage
    this.initRun()
  }

  initRun() {
    const reg = new RegExp('__expires__')
    const data = this.source
    const list = Object.keys(data)
    if (list.length > 0) {
      list.map((key, v) => {
        if (!reg.test(key)) {
          const now = Date.now()
          const expires = data[`${key}__expires__`] || Date.now + 1
          if (now >= expires) {
            this.remove(key)
          }
        }
        return key
      })
    }
  }

  /**
   * @description 获取方法
   * @param {String} key 键
   * @returns value
   * @memberof Storage
   */
  get(key) {
    const source = this.source
    const expired = source[`${key}__expires__`] || Date.now + 1
    const now = Date.now()

    if (now >= expired) {
      this.remove(key)
      return
    }
    let value = source[key]
    if (/^\{.*\}$/.test(value) || /^\[.*\]$/.test(value)) value = JSON.parse(value)
    return value
  }

  /**
   * @description 存储方法
   * @param {String} key 键
   * @param {String} value 值
   * @param {Number} expired 过期时间，单位分钟，非必填
   * @returns value
   * @memberof Storage
   */
  set(key, value, expired) {
    const source = this.source
    if (value instanceof Map) {
      // 如果类型是map则将类型也存起来取出的时候做特殊处理
      source[`${key}__type__`] = 'map'
      value = JSON.stringify(Array.from(value))
    } else if (typeof value === typeof {}) {
      value = JSON.stringify(value)
    }
    source[key] = value
    if (expired) {
      source[`${key}__expires__`] = Date.now() + 1000 * 60 * expired
    }
    return value
  }

  /**
   * @description 删除方法
   * @param {String} key 键
   * @returns value
   * @memberof Storage
   */
  remove(key) {
    const data = this.source
    const value = data[key]
    delete data[key]
    delete data[`${key}__expires__`]
    return value
  }
}

window.LS = new Storage();