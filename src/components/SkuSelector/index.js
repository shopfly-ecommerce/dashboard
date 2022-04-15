/**
 * Product specification selector
 */
import Vue from 'vue'
import SkuSelector from './src/main'

SkuSelector.install = () => {
  Vue.component(SkuSelector.name, SkuSelector)
}

export default SkuSelector

/**
 * The construction idea of commodity specification selector
 * Divided intomainMaster fileskuItem skuTableTwo subfiles
 *
 * mainThe master file completes the following events：（Receive information and give it back to the outside world）
 * 1：Receive external information（Including fixed parameters+ Product specification information） Receive external information（Commodity information needs to be calculated and processed）Passed to theskuItem skuTableTwo subfiles
 * 2：acceptskuIteminformation=》 computing（getskuTableThe data required for the table）=》 Pass data toskuTableTo render
 * 3：receiveskutable Specification data of=》computing（Get the final data that is thrown out to the world） =》Throw data out to the world
 *
 * skuItemThe specification selection file completes the following events：
 * 1：receivemainFile transfer information（Product specification information+ The basic parameters）
 * Using basic parameters to obtain basic information Using the specification information to initialize the specification selection（The initialization result is empty when the goods are published）And the internal calculation triggers the data to be submittedmainfile
 *
 * skuTableThe specification presentation file completes the following events：
 * 1：receivemainThe fixed parameters of the file set the display
 * 2：receivemianDocument specification information to display specification data
 * 3：skuTableWhen specification data changes, the commit method is triggered to submit data tomainFile processing
 * */
