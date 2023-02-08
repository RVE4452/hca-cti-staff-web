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
                
              
                <neu-icon color="primary" fill="raised"  slot="content" @click="toggleSideNav()">info </neu-icon>
                
                <neu-select interface="popover" :value="proficiency"  @v-neu-change="selectionChange">
                    
                    <neu-option value="select">--Select-- </neu-option>
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
                <neu-button :color="enableSave?'primary':'gray-50'"   name="submit" type="submit"  fill="raised" :disable="!enableSave" @click="saveProficiency()">
                Save
                </neu-button>
            </div>
        </div>
          <div class="modal sideNavPanel"  v-if="enableSideNav"  >
            <neu-header class="fs-22 fw-bold modal-header relative" id="modalTitle"> 
            <neu-icon  @click="toggleSideNav()" data-test="modal-close" class="btn-close f1 absolute pointer btnSidePanelClose m-3 neu-icon neu-icon--large hydrated">close</neu-icon>
            </neu-header>
            <!-- <template v-if="proficiency =='1'"> -->
            <!-- v-bind:class="isPanelOpen ? 'sideNavPanel' : 'sideNavPanelClose" -->
                <h6 class="neu-text--transform-uppercase neu-margin--top-20 align-self-center">
                    Level 1 Beginner
                </h6>
                <neu-lable class="neu-margin--top-20 neu-margin--bottom-20 ">
                    <ol>
                        <li>
                            <p class="ptag neu-margin--bottom-20">An individual with a level of experience and clinical judgement gained in a classroom or orientation but is limited in caring for patients on the unit.</p>
                        </li>
                        <li>
                        <p class="ptag neu-margin--top-20"> Will have questions on clinical conditions and is expected to need consultation from a more advanced nurse with decision-making when patients are unstable or under rapidly changing conditions.</p>
                        </li>
                    </ol> 
                </neu-lable>
            <!-- </template> -->
            <!-- <template v-if="proficiency =='2'"> -->
                <h6 class="neu-text--transform-uppercase neu-margin--top-20 align-self-center">
                    Level 2 Intermediate
                </h6>
                <neu-lable class="neu-margin--top-20 neu-margin--bottom-20">
                    <ol>
                        <li>
                            <p class="ptag neu-margin--bottom-20"> An individual with clinical judgement of a patient's condition and situational awareness of the current unit status.</p>
                        </li>
                        <li>
                            <p class="ptag neu-margin--top-20">Anticipates patient care needs and promptly assesses and intervenes with minimal consultation and support in rapidly changing conditions.
                            Emerging teacher and coach.</p>
                        </li>
                    </ol> 
                    
                </neu-lable>
            <!-- </template> -->
            <!-- <template v-if="proficiency =='3'"> -->
                <h6 class="neu-text--transform-uppercase neu-margin--top-20  align-self-center">
                    Level 3 Advanced
                </h6>
                <neu-lable class="neu-margin--top-20 neu-margin--bottom-20">
                    <ol>
                        <li>
                            <p class="ptag neu-margin--bottom-20"> An individual recognized within the organization as a person for recognizing early clinical changes and for making wise clinical judgements when difficult questions arise regarding patient care, particularly when unusual, complex, emergent, or high-risk situations require clinical reasoning and rapid intervention.</p>
                        </li>
                    </ol>
                </neu-lable>
            <!-- </template> -->
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
            proficiency:"select",
            proficinecyDetails:'',
            enableSave :false,
            enableSideNav:false,
      }
  },
  props: {},
  components: {},
  computed: {
      ...mapState('profile',["profileData"]),
      getName():any  {
          return (this.profileData.firstName + " " + this.profileData.lastName);
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
    //   getProficiency() {
    //     return this.profileData?.proficiency.toString();
    //   }
  },
  mounted() {
    
    this.setDefaultValue();
    // localStorage.setItem("guarenteedHours", this.profileData.guarenteedHours);
    localStorage.setItem("UserName", this.profileData.firstName + " " + this.profileData.lastName);
  },
  methods: {
      setDefaultValue(){
            this.proficiency = this.profileData.proficiency.toString();
        },
      // computed
      selectionChange(ev:any){
        this.enableSave = true;
        this.proficiency = ev.detail.value;
        
      },
      
      async saveProficiency(){
        if (this.enableSave) {
            var payload = {
                userId: this.profileData.userId,
                departmentId:this.profileData.departmentId,
                staffTypeId:this.profileData.staffTypeId,
                partOfDayId:this.profileData.partOfDayId,
                fte:this.profileData.fte,
                ptoBalance:this.profileData.ptoBalance,
                // "start": "2023-02-07T10:54:00.722Z",
                // "end": "2023-02-07T10:54:00.722Z",
                rate:this.profileData.rate,
                proficiency:+this.proficiency,
                staffId: this.profileData.staffId,
            };
            
            await this.$store.dispatch('profile/saveProficiency', payload)
                .then((res: any) => {
                    console.log(res);
                    this.enableSave = !this.enableSave;
                })
                .catch((err: any) => {
                    if (err) {
                        console.log(err);
                    }
                });
        }
      },
      toggleSideNav(){
        this.enableSideNav = !this.enableSideNav
      }
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
    /* Media Query for Mobile Devices */
    @media (max-width: 480px) {
    .sideNavPanel{
        position: absolute;
        right: 0;
        top: -55px;
        background-color: #f4f4f4;
        bottom: 92px;
        z-index: 99;
        border-left-style: solid;
        border-left-width: 1px;
        width:100%;
        height:110% !important;
        transition: left 1s ease-in-out;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .sideNavPanelClose{
        display:none; 
        left: 502px;
        transition: left 1s ease-in-out;
    }

    .btnSidePanelClose{
        display: inline-block !important;
        width: 40px !important;
    }

    .panHeading{
        margin-right: 50px !important;
    }
    @keyframes fade_in_show {
        0% {
            opacity: 0;
            transform: scale(0)
        }

        100% {
            opacity: 1;
            transform: scale(1)
        }
    }
    }
          
    /* Media Query for low resolution  Tablets, Ipads */
    @media (min-width: 481px) and (max-width: 767px) {
     .sideNavPanel{
        position: absolute;
        right: 0;
        top: -55px;
        background-color: #f4f4f4;
        bottom: 92px;
        z-index: 99;
        border-left-style: solid;
        border-left-width: 1px;
        width:100%;
        height:110% !important;
        transition: left 1s ease-in-out;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .sideNavPanelClose{
        display:none; 
        left: 502px;
        transition: left 1s ease-in-out;
    }

    @keyframes fade_in_show {
        0% {
            opacity: 0;
            transform: scale(0)
        }

        100% {
            opacity: 1;
            transform: scale(1)
        }
    }       
    }

    @media (min-width: 768px) and (max-width: 899px) {
     .sideNavPanel{
        position: absolute;
        right: 0;
        top: 0px;
        background-color: #f4f4f4;
        bottom: 92px;
        z-index: 99;
        border-left-style: solid;
        border-left-width: 1px;
        width:100%;
        height:110% !important;
        transition: left 1s ease-in-out;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .sideNavPanelClose{
        display:none; 
        left: 502px;
        transition: left 1s ease-in-out;
    }

    @keyframes fade_in_show {
        0% {
            opacity: 0;
            transform: scale(0)
        }

        100% {
            opacity: 1;
            transform: scale(1)
        }
    }       
    }
          
    /* Media Query for Tablets Ipads portrait mode */
    @media (min-width: 900px) and (max-width: 1024px){
     .sideNavPanel{
        position: absolute;
        right: 0;
        top: 0;
        width: 30%;
        display: block;
        background-color: #f4f4f4;
        bottom: 0;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .sideNavPanelClose{
        display:none;
    }

    @keyframes fade_in_show {
        0% {
            opacity: 0;
            transform: scale(0)
        }

        100% {
            opacity: 1;
            transform: scale(1)
        }
    }        
    }
          
    /* Media Query for Laptops and Desktops */
    @media (min-width: 1025px) {
    .sideNavPanel{
        position: absolute;
        right: 0;
        top: 0px;
        width: 30%;
        display: flex;
        background-color: #f4f4f4;
        bottom: 92px;
        overflow-x: hidden;
        overflow-y: auto;
        z-index:99;
        height:100% !important;
        box-shadow: 2px 2px 6px 1px !important;
        border-radius: 5px !important;
    }
    .ptag{
        display: initial;
        align-content: flex-start;
    }

    .sideNavPanelClose{
        display:none;
    }

    @keyframes fade_in_show {
        0% {
            opacity: 0;
            transform: scale(0)
        }

        100% {
            opacity: 1;
            transform: scale(1)
        }
    }  
    }  
    
</style>
