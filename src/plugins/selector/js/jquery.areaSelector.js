/*
 *  地区选择器
 *  @author: chenxiaobo
 *  @date: 2017-9-18
 */
import request from '@/utils/request'

let areaHTML =
  "<div class='area-container'>\
            <style>\
				.area-container {\
					width: 692px;\
					height: 545px;\
					border: 1px solid grey;\
					position: fixed;\
					z-index: 1000;\
					top: 15%;\
					left: 45%;\
          left: calc(50% - 346px);\
          display: none;\
          z-index: 2000;\
          background: white;\
				}\
\
				.area-selector-container .head {\
					width: 100%;\
					height: 45px;\
					line-height: 45px;\
					text-align: center;\
					background-color: #f6f6f6;\
					position: absolute;\
					top: 0;\
					left: 0;\
				}\
\
				.area-selector-container .foot {\
					width: 100%;\
					height: 61px;\
					position: absolute;\
					background-color: #f6f6f6;\
					bottom: 0;\
					left: 0;\
					display: flex;\
					align-items: center;\
				}\
\
				.area-selector-container .foot>div {\
					width: 30%;\
					margin: auto;\
					display: flex;\
					justify-content: space-around;\
				}\
\
				.area-selector-container .body {\
					display: flex;\
					align-items: center;\
					margin-top: 45px;\
					height: 437px;\
					justify-content: space-around;\
				}\
\
                .area-container .area-left,\
				.area-container .area-right {\
					width: 200px;\
					height: 375px;\
					border: 1px solid #E5E5E5;\
					overflow: scroll;\
				}\
\
                .area-container .area-left {\
					margin-left: 3rem;\
                }\
                .area-container .body >div > ul{\
                    margin-top: 10px;\
                }\
\
                .area-container .area-left .delete {\
					display: none;\
				}\
\
                .area-container .area-right .delete {\
                    font-size: 12px;\
					float: right;\
                    margin-right: 1rem;\
                    display: inline-block;\
                    width: 15px;\
                    height: 15px;\
                    line-height: 13px;\
                    text-align: center;\
                    color: white;\
                    border-radius: 50%;\
                    background: #d7d7d7;\
				}\
\
                .area-container .depth-one .open-close {\
					font-size: 14px;\
					font-weight: bold;\
                }\
                .area-container .open-close{\
                    margin-left: 1rem;\
                    display: inline-block;\
                    width: 15px;\
                    height: 15px;\
                    line-height: 13px;\
                    text-align: center;\
                    color: white;\
                    border-radius: 50%;\
                    background: #d7d7d7;\
                }\
                .area-container .icon-grey{\
                    color: #d7d7d7;\
                    background: white;\
                }\
                .area-container .depth-one>div{\
                    height: 30px;\
                    padding: 5px 0;\
                    line-height: 18px;\
                }\
                .area-container .depth-one div:hover{\
                    cursor: pointer;\
                }\
                .area-container .depth-two>div{\
                    height: 20px;\
                    line-height: 18px;\
                }\
                .area-container .depth-three>div{\
                    height: 20px;\
                    line-height: 20px;\
                }\
\
                .area-container .area-right {\
					margin-right: 3rem;\
				}\
\
				.area-selector-container .body>div .depth-one>ul>li>div {\
					padding: 5px 0 5px 10px;\
				}\
\
				.area-selector-container .body>div .depth-two>ul>li>div {\
					padding: 5px 0 5px 40px;\
				}\
\
				.area-selector-container .body h3 {\
					height: 39px;\
					width: 100%;\
					text-align: center;\
					line-height: 39px;\
					font-size: 14px;\
					background-color: #f6f6f6\
				}\
\
        .area-selector-container .body h3 > span {\
          color: red;\
          cursor: pointer;\
        }\
\
				.area-selector-container .body .selected {\
					background: #d7d7d7;\
				}\
\
				.area-selector-container .body .unselected {\
					background: white;\
                }\
                .cover{\
                    background: #666;\
                    opacity: 0.6;\
                    width: 100%;\
                    height: 100%;\
                    position: fixed;\
                    top: 0;\
                    left: 0;\
                    z-index: 1500;\
                    display: none;\
                }\
			</style>\
\
			<div class='area-selector-container'>\
				<div class='head'>\
					选择可配送区域\
				</div>\
				<div class='body'>\
					<div class='area-left'>\
						<h3> <span id='chooseAll'>全选</span> 可选省、市、区</h3>\
						<ul>\
						</ul>\
					</div>\
					<button type='button' class='btn btn-default'>添加</button>\
					<div class='area-right'>\
						<h3> <span id='cancelChooseAll'>移除全部</span> 已选省、市、区</h3>\
						<ul>\
\
						</ul>\
					</div>\
				</div>\
				<div class='foot'>\
					<div>\
						<button type='button' class='btn btn-primary confirm'>确认</button>\
						<button type='button' class='btn btn-default cancel'>取消</button>\
					</div>\
				</div>\
				<div class='model' style='display: none;'>\
					<li>\
						<div class='item'>\
							<span class='open-close'>+</span>\
							<span class='name'>河南省</span>\
							<span class='delete'>x</span>\
						</div>\
						<ul style='display: none;'></ul>\
					</li>\
				</div>\
            </div>\
            </div><div class='cover'></div>"

