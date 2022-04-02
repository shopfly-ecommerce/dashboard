let emojiFiles = []
let emojiMap = {}
let emojis = require['context']('./images', true, /[A-Za-z]\w+\.(gif)$/)
emojis.keys().forEach(item => {
  if (item.indexOf('emojis.gif') !== -1) return
  emojiFiles.push(emojis(item))
  const emojiName = item.split('.gif')[0].split('/')[1]
  emojiMap[emojiName] = emojis(item)
})

export default {
  data() {
    return {
      emojis: Object.keys(emojiMap),
      emojiMap: emojiMap
    }
  },
  methods: {
    /**
     * 通过emoji图片路径获取emojiId
     * @param path
     * @returns {*}
     */
    getEmojiId(path) {
      if (!path) return
      let temp = path.split('.gif')[0]
      if (!temp) return
      return temp.split('/')[1]
    },
    /**
     * 通过emojiId获取emoji图片路径
     * @param id
     * @returns {*}
     */
    getEmojiPath(id) {
      if (!id) return
      return this.emojiMap[id]
    }
  }
}
