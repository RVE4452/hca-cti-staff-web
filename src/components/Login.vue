<script lang="ts">
 
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class Login extends Vue {
  mounted() {
    this.login();
  }
  login() {
    this.$store
      .dispatch("oidcSignInCallback")
      .then(async (redirectPath: any) => {
        this.$router.push(redirectPath);
      })
      .catch((err: any) => {
        if (err) {
          console.log(`Login Error Occured: ${err}`); // Handle errors any way you want
        }
      });
  }
}
</script>