// ---------------------------------------全局变量---------------------------------------
let areaData = [{}] // 所有,省市县数据.
let areaDOM = $(areaHTML) // DOM数据,后续操作全部基于此DOM
let confirmCallback = null // 全局回调变量
let hideDialogFunc  //在关闭Dialog后，动态修改顶层dialogVisible的属性值，做到和效果同步。

// ---------------------------------------END-------------------------------------------

// ---------------------------------------公共方法---------------------------------------

// 绑定DOM事件
let bindEventListener = function() {
  // 监听 +/- 的点击
  areaDOM.find('.model li > div .open-close').on('click', function(e) {
    // 阻止冒泡
    e = e || window.event
    e.stopPropagation()

    let parent = $(this).parent()
    let parentNext = parent.next()

    // 如果点击了第三层的名称span,没有ul
    if (parent.hasClass('depth-three')) {
      return
    }
    // 切换显示状态
    // 如果子节点为展开状态.
    if (parentNext.css('display') === 'block') {
      $(this).text('+')
      parentNext.hide()
    } else {
      $(this).text('-')
      parentNext.show()
    }

    // 根据邮编,渲染下层数据

    // 如果已经存在下层数据,说明渲染过了.return
    if (parentNext.children().length > 0) {
      return
    }
    let regionID = $(this)
      .closest('li')
      .attr('region-id')
    let depthOneID = $(this)
      .closest('li.depth-one')
      .attr('region-id')
    if (
      $(this)
        .closest('li')
        .hasClass('depth-one')
    ) {
      // 渲染第二层
      renderDepthTwoData(regionID, parentNext)
    } else {
      // 渲染第三层
      renderDepthThreeData(regionID, depthOneID, parentNext)
    }
  })

  // 地区全选/取消全选事件
  areaDOM.find('#chooseAll').click(function() {
    if ($('.area-left .depth-one').length <= 0) {
      return
    }
    if ($(this).text() === '全选') {
      $('.area-left .depth-one>div.item').each(function() {
        if (!$(this).parent().hasClass('selected')) {
          toggleSelectedStyle($(this).closest('li'))
        }
      })
      $('#chooseAll').text('取消全选')
    } else {
      $('.area-left .depth-one>div.item').each(function() {
        if ($(this).parent().hasClass('selected')) {
          toggleSelectedStyle($(this).closest('li'))
        }
      })
      $('#chooseAll').text('全选')
    }
  })

  // 移除全部事件
  areaDOM.find('#cancelChooseAll').click(function() {
    $('.area-right .delete').each(function() {
      appearanceAtLeft($(this).closest('li'))
    })
  })

  // 监听 li子div元素 的点击
  areaDOM.find('.model li > div').click(function() {
    toggleSelectedStyle($(this).closest('li'))
  })

  // 删除. 右边的地区,在左边对应位置复现.
  areaDOM.find('.model .delete').click(function(e) {
    // 阻止冒泡
    e = e || window.event
    e.stopPropagation()

    // 复现
    appearanceAtLeft($(this).closest('li'))
  })

  // 添加 按钮监听点击
  areaDOM.find('.body button').click(function() {
    // 添加操作前的预处理
    markSelectedArea()

    // 开始添加
    addDomToRight()
  })

  // 确认 点击事件
  $('.area-selector-container .foot .confirm').click(function() {
    $(this)
      .closest('.area-container')
      .css('display', 'none')
    $('.cover').css('display', 'none')
    // 执行回调,把已选数据传递出去.
    confirmCallback(getJSON())
    hideDialogFunc();
  })

  // 取消 点击事件
  $('.area-selector-container .foot .cancel').click(function() {
    $(this)
      .closest('.area-container')
      .css('display', 'none')
    $('.cover').css('display', 'none')
    hideDialogFunc();
  })
}

// 左边div元素绑定点击事件.
let bindClickListener = function(which) {
  which.click(function() {
    toggleSelectedStyle(which.closest('li'))
  })
}

