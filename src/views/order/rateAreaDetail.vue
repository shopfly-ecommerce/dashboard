<template>
  <div class="rate-area-detail">
    <el-form ref="rateAreaForm" :model="rateAreaForm" :rules="rateAreaRules" label-width="120px">
      <el-form-item label="Area Name" prop="name">
        <el-input v-model="rateAreaForm.name" placeholder="Search by name" style="width: 220px"/>
      </el-form-item>
      <el-form-item v-if="rateAreaForm.areaList" label="Area Regions" prop="areaList">
        <el-select
          v-model="addCountry"
          v-loading="countryLoading"
          filterable
          style="width: 220px"
          @change="handleCountryChange"
        >
          <el-option
            v-for="item in countries"
            :key="item.code"
            :value="item.code"
            :label="item.name"
            :disabled="selectCountryCodes.includes(item.code)"
          />
        </el-select>
        <div class="area-items">
          <div v-for="(item, index) in rateAreaForm.areaList" :key="item.code" class="area-item">
            <div class="form-item header">
              <span class="label">{{ item.name }}</span>
              <el-button size="mini" type="danger" icon="el-icon-delete-solid" @click="deleteArea(index)"></el-button>
            </div>
            <div class="form-item select-all">
              <span class="label">All</span>
              <el-switch
                v-model="rateAreaForm.areaList[index].all"
                :disabled="item.has_state === 0"
                @change="handleAreaAllChange(item)"
              />
            </div>
            <div v-if="!item.all" class="form-item states">
              <span class="label">state</span>
              <div class="area-states">
                <el-select
                  v-model="item.states"
                  v-loading="item.stateLoading"
                  multiple
                  clearable
                  filterable
                  style="width: 100%"
                >
                  <el-option
                    v-for="state in stateOptions(item.code)"
                    :key="state.code"
                    :value="state.code"
                    :label="state.name"
                  />
                </el-select>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="">
        <el-button size="mini" type="primary" @click="handleSubmitRateArea">Save</el-button>
      </el-form-item>
    </el-form>
    <!--<el-dialog
      title="Create Area"
      :visible.sync="showRateAreaDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="450px"
    >
      <el-form ref="rateAreaForm" :model="rateAreaForm" :rules="rateAreaRules" label-width="120px">
        <el-form-item label="Area Name" prop="name">
          <el-input v-model="rateAreaForm.name" placeholder="Search by name" style="width: 220px"/>
        </el-form-item>
        <el-form-item label="Area Regions" prop="areaList">
          <en-area-picker
            multiple
            @change="handleAreaPickerChange"
            :default-val="rateAreaForm.areaList"
            :styles="{width: '220px'}"
            placeholder="Select or filter regions"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showRateAreaDialog = false">Close</el-button>
        <el-button type="primary" @click="handleSubmitRateArea">OK</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>

<script>
import * as API_RateArea from '@/api/rateArea'

