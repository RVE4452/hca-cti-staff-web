<template>
  <neu-footer color="plain-0">
    <neu-container fluid>
      <neu-row>
        <neu-col md="4" cols="12" class="neu-text-center neu-text-md-left">
          <neu-link nav aria-label="Link to Home Page" href="#!">
            <neu-image
              width="200px"
              src="/HCA-Horizontal-black.png"
              class="mx-auto mx-md-0"
              alt="HCA Healthcare Logo"
            ></neu-image>
          </neu-link>
        </neu-col>
        <neu-col md="8" cols="12" class="neu-text-center neu-text-md-right">
          {{ appVersion }} - &copy; {{ getFullYear }} HCA, Inc.
        </neu-col>
      </neu-row>
    </neu-container>
  </neu-footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import {
  NeuFooter,
  NeuContainer,
  NeuRow,
  NeuCol,
  NeuLink,
  NeuImage,
} from '@neutron/vue'

export default defineComponent({
  name: 'FooterComponent',
  components: { NeuFooter, NeuContainer, NeuRow, NeuCol, NeuLink, NeuImage },
  data() {
    return {
      appVersion: process.env.VUE_APP_VERSION,
    }
  },
  computed: {
    getFullYear() {
      return new Date().getFullYear()
    },
  },
})
</script>
