<template>
  <div  class="col-12" >     
  <div class="container-fluid neu-margin--bottom-20 pb4 pt3" >
    <div class="row">
      <neu-label>Select Day Preference</neu-label>
    </div>
    <div class="row">
      <div class="row neu-margin--top-20">
        <neu-radio-group :value="dayPreference"  >
          <!-- @v-neu-change="preferenceSelected()" -->
          <!-- @v-neu-change="selectionChange(value)" -->
          <span  v-for="(option,code) in schedulePreferences" :key="code" >
            <div class="col-12 neu-margin--top-05" @click="selectionChange(option.code)">
              <!-- <neu-radio  color="primary" ></neu-radio> -->
              <neu-radio :value="option.code"></neu-radio>
              <neu-label class="col-4 "> {{ option.Desc }}</neu-label>
            </div>
          </span>
        
        <!-- <div class="col-12 neu-margin--top-05">
            <neu-radio value="7"></neu-radio>
            <neu-label class="col-4 ">I prefere not to work this day</neu-label>
        </div>
        <div class="col-12 neu-margin--top-05">
            <neu-radio value="9"></neu-radio>
        
            <neu-label class="col-4 ">I am neutral</neu-label>
        </div>
        <div class="col-12 neu-margin--top-05">
            <neu-radio value="5"></neu-radio>
            <neu-label class="col-4 ">I prefere to work this day</neu-label>
        </div>         -->
        </neu-radio-group>
      </div>
    </div>
    <div class="row">
      <div class="row neu-margin--top-20 neu-margin--left-30" style="width:100%" >
        <neu-button :color="enableSave?'primary':'gray-50'" full="true" type="submit" fill="raised"  style="width:100%"  @click="savePreference()">
              Save
        </neu-button>
      </div>
    </div>
  </div>
  </div>
  <neu-container></neu-container>
  </template>
  
  <script lang="ts">
  import { NeuContainer } from '@neutron/vue';
  import { mapState } from "vuex";
  import { defineComponent } from '@vue/runtime-core';
  
  export default defineComponent ({
    name: 'DayPreferenceView',
    components: { NeuContainer },
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
    computed: {
      ...mapState('profile',["profileData"]),
    },
    
    data : () =>{
      return {
        dayPreference:'' as string,
        enableSave:false as boolean,
        optionList:{} as any,
      }
    },
    created: function (){
      this.loadData();
    },
    methods : {
      loadData(){
        this.schedulePreferences.map((item:any)=>{
          if(item.code == "P"){
            item.Desc = "I prefere to work this day"
          }
          if(item.code == "N"){
            item.Desc = "I prefere not to work this day"
          }
          if(item.code == "NP"){
            item.Desc = "I am neutral"
          }
        });
      },
      selectionChange(values:any){
      // if (this.dayPreference == value){
      //   return 0;
      // }
        this.dayPreference = values;
        this.enableSave =true;
      },
      
      
      async savePreference(){
        console.log(this.currentEvent);
        debugger;
            var payload = {
                staffSchedulePreferenceId:this.currentEvent.staffSchedulePreferenceId,
                staffId: this.profileData.staffId,
                schedulePreferenceId:14 ,//this.dayPreference,
                date: "2023-02-16T14:19:32.052Z" //this.currentEvent.date
            };
            
            await this.$store.dispatch('schedule/saveDayPreference', payload)
                .then((res: any) => {
                    console.log(res);
                    this.$emit('showSuccessMsgPopUp', true);
                    this.$emit('closeSharedModal');
                    this.enableSave = !this.enableSave;
                })
                .catch((err: any) => {
                    if (err) {
                        console.log(err);
                    }
                });
        
      },
    } 
    
  });
  </script>
  