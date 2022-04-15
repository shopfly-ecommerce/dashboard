<template>
  <div style="display: inline-block;">
    <el-button size="mini" @click="handleSetPriceRange">Set a price range</el-button>
    <el-dialog
      title="Set a price range"
      :visible.sync="dialogVisible"
      width="450px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form label-width="50px" class="price-range-form">
        <template v-for="(item, index) in priceRange">
          <el-form-item :label="'The first' + (index + 1) + 'group'">
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
        <el-button size="small" @click="dialogVisible = false">cancel</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'EnPriceRange',
    props: {
      // Maximum number of interval groups
      maxRange: {
        type: Number,
        default: 10
      },
      // The default interval
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
      // The opening check is passed in the default price range
      if (this.defaultRange.length > this.maxRange) {
        throw new Error('The passed default price range length is greater than the maximum length limit！')
      }
      this.defaultRange.forEach((item, index) => {
        let preRange = this.defaultRange[index - 1]
        if (item[0] >= item[1] || preRange && preRange[0] >= item[0]) {
          throw new Error('The format of the default price range passed in is incorrect！')
        }
      })
    },
    methods: {
      handleSetPriceRange() {
        this.dialogVisible = true
      },
      /** Add an interval*/
      handleAddRange() {
        // If the value exceeds or equals the maximum value, or the last value fails the check, the value is not increased
        if (this.priceRange.length >= this.maxRange || !this.validLastVal()) return
        // Take the last array
        let priceRange = this.priceRange
        let last_range = priceRange[priceRange.length - 1]
        // If the second value of the last set is null, 0, or less than or equal to the previous value, it is not incremented
        // The first value of the new array is 1, and the second value defaults to the previous value +1
        this.priceRange.push([last_range[1], last_range[1] + 1])
      },
      /** Delete an interval*/
      handleDeleteRange() {
        // If there is one left, it will not be deleted
        if (this.priceRange.length <= 1) return
        this.priceRange.pop()
      },
      // Verify that the last number meets the requirement
      validLastVal() {
        let priceRange = this.priceRange
        let last_range = priceRange[priceRange.length - 1]
        return !!(last_range[1] && last_range[1] > last_range[0])
      },
      /** Confirm the callback*/
      handleConfirm() {
        if (!this.validLastVal()) {
          this.$message.error('The second value of the last interval needs to be greater than the first value！')
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
