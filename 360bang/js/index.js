window.onload = function(){
	//取消a的默认行为
	$(function(){
		$("a").on("click", function(e){
			e.preventDefault();
		});
	});
	//轮播图特效
	//引进轮播图插件
	var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: 1,
        paginationClickable: true,
        loop: true,
        speed: 1000,
        autoplay: 3000,
        autoplayDisableOnInteraction:false
    });
    //改变小圆点的出现形式
    
	function bian(){
        $(".swiper-pagination-bullet").css({
    		"height":"12px",
    		"width":"12px",
    		"background":"black"
	   });
    };
    bian();
    $(".swiper-pagination").css({
        "display": "block",
        "width":"100px",
        "position": "absolute",
        "bottom": "20px",
        "left": "1000px"
    });

    //二级菜单
    //鼠标经过的时候二级菜单出来
    $(function(){
    	$(".bannermain").find("li").on("mouseover", function(){
	    	var index = $(".bannermain ul li").index(this);
	    	$(".ercai>div").eq(index).show();
    	}).on("mouseout", function(){
    		$(".ercai>div").hide();
    	});
    	//鼠标经过的时候菜单不消失
	    $(".ercai>div").on("mouseover", function(){
	    	$(this).show();
	    }).on("mouseout", function(){
	    	$(this).hide();
	    });
    });

    //当点击切换城市的时候 城市列表出现
    $(function(){
        $(".topbar-citychange").on("click",function(e){
            e.stopPropagation();
            $(".citylist").css({
                "top":$(this).offset().top + this.offsetHeight,
                "left":$(this).offset().left,
                "z-index":5
            }).show();
        })
    });
    //当点击关闭按钮是 城市列表关闭
    $(function(){
        $(".citylist h3>span").on("click", function(e){
            e.stopPropagation();
            $(".citylist").hide();
        });
    });
    //当点击搜索按钮时 城市列表再次出现
    $(function(){
        $(".selectCity").on("click",function(e){
            e.stopPropagation();
            $(".citylist").css({
                "top":$(this).offset().top + this.offsetHeight,
                "left":$(this).offset().left,
                "z-index":5
            }).show();
             //区县列表关闭
            $(".qu").hide();
            $(".selectxian>span:first").text("全部区县");
        })
    });
    //点击其他地方城市列表消失
    $(function(){
        $("body").on("click", function(){
            $(".citylist").hide();
            $(".qu").hide();
        });
        //阻止冒泡
        $(".citylist").on("click", function(e){
            e.stopPropagation();
        });
        $(".qu").on("click", function(e){
            e.stopPropagation();
        });
    });
    //当点击区县的时候 区县列表出现
    $(function(){
        $(".selectxian").on("click", function(e){
            e.stopPropagation();
            $(".citylist").hide();
            $(".qu").css({"top": $(this).offset().top + this.offsetHeight,
                "left": $(this).offset().left,
                "z-index":5}).show();
        });
        //点击span便签关闭
        $(".qu h3>span").on("click", function(e){
            e.stopPropagation();
            $(".qu").hide();
        });
    });




    //修复城市列表不会随屏幕大小缩放而改变位置的bug
    window.onresize = function(){
        //触发轮播图的小圆点 执行封装好的函数
        bian();
        var $citylist = $(".citylist");
        //如果城市列表在上面而且显示 触发点击事件
        if($citylist.css("display") =="block"&& $citylist.offset().top < 250){
            $(".topbar-citychange").trigger("click"); 
        } else if($citylist.css("display") =="block"&& $citylist.offset().top > 250){
            $(".selectCity").trigger("click");
        }
    }


    //加载城市列表的数据
    $(function(){
        $.ajax({
            url: "data/getcodecity.json",
            success: function(data){
                $("#pdata").load("templates/list.html", function(){
                        //加载热门城市数据
                        $("#hotP").html(baidu.template("cityBHot", {listCity12: data}));
                        //加载ABCD数据
                        $("#myp1").html(baidu.template("cityCode",{listItem:data}))
                        //加载城市数据
                        $("#pdata").html(baidu.template("cityBList", {listCityData: data}));
                        //绑定事件 阻止默认行为
                        $("a").on("click", function(e){
                            e.preventDefault();
                        });
                        //二级联动
                        //当点击城市选择城市的时候 页面被赋值 城市列表消失
                        ercity();
                        //给第一个字母的a标签添加样式
                        $("#myp1 a:first").addClass("cur");
                })
            }
        });
        
    });

    //当点击ABCD的时候切换菜单
    $(function(){
        $("#myp1").on("click","a", function(){
            var index = $(this).index();
            $(this).addClass("cur").siblings().removeClass("cur");
            $("#pdata p").eq(index).show().siblings().hide();
        })
    });
    //地图出现
    $(function(){
        //当点击地图模式的时候出现地图
        $(".map").on("click", function(e){
            e.stopPropagation();
            $(".cupMap").show();
        });
        //点击关闭按钮的时候 关闭地图
        $(".mapH span").on("click", function(e){
            e.stopPropagation();
            $(".cupMap").hide();
        });
        //引进地图
        var map = new AMap.Map("mapContainer", {
                zoom: 10,
                center: [116.397428, 39.90923]
            });
        //设置地图语言
         map.setLang("zh_cn");
         //创建页面空间
         var scale = new AMap.Scale(), //比例尺对象  
            toolBar = new AMap.ToolBar(), //工具栏对象
            overView = new AMap.OverView(); //鹰眼
        //添加控件到地图
        map.addControl(scale);
        map.addControl(toolBar);
        map.addControl(overView);
        //实例化Maker
        var marker = new AMap.Marker({
            map: map,
            icon:"imgs/star.png",
            position:new AMap.LngLat(116.397428, 39.90923),
             offset : new AMap.Pixel(-12,-12)
        });
        //在地图上添加marker
        /*marker.setMap(map);*/
        //添加多个marker
            var markers = [{
                icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b1.png',
                position: [116.205467, 39.907761]
            }, {
                icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b2.png',
                position: [116.368904, 39.913423]
            }, {
                icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b3.png',
                position: [116.305467, 39.807761]
            }];
           markers.forEach(function(marker) {
                new AMap.Marker({
                    map: map,
                    icon: marker.icon,
                    position: [marker.position[0], marker.position[1]],
                    offset: new AMap.Pixel(-12, -36)
                });
            });


    });
    //table菜单的内容加载

    //第四个菜单加载的内容
    $.ajax({
        url:"data/table4.json",
        success:function(data){
            $(".caiCtn4").load("templates/ercaiCtn4.html", function(){
                $(".caiCtn4").html(baidu.template("ercaiTable4",{
                    listcai4:data
                }))
            })
        }
    });
    
    //第3个菜单的出现
    $.ajax({
        url:"data/table3.json",
        success:function(data){
            $(".caiCtn3").load("templates/ercaiCtn3.html",function(){
                $(".caiCtn3").html(baidu.template("ercaiTable3",{
                    listcai3:data
                }))
            })
        }
    });
    //第二个菜单的出现
    $.ajax({
        url:"data/table2.json",
        success:function(data){
            $("#otherCtn").load("templates/ercaiCtn.html",function(){
                $("#hotCtn").html(baidu.template("ercaiTable2top",{listcai2:data}));
                $("#otherCtn").html(baidu.template("ercaiTable2bottom",{listcai2:data}));

            })
        }
    });
    //第一个菜单的出现
    $.ajax({
        url: "data/table1.json",
        success: function(data){
            $("#cai1Ctn").load("templates/ercaiCtn.html", function(){
                $("#cai1Ctn").html(baidu.template("ercaiTable", {listcai1:data}));
            })
        }

    });

    //创建页
    function pageCreat(pageId, pageCount,curpage,callback){
            //创建页面的样式
            var frameStr = '<a href="###" style="visibility: visible; color: rgb(102, 102, 102); background: white;width:60px;">首页</a>'
                            +'<a href="###" style="visibility: visible; color: rgb(102, 102, 102); background: white; width:100px;"><<上一页</a>'
                            +'<a href="###" style="color: rgb(102, 102, 102); visibility: visible; background: white; width:100px;">下一页>></a>'
                            +'<a href="###" style="color: rgb(102, 102, 102); visibility: visible; background: white; width:60px;">尾页</a>';

            //初始化翻页栏结构
            $("#" + pageId).html(frameStr);
            //页码起始值设置
            var startIndex = curpage > 5 ? curpage -4 : 1;
            //修改翻页时候的页数改变的显示状态
            //让尾页的最后部分还是显示10个页码
            startIndex = (curpage > pageCount - 6) ? (pageCount - 9) : startIndex;
            //然后根据当前页判断4个初始的页面的显示状态
            (curpage >= 2) ? $("#" + pageId).find("a:nth-of-type(2)").show() : $("#" + pageId).find("a:nth-of-type(2)").hide();
            (curpage > 5) ? $("#" + pageId).find("a:nth-of-type(1)").show() : $("#" + pageId).find("a:nth-of-type(1)").hide();
            (curpage > 10 && curpage < 94) ? $("#" + pageId).find("a:last-of-type").show() : $("#" + pageId).find("a:last-of-type").hide();
            (curpage > 97) ? $("#" + pageId).find("a:nth-last-of-type(2)").hide() : $("#" + pageId).find("a:nth-last-of-type(2)").show();

            //创建页码的html
            var numStr = "";
            for(var n = 0; startIndex <= pageCount && n < 10; n++){
                numStr += (startIndex == curpage ? "<a href = '##' class='sa'>"+startIndex+"</a>": "<a href = '##'>"+startIndex+"</a>");
                startIndex++;
            }
            //显示页码
            $("#" + pageId + " a:eq(1)").after(numStr);
            //为页数绑定事件
            //为防止重复点击事件 内部有函数每次创建一次就会重复绑定一次事件
            //在函数创建之初就绑定事件 这样就只绑定一次事件
            //调整到最上面
            //解绑每次进来
            $("#" + pageId).off("click")
            //注意要解决下一页只变一次的bug 因为每次传入的参数不变 
            $("#" + pageId).on("click", "a", function(){
                var targetText = $(this).text();
                switch(targetText){
                    case "首页":
                        pageCreat(pageId, pageCount, 1, callback)
                        break;
                    case "<<上一页":
                        pageCreat(pageId, pageCount, curpage-1, callback);
                        break; 
                    case "尾页":
                        pageCreat(pageId, pageCount, pageCount, callback);
                        break; 
                    case "下一页>>":
                        pageCreat(pageId, pageCount, curpage+1, callback);
                        break; 
                    default:
                        pageCreat(pageId, pageCount, parseInt(targetText), callback);
                        break; 
                }
            });

            //利用函数当前
            callback && callback(curpage - 1);
    };
    //在页面上显示#page的标签里显示 调用函数
    pageCreat("page1", 99, 1,function(pn){
        queryList(pn, "", "");
    });

    //利用反向代理得到数据
    function queryList(pn, city_id, area_id){
        $.ajax({
            url: "/shop",
            data: {
                city_id: city_id || "bei_jing",
                area_id: area_id || "",
                pagesize: 5,
                pn: pn || 0
            },
            dataType: "json",
            success: function(data){
                // console.log(data);
                //加载内容 使用百度模板
                $(".shoplist").load("templates/shoplist.html", function(){
                    //加载到html里
                    $(".shoplist").html(baidu.template("myshop", {shopdata:data}));
                    //用js操作等级 在a便签里面创建背景图
                    var $level = $(".levelStar");
                    $level.each(function(){
                        var title = parseInt(this.title),
                        mythis = $(this);
                        //封装函数 根据数量创建span的函数
                        function spanNum(num, position){
                            for(var i = 0; i < num; i++){
                                //创建span标签并写好样式
                                var span = $("<span>");
                                mythis.append(span.css("background","url(imgs/ping.png) no-repeat 0 "+ position +"px"))
                            };
                        };
                        //如果等级小于等于5 a标签中添加这个数字的心
                        if(title <= 5){
                            spanNum(title, -20);
                        }
                        //如果title大于5 小于15
                        if(title > 5 && title <=15){
                            switch(title){
                                case 6:
                                case 7:
                                    spanNum(1, -37);
                                    break;
                                case 8:
                                case 9:
                                    spanNum(2, -37);
                                    break;
                                case 10:
                                case 11:
                                    spanNum(3, -37);
                                    break;
                                case 12:
                                case 13:
                                    spanNum(4, -37);
                                    break;
                                default:
                                    spanNum(5, -37);
                            }
                        }
                        //如果title大于15;
                        if(title > 15){
                            spanNum(2,-81);
                        }

                    });
                });
            }
        });
    };
    
    //二级联动
    //当点击城市选择城市的时候 页面被赋值 城市列表消失
    function ercity(){
        //每次调用函数都进行先解绑 后在绑定事件 防止调用的时候 事件多次绑定浪费内存
        $(".myp, #hotP").off("click");
        $(".myp, #hotP").on("click", "a", function(){
            //页面显示所选择城市
            $(".selectCity>span:first").text($(this).text());
            $(".citylist").hide();
            var cityCodes = $(this).attr("code");
            pageCreat("page1", 99, 1, function(pn){
                queryList(pn, cityCodes, "");
            });
            //利用jsonp获取区县的数据
            //使用jsonp获取数据
            jsonpQu(cityCodes);
        }); 
    };
    //封装函数得到区县的函数 并绑定事件 
    function jsonpQu(cityCodes){
        //利用jsonp获取区县的数据
        //使用jsonp获取数据
        var script = document.createElement("script");
        script.src = "http://bang.360.cn/aj/get_area/?citycode="+cityCodes + "&callback=showListQu";
        document.head.appendChild(script);
        //解绑事件
        $(".quCtn").off("click");
        //点击时候区县赋值 并刷新页面
        $(".quCtn").on("click", "a", function(){
            $(".selectxian > span:first").text($(this).text());
            $(".qu").hide();
            var codequ = $(this).attr("codequ");
            pageCreat("page1", 99, 1, function(pn){
                    queryList(pn, cityCodes, codequ);
                });
        });
    };
    //先调用一下北京
    jsonpQu("bei_jing");









}
//区县数据使用jsonp抓取
//创建回调函数 放在全局 放在全局 放在全局
function showListQu(data){
    $(".quCtn").load("templates/qu.html", function(){
        $(this).html(baidu.template("qulist", {qudata:data}));
    });  
};
    