// 请求并初次渲染数据.(仅渲染第一层,省级)
let requestAndFirstRenderData = function(api, isfilter = true, filterData = []) {
  request({url: api, method: 'get'}).then(response => {
    let _areaData = areaData = response
    filterData = filterData.map((item) =>{
      return item.id
    })
    if (isfilter && filterData.length) {
      _areaData = handleFilter(areaData, filterData)
    }
    // 遍历各省插入到HTML中
    let li
    _areaData.forEach(function(province) {
      li = areaDOM.find('.model li').clone(true)

      li.addClass('depth-one')
      li.attr('region-id', province.id)
      li.attr('is-show', province.isShow || 'block');
      li.find('div .name').text(province.local_name)
      areaDOM.find('.body .area-left > ul').append(li)
    })
    // 隐藏已选元素
    $("div.area-left").find("li").each(function(){
      $(this).css("display", $(this).attr("is-show"))
    })
  })
}
// 为数据添加过滤标记
let handleFilter = function (data, filterData) {
  data.forEach(function(key){
    if (filterData.includes(key.id)) {
      key.isShow = 'none'
    }
    if (key.children && key.children.length) {
      key.children = handleFilter(key.children, filterData)
    }
  })
  return data
}

// 渲染第二层数据,市级
// regionID: 省级邮编,根据这个判断如果属于本省的市,则渲染.
// where: 渲染出来的li,插入到哪里
let renderDepthTwoData = function(regionID, where) {
  // 遍历各市,插入到HTML中
  let li
  areaData.forEach(function(province) {
    // 找到用户点击的省份的对象
    if (province.id == regionID) {
      province.children.forEach(function(city) {
        li = areaDOM.find('.model li').clone(true)
        //如果用户点击的+在右边那块.则清除掉div的click事件
        if (where.closest('.area-right').length === 1) {
          li.find('div').off('click')
        }

        li.addClass('depth-two')
        if (where.parent().hasClass('selected')) {
          li.removeClass('unselected').addClass('selected')
          li.find('.open-close').addClass('icon-grey')
        } else {
          li.addClass('unselected').removeClass('selected')
          li.find('.open-close').removeClass('icon-grey')
        }
        li.attr('region-id', city.id)
        li.attr('is-show', city.isShow || 'block');
        li.find('div .name').text(city.local_name)
        where.append(li)
      })
    }
  })
  // 隐藏已选元素
  $("div.area-left").find("li").each(function(){
    $(this).css("display", $(this).attr("is-show"))
  })
}

// 渲染第三层数据,县级
// regionID: 市级邮编,根据这个判断如果属于本市的县区,则渲染.
// where: 渲染出来的li,插入到哪里
let renderDepthThreeData = function(regionID, depthOneID, where) {
  // 遍历各市,插入到HTML中
  let li
  areaData.forEach(function(province) {
    // 找到对应省份
    if (province.id == depthOneID) {
      province.children.forEach(function(city) {
        // 找到对应市
        if (city.id == regionID) {
          city.children.forEach(function(county) {
            li = areaDOM.find('.model li').clone(true)
            //如果用户点击的+在右边那块.则清除掉div的click事件
            if (where.closest('.area-right').length === 1) {
              li.find('div').off('click')
            }

            li.find('ul').remove()
            li.find('.open-close').remove()
            if (where.parent().hasClass('selected')) {
              li.addClass('selected')
            } else {
              li.addClass('unselected')
            }
            li.addClass('depth-three')
            li.attr('region-id', county.id)
            li.attr('is-show', county.isShow || 'block');
            li.find('div .name').text(county.local_name)
            where.append(li)
          })
        }
      })
    }
  })
  // 隐藏已选元素
  $("div.area-left").find("li").each(function(){
    $(this).css("display", $(this).attr("is-show"))
  })
}

// 切换自身和children的样式,是否被选择,选择则去掉.没有则添加.
let toggleSelectedStyle = function(item) {
  // 切换自身的样式
  if (item.hasClass('selected')) {
    item.addClass('unselected').removeClass('selected')
    item
      .find('li')
      .addClass('unselected')
      .removeClass('selected')
    // 同时切换+/-符号的样式
    item.find('.open-close').removeClass('icon-grey')
  } else {
    item.addClass('selected').removeClass('unselected')
    item
      .find('li')
      .addClass('selected')
      .removeClass('unselected')
    // 同时切换+/-符号的样式
    item.find('.open-close').addClass('icon-grey')
  }
  // 第一层li的话,返回
  if (item.hasClass('depth-one')) {
    return
  }
  // 如果所有兄弟元素包括自己全为已选.父已选
  if (
    item.parent().children('.selected').length ===
    item.parent().children().length
  ) {
    item
      .parent('ul')
      .parent('li')
      .removeClass('unselected')
      .addClass('selected')
    // 同时切换+/-符号的样式
    item
      .parent('ul')
      .prev()
      .find('.open-close')
      .addClass('icon-grey')
  } else {
    // 其他情况,父皆不选:
    // 如果所有兄弟元素包括自己全为不选.
    // 所有兄弟元素包括自己 有选又不选
    item
      .parent('ul')
      .parent('li')
      .removeClass('selected')
      .addClass('unselected')
    // 同时切换+/-符号的样式
    item
      .parent('ul')
      .prev()
      .find('.open-close')
      .removeClass('icon-grey')
  }
  // 如果用户点击的是第二层.return;
  // 后面的代码是用户点击第三层才执行的.
  if (item.hasClass('depth-two')) {
    return
  }
  // 因为很可能第二层发生改变,还需要改变第一层的样式
  let depthOne = item.closest('.depth-one').children('ul')
  if (depthOne.children('.selected').length === depthOne.children().length) {
    depthOne
      .parent('li')
      .removeClass('unselected')
      .addClass('selected')
    depthOne
      .prev()
      .find('.open-close')
      .addClass('icon-grey')
  } else {
    depthOne
      .parent('li')
      .removeClass('selected')
      .addClass('unselected')
    depthOne
      .prev()
      .find('.open-close')
      .removeClass('icon-grey')
  }
}

