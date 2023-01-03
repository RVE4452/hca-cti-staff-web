<template>
    <div class="col-12" v-if="isLoaded">
        <loading :active="isLoading"
                 :can-cancel="false"
                 :height="128"
                 :width="128"
                 :color="loaderColor"
                 :opacity="0.7"
                 :is-full-page="true" />
        <div class="bg-black-05 container-fluid neu-margin--bottom-20 pb4 pt3">
            <div class="row">
                <div class="col-12 neu-margin--bottom-20" v-if="!isSelfScheduleNeedsInPrimaryDept">
                    <p><small>Note: Your home department has no shifts available for this date.</small></p>
                </div>
                <div class="col-12 neu-margin--bottom-20" v-if="showErrorMsg">
                    <ErrorNotification :errorMsg="errorMsg" :errorType="errorType" />
                </div>
                <template v-if="currentEvent.type == undefined">
                    <div class="col-12 pb4">
                        <h4>Dates</h4>
                    </div>
                    <div class="col-12">
                        <div class="row">
                            <div class="col-6 mb3" v-for="objDL in datesList" :key="'div_' + objDL.id">
                                <div :id="objDL.id"
                                     class="pa2 neu-background--cerulean-25 custom-border pointer"
                                     v-on:click="toggleDateSelection($event)">{{ getDisplayDate(objDL.id)}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="hr-line"></div>
                    </div>
                </template>
                <template v-else>
                    <div class="col-12 f3">
                        <h5>
                            {{ formatDate(currentEvent.date) }}
                        </h5>
                    </div>
                </template>
                <div class="col-12 neu-margin--top-20 neu-input">
                    <label for="txtFacility" class="neu-input__label">Facility</label>
                    <template v-if="currentEvent.type == undefined || currentEvent.type == 'Need'">
                        <select name="ddlFacility" class="neu-input__text-field" v-model="selectedFacilityId" @change="onFacilityChange($event)">
                            <option v-for="facility in facilities" :value="facility.facilityId" :key="facility.facilityId">
                                {{facility.facilityName}}
                            </option>
                        </select>
                    </template>
                    <template v-else>
                        <input type="text"
                               name="Facility"
                               id="txtFacility"
                               :value="facilityName"
                               readonly
                               class="readonly_text_field neu-input__text-field" />
                    </template>
                </div>
                <div class="col-12 neu-margin--top-20 neu-input">
                    <label for="txtDepartment" class="neu-input__label">Department</label>
                    <template v-if="currentEvent.type == undefined || currentEvent.type == 'Need'">
                        <select name="ddlDepartment" class="neu-input__text-field" v-model="selectedDeptId" @change="onDepartmentChange($event)">
                            <option v-for="department in facilityDepts" :value="department.departmentId" :key="department.departmentId">
                                {{department.departmentCode + ' (' + department.departmentName + ')'}}
                            </option>
                        </select>
                    </template>
                    <template v-else>
                        <input type="text"
                               name="Department"
                               id="txtDepartment"
                               :value="departmentName"
                               readonly
                               class="readonly_text_field neu-input__text-field" />
                    </template>
                </div>
                <div class="col-12 neu-margin--top-20 neu-input">
                    <label for="txtSkill" class="neu-input__label">Skill</label>
                    <template v-if="currentEvent.type == undefined || currentEvent.type == 'Need'">
                        <select name="ddlSkill" class="neu-input__text-field" v-model="selectedSkillId" @change="onSkillChange($event)">
                            <option v-for="skill in skills" :value="skill.id" :key="skill.id">
                                {{skill.description}}
                            </option>
                        </select>
                    </template>
                    <template v-else>
                        <input type="text"
                               name="Skill"
                               id="txtSkill"
                               :value="skillName"
                               readonly
                               class="readonly_text_field neu-input__text-field" />
                    </template>
                </div>
                <div class="col-12 neu-margin--top-20 neu-input">
                    <label for="txtShift" class="neu-input__label">Shift</label>
                    <template v-if="currentEvent.type == undefined || currentEvent.type == 'Need'">
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
                               class="readonly_text_field neu-input__text-field" v-if="currentEvent.type == 'Pending' || (currentEvent.type == 'Assignment' && (currentEvent.status == 'Scheduled' || currentEvent.status == 'Pending'))" />
                    </template>
                </div>
            </div>
        </div>
        <div class="container-fluid mt4">
            <div class="row">
                <div class="col-12">
                    <label for="shiftTime" class="f3 h4 tl ttu">
                        {{ actualShiftStartTime }} -
                        {{ actualShiftEndTime  }}
                    </label>
                </div>
                <div class="col-12" v-if="currentEvent.type != undefined">
                    <div class="row" v-if="(currentEvent.type == 'Need' && (this.shiftMembers == undefined || (this.shiftMembers != null && this.shiftMembers.length == 0))) ||
                    (currentEvent.type == 'Pending' && (this.pendingShiftDetails == undefined || (this.pendingShiftDetails.shiftMembers != null && this.pendingShiftDetails.shiftMembers.length == 0))) ||
                    (currentEvent.type == 'Assignment' && (currentEvent.status == 'Scheduled' || currentEvent.status == 'Pending') && (this.assignmntDetail == undefined || (this.assignmntDetail.shiftMembers != null && this.assignmntDetail.shiftMembers.length == 0)))">
                        <div class="col-12 neu-margin--top-20">
                            <p class="neu-text--tag neu-text--align-left">No Shift Member Found</p>
                        </div>
                    </div>
                    <div class="row" v-if="currentEvent.type == 'Need' && this.shiftMembers != undefined && (this.shiftMembers != null && this.shiftMembers.length > 0)">
                        <div class="col-12 neu-margin--top-20"> <p class="neu-text--tag neu-text--align-left">SHIFT MEMBERS</p></div>
                        <div class="col-12 row mt3">
                            <div class="col-12 mt2 mb2" v-for="shiftMember in this.shiftMembers" :key="shiftMember.username">
                                <div class="d-flex">
                                    <div class="col-auto pa0">
                                        <!-- <img
                                            class="br-100 h3"
                                            src="https://findicons.com/files/icons/1786/oxygen_refit/128/stock_people.png"
                                            v-bind:alt="shiftMember.first[0] + shiftMember.last[0]"
                                        /> -->
                                        <h6 class="bg-gray tc white mr2 initial-name">{{shiftMember.firstName[0] + shiftMember.lastName[0]}}</h6>
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
                    <div class="row" v-if="currentEvent.type == 'Pending' && this.pendingShiftDetails != undefined && this.pendingShiftDetails.shiftMembers != null && this.pendingShiftDetails.shiftMembers.length > 0">
                        <div class="col-12 neu-margin--top-20"> <p class="neu-text--tag neu-text--align-left">SHIFT MEMBERS</p></div>
                        <div class="col-12 row mt3">
                            <div class="col-12 mt2 mb2" v-for="PendingShiftMember in this.pendingShiftDetails.shiftMembers" :key="PendingShiftMember.username">
                                <div class="d-flex">
                                    <div class="col-auto pa0">
                                        <!-- <img
                                            class="br-100 h3"
                                            src="https://findicons.com/files/icons/1786/oxygen_refit/128/stock_people.png"
                                            v-bind:alt="shiftMember.first[0] + shiftMember.last[0]"
                                        /> -->
                                        <h6 class="bg-gray tc white mr2 initial-name">{{PendingShiftMember.firstName[0] + PendingShiftMember.lastName[0]}}</h6>
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
                    <div class="row" v-if="currentEvent.type == 'Assignment' && (currentEvent.status == 'Scheduled' || currentEvent.status == 'Pending') && isSelfScheduleAllowed == true && assignmntDetail.shiftMembers != null && assignmntDetail.shiftMembers.length > 0">
                        <div class="col-12"><p class="neu-text--tag neu-text--align-left">SHIFT MEMBERS</p></div>
                        <div class="col-12 row mt3">
                            <div class="col-12 mt2 mb2" v-for="shiftMember in assignmntDetail.shiftMembers" :key="shiftMember.username">
                                <div class="d-flex">
                                    <div class="col-auto pa0">
                                        <!-- <img
                                          class="br-100 h3"
                                          src="https://findicons.com/files/icons/1786/oxygen_refit/128/stock_people.png"
                                          v-bind:alt="shiftMember.first[0] + shiftMember.last[0]"
                                        /> -->
                                        <h6 class="bg-gray tc white mr2 initial-name">{{shiftMember.firstName[0] + shiftMember.lastName[0]}}</h6>
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
                    </div>

                </div>
                <div class="col-12 mt3 mb2 tc" v-if="canModify == false">
                    <h6>Cannot be Modified</h6>
                </div>
                <div class="col-12" v-if="canModify == true">
                    <template v-if="assignmntDetail != null && assignmntDetail.canRequest == true">
                        <div class="col-12 mt3 mb2 tc"> <h6>Cannot be Modified</h6></div>
                    </template>
                    <template v-else>
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
</template>



// <script lang="ts">
//     import { Component, Vue, Prop, Watch } from "vue-property-decorator";
//     import { PendingShift, Event } from '@/models';
//     import ErrorNotification from "./ErrorNotification.vue";
//     import ConfirmMsgPopUp from "@/components/shared/ConfirmMsgPopUp.vue";
//     import { namespace } from "vuex-class";
//     import moment from "moment";
//     import { ModelListSelect } from 'vue-search-select'
//     import Loading from 'vue-loading-overlay';
//     import 'vue-loading-overlay/dist/vue-loading.css';
//     import { useAppInsights } from '../../store/modules/AppInsights'

//     const schedule = namespace("schedule");
//     const profile = namespace("profile");
//     @Component({
//         components: {
//             ErrorNotification,
//             ModelListSelect,
//             Loading,
//             ConfirmMsgPopUp
//         },
//     })
//     export default class SelfSchedule extends Vue {
//         @schedule.State
//         public selfScheduleShiftMembers!: any;
//         @schedule.State
//         public assignmentDetail!: any;
//         @schedule.State
//         public pendingShiftDetails!: any;
//         @schedule.State
//         public selfScheduleShiftDetails: any;
//         @profile.State
//         public profileData!: any;
//         @profile.State
//         isAdmin!: boolean;
//         @schedule.State
//         public selfScheduleFacilities: any;
//         @schedule.State
//         public selfScheduleDepartments: any;
//         @schedule.State
//         public userSchedules!: any;

//         @profile.State
//         appInsightEventData!: any;
//         @profile.State
//         isImpersonating!: boolean;
        
//         shiftMembers: any = [];
//         isLoaded: boolean = false;
//         isProductive: boolean = false;
//         canModify: boolean = false;
//         isSelfScheduled: boolean = false;
//         deptShifts: any = [];
//         skillName!: string;
//         buttonCaption: string = "Add to Schedule";
//         buttonName: string = "btnAddToSchedule";
//         tenantId!: string;
//         staffId!: number;
//         deptId!: number;
//         skillId!: number;
//         err: string = '';
//         shiftStartTime!: Date;
//         shiftEndTime!: Date;
//         actualStartTime!: Date;
//         actualEndTime!: Date;
//         actualShiftStartTime: string = "6:30am";
//         actualShiftEndTime: string = "6:30pm";
//         deptShiftId: number = 0;
//         deptShiftDesc: string = '';
//         deptShiftCode!: string;
//         productiveType: string = '';
//         isModalVisible: boolean = false;
//         errorMsg: string = '';
//         errorType: string = 'error';
//         showErrorMsg: boolean = false;
//         classFlag: string = '';
//         isSelfScheduleAllowed: boolean = false;
//         allowSelfScheduleToCommitment: boolean = false;
//         guranteedHrs: number = 0;
//         weeksInSchedule: number = 4;
//         displayWSC: boolean = true;
//         reqCountWSC: number = 0;
//         facilities: any = [];
//         facilityDepts: any = [];
//         selectedFacilityId: number = 0;
//         selectedDeptId: number = 0;
//         skills: any = [];
//         selectedSkillId: number = 0;
//         selectedDeptShiftId: string = '';
//         selectedDeptAndShift: any = {
//             tenantId: '',
//             facilityId: 0,
//             coid: '',
//             facilityName: '',
//             departmentId: 0,
//             departmentName: '',
//             departmentCode: '',
//             departmentShiftId: 0,
//             shiftCode: '',
//             shiftDescription: '',
//             startTime: '',
//             endTime: '',
//             shiftMembers: []
//         };
//         facilityCoid: number = 0;
//         departmentCode: number = 0;
//         facilityName: string = '';
//         departmentName: string = '';
//         isLoading: boolean = false;
//         loaderColor: string = "#0085ca";
//         isConfirmModalVisible: boolean = false;
//         confirmMsgValue: string = '';
//         datesList: any = [];
//         pendingShiftList: PendingShift[] = [];
//         isSelfScheduleNeedsInPrimaryDept: boolean = true;
//         assignmntDetail: any = null;

//         @Prop() currentEvent!: Event;
//         @Prop() dayChanged!: any;
//         @Prop() scheduleStatus!: any;
//         @Prop() isSelfScheduledEvent!: any;
//         @Prop() calSelectedDates!: any;
//         @Prop() scheduleId!: any;
//         @Prop() departmentsCanSelfSchedule!: any;

//         async mounted() {
//             this.buttonCaption = (this.currentEvent.type == "Need" || this.currentEvent.type == undefined ? "Add to Schedule" : "Withdraw");
//             this.buttonName = (this.currentEvent.type == "Need" ? "btnAddToSchedule" : "btnWithdraw");
//             this.skillName = this.profileData.skills.find(x => x.primary == true).description;
//             this.tenantId = this.profileData.tenantId;
//             this.staffId = this.profileData.staffId;
//             this.deptId = this.profileData.deptId;
//             this.skillId = this.profileData.skills.find(x => x.primary == true).id;
//             this.isSelfScheduleAllowed = this.profileData.selfSchedule;
//             this.allowSelfScheduleToCommitment = this.profileData.selfScheduleToCommitment;
//             this.skills = this.profileData.skills;
//             this.guranteedHrs = this.profileData.guarenteedHours;
//             this.weeksInSchedule = this.profileData.weeksInSchedule;
//             this.displayWSC =
//                 this.profileData.weekendShiftCommitment != 0 ? true : false;
//             this.reqCountWSC = this.profileData.weekendShiftCommitment;
//             if (this.currentEvent.type == "Pending") {
//                 this.canModify = true;
//                 this.getPendingShiftDetails();
//             }
//             else if (this.currentEvent.type == "Assignment" && this.currentEvent.status == "Scheduled" &&
//                 this.isSelfScheduleAllowed == true) //
//             {
//                 this.getAssignmentDetails();
//             }
//             else if (this.currentEvent.type == "Assignment" && this.currentEvent.status == "Pending" &&
//                 this.scheduleStatus == "Plan Sheet" && this.isSelfScheduledEvent == true) //
//             {
//                 this.getAssignmentDetails();
//             }
//             else //"Need"
//             {
//                 this.canModify = true;
//                 if (this.currentEvent.type == undefined) {
//                     await this.showCalenderSelectedDates();
//                 }
//                 this.getSelfScheduleNeedsDetails();
//             }
//         }

//         async showCalenderSelectedDates() {
//             var startSD = moment(this.calSelectedDates.startDate, 'M/D/YYYY');
//             var endSD = moment(this.calSelectedDates.endDate, 'M/D/YYYY');
//             var diffDays = endSD.diff(startSD, 'days');
//             let calCurrentDate: Date = new Date(this.calSelectedDates.startDate);
//             let selectedDatesCount: number = 0;
//             let todayDate: Date = new Date();
//             if (calCurrentDate < todayDate) {
//                 calCurrentDate = todayDate;
//                 let currentDiffDays = (moment(todayDate, 'M/D/YYYY')).diff(startSD, 'days');
//                 diffDays = diffDays - currentDiffDays;
//             }
//             selectedDatesCount = diffDays;
//             for (var i = 0; i < diffDays; i++) {
//                 let singleDate = {
//                     id: i,
//                     dateValue: calCurrentDate,
//                     isSelected: true
//                 }
//                 this.datesList[i] = JSON.parse(JSON.stringify(singleDate));
//                 calCurrentDate.setDate(calCurrentDate.getDate() + 1);
//             }
//         }

//         toggleDateSelection(event) {
//             let currentId = event.currentTarget.id;

//             for (var i = 0; i < this.datesList.length; i++) {
//                 if (this.datesList[i].id == currentId) {
//                     let currentStatus: boolean = (this.datesList[i].isSelected);
//                     this.datesList[i].isSelected = !(this.datesList[i].isSelected);
//                     if (currentStatus) {
//                         event.currentTarget.classList.remove("neu-background--cerulean-25");
//                         event.currentTarget.classList.add("neu-background--white");
//                     }
//                     else {
//                         event.currentTarget.classList.remove("neu-background--white");
//                         event.currentTarget.classList.add("neu-background--cerulean-25");
//                         if (this.showErrorMsg) {
//                             this.showErrorMsg = false;
//                             this.errorMsg = "";
//                         }
//                     }
//                 }
//             }
//         }

//         getDisplayDate(currentId) {
//             for (var i = 0; i < this.datesList.length; i++) {
//                 if (this.datesList[i].id == currentId) {
//                     return moment(this.datesList[i].dateValue).format("dddd, MMMM D");
//                 }
//             }
//             return "";
//         }

//         onFacilityChange(event) {
//             this.selectedFacilityId = event.target.value;
//             this.facilityDepts = this.selfScheduleDepartments.filter(x => x.facilityId == event.target.value);
//             this.facilityName = this.facilities.find(f => f.facilityId == event.target.value).facilityName;
//             this.facilityCoid = this.facilities.find(f => f.facilityId == event.target.value).coid;
//             this.selectedDeptId = this.facilityDepts[0].departmentId;
//             this.departmentName = this.facilityDepts[0].departmentCode;
//             this.departmentCode = this.facilityDepts[0].departmentName;
//             this.deptShifts = this.removeDuplicatesFromArrayByProperty(this.selfScheduleShiftDetails.filter(x => x.departmentId == this.selectedDeptId), 'shiftCode');

//             this.deptShifts.forEach((shift: any) => {
//                 let startTime, endTime;
//                 startTime = this.formatTime(this.addMinutes(shift.startTime, shift.offset));
//                 endTime = this.formatTime(this.addMinutes(this.addMinutes(shift.endTime, shift.offset), shift.breakMinutes));

//                 if (shift.shiftDescription.trim().toUpperCase() == shift.shiftCode.trim().toUpperCase()) {
//                     shift.shiftDescription = shift.shiftDescription + " " + startTime.toUpperCase() + " - " + endTime.toUpperCase();
//                 }
//             });

//             const selecteId = +this.deptShifts[0].departmentShiftId + '_' + this.deptShifts[0].departmentId;
//             this.selectedDeptShiftId = selecteId;
//             this.selectedDeptAndShift = this.deptShifts[0];
//             this.setShiftDetails(this.deptShifts[0].departmentShiftId, this.deptShifts[0].departmentId);
//         }

//         onDepartmentChange(event) {
//             this.selectedDeptId = event.target.value;
//             this.departmentName = this.selfScheduleShiftDetails.find(x => x.departmentId == event.target.value).departmentCode;
//             this.departmentCode = this.selfScheduleShiftDetails.find(x => x.departmentId == event.target.value).departmentName;
//             this.deptShifts = this.removeDuplicatesFromArrayByProperty(this.selfScheduleShiftDetails.filter(x => x.departmentId == this.selectedDeptId), 'shiftCode');

//             this.deptShifts.forEach((shift: any) => {
//                 let startTime, endTime;
//                 startTime = this.formatTime(this.addMinutes(shift.startTime, shift.offset));
//                 endTime = this.formatTime(this.addMinutes(this.addMinutes(shift.endTime, shift.offset), shift.breakMinutes));

//                 if (shift.shiftDescription.trim().toUpperCase() == shift.shiftCode.trim().toUpperCase()) {
//                     shift.shiftDescription = shift.shiftDescription + " " + startTime.toUpperCase() + " - " + endTime.toUpperCase();
//                 }
//             });

//             const selecteId = +this.deptShifts[0].departmentShiftId + '_' + this.deptShifts[0].departmentId;
//             this.selectedDeptShiftId = selecteId;
//             this.selectedDeptAndShift = this.deptShifts[0];

//             this.setShiftDetails(this.deptShifts[0].departmentShiftId, this.deptShifts[0].departmentId);
//         }

//         onSkillChange(event) {
//             this.selectedSkillId = event.target.value;
//             this.skillName = this.skills.find(x => x.id == event.target.value).description;
//         }

//         onShiftChanges(event) {
//             this.selectedDeptShiftId = event;
//             this.selectedDeptAndShift = this.deptShifts.find(x => x.departmentShiftId == event.departmentShiftId && x.departmentId == event.departmentId);
//             this.setShiftDetails(event.departmentShiftId, event.departmentId);

//             if (this.showErrorMsg) {
//                 this.showErrorMsg = false;
//                 this.errorMsg = "";
//             }
//         }

//         setShiftDetails(deptShiftId, deptId) {
//             const selectedDeptShift = this.deptShifts.find(x => x.departmentShiftId == deptShiftId
//                 && x.departmentId == deptId);
//             this.shiftMembers = selectedDeptShift.shiftMembers;
//             this.shiftStartTime = selectedDeptShift.startTime;
//             this.deptShiftCode = selectedDeptShift.shiftCode;
//             this.deptShiftDesc = selectedDeptShift.shiftDescription;
//             this.productiveType = selectedDeptShift.productiveType;
//             this.shiftEndTime = selectedDeptShift.endTime;
//             this.actualStartTime = this.addMinutes(selectedDeptShift.startTime, selectedDeptShift.offset);
//             this.actualEndTime = this.addMinutes(this.addMinutes(selectedDeptShift.endTime, selectedDeptShift.offset), selectedDeptShift.breakMinutes);
//             this.actualShiftStartTime = this.formatTime(this.actualStartTime);
//             this.actualShiftEndTime = this.formatTime(this.actualEndTime);
//         }

//         removeDuplicatesFromArrayByProperty = (arr, prop) => arr.reduce((accumulator, currentValue) => {
//             if (!accumulator.find(obj => obj[prop] === currentValue[prop])) {
//                 accumulator.push(currentValue);
//             }
//             return accumulator;
//         }, [])

//         getPendingShiftDetails() {
//             this.assignmntDetail = null;
//             this.$store
//                 .dispatch("schedule/GetPendingShiftDetails", { id: this.currentEvent.id, username: this.profileData.username })
//                 .then(() => {
//                     this.isLoaded = true;
//                     if (this.pendingShiftDetails != undefined) {
//                         this.facilityName = this.pendingShiftDetails.facilityName;
//                         this.departmentName = this.pendingShiftDetails.departmentName;
//                         this.skillName = this.pendingShiftDetails.skill;
//                         this.skillId = this.skills.find(s => s.id == this.pendingShiftDetails.skillId);
//                         this.deptShiftId = this.pendingShiftDetails.departmentShiftId;
//                         this.deptShiftDesc = this.pendingShiftDetails.shiftDescription;
//                         this.shiftStartTime = this.pendingShiftDetails.startTime;
//                         this.shiftEndTime = this.pendingShiftDetails.endTime;
//                         this.actualStartTime = this.pendingShiftDetails.actualStartTime;
//                         this.actualEndTime = this.pendingShiftDetails.actullEndTime;
//                         this.actualShiftStartTime = this.pendingShiftDetails.actualStartTime;
//                         this.actualShiftEndTime = this.pendingShiftDetails.actualEndTime;
//                     }
//                 })
//                 .catch((err: any) => {
//                     if (err) {
//                         console.log(err); // Handle errors any way you want
//                     }
//                 });
//         }

//         getAssignmentDetails() {
//             this.$store
//                 .dispatch("schedule/GetScheduleAssignmentDetail", this.currentEvent.id)
//                 .then(() => {
//                     this.isLoaded = true;
//                     if (this.assignmentDetail != undefined) {
//                         this.assignmntDetail =  this.assignmentDetail;
//                         this.facilityName = this.assignmentDetail.facilityName;
//                         this.departmentName = this.assignmentDetail.departmentCode;
//                         this.skillName = this.assignmentDetail.skill;
//                         this.deptShiftDesc = this.assignmentDetail.shiftCode + " " + this.assignmentDetail.shiftDescription;
//                         this.actualShiftStartTime = this.formatTime(this.assignmentDetail.actualStartTime);
//                         this.actualShiftEndTime = this.formatTime(this.assignmentDetail.actualEndTime);
//                         this.productiveType = this.assignmentDetail.productiveType;
//                         this.isProductive = (this.assignmentDetail.productiveType == "Productive" || this.assignmentDetail.productiveTypeId == 1);
//                         this.isSelfScheduled = this.assignmentDetail.selfScheduled;
//                         this.canModify = ((this.isProductive == true || this.productiveType.toUpperCase() == 'CALL' || this.productiveType.toUpperCase() == 'PLACEHOLDER') && this.isSelfScheduled == true);
//                     }
//                 })
//                 .catch((err: any) => {
//                     if (err) {
//                         console.log(err); // Handle errors any way you want
//                     }
//                 });
//         }

//         getSelfScheduleNeedsDetails() {
//             let selectedDateVal = (this.currentEvent.type == undefined ? moment(this.datesList[0].dateValue).format('YYYY-MM-DDTHH:mm:ss') : this.currentEvent.date);

//             const payload = { date: selectedDateVal, departmentIds: this.departmentsCanSelfSchedule, username: this.profileData.username };

//             this.$store
//                 .dispatch("schedule/GetSelfScheduleNeedsDetails", payload)
//                 .then((data) => {
//                     this.isLoaded = true;
//                     if (this.selfScheduleShiftDetails != undefined) {
//                         this.facilities = this.selfScheduleFacilities;
//                         let selectedFacility = this.facilities.find(f => f.facilityId == this.profileData.facilityId);

//                         if (selectedFacility == 'undefined') {
//                             selectedFacility = this.selectedFacilityId = this.facilities[0];
//                         }

//                         this.selectedFacilityId = selectedFacility.facilityId;
//                         this.facilityName = selectedFacility.facilityName;
//                         this.facilityCoid = selectedFacility.coid;

//                         this.facilityDepts = this.selfScheduleDepartments.filter(x => x.facilityId == selectedFacility.facilityId);
//                         let selectedDept = this.facilityDepts.find(d => d.departmentId == this.profileData.deptId);

//                         if (selectedDept == 'undefined' || selectedDept == null) {
//                             this.isSelfScheduleNeedsInPrimaryDept = false;
//                             selectedDept = this.facilityDepts[0]
//                         }
//                         this.selectedDeptId = selectedDept.departmentId;
//                         this.departmentName = selectedDept.departmentCode;
//                         this.departmentCode = selectedDept.departmentName;
//                         this.skills = this.profileData.skills;
//                         this.selectedSkillId = this.profileData.skills.find(x => x.primary == true).id;
//                         this.deptShifts = this.removeDuplicatesFromArrayByProperty(this.selfScheduleShiftDetails.filter(x => x.departmentId == this.selectedDeptId), 'shiftCode');

//                         this.deptShifts.forEach((shift: any) => {
//                             let startTime, endTime;
//                             startTime = this.formatTime(this.addMinutes(shift.startTime, shift.offset));
//                             endTime = this.formatTime(this.addMinutes(this.addMinutes(shift.endTime, shift.offset), shift.breakMinutes));

//                             if (shift.shiftDescription.trim().toUpperCase() == shift.shiftCode.trim().toUpperCase()) {
//                                 shift.shiftDescription = shift.shiftDescription + " " + startTime.toUpperCase() + " - " + endTime.toUpperCase();
//                             }
//                         });
                        
//                         this.selectedDeptAndShift = this.deptShifts[0];
//                         this.selectedDeptShiftId = +this.deptShifts[0].departmentShiftId + '_' + this.deptShifts[0].departmentId;

//                         this.setShiftDetails(this.deptShifts[0].departmentShiftId, this.deptShifts[0].departmentId);
//                     }
//                 })
//                 .catch((err: any) => {
//                     if (err) {
//                         console.log(err); // Handle errors any way you want
//                     }
//                 });
//         }

//         validateBeforeSave() {
//             let selectedDatesCount: number = 0;
//             let isValidate: boolean = true;
//             let errorMessage: string = "";
//             for (var i = 0; i < this.datesList.length; i++) {
//                 if (this.datesList[i].isSelected) {
//                     selectedDatesCount++;
//                 }
//             }
//             if (selectedDatesCount < 1) {
//                 isValidate = false;
//                 errorMessage = "Please select atleast one date";
//             }
//             else if (this.selectedFacilityId < 1) {
//                 isValidate = false;
//                 errorMessage = "Please select facility";
//             }
//             else if (this.selectedDeptId < 1) {
//                 isValidate = false;
//                 errorMessage = "Please select department";
//             }
//             else if (this.selectedSkillId < 1) {
//                 isValidate = false;
//                 errorMessage = "Please select skill";
//             }          
           
//             if(!isValidate)
//             {
//                 this.showErrorMsg = true;
//                 this.errorType = "error";
//                 this.errorMsg = errorMessage;
//                 return false;
//             }
//             else{
//                   return true;
//             }
//         }

//         async SaveNeedsDetails() {
//             var scheduleIdVal = (this.currentEvent.type == undefined ? this.scheduleId : this.currentEvent.assignmentId);
//             var currSchedule = this.userSchedules.find(x => x.id == scheduleIdVal);
//             if (this.currentEvent.type == undefined) {
//                 for (var i = 0; i < this.datesList.length; i++) {
//                     if (this.showErrorMsg) {
//                         break;
//                     }

//                     if (this.datesList[i].isSelected == true) //
//                     {
//                         var dateVal = moment(this.datesList[i].dateValue).format("YYYY-MM-DD");
//                         var lstEvents: Event[] = currSchedule.events.filter(x => (x.type == "Pending" || x.type == "Assignment") && moment(x.date).format("YYYY-MM-DD")  == dateVal);
//                         if (lstEvents != null) {
//                             for (var j = 0; j < lstEvents.length; j++) {
//                                 const selectedDeptShift = this.deptShifts.find(x => x.shiftCode == lstEvents[j].shiftCode);
//                                 if ((selectedDeptShift.startTime < this.shiftEndTime) && (this.shiftStartTime < selectedDeptShift.endTime)) {
//                                     this.isLoading = false;
//                                     this.showErrorMsg = true;
//                                     this.errorMsg = "Shifts may not overlap.\n Please select a shift with a different start or end time.";
//                                     return;
//                                 }
//                             }
//                         }
//                     }
//                 }

//                 if (!this.showErrorMsg) {

//                     var item = 0;
//                     for (var k = 0; k < this.datesList.length; k++) {
//                         if (this.datesList[k].isSelected == true) //
//                         {
//                             var ShiftDetails = {
//                                 id: this.getGuidforPendingShift(),
//                                 username: this.profileData.username,
//                                 date: moment(this.datesList[k].dateValue).format("YYYY-MM-DD"),
//                                 startTime: this.shiftStartTime,
//                                 endTime: this.shiftEndTime,
//                                 actualStartTime: this.actualShiftStartTime,
//                                 actualEndTime: this.actualShiftEndTime,
//                                 departmentShiftId: this.selectedDeptAndShift.departmentShiftId,
//                                 scheduleId: scheduleIdVal,
//                                 tenantId: this.tenantId,
//                                 departmentId: this.selectedDeptId,
//                                 staffId: this.staffId,
//                                 skillId: this.selectedSkillId,
//                                 shiftCode: this.deptShiftCode,
//                                 shiftDescription: this.deptShiftDesc,
//                                 skill: this.skillName,
//                                 facilityName: this.facilityName,
//                                 departmentName: this.departmentName,
//                                 productiveType: this.productiveType,
//                                 shiftMembers: this.selfScheduleShiftMembers != undefined ? this.selfScheduleShiftMembers.shiftMembers : null,
//                                 actionableBy: currSchedule.endDate
//                             };
//                             this.pendingShiftList[item] = JSON.parse(JSON.stringify(ShiftDetails));
//                             item++;
//                         }
//                     }

//                     localStorage.setItem("lastUsedShiftCode", this.deptShiftCode);
//                     this.isLoading = true;
//                     await this.$store.dispatch('schedule/SavePendingShiftDetails', this.pendingShiftList)
//                         .then((res: any) => {
//                             //showing message in MyScheduleView Screen
//                             this.isLoading = false;
//                             this.$emit('showSuccessMsgPopUp');
//                             this.$emit('closeSharedModal');
//                             useAppInsights().trackEvent({name:'SelfSchedulingShiftsEntered',properties: 
//                                 JSON.parse(JSON.stringify(this.appInsightEventData))
//                             });
//                         })
//                         .catch((err: any) => {
//                             if (err) {
//                                 this.isLoading = false;
//                                 console.log(err);
//                                 let parseResponse = err.request.responseText != "" ? JSON.parse(err.request.responseText) : err.request.responseText;
//                                 this.showErrorMsg = true;
//                                 this.errorMsg = (parseResponse.result != null || parseResponse.result != undefined) ? JSON.parse(parseResponse.result).Message : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
//                             }
//                         });
//                 }
//             }
//             else //Current Event
//             {
//                 var lstEvents1: Event[] = currSchedule.events.filter(x => (x.type == "Pending" || x.type == "Assignment") && x.date == this.currentEvent.date);
//                 if (lstEvents1 != null) {
//                     for (var l = 0; l < lstEvents1.length; l++) {
//                         const selectedDeptShift = this.deptShifts.find(x => x.shiftCode == lstEvents1[l].shiftCode);
//                         if ((selectedDeptShift.startTime < this.shiftEndTime) && (this.shiftStartTime < selectedDeptShift.endTime)) {
//                             this.isLoading = false;
//                             this.showErrorMsg = true;
//                             this.errorMsg = "Shifts may not overlap.\n Please select a shift with a different start or end time.";
//                             return;
//                         }
//                     }
//                 }

//                 if (!this.showErrorMsg) {
//                     let ShiftDetails = {
//                         id: this.getGuidforPendingShift(),
//                         username: this.profileData.username,
//                         date: this.currentEvent.date,
//                         startTime: this.shiftStartTime,
//                         endTime: this.shiftEndTime,
//                         actualStartTime: this.actualShiftStartTime,
//                         actualEndTime: this.actualShiftEndTime,
//                         departmentShiftId: this.selectedDeptAndShift.departmentShiftId,
//                         scheduleId: scheduleIdVal,
//                         tenantId: this.tenantId,
//                         departmentId: this.selectedDeptId,
//                         staffId: this.staffId,
//                         skillId: this.selectedSkillId,
//                         shiftCode: this.deptShiftCode,
//                         shiftDescription: this.deptShiftDesc,
//                         skill: this.skillName,
//                         facilityId :this.selectedFacilityId,
//                         facilityName: this.facilityName,
//                         coid: this.facilityCoid,
//                         departmentName: this.departmentName,
//                         departmentCode:this.departmentCode,
//                         productiveType: this.productiveType,
//                         shiftMembers: this.selfScheduleShiftMembers != undefined ? this.selfScheduleShiftMembers.shiftMembers : null,
//                         actionableBy: currSchedule.endDate
//                     };
//                     this.pendingShiftList[0] = JSON.parse(JSON.stringify(ShiftDetails));

//                     localStorage.setItem("lastUsedShiftCode", this.deptShiftCode);
//                     this.isLoading = true;
//                     await this.$store.dispatch('schedule/SavePendingShiftDetails', this.pendingShiftList)
//                         .then((res: any) => {
//                             //showing message in MyScheduleView Screen
//                             this.isLoading = false;
//                             this.$emit('showSuccessMsgPopUp');
//                             this.$emit('closeSharedModal');
//                             useAppInsights().trackEvent({name:'SelfSchedulingShiftsEntered',properties: 
//                                 JSON.parse(JSON.stringify(this.appInsightEventData))
//                             });
//                         })
//                         .catch((err: any) => {
//                             if (err) {
//                                 this.isLoading = false;
//                                 console.log(err);
//                                 let parseResponse = err.request.responseText != "" ? JSON.parse(err.request.responseText) : err.request.responseText;
//                                 this.showErrorMsg = true;
//                                 this.errorMsg = (parseResponse.result != null || parseResponse.result != undefined) ? JSON.parse(parseResponse.result).Message : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
//                             }
//                         });
//                 }
//             }
//         }

//         async SaveSelfScheduleAsAssignment() {
//             var lstAssignments: any[] = [];
//             if (this.currentEvent.type == undefined) {
//                 let item = 0;
//                 for (var i = 0; i < this.datesList.length; i++) {
//                     if (this.datesList[i].isSelected == true) //
//                     {
//                         let ShiftDetails = {
//                             //scheduleId: this.currentEvent.assignmentId,
//                             tenantId: this.tenantId,
//                             departmentShiftId: this.selectedDeptAndShift.departmentShiftId,
//                             departmentId: this.selectedDeptId,
//                             staffId: this.staffId,
//                             skillLevelId: this.selectedSkillId,
//                             date: moment(this.datesList[i].dateValue).format("YYYY-MM-DD"),
//                             startTime: this.shiftStartTime,
//                             productiveType: this.productiveType,
//                             endTime: this.shiftEndTime,
//                             scheduleId: this.scheduleId,
//                             //shiftMembers: this.selfScheduleShiftMembers != undefined ? this.selfScheduleShiftMembers.shiftMembers : null
//                         };
//                         lstAssignments[item] = JSON.parse(JSON.stringify(ShiftDetails));
//                         item++;
//                     }
//                 }
//             }
//             else //Current Event
//             {
//                 let ShiftDetails = {
//                     scheduleId: this.currentEvent.assignmentId,
//                     tenantId: this.tenantId,
//                     departmentShiftId: this.selectedDeptAndShift.departmentShiftId,
//                     departmentId:  this.selectedDeptId,
//                     staffId: this.staffId,
//                     skillLevelId: this.selectedSkillId,
//                     date: this.currentEvent.date,
//                     startTime: this.shiftStartTime,
//                     productiveType: this.productiveType,
//                     endTime: this.shiftEndTime,
//                     //shiftMembers: this.selfScheduleShiftMembers != undefined ? this.selfScheduleShiftMembers.shiftMembers : null
//                 };
//                 lstAssignments[0] = JSON.parse(JSON.stringify(ShiftDetails));
//             }

//             this.isLoading = true;
//             await this.$store.dispatch('schedule/SaveSelfScheduleAsAssignment', lstAssignments)
//                 .then((res: any) => {
//                     //showing message in MyScheduleView Screen
//                     this.isLoading = false;
//                     this.$emit('showSuccessMsgPopUp');
//                     this.$emit('closeSharedModal');
//                     useAppInsights().trackEvent({name:'SelfSchedulingShiftsEntered',properties: 
//                         JSON.parse(JSON.stringify(this.appInsightEventData))
//                     });
//                 })
//                 .catch((err: any) => {
//                     if (err) {
//                         this.isLoading = false;
//                         console.log(err);
//                         let parseResponse = err.response.data != "" ? err.response.data : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
//                         this.showErrorMsg = true;
//                         this.errorMsg = parseResponse;
//                     }
//                 });
//         }

//         async FireAction() {
//             if (this.currentEvent.type == "Need" || (this.currentEvent.type == undefined && this.validateBeforeSave() == true)) // -- Add toSchedule
//             {
//                 if (this.allowSelfScheduleToCommitment) {
//                     this.SaveNeedsDetails();
//                 }
//                 else {
//                     this.SaveSelfScheduleAsAssignment();
//                 }
//             }
//             else if (this.currentEvent.type != undefined ) // -- Withdraw
//             {
//                 if (this.currentEvent.type == "Pending") {
//                     this.isLoading = true;
//                     await this.$store.dispatch('schedule/DeletePendingShiftDetails', { id: this.currentEvent.id, username: this.profileData.username })
//                         .then((res: any) => {
//                             // showing message in MyScheduleView Screen
//                             this.isLoading = false;
//                             this.$emit('showSuccessMsgPopUp');
//                             this.$emit('closeSharedModal');
//                         })
//                         .catch((err: any) => {
//                             if (err) {
//                                 this.isLoading = false;
//                                 console.log(err);
//                                 let parseResponse = err.request.responseText != "" ? JSON.parse(err.request.responseText) : err.request.responseText;
//                                 this.showErrorMsg = true;
//                                 this.errorMsg = (parseResponse.result != null || parseResponse.result != undefined) ? JSON.parse(parseResponse.result).Message : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
//                             }
//                         });
//                 }
//                 else {
//                     if (this.allowSelfScheduleToCommitment) {
//                         if (this.isBelowCommitment()) {
//                             this.confirmMsgValue = "By withdrawing this shift, you will be under your commitment. Do you want to proceed?";
//                             this.isConfirmModalVisible = true;
//                         }
//                         else {
//                             this.confirmMsgValue = "This shift request will be removed. Do you want to proceed?";
//                             this.isConfirmModalVisible = true;
//                         }
//                     }
//                     else {
//                         this.confirmMsgValue = "This shift request will be removed. Do you want to proceed?";
//                         this.isConfirmModalVisible = true;
//                     }
//                 }
//             }    
//         }
//         getGuidforPendingShift() {
//             var uuidValue = "", k, randomValue;
//             for (k = 0; k < 32; k++) {
//                 randomValue = Math.random() * 16 | 0;
//                 if (k == 8 || k == 12 || k == 16 || k == 20) {
//                     uuidValue += "-"
//                 }
//                 uuidValue += (k == 12 ? 4 : (k == 16 ? (randomValue & 3 | 8) : randomValue)).toString(16);
//             }
//             return uuidValue;
//         }

//         formatDate(date: Date): string {
//             return moment(date).format("dddd, MMMM DD yyyy");
//         }

//         formatTime(t: Date): string {
//             return moment(t).format("h:mm a");
//         }

//         addMinutes(date, minutes) {
//             return moment(date).add(minutes, 'm').toDate();
//         }

//         async confirmedClicked() {
//             this.isConfirmModalVisible = false;
//             this.isLoading = true;
//             await this.$store.dispatch('schedule/DeleteSelfScheduleAssignment', this.assignmentDetail.id)
//                 .then((res: any) => {
//                     // showing message in MyScheduleView Screen
//                     this.isLoading = false;
//                     this.$emit('showSuccessMsgPopUp');
//                     this.$emit('closeSharedModal');
//                 })
//                 .catch((err: any) => {
//                     if (err) {
//                         this.isLoading = false;
//                         console.log(err);
//                         let parseResponse =
//                             err.request.response != ""
//                                 ? err.request.response
//                                 : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
//                         this.showErrorMsg = true;
//                         this.errorMsg = parseResponse;
//                     }
//                 });

//         }

//         isBelowCommitment() {
//             let currdate = this.currentEvent.date;
//             let currsched = this.userSchedules.length ? this.userSchedules[0] : null;
//             currsched = null;

//             this.userSchedules.forEach((sched: any) => {
//                 let startDt, endDt, currDt;
//                 startDt = sched.startDate;
//                 currDt = currdate;
//                 endDt = sched.endDate;
//                 if (
//                     new Date(startDt) <= new Date(currDt) &&
//                     new Date(endDt) >= new Date(currDt)
//                 ) {
//                     currsched = sched;
//                     return;
//                 }
//             });

//             let totalHrs = 0,
//                 totalMins = 0,
//                 weekStartDate: Date = new Date(currsched.startDate),
//                 weekEndDate: Date = new Date(currsched.startDate),
//                 weekEvents!: Event[],
//                 weekHours: number,
//                 isOverallCommitmentBelow: boolean = false,
//                 isWeekendCommitmentBelow: boolean = false;

//             for (var i = 0; i < this.weeksInSchedule; i++) {
//                 if (i == 0) {
//                     weekEndDate.setDate(weekStartDate.getDate() + 6);
//                 }
//                 else {
//                     weekStartDate.setDate(weekStartDate.getDate() + 7);
//                     weekEndDate.setDate(weekStartDate.getDate() + 6);
//                 }

//                 if (weekStartDate <= new Date(currdate) && new Date(currdate) <= weekEndDate) {
//                     weekEvents = currsched.events.filter(
//                         (event: Event) =>
//                             new Date(event.date) >= weekStartDate &&
//                             new Date(event.date) <= weekEndDate && event.isCommitment == true &&
//                             (event.type == "Pending" || event.type == "Assignment" || event.type == "Request")
//                     );

//                     weekEvents.forEach((event: Event) => {
//                         totalHrs += event.hours;
//                         totalMins += event.minutes;
//                     });
//                     if(this.currentEvent.isCommitment)
//                     {
//                         weekHours = Math.round((totalHrs + (totalMins / 60)) - (this.currentEvent.hours + (this.currentEvent.minutes / 60)));
//                     }
//                     else
//                     {
//                       weekHours = Math.round((totalHrs + (totalMins / 60)));
//                     }
//                     if (this.currentEvent.isWeekend) {
//                         let weekendScheduledEvents: Event[] = currsched.events.filter(
//                             (event: Event) =>
//                                 new Date(event.date) >= new Date(currsched.startDate) &&
//                                 new Date(event.date) <= new Date(currsched.endDate) &&
//                                 (event.type == "Pending" || event.type == "Assignment" || event.type == "Request") &&
//                                 event.isWeekend
//                         );

//                         if (this.displayWSC) {
//                             if ((weekendScheduledEvents.length - 1) >= this.reqCountWSC) {
//                                 isWeekendCommitmentBelow = false;
//                             }
//                             else {
//                                 isWeekendCommitmentBelow = true;
//                             }
//                         }
//                         else {
//                             isWeekendCommitmentBelow = false;
//                         }
//                     }
//                     if (weekHours < this.guranteedHrs || isWeekendCommitmentBelow) {
//                         isOverallCommitmentBelow = true;
//                     }
//                     break;
//                 }
//             }
//             return isOverallCommitmentBelow;
//         }

//     }
// </script>
<style lang="css">
p > small {
    font-size: 100%;
}
</style>