<template>
  <div class="container">
    <div class="floor-container">
      <div class="tpl-box" :style="tplBoxStyle">
        <draggable v-model="templateArray" :options="tplOptions" class="tpl-list">
          <div v-for="item in templateArray" :class="'item-' + item.tpl_id" class="tpl-item">
            <div class="img-tpl"></div>
            <span class="text-tpl">{{ templates[item.tpl_id].title }}</span>
          </div>
        </draggable>
        <el-button type="primary" @click="handleSaveFloor" class="save-btn">Save the release</el-button>
        <div class="tpl-btns">
          <div class="btn-item" @click="tplBoxShow = !tplBoxShow">
            <i v-if="tplBoxShow" class="el-icon-d-arrow-left"></i>
            <i v-else class="el-icon-d-arrow-right"></i>
          </div>
          <div style="border-top: 1px dashed #ccc;margin: 2px 0"></div>
          <el-tooltip class="item" effect="dark" content="Quick save" placement="right">
            <div class="btn-item" @click="handleSaveFloor">
              <i class="el-icon-upload"></i>
            </div>
          </el-tooltip>
        </div>
      </div>
      <div class="draggable-box floor">
        <div class="floor-body">
          <draggable v-model="floorList" :options="floorOptions" class="floor-list">
            <div v-for="(item, index) in floorList" :class="'item-' + item.tpl_id" class="floor-item">
              <component
                :is="templates[item.tpl_id]"
                :data="JSON.parse(JSON.stringify(item))"
                is-edit
                @edit-block="(...props) => { handleEditBlock(index, ...props) }"
                @edit-title="(...props) => { handleEditTitle(index, ...props) }"
                @edit-tags="(...props) => { handleEditTags(index, ...props) }"
              ></component>
              <div class="panel-handle">
                <span class="icon-handle handle-move"><svg-icon icon-class="list-move"/></span>
                <span class="icon-handle handle-delete" @click="floorList.splice(index, 1)"><svg-icon icon-class="delete"/></span>
              </div>
            </div>
          </draggable>
        </div>
      </div>
    </div>
    <en-image-picker
      :show="dialogImageShow"
      :default-data="defaultImageData"
      :operation="imageOperation"
      @close="dialogImageShow = false"
      @confirm="handleImagePickerConfirm"
      :limit="1"
    />
    <en-goods-picker
      :api="goodsListApi"
      :multipleApi="multipleGoodsApi"
      :show="dialogGoodsShow"
      :default-data="defaultGoodsData"
      :limit="1"
      @close="dialogGoodsShow = false"
      @confirm="handleGoodsPickerConfirm"
    />
    <en-floor-title-picker
      :show="dialogTitleShow"
      :default-data="defaultTitleData"
      @close="dialogTitleShow = false"
      @confirm="handleTitlePickerConfirm"
    />
    <en-floor-tags-picker
      :show="dialogTagsShow"
      :default-data="defaultTagsData"
      @close="dialogTagsShow = false"
      @confirm="handleTagsPickerConfirm"
    />
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueLazyload from 'vue-lazyload'
  import draggable from 'vuedraggable'
  import * as API_Floor from '@/api/floor'
  import templates, { templateArray } from './templates'
  import { FloorTagsPicker, FloorTitlePicker } from '@/components'

  Vue.use(VueLazyload)
  Vue.use(FloorTagsPicker)
  Vue.use(FloorTitlePicker)

  export default {
    name: 'pcFloorManage',
    components: { draggable },
    data() {
      return {
        // Floor template expansion
        tplBoxShow: true,
        // Get the item list API
        goodsListApi: 'seller/goods',
        // Gets the item list API based on the item ID
        multipleGoodsApi: 'seller/goods/@ids/details',
        templates,
        templateArray,
        /** The template list*/
        tplList: [],
        /** The template configuration*/
        tplOptions: {
          group: { name: 'tplGroup', pull: 'clone', put: false },
          sort: false
        },
        /** Floor list*/
        floorList: [],
        /** Floor configuration*/
        floorOptions: {
          animation: 150,
          group: { name: 'tplGroup', put: true },
          sort: true,
          handle: '.handle-move'
        },
        dialogImageShow: false,
        dialogGoodsShow: false,
        dialogTitleShow: false,
        dialogTagsShow: false,
        /** Image Default Data*/
        defaultImageData: '',
        /** Product Default Data*/
        defaultGoodsData: [],
        /** Floor title default data*/
        defaultTitleData: {},
        /** Floor label default data*/
        defaultTagsData: [],
        /** Image selector custom parameters*/
        imageOperation: [
          {
            label: 'Operation type',
            name: 'opt_type',
            type: 'select',
            options: [
              { text: 'No operation', value: 'NONE' },
              { text: 'The link address', value: 'URL' },
              { text: 'keyword', value: 'KEYWORD' },
              { text: 'Product serial number', value: 'GOODS' },
              // {text: SHOP, value: SHOP},
              { text: 'Category', value: 'CATEGORY' }
              // {text: TOPIC, value: TOPIC}
            ],
            value: 'NONE'
          },
          {
            label: 'Operating content',
            name: 'opt_value'
          },
          {
            label: 'Additional title',
            name: 'opt_title'
          },
          {
            label: 'Additional description',
            name: 'opt_desc'
          }
        ]
      }
    },
    mounted() {
      this.GET_FloorList()
    },
    computed: {
      // Floor template box style
      tplBoxStyle() {
        const { sidebar } = this.$store.getters
        let left = (sidebar.opened ? 180 : 36)
        left = this.tplBoxShow ? left : left - 300
        return {
          left: left + 'px'
        }
      }
    },
    methods: {
      /** Edit floor block*/
      handleEditBlock(index, target, columnIndex, blockIndex) {
        const block = target.columnList[columnIndex].blockList[blockIndex]
        const type = block.block_type
        this.editOptions = { index, target, columnIndex, blockIndex }
        const blockData = JSON.parse(JSON.stringify(block))
        if (type === 'IMAGE') {
          this.defaultImageData = blockData.block_value ? [{
            url: blockData.block_value,
            opt: blockData.block_opt
          }] : null
          this.dialogImageShow = true
        } else if (type === 'GOODS') {
          // Populate default data
          // this.defaultGoodsData = blockData.block_value ? [blockData.block_value.goods_id] : []
          // this.dialogGoodsShow = true
        } else if (type === 'BRAND') {
          console.log('Brand module')
        }
      },
      /** Edit floor titles*/
      handleEditTitle(index, target, columnIndex) {
        this.editOptions = { index, target, columnIndex }
        const column = target.columnList[columnIndex]
        const columnData = JSON.parse(JSON.stringify(column))
        this.defaultTitleData = {
          text: column.title,
          start_color: column.titleColors[0],
          end_color: column.titleColors[1]
        }
        this.dialogTitleShow = true
      },
      /** Edit floor labels*/
      handleEditTags(index, target, columnIndex) {
        this.editOptions = { index, target, columnIndex }
        const column = target.columnList[columnIndex]
        const columnData = JSON.parse(JSON.stringify(column))
        this.defaultTagsData = columnData.tagList
        this.dialogTagsShow = true
      },
      /** Picture upload component confirmation*/
      handleImagePickerConfirm(fileList) {
        const file = fileList[0]
        let opt = file ? file.operation : {}
        let url = file ? file.response.url : ''
        const { index, target, columnIndex, blockIndex } = this.editOptions
        const block = target.columnList[columnIndex].blockList[blockIndex]
        block.block_value = url
        block.block_opt = opt
        this.$set(this.floorList, index, target)
      },
      /** Commodity selector confirmation*/
      handleGoodsPickerConfirm(list) {
        const { index, target, targetIndex } = this.editOptions
        target.blockList[targetIndex].block_value = this.MixinClone(list[0] || '')
        this.$set(this.floorList, index, target)
      },
      /** Edit and confirm the floor title*/
      handleTitlePickerConfirm(data) {
        const { index, target, columnIndex } = this.editOptions
        const column = target.columnList[columnIndex]
        column.title = data.text
        column.titleColors[0] = data.start_color
        column.titleColors[1] = data.end_color
        this.$set(this.floorList, index, target)
      },
      /** Edit and confirm floor labels*/
      handleTagsPickerConfirm(tagList) {
        const { index, target, columnIndex } = this.editOptions
        const column = target.columnList[columnIndex]
        column.tagList = tagList
        this.$set(this.floorList, index, target)
      },
      /** Save the release*/
      handleSaveFloor() {
        API_Floor.editFloor('PC', 'INDEX', {
          page_name: 'pc_floor',
          page_data: JSON.stringify(this.floorList)
        }).then(() => this.$message.success('Saved publication successful！'))
      },
      GET_FloorList() {
        API_Floor.getFloor('PC', 'INDEX').then(response => {
          this.floorList = JSON.parse(response.page_data || '[]')
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "./templates/floor-pc";
  .container {
    min-width: 1366px;
  }
  .floor-container {
    display: flex;
    justify-content: space-around;
    background-color: #E5E7EA;
    padding: 10px;
  }
  .draggable-box {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 50%;
    &.floor {
      width: 1210px + 50px;
      flex-shrink: 0;
      align-items: center;
    }
  }
  .tpl-list {
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    width: 100%;
    background-color: #fff;
  }
  .tpl-item {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    border-bottom: 2px solid #D9E0E7;
    margin-bottom: 10px;
    &.item-1 .img-tpl {
      background: url("../../../assets/pc-tpl-01.png") no-repeat;
      background-size: 100%;
    }
    &.item-2 .img-tpl {
      background: url("../../../assets/pc-tpl-02.png") no-repeat;
      background-size: 100%;
    }
    &.item-3 .img-tpl {
      background: url("../../../assets/pc-tpl-03.png") no-repeat;
      background-size: 100%;
    }
    &.item-4 .img-tpl {
      background: url("../../../assets/pc-tpl-04.png") no-repeat;
      background-size: 100%;
    }
  }
  .img-tpl {
    width: 100%;
    min-height: 150px;
  }
  .text-tpl {
    text-align: center;
    margin: 5px 0;
    color: #ACB0B9;
    font-size: 12px;
  }
  .floor-body {
    display: flex;
    justify-content: center;
    width: 100%;
    overflow-y: scroll;
  }
  .floor-list {
    background-color: #E5E7EA;
    min-width: 75%;
    min-height: 500px;
  }
  .floor-item {
    position: relative;
    box-sizing: border-box;
    .panel-handle {
      display: none;
      position: absolute;
      top: 0;
      right: -25px;
      .icon-handle {
        display: block;
        cursor: pointer;
        text-align: center;
      }
      .svg-icon {
        width: 25px;
        height: 25px;
        background-color: #fff;
      }
    }
    &:hover .panel-handle {
      display: block;
    }
  }
  .floor-item:first-child .floor-layout {
    margin-top: 0;
  }
  .tpl-box {
    position: fixed;
    top: 50%;
    left: 180px;
    z-index: 99;
    width: 300px;
    margin-top: (-500px - 32px + 84px) / 2;
    border-top: 10px solid #fff;
    box-shadow: 4px 5px 20px 0 rgba(0,0,0,.6);
    transition: all ease .3s;
    .tpl-list {
      height: 500px;
      overflow-y: scroll;
    }
    .save-btn {
      width: 100%;
    }
    .tpl-btns {
      position: absolute;
      top: 50%;
      right: -25px;
      margin-top: -35px;
      width: 25px;
      height: 70px;
      background-color: #fff;
      text-align: center;
      padding: 5px 0;
      .btn-item {
        cursor: pointer;
        padding: 5px 0;
        & + .btn-item {
          margin-top: 8px;
        }
        &:hover {
          background-color: #46A0FC;
          color: #fff
        }
      }
    }
  }
</style>
