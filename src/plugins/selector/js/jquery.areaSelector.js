/*
 *  Area selector
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
					Select a distribution area\
				</div>\
				<div class='body'>\
					<div class='area-left'>\
						<h3> <span id='chooseAll'>Select all</span> Optional province、The city、area</h3>\
						<ul>\
						</ul>\
					</div>\
					<button type='button' class='btn btn-default'>add</button>\
					<div class='area-right'>\
						<h3> <span id='cancelChooseAll'>Remove all</span> The selected provinces、The city、area</h3>\
						<ul>\
\
						</ul>\
					</div>\
				</div>\
				<div class='foot'>\
					<div>\
						<button type='button' class='btn btn-primary confirm'>confirm</button>\
						<button type='button' class='btn btn-default cancel'>cancel</button>\
					</div>\
				</div>\
				<div class='model' style='display: none;'>\
					<li>\
						<div class='item'>\
							<span class='open-close'>+</span>\
							<span class='name'>Henan province</span>\
							<span class='delete'>x</span>\
						</div>\
						<ul style='display: none;'></ul>\
					</li>\
				</div>\
            </div>\
            </div><div class='cover'></div>"

// ---------------------------------------The global variable---------------------------------------
let areaData = [{}] // all,Provincial and county data.
let areaDOM = $(areaHTML) // DOMdata,Subsequent operations are all based on thisDOM
let confirmCallback = null // Global callback variables
let hideDialogFunc  //In the closedDialogAfter that, change the top layer dynamicallydialogVisibleAttribute value, and achieve synchronization with the effect.

// ---------------------------------------END-------------------------------------------

// ---------------------------------------Public methods---------------------------------------

// The bindingDOMThe event
let bindEventListener = function() {
  // Listen for the +/- click
  areaDOM.find('.model li > div .open-close').on('click', function(e) {
    // To prevent a bubble
    e = e || window.event
    e.stopPropagation()

    let parent = $(this).parent()
    let parentNext = parent.next()

    // If you click the name span of layer 3, there is no UL
    if (parent.hasClass('depth-three')) {
      return
    }
    // Toggle display state
    // If the child node is in an expanded state.
    if (parentNext.css('display') === 'block') {
      $(this).text('+')
      parentNext.hide()
    } else {
      $(this).text('-')
      parentNext.show()
    }

    // Render the underlying data according to the zip code

    // If the underlying data already exists, it is rendered. Return
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
      // Render the second layer
      renderDepthTwoData(regionID, parentNext)
    } else {
      // Render layer 3
      renderDepthThreeData(regionID, depthOneID, parentNext)
    }
  })

  // Select all/cancel all events by district
  areaDOM.find('#chooseAll').click(function() {
    if ($('.area-left .depth-one').length <= 0) {
      return
    }
    if ($(this).text() === 'Select all') {
      $('.area-left .depth-one>div.item').each(function() {
        if (!$(this).parent().hasClass('selected')) {
          toggleSelectedStyle($(this).closest('li'))
        }
      })
      $('#chooseAll').text('To cancel all')
    } else {
      $('.area-left .depth-one>div.item').each(function() {
        if ($(this).parent().hasClass('selected')) {
          toggleSelectedStyle($(this).closest('li'))
        }
      })
      $('#chooseAll').text('Select all')
    }
  })

  // Remove all events
  areaDOM.find('#cancelChooseAll').click(function() {
    $('.area-right .delete').each(function() {
      appearanceAtLeft($(this).closest('li'))
    })
  })

  // Listen for the click of the li subdiv element
  areaDOM.find('.model li > div').click(function() {
    toggleSelectedStyle($(this).closest('li'))
  })

  // Delete. The region on the right is reproduced at the corresponding position on the left.
  areaDOM.find('.model .delete').click(function(e) {
    // To prevent a bubble
    e = e || window.event
    e.stopPropagation()

    // repetition
    appearanceAtLeft($(this).closest('li'))
  })

  // Add a button to listen for clicks
  areaDOM.find('.body button').click(function() {
    // Preprocessing before adding operations
    markSelectedArea()

    // Start adding
    addDomToRight()
  })

  // Confirm click event
  $('.area-selector-container .foot .confirm').click(function() {
    $(this)
      .closest('.area-container')
      .css('display', 'none')
    $('.cover').css('display', 'none')
    // Perform a callback to pass the selected data.
    confirmCallback(getJSON())
    hideDialogFunc();
  })

  // Unclick event
  $('.area-selector-container .foot .cancel').click(function() {
    $(this)
      .closest('.area-container')
      .css('display', 'none')
    $('.cover').css('display', 'none')
    hideDialogFunc();
  })
}

// On the leftdivElement binding click events.
let bindClickListener = function(which) {
  which.click(function() {
    toggleSelectedStyle(which.closest('li'))
  })
}

// Request and first render the data.(Render only the first layer,At the provincial level)
let requestAndFirstRenderData = function(api, isfilter = true, filterData = []) {
  request({url: api, method: 'get'}).then(response => {
    let _areaData = areaData = response
    filterData = filterData.map((item) =>{
      return item.id
    })
    if (isfilter && filterData.length) {
      _areaData = handleFilter(areaData, filterData)
    }
    // Iterate through the provinces and insert them into the HTML
    let li
    _areaData.forEach(function(province) {
      li = areaDOM.find('.model li').clone(true)

      li.addClass('depth-one')
      li.attr('region-id', province.id)
      li.attr('is-show', province.isShow || 'block');
      li.find('div .name').text(province.local_name)
      areaDOM.find('.body .area-left > ul').append(li)
    })
    // Hide the selected element
    $("div.area-left").find("li").each(function(){
      $(this).css("display", $(this).attr("is-show"))
    })
  })
}
// Add a filter tag to the data
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

// Render the second layer of data,The municipal
// regionID: Provincial postal code,According to this judgment, if it belongs to the city of the province,The rendering.
// where: Renderedli,Where to insert
let renderDepthTwoData = function(regionID, where) {
  // Iterate through the cities and insert into the HTML
  let li
  areaData.forEach(function(province) {
    // Find the object for the province the user clicked on
    if (province.id == regionID) {
      province.children.forEach(function(city) {
        li = areaDOM.find('.model li').clone(true)
        // If the user clicks the + on the right one. Clears the divs click event
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
  // Hide the selected element
  $("div.area-left").find("li").each(function(){
    $(this).css("display", $(this).attr("is-show"))
  })
}

// Render layer 3 data,At the county level
// regionID: City, zip code,According to this judgment if belongs to the county district of the city,The rendering.
// where: Renderedli,Where to insert
let renderDepthThreeData = function(regionID, depthOneID, where) {
  // Iterate through the cities and insert into the HTML
  let li
  areaData.forEach(function(province) {
    // Find the corresponding province
    if (province.id == depthOneID) {
      province.children.forEach(function(city) {
        // Find the corresponding market
        if (city.id == regionID) {
          city.children.forEach(function(county) {
            li = areaDOM.find('.model li').clone(true)
            // If the user clicks the + on the right one. Clears the divs click event
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
  // Hide the selected element
  $("div.area-left").find("li").each(function(){
    $(this).css("display", $(this).attr("is-show"))
  })
}

// Switch the sum of itselfchildrenThe style of the,Whether or not to be selected,Select to get rid of.If not, add.
let toggleSelectedStyle = function(item) {
  // Toggle its own style
  if (item.hasClass('selected')) {
    item.addClass('unselected').removeClass('selected')
    item
      .find('li')
      .addClass('unselected')
      .removeClass('selected')
    // Also switch the +/- symbol style
    item.find('.open-close').removeClass('icon-grey')
  } else {
    item.addClass('selected').removeClass('unselected')
    item
      .find('li')
      .addClass('selected')
      .removeClass('unselected')
    // Also switch the +/- symbol style
    item.find('.open-close').addClass('icon-grey')
  }
  // For layer 1 li, go back
  if (item.hasClass('depth-one')) {
    return
  }
  // If all sibling elements including themselves are selected. The father has chosen
  if (
    item.parent().children('.selected').length ===
    item.parent().children().length
  ) {
    item
      .parent('ul')
      .parent('li')
      .removeClass('unselected')
      .addClass('selected')
    // Also switch the +/- symbol style
    item
      .parent('ul')
      .prev()
      .find('.open-close')
      .addClass('icon-grey')
  } else {
    // In other cases, the father does not choose:
    // If all sibling elements including themselves are not selected.
    // All sibling elements include optional and optional
    item
      .parent('ul')
      .parent('li')
      .removeClass('selected')
      .addClass('unselected')
    // Also switch the +/- symbol style
    item
      .parent('ul')
      .prev()
      .find('.open-close')
      .removeClass('icon-grey')
  }
  // If the user clicks on layer 2. Return;
  // The code that follows is executed when the user clicks on layer 3.
  if (item.hasClass('depth-two')) {
    return
  }
  // Since the second layer is likely to change, you will also need to change the style of the first layer
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

// traverse,Make unique marks for the areas on the first two floors.
// data-all = all/part
// The first/On the second floorliThe element,Each of these can have three states.
// 1.There is nodata-allattribute: saidchildren中全部There is no被选择
// 2.data-all==='all', childrenAll of them are selected
// 3.data-all==='part', childrenThe middle part is selected
let markSelectedArea = function() {
  // Start with the second layer.
  areaDOM.find('.body .area-left li.depth-two').each(function() {
    // Clear the previous data-all attribute, if any, before each start.
    $(this).removeAttr('data-all')

    let ul = $(this).children('ul')
    let children = ul.children()

    // Children is 0, look at their state
    if (children.length === 0) {
      if ($(this).hasClass('selected')) {
        // Tagged themselves
        $(this).attr('data-all', 'all')
      }
    } else {
      // Children is not 0. Look at the state of children
      // The children all
      if (ul.children('.selected').length === children.length) {
        $(this).attr('data-all', 'all')
      } else if (ul.children('.unselected').length === children.length) {
        // The children dont choose
        // Nothing
      } else {
        // Children partial selection
        $(this).attr('data-all', 'part')
      }
    }
  })
  // Treatment of the first layer
  areaDOM.find('.body .area-left li.depth-one').each(function() {
    // Clear the previous data-all attribute, if any, before each start.
    $(this).removeAttr('data-all')

    let ul = $(this).children('ul')
    let children = ul.children()

    // Children is 0, look at their state
    if (children.length === 0) {
      if ($(this).hasClass('selected')) {
        // Tagged themselves
        $(this).attr('data-all', 'all')
      }
    } else {
      // Children is not 0. Look at the state of children
      // The children all
      if (ul.children('[data-all=all]').length === children.length) {
        $(this).attr('data-all', 'all')
      } else if (ul.children('[data-all]').length === 0) {
        // Children does not have the data-all attribute
        // Nothing
      } else {
        // Children exist data-all===all or data-all===part or both
        $(this).attr('data-all', 'part')
      }
    }
  })
}

// According to the tag,selectivecloneDOM,Add to the right.
let addDomToRight = function() {
  // Iterate through the first layer li
  areaDOM.find('.body .area-left li.depth-one').each(function() {
    // If the data-all attribute does not currently exist for LI.
    if (!$(this).attr('data-all')) {
      return
    }

    // The right side, the DOM
    let right = $(this)
      .closest('.area-left')
      .siblings('.area-right')
      .children('ul')

    if ($(this).attr('data-all') === 'all') {
      // Unstyle and click events
      $(this).removeClass('selected')
      $(this)
        .find('li')
        .removeClass('selected')
      // Unstyle the icon white
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
        // If you pick them all and the right hand side doesnt exist.
        right.append($(this))
      } else {
        // If you choose all of them and the right hand side exists
        // Iterate through the second layer and insert it to the right under the ul of the corresponding first layer
        $(this)
          .find('li.depth-two')
          .each(function() {
            depthOneDOM.children('ul').append($(this))
          })
        // After the traversal is complete, delete the current LI;
        $(this).remove()
      }
      return
    }

    // If all is selected and the right hand side already exists the current li or part is selected
    if ($(this).attr('data-all') === 'part') {
      // Clone the specific Li of the first layer
      let liCloned = $(this).clone(true)
      // Handle LIs DOM separately;
      dealLiDOM($(this), liCloned)

      // Unstyle ICONS
      liCloned.find('.open-close').removeClass('icon-grey')

      // Cannot simply be added to the right
      // right.append(liCloned);
      // Add the cloned ones to the right.
      appendOperation(right, liCloned)
    }
  })
  // Displays the selected data on the right
  $(".area-right").find("li").each(function(){
    $(this).css("display", "block")
  })
}

// Depending on the source,Each handle(Delete those you dont needDOM)litheDOM.(The first layer)
let dealLiDOM = function(li, li_cloned) {
  // The source of li
  // Iterate through the second layer li
  li
    .children('ul')
    .children('li')
    .each(function() {
      if ($(this).attr('data-all') === 'all') {
        // Source li deleted
        $(this).remove()
        return
      }
      // Iterate through the third layer li
      $(this)
        .find('li')
        .each(function() {
          if ($(this).hasClass('selected')) {
            $(this).remove()
          }
        })
    })

  // Cloning of li
  // Iterate through the second layer li
  li_cloned
    .children('ul')
    .children('li')
    .each(function() {
      // There is no data-all attribute
      if (!$(this).attr('data-all')) {
        // Clone LI delete
        $(this).remove()
        return
      }
      // Delete the click event (parent, self, child).
      $(this)
        .closest('ul')
        .prev()
        .off('click')
      $(this)
        .find('div')
        .off('click') // Including itself andchildren
      // Remove the class
      $(this).removeClass('selected')
      $(this)
        .find('li')
        .removeClass('selected')

      // Iterate through the third layer li
      $(this)
        .find('li')
        .each(function() {
          if ($(this).hasClass('unselected')) {
            $(this).remove()
          }
        })
    })
}

// theDOMAdd to the area on the right.
// If it already exists,The merger.
// theLiDOM: The first layer of cloned monkeys is specificLi
let appendOperation = function(rightDOM, theLiDOM) {
  // If the current Li is not found in the first layer of DOM on the right.
  // According to the zip code
  let depthOneDOM = rightDOM.find(
    '.depth-one[region-id=' + theLiDOM.attr('region-id') + ']'
  )
  if (depthOneDOM.length === 0) {
    // Added directly
    rightDOM.append(theLiDOM)
    return
  }

  // Currently Li exists in the first layer of DOM on the right.
  // The first layer liDOM on the right: depthOneDOM
  // Iterate through the second layer of the current LI, and then determine
  theLiDOM.find('li.depth-two').each(function() {
    let depthTwoDOM = depthOneDOM.find(
      '.depth-two[region-id=' + $(this).attr('region-id') + ']'
    )
    // If the current layer li does not exist on the right
    if (depthTwoDOM.length === 0) {
      // Added directly
      depthOneDOM.children('ul').append($(this))
      // End the current loop
      return
    }

    // If the second layer also exists on the right side of the first layer
    // Go through and determine the third layer
    $(this)
      .find('li.depth-three')
      .each(function() {
        let depthThreeDOM = depthTwoDOM.find(
          '.depth-three[region-id=' + $(this).attr('region-id') + ']'
        )
        // If the current tier 3 Li does not exist on the right
        if (depthThreeDOM.length === 0) {
          // add
          depthTwoDOM.children('ul').append($(this))
        }

        // If there is, do nothing.
      })
  })
}

// The region to be deleted is reproduced in the corresponding position on the left
let appearanceAtLeft = function(which) {
  // On the left side of the DOM
  let leftDOM = which
    .closest('.area-right')
    .siblings('.area-left')
    .children('ul')
  // The user is clicking on the first layer
  if (which.hasClass('depth-one')) {
    let leftParentOne = leftDOM.find(
      '.depth-one[region-id=' + which.attr('region-id') + ']'
    )
    // The li does not exist on the left
    if (leftParentOne.length === 0) {
      // Bind back to the click event
      which.find('div').each(function() {
        bindClickListener($(this))
      })
      // Transformation style
      toggleSelectedStyle(which)
      // Added directly
      leftDOM.prepend(which)
      // ------------------
      // PS: About data restoration. You can use ATTr to set the order when rendering data. Every time theres a change, its sorted.
      // ------------------
    } else {
      // The first layer exists on the left
      // Traversal determines the second layer
      which.find('li.depth-two').each(function() {
        let leftParentTwo = leftParentOne.find(
          '.depth-two[region-id=' + $(this).attr('region-id') + ']'
        )
        // The current second layer of DOM does not exist at the corresponding position on the left
        if (leftParentTwo.length === 0) {
          // Bind back to the click event
          $(this)
            .find('div')
            .each(function() {
              bindClickListener($(this))
              // Transformation style
              toggleSelectedStyle($(this).closest('li'))
            })
          leftParentOne.children('ul').prepend($(this))
        } else {
          // The current second layer exists at the corresponding position on the left
          // Iterate through the third layer
          $(this)
            .find('li.depth-three')
            .each(function() {
              // The third layer doesnt exist on the left
              if (
                leftParentTwo.find(
                  '.depth-three[region-id=' + $(this).attr('region-id') + ']'
                ).length === 0
              ) {
                // Bind back to the click event
                let cloneLi = $(this).clone(true)
                cloneLi.find('div').each(function() {
                  bindClickListener($(this))
                  // Transformation style
                  toggleSelectedStyle($(this).closest('li'))
                })
                leftParentTwo.children('ul').prepend(cloneLi)
              }
              // Existence ignores
            })
        }
      })
      // Remove the remaining first layer of DOM.
      which.remove()
    }
  } else if (which.hasClass('depth-two')) {
    // The user clicks on the second layer
    // Get the parent, the first layer of DOM
    let parentDepthOne = which.closest('li.depth-one')
    // On the left, look for the first layer of the DOM for the current element
    let leftParentOne = leftDOM.find(
      '.depth-one[region-id=' + parentDepthOne.attr('region-id') + ']'
    )
    // If the first parent layer does not exist on the left
    if (leftParentOne.length === 0) {
      // Under the first cloned
      let cloneParent = parentDepthOne.clone(true)
      // Empty all children of the parent first-layer DOM, adding only the current second-layer DOM
      cloneParent
        .children('ul')
        .empty()
        .prepend(which)
      // Bind back to the click event
      cloneParent.find('div').each(function() {
        bindClickListener($(this))
      })
      // Transformation style
      toggleSelectedStyle(cloneParent)
      // Add the parent layer 1
      leftDOM.prepend(cloneParent)
      return
    }
    // The first layer exists on the left;

    let leftDepthTwo = leftParentOne.find(
      '.depth-two[region-id=' + which.attr('region-id') + ']'
    )
    // The current second layer does not exist on the left
    if (leftDepthTwo.length === 0) {
      let whichCloned = which.clone(true)
      // Bind back to the click event
      whichCloned.find('div').each(function() {
        bindClickListener($(this))
        // Transformation style
        toggleSelectedStyle($(this).closest('li'))
      })
      // Added directly
      leftParentOne.children('ul').prepend(whichCloned)
    } else {
      // If the current layer exists on the left
      // Go through the third layer, judge
      which.find('li.depth-three').each(function() {
        // The current third layer does not exist on the left
        if (
          leftDepthTwo.find(
            '.depth-three[region-id=' + $(this).attr('region-id') + ']'
          ).length === 0
        ) {
          // Bind back to the click event
          $(this)
            .find('div')
            .each(function() {
              bindClickListener($(this))
              // Transformation style
              toggleSelectedStyle($(this).closest('li'))
            })
          // Added directly
          leftDepthTwo.children('ul').prepend($(this))
        }
      })
    }

    // If the parent first-tier node has no nodes. delete
    if (which.siblings().length === 0) {
      which.closest('li.depth-one').remove()
    } else {
      // Delete the remaining second layer of DOM
      which.remove()
    }
  } else {
    // The user is clicking on layer 3
    // Gets the parent, the second layer DOM, and the first layer DOM
    let parentDepthTwo = which.closest('li.depth-two')
    let parentDepthOne = which.closest('li.depth-one')

    // The parent layer 1, the parent layer 2 DOM, the corresponding DOM on the left
    let leftParentOne = leftDOM.find(
      '.depth-one[region-id=' + parentDepthOne.attr('region-id') + ']'
    )
    let leftParentTwo = leftDOM.find(
      '.depth-two[region-id=' + parentDepthTwo.attr('region-id') + ']'
    )

    // If the first parent layer does not exist on the left
    if (leftParentOne.length === 0) {
      // Clone the Parent data
      let cloneParentDepthTwo = parentDepthTwo.clone(true)
      let cloneParentDepthOne = parentDepthOne.clone(true)

      // Empty the DOM, only the current DOM subclass
      cloneParentDepthTwo
        .children('ul')
        .empty()
        .prepend(which)
      cloneParentDepthOne
        .children('ul')
        .empty()
        .prepend(cloneParentDepthTwo)
      // Bind back to the click event
      cloneParentDepthOne.find('div').each(function() {
        bindClickListener($(this))
      })
      // Transformation style
      toggleSelectedStyle(cloneParentDepthOne)
      leftDOM.prepend(cloneParentDepthOne)

      // If the current third-tier DOM has no brothers, remove the current third-tier DOMs parent li
      if (which.siblings().length === 0) {
        parentDepthTwo.remove()
      }
      // After removal, if there are no children under the first layer of the DOM, remove.
      if (parentDepthOne.find('li.depth-two').length === 0) {
        parentDepthOne.remove()
      }
    } else if (leftParentTwo.length === 0) {
      // If the first parent layer exists on the left, but the second parent layer does not

      // Clone the second layer of DOM and remove the unwanted DOM, only the current third layer of DOM
      let cloneParentDepthTwo = parentDepthTwo.clone(true)
      cloneParentDepthTwo
        .children('ul')
        .empty()
        .prepend(which)
      // Bind back to the click event
      cloneParentDepthTwo.find('div').each(function() {
        bindClickListener($(this))
      })
      // Transformation style
      toggleSelectedStyle(cloneParentDepthTwo)
      // Add to the left corresponding to the first layer
      leftParentOne.children('ul').prepend(cloneParentDepthTwo)

      // After removal, if there is no child data under the parent second layer of the DOM, remove itself
      if (parentDepthTwo.find('li.depth-three').length === 0) {
        parentDepthTwo.remove()
      }
      // After removal, if there are no children under the first layer of the DOM, remove.
      if (parentDepthOne.find('li.depth-two').length === 0) {
        parentDepthOne.remove()
      }
    } else {
      // If the first parent layer exists on the left, the second parent layer also exists

      // Bind back to the click event
      which.find('div').each(function() {
        bindClickListener($(this))
      })
      // Transformation style
      toggleSelectedStyle(which)
      // If the first parent layer exists on the left, the second parent layer also exists
      // Add directly to the corresponding location.
      leftParentTwo.children('ul').prepend(which)

      // Determine if there are any other child elements; if not, delete the parent second layer of the DOM
      if (parentDepthTwo.find('li').length === 0) {
        parentDepthTwo.remove()
      }
      // Determine if you want to delete the first layer of DOM
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

// Traversal gets the data for the selected region.
let getJSON = function() {
  let dataArray = []
  // Solve all elected provincial level
  // Traverse the provinces
  areaDOM.find('.area-right li.depth-one').each(function() {
    let provinceID = Number($(this).attr('region-id'))
    // If the province does not exist on the left, add the province and all the cities and counties below.
    if (areaDOM.find('.area-left li.depth-one[region-id=' + provinceID + ']').length === 0) {
      // From the source, add the lower market/county data one by one
      areaData.forEach(function(province) {
        // Find specific provinces
        if (province.id !== provinceID) {
          return
        }
        // Start by adding the current province
        dataArray.push(cloneData(province))

        if (!province.children || province.children.length === 0) {
          // Out of the loop
          return
        }

        province.children.forEach(function(city) {
          dataArray.push(cloneData(city))

          // Iterate over the county level data, adding in one by one.
          if (!city.children || city.children.length === 0) {
            // Out of the loop
            return
          }
          city.children.forEach(function(county) {
            dataArray.push(cloneData(county))
          })
        })
      })

      // Remove the current provincial DOM, which affects the following
      $(this).remove()
    }
  })
  // Traverse city
  areaDOM.find('.area-right li.depth-two').each(function() {
    let cityID = Number($(this).attr('region-id'))
    // If there is no corresponding city on the left hand side, all cities have been selected
    // Add in all the county level data
    if (areaDOM.find('.area-left li.depth-two[region-id=' + cityID + ']').length === 0) {
      let provinceID = Number($(this).closest('li.depth-one').attr('region-id'))
      // From the source data, add the county data
      areaData.forEach(function(province) {
        // Find specific provinces
        if (province.id !== provinceID) {
          return
        }
        if (!province.children || province.children.length === 0) {
          // Out of the loop
          return
        }

        province.children.forEach(function(city) {
          if (city.id !== cityID) {
            // Not corresponding market, out of the current cycle
            return
          }
          dataArray.push(cloneData(city))
          // No county level data
          if (!city.children || city.children.length === 0) {
            // Out of the loop
            return
          }
          // Iterate through the county level data.
          city.children.forEach(function(county) {
            dataArray.push(cloneData(county))
          })
        })
      })
      // Remove the current municipal DOM, the province affects the latter
      $(this).remove()
    }
  })
  // Traverse the county
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

      // Traverse city,
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

// Working with default data
let startDefault = function(sourceData) {
  if (!sourceData) {
    return
  }
  // The source data is divided into three parts, level 1, Level 2 and Level 3
  // Where level 1 and 2 leave only id
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
        * To deal withlevel 3 data, 增加第一层data的id
        * namelyp_p_regions_id
        * Then, if the parent region is all selected is detected, Delete the relevant layer 3 data.
        */
  let dealLevelThreeData = function(completeData, data, levelTwoData) {
    let levelTwoArray = levelTwoData.map(function(tempObj) {
      return tempObj.id
    })

    return data.filter(function(tempObj) {
      // If the parent ID of the Level 3 data is in the Level 2 data, the user must have selected all the Level 2 loci.
      // Because the user selects only the Level 3 locale, he will not get his Parent locale data.
      // Only if you select all will you get the Parent locale and all children locale data.
      if (levelTwoArray.indexOf(tempObj.parent_id) >= 0) {
        // There are
        return false
      }

      let ok = false
      completeData.forEach(function(levelOne) {
        if (!levelOne.children || levelOne.children.length === 0) {
          return
        }

        levelOne.children.forEach(function(levelTwo) {
          // Find the parent data for tier 3 data
          if (levelTwo.id === tempObj.parent_id) {
            // Adds a property to the current third layer. Connect directly to the first layer.
            tempObj.p_p_regions_id = levelOne.id
            ok = true
          }
        })
      })

      return ok
    })
  }

  /*
         * To deal withlevel 2 data,
         * If all of the parent regions are detected, Delete the relevant layer 2 data.
         */
  let dealLevelTwoData = function(completeData, levelTwo, levelOne) {
    return levelTwo.filter(function(tempObj) {
      // With dealLevelThreeData similarly
      // Parent detected is full selected.
      // Drop this level 2 data.
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
      // Iterate through the initialization provinces
      dividedData[0].forEach(function(provinceID) {
        areaDOM
          .find('.area-left li.depth-one[region-id=' + provinceID + '] > div')
          .click()
      })
      // Traverse the initialization city
      dividedData[1].forEach(function(city) {
        // Find the specific province/city
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
      // Iterate over the initialization county
      dividedData[2].forEach(function(county) {
        // Find the specific province/city/county
        let provinceDOM = areaDOM.find(
          '.area-left li.depth-one[region-id=' + county.p_p_regions_id + ']'
        )
        // If municipal data does not exist, the + has not been clicked
        if (provinceDOM.find('li.depth-two').length === 0) {
          provinceDOM
            .children('div')
            .find('.open-close')
            .click()
        }
        let cityDOM = provinceDOM.find(
          'li.depth-two[region-id=' + county.parent_id + ']'
        )
        // If county level data does not exist, the + has not been clicked
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
      // Program click the Add button
      areaDOM.find('.body > button').click()
    }
  }, 500)
}
export default {
  show: function(options) {
    // Assigns a callback function to a global variable
    confirmCallback = options.confirm
    hideDialogFunc = options.callHideDialog
    // If the selector already exists, it is not displayed
    areaDOM.css('display', 'block')
    $('.cover').css('display', 'block')
    if ($('.area-container').length === 1) {
      // If the selector is not called the first time
      // Empty the existing data and reload the render
      $('.area-container .area-left > ul').empty()
      $('.area-container .area-right > ul').empty()
    } else {
      $('body').append(areaDOM)
      // It needs to be executed before the data is rendered.
      bindEventListener()
      // Set the height of the cover mask layer to be the height of the body
      $('.cover').css('height', document.documentElement.clientHeight)
    }
    areaDOM.find('#chooseAll').text('Select all')
    requestAndFirstRenderData(options.api, options.isfilter = true, options.filterData)
    startDefault(options.defaultData)
  }
}
// ---------------------------------------END-------------------------------------------
