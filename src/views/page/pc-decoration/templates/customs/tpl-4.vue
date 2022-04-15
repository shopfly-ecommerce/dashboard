<template>
  <div class="floor-layout tpl-4">
    <div v-for="(column, columnIndex) in data.columnList" :key="columnIndex" class="layout-main">
      <div class="layout-title" :style="colors(columnIndex).title">
        <template v-if="isEdit">
          <div class="edit-mask title" @click="handleEditTitle(columnIndex)">
            <button type="button" class="mask-btn-floor">
              <svg-icon icon-class="pen-leather"></svg-icon>edit
            </button>
          </div>
          <div class="edit-mask tag" @click="handleEditTags(columnIndex)">
            <button type="button" class="mask-btn-floor">
              <svg-icon icon-class="pen-leather"></svg-icon>edit
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
    name: 'tpl-4', // The name of the module
    mixins: [mixin],
    title: 'The module4', // The module标题
    dataTpl: { // Default data structure
      tpl_id: 4, // The moduleID
      tpl_type: 'ADV', // Module type, default isADV。（Currently only supportedADV）
      columnList: [ // Data column
        {
          // The title of the current column data
          title: 'A larger floor',
          // The title bar background of the current column data fades
          titleColors: ['#333377', '#488bad'],
          // The mixin.methods.emptyBlock method is used to create empty data, with the first argument being the number of data blocks and the second argument being the block type
          // The block type is currently only [TEXT= TEXT, IMAGE= IMAGE]
          // The label in the current column data
          tagList: mixin.methods.emptyBlock(2, 'TEXT'),
          // Image block in the current column data, 15 represents 15 empty blocks to be created
          blockList: mixin.methods.emptyBlock(1, 'IMAGE')
        },
        {
          title: 'Four insets',
          titleColors: ['#333377', '#488bad'],
          tagList: mixin.methods.emptyBlock(2, 'TEXT'),
          blockList: mixin.methods.emptyBlock(4, 'IMAGE')
        },
        {
          title: 'A big list',
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
