<template>
  <div class="elder-file__thumbnail">
    <div class="elder-file__thumbnail-icon">
      <FontAwesomeIcon :icon="icon" size="2x"></FontAwesomeIcon>
    </div>
    <div class="elder-file__thumbnail-info">
      <input
        type="text"
        ref="input"
        class="elder-file__thumbnail-name"
        :value="value.name"
        @keypress.enter="unfocus"
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
        icon="times"
        title="Remove"
        class="elder-file__thumbnail-delete"
        @click="$emit('delete')"
      />
      <FontAwesomeIcon v-if="sortable" icon="arrows-alt-v" class="elder-file__thumbnail-sort" title="Sort" />
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
    sortable: Boolean,
  },
  computed: {
    icon() {
      let match = [...Options.icons, ...iconPatters].find(e => this.value.type.match(e.pattern)) || {}
      return match.icon || 'file'
    },
  },
  methods: {
    unfocus() {
      this.$refs.input.blur()
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
    border-radius: $border-radius;
    color: inherit !important;
    transition: background-color 150ms ease-out;

    &:hover {
      background-color: lighten($border-color, 5%);
    }
  }

  &-info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;

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
    opacity: 1;
    transform: translateX(0);
    transition: opacity 150ms ease-out, transform 150ms ease-out;

    @media (hover: hover) {
      opacity: 0;
      transform: translateX(1rem);
    }

    .elder-file__thumbnail:hover & {
      opacity: 1;
      transform: translateX(0);
    }

    & > * + * {
      margin-top: 0.5rem;
    }

    & > * {
      cursor: pointer;
      opacity: 0.75;
      transition: opacity 200ms ease, color 200ms ease;

      &:hover {
        opacity: 1;
        color: $primary;
      }
    }
  }

  &-delete {
    color: rgba($error, 0.8) !important ;
  }
}
</style>
