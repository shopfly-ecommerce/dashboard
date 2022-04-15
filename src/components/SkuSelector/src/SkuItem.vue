<template>
  <div class="sku-item-content">
    <el-form  :model="skuForm" @submit.native.prevent>
      <div v-for="(item, $index) in skuInfo" :key="$index">
        <el-form-item label="name：">
          <el-select v-model="item.spec_id" placeholder="Please select a specification item name" @change="_ => handleSelectSkuItem($index, {spec_id: _})">
            <el-option
              v-for="sku in skuData"
              :key="sku.value"
              :label=" sku.spec_name"
              :value="sku.spec_id">
            </el-option>
          </el-select>
          <el-checkbox v-if="$index === 0 " v-model="checkedImage" @change="handleChangeImage">Add picture</el-checkbox>
          <div class="empty"></div>
          <el-button type="danger" size="mini" @click="handleCloseSkuItem($index)" icon="el-icon-delete"></el-button>
        </el-form-item>
        <el-form-item label="values：">
          <!--Specification value text list-->
          <div  v-for="(val, index) in item.value_list" :key="index" style="padding: 10px 10px 10px 0;">
            <el-autocomplete
              class="inline-input"
              style="width: 280px;"
              v-model="val.spec_value"
              :key="index"
              value-key="spec_value"
              :fetch-suggestions="querySearchSkuValue"
              :maxlength="30"
              placeholder="Please select a specification value name"
              @focus="getActiveSkuValue(index, $index ,item, val)"
              @keyup.enter.native="editSkuIValue(item, val, $index, index)"
              @blur.naitve="editSkuIValue(item, val, $index, index)"
              @select="handleSelectSkuValue">
              <template slot="append">
                <el-button type="danger" size="mini" @click="handleCloseSkuValue($index, index)" icon="el-icon-delete"></el-button>
              </template>
            </el-autocomplete>
            <!--Specification value Picture upload list-->
            <div v-show="$index === 0 && checkedImage">
              <el-upload
                class="avatar-uploader"
                style="text-align: center; margin-top: 10px;"
                :key="index"
                :action="`${MixinUploadApi}?scene=goods`"
                :show-file-list="false"
                :on-success="getImgUrl"
                :on-progress="upLoading"
                :before-upload="beforeImgUpload">
                <img v-show="val.spec_image" :src="val.spec_image" class="sku-image" @click="handleClickImg(index)">
                <el-progress
                  type="circle"
                  class="progress-circle"
                  v-show="activeSkuValIndex === index && isShowProgress"
                  :percentage="currentPercent"
                  :width="100"/>
                <span class="el-upload-img-actions" v-show="val.spec_image">
                  <i class="el-icon-delete" @click.stop="handleDeleteImg(index)"></i>
                </span>
                <i v-show="!val.spec_image" class="el-icon-plus avatar-uploader-icon" @click="handleClickImg(index)"></i>
              </el-upload>
            </div>
          </div>
          <el-button type="text"  size="mini" style="margin-left: 10px;"  class="add-btn-skuval" @click="addSpec($index, item)">Add value</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-button type="primary" size="mini" @click="addSkuItem">Add  item</el-button>
  </div>
</template>

