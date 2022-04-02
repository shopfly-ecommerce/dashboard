<template>
  <div>
    <el-table
    :data="tableData"
    border
    :span-method="arraySpanMethod"
    style="width: 100%">
      <el-table-column
        v-for="(item, index) in tablehead"
        v-if="item !== 'spec_value_id'"
        :key="item"
        :label="labeltxt(item)"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="checkFixed(item)">
            <span v-if="item === 'price'"> {{ scope.row[item] | unitPrice('￥')}}</span>
            <span v-else> {{ scope.row[item] }}</span>
          </span>
          <div v-else class="input-error-model">
            <el-input
              :disabled="isEditModel === 1 && item==='quantity'"
              :maxlength="30"
              v-model="scope.row[item]"
              @change="scope.row[item] = scope.row[item].trim()"
              @input="updateSkuTable(index, scope, item)"
              @blur="updateSkuTable(index, scope, item)">
            </el-input>
            <span
              class="input-error"
              v-if="item !== 'sn'"
              v-show="isValidate(index, scope)">{{ validatatxt }}
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <p v-if="isEditModel === 1" class="stock-tip"> 提示: 编辑商品规格时不允许进行库存编辑，请到商品列表单独维护库存 </p>
    <div class="batch-all" v-show="tablehead && tablehead.length">
      <span>批量设置：</span>
      <div v-show="isShowBatch">
        <el-button type="text" size="mini" @click="setBatch(1)">价格</el-button>
        <el-button v-if="isEditModel !== 1" type="text" size="mini" @click="setBatch(2)">库存</el-button>
      </div>
      <div v-show="!isShowBatch">
        <el-input v-model="batch" size="mini" style="width: 100px;"></el-input>
        <el-button type="text" size="mini" @click="saveBatch">保存</el-button>
        <el-button type="text" size="mini" @click="cancelBatch">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { RegExp } from '~/ui-utils'
  export default {
    name: 'skuTable',
    props: {
      /** 当前模式 发布商品0 编辑商品1 编辑草稿箱商品2 */
      isEditModel: {
        type: Number,
        default: 1
      },

      /** 是否自动生成货号 */
      productSn: {
        type: Boolean,
        default: false
      },

      /** 当前商品编号 */
      goodsSn: {
        type: [String, Number],
        default: ['', 0]
      },

      /** 列表信息 */
      skuInfo: {
        type: Array,
        default: [{
          sn: '',
          weight: '',
          quantity: 0,
          cost: '',
          price: ''
        }]
      },

      /** 表头信息 */
      tablehead: {
        type: Array,
        default: []
      }
    },
    watch: {
      skuInfo() {
        this.tableData = this.skuInfo
        this.concactArray = []
        this.tableData.forEach((key, index) => {
          this.concactArrayCom(index, key)
        })
      },

      /** 自动生成货号 */
      productSn() {
        if (this.productSn && this.tableData.length > 0) {
          let count = 1
          this.tableData.forEach(key => {
            key.sn = this.goodsSn + '-00000' + count
            count++
          })
          /** 异步更新skuInfo数据 */
          this.$emit('skuTable', this.tableData)
        }
      }
    },
    mounted() {
      this.tableData = this.skuInfo
      this.tableData.forEach((key, index) => {
        this.concactArrayCom(index, key)
      })
    },
    data() {
      return {
        /** 是否显示批量设置的值 */
        isShowBatch: true,

        /** 批量设置的值 */
        batch: '',

        /** 当前操作的值 1价格 2库存 */
        activeVal: 0,

        /** 列表数据 */
        tableData: this.skuInfo,

        /** 要合并的列的位置数组 */
        concactArray: [],

        /** 固定列校验提示内容 */
        validatatxt: '请输入0~99999999之间的数字值',

        /** 存储未通过校验的单元格位置  */
        validateError: []
      }
    },
    methods: {

      /** 固定表头文本格式化 */
      labeltxt(item) {
        let _output = ''
        switch (item) {
          case 'sn': _output = '货号'; break
          case 'weight': _output = '重量(kg)'; break
          case 'quantity': _output = '库存'; break
          case 'cost': _output = '成本价'; break
          case 'price': _output = '价格(元)'; break
          default: _output = item
        }
        return _output
      },

      /** 当前表头是否属于固定表头的鉴定 */
      checkFixed(item) {
        if (item === 'sn' || item === 'weight' || item === 'quantity' || item === 'cost' || item === 'price') {
          return false
        }
        return true
      },

      /** 合并数据相同的单元格 */
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex < this.tablehead.length - 5) {
          const _row = this.concactArray[rowIndex][columnIndex]
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      },

      /** 计算要合并列的位置 */
      concactArrayCom(index, item) {
        let _isMerge = false
        /** 循环列 先循环第一列 若相同则合并 再循环第二列 依次循环 若不相同 则不合并并终止此列循环开始下一列循环 */
        let _currnetRow = []
        for (let i = 0, _len = this.tablehead.length - 5; i < _len; i++) {
          if (this.tablehead[i] === 'spec_value_id') {
            i++
            continue
          }
          if (index > 0 && item[this.tablehead[i]] !== this.skuInfo[index - 1][this.tablehead[i]]) {
            _currnetRow[i] = 1
            _isMerge = true
          } else if (index > 0 && !_isMerge) {
            _currnetRow[i] = 0
            let _count = 1
            while (this.concactArray[index - _count][i] === 0) {
              _count++
            }
            this.concactArray[index - _count][i] += 1
          } else { // index === 0
            _currnetRow[i] = 1
          }
        }
        this.concactArray.push(_currnetRow)
      },

      /** 检测是否未通过0-99999999之间的数字校验 */
      isValidate(index, scope) {
        return this.validateError.some(key => {
          return key[0] === index && key[1] === scope.$index
        })
      },

      /** 批量设置价格*/
      setBatch(val) {
        this.batch = ''
        this.isShowBatch = !this.isShowBatch
        this.activeVal = val
      },

      /** 保存批量设置值 */
      saveBatch() {
        const _desc = this.activeVal === 1 ? '价格' : '库存'
        const checkResult = this.activeVal === 1 ? RegExp.money.test(this.batch) : parseInt(this.batch) >= 0 && parseInt(this.batch) < 99999999 && /^[0-9]\d*$/.test(this.batch)
        if (!checkResult) {
          this.batch = ''
          this.activeVal === 1 ? this.$message.error(`请输入一个有效的${_desc}数据，最大值不超过99999999`) : this.$message.error(`${_desc}最大值不超过99999999,${_desc}为正整数`)
          return
        }
        /** 批量设置 */
        this.activeVal === 1 ? this.tableData.forEach(key => { key.price = this.batch }) : this.tableData.forEach(key => { key.quantity = this.batch })
        this.isShowBatch = !this.isShowBatch
        /** 异步更新skuInfo数据 */
        this.$emit('skuTable', this.tableData)
      },

      /** 取消批量设置值 */
      cancelBatch() {
        this.isShowBatch = !this.isShowBatch
      },

      /** 数据改变之后 抛出数据 */
      updateSkuTable(index, scope, item) {
        /** 进行自定义校验 判断是否是数字（小数也能通过）重量 */
        if ((!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(scope.row[item]) && item === 'weight') || parseInt(scope.row[item]) < 0 || parseInt(scope.row[item]) > 99999999) { // 校验未通过 加入错误存储列表中
          this.validateError.push([index, scope.$index])
          this.validatatxt = '请输入0~99999999之间的数字值'
        } else if ((item === 'quantity' && !/^[0-9]\d*$/.test(scope.row[item])) || parseInt(scope.row[item]) < 0 || parseInt(scope.row[item]) > 99999999) { // 库存
          this.validateError.push([index, scope.$index])
          this.validatatxt = '请输入0~99999999之间的整数'
        } else if (((item === 'cost' || item === 'price') && !RegExp.money.test(scope.row[item])) || parseInt(scope.row[item]) < 0 || parseInt(scope.row[item]) > 99999999) { // 成本价 价格
          this.validateError.push([index, scope.$index])
          this.validatatxt = '请输入0~99999999之间的价格'
        } else {
          this.validateError.forEach((key, _index) => {
            if (key[0] === index && key[1] === scope.$index) {
              this.validateError.splice(_index, 1)
            }
          })
        }
        /** 异步更新skuInfo数据 */
        this.$emit('skuTable', this.tableData)
      }
    }
  }
</script>

<style lang="scss" type="scss" scoped>
  /** 批量设置 */
  .batch-all {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
  }
  /*带校验模块*/
  .input-error-model {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    color: red;
    line-height: 16px;
    margin-bottom: 20px;
    span {
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      position: absolute;
      top: 60%;
      left: 6%;
    }
  }
  /deep/ .validat_error {
    border-color: red;
  }

  p.stock-tip {
    color: #f00;
    font-size: 13px;
  }
</style>
