/**
 * 百度UE
 */
import Vue from 'vue'
import UE from './src/main'

UE.install = () => {
  Vue.component(UE.name, UE)
}

export default UE
