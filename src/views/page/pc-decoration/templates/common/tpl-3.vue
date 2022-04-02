<template>
  <div class="floor-layout tpl-3">
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
          <div class="bz-mt bz-mt-2">
            <layout-item
              v-for="(_block, blockIndex) in column.blockList.slice(1,3)"
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
              v-for="(_block, blockIndex) in column.blockList.slice(3,6)"
              :key="blockIndex"
              :block="_block" @handle-edit="handleEditBlock(columnIndex, blockIndex + 3)" class="bz-bm-item"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from '../mixin'

  export default {
    name: 'tpl-3',
    mixins: [mixin],
    title: '模块3',
    dataTpl: {
      tpl_id: 3,
      tpl_type: 'ADV',
      columnList: [
        {
          title: '标题',
          titleColors: ['#3aaba9', '#299b9a'],
          tagList: mixin.methods.emptyBlock(0, 'TEXT'),
          blockList: mixin.methods.emptyBlock(5, 'IMAGE')
        },
        {
          title: '标题',
          titleColors: ['#568e7d', '#447e6c'],
          tagList: mixin.methods.emptyBlock(0, 'TEXT'),
          blockList: mixin.methods.emptyBlock(5, 'IMAGE')
        },
        {
          title: '标题',
          titleColors: ['#5a7259', '#425f41'],
          tagList: mixin.methods.emptyBlock(0, 'TEXT'),
          blockList: mixin.methods.emptyBlock(5, 'IMAGE')
        }
      ]
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .layout-main {
    float: left;
    width: 397px;
    overflow: hidden;
    margin-right: 10px;
    &:last-child {
      width: 396px;
      margin-right: 0;
    }
  }
  .layout-title {
    .edit-mask.tag { width: 220px }
    .bz-tags { max-width: 220px }
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
