<template>
  <div class="tree-menu" v-loadmore="loadmore">
    <ul v-for="menuItem in treeData" :key="menuItem.id">
      <en-tree-item :model="menuItem" @selectCaputure="onselected"></en-tree-item>
    </ul>
  </div>
</template>
<script>
  import treeItem from './treeItem.vue'
  export default {
    name: 'EnTreeList',
    props: {
      /** The data in a tree*/
      treeData: {
        type: Object,
        default: () => ({})
      },

      /** Whether to complete the shuttle left and right*/
      isCompleted: {
        type: Boolean,
        default: false
      },

      /** Selected data is passed in when all are selected*/
      selectedAllData: {
        type: Object,
        default: {}
      }
    },
    components: {
      [treeItem.name]: treeItem
    },
    data() {
      return {
        /** Regional data（All the data） */
        areaData: {},

        /** The selected data*/
        chooseData: {}
      }
    },
    watch: {
      isCompleted() {
        if (this.isCompleted) {
          this.chooseData = {}
        }
      },
      selectedAllData() {
        if (Object.keys(this.selectedAllData).length) {
          this.chooseData = this.selectedAllData
        }
      },
      chooseData() {
        if (!Object.keys(this.chooseData).length) { // If its an empty object
          this.$emit('listenCompleted', false)
        }
      },
      treeData() {
        // Object deep copy
        this.areaData = JSON.parse(JSON.stringify(this.treeData))
      }
    },
    mounted() {
      // Object deep copy
      this.areaData = JSON.parse(JSON.stringify(this.treeData))
    },
    methods: {
      /** To load more*/
      loadmore() {
        console.log('The scroll load is triggered')
      },
      /** Listening for selected data*/
      onselected(model, parentNode) { // Listen for the response after it is selected to calculate the data after it is now selected
        if (model.isSelected) { // Add selected data when selected Calculate selected data
          switch (model.level) {
            case 1: this.chooseData[model.id] = JSON.parse(JSON.stringify(model))
              break
            case 2: this.addLevelTwoData(model, parentNode)
              break
            case 3: this.addLevelThreeData(model, parentNode)
              break
          }
        } else { // Delete Selected data Deletes items from selected data
          switch (model.level) {
            case 1: delete this.chooseData[model.id]
              break
            case 2: this.delLevelTwoData(model, parentNode)
              break
            case 3: this.delLevelThreeData(model, parentNode)
              break
          }
        }
        this.$emit('getChooseData', this.chooseData)
      },

      /** addlevel2data*/
      addLevelTwoData(model, parentNode) { // Gets the selected data tree object
        let isExit = false // Parent node or not（level1）Existing does not exist by default
        for (let i in this.chooseData) {
          if (parseInt(parentNode.id) === parseInt(i)) { // There are
            isExit = true
          }
        }
        if (!isExit) { // If it doesnt exist
          this.chooseData[parentNode.id] = JSON.parse(JSON.stringify(parentNode))
          this.chooseData[parentNode.id].children = {}
        }
        this.chooseData[parentNode.id].children[model.id] = JSON.parse(JSON.stringify(model))
      },

      /** addlevel3data*/
      addLevelThreeData(model, parentNode) {
        let isExitLevel1 = false // Ancestor node（level1）Existing does not exist by default
        for (let i in this.chooseData) {
          if (parseInt(parentNode.parent_id) === parseInt(i)) { // Father node（level1）There are
            isExitLevel1 = true
          }
        }
        if (isExitLevel1) { // If the ancestor node exists
          let isExitLevel2 = false // Parent node or not（level2）Existing does not exist by default
          for (let j in this.chooseData[parentNode.parent_id].children) {
            if (parseInt(parentNode.id) === parseInt(j)) { // There are
              isExitLevel2 = true
            }
          }
          if (!isExitLevel2) { // Object that assigns and empties the parent if the parent does not existchildrenattribute
            this.chooseData[parentNode.parent_id].children[parentNode.id] = JSON.parse(JSON.stringify(parentNode))
            this.chooseData[parentNode.parent_id].children[parentNode.id].children = {}
          }
        } else { // If the ancestor does not exist, add the ancestor and empty itchildrenattribute
          this.chooseData[parentNode.parent_id] = this.areaData[parentNode.parent_id]
          this.chooseData[parentNode.parent_id].children = {}
          // At this point, the parent node must not exist to add the parent node and nullify the parent node children attribute
          this.chooseData[parentNode.parent_id].children[parentNode.id] = JSON.parse(JSON.stringify(parentNode))
          this.chooseData[parentNode.parent_id].children[parentNode.id].children = {}
        }
        // Adds the current node to the corresponding location
        this.chooseData[parentNode.parent_id].children[parentNode.id].children[model.id] = JSON.parse(JSON.stringify(model))
      },

      /** deletelevel2data*/
      delLevelTwoData(model, parentNode) {
        delete this.chooseData[parentNode.id].children[model.id]
        this.chooseData[parentNode.id].isSelected = false
      },

      /** deletelevel3data*/
      delLevelThreeData(model, parentNode) {
        delete this.chooseData[parentNode.parent_id].children[parentNode.id].children[model.id]
        this.chooseData[parentNode.parent_id].children[parentNode.id].isSelected = false
      }
    }
  }
</script>
<style type="text/css" lang="scss" scoped>
  .tree-menu {
    overflow-y: scroll;
    height: 100%;
    & > ul {
      & li {
        text-align: left;
      }
    }
  }
</style>
