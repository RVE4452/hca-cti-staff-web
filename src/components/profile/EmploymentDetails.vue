<template>
    <div v-if="profileData">
        <div class="neu-margin--bottom-20 neu-margin--top-10 neu-text--caption">
            To update the information below, contact your manager or FSA, or call HCA
            HR Answers at
            <b>1-844-(472-6797)</b>.
        </div>
        <div class="row neu-margin--top-20 neu-margin--bottom-20">
            <div class="col-sm-12">
                <h6 class="neu-text--transform-uppercase">
                    IDENTIFIERS
                </h6>
            </div>
            <div class="col-sm-4 neu-margin--top-20">
                <neu-label for="username">Name</neu-label>
                <neu-input type="text" autocomplete="off" readonly="true" inputmode="search" enterkeyhint="search" autocorrect="off" :value="getName" id="txtUsername" >
                </neu-input>
            </div>
        </div>
        <div class="row neu-margin--top-20 neu-margin--bottom-20">
            <div class="col-sm-12">
                <h6 class="neu-text--transform-uppercase">
                    CONTACT METHODS
                </h6>
            </div>

            <div class="col-sm-6 neu-margin--top-20">
                <neu-label for="txtEmail">Email(s)</neu-label>     
                <neu-input type="text" autocomplete="off" readonly="true" inputmode="search" enterkeyhint="search" autocorrect="off" :value="profileData.email" id="txtEmail" name="Email" >
                </neu-input>
            </div>
            <div class="col-sm-4 neu-margin--top-20 flex41">
                <neu-label for="txtPhoneNumber" >Phone Number(s)</neu-label>
                
                <neu-input type="text" autocomplete="off" readonly="true" inputmode="search" enterkeyhint="search" autocorrect="off" name="PhoneNumber"
                id="txtPhoneNumber"
                :value="profileData.homePhoneNumber"  >
                </neu-input>
            </div>

            <div class="col-sm-10 neu-margin--top-20">
                <neu-label for="txtHomeAddress">Home Address</neu-label>
                <neu-input type="text" autocomplete="off" readonly="true" name="HomeAddress"
                  id="txtHomeAddress" :value="getFullHomeAddress"   >
                </neu-input>
            </div>
        </div>

        <div class="row neu-margin--top-20 neu-margin--bottom-20">
            <div class="col-sm-12">
                <h6 class="neu-text--transform-uppercase">
                  TALENT PROFILE
                </h6>
            </div>
            <div class="col-sm-7 neu-margin--top-20">
                <neu-label for="txtFacility">Proficiency </neu-label>
                
              <neu-tooltip>
                <neu-label slot="tooltip" >{{ proficinecyDetails }}</neu-label>
                <neu-icon color="primary" fill="raised"  slot="content">info </neu-icon>
                <!-- <neu-lable id="trash-desc"> {{ proficinecyDetails }}</neu-lable> -->
              </neu-tooltip>
                <neu-select interface="popover" :value="proficiency"  @v-neu-change="selectionChange">
                  <neu-option value="1">Level 1 Beginner </neu-option>
                  <neu-option value="2">Level 2 Intermediate</neu-option>
                  <neu-option value="3">Level 3 Advanced</neu-option>
                </neu-select>
            </div>
        </div>
        <div class="row neu-margin--top-20 neu-margin--bottom-20">
            <div class="col-sm-4 neu-margin--top-20">
              <neu-button color="primary"   name="cancel" type="reset" value="Cancel" fill="flat">
                Cancel
                </neu-button>
                <neu-button color="green-50"  name="submit" type="submit"  fill="raised">
                Save
                </neu-button>
            </div>
        </div>
                      
    </div>
</template>

<script lang="ts">

import { NeuContainer } from '@neutron/vue';
import { defineComponent } from '@vue/runtime-core';
import { mapState } from "vuex";
import moment from "moment";

