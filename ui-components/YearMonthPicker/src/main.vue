<template>
  <div style="display: inline-block">
    <el-select v-if="optional" :disabled="disableddate" v-model="date_type" placeholder="请选择" style="width: 100px">
      <el-option label="按月" value="month"/>
      <el-option label="按年" value="year"/>
    </el-select>
    <el-date-picker
      style="width: 130px"
      v-model="date_val"
      @change="handleDateChange"
      :disabled="disabled"
      :editable="editable"
      :clearable="clearable"
      :type="date_type"
      :value-format="date_type === 'month' ? 'yyyy-MM' : 'yyyy'"
      :placeholder="date_type === 'month' ? '选择月份' : '选择年份'"
      :picker-options="{disabledDate(time) { return time.getTime() > Date.now() }}">
    </el-date-picker>
  </div>
</template>

<script>
  export default {
    name: 'EnYearMonthPicker',
    props: {
      editable: {
        type: Boolean,
        default: false
      },
      clearable: {
        type: Boolean,
        default: false
      },
      optional: {
        type: Boolean,
        default: true
      },
      disableddate: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        date_type: 'year',
        date_val: this.getCurrentYearMonth().o,
        l_date_val: this.getCurrentYearMonth().l_o
      }
    },
    watch: {
      date_type(newVal) {
        this.date_val = newVal === 'month'
          ? this.getCurrentYearMonth().o
          : this.getCurrentYear().o
        this.l_date_val = newVal === 'month'
          ? this.getCurrentYearMonth().l_o
          : this.getCurrentYear().l_o
        this.handleDateChange()
      }
    },
    mounted() {
      this.handleDateChange()
    },
    methods: {
      /** 获取当前年份 */
      getCurrentYear() {
        return {
          o: new Date().getFullYear() + '',
          l_o: new Date().getFullYear() - 1 + ''
        }
      },
      /** 获取当前年月 */
      getCurrentYearMonth() {
        let _cy = new Date().getFullYear() + ''
        let _l_cy = new Date().getFullYear() - 1 + ''
        let _cm = (() => {
          let __cm = new Date().getMonth() + 1
          return __cm > 9 ? __cm : '0' + __cm
        })()
        let _l_cm = (() => {
          let __cm = new Date().getMonth()
          return __cm > 9 ? __cm : '0' + __cm
        })()
        return {
          o: _cy + '-' + _cm,
          l_o: _l_cy + '-' + _l_cm
        }
      },
      /** 日期发生改变 */
      handleDateChange() {
        let is_year = this.date_type === 'year'
        let val = this.date_val
        let l_val = this.l_date_val
        let _y = val.substr(0, 4)
        let l_y = l_val.substr(0, 4)
        let _m = val.substr(5, 2)
        let l_m = l_val.substr(5, 2)
        let obj = {
          type: this.date_type.toLocaleUpperCase(),
          year: _y,
          last_year: l_y,
          month: _m,
          last_month: l_m,
          year_month: val,
          last_year_month: l_val,
          start_time: val + (is_year ? '-01' : '') + '-01 00:00:00',
          last_start_time: l_val + (is_year ? '-01' : '') + '-01 00:00:00',
          end_time: val + (is_year ? '-12' : '') + '-' + new Date(_y, _m, 0).getDate() + ' 23:59:59',
          last_end_time: l_val + (is_year ? '-12' : '') + '-' + new Date(l_y, l_m, 0).getDate() + ' 23:59:59'
        }
        this.$emit('changed', obj)
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>

</style>