<script>
  import * as API_goodsSku from '@/api/goodsSkuInfo'
  import { cloneObj, deepClone } from '@/utils/index'
  export default {
    name: 'SkuItem',
    props: {
      /** Mall classificationID */
      categoryId: {
        type: Number,
        default: 0
      },

      /** Product specification information*/
      productSkuInfo: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        /** The form data*/
        skuForm: {},

        /** The request data*/
        skuData: [],

        /** Specification data to be submitted*/
        skuInfo: [],

        /** A list of specification values under the current specification item*/
        specList: [],

        /** Whether to add a specification image*/
        checkedImage: false,

        /** Current specification item index*/
        activeSkuItemIndex: 0,

        /** Current specification item*/
        activeSkuItem: {},

        /** Current specification value index*/
        activeSkuValIndex: 0,

        /** Current specification value*/
        activeSkuVal: {},

        /** Start uploading astrue */
        upLoadStatus: false,

        /** Whether to display the progress bar*/
        isShowProgress: false,

        /** Current percentage*/
        currentPercent: 0,

        /** The timer*/
        timer: null,

        /** Upload statustrue Can uploadfalse 不Can upload默认Can upload*/
        uploadStatus: true
      }
    },
    mounted() {
      this.getSkuInfoByCategory()
      this.getSkuInfo()
    },
    watch: {
      productSkuInfo: 'getSkuInfo',
      categoryId: 'getSkuInfoByCategory'
    },
    methods: {
      /**
       * @fixTime 2020-07-17 In the afternoon11:29
       * Control specification name cannot be entered at random. You can only select it
       * **/
      specNameInput(index, newValue, oldItem) {
        if (this.skuInfo[index].spec_id === oldItem.spec_id && oldItem.spec_id) {
          this.$set(this.skuInfo[index], 'spec_name', this.skuData.find(item => item.spec_id === oldItem.spec_id).spec_name)
        }
      },

      /** According to the classificationidGet specification information*/
      getSkuInfoByCategory() {
        if (this.categoryId && this.categoryId > 0) {
          API_goodsSku.getCategorySkuList(this.categoryId, {}).then(response => {
            this.skuData = response
          })
        }
      },

      /** Gets theskuInfoinformation*/
      getSkuInfo() {
        /** Drop down list data(skuData)Existence detectionproductSkuInfoIn the corresponding specification(spec_id)Item and assign toskuInfoIn the corresponding specification项信息（ describe+ The name of the） */
        if (this.categoryId && this.categoryId > 0) {
          API_goodsSku.getCategorySkuList(this.categoryId, {}).then(response => {
            this.skuData = response
            if (this.skuData.length > 0 && Array.isArray(this.productSkuInfo) && this.productSkuInfo.length > 0) {
              this.skuInfo = cloneObj(this.productSkuInfo)
              if (this.skuInfo.length > 0) {
                this.skuInfo.forEach(key => {
                  this.skuData.forEach(item => {
                    if (key.spec_id === item.spec_id) {
                      key.spec_name = item.spec_name
                      key.spec_memo = item.spec_memo
                    }
                  })
                })
              }
              /** Display pictures if they exist*/
              if (this.skuInfo[0].value_list[0].spec_type === 1) {
                this.checkedImage = true
              }
              /** Trigger a data conversion（Specification selection data=> Specification table data） */
              this.$emit('updateSkuInfo', this.skuInfo)
            }
          })
        }
      },

      /** Specification items*/

      /** Add specification item*/
      addSkuItem() {
        this.$set(this.skuInfo, this.skuInfo.length, {})
      },

      /** Delete current specifications to change data*/
      handleCloseSkuItem($index) {
        this.skuInfo.splice($index, 1)
        this.$emit('updateSkuInfo', this.skuInfo)
      },

      /** Gets the index of the current specification*/
      getActiveSkuItem($index, item) {
        this.activeSkuItemIndex = $index
        this.activeSkuItem = cloneObj(item)
      },

      /** Click Query to enter specification item suggestions*/
      querySearchSkuItem(queryString, cb) {
        /**
         * @fixTime 2020-07-17 In the afternoon11:29
         *    Control specification name cannot be entered at random. You can only select it
         * @fixDesc
         *    Fixed that the user cannot select another specification name after selecting it
         * **/
        const restaurants = this.skuData.map((key) => { return key })
        // const results = queryString ? restaurants.filter(this.createFilterSkuItem(queryString)) : restaurants
        const results = restaurants
        cb(results)
      },

      /** Filter the specifications that match the input information*/
      createFilterSkuItem(queryString) {
        return (restaurant) => {
          return (restaurant.spec_name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },

      /** Triggered when a specification item is selected*/
      handleSelectSkuItem($index, item) {
        this.activeSkuItemIndex = $index
        const items = this.skuData.find(sku => {
          return sku.spec_id === item.spec_id
        })
        /** Whether the current specification item is an option*/
        if (this.activeSkuItem.spec_id === item.spec_id) {
          return
        }
        /** Checks if the current specification item already exists more than once*/
        const _skuInfo = this.skuInfo.filter((key) => {
          return key.spec_id === item.spec_id
        })
        if (_skuInfo.length > 1) {
          this.$message.error('The current specification item already exists, please re-select or edit it！')
          /** Leave the preceding paragraph blank*/
          if (!this.skuInfo[this.activeSkuItemIndex].spec_id) {
            this.$set(this.skuInfo[this.activeSkuItemIndex], 'spec_name', '')
          } else {
            this.$nextTick(_ => {
              this.$set(this.skuInfo[this.activeSkuItemIndex], 'spec_id', this.activeSkuItem.spec_id || '')
              this.$set(this.skuInfo[this.activeSkuItemIndex], 'spec_name', this.activeSkuItem.spec_name || '')
              this.$set(this.skuInfo[this.activeSkuItemIndex], 'spec_memo', this.activeSkuItem.spec_memo || '')
              this.$set(this.skuInfo[this.activeSkuItemIndex], 'value_list', [])
            })
          }
          return
        }
        /** updateskuInfodata*/
        this.$set(this.skuInfo[this.activeSkuItemIndex], 'spec_id', items.spec_id)
        this.$set(this.skuInfo[this.activeSkuItemIndex], 'spec_memo', items.spec_memo)
        this.$set(this.skuInfo[this.activeSkuItemIndex], 'spec_name', items.spec_name)
        this.$set(this.skuInfo[this.activeSkuItemIndex], 'value_list', [])

        /** Sets the list of current specification values*/
        this.skuData.filter(key => {
          if (item.spec_id === key.spec_id) {
            this.specList = key.value_list || []
          }
        })
        this.$emit('updateSkuInfo', this.skuInfo)
      },

      /** The add event is triggered at the end of editing the specification itemblur */
      editSkuItem(item, $index, type) {
        /** Check whether null is detecteditem.spec_idThe presence indicates that the execution of the termination method is selected, not edited*/
        if (!item.spec_name || item.spec_id) {
          return
        }
        /** Determines whether the value of the specification item has been selected*/
        const _items = this.skuInfo.filter(key => {
          return key.spec_name === item.spec_name
        })

        /** If it is selected, it indicates that it already exists and cannot be added*/
        if (_items.length > 1) {
          this.$message.error('The current specification item is selected. Please select another specification item')
          return
        }

        /** Verify that the current specification item exists*/
        const _isexit = this.skuData.filter(key => {
          return key.spec_name === item.spec_name
        })

        if (_isexit) {
          this.$message.error('The current specification name does not exist. Please reselect or edit it！')
          return
        }

        /** If it already exists, the system displays a message indicating that it already exists and cannot be added*/
        if (_isexit.length >= 1) {
          this.$message.error('The current specification item already exists, please select')
          this.$set(this.skuInfo[this.activeSkuItemIndex], 'spec_name', '')
          return
        }
      },

      /** The selected/不The selected添加规格图片是否显示上传组件*/
      handleChangeImage(val) {
        this.checkedImage = val
        /** If the image button is not displayed, empty all image data in the image list andspec_typeSet to0 */
        if (!val) {
          this.skuInfo.forEach(key => {
            if (key.value_list) {
              key.value_list.forEach(item => {
                item.spec_image = ''
                item.spec_type = 0
              })
            }
          })
          this.$emit('updateSkuInfo', this.skuInfo)
        }
      },

      /** values*/

      /** Adds the specification value for the current specification item*/
      addSpec($index, item) {
        if (!this.skuInfo[$index] || !this.skuInfo[$index].spec_id || !this.skuInfo[$index].value_list) {
          this.$message.warning('Please select the specification item')
          return
        }
        this.activeSkuItemIndex = $index
        this.$set(this.skuInfo[$index].value_list, this.skuInfo[$index].value_list.length, {
          spec_id: item.spec_id,
          spec_name: item.spec_name,
          spec_value: '',
          spec_value_id: '',
          spec_image: '',
          spec_type: ''
        })
      },

      /** Obtain the current specification value Index Assign the current specification value drop - down list*/
      getActiveSkuValue(index, $index, item, val) {
        this.activeSkuValIndex = index
        this.activeSkuVal = cloneObj(val)
        this.activeSkuItemIndex = $index
        /** Sets the list of current specification values*/
        this.skuData.filter(key => {
          if (item.spec_id === key.spec_id) {
            this.specList = key.value_list || []
          }
        })
      },

      /** Click Query to enter specification value suggestions*/
      querySearchSkuValue(queryString, cb) {
        const restaurants = this.specList.map((key) => { return key })
        const results = queryString ? restaurants.filter(this.createFilterSkuVal(queryString)) : restaurants
        cb(results)
      },

      /** Filter the specification values that match the input information*/
      createFilterSkuVal(queryString) {
        return (restaurant) => {
          return (restaurant.spec_value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },

      /** Removes the current specification value*/
      handleCloseSkuValue($index, index) {
        this.skuInfo[$index].value_list.splice(index, 1)
        this.$emit('updateSkuInfo', this.skuInfo)
      },

      /** Triggered when a specification value is selected*/
      handleSelectSkuValue(val) {
        /** Whether the current specification value is an option*/
        if (this.activeSkuVal.spec_value_id === val.spec_value_id) {
          return
        }
        /** Check if it already exists*/
        const _value_list = this.skuInfo[this.activeSkuItemIndex].value_list.filter((key) => {
          if (key.spec_value) {
            return key.spec_value === val.spec_value
          }
        })
        if (_value_list.length > 1) {
          this.$message.error('The current specification value already exists, please re-select or edit it！')
          if (!this.skuInfo[this.activeSkuItemIndex].value_list[this.activeSkuValIndex].spec_value_id) {
            this.$set(this.skuInfo[this.activeSkuItemIndex].value_list[this.activeSkuValIndex], 'spec_value', '')
          }
          return
        }
        /** updateskuInfodata*/
        let _arr = cloneObj(this.skuInfo[this.activeSkuItemIndex])
        this.$set(_arr.value_list[this.activeSkuValIndex], 'spec_id', val.spec_id)
        this.$set(_arr.value_list[this.activeSkuValIndex], 'spec_name', _arr.spec_name)
        this.$set(_arr.value_list[this.activeSkuValIndex], 'spec_value', val.spec_value || '')
        this.$set(_arr.value_list[this.activeSkuValIndex], 'spec_value_id', val.spec_value_id || '')
        this.$set(this.skuInfo, this.activeSkuItemIndex, _arr)

        this.$emit('updateSkuInfo', this.skuInfo)
      },

      /** Triggered when editing a specification value*/
      editSkuIValue(item, val, $index, index) {
        /** Check whether it is null Check whether it existsspec_value_idValue, if any, indicates that the execution of the termination method is selected rather than edited*/
        if (!val.spec_value || val.spec_value_id) {
          return
        }
        /** Check if it is selected*/
        const _value_list = this.skuInfo[this.activeSkuItemIndex].value_list.filter((key) => {
          if (key.spec_value) {
            return key.spec_value === val.spec_value
          }
        })
        if (_value_list.length > 1) {
          this.$message.error('The current specification value has been selected, please reselect！')
          if (!this.skuInfo[this.activeSkuItemIndex].value_list[this.activeSkuValIndex].spec_value_id) {
            this.$set(this.skuInfo[this.activeSkuItemIndex].value_list[this.activeSkuValIndex], 'spec_value', '')
          }
          return
        }

        /** Verify that the current specification value already exists*/
        const _isexit = this.specList.filter(key => {
          return key.spec_value === val.spec_value
        })
        if (_isexit) {
          this.$message.error('Specification value cannot be edited, please reselect！')
          if (!this.skuInfo[this.activeSkuItemIndex].value_list[this.activeSkuValIndex].spec_value_id) {
            this.$set(this.skuInfo[this.activeSkuItemIndex].value_list[this.activeSkuValIndex], 'spec_value', '')
          }
          return
        }
        /** If it already exists, the system displays a message indicating that it already exists and cannot be added*/
        if (_isexit.length >= 1) {
          this.$message.error('The current specification value already exists, please select')
          if (!this.skuInfo[this.activeSkuItemIndex].value_list[this.activeSkuValIndex].spec_value_id) {
            this.$set(this.skuInfo[this.activeSkuItemIndex].value_list[this.activeSkuValIndex], 'spec_value', '')
          }
          return
        }
      },

      /** Verify images before uploading*/
      beforeImgUpload(file) {
        const isType = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
        const isLt1M = file.size / 1024 / 1024 < 1

        if (!isType) {
          this.$message.error('Profile pictures can only be uploadedJPG/JPEG/PNG Format!')
        }
        if (!isLt1M) {
          this.$message.error('The size of the picture in the uploaded product album should not exceed1MB!')
        }
        return isType && isLt1M
      },

      /** Click on the uploaded image oriThe label*/
      handleClickImg(index) {
        if (!this.uploadStatus) {
          this.$message.warning('Uploading now, please wait a moment...')
          return
        }
        this.currentPercent = 0
        this.activeSkuValIndex = index
        this.activeSkuItemIndex = 0
      },

      /** Delete current image*/
      handleDeleteImg(index) {
        /** updateskuInfodata*/
        if (this.activeSkuItemIndex === 0) {
          let _arr = cloneObj(this.skuInfo[this.activeSkuItemIndex])
          this.$set(_arr.value_list[index], 'spec_image', '')
          this.$set(_arr.value_list[index], 'spec_type', 0)
          this.$set(this.skuInfo, this.activeSkuItemIndex, _arr)
          this.$emit('updateSkuInfo', this.skuInfo)
        }
      },

      /** Hook when a file is being uploaded*/
      upLoading(event, file, fileList) {
        this.uploadStatus = false // Uploading cannot continue
        this.upLoadStatus = true
        this.timer = setInterval(() => {
          if (this.currentPercent < 100) {
            this.currentPercent += 5
          } else {
            clearInterval(this.timer)
            this.timer = null
            setTimeout(() => {
              this.isShowProgress = false
            }, 500)
          }
        }, 30)
        this.isShowProgress = true
      },

      /** Hooks after successful file upload*/
      getImgUrl(response, file, fileList) {
        this.upLoadStatus = false
        clearInterval(this.timer)
        this.timer = null
        this.currentPercent = 100
        this.isShowProgress = false
        /** updateskuInfodata*/
        if (this.activeSkuItemIndex === 0) {
          let _arr = cloneObj(this.skuInfo[this.activeSkuItemIndex])
          this.$set(_arr.value_list[this.activeSkuValIndex], 'spec_image', response.url)
          this.$set(_arr.value_list[this.activeSkuValIndex], 'spec_type', 1)
          this.$set(this.skuInfo, this.activeSkuItemIndex, _arr)
          this.$emit('updateSkuInfo', this.skuInfo)
        }
        this.uploadStatus = true // After the upload is complete, continue uploading
      }
    }
  }
</script>
<style lang="scss" type="scss" scoped>
  .sku-item-content {
    div {
      margin: 0px;
    }
  }

  /** Specification Value List*/
  .sku-value-list {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
  }
  /** Close button*/
  .close-sku-item {
    cursor: pointer;
  }
  /*Structure of the form*/
  .el-form {
    border: 1px solid #e5e5e5;
    padding: 10px;
    .el-form-item {
      padding: 5px 10px;
    }
    /** Specification items*/
    .el-form-item:first-child {
      background-color: #f8f8f8;
      cursor: pointer;
      /deep/ .el-form-item__label + div {
        width: 90%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        div {
          flex-grow: 1;
        }
        label {
          flex-grow: 1;
          display: inline-block;
          margin-left: 10px;
        }
        div.empty {
          flex-grow: 200;
        }
        button {
          flex-grow: 1;
        }
      }
    }
    /*values*/
    .el-form-item:last-child {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
      /deep/ .el-form-item__label + div {
        width: 90%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        button.add-btn-skuval {
          margin-left: 10px;
          outline: none;
        }
        /** Image to be uploaded*/
        img.sku-image {
          width: 120px;
          height: 120px;
          border-radius: 4px;
        }
        a.el-upload-list__item-name {
          white-space: nowrap;
          text-overflow:ellipsis;
        }
        i.avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 120px;
          height: 120px;
          line-height: 120px;
          text-align: center;
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
        }
        i.avatar-uploader-icon:hover {
          border-color: #409eff;
        }
      }
    }
  }
  /deep/ .el-upload {
    position: relative;
    width: 120px;
    height: 120px;
    /*Circular progress bar*/
    .progress-circle {
      position: absolute;
      width: 100px;
      height: 100px;
      left: 10px;
      top: 10px;
      z-index: 5000;
      & > div.el-progress__text {
        color: #fff;
      }
    }
    /** Add delete functionality to the specification diagram*/
    .el-upload-img-actions {
      position: absolute;
      width: 120px;
      height: 120px;
      left: 0;
      top: 0;
      cursor: pointer;
      text-align: center;
      border-radius: 4px;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0,0,0,.5);
      -webkit-transition: opacity .3s;
      transition: opacity .3s;
      i {
        margin: 0 3px;
        margin-top: 40%;
      }
    }
    .el-upload-img-actions:hover {
      opacity: 1;
    }
  }

  /*Disables style overwriting while editing*/
  /deep/ input.el-input.is-disabled {
    background-color: #fff !important;
    border-color: #e4e7ed;
    color: #606266;
    cursor: not-allowed;
  }


  .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    border-color: #e4e7ed;
    color: #606266;
  }


</style>