// 遍历,对前两层的区域做 独特的 标记.
// data-all = all/part
// 第一/二层的li元素,每一个都可能有三种状态.
// 1.没有data-all属性: 表示children中全部没有被选择
// 2.data-all==='all', children中全部被选择
// 3.data-all==='part', children中部分被选择
let markSelectedArea = function() {
  // 从第二层开始处理.
  areaDOM.find('.body .area-left li.depth-two').each(function() {
    // 每次开始前都先清除之前的data-all属性,如果存在的话.
    $(this).removeAttr('data-all')

    let ul = $(this).children('ul')
    let children = ul.children()

    // children为0, 看自身状态
    if (children.length === 0) {
      if ($(this).hasClass('selected')) {
        // 标记自身
        $(this).attr('data-all', 'all')
      }
    } else {
      // children不为0, 看children状态
      // children 全选
      if (ul.children('.selected').length === children.length) {
        $(this).attr('data-all', 'all')
      } else if (ul.children('.unselected').length === children.length) {
        // children 全不选
        // 什么都不做
      } else {
        // children 部分选择
        $(this).attr('data-all', 'part')
      }
    }
  })
  // 处理第一层
  areaDOM.find('.body .area-left li.depth-one').each(function() {
    // 每次开始前都先清除之前的data-all属性,如果存在的话.
    $(this).removeAttr('data-all')

    let ul = $(this).children('ul')
    let children = ul.children()

    // children为0, 看自身状态
    if (children.length === 0) {
      if ($(this).hasClass('selected')) {
        // 标记自身
        $(this).attr('data-all', 'all')
      }
    } else {
      // children不为0, 看children状态
      // children 全选
      if (ul.children('[data-all=all]').length === children.length) {
        $(this).attr('data-all', 'all')
      } else if (ul.children('[data-all]').length === 0) {
        // children 不存在data-all属性
        // 什么都不做
      } else {
        // children 存在data-all===all 或者 data-all===part 或者两者都存在
        $(this).attr('data-all', 'part')
      }
    }
  })
}

// 根据标记,选择性的cloneDOM,添加到右边.
let addDomToRight = function() {
  // 遍历第一层li
  areaDOM.find('.body .area-left li.depth-one').each(function() {
    // 如果当前li不存在data-all属性.
    if (!$(this).attr('data-all')) {
      return
    }

    // 右边,DOM
    let right = $(this)
      .closest('.area-left')
      .siblings('.area-right')
      .children('ul')

    if ($(this).attr('data-all') === 'all') {
      // 取消样式和click事件
      $(this).removeClass('selected')
      $(this)
        .find('li')
        .removeClass('selected')
      // 取消图标白色样式
      $(this)
        .find('.open-close')
        .removeClass('icon-grey')
      $(this)
        .find('div')
        .off('click')

      let depthOneDOM = right.find(
        '.depth-one[region-id=' + $(this).attr('region-id') + ']'
      )

      if (depthOneDOM.length === 0) {
        // 如果全选并且右边不存在.
        right.append($(this))
      } else {
        // 如果全选并且右边存在
        // 遍历第二层, 插入到右边对应的第一层的ul下面
        $(this)
          .find('li.depth-two')
          .each(function() {
            depthOneDOM.children('ul').append($(this))
          })
        // 遍历完成后,删除当前li;
        $(this).remove()
      }
      return
    }

    // 如果全选且右边已经存在当前li  或者 部分被选择
    if ($(this).attr('data-all') === 'part') {
      // 克隆第一层的特定li
      let liCloned = $(this).clone(true)
      // 各自处理li的DOM;
      dealLiDOM($(this), liCloned)

      // 取消图标样式
      liCloned.find('.open-close').removeClass('icon-grey')

      // 不能简单的添加到右边
      // right.append(liCloned);
      // 把克隆过的添加到右边.
      appendOperation(right, liCloned)
    }
  })
  // 显示右边已选数据
  $(".area-right").find("li").each(function(){
    $(this).css("display", "block")
  })
}

