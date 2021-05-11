<template>

<div>

  <div class="md-layout md-gutter" id="container">
    <div class="md-layout-item md-size-100">
      <file-pond :disabled="filepondDisabledState"></file-pond>
    </div>
  </div>

  <div id="settings" class="footer md-layout">
      <div class="md-layout-item md-size-100" >
       <settings-button @settingsInvalid="settingsInvalidReceived"></settings-button>
      </div>
  </div>
</div>
</template>

<style lang="sass">
$material-icons-font-path: '~material-icons/iconfont/';
@import '~material-icons/iconfont/material-icons.scss';
</style>
<script>
  import FilePond from './LandingPage/FilePond'
  import SettingsButton from './LandingPage/SettingsButton'
  export default {
    name: 'landing-page',
    data: function () {
      return {
        filepondDisabledState: false
      }
    },
    components: { FilePond, SettingsButton },
    methods: {
      settingsInvalidReceived (e) {
        if (!!e === e) {
          this.filepondDisabledState = e
        }
      }
    }
  }
</script>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { 
    font-family: 'Source Sans Pro', sans-serif; 
    padding: 15px;
    }

body {
    margin: 0;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

  .md-layout-item {
    height: 40px;
    margin-top: 8px;
    margin-bottom: 8px;
  }

  .wrapper {
    min-height: 100%;
    height: auto !important;
    height: 100%;
    margin: 0 auto -142px; /* the bottom margin is the negative value of the footer's height */
  }

  .spacer {
    flex: 1;
  }

  #settings {
    position:absolute;
    bottom:0px;
    right: 0px;
  }
  #settings > .md-layout-item {
    margin-right: 10px;
  }

  .filepond--root {
      max-height: 365px;
  }

  /* the background color of the filepond drop area */
  .filepond--panel-root {
      background-color: #212121;
      transition: transform .2s;
      color: #fff;
  }

  /* the text color of the drop label*/
  .filepond--drop-label {
    color: #fff;
  }

  .filepond--credits--root {
    color: #fff;
  }

</style>
