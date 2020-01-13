<template>
  <div class="elder-file">
    <label v-if="label" :for="id" class="elder-file__label">
      {{ label }}
      <span v-if="isRequired" class="elder-file__label-required">*</span>
    </label>
    <draggable
      v-if="thumbnails.length || isReadonly"
      v-model="thumbnails"
      :disabled="!multiple || !sortable"
      class="elder-file__thumbnails"
      handle=".elder-file__thumbnail-sort"
    >
      <thumbnail
        v-for="(item, index) in thumbnails"
        :key="index"
        :readonly="isReadonly"
        :sortable="sortable"
        :rename="rename === true"
        :value="serializeComp(item)"
        @rename="$ev => (item.name = $ev)"
        @delete="remove(item)"
      />
      <template #footer>
        <div
          v-if="!thumbnails.length && isReadonly"
          class="elder-file__thumbnail"
          v-html="nofilesMessage"
        ></div>
      </template>
    </draggable>
    <div v-if="showDroparea" class="elder-file__droparea" @drop="onDrop" @dragover="onDragOver">
      <input type="text" :value="value" :required="isRequired" />
      <input type="file" ref="input" @change="onChange" :disabled="!canUpload" :multiple="multiple" />
      <div class="elder-file__droparea-instruction">
        <slot name="drop-message">
          <div v-html="dropMessage"></div>
        </slot>
      </div>
    </div>
    <Uploader
      v-if="queue.total"
      :value="queue.progress"
      :bytes="queue.bytes"
      :current="queue.counter"
      :total="queue.total"
    ></Uploader>
  </div>
</template>

<script>
import { AttributeBoolean, Clone } from './utils'
import { Options } from '../index'
import Draggable from 'vuedraggable'
import Uploader from './uploader'
import Thumbnail from './thumbnail'

import './icons'

const QueueTemplate = {
  counter: 0,
  total: 0,
  progress: 0,
  bytes: 0,
  result: [],
}

/* Value format
{
  name: '...',
  url: '...',
  type: '...'
}
------------ */

export default {
  props: {
    value: [Array, Object, String],
    label: String,
    sortable: {
      type: Boolean,
      default: true,
    },
    multiple: Boolean,
    rename: {
      type: [Boolean, String],
      default: true,
    },
    upload: Function,
    serialize: Function,
    uploadOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      id: null,
      queue: Clone(QueueTemplate),
    }
  },
  computed: {
    isRequired: AttributeBoolean('required'),
    isReadonly: AttributeBoolean('readonly'),
    showDroparea() {
      if (this.isReadonly) return false
      if (!this.multiple && this.value) return false
      return true
    },
    serializeComp() {
      return this.serialize || Options.serialize
    },
    dropMessage() {
      return Options.dropMessage
    },
    nofilesMessage() {
      return Options.nofilesMessage
    },
    uploadComp() {
      return this.upload || Options.upload
    },
    canUpload() {
      return !this.isReadonly && !this.queue.total
    },
    thumbnails: {
      get() {
        if (!this.value) return []
        return this.value instanceof Array ? this.value : [this.value]
      },
      set(val) {
        if (!this.multiple) return
        this.$emit('input', val)
      },
    },
  },
  methods: {
    run(files) {
      files = Array.from(files)

      this.queue.total = files.length
      this.queue.counter = 0
      this.queue.bytes = files.reduce((res, cur) => (res += cur.size), 0)
      let progress = files.map(() => 0)

      Promise.all(
        files.map((file, index) => {
          let opts = { ...this.uploadOptions }
          if (typeof this.rename === 'string') opts.name = this.rename
          return this.uploadComp(
            file,
            val => {
              progress[index] = val
              this.queue.progress = progress.reduce((r, c) => (r += c), 0) / progress.length
            },
            opts,
          ).then(res => {
            this.queue.counter++
            return res
          })
        }),
      ).then(result => {
        if (!result || !result.length) return
        this.$emit('input', this.multiple ? [...(this.value || []), ...result] : result[0])
        this.resetQueue()
      })
    },
    remove(item) {
      this.$emit('input', this.multiple ? this.value.filter(v => v !== item) : null)
    },
    onChange(e) {
      this.run(e.target.files)
      this.$refs.input.value = null
    },
    onDrop(e) {
      e.preventDefault()
      if (this.isReadonly || !e.dataTransfer.files.length) return
      this.run(e.dataTransfer.files)
    },
    onDragOver(e) {
      e.preventDefault()
    },
    resetQueue() {
      this.queue = Clone(QueueTemplate)
    },
  },
  created() {
    this.id = this._uid
  },
  components: {
    Uploader,
    Thumbnail,
    Draggable,
  },
}
</script>

<style lang="scss">
.elder-file {
  @import './variables.scss';

  display: flex;
  flex-direction: column;
  text-align: left;

  & > * + * {
    margin-top: 0.5rem;
  }

  &__label {
    display: block;
    font-weight: bold;
    // margin-bottom: 0.5em;

    &-required {
      color: $error;
    }
  }

  &__droparea {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    border: 2px dashed $border-color;
    background-position: center;
    background-repeat: no-repeat;
    background-origin: content-box;
    background-color: $input-color;
    border-radius: $border-radius;
    padding: 1.5rem 1rem;
    text-align: center;
    flex-grow: 1;

    &-instruction {
      transition: opacity 250ms ease;
      font-size: 0.9em;
    }

    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;

      &[type='text'] {
        pointer-events: none;
        z-index: -1;
      }
    }

    b {
      color: $primary;
    }
  }

  &__thumbnails {
    $space: 0.5rem;

    & > * + * {
      margin-top: $space;
    }
  }
}
</style>
