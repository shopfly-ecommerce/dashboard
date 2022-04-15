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
        /** Editor instance*/
        editor: null,

        /** Each editor generates a differentid,To prevent conflict.*/
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
          serverUrl: `${api.address}/ueditor/`
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
      /** Initialize the editor*/
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