export default defineComponent({
  name: 'EmploymentDetails',
  data : () =>{
      return { 
          //  profileData: {} as any,
            ProficienceData: [] as any,
            proficiency:'',
            proficinecyDetails:'',
      }
  },
  props: {},
  components: {},
  computed: {
      ...mapState('profile',["profileData"]),
      getName():any  {
          return (this.profileData.first + " " + this.profileData.last);
      },
      getFullHomeAddress():any {
          let fulladdress = "";
          fulladdress =
              this.profileData.address1 != "" ? this.profileData.address1 + "," : "";
          fulladdress =
              this.profileData.address2 != ""
                  ? fulladdress != ""
                      ? fulladdress + " " + this.profileData.address2 + ","
                      : this.profileData.address2 + ","
                  : fulladdress;
          fulladdress =
              this.profileData.city != ""
                  ? fulladdress != ""
                      ? fulladdress + " " + this.profileData.city
                      : this.profileData.city
                  : fulladdress;
          fulladdress =
              this.profileData.state != ""
                  ? fulladdress != ""
                      ? fulladdress + " " + this.profileData.state
                      : this.profileData.state
                  : fulladdress;
          fulladdress =
              this.profileData.zip != ""
                  ? fulladdress != ""
                      ? fulladdress + " " + this.profileData.zip
                      : this.profileData.zip
                  : fulladdress;
          return fulladdress;
      },
      getPrimarySkill() {
          let primarySkill = "";
          if (typeof this.profileData.skills !== "undefined") {
              for (var i = 0; i < this.profileData.skills.length; i++) {
                  if (this.profileData.skills[i].primary === true) {
                      primarySkill = this.profileData.skills[i].description;
                      break;
                  }
              }
          }
          return primarySkill;
      },
  },
  mounted() {
  this.selectionChange({detail:{value:"1"}});
  localStorage.setItem("guarenteedHours", this.profileData.guarenteedHours);
  localStorage.setItem("UserName", this.profileData.first + " " + this.profileData.last);
  },
  methods: {
      // computed
      selectionChange(ev:any){
        if(ev.detail.value ==="1"){
          this.proficiency = ev.detail.value;
          this.proficinecyDetails = "An individual with a level of experience and clinical judgement gained in a classroom or orientation but is limited in caring for patients on the unit. Will have questions on clinical conditions and is expected to need consultation from a more advanced nurse with decision-making when patients are unstable or under rapidly changing conditions."
        }else if(ev.detail.value ==="2"){
          this.proficiency = ev.detail.value;
          this.proficinecyDetails = "An individual with clinical judgement of a patient's condition and situational awareness of the current unit status. Anticipates patient care needs and promptly assesses and intervenes with minimal consultation and support in rapidly changing conditions. Emerging teacher and coach."
        }else{
          this.proficiency = ev.detail.value;
          this.proficinecyDetails = "An individual recognized within the organization as a person for recognizing early clinical changes and for making wise clinical judgements when difficult questions arise regarding patient care, particularly when unusual, complex, emergent, or high-risk situations require clinical reasoning and rapid intervention."
        }
      },
      // getName() {
      //     return (this.profileData.first + " " + this.profileData.last);
      // },
      // getFullHomeAddress() {
      //     let fulladdress = "";
      //     fulladdress =
      //         this.profileData.address1 != "" ? this.profileData.address1 + "," : "";
      //     fulladdress =
      //         this.profileData.address2 != ""
      //             ? fulladdress != ""
      //                 ? fulladdress + " " + this.profileData.address2 + ","
      //                 : this.profileData.address2 + ","
      //             : fulladdress;
      //     fulladdress =
      //         this.profileData.city != ""
      //             ? fulladdress != ""
      //                 ? fulladdress + " " + this.profileData.city
      //                 : this.profileData.city
      //             : fulladdress;
      //     fulladdress =
      //         this.profileData.state != ""
      //             ? fulladdress != ""
      //                 ? fulladdress + " " + this.profileData.state
      //                 : this.profileData.state
      //             : fulladdress;
      //     fulladdress =
      //         this.profileData.zip != ""
      //             ? fulladdress != ""
      //                 ? fulladdress + " " + this.profileData.zip
      //                 : this.profileData.zip
      //             : fulladdress;
      //     return fulladdress;
      // },
      
      // getPrimarySkill() {
      //     let primarySkill = "";
      //     if (typeof this.profileData.skills !== "undefined") {
      //         for (var i = 0; i < this.profileData.skills.length; i++) {
      //             if (this.profileData.skills[i].primary === true) {
      //                 primarySkill = this.profileData.skills[i].description;
      //                 break;
      //             }
      //         }
      //     }
      //     return primarySkill;
      // },
  }
})
</script>
<style scoped>
    .readonly_text_field {
        background-color: whitesmoke;
        display: block;
        width: 100%;
        height: 2.5rem;
        line-height: 2.5rem;
        border: 1px solid #d9d9d6;
        border-radius: 5px;
        padding: 0 0.938rem;
        font-size: 1em;
        color: #1f2532;
    }

    /* Media Query for low resolution  Tablets, Ipads */
    @media (min-width: 481px) and (max-width: 767px) {
        .flex100 {
            flex: 0 0 100% !important;
        }

        .flex41{
            flex: 0 0 41.666667% !important;
        }
    }

    @media (min-width: 768px) and (max-width: 899px) {
        .flex83 {
            flex: 0 0 83.333333% !important;
        }
    }

    @media print {
        .marTop1{
            margin-top: 1em !important;
        }
    }
    
</style>
