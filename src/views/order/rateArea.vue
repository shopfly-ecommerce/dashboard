<template>
  <div class="rate-areas">
    <en-table-layout
      toolbar
      pagination
      :loading="loading"
      :tableData="tableData">
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button type="primary" size="mini" @click="handleAddRateArea">Create</el-button>
        </div>
        <div class="toolbar-search">
          <en-table-search @search="searchEvent" placeholder="Type to search"/>
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column prop="name" label="Area Name"/>
        <el-table-column label="Operation">
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" @click="handleEditArea(row)">Edit</el-button>
            <el-button size="mini" type="danger" @click="handleDeleteArea(row)">Delete</el-button>
          </template>
        </el-table-column>
      </template>
      <el-pagination
        slot="pagination"
        v-if="pageData"
        @size-change="handlePageSizeChange"
        @current-change="handlePageCurrentChange"
        :current-page="pageData.page_no"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageData.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.data_total">
      </el-pagination>
    </en-table-layout>
  </div>
</template>

<script>
import * as API_RateArea from '@/api/rateArea'

export default {
  name: 'rateArea',
  data() {
    return {
      loading: false,
      params: {
        page_no: 1,
        page_size: 10,
        ...this.$route.query
      },
      tableData: [],
      pageData: {},
      areas: []
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(newVal) {
        if (newVal.name !== 'rateArea') return
        this.GET_RateAreas()
      }
    }
  },
  methods: {
    handlePageSizeChange(size) {
      this.params.page_size = size
      this.GET_RateAreas()
    },
    handlePageCurrentChange(page) {
      this.params.page_no = page
      this.GET_RateAreas()
    },
    searchEvent(data) {
      this.params.keywords = data
      this.params.page_no = 1
      this.GET_RateAreas()
    },

    // To create rate area
    handleAddRateArea() {
      this.$router.push({ name: 'addRateArea' })
    },

    // Region selector callback
    handleAreaPickerChange(areas) {
      this.rateAreaForm.areaList = JSON.parse(JSON.stringify(areas))
    },
    // Edit area
    handleEditArea(row) {
      this.$router.push({ name: 'editRateArea', params: { id: row.id }})
    },
    // Delete area
    handleDeleteArea(row) {
      this.$confirm('Are you sure you want to delete this area ?', '提示', { type: 'warning' }).then(() => {
        API_RateArea.deleteRateArea(row.id).then(() => {
          this.$message.success('Delete successful')
          this.GET_RateAreas()
        })
      }).catch(() => {})
    },

    // Get a list of rate regions
    GET_RateAreas() {
      this.loading = true
      API_RateArea.getAllRateAreas(this.params).then(response => {
        this.loading = false
        this.tableData = response.data
        this.pageData = {
          page_no: response.page_no,
          page_size: response.page_size,
          data_total: response.data_total
        }
      })
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.rate-areas {
  background-color: #ffffff;
}
/deep/ div.toolbar {
  height: 70px;
  padding: 20px 0;
}
.inner-toolbar {
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 0 20px;
}

</style>

