<template>
  <div :id="'AS-' + _uid"></div>
</template>

<script>
  import $ from 'jquery'
  import './jquery.addressSelect'
  // Andste_TODO 2018/5/28: 传参待优化
  export default {
    name: 'EnRegionPicker',
    props: {
      default: {
        default: null
      },
      api: {
        type: String,
        required: true
      }
    },
    watch: {
      default() {
        this.initAddressSelect()
      }
    },
    mounted() {
      this.initAddressSelect()
    },
    methods: {
      callback(object) {
        this.$emit('input', object.last_id)
        this.$emit('changed', object)
      },
      initAddressSelect() {
        this.$nextTick(() => {
          $(this.$el).addressSelect({
            api: this.api,
            callback: this.callback,
            deData: this.default
          })
        })
      }
    }
  }
</script>
