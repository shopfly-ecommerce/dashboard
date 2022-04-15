<template>
  <div class="message-item" :class="{self: message['is_self']}">
    <p class="name-message">{{ user.name }}</p>
    <div class="wrapper-message">
      <div class="head-message" :style="{backgroundImage: `url(${user.face})`}"/>
      <div class="body-message">
        <div class="text-message">
          <div v-if="message.type === 'ORDER' || message.type === 'GOODS'" class="order-message">
            <div v-if="message.type === 'ORDER'" class="top-order">
              <span style="color: #5a606b">The order number：{{ message['order_sn'] }}</span>
              <span style="color: #a1a6af">{{ unixToDate(message['create_time'], 'yyyy-MM-dd hh:mm') }}</span>
            </div>
            <div class="inner-order" :class="message.type" @click="clickMessage(message)">
              <div class="image-order-message">
                <img :src="message['goods_image']" alt="">
              </div>
              <div class="info-order-message">
                <div class="goods-name">
                  <p>{{ message['goods_name'] }}</p>
                </div>
                <div class="label normal"></div>
                <div class="info-order-box">
                  <span class="price">¥{{ message['order_price'] || message['goods_price'] }}</span>
                </div>
              </div>
              <div class="tag-order-message">{{ message.type === 'ORDER' ? 'The order' : 'product' }}</div>
            </div>
          </div>
          <div v-else class="content-message" :class="message.type">
            <p v-if="message.type === 'TEXT'" ref="pre" class="message-pre"></p>
            <img v-else-if="message.type === 'IMAGES'" :src="message.url" alt class="message-image" @click="previewImage(message)" />
            <video v-else-if="message.type === 'VIDEO'" :src="message.url" controls="controls" class="message-video" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatMessageItem',
  props: {
    message: {
      type: Object,
      required: true
    },
    getEmojiPath: {
      type: Function,
      required: true
    },
    sender: {
      type: Object,
      required: true
    },
    receiver: {
      type: [Object, String],
      required: true
    },
    clickMessage: {
      type: Function,
      required: false
    },
    unixToDate: {
      type: Function,
      required: false
    },
    previewImage: {
      type: Function,
      required: true
    }
  },
  mounted() {
    const { type, text } = this.message
    if (type === 'TEXT') {
      const $pre = this.$refs['pre']
      $pre.innerHTML = text
      $pre.querySelectorAll('.emoji-img').forEach(item => (item.src = this.getEmojiPath(item.alt)))
    }
  },
  computed: {
    user() {
      const { sender, receiver } = this
      const self = this.message['is_self']
      return {
        name: self ? sender.name : receiver.name,
        face: self ? sender.face : receiver.face
      }
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.message-item {
  margin-bottom: 20px;
  clear: both;
  overflow: hidden;
  &.self {
    .name-message {
      text-align: right;
    }
    .head-message {
      float: right;
      margin-left: 10px;
      margin-right: 0;
    }
    .text-message {
      float: right;
    }
    .content-message {
      margin-right: 5px;
      padding-right: 17px;
      padding-left: 9px;
      background-color: #d0e9ff;
      &:after {
        left: auto;
        right: -6px;
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAqCAYAAABYzsDTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzI0QTVCMUUxNjBBMTFFODlGQzlDRDUzQTg4RDcxQzMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzI0QTVCMUYxNjBBMTFFODlGQzlDRDUzQTg4RDcxQzMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMjRBNUIxQzE2MEExMUU4OUZDOUNENTNBODhENzFDMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMjRBNUIxRDE2MEExMUU4OUZDOUNENTNBODhENzFDMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqBcZigAAAD0SURBVHjaYrzw8j8DEMgAcRcQOwCxJANh8ByIDwBxmb4YwxNcihiBhoMMvgjEQgykg3dArI/LAiaoi8kxmAGqrwuXJBM0KCgBDvgMl6TQcEl8htMMjBo+RA2/+IpBi5YuPw20IIFWhnMB8XygBQuAmItWYR4P9YUWrOD6T4O4/AbEabRKLaCg6aaV4SCXF7LQwOBrQBwKLOOvUdvlC4DYFGQwiMNCxWDIAhq6EFmQWobDXUv1TITN4NFScdTwUcNHDR81fHgZ/pxCM57jM/wAhYYfwGd4GbTLRw54B9WP03BQH1IfiJeTEETPoer18XVyAQIMACbMN3JUxFKPAAAAAElFTkSuQmCC');
      }
    }
  }
  .name-message {
    text-align: left;
    box-sizing: border-box;
    font-size: 12px;
    color: #a1a6af;
    padding: 0 48px;
    margin-bottom: 3px;
    width: 100%;
  }
  .wrapper-message {
    position: relative;
  }
  .head-message {
    float: left;
    margin-right: 10px;
    width: 32px;
    height: 32px;
    border-radius: 3px;
    overflow: hidden;
    box-sizing: border-box;
    background-color: #fff;
    background-size: 100%;
    background-position: 0 50%;
    background-repeat: no-repeat;
  }
  .body-message {
    position: relative;
  }
  .text-message {
    position: relative;
    display: flex;
    box-sizing: border-box;
    min-height: 42px;
    line-height: 1.4;
    font-size: 13px;
    color: #252525;
    letter-spacing: 0;
    max-width: 390px;
  }
  .content-message {
    position: relative;
    display: inline-block;
    min-height: 18px;
    line-height: 1.4;
    background-color: #f3f3f3;
    border-radius: 4px;
    word-break: break-all;
    margin-left: 5px;
    padding: 12px 9px 12px 17px;
    text-align: justify;
    &.IMAGES,
    &.VIDEO {
      padding: 10px;
    }
    &:after {
      position: absolute;
      content: "";
      width: 23px;
      height: 42px;
      left: -6px;
      top: 0;
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAqCAYAAABYzsDTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzI0QTVCMjIxNjBBMTFFODlGQzlDRDUzQTg4RDcxQzMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzI0QTVCMjMxNjBBMTFFODlGQzlDRDUzQTg4RDcxQzMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMjRBNUIyMDE2MEExMUU4OUZDOUNENTNBODhENzFDMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMjRBNUIyMTE2MEExMUU4OUZDOUNENTNBODhENzFDMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsDqUnkAAADjSURBVHjaYvz8+TMDHiADxF1A7ADEkgyEwXMgPgDEZTw8PE8Y8RgOMvgiEAsxkA7eAbE+Ex4FXWQazADV14XP5c+IDAqcQYTP5ZQYDNbPxEBDMGr44DFci1aGJwDxaWoYzoLE5gLiaUAcT61gYUEKhtXUCg7kYImGBoMWtSMUVLY8o0JWx+nyQiD+RivDVwKxKRBfo1U6vwa1YAGtMhEoaBKh6fwbtSIUVw69Sqvsf42WZctokTtq+Kjho4aPGj58DH9Oodl4uy0HKDT8wIB1FZ+AFADxchKC6DlUvT6okwsQYAC/AjSzkv2m0gAAAABJRU5ErkJggg==');
    }
  }
  .order-message {
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    background: #FFFFFF;
    border: 1px solid #F2F2F2;
    border-radius: 4px;
    width: 400px;
    padding: 0 20px;
    .top-order {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      span {
        font-size: 12px;
      }
    }
    .inner-order {
      display: flex;
      padding: 20px 0;
      cursor: pointer;
      &.ORDER {
        padding-top: 0;
      }
    }
    .image-order-message {
      width: 80px;
      height: 80px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info-order-message {
      width: 260px;
      margin-left: 10px;
      .goods-name {
        height: 28px;
        line-height: 1.2;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      .info-order-box {
        font-size: 13px;
        margin-top: 12px;
        color: #999999;
        display: inline-block;
      }
    }
    .tag-order-message {
      position: absolute;
      right: 0;
      bottom: 0;
      color: #fff;
      padding: 2px 10px;
      background-color: #90a4ae;
      border-top-left-radius: 3px;
    }
  }
}
.message-pre {
  margin: 0;
}
.message-image,
.message-video {
  position: relative;
  min-width: 100px;
  min-height: 100px;
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
  z-index: 2;
}
.message-image {
  cursor: pointer;
}
/deep/ {
  .emoji-img {
    width: 20px;
    height: 20px;
    display: inline-block;
    margin: 0 1px -2px;
    vertical-align: bottom;
  }
}
</style>
