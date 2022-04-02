<template>
  <div class="floor-layout tpl-4">
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
        <div v-if="columnIndex === 0" class="lo-bz lo-bz-1">
          <div class="bz-cover">
            <layout-item :block="column.blockList[0]" @handle-edit="handleEditBlock(columnIndex, 0)">
              <template slot-scope="{ block }">
                <p class="bz-co bz-co-tit">{{ block.block_opt.opt_title }}</p>
                <p class="bz-co bz-co-des">{{ block.block_opt.opt_desc }}</p>
              </template>
            </layout-item>
          </div>
        </div>
        <div v-if="columnIndex === 1" class="lo-bz lo-bz-2">
          <div class="bz-mt bz-mt-4">
            <layout-item
              v-for="(_block, blockIndex) in column.blockList"
              :key="blockIndex"
              :block="_block"
              @handle-edit="handleEditBlock(columnIndex, blockIndex)"
              class="bz-mt-item"
            >
              <template slot-scope="{ block }">
                <p class="bz-co bz-co-tit">{{ block.block_opt.opt_title }}</p>
                <p class="bz-co bz-co-des">{{ block.block_opt.opt_desc }}</p>
              </template>
            </layout-item>
          </div>
        </div>
        <div v-if="columnIndex === 2" class="lo-bz lo-bz-3">
          <div class="bz-cover">
            <layout-item :block="column.blockList[0]" @handle-edit="handleEditBlock(columnIndex, 0)"/>
          </div>
          <div class="bz-mt bz-mt-3">
            <layout-item
              v-for="(_block, blockIndex) in column.blockList.slice(1,4)"
              :key="blockIndex"
              :block="_block"
              @handle-edit="handleEditBlock(columnIndex, blockIndex + 1)"
              class="bz-mt-item"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from '../mixin'

  export default {
    name: 'tpl-4', // 模块名称
    mixins: [mixin],
    title: '模块4', // 模块标题
    dataTpl: { // 默认数据结构
      tpl_id: 4, // 模块ID
      tpl_type: 'ADV', // 模块类型，默认为ADV。（目前只支持ADV）
      columnList: [ // 数据列
        {
          // 当前列数据的标题
          title: '大图楼层',
          // 当前列数据的标题栏背景渐变色
          titleColors: ['#333377', '#488bad'],
          // mixin.methods.emptyBlock方法用于创建空数据，第一个参数为数据块个数，第二个参数为区块类型
          // 区块类型目前只有【TEXT=文本、IMAGE=图片】
          // 当前列数据中的标签
          tagList: mixin.methods.emptyBlock(2, 'TEXT'),
          // 当前列数据中的图片块，15表示要创建15个空数据块
          blockList: mixin.methods.emptyBlock(1, 'IMAGE')
        },
        {
          title: '四小图',
          titleColors: ['#333377', '#488bad'],
          tagList: mixin.methods.emptyBlock(2, 'TEXT'),
          blockList: mixin.methods.emptyBlock(4, 'IMAGE')
        },
        {
          title: '一大三小',
          titleColors: ['#333377', '#488bad'],
          tagList: mixin.methods.emptyBlock(2, 'TEXT'),
          blockList: mixin.methods.emptyBlock(4, 'IMAGE')
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
  .layout-title .edit-mask.tag {
    width: 220px;
  }
  .lo-bz-1 /deep/{
    .bz-cover {
      width: 100%;
      height: 382px;
      text-align: center;
      background-color: #fff;
      img {
        width: 100%;
        height: 262px;
      }
      .bz-co {
        position: absolute;
        width: 100%;
        z-index: 10;
        bottom: 10px;
        margin: 0;
      }
      .bz-co-tit {
        bottom: 50px;
        font-size: 16px;
        color: #333;
        height: 50px;
        line-height: 56px;
        white-space: nowrap;
        overflow: hidden;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
      }
      .bz-co-des {
        font-size: 14px;
        color: #999;
        height: 40px;
        line-height: 20px;
        overflow: hidden;
      }
    }
  }
  .lo-bz-2 /deep/ {
    .bz-mt {
      height: 382px !important;
    }
    .bz-mt-item {
      width: 191px;
      height: 191px;
      padding: 10px;
      box-sizing: border-box;
      img {
        padding: 0;
        width: 110px;
        height: 110px;
        top: 10px;
        left: 50%;
        margin-left: -55px;
      }
      p {
        position: absolute;
        display: block;
        width: calc(100% - 20px);
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        text-align: center;
      }
      .bz-co-tit {
        bottom: 40px;
        margin: 0;
        display: block;
        font-size: 14px;
        color: #3e8c96;
        font-weight: bold;
        height: 16px;
        line-height: 16px;
      }
      .bz-co-des {
        bottom: 5px;
        font-size: 12px;
        line-height: 14px;
        color: #666;
      }
    }
  }
  .lo-bz-3 /deep/ {
    img {
      width: 100%;
      height: 100%;
      margin: 0;
      right: 0;
      bottom: 0;
    }
    height: 382px;
    .bz-cover {
      width: 376px;
      height: 262px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .bz-mt-3 {
      display: flex;
      justify-content: space-around;
      margin-top: 10px;
      width: 376px;
      height: 110px;
      .bz-mt-item {
        width: 110px;
        height: 110px;
      }
    }
  }
</style>
