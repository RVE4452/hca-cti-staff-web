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
                    EMPLOYMENT
                </h6>
            </div>
            <div class="col-sm-7 neu-margin--top-20">
                <neu-label for="txtFacility">Facility</neu-label>
                
                <neu-input type="text" autocomplete="off" readonly="true"   name="Facility"
                id="txtFacility"  :value="getFacility" >
                </neu-input>
            </div>
            <div class="col-sm-5 neu-margin--top-20">
                <neu-label for="txtDepartment">Department</neu-label>
                
                <neu-input type="text" autocomplete="off" readonly="true"   name="Department"
                  id="txtDepartment" :value="getDept" >
                </neu-input>
            </div>
            <div class="col-sm-5 neu-margin--top-20">
                <neu-label for="txtWorkSchedule">Work Schedule</neu-label>
                
                <neu-input type="text" autocomplete="off" readonly="true" name="WorkSchedule"
                  id="txtWorkSchedule" :value="profileData.workSchedule">
                </neu-input>
            </div>
            <div class="col-sm-5 neu-margin--top-20">
                <neu-label for="PartofDay">Part of Day</neu-label>
                
                <neu-input type="text" autocomplete="off" readonly="true" id="txtPartofDay"
                       :value="profileData.partOfDay">
                </neu-input>
            </div>
            <div class="col-sm-5 neu-margin--top-20  marTop1">
                <neu-label for="txtHireDate">Hire Date</neu-label>
                
                <neu-input type="text" autocomplete="off" readonly="true" name="HireDate"
                       id="txtHireDate" :value="getHireDate">
                </neu-input>
            </div>
            <div class="col-sm-5 neu-margin--top-20 marTop1">
                <neu-label for="PartofDay">Guaranteed Hours (Per Week)</neu-label>
                
                <neu-input type="text" autocomplete="off" readonly="true"  id="txtGuaranteedHours" :value="profileData.guarenteedHours">
                </neu-input>
            </div>
        </div>

        <div class="row neu-margin--top-20 neu-margin--bottom-20">
            <div class="col-sm-12">
                <h6 class="neu-text--transform-uppercase">
                    DEPARTMENTAL SETTINGS
                </h6>
            </div>
            <div class="col-sm-5 neu-margin--top-20">
                <neu-label>Primary Skill</neu-label>
               
                <neu-input type="text" autocomplete="off" readonly="true" id="txtPrimarySkill" :value="getPrimarySkill">
                </neu-input>
            </div>
            <div class="col-sm-5 neu-margin--top-20">
                <neu-label>Primary Shift</neu-label>
        
                <neu-input type="text" autocomplete="off" readonly="true" id="txtPrimaryShift"
                :value="profileData.primaryShift" >
                </neu-input>
            </div>
            <div class="col-sm-5 neu-margin--top-20">
                <neu-label>Weekend</neu-label>
                
                <neu-input type="text" autocomplete="off" readonly="true" id="txtWeekend"
                       :value="profileData.weekend"  >
                </neu-input>
            </div>
            <div class="col-sm-5 neu-margin--top-20">
                <neu-label>Group</neu-label>
                
                <neu-input type="text" autocomplete="off" readonly="true" id="txtGroup"
                :value="profileData.group"   >
                </neu-input>
            </div>
            <div class="col-sm-5 neu-margin--top-20">
                <neu-label>Holiday</neu-label>
                <neu-input type="text" autocomplete="off" readonly="true" id="txtHoliday"
                :value="profileData.holiday" >
                </neu-input>
            </div>
            <div class="col-sm-5 neu-margin--top-20">
                <neu-label>Disaster</neu-label>
                <neu-input type="text" autocomplete="off" readonly="true" id="txtDisaster"
                :value="profileData.disaster" >
                </neu-input>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from 'vue-class-component';
    import moment from "moment";
    import { mapState } from "vuex";

    @Options({computed: {
            ...mapState('profile', ['profileData']),
        },})
    export default class EmploymentDetails extends Vue {
       
        public profileData!: any;

        mounted() {
            localStorage.setItem("guarenteedHours", this.profileData.guarenteedHours);
            localStorage.setItem("UserName", this.profileData.first + " " + this.profileData.last);
        }

        // computed

        get getName() {
            return (this.profileData.first + " " + this.profileData.last);
        }
        get getFullHomeAddress() {
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
        }
        
        get getPrimarySkill() {
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
        }

        get getHireDate() {
            return this.profileData.hired != null
                ? moment(String(this.profileData.hired)).format("MM/DD/YYYY")
                : "";
        }
        get getFacility() {
            return "(" + this.profileData.coid + ") " + this.profileData.facilityName;
        }
        get getDept() {
            return "(" + this.profileData.deptCode + ") " + this.profileData.deptName;
        }
    }
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
