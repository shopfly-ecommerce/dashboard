<template>
  <div class="sku-item-content">
    <el-form  :model="skuForm" @submit.native.prevent>
      <div v-for="(item, $index) in skuInfo" :key="$index">
        <el-form-item label="规格名：">
          <el-select v-model="item.spec_id" placeholder="请选择规格项名称" @change="_ => handleSelectSkuItem($index, {spec_id: _})">
            <el-option
              v-for="sku in skuData"
              :key="sku.value"
              :label=" sku.spec_name"
              :value="sku.spec_id">
            </el-option>
          </el-select>
          <el-checkbox v-if="$index === 0 " v-model="checkedImage" @change="handleChangeImage">添加规格图片</el-checkbox>
          <div class="empty"></div>
          <el-button type="danger" size="mini" @click="handleCloseSkuItem($index)" icon="el-icon-delete"></el-button>
        </el-form-item>
        <el-form-item label="规格值：">
          <!--规格值文本列表-->
          <div  v-for="(val, index) in item.value_list" :key="index" style="padding: 10px 10px 10px 0;">
            <el-autocomplete
              class="inline-input"
              style="width: 280px;"
              v-model="val.spec_value"
              :key="index"
              value-key="spec_value"
              :fetch-suggestions="querySearchSkuValue"
              :maxlength="30"
              placeholder="请选择规格值名称"
              @focus="getActiveSkuValue(index, $index ,item, val)"
              @keyup.enter.native="editSkuIValue(item, val, $index, index)"
              @blur.naitve="editSkuIValue(item, val, $index, index)"
              @select="handleSelectSkuValue">
              <template slot="append">
                <el-button type="danger" size="mini" @click="handleCloseSkuValue($index, index)" icon="el-icon-delete"></el-button>
              </template>
            </el-autocomplete>
            <!--规格值图片 上传列表-->
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
          <el-button type="text"  size="mini" style="margin-left: 10px;"  class="add-btn-skuval" @click="addSpec($index, item)">添加规格值</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-button type="primary" size="mini" @click="addSkuItem">添加规格项目</el-button>
  </div>
</template>

