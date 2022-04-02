// v-loadmore: 用于在元素上加上滚动到底事件监听
export default (Vue) => {
  Vue.directive('loadmore', {
    bind(el, binding) {
      // 获取定义好的scroll盒子
      el.addEventListener('scroll', function() {
        /*
         * scrollHeight 获取元素内容高度(只读)
         * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
         * clientHeight 读取元素的可见高度(只读)
         * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
         * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
         */
        const CONDITION = el.scrollHeight - el.scrollTop <= el.clientHeight
        if (CONDITION) {
          binding.value()
        }
      })
    }
  })
}
