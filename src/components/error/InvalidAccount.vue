<template>
  <div>
    <div class="neu-404 neu-404--centered neu-404--centered__content">
      <span class="neu-text--h3 neu-text--bold">
        Page Not Found
      </span>
      <span class="neu-text--body neu-margin--top-30">
        There is no Staff Account associated with your User ID.
      </span>
       <span class="neu-text--body neu-margin--top-10">
        If you are staff and should have access, please contact the help desk or
        your <a class="neu-link" href="https://teamrooms.hca.corpad.net/sites/PIEducation/_layouts/15/DocIdRedir.aspx?ID=36PZMPJX2CXU-6-308">FSC</a>. 
        If you are responsible for the management of staff and their
        schedules, please return to the main Facility Scheduler website.
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
    useAppInsights().trackEvent({name:'UserLoginInvalid',properties: 
        { 'Username': this.oidcUser.sub }
    });
  }
}
</script>