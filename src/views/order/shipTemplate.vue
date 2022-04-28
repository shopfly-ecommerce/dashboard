<template>
  <div class="ship-templates">
    <en-table-layout
      toolbar
      pagination
      :loading="loading"
      :tableData="tableData">
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button type="primary" size="mini" @click="handleAddShipTemplate">Create</el-button>
        </div>
        <div class="toolbar-search">
          <!--<en-table-search @search="searchEvent" placeholder="Name to search"/>-->
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column prop="name" label="Area Name"/>
        <el-table-column label="Operation">
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" @click="handleEditShipTemplate(row)">Edit</el-button>
            <el-button size="mini" type="danger" @click="handleDeleteShipTemplate(row)">Delete</el-button>
          </template>
        </el-table-column>
      </template>
    </en-table-layout>
  </div>
</template>

<script>
import * as API_Shop from '@/api/shop'

export default {
  name: 'shipTemplate',
  data() {
    return {
      loading: false,
      params: {},
      tableData: [],
      pageData: {},
      areas: []
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(newVal) {
        if (newVal.name !== 'shipTemplate') return
        this.getShipTemplates()
      }
    }
  },
  methods: {
    searchEvent(data) {
      this.params.keywords = data
      this.params.page_no = 1
      this.getShipTemplates()
    },
    // To add freight template
    handleAddShipTemplate() {
      this.$router.push({ name: 'addShipTemplate' })
    },
    // To edit freight template
    handleEditShipTemplate(row) {
      this.$router.push({ name: 'editShipTemplate', params: { id: row.id }})
    },
    // Delete freight template
    handleDeleteShipTemplate(row) {
      this.$confirm('Are you sure you want to delete this template ?', 'Tips', { type: 'warning' }).then(() => {
        API_Shop.deleteShipTemplate(row.id).then(() => {
          this.$message.success('Delete successful')
          this.getShipTemplates()
        })
      }).catch(() => {})
    },
    // Get ship templates
    getShipTemplates() {
      this.loading = true
      API_Shop.getShipTemplates(this.params).then(res => {
        this.tableData = res
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ship-templates {
  background-color: #ffffff;
}
</style>
