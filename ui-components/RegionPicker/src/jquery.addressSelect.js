/**
 * Created by Andste on 2016/8/8.
 * version 1.0.5
 */

import axios from 'axios'

(function ($, window, document, undefined) {
  var addressSelect = function (ele, opts) {
    this.$element = ele;
    // Global node
    this.node = {};

    // Global locale node variable
    this.region_li = '';

    // Global title node variable
    this.titleView = '';

    // Global locale ID
    this.regions = {};

    // Initialize the default locale array
    this.defaultArray = [];

    // Initialize the default locale index
    this.index = 0;

    this.defaults = {
      'api': 'system/regions/parent/',
      'deData': null,
      'debug': false,
      'quick': false,
      'setInput': false,
      'names': {
        province: 'province',
        city: 'city',
        region: 'region',
        town: 'town'
      }
    };
    this.options = $.extend({}, this.defaults, opts);
  };

  addressSelect.prototype = {
    // Initialization method
    init: function () {
      // Creating CSS styles
      $('#addressSelectCss').length === 0 && this.createStyles();

      // Initialize the element
      this.initElement();
    },

    // Initialize the event binding
    initEvent: function () {
      var _this = this;
      // Initialize show and hide events
      _this.initShowHide();

      // Initializes the binding close event
      _this.appClose();

      // Initializes the TAB selection event
      _this.selectTab();

      // Initialize a level 1 region
      if (_this.options.deData && _this.options.deData[0]) {
        // Have default values
        _this.hasDefault();
      } else {
        // No default value
        _this.accessApi();
      }

      // Initializes the locale selection event
      _this.selectRegion();

      // Initializes the mouseover event for the region
      _this.curRegion();

      // Initialize the display view box width
      _this.node.app.css({
        width: parseInt(this.node.appTitleView.css('fontSize')) * this.node.appTitleView.html().length
      });

      _this.node.appBody.on('mouseenter', '#app_address_prompt', function (e) {
        e.stopPropagation();
        e.preventDefault();
      });
    },

    /* Event processing area
     ============================================================================ */
    // Initialize binding to show and hide events
    initShowHide: function () {
      var _this = this,
          node  = _this.node;
      node.app.on('mouseenter', function () {
        _this.showApp();
      });

      // Mouse over control hide locale selection form
      node.app.on('mouseleave', function () {
        _this.hideApp();
      });
    },

    // Initializes the binding close event
    appClose: function () {
      var _this = this;
      _this.node.appClose.on('click', function () {
        _this.hideApp();
      });
    },

    // Initialize the binding to select the TAB event
    selectTab: function () {
      var _this = this;
      $(_this.node.appTab).on('click', '.app-address-tab-a', function () {
        _this.selectedTab($(this));
      });
    },

    // Initializes the locale selection event
    selectRegion: function () {
      var _this = this;
      var node = _this.node;
      node.appContent.on('click', '.app-address-area-a', function () {
        var $this        = $(this),
            region_id    = $this.attr('region_id'),
            region_grade = $this.attr('region_grade'),
            local_name   = $this.attr('local_title');

        // Calculates the index of the box where the current A tag is located
        var _index = $this.closest('.app-address-area').index();

        // Obtain the A TAB of the corresponding index based on the index and change the content
        node.appBody.find('.app-address-tab-a').eq(_index).find('em').html(local_name);
        node.appBody.find('.app-address-tab-a').eq(_index).nextAll().find('em').html('Please select');

        _this.setNameTag(region_grade, region_id, local_name);

        // Remove the following element
        _this.removeElement(_index);

        if (_this.options.debug) {
          console.log('index:' + _index + ' local_name:' + local_name);
        }

        node.app.off('mouseleave');

        node.app.on('mouseover', function () {
          node.app.on('mouseleave', function () {
            _this.hideApp();
          });
        });

        // Adjust the body width according to the word count
        _this.wordCount(_index);

        if (Number(region_grade) === 4) {
          _this.complete();
        } else {
          // Call the API to get the data
          _this.accessApi(region_id, region_grade);
        }
      });
    },

    // Initializes the mouseover event for the region
    curRegion: function () {
      var _this = this;
      var node = _this.node;
      node.appContent.on('mouseenter', '.app-address-area-a', function () {
        var $this = $(this);
        var title = $this.attr('local_title');
        if (title.length > 8) {
          var top      = ($this.position().top - 28),
              left     = $this.position().left,
              fontSize = parseInt($this.css('fontSize'));
          if (node.appContent.find('#app_address_prompt').length === 0) {
            var _html = '<div id="app_address_prompt"'
              + 'style="top: ' + (top - 5) + 'px; left: ' + left + 'px;'
              + '">'
              + title
              + '</div>';

            $(_html).appendTo(node.appContent);
            node.appContent.find('#app_address_prompt').css({
              left: left - (fontSize * title.length + 14 - $('#app_address_prompt')[0].offsetWidth)
            });
            setTimeout(function () {
              node.appContent.find('#app_address_prompt').css({
                opacity: 1,
                top: top
              });
            }, 200);
          }
        }
      });

      node.appContent.on('mouseleave', '.app-address-area-a', function () {
        node.appContent.find('#app_address_prompt').remove();
        $(this).parent().css({width: ''});
      });
    },

    // Initialize the default locale
    hasDefault: function () {
      var _this = this;
      _this.defaultArray.push({re_id: 0, index: 0});
      for (var i = 0; i < _this.options.deData.length; i++) {
        var _deData = _this.options.deData[i];
        if (_deData && _deData !== -1) {
          var _index = parseInt(i) + 1;
          _this.defaultArray.push({re_id: _this.options.deData[i], index: _index});
        }
      }

      if (_this.options.debug) {
        console.log(this.defaultArray);
      }

      // Create TAB, APP forms
      _this.createDeElement();
      _this.accessApi(_this.defaultArray[_this.index].re_id);
    },

    // Initializes the creation of the default element locale
    createDeElement: function () {
      var _this = this;
      for (var i = 0, len = _this.defaultArray.length - 2; i < len; i++) {
        if (_this.defaultArray[i]) {
          _this.createElement();
        }
      }
    },


    /* Logical implementation area
     ============================================================================ */
    // According to the APP
    showApp: function () {
      var node = this.node;
      node.appTitle.addClass('hover');
      node.appBody.addClass('show');
    },

    // Hide the APP
    hideApp: function () {
      var node = this.node;
      node.appTitle.removeClass('hover');
      node.appBody.removeClass('show');
    },

    // TAB check processing
    selectedTab: function ($this) {
      var index = $this.index();
      $this.addClass('cur')
           .siblings()
           .removeClass('cur')
           .find('i').removeClass('cur');
      $this.find('i').addClass('cur');

      // The region view shows the logic
      this.node.appBody.find('.app-address-area').eq(index).addClass('show')
          .siblings().removeClass('show');
    },

    // Create TAB and region boxes
    createElement: function () {
      var node = this.node;
      // Create a TAB
      var tabA = '<a href="javascript: void(0);" class="app-address-tab-a show"> <em>Please select</em> <i style="padding: 0;"></i> </a>';

      $(tabA).appendTo(node.appTab);

      // Creating a Region View
      var list = '<div class="app-address-area"><ul class="app-address-area-list"></ul></div>';
      $(list).appendTo(node.appContent);
    },

    // Remove the node after TAB +1 is selected
    removeElement: function (index) {
      this.node.appBody.find('.app-address-tab-a').eq(index).nextAll().remove();
      this.node.appBody.find('.app-address-area').eq(index).nextAll().remove();
    },

    // Processing logic, API return data
    useApi: function (res, region_grade) {
      if (!res) return;
      var _this = this;
      var result = res,
          lenght = result.length;

      // finished
      if (lenght === 0) {
        _this.complete();
        return;
      }

      // Walk through the data organization structure
      for (var i = 0, len = result.length; i < len; i++) {
        var local_title = result[i]['local_name'],
            local_name  = local_title.substring(0, 8);
        _this.region_li += '<li><a href="javascript: void(0);" class="app-address-area-a" local_title="' + local_title + '" region_id="' + result[i].id + '" region_grade="' + result[i]['region_grade'] + '">' + local_name + '</a> </li>';
      }
      if (region_grade !== 0 && _this.node.app.find('.app-address-tab-a').eq(region_grade).length === 0) {
        _this.createElement();
      }
      _this.complyApi(region_grade);
      if (_this.options.quick === true && lenght === 1) {
        var r_id    = result[0].id,
            r_grade = result[0]['region_grade'],
            l_name  = result[0]['local_name'];
        _this.accessApi(r_id, r_grade);
        _this.setNameTag(r_grade, r_id, l_name);
        _this.node.appBody.find('.app-address-tab-a').eq(r_grade - 1).find('em').html(l_name);
      }
    },

    // API logic processing method implementation
    complyApi: function (index) {
      var _this = this;
      _this.node.appBody.find('.app-address-tab-a').eq(index).addClass('show cur').siblings().removeClass('cur').find('i').removeClass('cur');
      _this.node.appBody.find('.app-address-tab-a').eq(index).find('i').addClass('cur');
      var area = _this.node.appBody.find('.app-address-area').eq(index);
      area.find('ul').html(_this.region_li);
      area.addClass('show').siblings().removeClass('show');
      _this.region_li = '';
    },

    // Choose to complete
    complete: function () {
      var _this = this;
      var node       = _this.node,
          appTabA    = node.appBody.find('.app-address-tab-a'),
          appTabALen = appTabA.length;
      _this.titleView = '';
      for (var i = 0; i < appTabALen; i++) {
        _this.titleView += appTabA.eq(i).find('em').html();
      }
      var titleLen = _this.titleView.length,
          fontSize = parseInt(node.appTitleView.css('fontSize'));
      node.app.css({
        width: fontSize * titleLen + 30
      });
      var regionData = {};
      regionData['string'] = _this.titleView;
      regionData['regions'] = _this.regions;
      regionData['last_id'] = _this.regions.town_id || _this.regions.region_id || _this.regions.city_id || _this.regions.province_id;
      var _callback = _this.options.callback;
      _callback && typeof(_callback) === 'function' && _callback(regionData);
      node.appTitleView.html(_this.titleView);
      _this.hideApp();
    },

    // Set the body width based on the total TAB word count
    wordCount: function (index) {
      var node = this.node;
      if (index > 1) {
        var appTabA  = node.appBody.find('.app-address-tab-a'),
            fontSize = parseInt(node.appTitleView.css('fontSize')),
            _html    = '';
        for (var i = 0, _len = appTabA.length; i < _len; i++) {
          _html += appTabA.eq(i).find('em').html();
        }

        var len   = _html.length,
            width = fontSize * (len + 3) + 150;
        if (width < 460) {
          width = 460;
        }

        len > 20 ? node.appBody.css({width: width}) : node.appBody.css({width: ''});
      } else {
        node.appBody.css({width: ''});
      }
    },

    // Dynamically set the name tag
    setNameTag: function (region_grade, region_id, local_name) {
      var _this = this;
      var names = this.options.names;
      var _ele = this.$element;
      switch (parseInt(region_grade)) {
        case 1:
          _ele.find("input[name=" + names.province + "]").val(local_name);
          _ele.find("input[name=" + names.province + "_id]").val(region_id).nextAll().val('');
          _this.regions['province'] = local_name;
          _this.regions['province_id'] = region_id;
          break;
        case 2:
          _ele.find("input[name=" + names.city + "]").val(local_name);
          _ele.find("input[name=" + names.city + "_id]").val(region_id).nextAll().val('');
          _this.regions['city'] = local_name;
          _this.regions['city_id'] = region_id;
          _this.regions['region'] = undefined;
          _this.regions['region_id'] = undefined;
          _this.regions['town'] = undefined;
          _this.regions['town_id'] = undefined;
          break;
        case 3:
          _ele.find("input[name=" + names.region + "]").val(local_name);
          _ele.find("input[name=" + names.region + "_id]").val(region_id).nextAll().val('');
          _this.regions['region'] = local_name;
          _this.regions['region_id'] = region_id;
          _this.regions['town'] = undefined;
          _this.regions['town_id'] = undefined;
          break;
        case 4:
          _ele.find("input[name=" + names.town + "]").val(local_name);
          _ele.find("input[name=" + names.town + "_id]").val(region_id).nextAll().val('');
          _this.regions['town'] = local_name;
          _this.regions['town_id'] = region_id;
          break;
      }
    },

    // Default locale use
    complyDeApi: function (res) {
      var _this = this;
      var node = _this.node;
      var result      = res,
          _local_name = '';

      // Walk through the data organization structure
      for (var i = 0, len = result.length; i < len; i++) {
        var region_id   = result[i]['id'],
            local_title = result[i]['local_name'],
            local_name  = local_title.substring(0, 8);
        _this.region_li += '<li><a href="javascript: void(0);" class="app-address-area-a" local_title="' + local_title + '" region_id="' + region_id + '" region_grade="' + result[i]['region_grade'] + '">' + local_name + '</a> </li>';
        if (region_id === _this.defaultArray[_this.index + 1].re_id) {
          _local_name = local_title;
          _this.titleView += _local_name;
          _this.node.appTab.find('a').eq(_this.index).find('em').html(_local_name);
        }
      }
      node.appBody.find('.app-address-area').eq(_this.index).find('ul').html(_this.region_li);
      _this.region_li = '';
      _this.index++;
      if (_this.index === _this.defaultArray.length - 1) {
        node.appBody.find('.app-address-tab-a').eq(_this.defaultArray.length - 2).addClass('cur').find('i').addClass('cur');
        node.appBody.find('.app-address-tab-a').eq(0).find('i').removeClass('cur');
        node.appBody.find('.app-address-area').eq(_this.defaultArray.length - 2).addClass('show');
        this.setNameTag(_this.index, _this.defaultArray[_this.index].re_id, _local_name);
        _this.defaultArray = []
        _this.wordCount();
        _this.complete();
      } else {
        _this.accessApi(_this.defaultArray[_this.index].re_id);
      }

      // Set the default TAB
      _this.defaultArray[0] && this.setNameTag(_this.index, _this.defaultArray[_this.index].re_id, _local_name);
    },

    /* Interface access area
     ============================================================================ */
    accessApi: function (region_id, region_grade) {
      var _this = this;
      var _region_id = region_id || 0;
      var _region_grade = region_grade || 0;
      axios.get(_this.options.api.replace("@id", _region_id)).then(function (response) {
        response.status === 200 && (function () {
          _this.defaultArray.length > 0
            ? _this.complyDeApi(response.data)
            : _this.useApi(response.data, _region_grade);
        })();
      });
    },

    /* Initial creationelement
     ============================================================================ */
    initElement: function () {
      var _this = this,
          ele   = this.$element;
      var names = _this.options.names;
      var province    = names.province ? '<input type="hidden" value="" name="' + names.province + '"/>' : '',
          province_id = names.province ? '<input type="hidden" value="" name="' + names.province + '_id"/>' : '',
          city        = names.city ? '<input type="hidden" value="" name="' + names.city + '"/>' : '',
          city_id     = names.city ? '<input type="hidden" value="" name="' + names.city + '_id"/>' : '',
          region      = names.region ? '<input type="hidden" value="" name="' + names.region + '"/>' : '',
          region_id   = names.region ? '<input type="hidden" value="" name="' + names.region + '_id"/>' : '',
          town        = names.town ? '<input type="hidden" value="" name="' + names.town + '">' : '',
          town_id     = names.town ? '<input type="hidden" value="" name="' + names.town + '_id">' : '';
      var inputs = _this.options.setInput ? province + province_id + city + city_id + region + region_id + town + town_id : '';
      var html = '<div class="app-address">'
        + '<div class="app-address-title">'
        + '<div class="app-address-title-view">-- Please select--</div><i style="padding: 0;"></i></div>'
        + '<div class="app-address-body">'
        + '<div class="app-address-tab">'
        + '<a href="javascript: void(0);" class="app-address-tab-a show"><em>Please select</em> <i class="cur" style="padding: 0;"></i></a></div>'
        + '<div class="app-address-content">'
        + '<div class="app-address-area">'
        + '<ul class="app-address-area-list"></ul>'
        + '</div>'
        + '</div>'
        + '<div class="app-address-close"></div>'
        + '</div>'
        + inputs
        + '</div>';
      ele.html(html);

      // The cache node
      this.node = {
        app: ele.find('.app-address'),
        appBody: ele.find('.app-address-body'),
        appTitle: ele.find('.app-address-title'),
        appTitleView: ele.find('.app-address-title-view'),
        appClose: ele.find('.app-address-close'),
        appTab: ele.find('.app-address-tab'),
        appContent: ele.find('.app-address-content')
      };

      // The binding event
      _this.initEvent();
    },

    /* Initial creationcssstyle
     ============================================================================ */
    createStyles: function () {
      var style = document.createElement('style'),
          head  = document.head || document.getElementsByTagName('head')[0];
      style.type = 'text/css';
      style.id = 'addressSelectCss';
      if (style.styleSheet) {
        var func = function () {
          try { //To preventIEIn thestylesheetAn error occurred when the quantity exceeded the limit
            style.styleSheet.cssText = styles;
          } catch (e) {

          }
        };
        if (style.styleSheet.disabled) {
          setTimeout(func, 10);
        } else {
          func();
        }
      } else {
        var textNode = document.createTextNode(styles);
        style.appendChild(textNode);
      }
      head.appendChild(style);
    }
  };

  $.fn.addressSelect = function (options) {
    var select = new addressSelect(this, options);
    return this.each(function () {
      select.init();
    });
  };

  var icon_area_arrow = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAYAgMAAADiyMeaAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAMUExURQAAADMxMmdoaH9/fyFf1mIAAAABdFJOUwBA5thmAAAAOElEQVQI12NgoB2YwHiAgUEAxAphdQASIJaoKAMDYyiIxQrks7oCxRkYA4DiIIKBAchVYSigoZsAhOwFPZU4L9cAAAAASUVORK5CYII=';
  var icon_area_arrow2 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAoBAMAAADAhv0DAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAeUExURfT09P////Pz8/b29pmZmczMzPf39/z8/Le3t93d3f3YaqwAAABTSURBVAjXYygvLy9gSEtLS2AwNjY2IEAQC5SUlBQIEIKCggLoRAsDSwODi4OLAwOLiwvQGCCDgYEFiBFKpgqKTmAIDQwNYBANDQWKhQYCCVFBAQDyaxW6UHn2KQAAAABJRU5ErkJggg==';
  var icon_area_close = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACZklEQVRYR81X0XXTQBDcqQDTQaggpgJCBawqwFSAqYCkApwKCBXcUgFJBcEVEDrAFSxv9E56Z+lOOoHfc+7LzzrdjmZ292YhC5aqqoi8E5ELEVkBWPN1d/8pIn9E5AmAhRC+1x6LuY2qymCfRUQBrOb2R0AEYyLyycz4u7gmAajqtYh8rA08jOLuDL4zs5sSgiwAVeWX/ugorvnqqT1Rorc5NkYAVJW6MngV3bXgIhsEwXzp1xGA+OW/Th28ixZBvEqZ6AGcmvYSM5TDzF53z1MA1wCY7cN1EBHSRkkuKynfx7KknC8yyXljZkxwaQHEUnvMUH9w96tON1XdAvgyk3AsvV08dw3gfggilaIDcAfgfebghxDCVfq/qm4AfM2BcPcPZnaXPmuahgDeZFj4ZmabFkDTNKzXHFVHenWH5EDkgsezKd9IOrJgZi/B9gogTCRNT2mJiVLwOcncvSGAEv19vIkAG24a0h71L0qVlOUtShplNBvpW2JtKk8G7zwQQFaj2iQb7lsQvL1FCcAra7vdVpKjlvZhrGcB4GwSiMj+/El49jI8eyOaasXUKITQGs+5+2BpKxaRQwhh9TwuI5oRAE+Fa7O3UXO9PfaJrZnddtdxwd7xmr+gM5o1JPHubg1JrUlN5gT6gZG3dPdjQ9Lpu6QtL+meg71HeTUypTkp/iPY8NXf7r7OmtLEbGRt1AlAMLhO2vIEBPWmlao1oXP49tFbjsa02dEMwDZn1+YixufMdo5mrQPOrZrhlFm8A8DJeOQbC+cyMIdTluS/D6eZDkgQ9JDteJ5I1M4BsfzuzYzBq9ZfJia0fP+I1aUAAAAASUVORK5CYII=';
  var styles = '.app-address {'
    + 'position: relative;'
    + 'min-width: 20%;'
    + 'height: 26px;'
    + 'font-size: 12px;'
    + 'z-index: 1000;}'
    + '.app-address i {'
    + 'font-style: normal;}'
    + '.app-address-title {'
    + 'position: relative;'
    + 'border: 1px solid #cccccc;'
    + 'background-color: #ffffff;'
    + 'padding: 0 20px 0 4px;'
    + 'height: 23px;'
    + 'line-height: 23px;}'
    + 'z-index: 1;'
    + 'line-height: 36px;}'
    + '.app-address-title-view {'
    + 'text-align: center;}'
    + '.app-address-title.hover {'
    + 'z-index: 1;'
    + 'height: 24px;'
    + 'border-bottom: none;}'
    + '.app-address-title i {'
    + 'display: block;'
    + 'position: absolute;'
    //+ 'top: 0;'
    + 'top: 50%;'
    + 'margin-top: -12px;'
    + 'right: 5px;'
    + 'width: 17px;'
    + 'height: 24px;'
    + 'background: url(' + icon_area_arrow + ') 0 0 no-repeat;'
    + '*background: url(//7xlo8o.com1.z0.glb.clouddn.com/area_arrow.png) 0 0 no-repeat;}'
    + '.app-address-body {'
    + 'display: none;'
    + 'width: 460px;'
    + 'min-height: 100px;'
    + 'float: left;'
    + 'position: absolute;'
    + 'top: 24px;'
    + 'left: -85px;'
    + 'border: 1px solid #CECBCE;'
    + 'padding: 15px;'
    + 'background: #fff;'
    + 'z-index: 2;'
    + '-moz-box-shadow: 0 0 5px #ddd;'
    + '-webkit-box-shadow: 0 0 5px #ddd;'
    + 'box-shadow: 0 0 5px #ddd;}'
    + '.app-address-body.show {'
    + 'display: block;}'
    + '.app-address-close {'
    + 'position: absolute;'
    + 'z-index: 2;'
    + 'top: -8px;'
    + 'right: -8px;'
    + 'width: 17px;'
    + 'height: 17px;'
    + 'background: url(' + icon_area_close + ') no-repeat center;'
    + 'background-size: 100%;'
    + '*background: url(//7xlo8o.com1.z0.glb.clouddn.com/area_close.png) 0 0 no-repeat;'
    + 'cursor: pointer;}'
    + '.app-address-tab {'
    + 'width: 100%;'
    + 'height: 25px;'
    + 'border-bottom: 2px solid #edd28b;'
    + 'overflow: visible;}'
    + '.app-address-tab a {'
    + 'display: none;'
    + 'position: relative;'
    + 'float: left;'
    + 'height: 23px;'
    + 'line-height: 23px;'
    + 'padding: 0 21px 1px 11px;'
    + 'margin-right: 3px;'
    + 'border: 1px solid #ddd;'
    + 'border-bottom: 0;'
    + 'color: #005AA0;'
    + 'text-align: center;'
    + 'cursor: pointer;'
    + 'overflow: hidden;'
    + 'white-space: nowrap;'
    + 'text-overflow: ellipsis;}'
    + '.app-address-tab-a em {'
    + 'font-style: normal}'
    + '.app-address-tab a.show {'
    + 'display: block;}'
    + '.app-address-tab a i {'
    + 'position: absolute;'
    + 'right: 4px;'
    + 'top: 10px;'
    + 'display: block;'
    + 'width: 7px;'
    + 'height: 5px;'
    + 'overflow: hidden;'
    + 'background: url(' + icon_area_arrow2 + ') 0 -35px no-repeat;}'
    + '*background: url(//7xlo8o.com1.z0.glb.clouddn.com/area_arrow2.png) 0 -35px no-repeat;}'
    + '.app-address-tab a i.cur {'
    + 'background-position: 0 -28px;}'
    + '.app-address-tab a.cur {'
    + 'height: 25px;'
    + 'background-color: #fff;'
    + 'border: 2px solid #edd28b;'
    + 'border-bottom: 0;'
    + 'padding: 0 20px 0 10px;'
    + 'line-height: 22px;'
    + 'text-decoration: none;'
    + 'color: #000;}'
    + '.app-address-content {'
    + 'position: relative'
    + '}'
    + '.app-address-area {'
    + 'display: none;'
    + 'overflow: hidden;}'
    + '.app-address-area.show {'
    + 'display: block;}'
    + '.app-address-area ul {'
    + 'margin-top: 10px;}'
    + '.app-address-area li {'
    + 'float: left;'
    + 'min-width: 95px;'
    + 'line-height: normal;'
    //+ 'height: 25px;'
    + 'padding: 0 0 0 5px;'
    + 'clear: none;'
    + 'overflow: hidden;'
    + '-webkit-user-select: none;'
    + '-moz-user-select: none;'
    + '-ms-user-select: none;'
    + 'user-select: none;}'
    + '.app-address-area ul li a {'
    + 'padding: 3px 7px;'
    + 'color: #005aa0;'
    + 'font-size: 12px;'
    + 'line-height: 25px;}'
    + '.app-address-area ul li a:hover {'
    + 'background: #005ea7;'
    + 'color: #fff;}'
    + '#app_address_prompt {'
    + 'position: absolute;'
    + 'z-index: 999999;'
    + 'padding: 3px 7px;'
    + 'line-height: normal;'
    + 'background-color: #005ea7;'
    + 'color: #ffffff;'
    + 'opacity: 0;'
    + '-webkit-transition: opacity .3s ease-out;'
    + '-moz-transition: opacity .3s ease-out;'
    + '-ms-transition: opacity .3s ease-out;'
    + '-o-transition: opacity .3s ease-out;'
    + 'transition: opacity .3s ease-out;}';
})(jQuery, window, document);
