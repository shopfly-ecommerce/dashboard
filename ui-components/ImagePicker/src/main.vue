<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    width="805px">
    <div slot="title" class="image-picker-title">图片上传</div>
    <div class="image-picker-body">
      <div v-show="curEdit" class="upload-box edit">
        <div class="el-upload-dragger">
          <div class="opt-body">
            <div class="inner-opt">
              <div v-for="(opt, index) in curEdit.operation" class="item-opt">
                <div v-if="opt.type === 'select'" class="input-with-select el-input el-input--small el-input-group el-input-group--prepend">
                  <div class="el-input-group__prepend">{{ opt.label }}</div>
                  <el-select v-model="opt.value" size="small" slot="append" placeholder="请选择">
                    <el-option v-for="op in opt.options" :label="op.text" :value="op.value" :key="op.text"></el-option>
                  </el-select>
                </div>
                <el-input v-else placeholder="请输入内容" v-model="opt.value" size="small" class="input-with-select">
                  <template slot="prepend">{{ opt.label }}</template>
                </el-input>
              </div>
            </div>
          </div>
          <div class="opt-footer">
            <el-button type="primary" size="small" @click="handleSaveEdit">保存</el-button>
            <el-button size="small" @click="curEdit = ''">取消</el-button>
          </div>
        </div>
      </div>
      <el-upload
        ref="elUpload"
        class="upload-box"
        drag
        :limit="limit"
        :multiple="multiple"
        :show-file-list="true"
        list-type="picture-card"
        :on-success="onSuccess"
        :on-remove="onRemove"
        :on-preview="handleEditItem"
        :action="MixinUploadApi"
        :on-exceed="() => { $message.error('文件数量超过限制！') }"
        :file-list="fileList"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </div>
    <div slot="footer" class="image-picker-footer">
      <div class="upload-status-num">
        最多可上传个数：<span>{{ limit }}</span>
        已上传个数：<span>{{ nums.successUpload }}</span>
        还可上传个数：<span>{{ nums.canUpload }}</span>
      </div>
      <span>
        <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
  // Andste_TODO 2018/6/16: 图片选择组件需要重构
  export default {
    name: 'EnImagePicker',
    props: {
      /** 显示dialog */
      show: {
        type: Boolean,
        default: false
      },
      /** 最大可上传个数 */
      limit: {
        type: Number,
        default: 10
      },
      /** 是否可多选 */
      multiple: {
        type: Boolean,
        default: false
      },
      /** 默认数据 */
      defaultData: {
        default: () => ([])
      },
      /** 自定义参数 */
      operation: {
        type: Array,
        default: () => [{
          label: '操作类型',
          name: 'opt_type',
          type: 'select',
          options: [
            { text: '无操作', value: 'NONE' },
            { text: '链接地址', value: 'URL' },
            { text: '关键字', value: 'KEYWORD' },
            { text: '商品序号', value: 'GOODS' },
            { text: '商品分类', value: 'CATEGORY' }
          ],
          value: 'NONE'
        }, {
          label: '链接值',
          name: 'opt_value'
        }]
      }
    },
    data() {
      return {
        dialogVisible: this.show,
        fileList: [],
        dataMap: new Map(),
        curEdit: '',
        nums: {
          successUpload: 0,
          canUpload: 0
        }
      }
    },
    watch: {
      show(newVal) {
        this.dialogVisible = newVal
        if (newVal === false) {
          this.curEdit = ''
          this.fileList = []
          this.dataMap = new Map()
          this.countNums()
        }
      },
      dialogVisible(newVal) {
        newVal === false && this.$emit('close')
      },
      defaultData(newVal) {
        if (!newVal) return
        this.fileList = JSON.parse(JSON.stringify(newVal))
        setTimeout(() => {
          this.fileList.forEach(item => {
            this.onSuccess({ url: item.url }, {
              uid: item.uid,
              url: item.url
            })
          })
        })
      }
    },
    methods: {
      /** 编辑自定义参数 */
      handleEditItem(file) {
        let { uid } = file
        let curData = JSON.parse(JSON.stringify(this.dataMap.get(uid)))
        let deTarget = this.fileList.filter(item => item.uid === uid)[0]
        if (deTarget && deTarget.opt) {
          curData.operation.forEach(opt => (opt.value = deTarget.opt[opt.name]))
        }
        this.curEdit = curData
      },
      /** 图片上传成功 */
      onSuccess(response, file, fileList) {
        let obj = {
          response,
          uid: file.uid,
          blob: file.url,
          operation: JSON.parse(JSON.stringify(this.operation))
        }
        this.dataMap.set(file.uid, obj)
        this.countNums()
      },
      /** 移除时触发 */
      onRemove(file, fileList) {
        this.dataMap.delete(file.uid)
        this.countNums()
      },
      /** 保存自定义参数 */
      handleSaveEdit() {
        this.dataMap.set(this.curEdit.uid, this.curEdit)
        this.curEdit = ''
      },
      /** 确认 */
      handleConfirm() {
        let list = []
        this.dataMap.forEach((value, key, map) => {
          let opt = {}
          value.operation.forEach(item => (opt[item.name] = item.value))
          list.push({
            uid: key,
            blob: value.blob,
            response: value.response,
            operation: opt
          })
        })
        this.$emit('confirm', list)
        this.$emit('close')
        this.$refs['elUpload'].clearFiles()
        this.dataMap = new Map()
      },
      countNums() {
        this.nums = {
          successUpload: this.dataMap.size,
          canUpload: this.limit - this.dataMap.size
        }
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  $border-style: 1px solid #ccc;
  .image-picker-title {
    text-align: center;
    padding-bottom: 20px;
    border-bottom: $border-style;
  }
  .image-picker-body {
    display: flex;
    position: relative;
    flex-direction: column;
    margin-bottom: 10px;
  }
  /deep/ {
    .el-dialog__body {
      padding: 0 20px;
    }
    .upload-box {
      display: flex;
      flex-direction: column-reverse;
      align-self: center;
      &:hover .inner-opt { border-color: #409EFF }
      &.edit .el-upload-dragger {
        position: absolute;
        top: 0;
        left: 50%;
        z-index: 99;
        margin-left: -300px;
        cursor: auto;
        text-align: left;
      }
      .el-icon-zoom-in:before { content: '\E616' }
    }
    .el-upload-list{
      display: block;
      max-height: 200px;
      min-width: 765px;
      min-height: 180px;
      overflow-y: scroll;
      border: 1px solid #d9d9d9;
      padding: 10px 0 10px 10px;
      &:hover { border-color: #409EFF }
    }
    .el-upload {
      width: auto;
      height: auto;
      line-height: normal;
      border: none;
      align-self: center;
      margin-bottom: 10px;
    }
    .el-upload-dragger {
      width: 600px;
    }
    .el-upload-list__item {
      width: 142px;
      height: 142px;
    }
    .opt-body {
      height: 130px;
      margin: 10px 10px 0 10px;
    }
    .inner-opt {
      width: 100%;
      height: 100%;
      border-bottom: 1px dashed #d9d9d9;
      overflow-y: auto;
    }
    .item-opt {
      display: inline-block;
      position: relative;
      width: 284px;
      font-size: 12px;
      margin-bottom: 10px;
      &:nth-child(2n) { margin-left: 10px }
      .el-input-group--prepend .el-select .el-input.is-focus .el-input__inner {
        border-color: #409EFF
      }
    }
    .opt-footer {
      height: 40px;
      text-align: center;
      .el-button {
        width: 78px;
        height: 28px;
        line-height: 28px;
        padding: 0;
        margin-top: 5px;
      }
    }
  }
  .image-picker-body {
    min-height: 350px;
  }
  .upload-status-num {
    font-size: 14px;
    span {
      color: red;
      margin-right: 10px;
    }
  }
  .image-picker-footer {
    display: flex;
    justify-content: space-between;
    padding-top: 15px;
    border-top: $border-style;
  }
</style>
