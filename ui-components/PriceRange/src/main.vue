<template>
  <div style="display: inline-block;">
    <el-button size="mini" @click="handleSetPriceRange">设置价格区间</el-button>
    <el-dialog
      title="设置价格区间"
      :visible.sync="dialogVisible"
      width="450px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form label-width="50px" class="price-range-form">
        <template v-for="(item, index) in priceRange">
          <el-form-item :label="'第' + (index + 1) + '组'">
            <el-input-number size="mini" v-model="item[0]" disabled :controls="false"></el-input-number>
             -
            <el-input-number size="mini" v-model="item[1]" :disabled="index !== priceRange.length - 1" :controls="false"></el-input-number>
            <template v-if="index === priceRange.length - 1">
              <el-button v-if="index !== 0" type="text" size="mini" icon="el-icon-delete" style="margin-left: 5px; color: red" @click="handleDeleteRange"></el-button>
              <el-button type="text" size="mini" icon="el-icon-plus" style="margin-left: 0" @click="handleAddRange"></el-button>
            </template>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'EnPriceRange',
    props: {
      // 最大区间组数
      maxRange: {
        type: Number,
        default: 10
      },
      // 默认区间
      defaultRange: {
        type: Array,
        default: () => [[0, 100]]
      }
    },
    data() {
      return {
        dialogVisible: false,
        priceRange: JSON.parse(JSON.stringify(this.defaultRange))
      }
    },
    created() {
      // 开局校验传入默认价格区间
      if (this.defaultRange.length > this.maxRange) {
        throw new Error('传入默认价格区间长度大于最大长度限制！')
      }
      this.defaultRange.forEach((item, index) => {
        let preRange = this.defaultRange[index - 1]
        if (item[0] >= item[1] || preRange && preRange[0] >= item[0]) {
          throw new Error('传入默认价格区间格式有误！')
        }
      })
    },
    methods: {
      handleSetPriceRange() {
        this.dialogVisible = true
      },
      /** 增加一个区间 */
      handleAddRange() {
        // 如果超过或等于最大个数，或最后一个值没校验通过，则不增加
        if (this.priceRange.length >= this.maxRange || !this.validLastVal()) return
        // 取最后一个数组
        let priceRange = this.priceRange
        let last_range = priceRange[priceRange.length - 1]
        // 如果最后一组第二个值为空、为0或小于等于前一个值，则不增加
        // 新增数组第一个值为前一组第一个值1，第二个值默认为前一个值+1
        this.priceRange.push([last_range[1], last_range[1] + 1])
      },
      /** 删除一个区间 */
      handleDeleteRange() {
        // 如果还剩一个，则不删除
        if (this.priceRange.length <= 1) return
        this.priceRange.pop()
      },
      // 校验最后一个数是否符合要求
      validLastVal() {
        let priceRange = this.priceRange
        let last_range = priceRange[priceRange.length - 1]
        return !!(last_range[1] && last_range[1] > last_range[0])
      },
      /** 确认回调 */
      handleConfirm() {
        if (!this.validLastVal()) {
          this.$message.error('最后一个区间的第二个值需要大于第一个值！')
          return false
        }
        this.$emit('changed', JSON.parse(JSON.stringify(this.priceRange)))
        this.dialogVisible = false
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .price-range-form {
    /deep/ .el-input-number {
      width: 110px;
    }
    .el-form-item {
      margin-bottom: 10px;
    }
    .el-button--text {
      padding: 0 5px;
    }
  }
</style>