// 根据来源不同,分别处理(删除不需要的DOM)li的DOM.(第一层)
let dealLiDOM = function(li, li_cloned) {
  // 源li
  // 遍历第二层li
  li
    .children('ul')
    .children('li')
    .each(function() {
      if ($(this).attr('data-all') === 'all') {
        // 源li删除
        $(this).remove()
        return
      }
      // 遍历第三层li
      $(this)
        .find('li')
        .each(function() {
          if ($(this).hasClass('selected')) {
            $(this).remove()
          }
        })
    })

  // 克隆li
  // 遍历第二层li
  li_cloned
    .children('ul')
    .children('li')
    .each(function() {
      // 不存在 data-all 属性
      if (!$(this).attr('data-all')) {
        // 克隆li删除
        $(this).remove()
        return
      }
      // 删除点击事件.(父,自身,子)
      $(this)
        .closest('ul')
        .prev()
        .off('click')
      $(this)
        .find('div')
        .off('click') // 包括自身和children
      // 移除class
      $(this).removeClass('selected')
      $(this)
        .find('li')
        .removeClass('selected')

      // 遍历第三层li
      $(this)
        .find('li')
        .each(function() {
          if ($(this).hasClass('unselected')) {
            $(this).remove()
          }
        })
    })
}

// 把DOM添加到右边的区域.
// 如果已存在,则合并.
// theLiDOM: 克隆猴的第一层的特定Li
let appendOperation = function(rightDOM, theLiDOM) {
  // 如果当前li在右边的第一层DOM中未发现.
  // 根据邮编判断
  let depthOneDOM = rightDOM.find(
    '.depth-one[region-id=' + theLiDOM.attr('region-id') + ']'
  )
  if (depthOneDOM.length === 0) {
    // 直接添加
    rightDOM.append(theLiDOM)
    return
  }

  // 当前li在右边的第一层DOM中存在.
  // 右边那个第一层liDOM: depthOneDOM
  // 遍历当前li的第二层,接着判断
  theLiDOM.find('li.depth-two').each(function() {
    let depthTwoDOM = depthOneDOM.find(
      '.depth-two[region-id=' + $(this).attr('region-id') + ']'
    )
    // 如果当前第二层li在右边对应地方不存在
    if (depthTwoDOM.length === 0) {
      // 直接添加
      depthOneDOM.children('ul').append($(this))
      // 结束当前循环
      return
    }

    // 如果第二层也在右边对应第一层里存在
    // 遍历并判断第三层
    $(this)
      .find('li.depth-three')
      .each(function() {
        let depthThreeDOM = depthTwoDOM.find(
          '.depth-three[region-id=' + $(this).attr('region-id') + ']'
        )
        // 如果当前第三层li在右边对应地方不存在
        if (depthThreeDOM.length === 0) {
          // 添加
          depthTwoDOM.children('ul').append($(this))
        }

        // 存在的话,什么都不做.
      })
  })
}

