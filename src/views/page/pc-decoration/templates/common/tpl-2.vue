<template>
  <div class="floor-layout tpl-2">
    <div v-for="(column, columnIndex) in data.columnList" :key="columnIndex" class="layout-main">
      <div class="layout-title" :style="colors(columnIndex).title">
        <template v-if="isEdit">
          <div class="edit-mask title" @click="handleEditTitle(columnIndex)">
            <button type="button" class="mask-btn-floor">
              <svg-icon icon-class="pen-leather"></svg-icon>编辑
            </button>
          </div>
          <div class="edit-mask tag" @click="handleEditTags(columnIndex)">
            <button type="button" class="mask-btn-floor">
              <svg-icon icon-class="pen-leather"></svg-icon>编辑
            </button>
          </div>
        </template>
        <h3 class="layout-item bz-tit">{{ column.title }}</h3>
        <div class="bz-tags">
          <a
            v-for="(tag, index) in column.tagList"
            :key="index"
            :href="blockHref(tag)"
          >
            <el-tag class="bz-tag-item">{{ tag.block_value }}</el-tag>
          </a>
        </div>
      </div>
      <div class="layout-body">
        <div class="lo-bz lo-bz-1">
          <div class="bz-cover">
            <layout-item :block="column.blockList[0]" @handle-edit="handleEditBlock(columnIndex, 0)"/>
          </div>
          <div class="bz-mt bz-mt-4">
            <layout-item
              v-for="(_block, blockIndex) in column.blockList.slice(1,5)"
              :key="blockIndex"
              :block="_block"
              @handle-edit="handleEditBlock(columnIndex, blockIndex + 1)"
              class="bz-mt-item">
              <template slot-scope="{ block }">
                <p class="bz-mt-tit" :style="colors().color(0)">{{ block.block_opt.opt_title }}</p>
                <p class="bz-mt-des">{{ block.block_opt.opt_desc }}</p>
              </template>
            </layout-item>
          </div>
          <div class="bz-more">
            <layout-item
              v-for="(_block, blockIndex) in column.blockList.slice(5,8)"
              :key="blockIndex"
              :block="_block" @handle-edit="handleEditBlock(columnIndex, blockIndex + 5)" class="bz-bm-item"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from '../mixin'

  export default {
    name: 'tpl-2',
    mixins: [mixin],
    title: '模块2',
    dataTpl: {
      tpl_id: 2,
      tpl_type: 'ADV',
      columnList: [
        {
          title: '标题',
          titleColors: ['#0fab85', '#0a906f'],
          tagList: mixin.methods.emptyBlock(0, 'TEXT'),
          blockList: mixin.methods.emptyBlock(8, 'IMAGE')
        },
        {
          title: '标题',
          titleColors: ['#ecd451', '#e3c20c'],
          tagList: mixin.methods.emptyBlock(0, 'TEXT'),
          blockList: mixin.methods.emptyBlock(8, 'IMAGE')
        }
      ]
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .layout-main {
    float: left;
    width: 600px;
    overflow: hidden;
    &:nth-child(1) {
      margin-right: 10px;
    }
  }
  .layout-title {
    .edit-mask.tag { width: 420px }
    .bz-tags { max-width: 420px }
  }
  .lo-bz {
    float: left;
    width: 580px;
    &.lo-bz-2 {
      width: 579px;
      margin-left: 15px;
      padding-left: 15px;
      border-left: 1px solid #E6E6E6;
    }
  }
</style>
