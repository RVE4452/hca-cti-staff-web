<template>
  <div  class="col-12" >     
  <div class="container-fluid neu-margin--bottom-20 pb4 pt3" >
    <div class="row">
      <neu-label>Select Day Preference</neu-label>
    </div>
    <div class="row">
      <div class="row neu-margin--top-20">
        <neu-radio-group :value="dayPreference">
          <span  v-for="(option,id) in schedulePreferences" :key="id" >
            <div class="col-12 neu-margin--top-05" @click="selectionChange(option.schedulePreferenceId)">
              <!-- <neu-radio  color="primary" ></neu-radio> -->
              <neu-radio :value="option.schedulePreferenceId"></neu-radio>
              <neu-label class="col-4 "> {{ option.description}}</neu-label>
            </div>
          </span>
        </neu-radio-group>
      </div>
    </div>
    <div class="row">
      <div class="row neu-margin--top-20 neu-margin--left-30" style="width:100%" >
        <neu-button :color="enableSave?'primary':'gray-50'"  type="submit" fill="raised"  style="width:100%" @click="savePreference()" >
              Save
        </neu-button>
      </div>
    </div>
  </div>
  </div>
  <neu-container></neu-container>
  </template>
  
  <script lang="ts">
  import { NeuButton, NeuContainer, NeuRadioGroup,NeuRadio } from '@neutron/vue';
  import { defineComponent } from '@vue/runtime-core';
  import { mapState } from "vuex";
    import moment from "moment";

  export default defineComponent ({
    name: 'DayPreferenceView',
    components: { NeuContainer,NeuRadioGroup,NeuButton,NeuRadio },
    props: {
      currentEvent:{
        type:Object,
        default: () => {}
      } as any,
      schedulePreferences:{
        type:Object,
        default: () => {}
      } as any,
    },
    data : () =>{
      return {
        dayPreference:'' as string,
        enableSave:false as boolean,
        optionList:{} as any,
      }
    },
    computed: {
      ...mapState('profile',["profileData"]),
    },

    created: function (){
      if(this.currentEvent?.schedulePreferenceId != undefined){
        this.dayPreference = this.currentEvent.schedulePreferenceId;
     
      }
    },
    methods : {
      selectionChange(value:string){
      this.dayPreference = value;
        this.enableSave =true;
      },

      async savePreference(){
        var payload = {
            staffSchedulePreferenceId:this.currentEvent.staffSchedulePreferenceId,
            staffId: this.profileData.staffId,
            schedulePreferenceId: this.dayPreference,
            date: moment(this.currentEvent.date).format("YYYY-MM-DD")
        };
        
        await this.$store.dispatch('schedule/saveDayPreference', payload)
            .then((res: any) => {
                this.$emit('showSuccessMsgPopUp', true);
                this.$emit('closeSharedModal');
                this.enableSave = !this.enableSave;
            })
            .catch((err: any) => {
              console.log(err)
            });
      } 
    },
  });
  </script>
  