// 在左边对应位置复现将被删除的地区
let appearanceAtLeft = function(which) {
  // 左边DOM
  let leftDOM = which
    .closest('.area-right')
    .siblings('.area-left')
    .children('ul')
  // 用户点击的是第一层
  if (which.hasClass('depth-one')) {
    let leftParentOne = leftDOM.find(
      '.depth-one[region-id=' + which.attr('region-id') + ']'
    )
    // 该li在左边不存在
    if (leftParentOne.length === 0) {
      // 绑定回点击事件
      which.find('div').each(function() {
        bindClickListener($(this))
      })
      // 转换样式
      toggleSelectedStyle(which)
      // 直接添加
      leftDOM.prepend(which)
      // ------------------
      // PS: 关于数据恢复原状.就是说排序的问题. 可以在渲染数据时,利用attr设置好顺序. 后面每次有变化就排下序.
      // ------------------
    } else {
      // 第一层在左边存在
      // 遍历判断第二层
      which.find('li.depth-two').each(function() {
        let leftParentTwo = leftParentOne.find(
          '.depth-two[region-id=' + $(this).attr('region-id') + ']'
        )
        // 当前第二层DOM在左边对应位置不存在
        if (leftParentTwo.length === 0) {
          // 绑定回点击事件
          $(this)
            .find('div')
            .each(function() {
              bindClickListener($(this))
              // 转换样式
              toggleSelectedStyle($(this).closest('li'))
            })
          leftParentOne.children('ul').prepend($(this))
        } else {
          // 当前第二层在左边对应位置存在
          // 遍历判断第三层
          $(this)
            .find('li.depth-three')
            .each(function() {
              // 第三层在左边不存在
              if (
                leftParentTwo.find(
                  '.depth-three[region-id=' + $(this).attr('region-id') + ']'
                ).length === 0
              ) {
                // 绑定回点击事件
                let cloneLi = $(this).clone(true)
                cloneLi.find('div').each(function() {
                  bindClickListener($(this))
                  // 转换样式
                  toggleSelectedStyle($(this).closest('li'))
                })
                leftParentTwo.children('ul').prepend(cloneLi)
              }
              // 存在则忽略
            })
        }
      })
      // 移除剩下的第一层DOM.
      which.remove()
    }
  } else if (which.hasClass('depth-two')) {
    // 用户点击的是第二层
    // 获取父,第一层DOM
    let parentDepthOne = which.closest('li.depth-one')
    // 在左边查找当前元素的第一层DOM
    let leftParentOne = leftDOM.find(
      '.depth-one[region-id=' + parentDepthOne.attr('region-id') + ']'
    )
    // 如果父第一层在左边不存在
    if (leftParentOne.length === 0) {
      // 先克隆下
      let cloneParent = parentDepthOne.clone(true)
      // 清空父第一层DOM的所有children,只添加当前第二层DOM
      cloneParent
        .children('ul')
        .empty()
        .prepend(which)
      // 绑定回点击事件
      cloneParent.find('div').each(function() {
        bindClickListener($(this))
      })
      // 转换样式
      toggleSelectedStyle(cloneParent)
      // 添加父第一层
      leftDOM.prepend(cloneParent)
      return
    }
    // 第一层在左边存在;

    let leftDepthTwo = leftParentOne.find(
      '.depth-two[region-id=' + which.attr('region-id') + ']'
    )
    // 当前第二层在左边不存在
    if (leftDepthTwo.length === 0) {
      let whichCloned = which.clone(true)
      // 绑定回点击事件
      whichCloned.find('div').each(function() {
        bindClickListener($(this))
        // 转换样式
        toggleSelectedStyle($(this).closest('li'))
      })
      // 直接添加
      leftParentOne.children('ul').prepend(whichCloned)
    } else {
      // 如果当前第二层在左边存在
      // 遍历第三层,判断
      which.find('li.depth-three').each(function() {
        // 当前第三层在左边不存在
        if (
          leftDepthTwo.find(
            '.depth-three[region-id=' + $(this).attr('region-id') + ']'
          ).length === 0
        ) {
          // 绑定回点击事件
          $(this)
            .find('div')
            .each(function() {
              bindClickListener($(this))
              // 转换样式
              toggleSelectedStyle($(this).closest('li'))
            })
          // 直接添加
          leftDepthTwo.children('ul').prepend($(this))
        }
      })
    }

    // 如果父第一层节点没有节点.删除
    if (which.siblings().length === 0) {
      which.closest('li.depth-one').remove()
    } else {
      // 删除剩下的第二层DOM
      which.remove()
    }
  } else {
    // 用户点击的是第三层
    // 获取父,第二层DOM和第一层DOM
    let parentDepthTwo = which.closest('li.depth-two')
    let parentDepthOne = which.closest('li.depth-one')

    // 父第一层,父第二层DOM,在左侧对应的DOM
    let leftParentOne = leftDOM.find(
      '.depth-one[region-id=' + parentDepthOne.attr('region-id') + ']'
    )
    let leftParentTwo = leftDOM.find(
      '.depth-two[region-id=' + parentDepthTwo.attr('region-id') + ']'
    )

    // 如果父第一层在左边不存在
    if (leftParentOne.length === 0) {
      // 克隆下parent数据
      let cloneParentDepthTwo = parentDepthTwo.clone(true)
      let cloneParentDepthOne = parentDepthOne.clone(true)

      // 清空无用DOM,只有当前DOM子类
      cloneParentDepthTwo
        .children('ul')
        .empty()
        .prepend(which)
      cloneParentDepthOne
        .children('ul')
        .empty()
        .prepend(cloneParentDepthTwo)
      // 绑定回点击事件
      cloneParentDepthOne.find('div').each(function() {
        bindClickListener($(this))
      })
      // 转换样式
      toggleSelectedStyle(cloneParentDepthOne)
      leftDOM.prepend(cloneParentDepthOne)

      // 如果当前第三层DOM没有兄弟, 移除当前第三层DOM的父li
      if (which.siblings().length === 0) {
        parentDepthTwo.remove()
      }
      // 移除之后, 如果父第一层DOM下没有子数据,移除.
      if (parentDepthOne.find('li.depth-two').length === 0) {
        parentDepthOne.remove()
      }
    } else if (leftParentTwo.length === 0) {
      // 如果父第一层在左边存在,但父第二层不存在

      // 克隆第二层DOM, 并清除无用DOM,只有当前第三层DOM
      let cloneParentDepthTwo = parentDepthTwo.clone(true)
      cloneParentDepthTwo
        .children('ul')
        .empty()
        .prepend(which)
      // 绑定回点击事件
      cloneParentDepthTwo.find('div').each(function() {
        bindClickListener($(this))
      })
      // 转换样式
      toggleSelectedStyle(cloneParentDepthTwo)
      // 添加到左边对应第一层
      leftParentOne.children('ul').prepend(cloneParentDepthTwo)

      // 移除之后, 如果父第二层DOM下没有子数据,移除本身
      if (parentDepthTwo.find('li.depth-three').length === 0) {
        parentDepthTwo.remove()
      }
      // 移除之后, 如果父第一层DOM下没有子数据,移除.
      if (parentDepthOne.find('li.depth-two').length === 0) {
        parentDepthOne.remove()
      }
    } else {
      // 如果父第一层在左边存在,父第二层也存在

      // 绑定回点击事件
      which.find('div').each(function() {
        bindClickListener($(this))
      })
      // 转换样式
      toggleSelectedStyle(which)
      // 如果父第一层在左边存在,父第二层也存在
      // 直接添加到对应的位置.
      leftParentTwo.children('ul').prepend(which)

      // 判断是否还有其他子元素,没有的话,删除父第二层DOM
      if (parentDepthTwo.find('li').length === 0) {
        parentDepthTwo.remove()
      }
      //判断是否要删除第一层DOM
      if (parentDepthOne.find('li').length === 0) {
        parentDepthOne.remove()
      }
    }
  }
}

