<template>
  <div>
    <script :id="randomId" type="text/plain"></script>
  </div>
</template>

<script>
  import { api } from '~/ui-domain'

  export default {
    name: 'UE',
    data() {
      return {
        /** 编辑器实例 */
        editor: null,

        /** 每个编辑器生成不同的id,以防止冲突 */
        randomId: 'editor_1' + parseInt(Math.random() * 10000 + 1),

        ready: false
      }
    },
    props: {
      defaultMsg: {
        type: String,
        default: ''
      },
      config: {
        type: Object,
        default: () => ({
          serverUrl: `${api.base}/ueditor/`
        })
      }
    },
    watch: {
      defaultMsg(newVal, oldVal) {
        if (newVal != null && this.ready) {
          this.editor.setContent(newVal || '')
        }
      }
    },
    mounted() {
      this.initEditor()
    },
    methods: {
      /** 初始化编辑器 */
      initEditor() {
        this.$nextTick(() => {
          this.editor = window.UE.getEditor(this.randomId, this.config)
          this.editor.addListener('ready', () => {
            this.ready = true
            this.editor.setContent(this.defaultMsg)
          })
        })
      },

      getUEContent() {
        return this.editor.getContent()
      }
    },
    destroyed() {
      this.editor.destroy()
    }
  }
</script>
