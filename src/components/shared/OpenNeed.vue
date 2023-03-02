g<template>
    <div class="col-12 container-fluid pb4 pt3" v-if="isLoaded">
        <div class="neu-margin--bottom-20">
            <div class="row">
                    <div class="col-12 neu-margin--bottom-20" v-if="!hasNeedsInPrimaryDept">
                            <p><small>Note: Your home department has no shifts available for this date.</small></p>
                        </div>
                <div class="col-12 neu-margin--bottom-20" v-if="showErrorMsg">
                    <ErrorNotification :errorMsg="errorMsg" :errorType="errorType" />
                </div>              
                 <div class="col-12 neu-margin--top-20">
                    <neu-label content="Facility" position="fixed" >
                    </neu-label>
                    <neu-input inputmode="search" type="text" name="Facility" id="txtFacility" :value="facilityName" readonly v-if="currentEvent?.type != 'Need'"/>
                   
                    <neu-select ref="ddlFacility" class="ddl-facility" interface="popover" :value="selectedFacilityId" @v-neu-change="onOpenNeedFacilityChange" v-if="currentEvent?.type == 'Need'">
                            <neu-option ref="ddlFacilityOption" class="ddl-facility-option" v-for="facility in facilities" :value="facility.facilityId" :key="facility.facilityId">
                                {{facility.facilityName}}
                            </neu-option>
                        </neu-select>
                </div>
                <div class="col-12 neu-margin--top-20">
                    <neu-label for="txtDepartment" content="Department" position="fixed" ></neu-label>
                    <neu-input type="text" name="Department" id="txtDepartment" :value="departmentName" readonly v-if="currentEvent?.type != 'Need'"/>
                    
                    <neu-select  class="ddl-department" interface="popover" :value="selectedDeptId" ref="ddchecklDepartment" @v-neu-change="onOpenNeedDepartmentChange"  v-if="currentEvent?.type == 'Need'">
                        <neu-option ref="ddlDepartmentOpton" class="ddl-department-option" v-for="department in facilityDepts" :value="department.departmentId" :key="department.departmentId">
                            {{'(' + department.departmentCode + ') ' + department.departmentName}}
                        </neu-option>
                    </neu-select>
                    
                </div>
                <div class="col-12 neu-margin--top-20">
                    <neu-label for="txtSkill" content="Skill" position="fixed"></neu-label>
                    <neu-input type="text" name="Skill" id="txtSkill" v-model="skillName" :value="skillName" readonly v-if="currentEvent?.type != 'Need'"/>
                    <neu-select ref="ddlSkill" class="ddl-skill" interface="popover" :value="selectedSkillId" @v-neu-change="onOpenNeedSkillChange"  v-if="currentEvent?.type == 'Need'">
                        <neu-option class="ddl-skill-option" v-for="skill in skills" :value="skill.id" :key="skill.id">
                            {{skill.description}}
                        </neu-option>
                    </neu-select>
                    
                </div>
                <div class="col-12 neu-margin--top-20">
                    <neu-label for="txtShift" content="Shift" position="fixed"></neu-label>
                    <neu-input type="text" name="shift" id="txtShift" v-model="deptShiftDesc" :value="deptShiftDesc" readonly
                    v-if="currentEvent?.type != 'Need' || (currentEvent?.type == 'Assignment' && currentEvent?.status  == 'Pending')" />
                    <neu-select name="ddlShifts" class="ddl-shift" interface="popover" :value="data.selectedShift" @v-neu-change="onOpenNeedShiftChanges"  
                    v-if="currentEvent?.type == 'Need' || (currentEvent?.type == 'Assignment' && currentEvent?.status  != 'Pending')">
                        <neu-option  v-for="shift in data.shifts" :value="shift.id" :key="shift.id">
                            {{ shift.description }} 
                            <!-- {{shift.premiumLaborLevel ? ' (Incentive)': ''}} -->
                        </neu-option>
                    </neu-select>

                    <!-- <div class="mt3" v-if="deptPartialShifts && deptPartialShifts?.length">
                        <neu-input type="checkbox" name="showPartial" id="chkShowPartial" v-model="showPartial" :value="showPartial"
                            v-if="currentEvent?.type != 'Need' || (currentEvent?.type == 'Assignment' && currentEvent?.status  == 'Pending')" />
                        <neu-label for="chkShowPartial" content="Show Partial Shift Options" position="fixed"></neu-label>
                    </div>

                    <neu-select name="ddlPartialShifts" class="ddl-partial-shift" interface="popover" :value="data.selectedPartialShift" @v-neu-change="onOpenNeedPartialShiftChanges" 
                      v-if="deptPartialShifts && deptPartialShifts?.length && showPartial">
                        <neu-option v-for="shift in data.partialShifts" :value="shift.departmentShiftId" :key="shift.departmentShiftId">
                            {{ shift.description }} 
                        </neu-option>
                    </neu-select> -->
                </div>
            </div>
        </div>
        <div class="container-fluid mt4">
            <div class="row">
                <div class="col-12">
                    <label for="shiftTime" class="f3 h4 tl ttu">
                        {{ selectedShiftActualStartTime() }} -
                        {{ selectedShiftActualEndTime() }}
                    </label>
                </div>
                <div class="col-12">
                    <shift-member-detail :currentEvent="currentEvent" />
                </div>
                <div class="col-12">
                    <neu-button color="primary" fill="raised" class="d-block"
                        @click="FireAction" 
                        :class="[ isImpersonating || (currentEvent?.status != 'Pending' && !selectedShiftId()) ? 'neu-button--blue-disabled': 'neu-background--denim']"
                        :disabled="isImpersonating || (currentEvent?.status != 'Pending' && !selectedShiftId())">
                            {{ buttonCaption }}
                    </neu-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
     import { Options, Vue } from "vue-class-component";
    import moment from "moment";
    import { mapState } from "vuex";   
    import ErrorNotification from "./ErrorNotification.vue";   
    import { useAppInsights } from '../../store/modules/AppInsights'
    import {
        NeuSelect,NeuOption,NeuLabel,NeuInput,NeuButton
    } from '@neutron/vue'
    import ShiftMemberDetail from "./ShiftMemberDetail.vue";
    class Props{
        currentEvent!: any;
        scheduleStartDate!: Date;
        scheduleEndDate!: Date;
    }
    @Options({
        components: {
            ErrorNotification,
            NeuButton,
            ShiftMemberDetail
        },
         computed: {
         ...mapState(['oidcUser']),
         ...mapState('schedule',['openNeedShiftMembers','assignmentDetail','openNeedsFacilities','openNeedsDepartments','openNeedsShiftDetails']),
         ...mapState('profile', ['profileData', 'isAdmin', 'appInsightEventData','isImpersonating']),
    },
    })
    export default class OpenNeed extends Vue.with(Props) {
        public profileData!: any;
        isAdmin!: boolean;
        public openNeedShiftMembers!: any;
        public assignmentDetail!: any;
        public openNeedsFacilities: any;
        public openNeedsDepartments: any;
        public openNeedsShiftDetails: any;
        appInsightEventData!: any
        isImpersonating!: boolean;       
        buttonCaption: string = "Add to Schedule";
        buttonName: string = "btnAddToSchedule";
        isLoaded: boolean = true;
        needid!: number;
        departmentShiftId!: string;
        departmentShiftIdProd: string = "639"; // Production Shift added as per user stroy
        deptShiftDesc: string = '';
        deptShifts!: any;
        departmentPartialShiftId!: string;
        deptPartialShiftDesc: string = '';
        deptPartialShifts!: any;
        skillName: string = "";
        errorMsg: string = '';
        errorType: string = 'error';
        showErrorMsg: boolean = false;
        classFlag: string = '';
        data:any = {
            allShifts: [],
            shifts: [],
            selectedShift: "",
            shiftMembers: [],
            partialShifts: [],
            selectedPartialShift: null
        };
        shiftStartTime!: Date;
        shiftEndTime!: Date;
        partialShiftStartTime!: Date;
        partialShiftEndTime!: Date;
        actualPartialShiftStartTime: string = "6:30am";
        actualPartialShiftEndTime: string = "6:30pm";
        actualShiftStartTime: string = "6:30am";
        actualShiftEndTime: string = "6:30pm";
        showPartial: boolean = false;
        facilities: any = [];
        facilityDepts: any = [];
        selectedFacilityId: number = 0;
        selectedDeptId: number = 0;
        facilityName: string = '';
        departmentName: string = '';
        skills: any = [];
        selectedSkillId: number = 0;
        primarySkillId: number = 0;
        isLoading: boolean = false;
        loaderColor: string = "#0085ca";
        hasPartials: boolean = false;
        hasNeedsInPrimaryDept: boolean = true;

        async mounted() {            
            this.buttonCaption =
                (this.currentEvent?.type == "Assignment" && this.currentEvent?.status == "Pending") ? "Withdraw" : "Add to Schedule";
            this.buttonName =
                (this.currentEvent?.type == "Assignment" && this.currentEvent?.status == "Pending") ? "btnWithdraw" : "btnAddToSchedule";
                       
            if (this.currentEvent?.type == "Assignment" && this.currentEvent?.status == "Pending") {                
                this.loadopenNeeds();
            } else {
                this.loadopenNeedShiftMembers();
            }
        }

        loadopenNeedShiftMembers() { 
            const payload = {
                date: this.currentEvent?.date,
                staffId: this.profileData?.staffId,
            };   
            this.$store
                .dispatch("schedule/getOpenNeeds", payload)
                .then((res) => {
                    this.facilities = this.openNeedsFacilities;
                    this.hasNeedsInPrimaryDept = this.openNeedsDepartments?.filter((x:any) => x.departmentId == this.profileData?.departmentId).length > 0;
                    this.selectedFacilityId = this.openNeedsFacilities?.find((x:any) => x.facilityId == this.profileData?.facilityId) == undefined
                        ? this.openNeedsFacilities[0]?.facilityId : this.profileData?.facilityId;
                    this.facilityName = this.openNeedsFacilities?.find((x:any) => x.facilityId == this.selectedFacilityId) == undefined
                        ? this.openNeedsFacilities[0]?.facilityName : this.profileData?.facilityName;
                    this.facilityDepts = this.openNeedsDepartments?.filter((x:any) => x.facilityId == this.selectedFacilityId);

                    if (this.selectedFacilityId == this.profileData?.facilityId) {
                        this.selectedDeptId = this.profileData?.departmentId;
                    }
                    else {
                        this.selectedDeptId = this.openNeedsDepartments?.find((x:any) => x.facilityId == this.selectedFacilityId)[0]?.departmentId;
                    }

                    //remove duplicate from array having same shift code
                    const removeDuplicatesFromArrayByProperty = (arr:any, prop:any) => arr?.reduce((accumulator:any, currentValue:any) => {
                        if (!accumulator.find((obj:any) => obj[prop] === currentValue[prop])) {
                            accumulator.push(currentValue);
                        }
                        return accumulator;
                    }, [])

                    this.skills = removeDuplicatesFromArrayByProperty(res?.data?.map((x:any) => { return { id: x.skillId, description: x.skill } }), 'skillId');
                    this.selectedSkillId = this.skills?.length ? this.skills[0]?.id : "";

                    const updatedShift: any = res?.data?.map((members:any) => {
                        const shiftCode = "P"; //description: "Productive"
                        const departmentShiftId = this.departmentShiftIdProd;
                        members.departmentShiftId = departmentShiftId;
                        members.shiftCode = shiftCode;
                        members.description = shiftCode
                            + " " + this.formatTime(members.start)
                            + " - " + this.formatTime(members.end);

                        members.key = members.description + '-' + departmentShiftId;
                        members.id = members.description + '-' + departmentShiftId;
                        return members;
                    });

                    this.data.allShifts = removeDuplicatesFromArrayByProperty(updatedShift, 'description');
                    //this.data.partialShifts = updatedShift?.filter((x:any) => x.isPartial);
                    this.deptShifts = this.data?.allShifts?.filter((x:any) => x.departmentId == this.selectedDeptId);
                    //this.deptPartialShifts = this.openNeedsShiftDetails?.filter((x:any) => x.departmentId == this.selectedDeptId && x.isPartial);
                    if(this.deptShifts?.length){
                        this.setShiftDetails(this.deptShifts[0]?.departmentShiftId, this.deptShifts[0]?.departmentId);
                    }
                    else{
                        this.setShiftDetails(0, 0);
                    }
                    
                    this.actualShiftStartTime = this.formatTime(this.assignmentDetail.start);
                    this.actualShiftEndTime = this.formatTime(this.assignmentDetail.end);
                    // if (this.deptPartialShifts?.length){
                    //     this.setPartialShiftDetails(this.deptPartialShifts[0]?.departmentShiftId, this.deptPartialShifts[0]?.departmentId);
                    // }
                })
                .catch((err: any) => {
                    if (err) {
                        console.log(err);
                    }
                });
        }

        loadopenNeeds() {
            this.$store
                .dispatch("schedule/GetScheduleAssignmentDetail", this.currentEvent.id)
                .then(() => {
                    this.isLoaded = true;
                    if (this.assignmentDetail != undefined) {                        
                        this.facilityName = this.assignmentDetail.facilityName;
                        this.departmentName = this.assignmentDetail?.departmentCode;
                        if(this.assignmentDetail?.premiumLaborLevel){
                                this.assignmentDetail.description = this.assignmentDetail.shiftCode
                                    + " " + this.formatTime(this.assignmentDetail.startTime)
                                    + " - " + this.formatTime(this.assignmentDetail.endTime)
                                    + " (Incentive)";
                            }
                        else{
                            this.assignmentDetail.description = this.assignmentDetail.departmentShift
                            + " " + this.formatTime(this.assignmentDetail?.startTime)
                            + " - " + this.formatTime(this.assignmentDetail?.endTime);
                        }

                        this.deptShiftDesc = this.assignmentDetail?.description;
                        this.actualShiftStartTime = this.formatTime(this.assignmentDetail.start);
                        this.actualShiftEndTime = this.formatTime(this.assignmentDetail.end);
                        this.needid = this.assignmentDetail?.needId;
                        this.data.shiftMembers = this.assignmentDetail?.shiftMembers?.map((members:any) => {
                            members.name = members.firstName + " " + members.lastName;
                            return members;
                        });
                        this.skillName = this.assignmentDetail?.skill;

                        //Get data for shiftmember
                        this.getShiftMemberDetails(this.assignmentDetail);
                        //Get data for shiftmember
                    }
                })
                .catch((err: any) => {
                    if (err) {
                        console.log(err); // Handle errors any way you want
                    }
                });
        }

        onOpenNeedFacilityChange(event:any) {
            this.selectedFacilityId = event.target.value;
            this.facilityDepts = this.openNeedsDepartments?.filter((x:any) => x.facilityId == event.target.value);
            this.facilityName = this.facilities.find((f:any) => f.facilityId == event.target.value)?.facilityName;
            if (this.selectedFacilityId == this.profileData.facilityId) {
                this.selectedDeptId = this.profileData?.departmentId;
            }
            else {
                this.selectedDeptId = this.facilityDepts[0]?.departmentId;
            }
            this.departmentName = (this.facilityDepts?.find((x:any) => x.departmentId == this.selectedDeptId) || {}).departmentCode;
            this.deptShifts = this.data?.allShifts?.filter((x:any) => x.departmentId == this.selectedDeptId);
            if (this.deptShifts?.length){
                this.setShiftDetails(this.deptShifts[0].departmentShiftId, this.deptShifts[0].departmentId);
            }
            else {
                this.setShiftDetails(0, 0);
            }

            // if (this.deptPartialShifts?.length){
            //     this.setPartialShiftDetails(this.deptPartialShifts[0]?.departmentShiftId, this.deptPartialShifts[0]?.departmentId);
            // }
        }

        onOpenNeedDepartmentChange(event:any) {
            this.selectedDeptId = parseInt(event.target.value);
            this.departmentName = (this.openNeedsShiftDetails.find((x:any) => x.departmentId == event.target.value) || {}).departmentCode;
            this.deptShifts = this.data?.allShifts?.filter((x:any) => x.departmentId == event.target.value);
            if (this.deptShifts?.length){
                this.setShiftDetails(this.deptShifts[0].departmentShiftId, this.deptShifts[0].departmentId);
            }
            else {
                this.setShiftDetails(0, 0);
            }

            // this.deptPartialShifts = this.openNeedsShiftDetails.filter((x:any) => x.departmentId == this.selectedDeptId && x.isPartial);

            // if (this.deptPartialShifts?.length){
            //     this.setPartialShiftDetails(this.deptPartialShifts[0]?.departmentShiftId, this.deptPartialShifts[0]?.departmentId);
            // }
        }

        onOpenNeedSkillChange(event:any) {
            this.selectedSkillId = event.target.value;
            this.skillName = this.skills?.find((x:any) => x.id == event.target.value).description;
            this.deptShifts = this.data?.allShifts?.filter((x:any) => x.departmentId == this.selectedDeptId && x.skillId == event.target.value);
            if (this.deptShifts?.length){
                this.setShiftDetails(this.deptShifts[0]?.departmentShiftId, this.deptShifts[0]?.departmentId);
            }
            else {
                this.setShiftDetails(0, 0);
            }

            // if (this.deptPartialShifts?.length){
            //     this.setPartialShiftDetails(this.deptPartialShifts[0]?.departmentShiftId, this.deptPartialShifts[0]?.departmentId);
            // }
        }

        setShiftDetails(deptShiftId:number, deptId:number) {
            var selectedDeptShift = this.deptShifts?.find((x:any) => x.departmentShiftId == deptShiftId
                && x.departmentId == deptId);
            var selectedShiftDetails: any

            if (this.data?.allShifts?.length > 0) {
                this.data.shifts = this.data?.allShifts?.filter((shift: any) => { return shift.departmentId === this.selectedDeptId && shift.skillId == this.selectedSkillId });
            }
            if (this.data.shifts.length > 0) {
                this.data.shifts.sort();

                selectedShiftDetails = this.data.shifts[0];
                selectedDeptShift = this.deptShifts?.find((x:any) => x.departmentShiftId == selectedShiftDetails.departmentShiftId
                    && x.departmentId == selectedShiftDetails.departmentId);
                
                this.data.selectedShift = selectedDeptShift? selectedDeptShift.id : "";
            } else {
                this.data.shifts = this.openNeedsShiftDetails?.filter((shift: any) => { return shift.departmentId === this.selectedDeptId && shift.skillId == this.selectedSkillId });
                if (this.data.shifts?.length > 0) {
                    this.data.shifts.sort();

                    selectedShiftDetails = this.data.shifts[0];
                    selectedDeptShift = this.deptShifts?.find((x:any) => x.departmentShiftId == selectedShiftDetails.departmentShiftId
                        && x.departmentId == selectedShiftDetails.departmentId);
                    
                    this.data.selectedShift = selectedDeptShift? selectedDeptShift.id : "";
                }
                else{
                    this.data.selectedShift = "";
                }
            }

            if (selectedDeptShift){
                this.deptShiftDesc = selectedDeptShift.description;
                this.shiftStartTime = selectedDeptShift.start;
                this.shiftEndTime = selectedDeptShift.end;
            }
            this.onOpenNeedShiftChanges(0);
        }

        setPartialShiftDetails(deptShiftId:number, deptId:number) {
            const selectedDeptShift = this.deptPartialShifts.find((x:any) => x.departmentShiftId == deptShiftId
                && x.departmentId == deptId);

            if (this.data.allShifts?.length > 0) {
                this.data.partialShifts = this.data.allShifts.filter((shift: any) => { return shift.id == this.data.selectedShift && shift.departmentId === this.selectedDeptId && shift.isPartial });
            }
            if (this.data?.partialShifts?.length > 0) {
                this.data?.partialShifts?.sort();
                this.data.selectedPartialShift = selectedDeptShift? selectedDeptShift.id : null;
            } else {
                this.data.selectedPartialShift = null;
            }

            if (selectedDeptShift){
                this.deptPartialShiftDesc = selectedDeptShift.shiftDescription;
                this.partialShiftStartTime = selectedDeptShift.startTime;
                this.partialShiftEndTime = selectedDeptShift.endTime;
            }

            this.onOpenNeedPartialShiftChanges();
        }

        onOpenNeedShiftChanges(event: any) {
            var selectedShiftid = event == 0 ? this.data?.selectedShift : event.target.value;
            this.data.selectedShift = selectedShiftid;
            const filteredShift: any = this.data?.shifts?.filter((shift: any) => {
                return shift.id === selectedShiftid;
            });
            if (filteredShift?.length){
                //this.needid = filteredShift[0].id;
                this.actualShiftStartTime = this.formatTime(filteredShift[0].start);
                this.actualShiftEndTime = this.formatTime(filteredShift[0].end);
                this.departmentShiftId = this.departmentShiftIdProd; // filteredShift[0]?.departmentShiftId;

                this.data.shiftMembers = filteredShift[0]?.shiftMembers?.map((members:any) => {
                    members.name = members.firstName + " " + members.lastName;
                    return members;
                });
            }           
            
            if (this.showErrorMsg) {
                this.showErrorMsg = false;
                this.errorMsg = "";
            }
            
            if( event != 0){
                this.getShiftMemberDetails(filteredShift);
            }

            // if (this.deptPartialShifts?.length){
            //     this.setPartialShiftDetails(this.deptPartialShifts[0]?.departmentShiftId, this.deptPartialShifts[0]?.departmentId);
            // }
        }

        private getShiftMemberDetails(filteredShift: any) {
            var addPayloadForShiftMembers = {
                deptId: this.selectedDeptId,
                start: filteredShift[0]?.start,
                end: filteredShift[0]?.end
            };
            this.$store
            .dispatch("schedule/getShiftMembersDetail", addPayloadForShiftMembers)
            .then(() => {
                this.isLoaded = true;
            })
            .catch((err: any) => {
                if (err) {
                    console.log(err);
                }
            });
        }

        onOpenNeedPartialShiftChanges() {
            const filteredShift: any = this.data?.partialShifts?.filter((shift: any) => {
                return shift.id === this.data.selectedShift && shift.departmentShiftId === this.data.selectedPartialShift;
            });
            
            if (filteredShift?.length){
                //this.needid = filteredShift[0].id;
                this.actualPartialShiftStartTime = this.formatTime(filteredShift[0].start);
                this.actualPartialShiftEndTime = this.formatTime(filteredShift[0].end);
                this.departmentPartialShiftId = filteredShift[0]?.departmentShiftId;

                this.data.shiftMembers = filteredShift[0]?.shiftMembers?.map((members:any) => {
                    members.name = members.firstName + " " + members.lastName;
                    return members;
                });
            }

            
            if (this.showErrorMsg) {
                this.showErrorMsg = false;
                this.errorMsg = "";
            }
        }

        selectedShiftId(){
            return this.departmentShiftIdProd; 
            // this.data.partialShifts?.length && this.showPartial? this.departmentPartialShiftId : this.departmentShiftId;
        }

        selectedShiftActualStartTime(){
            return this.data.partialShifts?.length && this.showPartial && this.data?.selectedPartialShift? this.actualPartialShiftStartTime : this.actualShiftStartTime;
        }

        selectedShiftActualEndTime(){
            return this.data.partialShifts?.length && this.showPartial && this.data?.selectedPartialShift? this.actualPartialShiftEndTime : this.actualShiftEndTime;
        }

        FireAction() {
            try {
                const filteredShift: any = this.data?.shifts?.filter((shift: any) => {
                        return shift.id ===  this.data.selectedShift;
                    });
                if (this.currentEvent?.type == "Assignment" && this.currentEvent?.status == "Pending") {
                    this.isLoading = true;
                    const requestBody = {
                        "assignmentRequestId": this.currentEvent?.id,
                        "staffId": this.assignmentDetail?.staffId,
                        "departmentId": this.assignmentDetail?.departmentId,
                        "departmentShiftId": this.assignmentDetail?.departmentShiftId,
                        "skillId": this.assignmentDetail?.skillId,
                        "start": this.assignmentDetail?.start,
                        "end": this.assignmentDetail?.end,
                        "expires": this.assignmentDetail?.expires, 
                        "comment": "",
                        "status": "",
                        "managerComment": ""
                    };
                    this.$store.dispatch('schedule/WithdrawEvent', requestBody)
                        .then((res: any) => {
                            // showing message in MyScheduleView Screen and close modal only on success
                            this.isLoading = false;
                            this.$emit('showSuccessMsgPopUp');
                            this.$emit('closeSharedModal');
                        })
                        .catch((err: any) => {
                            if (err) {
                                this.isLoading = false;
                                console.log(err);
                                let parseResponse = err.request.responseText != "" ? JSON.parse(err.request.responseText) : err.request.responseText;
                                this.showErrorMsg = true;
                                this.errorMsg = (parseResponse.result != null || parseResponse.result != undefined) ? JSON.parse(parseResponse.result).Message : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
                            }

                        });

                } else {
                    const requestBody = {
                        "staffId": this.profileData?.staffId,
                        "departmentId": this.selectedDeptId,
                        "departmentShiftId": parseInt(this.selectedShiftId()),
                        "skillId": this.selectedSkillId,
                        "start": filteredShift?.length ? filteredShift[0].start : "",
                        "end": filteredShift?.length ? filteredShift[0].end : "",
                        "expires": filteredShift?.length ? filteredShift[0].end : "", //this.currentEvent?.date,
                        "comment": "",
                        "status": "Pending",
                        "managerComment": ""
                    };
                    this.isLoading = true;
                    this.$store
                        .dispatch("schedule/ScheduleOpenNeedRequest", requestBody)
                        .then((res) => {
                            //showing message in MyScheduleView Screen and close modal only on success
                            this.isLoading = false;
                            this.$emit('showSuccessMsgPopUp');
                            this.$emit('closeSharedModal');
                            useAppInsights().trackEvent({name:'OpenNeedsRequested',properties: 
                                JSON.parse(JSON.stringify(this.appInsightEventData))
                            });
                        })
                        .catch((err: any) => {
                            if (err) {
                                this.isLoading = false;
                                console.log(err, "error");
                                let parseResponse = err.request.responseText != "" ? JSON.parse(err.request.responseText) : err.request.responseText;
                                this.showErrorMsg = true;
                                this.errorMsg = (parseResponse.result != null || parseResponse.result != undefined) ? JSON.parse(parseResponse.result).Message : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
                            }
                        });
                }
            } catch (error) {
                console.log(error);
            }
        }

        formatDate(date: Date): string {
            return moment(date).format("dddd, MMMM DD yyyy");
        }

        formatTime(t: Date): string {
            return moment(t).format("h:mm a");
        }

    }
</script>

<style lang="css">
    p > small {
        font-size: 100%;
    }
</style>