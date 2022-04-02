<template>
  <div class="container">
    <el-tabs type="border-card">
      <el-tab-pane label="站点设置">
        <system-settings-site/>
      </el-tab-pane>
      <el-tab-pane label="商品设置">
        <system-settings-goods/>
      </el-tab-pane>
      <el-tab-pane label="订单设置">
        <system-settings-order/>
      </el-tab-pane>
      <el-tab-pane label="积分设置" class="point-pane">
        <system-settings-point/>
      </el-tab-pane>
      <el-tab-pane label="联系方式">
        <system-setting-contact/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import SystemSettingContact from './SystemSettingContact'
  import SystemSettingsSite from './systemSettingsSite'
  import systemSettingsGoods from './systemSettingsGoods'
  import SystemSettingsOrder from './systemSettingsOrder'
  import SystemSettingsPoint from './systemSettingsPoint'

  export default {
    name: 'systemSettings',
    components: {
      SystemSettingContact,
      SystemSettingsSite,
      systemSettingsGoods,
      SystemSettingsOrder,
      SystemSettingsPoint
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .container {
    background-color: #fff;
    padding: 10px;
    position: relative;
  }
  .site-tag {
    margin: 0 3px;
  }
  .site-new-tag-input {
    width: 100px;
  }
  /deep/ .site-logo .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409EFF;
    }
  }
  .logo-uploader-icon {
    font-size: 20px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .site-logo-img {
    width: 120px;
    height: 120px;
    display: block;
  }

  .image-pane .el-input-group {
    width: 200px;
  }
  .point-pane .el-input-group {
    width: 200px;
  }
</style>
