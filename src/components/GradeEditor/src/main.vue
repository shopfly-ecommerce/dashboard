<template>
  <div :id="'grade-editor-' + _uid" class="grade-editor" v-loading="loading">
    <div v-for="(column, columnIndex) in data" class="column" :style="columnWdith">
      <div class="search-column">
        <input
          type="text"
          v-model="searchKeywords[columnIndex]"
          class="input-search"
          placeholder="输入关键词查找"
          @input="handleSearchKeywordChange(columnIndex)"
        >
        <i class="icon-search"></i>
      </div>
      <div class="inner-column">
        <a href="javascript:;" class="add-column" @click="handleClickAdd(columnIndex)">
          <i class="icon-add"></i>
          添加{{ ['一', '二', '三', '四', '五', '六'][columnIndex] }}级{{ typeText }}
        </a>
        <div
          v-for="(item, itemIndex) in column"
          :key="item.$id"
          v-show="!item.$hidden"
          @click="handleClickItem(item, itemIndex, columnIndex)"
          :class="['item', item.$active && 'active', item.$hover && 'hover']">
          <div class="text-item">{{ item.$text }}</div>
          <div v-if="btns && btns.length > 0" class="btns-item">
            <div class="inner-btns">
              <a
                v-for="(btn, btnIndex) in btns"
                :style="{color: btn.color || '#0a89c7'}"
                @click="handleClickItemBtn(item, btn, btnIndex, columnIndex)"
                href="javascript:;"
              >{{ btn.text }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="placeLevel !== null" class="column" :style="columnWdith">
      <div class="search-column">
        <input
          type="text"
          v-model="searchKeywords[placeLevel]"
          class="input-search"
          placeholder="输入关键词查找"
          @input="handleSearchKeywordChange(placeLevel)"
        >
        <i class="icon-search"></i>
      </div>
      <div class="inner-column">
        <a href="javascript:;" class="add-column" @click="handleClickAdd(placeLevel)">
          <i class="icon-add"></i>
          添加{{ ['一', '二', '三', '四', '五', '六'][placeLevel] }}级{{ typeText }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from './mixin'

  export default {
    name: 'EnGradeEditor',
    mixins: [mixin]
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "./styles";
</style>
