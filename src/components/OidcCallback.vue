<template>
  <div>
    <v-row>
      <v-col cols="12" sm="12" class="text-center">
        <v-progress-circular
          :size="100"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-center">
        <h2>Logging in, Please wait</h2>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'CallBack',
  data: () => ({}),
  methods: {
    ...mapActions(['oidcSignInCallback']),
  },
  mounted: function () {
    this.oidcSignInCallback().then((redirectPath) => {
      this.$router.push(redirectPath)
    })
  },
}
</script>
