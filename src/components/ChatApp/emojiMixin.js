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
     * throughemojiImage path acquisitionemojiId
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
     * throughemojiIdTo obtainemojiImage path
     * @param id
     * @returns {*}
     */
    getEmojiPath(id) {
      if (!id) return
      return this.emojiMap[id]
    }
  }
}
