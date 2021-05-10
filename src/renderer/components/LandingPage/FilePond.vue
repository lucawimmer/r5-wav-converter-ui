<template>
  <div>
    <file-pond
      name="upload"
      ref="pond"
      label-idle='Audiodatei hier ablegen oder <span class="filepond--label-action"> durchsuchen </span>'
      allow-multiple="true"
      v-bind:server="processFiles"
      dropValidation="false"
      acceptedFileTypes="audio/*"
      v-on:init="handleFilePondInit"
      credits="null"
      :disabled="disabled"
      allowRevert="false"
      maxParallelUploads="1"
      dropOnPage="true"
      labelFileProcessing="Verarbeite.."
      labelFileProcessingComplete="Konvertierung abgeschlossen"
      labelFileProcessingAborted="Konvertierung abgebrochen"
      labelFileProcessingError="Fehler bei der Konvertierung"
      labelTapToUndo=""
      labelTapToCancel="Klicke zum Abbrechen"
      labelTapToRetry="Klicke zum Widerholen"
      labelFileTypeNotAllowed="Falscher Dateityp!"
      fileValidateTypeLabelExpectedTypes="Erwarte gültige Audiodatei(WAV, MP3, M4A)"
    />
  </div>
</template>

<script>
import vueFilePond from 'vue-filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import 'filepond/dist/filepond.min.css'

import { remote } from 'electron'
import path from 'path'
import fs from 'fs'

const settings = require('settings-store')

const settingsOpts = {
  appName: 'r5-wav-converter-ui',
  electronApp: remote.app
}
settings.init(settingsOpts)

const FilePond = vueFilePond(FilePondPluginFileValidateType)

export default {
  data: function () {
    return {
      // fake server to simulate loading a 'local' server file and processing a file
      processFiles: {
        process: (name, file, data, load, error, progress, abort) => {
          var pond = this.$refs.pond
          console.log('Processing..')

          console.log(file)

          var conversation = new Promise(function (resolve, reject) {
            try {
              var outputPath
              var filename = path.basename(file.path).split('.').slice(0, -1).join('.') + '.wav'

              if (settings.value('relativeOutput')) {
                outputPath = path.dirname(file.path) + '\\converted\\' + filename
              } else {
                outputPath = settings.value('outputPath', null) + '\\' + filename
              }

              const ffmpegPath = require('ffmpeg-static')
              var Ffmpeg = require('fluent-ffmpeg')
              Ffmpeg.setFfmpegPath(ffmpegPath)

              if (!fs.existsSync(path.dirname(outputPath))) fs.mkdirSync(path.dirname(outputPath))

              var proc = new Ffmpeg(file.path)
              proc
                .on('error', function (err) {
                  error()
                  console.error('an error happened during conversation: ' + err.message)
                })
                /* .on('stderr', function (stderrLine) {
                  console.log('stderr output: ' + stderrLine)
                }) */
                .format('wav')
                .audioFrequency(8000)
                .audioChannels(1)
                .output(outputPath)
                .run()

              resolve(file)
            } catch (e) {
              reject(new Error(e))
            }
          })

          conversation.then((res) => {
            this.removeFilesTimer(pond, res, 60000)
            load(file.path)
          })
        }
      }
    }
  },
  props: {
    disabled: Boolean
  },
  methods: {
    handleFilePondInit: function () {
      console.log('FilePond has initialized!')
    },
    removeFilesTimer (pond, file, timer) {
      setTimeout(function () {
        pond.removeFile(file)
      }, timer)
    }
  },
  components: {
    FilePond
  }
}
</script>