let cloneData = function(data) {
  let tempObj = JSON.parse(JSON.stringify(data))
  delete tempObj.children
  return tempObj
}

// 遍历获取已选择的区域的数据.
let getJSON = function() {
  let dataArray = []
  // 解决全选省级
  // 遍历省份
  areaDOM.find('.area-right li.depth-one').each(function() {
    let provinceID = Number($(this).attr('region-id'))
    // 如果左边不存在该省份, 就把该省份及下面市县数据全部添加进来.
    if (areaDOM.find('.area-left li.depth-one[region-id=' + provinceID + ']').length === 0) {
      // 从源数据,把下面市/县数据挨个添加进来
      areaData.forEach(function(province) {
        // 找到特定省份
        if (province.id !== provinceID) {
          return
        }
        // 首先把当前省份添加进来
        dataArray.push(cloneData(province))

        if (!province.children || province.children.length === 0) {
          // 跳出当前循环
          return
        }

        province.children.forEach(function(city) {
          dataArray.push(cloneData(city))

          // 遍历县级数据, 挨个添加进来.
          if (!city.children || city.children.length === 0) {
            // 跳出当前循环
            return
          }
          city.children.forEach(function(county) {
            dataArray.push(cloneData(county))
          })
        })
      })

      // 移除当前省级DOM,省的影响到后面
      $(this).remove()
    }
  })
  // 遍历市级
  areaDOM.find('.area-right li.depth-two').each(function() {
    let cityID = Number($(this).attr('region-id'))
    // 如果左边不存在对应市, 说明全选了市
    // 把所有县级数据添加进来
    if (areaDOM.find('.area-left li.depth-two[region-id=' + cityID + ']').length === 0) {
      let provinceID = Number($(this).closest('li.depth-one').attr('region-id'))
      // 从源数据,把县数据添加进来
      areaData.forEach(function(province) {
        // 找到特定省份
        if (province.id !== provinceID) {
          return
        }
        if (!province.children || province.children.length === 0) {
          // 跳出当前循环
          return
        }

        province.children.forEach(function(city) {
          if (city.id !== cityID) {
            // 不是对应 市, 跳出当前循环
            return
          }
          dataArray.push(cloneData(city))
          // 没有县级数据
          if (!city.children || city.children.length === 0) {
            // 跳出当前循环
            return
          }
          // 遍历县级数据.
          city.children.forEach(function(county) {
            dataArray.push(cloneData(county))
          })
        })
      })
      // 移除当前市级DOM,省的影响到后面
      $(this).remove()
    }
  })
  // 遍历县级
  areaDOM.find('.area-right li.depth-three').each(function() {
    let countyID = Number($(this).attr('region-id'))
    let cityID = Number(
      $(this)
        .closest('li.depth-two')
        .attr('region-id')
    )
    let provinceID = Number(
      $(this)
        .closest('li.depth-one')
        .attr('region-id')
    )

    areaData.forEach(function(province) {
      if (province.id !== provinceID) {
        return
      }
      if (!province.children || province.children.length === 0) {
        return
      }

      // 遍历市
      province.children.forEach(function(city) {
        if (city.id !== cityID) {
          return
        }
        if (!city.children || city.children.length === 0) {
          return
        }

        city.children.forEach(function(county) {
          if (county.id !== countyID) {
            return
          }
          dataArray.push(cloneData(county))
        })
      })
    })
  })
  return dataArray
}

