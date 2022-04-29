<template>
  <div class="ship-template">
    <el-form
      ref="templateForm"
      :model="templateForm"
      :rules="templateRules"
      label-width="150px"
    >
      <el-form-item label="Template Name" prop="name">
        <el-input
          v-model="templateForm.name"
          placeholder="Please fill in the template name"
          style="width: 300px"
        />
      </el-form-item>
      <el-form-item label="Template Areas" prop="items">
        <el-select
          v-model="addArea"
          v-loading="areasLoading"
          @change="handleSelectArea"
          placeholder="Select a area"
          style="width: 300px"
        >
          <el-option
            v-for="item in areas"
            :key="item.id"
            :value="item.id"
            :label="item.name"
            :disabled="selectedAreaIds.includes(item.id)"
          />
        </el-select>
        <div class="area-list">
          <div v-for="(item, index) in templateForm.items" :key="item.rate_area_id" class="area-item">
            <div class="item-header">
              <span>{{ item.rate_area_name }}</span>
              <el-dropdown size="mini" type="primary" @command="command => handleCommand(command, index)">
                <el-button type="primary">
                  <i class="el-icon-setting"></i><i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="PRICE">{{ item.items['PRICE'] ? 'Remove' : 'Add' }} price conditions</el-dropdown-item>
                  <el-dropdown-item command="WEIGHT">{{ item.items['WEIGHT'] ? 'Remove' : 'Add' }} weight conditions</el-dropdown-item>
                  <el-dropdown-item command="ITEMS">{{ item.items['ITEMS'] ? 'Remove' : 'Add' }} items conditions</el-dropdown-item>
                  <el-dropdown-item command="remove" divided>Remove rate area from shipping</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="item-body">
              <template v-for="type in Object.keys(item.items)">
                <el-table :data="item.items[type]" :key="type">
                  <el-table-column :label="`${type.replace(/^\S/, s => s.toUpperCase())} condition`">
                    <template slot-scope="{ row }">
                      <el-input v-model="row.region_start" plceholder="From"><span slot="prepend">$</span></el-input>
                      <span class="interval">-</span>
                      <el-input v-model="row.region_end" plceholder="To"><span slot="prepend">$</span></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="Surcharge / Discount" width="200">
                    <template slot-scope="{ row }">
                      <el-input v-model="row.amt" class="input-with-select">
                        <span slot="prepend">{{ row.amt_type === 'ABSOLUTE' ? '$' : '%' }}</span>
                        <el-select v-model="row.amt_type" slot="append">
                          <el-option label="Absolute ($)" value="ABSOLUTE"></el-option>
                          <el-option label="Cart Percentage (%)" value="PERCENTAGE"></el-option>
                        </el-select>
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="" width="120" align="center">
                    <template slot-scope="scope">
                      <el-button
                        v-if="scope.$index === item.items[type].length - 1"
                        size="mini"
                        icon="el-icon-plus"
                        @click="handleAddCondition(index, type)"
                      />
                      <el-button
                        v-if="scope.$index !== 0 && scope.$index === item.items[type].length - 1"
                        size="mini"
                        type="danger"
                        icon="el-icon-delete"
                        @click="handleDeleteCondition(index, scope.$index, type)"
                      />
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" @click="handleSave">Save</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as API_Shop from '@/api/shop'
import * as API_RateArea from '@/api/rateArea'

