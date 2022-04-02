<template>
  <div class="emoji-box">
    <div class="emoji-container">
      <div
        v-for="(item, index) in emojis"
        :key="index"
        class="item-emoji"
        :style="{backgroundPosition: `-${index % 12 *38}px -${Math.floor(index / 12) * 38}px`}"
        @click="handleClickEmoji(item)"
      >
        <div class="preview-item-emoji">
          <img :src="emojiMap[item]" alt="" class="img-preview-item-emoji">
        </div>
      </div>
    </div>
    <div class="emoji-tabs">
      <div class="emoji-tab active">经典</div>
    </div>
  </div>
</template>

<script>
import emojiMixin from './emojiMixin'
export default {
  name: 'ChatAppEmoji',
  mixins: [emojiMixin],
  methods: {
    handleClickEmoji(item) {
      this.$emit('select', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.emoji-box {
  background-color: #fff;
  box-sizing: border-box;
  position: relative;
  width: 372px;
  height: 218px;
  border: 1px solid #e1e1e1;
  .emoji-container {
    padding: 5px 5px 0;
    box-sizing: border-box;
    font-size: 0;
    line-height: 0;
    width: 370px;
    height: 185px;
    background-color: #fff;
    .item-emoji {
      position: relative;
      display: inline-block;
      box-sizing: border-box;
      width: 30px;
      height: 30px;
      background-color: #fafafa;
      border-right: 1px solid;
      border-bottom: 1px solid;
      border-color: #e1e1e1;
      cursor: pointer;
      user-select: none;
      background-image: url('./images/emojis.gif');
      background-repeat: no-repeat;
      &:nth-child(-n + 12) {
        border-top: 1px solid #e1e1e1;
      }
      &:nth-child(12n + 1) {
        border-left: 1px solid #e1e1e1;
      }
      &:hover {
        border: 1px solid #45ac4a;
        .preview-item-emoji {
          display: flex;
        }
      }
      .preview-item-emoji {
        display: none;
        justify-content: center;
        align-items: center;
        position: absolute;
        border: 1px solid #45ac4a;
        width: 60px;
        height: 60px;
        bottom: -62px;
        right: -62px;
        z-index: 2;
        background-color: #fff;
      }
    }
  }
  .emoji-tabs {
    background-color: #f0f0f0;
    font-size: 0;
    margin-top: 5px;
    .emoji-tab {
      display: inline-block;
      width: 63px;
      text-align: center;
      font-size: 12px;
      line-height: 26px;
      height: 26px;
      cursor: pointer;
      &.active {
        background-color: #ffffff;
      }
    }
  }
}
</style>
