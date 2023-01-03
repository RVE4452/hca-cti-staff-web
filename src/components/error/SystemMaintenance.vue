<template>
  <div>
    <div class="neu-404 neu-404--centered neu-404--centered__content">
      <span class="neu-text--h4 neu-text--bold">
        System Maintenance
      </span>
      <span class="neu-text--body neu-margin--top-30">
        MyScheduler is not available due to planned maintenance. We apologize for the inconvenience.
      </span>
       <span class="neu-text--body neu-margin--top-10">
        If the issue continues, please contact the help desk or
        your <a class="neu-link" href="https://teamrooms.hca.corpad.net/sites/PIEducation/_layouts/15/DocIdRedir.aspx?ID=36PZMPJX2CXU-6-308">FSC</a>. 
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {},
})
export default class SystemMaintenance extends Vue {
  constructor() {
    super();
  }
}
</script>