export default {
  name: 'rateAreaDetail',
  data() {
    return {
      rateAreaId: '',
      rateAreaForm: {
        name: '',
        areaList: []
      },
      rateAreaRules: {
        name: [{ required: true, message: 'Please input area name', trigger: 'blur' }],
        areaList: [{ type: 'array', required: true, message: 'Please select region area', trigger: 'change' }]
      },
      addCountry: '',
      countries: [],
      countryLoading: false
    }
  },
  watch: {
    $route: {
      immediate: true,
      async handler(newVal) {
        await this.getAllCountries()
        if (!['addRateArea', 'editRateArea'].includes(newVal.name)) return
        const { id } = newVal.params
        if (!id) return
        this.rateAreaId = id
        this.$nextTick(() => {
          this.getRateAreaDetail()
        })
      }
    }
  },
  computed: {
    selectCountryCodes() {
      const { areaList } = this.rateAreaForm
      if (!areaList) return []
      return areaList.map(item => item.code)
    }
  },
  methods: {
    // Get rate area detail
    getRateAreaDetail() {
      API_RateArea.getRateAreaDetail(this.rateAreaId).then(res => {
        this.rateAreaForm.name = res.name
        const areaList = res.areas.map(item => {
          const country = this.countries.find(c => c.code === item.code)
          if (country.has_state === 0) {
            item.all = true
            item.has_state = 0
          } else if (!item.children || !item.children.length) {
            item.all = true
          } else {
            item.all = false
            item.states = item.children.map(c => c.code)
            if (!country.children) {
              this.loadCountryStates(country)
            }
          }
          return item
        })
        this.$set(this.rateAreaForm, 'areaList', areaList)
      })
    },
    // Submit rate area form
    handleSubmitRateArea() {
      this.$refs['rateAreaForm'].validate(async valid => {
        if (!valid) return this.$message.error('The form is incorrectly filled in, please check it')
        const params = {}
        const { name, areaList } = JSON.parse(JSON.stringify(this.rateAreaForm))
        params.name = name
        params.areas = areaList.map(item => {
          const country = this.countries.find(c => c.code === item.code)
          if (item.all || !country.children || !Array.isArray(country.children)) {
            item.children = []
          } else {
            item.children = country.children.filter(s => item.states.includes(s.code))
          }
          return {
            name: item.name,
            code: item.code,
            children: item.children
          }
        })
        if (this.rateAreaId) {
          await API_RateArea.updateRateArea(this.rateAreaId, params)
          this.$message.success('Update successfully')
          this.getRateAreaDetail()
        } else {
          await API_RateArea.addRateArea(params)
          this.$message.success('Added successfully')
          this.rateAreaForm.name = ''
          this.rateAreaForm.areaList = []
          this.$router.push({ name: 'rateArea' })
          await this.$store.dispatch('delCurrentViews', {
            view: this.$route,
            $router: this.$router
          })
        }
        this.$refs['rateAreaForm'].resetFields()
      })
    },
    // Get all countries or regions
    getAllCountries() {
      return new Promise((resolve, reject) => {
        this.countryLoading = true
        API_RateArea.getAllCountries().then(res => {
          this.countries = res
          resolve()
        }).catch(reject)
          .finally(() => {
            this.countryLoading = false
          })
      })
    },
    // Add area
    handleCountryChange(countryCode) {
      const country = this.countries.find(item => item.code === countryCode)
      if (!country) return
      const c = JSON.parse(JSON.stringify(country))
      c.all = true
      c.states = []
      c.stateLoading = false
      this.rateAreaForm.areaList.push(c)
      this.addCountry = ''
      this.$forceUpdate()
    },
    // Delete area
    deleteArea(index) {
      this.rateAreaForm.areaList.splice(index, 1)
    },
    // Handle select country all is changed
    handleAreaAllChange(item) {
      if (item.all) return
      if (item.children && item.children.length) return
      this.loadCountryStates(item)
    },
    // Load country state
    loadCountryStates(country) {
      country.stateLoading = true
      API_RateArea.getAreaState(country.code).then(res => {
        const c = this.countries.find(item => item.code === country.code)
        if (c) c.children = res
        this.$forceUpdate()
      }).finally(() => {
        country.stateLoading = false
      })
    },
    // Get state options
    stateOptions(countryCode) {
      const country = this.countries.find(item => item.code === countryCode)
      if (!country || !Array.isArray(country.children)) return []
      return country.children
    }
  }
}
</script>

<style lang="scss" scoped>
.rate-area-detail {
  padding: 10px;
  background-color: #ffffff;
  .area-item {
    padding: 20px;
    width: 500px;
    box-sizing: border-box;
    border: 1px solid #cccccc;
    margin-top: 10px;
    border-radius: 4px;
    .form-item {
      & + .form-item {
        margin-top: 10px;
      }
    }
    .header {
      display: flex;
      justify-content: space-between;
    }
    .label {
      margin-right: 50px;
    }
    .states {
      .area-states {
        display: flex;
        flex-wrap: wrap;
      }
    }
  }
}
</style>