export default {
  name: 'shipTemplateDetail',
  data() {
    return {
      templateId: '',
      templateForm: {
        name: '',
        items: []
      },
      templateRules: {
        name: [this.MixinRequired('Please fill in the template name')],
        items: [{ type: 'array', required: true, message: 'Please add a region', trigger: 'change' }]
      },
      areas: [],
      areasLoading: false,
      addArea: ''
    }
  },
  watch: {
    $route: {
      immediate: true,
      async handler(newVal) {
        await this.getAllRateAreas()
        if (!['addShipTemplate', 'editShipTemplate'].includes(newVal.name)) return
        const { id } = newVal.params
        if (!id) return
        this.templateId = id
        this.getShipTemplateDetail()
      }
    }
  },
  computed: {
    selectedAreaIds() {
      const { items } = this.templateForm
      if (!items) return []
      return items.map(item => item['rate_area_id'])
    }
  },
  methods: {
    // Get ship template detail
    getShipTemplateDetail() {
      API_Shop.getShipTemplateDetail(this.templateId).then(res => {
        if (!res) return
        res.items.forEach(item => {
          const items = {}
          item.items.forEach(con => {
            const type = con.conditions_type
            if (!items[type]) items[type] = []
            items[type].push(con)
          })
          item.items = items
        })
        this.templateForm = JSON.parse(JSON.stringify(res))
      })
    },
    // Get all rate areas
    getAllRateAreas() {
      return new Promise((resolve, reject) => {
        this.areasLoading = true
        API_RateArea.getAllRateAreas({ page_no: 1, page_size: 9990 }).then(res => {
          this.areas = res.data
          resolve()
        }).catch(reject)
          .finally(() => {
            this.areasLoading = false
          })
      })
    },
    // Handle select area
    handleSelectArea(areaId) {
      const area = this.areas.find(item => item.id === areaId)
      if (!area) return
      const item = {
        rate_area_id: areaId,
        rate_area_name: area.name,
        items: {}
      }
      this.templateForm.items.push(item)
      const index = this.templateForm.items.length - 1
      this.handleAddCondition(index, 'PRICE')
      this.handleAddCondition(index, 'WEIGHT')
      this.handleAddCondition(index, 'ITEMS')
      this.addArea = ''
    },
    // Handle command
    handleCommand(command, index) {
      if (command === 'remove') {
        return this.templateForm.items.splice(index, 1)
      }
      this.handleAddOrRemoveItem(index, command)
    },
    // Handle add or remove item
    handleAddOrRemoveItem(index, type) {
      let item = this.templateForm.items[index]
      item = JSON.parse(JSON.stringify(item))
      if (item.items[type]) {
        delete item.items[type]
      } else {
        item.items[type] = [{ amt_type: 'PERCENTAGE', amt: 5, region_start: '', region_end: '' }]
      }
      this.$set(this.templateForm.items, index, item)
    },
    // Handle add condition
    handleAddCondition(index, type) {
      const item = JSON.parse(JSON.stringify(this.templateForm.items[index]))
      if (!item.items[type]) item.items[type] = []
      const initData = { amt_type: 'PERCENTAGE', amt: '', region_start: '', region_end: '' }
      item.items[type].push(initData)
      this.$set(this.templateForm.items, index, item)
    },
    // Handle delete condition
    handleDeleteCondition(areaIndex, index, type) {
      this.templateForm.items[areaIndex].items[type].splice(index, 1)
    },
    // Handle save
    handleSave() {
      this.$refs['templateForm'].validate(async valid => {
        if (!valid) return this.$message.error('The form is incorrectly filled in, please check it')
        const params = JSON.parse(JSON.stringify(this.templateForm))
        params.items.forEach(item => {
          const items = []
          let index = 0
          Object.keys(item.items).forEach(key => {
            const con = item.items[key]
            con.forEach(c => {
              items.push({ conditions_type: key, sort: ++index, ...c })
            })
          })
          item.items = items
        })
        if (this.templateId) {
          await API_Shop.updateShipTemplate(this.templateId, params)
          this.templateForm.name = ''
          this.templateForm.items = []
          this.$message.success('Add successful')
        } else {
          await API_Shop.addShipTemplates(params)
          this.$message.success('Update successful')
        }
        this.$refs['templateForm'].resetFields()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ship-template {
  background-color: #ffffff;
  padding: 10px;
  .area-list {
    width: 700px;
    .area-item {
      width: 100%;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-top: 10px;
      padding: 20px;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
    }
  }
  .item-body {
    margin-top: 10px;
    /deep/ {
      .el-table__header-wrapper tr,
      .el-table__header-wrapper th, {
        background-color: #f7f7f7;
      }
      tbody {
        .cell {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .interval {
          margin: 0 10px;
        }
      }
    }
  }
}
</style>
