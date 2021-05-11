<template>
  <div class="settings">

       <md-dialog :md-active.sync="showDialog" :md-fullscreen="true">
          <md-dialog-title>Einstellungen</md-dialog-title>

            <md-tabs md-dynamic-height>
              <md-tab md-label="Allgemein">
                <md-field>
                  <label>Ausgabepfad</label>
                  <md-file v-model="outputPath" :disabled="!!relativeOutput" @md-change="onPathSelected($event)" webkitdirectory directory multiple />
                </md-field>
                <md-switch v-model="relativeOutput" @change="onRelativeOutputChanged($event)" class="md-primary">Benutze relativen Ordner als Ausgabepfad</md-switch>
                </md-tab>
                <md-tab md-label="Copyright">
                Made with &#10084;&#65039; by Luca Wimmer, build on Electron, Vue, VueMaterial and Filepond by PQINA. <br />
                <div>App-Icon made by <a href="https://www.freepik.com" title="Freepik" target="_blank">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon" target="_blank">www.flaticon.com</a></div>
                <br />
                <span class="md-subheading">Third-Party Licences</span>
                <md-content class="md-scrollbar licences">
                  This software uses (prebuild) binarys of <a href=http://ffmpeg.org target="_blank">FFmpeg</a> licensed under the <a href=https://www.gnu.org/licenses/gpl-3.0.de.html target="_blank">GPLv3</a> its obtained by <a href=https://github.com/eugeneware/ffmpeg-static target="_blank">ffmpeg-static</a> via <a href=https://github.com/ShareX/FFmpeg/releases/tag/v4.3.1 target="_blank">ShareX/FFmpeg</a>.<br />
                  {{ thirdpartylicences }}
                </md-content>
                </md-tab>
            </md-tabs>

            <md-dialog-actions>
            <md-button class="md-primary" @click="showDialog = false">Zurück</md-button>
          </md-dialog-actions>

       </md-dialog>

      <md-button class="md-icon-button" @click="showDialog = true">
        <md-icon :class="{ 'md-accent' : this.validateSettings() == false}">settings</md-icon>
      </md-button>

    <md-snackbar :md-position="position" :md-duration="Infinity" :md-active.sync="showSettingsWarning" md-persistent>
      <span>Die Einstellungen sind nicht vollständig erfasst.</span>
      <md-button class="md-primary" @click="showSettingsWarning = false">Schließen</md-button>
    </md-snackbar>

  </div>
</template>

<script>
import { remote } from 'electron'
import txt from '../../assets/ThirdPartyNotices.txt'

const settings = require('settings-store')
const settingsOpts = {
  appName: 'r5-wav-converter-ui',
  electronApp: remote.app
}
settings.init(settingsOpts)

export default {

  data: function () {
    return {
      showDialog: false,
      outputPath: settings.value('outputPath', null),
      relativeOutput: settings.value('relativeOutput', null),
      showSettingsWarning: false,
      thirdpartylicences: txt
    }
  },
  mounted () {
    if (!this.validateSettings()) this.showSettingsWarning = true
  },
  watch: {
    outputPath: function (val) {
      if (this.relativeOutput) return
      settings.setValue('outputPath', val)
    },
    relativeOutput: function (val) {
      settings.setValue('relativeOutput', val)
    },
    showDialog: function (val) {
      if (this.showDialog === false) this.validateSettings()
    }
  },
  methods: {
    validateSettings () {
      // returns true if the settings are valid
      var validation = (!!this.outputPath || !!this.relativeOutput)
      this.$emit('settingsInvalid', !validation) // event for filepond

      return validation
    },
    onPathSelected (fileList) {
      setTimeout(() => {
        this.outputPath = fileList[0].path
      }, 50)
    },
    onRelativeOutputChanged (value) {
      this.outputPath = null
      if (!value) this.outputPath = settings.value('outputPath')
    }
  },
  components: {}
}
</script>

<style>
.licences {
  max-height: 150px; 
  max-width: 100%; 
  overflow: auto; 
  white-space: pre-line;
  font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
}
</style>