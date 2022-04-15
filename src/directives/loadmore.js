// v-loadmore: Used to add a scroll-to-bottom event listener to an element
export default (Vue) => {
  Vue.directive('loadmore', {
    bind(el, binding) {
      // Get the defined scroll box
      el.addEventListener('scroll', function() {
        /*
         * scrollHeight Gets the content height of the element(read-only)
         * scrollTop Gets or sets the offset value of the element,Commonly used in, Calculate the position of the scroll bar, When an elements container does not produce a vertical scroll bar, ItsscrollTopThe default value of is0.
         * clientHeight Reads the visible height of the element(read-only)
         * If the element scrolls to the bottom, The following equation returnstrue, If not, returnfalse:
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
