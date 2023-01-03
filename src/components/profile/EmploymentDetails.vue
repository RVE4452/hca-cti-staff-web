<template>
    <div v-if="profileData">
        <div class="neu-margin--bottom-20 neu-margin--top-10 neu-text--caption">
            To update the information below, contact your manager or FSA, or call HCA
            HR Answers at
            <b>1-844-HR-ANSWR(472-6797)</b>.
        </div>
        <div class="row neu-margin--top-20 neu-margin--bottom-20">
            <div class="col-sm-12">
                <h6 class="neu-text--transform-uppercase">
                    IDENTIFIERS
                </h6>
            </div>
            <div class="col-sm-4 neu-margin--top-20 neu-input flex100 flex83">
                <label for="username" class="neu-input__label">Name</label>
                <input class="readonly_text_field"
                       type="text"
                       id="txtUsername"
                       :value="getName"
                       readonly />
            </div>
        </div>
        <div class="row neu-margin--top-20 neu-margin--bottom-20">
            <div class="col-sm-12">
                <h6 class="neu-text--transform-uppercase">
                    CONTACT METHODS
                </h6>
            </div>

            <div class="col-sm-6 neu-margin--top-20 neu-input">
                <label for="txtEmail" class="neu-input__label">Email(s)</label>
                <input class="readonly_text_field"
                       type="text"
                       name="Email"
                       id="txtEmail"
                       readonly
                       :value="profileData.email" />
            </div>
            <div class="col-sm-4 neu-margin--top-20 neu-input flex41">
                <label for="txtPhoneNumber" class="neu-input__label">Phone Number(s)</label>
                <input class="readonly_text_field"
                       type="text"
                       name="PhoneNumber"
                       id="txtPhoneNumber"
                       readonly
                       :value="profileData.homePhoneNumber" />
            </div>

            <div class="col-sm-10 neu-margin--top-20 neu-input">
                <label for="txtHomeAddress" class="neu-input__label">Home Address</label>
                <input class="readonly_text_field"
                       type="text"
                       name="HomeAddress"
                       id="txtHomeAddress"
                       readonly
                       :value="getFullHomeAddress" />
            </div>
        </div>

        <div class="row neu-margin--top-20 neu-margin--bottom-20">
            <div class="col-sm-12">
                <h6 class="neu-text--transform-uppercase">
                    EMPLOYMENT
                </h6>
            </div>
            <div class="col-sm-7 neu-margin--top-20 neu-input">
                <label for="txtFacility" class="neu-input__label">Facility</label>
                <input class="readonly_text_field"
                       type="text"
                       name="Facility"
                       id="txtFacility"
                       readonly
                       :value="getFacility" />
            </div>
            <div class="col-sm-5 neu-margin--top-20 neu-input">
                <label for="txtDepartment" class="neu-input__label">Department</label>
                <input class="readonly_text_field"
                       type="text"
                       name="Department"
                       id="txtDepartment"
                       readonly
                       :value="getDept" />
            </div>
            <div class="col-sm-5 neu-margin--top-20 neu-input">
                <label for="txtWorkSchedule" class="neu-input__label">Work Schedule</label>
                <input class="readonly_text_field"
                       type="text"
                       name="WorkSchedule"
                       id="txtWorkSchedule"
                       readonly
                       :value="profileData.workSchedule" />
            </div>
            <div class="col-sm-5 neu-margin--top-20 neu-input">
                <label for="PartofDay" class="neu-input__label">Part of Day</label>
                <input class="readonly_text_field"
                       type="text"
                       id="txtPartofDay"
                       readonly
                       :value="profileData.partOfDay" />
            </div>
            <div class="col-sm-5 neu-margin--top-20 neu-input marTop1">
                <label for="txtHireDate" class="neu-input__label">Hire Date</label>
                <input class="readonly_text_field"
                       type="text"
                       name="HireDate"
                       id="txtHireDate"
                       readonly
                       :value="getHireDate" />
            </div>
            <div class="col-sm-5 neu-margin--top-20 neu-input marTop1">
                <label for="PartofDay" class="neu-input__label">Guaranteed Hours (Per Week)</label>
                <input class="readonly_text_field"
                       type="text"
                       id="txtGuaranteedHours"
                       readonly
                       :value="profileData.guarenteedHours" />
            </div>
        </div>

        <div class="row neu-margin--top-20 neu-margin--bottom-20">
            <div class="col-sm-12">
                <h6 class="neu-text--transform-uppercase">
                    DEPARTMENTAL SETTINGS
                </h6>
            </div>
            <div class="col-sm-5 neu-margin--top-20 neu-input">
                <label class="neu-input__label">Primary Skill</label>
                <input class="readonly_text_field"
                       type="text"
                       id="txtPrimarySkill"
                       readonly
                       :value="getPrimarySkill" />
            </div>
            <div class="col-sm-5 neu-margin--top-20 neu-input">
                <label class="neu-input__label">Primary Shift</label>
                <input class="readonly_text_field"
                       type="text"
                       id="txtPrimaryShift"
                       readonly
                       :value="profileData.primaryShift" />
            </div>
            <div class="col-sm-5 neu-margin--top-20 neu-input">
                <label class="neu-input__label">Weekend</label>
                <input class="readonly_text_field"
                       type="text"
                       id="txtWeekend"
                       readonly
                       :value="profileData.weekend" />
            </div>
            <div class="col-sm-5 neu-margin--top-20 neu-input">
                <label class="neu-input__label">Group</label>
                <input class="readonly_text_field"
                       type="text"
                       id="txtGroup"
                       readonly
                       :value="profileData.group" />
            </div>
            <div class="col-sm-5 neu-margin--top-20 neu-input">
                <label class="neu-input__label">Holiday</label>
                <input class="readonly_text_field"
                       type="text"
                       id="txtHoliday"
                       readonly
                       :value="profileData.holiday" />
            </div>
            <div class="col-sm-5 neu-margin--top-20 neu-input">
                <label class="neu-input__label">Disaster</label>
                <input class="readonly_text_field"
                       type="text"
                       id="txtDisaster"
                       readonly
                       :value="profileData.disaster" />
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
