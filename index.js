import FileComponent from './src/component.vue'

const Options = {
  upload(file, onProgress, opts = {}) {
    console.warn('[vue-elder-file]: You need to setup the upload function before using this plugin')
    onProgress(10)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          name: opts.name || file.name,
          type: file.type,
          size: file.size,
          url: '#',
        })
      }, 1000)
    })
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
