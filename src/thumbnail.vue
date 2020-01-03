<template>
  <div class="elder-file__thumbnail">
    <div class="elder-file__thumbnail-icon">
      <FontAwesomeIcon :icon="icon" size="2x"></FontAwesomeIcon>
    </div>
    <div class="elder-file__thumbnail-info">
      <input
        type="text"
        class="elder-file__thumbnail-name"
        :value="value.name"
        :disabled="readonly || !rename"
        @input="$emit('rename', $event.target.value)"
      />
      <div class="elder-file__thumbnail-info-footer">
        <span v-if="value.size" class="elder-file__thumbnail-size">{{ value.size | size }}</span>
        <a :href="value.url" title="Download" download class="elder-file__thumbnail-download">
          <FontAwesomeIcon icon="arrow-alt-circle-down"></FontAwesomeIcon>
        </a>
      </div>
    </div>
    <div class="elder-file__thumbnail-actions">
      <FontAwesomeIcon
        v-if="!readonly"
        icon="trash"
        title="Remove"
        class="elder-file__thumbnail-delete"
        @click="$emit('delete')"
      ></FontAwesomeIcon>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { BytesToSize } from './utils'
import { Options } from '../index'

const iconPatters = [
  { pattern: /text.*/, icon: 'file-alt' },
  { pattern: /image.*/, icon: 'file-image' },
  { pattern: /pdf/, icon: 'file-pdf' },
  { pattern: /word/, icon: 'file-word' },
  { pattern: /excel/, icon: 'file-excel' },
  { pattern: /powerpoint/, icon: 'file-powerpoint' },
  { pattern: /octet-stream|zip/, icon: 'file-archive' },
]

export default {
  props: {
    value: Object,
    readonly: Boolean,
    rename: Boolean,
  },
  computed: {
    icon() {
      let match = [...Options.icons, ...iconPatters].find(e => this.value.type.match(e.pattern)) || {}
      return match.icon || 'file'
    },
  },
  filters: {
    size: BytesToSize,
  },
  components: {
    FontAwesomeIcon,
  },
}
</script>

<style lang="scss">
.elder-file__thumbnail {
  @import './variables.scss';

  position: relative;
  padding: 1rem;

  display: flex;
  align-items: center;

  border-radius: $border-radius;
  border: 1px solid $border-color;

  &-icon {
    margin-right: 1rem;
    opacity: 0.5;
  }

  &-name {
    border: none;
    background-color: transparent;
    font: inherit;
    font-weight: bold;
    width: 100%;
    color: inherit !important;
  }

  &-info {
    flex-grow: 1;
    &-footer {
      display: flex;
      align-items: center;
    }
  }

  &-size {
    opacity: 0.75;
    font-size: 0.8em;
    margin-right: 0.5rem;
  }

  &-download {
    color: inherit;
    opacity: 0.5;
    transition: opacity 150ms ease-out, color 150ms ease-out;

    &:hover {
      color: $primary;
      opacity: 1;
    }
  }

  &-actions {
    font-size: 1em;
    margin-left: auto;
    padding-left: 1rem;
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    align-items: center;

    & > * + * {
      margin-top: 5px;
    }

    & > * {
      cursor: pointer;
    }
  }

  &-delete {
    color: rgba($error, 0.8);
  }
}
</style>
