import FileComponent from './src/component.vue'

const Options = {
  upload(val) {
    console.warn('[vue-elder-file]: You need to setup the upload function before using this plugin')

    return Promise.resolve()
  },
  serialize(val) {
    return val
  },
  dropMessage: 'Drag a file here or <b>browse</b> to upload.',
  nofilesMessage: '-',
  icons: [],
}

const install = Vue => {
  Vue.component('file-component', FileComponent)
}

const setup = options => {
  for (let key in options) {
    if (!(key in Options)) return
    Options[key] = options[key]
  }
}

export default {
  install,
}

export { FileComponent, install as FileComponentInstaller, setup, Options }