// 处理默认数据
let startDefault = function(sourceData) {
  if (!sourceData) {
    return
  }
  // 划分源数据为三部分, level 1 , level 2 , level 3
  // 其中level 1,2 只留id
  let divideData = function(data) {
    let levelOne = [],
      levelTwo = [],
      levelThree = []
    data.forEach(function(tempObj) {
      if (tempObj.level == 1) {
        levelOne.push(tempObj.id)
      } else if (tempObj.level == 2) {
        levelTwo.push(tempObj)
      } else {
        levelThree.push(tempObj)
      }
    })
    return [levelOne, levelTwo, levelThree]
  }

  let dividedData = divideData(sourceData)

  /*
        * 处理level 3 数据, 增加第一层数据的id
        * 即p_p_regions_id
        * 然后如果检测到此父级地区全选的话, 删除这些相关第三层数据.
        */
  let dealLevelThreeData = function(completeData, data, levelTwoData) {
    let levelTwoArray = levelTwoData.map(function(tempObj) {
      return tempObj.id
    })

    return data.filter(function(tempObj) {
      // 如果level 3数据的父级id在level 2数据中,说明一定是用户全选了level 2地区.
      // 因为用户只选择level 3地区,不会获取到他的parent地区数据.
      // 而只有全选,才会获取parent地区和所有children地区数据.
      if (levelTwoArray.indexOf(tempObj.parent_id) >= 0) {
        // 存在
        return false
      }

      let ok = false
      completeData.forEach(function(levelOne) {
        if (!levelOne.children || levelOne.children.length === 0) {
          return
        }

        levelOne.children.forEach(function(levelTwo) {
          // 找到第三层数据的父级数据
          if (levelTwo.id === tempObj.parent_id) {
            // 给当前第三层增加属性. 直连第一层.
            tempObj.p_p_regions_id = levelOne.id
            ok = true
          }
        })
      })

      return ok
    })
  }

  /*
         * 处理level 2 数据,
         * 如果检测到此父级地区全选的话, 删除这些相关第二层数据.
         */
  let dealLevelTwoData = function(completeData, levelTwo, levelOne) {
    return levelTwo.filter(function(tempObj) {
      // 与 dealLevelThreeData 同理
      // 检测到parent是全选.
      // 丢掉此level 2数据.
      if (levelOne.indexOf(tempObj.parent_id) >= 0) {
        return false
      }
      return true
    })
  }
  dividedData[2] = dealLevelThreeData(areaData, dividedData[2], dividedData[1])
  dividedData[1] = dealLevelTwoData(areaData, dividedData[1], dividedData[0])

  let setTime = setInterval(function() {
    if (
      areaDOM.find('.area-left li.depth-one[region-id=' + 1 + ']').length === 1
    ) {
      clearInterval(setTime)
      // 遍历初始化省份
      dividedData[0].forEach(function(provinceID) {
        areaDOM
          .find('.area-left li.depth-one[region-id=' + provinceID + '] > div')
          .click()
      })
      // 遍历初始化市
      dividedData[1].forEach(function(city) {
        // 找到特定省/市
        let provinceDOM = areaDOM.find(
          '.area-left li.depth-one[region-id=' + city.parent_id + ']'
        )
        provinceDOM
          .children('div')
          .find('.open-close')
          .click()

        let cityDOM = provinceDOM.find(
          'li.depth-two[region-id=' + city.id + ']'
        )
        cityDOM.children('div').click()
      })
      // 遍历初始化县
      dividedData[2].forEach(function(county) {
        // 找到特定省/市/县
        let provinceDOM = areaDOM.find(
          '.area-left li.depth-one[region-id=' + county.p_p_regions_id + ']'
        )
        // 如果不存在市级数据,说明还没有点击过 +
        if (provinceDOM.find('li.depth-two').length === 0) {
          provinceDOM
            .children('div')
            .find('.open-close')
            .click()
        }
        let cityDOM = provinceDOM.find(
          'li.depth-two[region-id=' + county.parent_id + ']'
        )
        // 如果不存在县级数据,说明还没有点击过 +
        if (cityDOM.find('li.depth-three').length === 0) {
          cityDOM
            .children('div')
            .find('.open-close')
            .click()
        }
        let countyDOM = provinceDOM.find(
          'li.depth-three[region-id=' + county.id + ']'
        )
        countyDOM.children('div').click()
      })
      // 程序点击添加按钮
      areaDOM.find('.body > button').click()
    }
  }, 500)
}
export default {
  show: function(options) {
    // 把回调函数赋值给全局变量
    confirmCallback = options.confirm
    hideDialogFunc = options.callHideDialog
    // 如果选择器已经存在,只是没显示
    areaDOM.css('display', 'block')
    $('.cover').css('display', 'block')
    if ($('.area-container').length === 1) {
      // 如果不是第一次调用选择器
      // 清空已存在数据,重新加载渲染
      $('.area-container .area-left > ul').empty()
      $('.area-container .area-right > ul').empty()
    } else {
      $('body').append(areaDOM)
      // 需要在数据渲染之前执行.
      bindEventListener()
      // 设置cover遮罩层的高度为body的高
      $('.cover').css('height', document.documentElement.clientHeight)
    }
    areaDOM.find('#chooseAll').text('全选')
    requestAndFirstRenderData(options.api, options.isfilter = true, options.filterData)
    startDefault(options.defaultData)
  }
}
// ---------------------------------------END-------------------------------------------
