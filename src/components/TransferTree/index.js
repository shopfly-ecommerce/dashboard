import Vue from 'vue'
import TransferTree from './TransferTree'

TransferTree.install = () => {
  Vue.component(TransferTree.name, TransferTree)
}

// yp Suggestions for future refactoring of tree selector and freight template logic： Display data is separated from actual data
// The data displayed in the selector is its internal operation data. The operation data in the freight template logic is the external actual operation data

export default TransferTree
