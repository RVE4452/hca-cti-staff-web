<template>
  <div>
    <div class="neu-404 neu-404--centered neu-404--centered__content">
      <span class="neu-text--h3 neu-text--bold">
        Application Error
      </span>
      <span class="neu-text--body neu-margin--top-30">
        There was an error loading the Staff Account or Schedules associated with your User ID.
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
import { useAppInsights } from '../../store/modules/AppInsights'
import { mapGetters } from "vuex";

@Options({
  components: {},
  computed: {
    ...mapGetters(["oidcUser"]),
  },
})
export default class InvalidAccount extends Vue {  
  oidcUser!: any;

  constructor() {
    super();
  }

  created(){
    useAppInsights().trackEvent({name:'UserLoadError',properties: 
        { 'Username': this.oidcUser.sub }
    });
  }
}
</script>