<script>
  import * as API_goodsSku from '@/api/goodsSkuInfo'
  import { cloneObj, deepClone } from '@/utils/index'
  export default {
    name: 'SkuItem',
    props: {
      /** 商城分类ID */
      categoryId: {
        type: Number,
        default: 0
      },

      /** 商品规格信息 */
      productSkuInfo: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        /** 表单数据*/
        skuForm: {},

        /** 请求数据*/
        skuData: [],

        /** 要提交的规格数据*/
        skuInfo: [],

        /** 当前规格项下的规格值列表*/
        specList: [],

        /** 是否添加规格图片*/
        checkedImage: false,

        /** 当前规格项索引 */
        activeSkuItemIndex: 0,

        /** 当前规格项 */
        activeSkuItem: {},

        /** 当前规格值索引 */
        activeSkuValIndex: 0,

        /** 当前规格值 */
        activeSkuVal: {},

        /** 开始上传为true */
        upLoadStatus: false,

        /** 是否显示进度条 */
        isShowProgress: false,

        /** 当前百分比 */
        currentPercent: 0,

        /** 定时器 */
        timer: null,

        /** 上传状态 true 可上传 false 不可上传 默认可上传*/
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
       * @fixTime 2020-07-17 下午11:29
       * 控制规格名 禁止随意输入，只能选择
       * **/
      specNameInput(index, newValue, oldItem) {
        if (this.skuInfo[index].spec_id === oldItem.spec_id && oldItem.spec_id) {
          this.$set(this.skuInfo[index], 'spec_name', this.skuData.find(item => item.spec_id === oldItem.spec_id).spec_name)
        }
      },

      /** 根据分类id获取规格信息*/
      getSkuInfoByCategory() {
        if (this.categoryId && this.categoryId > 0) {
          API_goodsSku.getCategorySkuList(this.categoryId, {}).then(response => {
            this.skuData = response
          })
        }
      },

      /** 获取编辑时的skuInfo信息 */
      getSkuInfo() {
        /** 下拉列表数据(skuData)存在时 检测productSkuInfo中对应的规格(spec_id)项 并且赋值于skuInfo中对应的规格项信息（描述 + 名称） */
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
              /** 如果存在图片则进行显示 */
              if (this.skuInfo[0].value_list[0].spec_type === 1) {
                this.checkedImage = true
              }
              /** 触发一次数据转换（规格选择数据=> 规格表格数据） */
              this.$emit('updateSkuInfo', this.skuInfo)
            }
          })
        }
      },

      /** 规格项 */

      /** 添加规格项 */
      addSkuItem() {
        this.$set(this.skuInfo, this.skuInfo.length, {})
      },

      /** 移除当前规格项 进行数据变化*/
      handleCloseSkuItem($index) {
        this.skuInfo.splice($index, 1)
        this.$emit('updateSkuInfo', this.skuInfo)
      },

      /** 获取当前 规格项索引 */
      getActiveSkuItem($index, item) {
        this.activeSkuItemIndex = $index
        this.activeSkuItem = cloneObj(item)
      },

      /** 点击查询输入规格项建议*/
      querySearchSkuItem(queryString, cb) {
        /**
         * @fixTime 2020-07-17 下午11:29
         *    控制规格名 禁止随意输入，只能选择
         * @fixDesc
         *    此处修复为当用户选择后，不能选择其他的规格名
         * **/
        const restaurants = this.skuData.map((key) => { return key })
        // const results = queryString ? restaurants.filter(this.createFilterSkuItem(queryString)) : restaurants
        const results = restaurants
        cb(results)
      },

      /** 筛选符合输入信息的规格项 */
      createFilterSkuItem(queryString) {
        return (restaurant) => {
          return (restaurant.spec_name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },

      /** 选择规格项时触发  */
      handleSelectSkuItem($index, item) {
        this.activeSkuItemIndex = $index
        const items = this.skuData.find(sku => {
          return sku.spec_id === item.spec_id
        })
        /** 当前规格项是否为选择项 */
        if (this.activeSkuItem.spec_id === item.spec_id) {
          return
        }
        /** 检测当前规格项是否已经存在且不止一次 */
        const _skuInfo = this.skuInfo.filter((key) => {
          return key.spec_id === item.spec_id
        })
        if (_skuInfo.length > 1) {
          this.$message.error('当前规格项已存在，请重新选择或者编辑！')
          /** 置空当前项 */
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
        /** 更新skuInfo数据 */
        this.$set(this.skuInfo[this.activeSkuItemIndex], 'spec_id', items.spec_id)
        this.$set(this.skuInfo[this.activeSkuItemIndex], 'spec_memo', items.spec_memo)
        this.$set(this.skuInfo[this.activeSkuItemIndex], 'spec_name', items.spec_name)
        this.$set(this.skuInfo[this.activeSkuItemIndex], 'value_list', [])

        /** 设置当前规格值列表 */
        this.skuData.filter(key => {
          if (item.spec_id === key.spec_id) {
            this.specList = key.value_list || []
          }
        })
        this.$emit('updateSkuInfo', this.skuInfo)
      },

      /** 编辑规格项结束时触发添加事件 blur */
      editSkuItem(item, $index, type) {
        /** 检测是否为空 检测到item.spec_id存在  则说明是选择而非编辑的终止方法的执行 */
        if (!item.spec_name || item.spec_id) {
          return
        }
        /** 判断规格项的值是否已选择 */
        const _items = this.skuInfo.filter(key => {
          return key.spec_name === item.spec_name
        })

        /** 如果已经选择则提示已存在 不允许添加 */
        if (_items.length > 1) {
          this.$message.error('当前规格项已选择，请选择其他规格项')
          return
        }

        /** 判断当前规格项已存在 */
        const _isexit = this.skuData.filter(key => {
          return key.spec_name === item.spec_name
        })

        if (_isexit) {
          this.$message.error('当前规格名不存在，请重新选择或者编辑！')
          return
        }

        /** 如果已经存在则提示已存在 不允许添加 */
        if (_isexit.length >= 1) {
          this.$message.error('当前规格项已存在，请选择')
          this.$set(this.skuInfo[this.activeSkuItemIndex], 'spec_name', '')
          return
        }
      },

      /** 选中/不选中 添加规格图片 是否显示上传组件*/
      handleChangeImage(val) {
        this.checkedImage = val
        /** 如果 图片按钮不显示 则置空图片列表中的所有图片数据 并且spec_type设置为0 */
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

      /** 规格值 */

      /** 添加当前规格项的规格值*/
      addSpec($index, item) {
        if (!this.skuInfo[$index] || !this.skuInfo[$index].spec_id || !this.skuInfo[$index].value_list) {
          this.$message.warning('请选择规格项')
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

      /** 获取当前规格值索引 赋值当前对应规格项的规格值下拉列表*/
      getActiveSkuValue(index, $index, item, val) {
        this.activeSkuValIndex = index
        this.activeSkuVal = cloneObj(val)
        this.activeSkuItemIndex = $index
        /** 设置当前规格值列表 */
        this.skuData.filter(key => {
          if (item.spec_id === key.spec_id) {
            this.specList = key.value_list || []
          }
        })
      },

      /** 点击查询输入规格值建议*/
      querySearchSkuValue(queryString, cb) {
        const restaurants = this.specList.map((key) => { return key })
        const results = queryString ? restaurants.filter(this.createFilterSkuVal(queryString)) : restaurants
        cb(results)
      },

      /** 筛选符合输入信息的规格值 */
      createFilterSkuVal(queryString) {
        return (restaurant) => {
          return (restaurant.spec_value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },

      /** 移除当前规格值 */
      handleCloseSkuValue($index, index) {
        this.skuInfo[$index].value_list.splice(index, 1)
        this.$emit('updateSkuInfo', this.skuInfo)
      },

      /** 选择规格值时触发 */
      handleSelectSkuValue(val) {
        /** 当前规格值是否为选择项 */
        if (this.activeSkuVal.spec_value_id === val.spec_value_id) {
          return
        }
        /** 检测是否已存在*/
        const _value_list = this.skuInfo[this.activeSkuItemIndex].value_list.filter((key) => {
          if (key.spec_value) {
            return key.spec_value === val.spec_value
          }
        })
        if (_value_list.length > 1) {
          this.$message.error('当前规格值已存在，请重新选择或者编辑！')
          if (!this.skuInfo[this.activeSkuItemIndex].value_list[this.activeSkuValIndex].spec_value_id) {
            this.$set(this.skuInfo[this.activeSkuItemIndex].value_list[this.activeSkuValIndex], 'spec_value', '')
          }
          return
        }
        /** 更新skuInfo数据 */
        let _arr = cloneObj(this.skuInfo[this.activeSkuItemIndex])
        this.$set(_arr.value_list[this.activeSkuValIndex], 'spec_id', val.spec_id)
        this.$set(_arr.value_list[this.activeSkuValIndex], 'spec_name', _arr.spec_name)
        this.$set(_arr.value_list[this.activeSkuValIndex], 'spec_value', val.spec_value || '')
        this.$set(_arr.value_list[this.activeSkuValIndex], 'spec_value_id', val.spec_value_id || '')
        this.$set(this.skuInfo, this.activeSkuItemIndex, _arr)

        this.$emit('updateSkuInfo', this.skuInfo)
      },

      /** 编辑规格值时触发 */
      editSkuIValue(item, val, $index, index) {
        /** 检测是否为空 检测是否有spec_value_id值 如果有则说明是选择而非编辑的终止方法的执行 */
        if (!val.spec_value || val.spec_value_id) {
          return
        }
        /** 检测是否已选*/
        const _value_list = this.skuInfo[this.activeSkuItemIndex].value_list.filter((key) => {
          if (key.spec_value) {
            return key.spec_value === val.spec_value
          }
        })
        if (_value_list.length > 1) {
          this.$message.error('当前规格值已选，请重新选择！')
          if (!this.skuInfo[this.activeSkuItemIndex].value_list[this.activeSkuValIndex].spec_value_id) {
            this.$set(this.skuInfo[this.activeSkuItemIndex].value_list[this.activeSkuValIndex], 'spec_value', '')
          }
          return
        }

        /** 判断当前规格值已存在 */
        const _isexit = this.specList.filter(key => {
          return key.spec_value === val.spec_value
        })
        if (_isexit) {
          this.$message.error('规格值不能编辑，请重新选择！')
          if (!this.skuInfo[this.activeSkuItemIndex].value_list[this.activeSkuValIndex].spec_value_id) {
            this.$set(this.skuInfo[this.activeSkuItemIndex].value_list[this.activeSkuValIndex], 'spec_value', '')
          }
          return
        }
        /** 如果已经存在则提示已存在 不允许添加 */
        if (_isexit.length >= 1) {
          this.$message.error('当前规格值已存在，请选择')
          if (!this.skuInfo[this.activeSkuItemIndex].value_list[this.activeSkuValIndex].spec_value_id) {
            this.$set(this.skuInfo[this.activeSkuItemIndex].value_list[this.activeSkuValIndex], 'spec_value', '')
          }
          return
        }
      },

      /** 图片上传之前的校验  */
      beforeImgUpload(file) {
        const isType = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
        const isLt1M = file.size / 1024 / 1024 < 1

        if (!isType) {
          this.$message.error('上传头像图片只能是 JPG/JPEG/PNG 格式!')
        }
        if (!isLt1M) {
          this.$message.error('上传商品相册图片大小不能超过 1MB!')
        }
        return isType && isLt1M
      },

      /** 点击已上传的图片 或者 i标签 */
      handleClickImg(index) {
        if (!this.uploadStatus) {
          this.$message.warning('正在上传，请稍侯。。。')
          return
        }
        this.currentPercent = 0
        this.activeSkuValIndex = index
        this.activeSkuItemIndex = 0
      },

      /** 删除当前图片 */
      handleDeleteImg(index) {
        /** 更新skuInfo数据 */
        if (this.activeSkuItemIndex === 0) {
          let _arr = cloneObj(this.skuInfo[this.activeSkuItemIndex])
          this.$set(_arr.value_list[index], 'spec_image', '')
          this.$set(_arr.value_list[index], 'spec_type', 0)
          this.$set(this.skuInfo, this.activeSkuItemIndex, _arr)
          this.$emit('updateSkuInfo', this.skuInfo)
        }
      },

      /** 文件正在上传时的钩子 */
      upLoading(event, file, fileList) {
        this.uploadStatus = false // 正在上传 不可继续操作上传
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

      /** 文件上传成功之后的钩子 */
      getImgUrl(response, file, fileList) {
        this.upLoadStatus = false
        clearInterval(this.timer)
        this.timer = null
        this.currentPercent = 100
        this.isShowProgress = false
        /** 更新skuInfo数据 */
        if (this.activeSkuItemIndex === 0) {
          let _arr = cloneObj(this.skuInfo[this.activeSkuItemIndex])
          this.$set(_arr.value_list[this.activeSkuValIndex], 'spec_image', response.url)
          this.$set(_arr.value_list[this.activeSkuValIndex], 'spec_type', 1)
          this.$set(this.skuInfo, this.activeSkuItemIndex, _arr)
          this.$emit('updateSkuInfo', this.skuInfo)
        }
        this.uploadStatus = true // 上传完成 可继续操作上传
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

  /** 规格值列表 */
  .sku-value-list {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
  }
  /** 关闭按钮*/
  .close-sku-item {
    cursor: pointer;
  }
  /*表单结构*/
  .el-form {
    border: 1px solid #e5e5e5;
    padding: 10px;
    .el-form-item {
      padding: 5px 10px;
    }
    /** 规格项 */
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
    /*规格值*/
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
        /** 待上传图片 */
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
    /*圆形进度条*/
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
    /** 为规格图添加删除功能 */
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

  /*禁止编辑时的样式覆盖*/
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
