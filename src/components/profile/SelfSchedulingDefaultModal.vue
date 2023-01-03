<template>
        <div class="no-print">
            <div class="col-12" v-if="isLoaded">
                <loading :active="isLoading"
                            :can-cancel="false"
                            :height="128"
                            :width="128"
                            :color="loaderColor"
                            :opacity="0.7"
                            :is-full-page="true" />
                <div class="bg-black-05 container-fluid pb3 pt3">
                    <div class="row">
                        <div class="col-12 neu-margin--bottom-20" v-if="!isSelfScheduleNeedsInPrimaryDept">
                            <p><small>Note: Your home department has no shifts available for this date.</small></p>
                        </div>
                        <div class="col-12 neu-margin--bottom-20" v-if="showErrorMsg">
                            <ErrorNotification :errorMsg="errorMsg" :errorType="errorType" />
                        </div>

                        <div class="col-12 pb3">
                            <h4>Days</h4>
                        </div>
                        <div class="col-12">
                            <div class="row">
                                <div class="col-2 mb2 ph2 adjust_col2" v-for="objDL in datesList" :key="'div_' + objDL.id">
                                    <div :id="objDL.id"
                                            class="pa2 tc-ns neu-background--cerulean-25 custom-border pointer"
                                            v-on:click="isEmpty(currentShift) ? toggleDateSelection($event) : null">{{ objDL.dayValue }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="hr-line"></div>
                        </div>
                        <div class="col-12 neu-input">
                            <label for="txtFacility" class="neu-input__label">Facility</label>
                            <!--<template v-if="currentShift == undefined">
                                <select name="ddlFacility" class="neu-input__text-field" v-model="selectedFacilityId" @change="onFacilityChange($event)">
                                    <option v-for="facility in facilities" :value="facility.facilityId" :key="facility.facilityId">
                                        {{facility.facilityName}}
                                    </option>
                                </select>
                            </template>-->

                            <input type="text"
                                    name="Facility"
                                    id="txtFacility"
                                    :value="facilityName"
                                    readonly
                                    class="readonly_text_field neu-input__text-field" />

                        </div>
                        <div class="col-12 neu-margin--top-20 neu-input">
                            <label for="txtDepartment" class="neu-input__label">Department</label>
                            <!--<template v-if="currentShift == undefined">
                                <select name="ddlDepartment" class="neu-input__text-field" v-model="selectedDeptId" @change="onDepartmentChange($event)">
                                    <option v-for="department in facilityDepts" :value="department.departmentId" :key="department.departmentId">
                                        {{department.departmentCode + ' (' + department.departmentName + ')'}}
                                    </option>
                                </select>
                            </template>-->

                            <input type="text"
                                    name="Department"
                                    id="txtDepartment"
                                    :value="departmentName"
                                    readonly
                                    class="readonly_text_field neu-input__text-field" />

                        </div>
                        <div class="col-12 neu-margin--top-20 neu-input">
                            <label for="txtSkill" class="neu-input__label">Skill</label>
                            <!--<template v-if="currentShift == undefined">
                                <select name="ddlSkill" class="neu-input__text-field" v-model="selectedSkillId" @change="onSkillChange($event)">
                                    <option v-for="skill in skills" :value="skill.id" :key="skill.id">
                                        {{skill.description}}
                                    </option>
                                </select>
                            </template>-->

                            <input type="text"
                                    name="Skill"
                                    id="txtSkill"
                                    :value="skillName"
                                    readonly
                                    class="readonly_text_field neu-input__text-field" />

                        </div>
                        <div class="col-12 neu-margin--top-20 neu-input">
                            <label for="txtShift" class="neu-input__label">Shift</label>
                            <template v-if="isEmpty(currentShift)">
                                <model-list-select :list="deptShifts"
                                                    name="ddlShifts"
                                                    @input="onShiftChanges($event)"
                                                    v-model="selectedDeptAndShift"
                                                    option-value="shiftValue"
                                                    option-text="shiftDescription">
                                </model-list-select>
                            </template>
                            <template v-else>
                                <input type="text"
                                        name="shift"
                                        id="txtShift"
                                        :value="deptShiftDesc"
                                        readonly
                                        class="readonly_text_field neu-input__text-field" />
                            </template>
                        </div>
                    </div>
                </div>
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-12" v-if="!isEmpty(currentShift)">
                            <!--<div class="row" v-if="(currentShift == 'Need' && (this.shiftMembers == undefined || (this.shiftMembers != null && this.shiftMembers.length == 0))) ||
                            (currentShift.type == 'Pending' && (this.pendingShiftDetails == undefined || (this.pendingShiftDetails.shiftMembers != null && this.pendingShiftDetails.shiftMembers.length == 0))) ||
                            (currentShift.type == 'Assignment' && (currentShift.status == 'Scheduled' || currentShift.status == 'Pending') && (this.assignmentDetail == undefined || (this.assignmentDetail.shiftMembers != null && this.assignmentDetail.shiftMembers.length == 0)))">
                                            <div class="col-12 neu-margin--top-20">
                                                <p class="neu-text--tag neu-text--align-left">No Shift Member Found</p>
                                            </div>
                                        </div>
                                        <div class="row" v-if="currentShift.type == 'Need' && this.shiftMembers != undefined && (this.shiftMembers != null && this.shiftMembers.length > 0)">
                                            <div class="col-12 neu-margin--top-20"> <p class="neu-text--tag neu-text--align-left">SHIFT MEMBERS</p></div>
                                            <div class="col-12 row mt3">
                                                <div class="col-12 mt2 mb2" v-for="shiftMember in this.shiftMembers" :key="shiftMember.username">
                                                    <div class="d-flex">
                                                        <div class="col-auto pa0">-->
                            <!-- <img
                                class="br-100 h3"
                                src="https://findicons.com/files/icons/1786/oxygen_refit/128/stock_people.png"
                                v-bind:alt="shiftMember.first[0] + shiftMember.last[0]"
                            /> -->
                            <!--<h6 class="bg-gray tc white mr2 initial-name">{{shiftMember.firstName[0] + shiftMember.lastName[0]}}</h6>
                                            </div>
                                            <div class="col-auto pa0">
                                                <div class="row">
                                                    <div class="col-12" v-bind:title="shiftMember.name"><span class="fw6">{{(shiftMember.firstName + ' ' + shiftMember.lastName)}}</span></div>
                                                    <div class="col-12"><span class="gray">{{shiftMember.skill}}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row" v-if="currentShift.type == 'Pending' && this.pendingShiftDetails != undefined && this.pendingShiftDetails.shiftMembers != null && this.pendingShiftDetails.shiftMembers.length > 0">
                                <div class="col-12 neu-margin--top-20"> <p class="neu-text--tag neu-text--align-left">SHIFT MEMBERS</p></div>
                                <div class="col-12 row mt3">
                                    <div class="col-12 mt2 mb2" v-for="PendingShiftMember in this.pendingShiftDetails.shiftMembers" :key="PendingShiftMember.username">
                                        <div class="d-flex">
                                            <div class="col-auto pa0">-->
                            <!-- <img
                                class="br-100 h3"
                                src="https://findicons.com/files/icons/1786/oxygen_refit/128/stock_people.png"
                                v-bind:alt="shiftMember.first[0] + shiftMember.last[0]"
                            /> -->
                            <!--<h6 class="bg-gray tc white mr2 initial-name">{{PendingShiftMember.firstName[0] + PendingShiftMember.lastName[0]}}</h6>
                                            </div>
                                            <div class="col-auto pa0">
                                                <div class="row">
                                                    <div class="col-12" v-bind:title="PendingShiftMember.name"><span class="fw6">{{(PendingShiftMember.firstName + ' ' + PendingShiftMember.lastName)}}</span></div>
                                                    <div class="col-12"><span class="gray">{{PendingShiftMember.skill}}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row" v-if="currentShift.type == 'Assignment' && (currentShift.status == 'Scheduled' || currentShift.status == 'Pending') && isSelfScheduleAllowed == true && assignmentDetail.shiftMembers != null && assignmentDetail.shiftMembers.length > 0">
                                <div class="col-12"><p class="neu-text--tag neu-text--align-left">SHIFT MEMBERS</p></div>
                                <div class="col-12 row mt3">
                                    <div class="col-12 mt2 mb2" v-for="shiftMember in assignmentDetail.shiftMembers" :key="shiftMember.username">
                                        <div class="d-flex">
                                            <div class="col-auto pa0">-->
                            <!-- <img
                                class="br-100 h3"
                                src="https://findicons.com/files/icons/1786/oxygen_refit/128/stock_people.png"
                                v-bind:alt="shiftMember.first[0] + shiftMember.last[0]"
                            /> -->
                            <!--<h6 class="bg-gray tc white mr2 initial-name">{{shiftMember.firstName[0] + shiftMember.lastName[0]}}</h6>
                                            </div>
                                            <div class="col-auto pa0">
                                                <div class="row">
                                                    <div class="col-12" v-bind:title="shiftMember.name"><span class="fw6">{{shiftMember.name}}</span></div>
                                                    <div class="col-12"><span class="gray">{{shiftMember.skill}}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>-->

                        </div>
                        <div class="col-12">
                            <template>
                                <button v-bind:name="buttonName" @click="FireAction" class="d-block mb4 mt4 neu-button w-100 neu-text--white" :class="[ isImpersonating ? 'neu-button--blue-disabled': 'neu-background--denim']" :disabled="isImpersonating">
                                    {{buttonCaption}}
                                </button>
                            </template>
                        </div>
                    </div>
                </div>

                <div v-if="isConfirmModalVisible">
                    <ConfirmMsgPopUp @cancelled="isConfirmModalVisible = false"
                                        @confirmed="confirmedClicked"
                                        :msgValue="confirmMsgValue"></ConfirmMsgPopUp>
                </div>
            </div>
        </div>
</template>
<script lang="ts">
    import { Options, Vue } from 'vue-class-component';
    import moment from "moment";
    import { mapState } from "vuex";
    import { SelfScheduleDefault, SelfScheduleDefaultShift } from '@/models';
    import ErrorNotification from "../shared/ErrorNotification.vue";
    import ConfirmMsgPopUp from "@/components/shared/ConfirmMsgPopUp.vue";
   
    // import { ModelListSelect } from 'vue-search-select'
    // import Loading from 'vue-loading-overlay';
    import 'vue-loading-overlay/dist/vue-loading.css';
    class Props {
         currentShift!: SelfScheduleDefaultShift;
         calSelectedDates!: any;
    }
    @Options({
        components: {
            ErrorNotification,
            // ModelListSelect,
            // Loading,
            ConfirmMsgPopUp
        },
        computed: {
            ...mapState('schedule', ['selfScheduleShiftMembers','selfScheduleShiftDetails','selfScheduleFacilities','selfScheduleDepartments']),
             ...mapState('profile', ['profileData','isImpersonating'])
        },
    })
    export default class SelfSchedulingDefaultModal extends Vue.with(Props) {
       
        public selfScheduleShiftMembers!: any;
        public selfScheduleShiftDetails: any;        
        public profileData!: any;       
        public selfScheduleFacilities: any;        
        public selfScheduleDepartments: any;
        
        isImpersonating!: boolean;
        
        shiftMembers: any = [];
        isLoaded: boolean = false;
        isProductive: boolean = false;
        isSelfScheduled: boolean = false;
        deptShifts: any = [];
        skillName!: string;
        buttonCaption: string = "Add to Schedule";
        buttonName: string = "btnAddToSchedule";
        tenantId!: string;
        staffId!: number;
        deptId!: number;
        skillId!: number;
        err: string = '';
        shiftStartTime!: Date;
        shiftEndTime!: Date;
        actualStartTime!: Date;
        actualEndTime!: Date;
        actualShiftStartTime: string = "6:30am";
        actualShiftEndTime: string = "6:30pm";
        deptShiftId: number = 0;
        deptShiftDesc: string = '';
        deptShiftCode!: string;
        productiveType: string = '';
        isModalVisible: boolean = false;
        errorMsg: string = '';
        errorType: string = 'error';
        showErrorMsg: boolean = false;
        classFlag: string = '';
        isSelfScheduleAllowed: boolean = false;
        allowSelfScheduleToCommitment: boolean = false;
        guranteedHrs: number = 0;
        weeksInSchedule: number = 4;
        displayWSC: boolean = true;
        reqCountWSC: number = 0;
        facilities: any = [];
        facilityDepts: any = [];
        selectedFacilityId: number = 0;
        selectedDeptId: number = 0;
        skills: any = [];
        selectedSkillId: number = 0;
        selectedDeptShiftId: string = '';
        selectedDeptAndShift: any = {
            tenantId: '',
            facilityId: 0,
            coid: '',
            facilityName: '',
            departmentId: 0,
            departmentName: '',
            departmentCode: '',
            departmentShiftId: 0,
            shiftCode: '',
            shiftDescription: '',
            startTime: '',
            endTime: '',
            shiftMembers: []
        };
        facilityCoid: number = 0;
        departmentCode: number = 0;
        facilityName: string = '';
        departmentName: string = '';
        isLoading: boolean = false;
        loaderColor: string = "#0085ca";
        isConfirmModalVisible: boolean = false;
        confirmMsgValue: string = '';
        datesList: any = [];
        isSelfScheduleNeedsInPrimaryDept: boolean = true;
        existingDefaultSelfSchedule!: SelfScheduleDefault;

       

        async mounted() {
            this.buttonCaption = (this.isEmpty(this.currentShift) ? "Add to Schedule" : "Withdraw");
            this.buttonName = (this.isEmpty(this.currentShift) ? "btnAddToSchedule" : "btnWithdraw");
            this.skillName = this.profileData.skills.find((x:any) => x.primary == true).description;
            this.tenantId = this.profileData.tenantId;
            this.staffId = this.profileData.staffId;
            this.deptId = this.profileData.deptId;
            this.skillId = this.profileData.skills.find((x:any) => x.primary == true).id;
            this.isSelfScheduleAllowed = this.profileData.selfSchedule;
            this.allowSelfScheduleToCommitment = this.profileData.selfScheduleToCommitment;
            this.skills = this.profileData.skills;
            this.guranteedHrs = this.profileData.guarenteedHours;
            this.weeksInSchedule = this.profileData.weeksInSchedule;
            this.displayWSC =
                this.profileData.weekendShiftCommitment != 0 ? true : false;
            this.reqCountWSC = this.profileData.weekendShiftCommitment;

            this.existingDefaultSelfSchedule = JSON.parse(localStorage.getItem("DefaultSelfSchedule") || '{}');

            await this.showCalenderSelectedDates();

            if (this.isEmpty(this.currentShift))//
            {
                this.getSelfScheduleNeedsDetails();
            }
            else {
                this.getCurrentShiftDetails();
            }
        }

        async showCalenderSelectedDates() {
            var startSD = moment(this.calSelectedDates.startDate, 'M/D/YYYY');
            var endSD = moment(this.calSelectedDates.endDate, 'M/D/YYYY');
            var diffDays = endSD.diff(startSD, 'days');
            let calCurrentDate: Date = new Date(this.calSelectedDates.startDate);

            for (var i = 0; i < diffDays; i++) {
                let singleDate = {
                    id: i,
                    dayValue: this.getDayValue(calCurrentDate),
                    dateValue: calCurrentDate,
                    isSelected: true
                }
                this.datesList[i] = JSON.parse(JSON.stringify(singleDate));
                calCurrentDate.setDate(calCurrentDate.getDate() + 1);
            }
        }

        isEmpty(obj:any) {
            return Object.keys(obj).length === 0;
        }

        getDayValue(calDateValue:any) {
            var returnDayValue: number;
            var monthValue = moment(calDateValue).format("M");
            if (monthValue == "5")// May
            {
                returnDayValue = Number(moment(calDateValue).format("D"));
            }
            else // June
            {
                returnDayValue = Number(moment(calDateValue).format("D")) + 31;
            }
            return returnDayValue;
        }

        getSelfScheduleNeedsDetails() {
            let selectedDateVal = (this.isEmpty(this.currentShift) ? moment(this.datesList[0].dateValue).format('YYYY-MM-DDTHH:mm:ss') : this.currentShift.date);
            var departmentIdVal;
            if (this.isEmpty(this.currentShift)) {
                var lstDeptId = this.deptId.toString();
                if (this.profileData.secondaryDepartments.length > 0) {
                    for (var i = 0; i < this.profileData.secondaryDepartments.length; i++) {
                        if (this.profileData.secondaryDepartments[i].facilityId == this.profileData.facilityId) {
                            lstDeptId = lstDeptId + "," + this.profileData.secondaryDepartments[i].deptId;
                        }
                    }
                }
                departmentIdVal = lstDeptId;
            }
            else {
                departmentIdVal = this.currentShift.departmentId;
            }
            const payload = { date: selectedDateVal, departmentIds: departmentIdVal, username: this.profileData.username };

            this.$store
                .dispatch("schedule/GetSelfScheduleNeedsDetails", payload)
                .then((data) => {
                    this.isLoaded = true;
                    if (this.selfScheduleShiftDetails != undefined) {
                        this.facilities = this.selfScheduleFacilities;
                        let selectedFacility = this.facilities.find((f:any) => f.facilityId == this.profileData.facilityId);

                        if (selectedFacility == 'undefined') {
                            selectedFacility = this.selectedFacilityId = this.facilities[0];
                        }

                        this.selectedFacilityId = selectedFacility.facilityId;
                        this.facilityName = selectedFacility.facilityName;
                        this.facilityCoid = selectedFacility.coid;

                        this.facilityDepts = this.selfScheduleDepartments.filter((x:any) => x.facilityId == selectedFacility.facilityId);
                        let selectedDept = this.facilityDepts.find((d:any) => d.departmentId == this.profileData.deptId);

                        if (selectedDept == 'undefined' || selectedDept == null) {
                            this.isSelfScheduleNeedsInPrimaryDept = false;
                            selectedDept = this.facilityDepts[0]
                        }
                        this.selectedDeptId = selectedDept.departmentId;
                        this.departmentName = selectedDept.departmentCode;
                        this.departmentCode = selectedDept.departmentName;
                        this.skills = this.profileData.skills;
                        this.selectedSkillId = this.profileData.skills.find((x:any) => x.primary == true).id;
                        this.deptShifts = this.removeDuplicatesFromArrayByProperty(this.selfScheduleShiftDetails.filter((x:any) => x.departmentId == this.selectedDeptId), 'shiftCode');

                        this.deptShifts.forEach((shift: any) => {
                            let startTime, endTime;
                            startTime = this.formatTime(this.addMinutes(shift.startTime, shift.offset));
                            endTime = this.formatTime(this.addMinutes(this.addMinutes(shift.endTime, shift.offset), shift.breakMinutes));

                            if (shift.shiftDescription.trim().toUpperCase() == shift.shiftCode.trim().toUpperCase()) {
                                shift.shiftDescription = shift.shiftDescription + " " + startTime.toUpperCase() + " - " + endTime.toUpperCase();
                            }
                        });

                        this.selectedDeptAndShift = this.deptShifts[0];
                        this.selectedDeptShiftId = +this.deptShifts[0].departmentShiftId + '_' + this.deptShifts[0].departmentId;
                        this.setShiftDetails(this.deptShifts[0].departmentShiftId, this.deptShifts[0].departmentId);
                    }
                })
                .catch((err: any) => {
                    if (err) {
                        console.log(err); // Handle errors any way you want
                    }
                });
        }

        getCurrentShiftDetails() {
            this.isLoaded = true;
            if (!this.isEmpty(this.currentShift)) {
                this.facilityName = this.currentShift.facilityName;
                this.departmentName = this.currentShift.departmentName;
                this.skillName = this.currentShift.skill;
                this.skillId = this.skills.find((s:any) => s.id == this.currentShift.skillId);
                this.deptShiftId = this.currentShift.departmentShiftId;
                this.deptShiftDesc = this.currentShift.shiftDescription;
                this.shiftStartTime = this.currentShift.startTime;
                this.shiftEndTime = this.currentShift.endTime;
            }
        }

        toggleDateSelection(event:any) {
            let currentId = event.currentTarget.id;

            for (var i = 0; i < this.datesList.length; i++) {
                if (this.datesList[i].id == currentId) {
                    let currentStatus: boolean = (this.datesList[i].isSelected);
                    this.datesList[i].isSelected = !(this.datesList[i].isSelected);
                    if (currentStatus) {
                        event.currentTarget.classList.remove("neu-background--cerulean-25");
                        event.currentTarget.classList.add("neu-background--white");
                    }
                    else {
                        event.currentTarget.classList.remove("neu-background--white");
                        event.currentTarget.classList.add("neu-background--cerulean-25");
                        if (this.showErrorMsg) {
                            this.showErrorMsg = false;
                            this.errorMsg = "";
                        }
                    }
                }
            }
        }

        onFacilityChange(event:any) {
            this.selectedFacilityId = event.target.value;
            this.facilityDepts = this.selfScheduleDepartments.filter((x:any) => x.facilityId == event.target.value);
            this.facilityName = this.facilities.find((f:any) => f.facilityId == event.target.value).facilityName;
            this.facilityCoid = this.facilities.find((f:any) => f.facilityId == event.target.value).coid;
            this.selectedDeptId = this.facilityDepts[0].departmentId;
            this.departmentName = this.facilityDepts[0].departmentCode;
            this.departmentCode = this.facilityDepts[0].departmentName;
            this.deptShifts = this.removeDuplicatesFromArrayByProperty(this.selfScheduleShiftDetails.filter((x:any) => x.departmentId == this.selectedDeptId), 'shiftCode');

            this.deptShifts.forEach((shift: any) => {
                let startTime, endTime;
                startTime = this.formatTime(this.addMinutes(shift.startTime, shift.offset));
                endTime = this.formatTime(this.addMinutes(this.addMinutes(shift.endTime, shift.offset), shift.breakMinutes));

                if (shift.shiftDescription.trim().toUpperCase() == shift.shiftCode.trim().toUpperCase()) {
                    shift.shiftDescription = shift.shiftDescription + " " + startTime.toUpperCase() + " - " + endTime.toUpperCase();
                }
            });

            const selecteId = +this.deptShifts[0].departmentShiftId + '_' + this.deptShifts[0].departmentId;
            this.selectedDeptShiftId = selecteId;
            this.selectedDeptAndShift = this.deptShifts[0];
            this.setShiftDetails(this.deptShifts[0].departmentShiftId, this.deptShifts[0].departmentId);
        }

        onDepartmentChange(event:any) {
            this.selectedDeptId = event.target.value;
            this.departmentName = this.selfScheduleShiftDetails.find((x:any) => x.departmentId == event.target.value).departmentCode;
            this.departmentCode = this.selfScheduleShiftDetails.find((x:any) => x.departmentId == event.target.value).departmentName;
            this.deptShifts = this.removeDuplicatesFromArrayByProperty(this.selfScheduleShiftDetails.filter((x:any) => x.departmentId == this.selectedDeptId), 'shiftCode');

            this.deptShifts.forEach((shift: any) => {
                let startTime, endTime;
                startTime = this.formatTime(this.addMinutes(shift.startTime, shift.offset));
                endTime = this.formatTime(this.addMinutes(this.addMinutes(shift.endTime, shift.offset), shift.breakMinutes));

                if (shift.shiftDescription.trim().toUpperCase() == shift.shiftCode.trim().toUpperCase()) {
                    shift.shiftDescription = shift.shiftDescription + " " + startTime.toUpperCase() + " - " + endTime.toUpperCase();
                }
            });

            const selecteId = +this.deptShifts[0].departmentShiftId + '_' + this.deptShifts[0].departmentId;
            this.selectedDeptShiftId = selecteId;
            this.selectedDeptAndShift = this.deptShifts[0];

            this.setShiftDetails(this.deptShifts[0].departmentShiftId, this.deptShifts[0].departmentId);
        }

        onSkillChange(event:any) {
            this.selectedSkillId = event.target.value;
            this.skillName = this.skills.find((x:any) => x.id == event.target.value).description;
        }

        onShiftChanges(event:any) {
            this.selectedDeptShiftId = event;
            this.selectedDeptAndShift = this.deptShifts.find((x:any) => x.departmentShiftId == event.departmentShiftId && x.departmentId == event.departmentId);
            this.setShiftDetails(event.departmentShiftId, event.departmentId);

            if (this.showErrorMsg) {
                this.showErrorMsg = false;
                this.errorMsg = "";
            }
        }

        setShiftDetails(deptShiftId:any, deptId:any) {
            const selectedDeptShift = this.deptShifts.find((x:any) => x.departmentShiftId == deptShiftId
                && x.departmentId == deptId);
            this.shiftMembers = selectedDeptShift.shiftMembers;
            this.shiftStartTime = selectedDeptShift.startTime;
            this.deptShiftCode = selectedDeptShift.shiftCode;
            this.deptShiftDesc = selectedDeptShift.shiftDescription;
            this.productiveType = selectedDeptShift.productiveType;
            this.shiftEndTime = selectedDeptShift.endTime;
            this.actualStartTime = this.addMinutes(selectedDeptShift.startTime, selectedDeptShift.offset);
            this.actualEndTime = this.addMinutes(this.addMinutes(selectedDeptShift.endTime, selectedDeptShift.offset), selectedDeptShift.breakMinutes);
            this.actualShiftStartTime = this.formatTime(this.actualStartTime);
            this.actualShiftEndTime = this.formatTime(this.actualEndTime);
        }

        removeDuplicatesFromArrayByProperty = (arr:any, prop:any) => arr.reduce((accumulator:any, currentValue:any) => {
            if (!accumulator.find((obj:any) => obj[prop] === currentValue[prop])) {
                accumulator.push(currentValue);
            }
            return accumulator;
        }, [])

        validateBeforeSave() {
            let selectedDatesCount: number = 0;
            for (var i = 0; i < this.datesList.length; i++) {
                if (this.datesList[i].isSelected) {
                    selectedDatesCount++;
                }
            }
            if (selectedDatesCount > 0) {
                return true;
            }
            else {
                this.showErrorMsg = true;
                this.errorType = "error";
                this.errorMsg = "Please select atleast one day";
                return false;
            }
        }

        async SaveShiftDetails() {
            if (this.existingDefaultSelfSchedule.defaultShifts != undefined) {
                for (var i = 0; i < this.datesList.length; i++) {
                    if (this.showErrorMsg) {
                        break;
                    }

                    if (this.datesList[i].isSelected == true) //
                    {
                        var dateVal = Number(this.datesList[i].dayValue);
                        var lstShifts: SelfScheduleDefaultShift[] = this.existingDefaultSelfSchedule.defaultShifts.filter(x => x.dayOfSchedule == dateVal);
                        if (lstShifts != null) {
                            for (var j = 0; j < lstShifts.length; j++) {
                                const selectedDeptShift = this.deptShifts.find((x:any) => x.shiftCode == lstShifts[j].shiftCode);
                                if ((selectedDeptShift.startTime < this.shiftEndTime) && (this.shiftStartTime < selectedDeptShift.endTime)) {
                                    this.isLoading = false;
                                    this.showErrorMsg = true;
                                    this.errorMsg = "Shifts may not overlap.\n Please select a shift with a different start or end time.";
                                    return;
                                }
                            }
                        }
                    }
                }
            }
            if (!this.showErrorMsg) {
                this.isLoading = true;
                for (var k = 0; k < this.datesList.length; k++) {
                    if (this.datesList[k].isSelected == true) //
                    {
                        var ShiftDetails = {
                            id: this.getGuidValue(),
                            facilityId: this.selectedFacilityId,
                            coid: this.facilityCoid.toString(),
                            facilityName: this.facilityName,
                            departmentId: this.selectedDeptId,
                            departmentName: this.departmentName,
                            departmentCode: this.departmentCode.toString(),
                            departmentShiftId: this.selectedDeptAndShift.departmentShiftId,
                            dayOfSchedule: Number(this.datesList[k].dayValue),
                            startTime: this.shiftStartTime,
                            endTime: this.shiftEndTime,
                            skillId: this.selectedSkillId,
                            shiftCode: this.deptShiftCode,
                            shiftDescription: this.deptShiftDesc,
                            skill: this.skillName,
                            date: this.datesList[k].dateValue,
                            actualStartTime: this.actualShiftStartTime,
                            actualEndTime: this.actualShiftEndTime,
                            productiveType: this.productiveType
                        };

                        if (this.existingDefaultSelfSchedule.defaultShifts == undefined) {
                            var defaultScheduleDetails = {
                                id: this.profileData.username,
                                username: this.profileData.username,
                                staffId: this.staffId,
                                tenantId: this.tenantId,
                                first: this.profileData.first,
                                last: this.profileData.last,
                                defaultShifts: []
                            }
                            this.existingDefaultSelfSchedule = JSON.parse(JSON.stringify(defaultScheduleDetails));
                        }
                        this.existingDefaultSelfSchedule.defaultShifts.push(JSON.parse(JSON.stringify(ShiftDetails)));
                    }
                }

                localStorage.setItem("DefaultSelfSchedule", JSON.stringify(this.existingDefaultSelfSchedule));
                var retrievedPerson = JSON.parse(localStorage.getItem('DefaultSelfSchedule') || '{}'); //retrieve the object
                this.isLoading = false;
                this.$emit('showSuccessMsgPopUp');
            }
        }

        async FireAction() {
            if (this.isEmpty(this.currentShift) && this.validateBeforeSave() == true) // -- Add toSchedule
            {
                this.SaveShiftDetails();
            }
            else if (!this.isEmpty(this.currentShift)) // -- Withdraw
            {
                this.isLoading = true;
                if (this.existingDefaultSelfSchedule.defaultShifts != undefined) {
                    var selectedShiftIndex = this.existingDefaultSelfSchedule.defaultShifts.findIndex(x => x.id == this.currentShift.id);
                    this.existingDefaultSelfSchedule.defaultShifts.splice(selectedShiftIndex, 1);
                    localStorage.setItem("DefaultSelfSchedule", JSON.stringify(this.existingDefaultSelfSchedule));
                }
                this.isLoading = false;
                this.$emit('showSuccessMsgPopUp');
            }
        }

        getGuidValue() {
            var uuidValue = "", k, randomValue;
            for (k = 0; k < 32; k++) {
                randomValue = Math.random() * 16 | 0;
                if (k == 8 || k == 12 || k == 16 || k == 20) {
                    uuidValue += "-"
                }
                uuidValue += (k == 12 ? 4 : (k == 16 ? (randomValue & 3 | 8) : randomValue)).toString(16);
            }
            return uuidValue;
        }

        formatTime(t: Date): string {
            return moment(t).format("h:mm a");
        }

        addMinutes(date:any, minutes:any) {
            return moment(date).add(minutes, 'm').toDate();
        }
    }

</script>

<style lang="css">
    .vertical-center {
        margin: 0;
        position: absolute;
        justify-content: center;
        align-items: center;
    }

    .modal-fade-enter,
    .modal-fade-leave-to {
        opacity: 0;
    }

    .modal-fade-enter-active,
    .modal-fade-leave-active {
        transition: opacity 0.5s ease;
    }

    .modal-backdrop {
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.3);
        justify-content: center;
        align-items: center;
    }

    .modal {
        background: #ffffff;
        box-shadow: 2px 2px 20px 1px;
        overflow-x: auto;
        display: flex;
        flex-direction: column;
    }

    .modal-header {
        padding: 15px;
        justify-content: center;
    }

    .modal-body {
        position: relative;
        padding: 20px 10px;
    }

    .c4c-modal {
        max-width: 50%;
        overflow: hidden;
        font-family: "HCA-Mark-Medium", "Arial", sans-serif !important;
        margin-top: 8rem;
        background: white;
        box-shadow: 0px 16px 30px 0px rgba("1f2532", 0.5);
    }

    .c4c-modal-body section {
        border-radius: 4px;
        border: 1px solid #bcbcbc;
        padding: 1rem;
        margin-bottom: 1rem;
    }

        .c4c-modal-body section h6 {
            text-transform: uppercase;
            font-size: 1rem;
        }

    .adjustWidth {
        min-width: auto !important;
    }

    .adjust_col2 {
        max-width: 16.666667% !important;
        text-align: center !important;
        padding-left: 0.5rem !important;
        padding-right: 0.5rem !important;
    }

    .marTop0 {
        margin-top: 0 !important;
    }

    p > small {
        font-size: 100%;
    }

    @media (max-width: 480px) {
        .modelWidth {
            width: 90% !important;
            max-width: 90% !important;
        }

        .adjust_col2 {
            max-width: 13.666667% !important;
            text-align: center !important;
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
        }
    }

    /* Media Query for low resolution  Tablets, Ipads */
    @media (min-width: 481px) and (max-width: 767px) {
        .modelWidth {
            width: 90% !important;
            max-width: 90% !important;
        }

        .adjust_col2 {
            max-width: 8.666667% !important;
            text-align: center !important;
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
        }
    }

    @media (min-width: 768px) and (max-width: 899px) {
        .modelWidth {
            width: 90% !important;
            max-width: 90% !important;
        }

        .adjust_col2 {
            max-width: 7.666667% !important;
            text-align: center !important;
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
        }
    }
</style>
