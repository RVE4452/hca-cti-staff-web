<template>
    <div class="col-12 container-fluid pb4 pt3" v-if="isLoaded">
        <div class="bg-black-05 neu-margin--bottom-20">
            <div class="row">
                    <div class="col-12 neu-margin--bottom-20" v-if="!hasNeedsInPrimaryDept">
                            <p><small>Note: Your home department has no shifts available for this date.</small></p>
                        </div>
                <div class="col-12 neu-margin--bottom-20" v-if="showErrorMsg">
                    <ErrorNotification :errorMsg="errorMsg" :errorType="errorType" />
                </div>
                <div class="col-12 f3">
                    <h5>
                        {{ formatDate(currentEvent?.date) }}
                    </h5>
                </div>
                 <div class="col-12 neu-margin--top-20">
                    <neu-label content="Facility" position="fixed" >
                    </neu-label>
                    <neu-input inputmode="search" type="text" name="Facility" id="txtFacility" :value="facilityName" readonly v-if="currentEvent?.type != 'Need'"/>
                   
                    <!-- <neu-select ref="ddlFacility" interface="popover" :value="selectedFacilityId" @v-neu-change="onOpenNeedFacilityChange" v-if="currentEvent?.type == 'Need'">
                            <neu-option ref="ddlFacilityOption" v-for="facility in facilities" :value="facility.facilityId" :key="facility.facilityId">
                                {{facility.facilityName}}
                            </neu-option>
                        </neu-select> -->
                    <select ref="ddlFacility" class="ddl-facility neu-input__text-field" v-model="selectedFacilityId" @change="onOpenNeedFacilityChange($event)" v-if="currentEvent?.type == 'Need'">
                        <option ref="ddlFacilityOption" v-for="facility in facilities" :value="facility.facilityId" :key="facility.facilityId">
                            {{facility.facilityName}}
                        </option>
                    </select>
                </div>
                <div class="col-12 neu-margin--top-20">
                    <neu-label for="txtDepartment" content="Department" position="fixed" ></neu-label>
                    <neu-input type="text" name="Department" id="txtDepartment" v-model="departmentName" :value="departmentName" readonly v-if="currentEvent?.type != 'Need'"/>
                    <!-- <neu-select ref="ddlDepartment" interface="popover" :value="selectedDeptId" @v-neu-change="onOpenNeedDepartmentChange"  v-if="currentEvent.type == 'Need'">
                        <neu-option v-for="department in facilityDepts" :value="department.departmentId" :key="department.departmentId">
                            {{'(' + department.departmentCode + ') ' + department.departmentName}}
                        </neu-option>
                    </neu-select> -->
                    <select ref="ddlDepartment" class="ddl-department neu-input__text-field" v-model="selectedDeptId" @change="onOpenNeedDepartmentChange($event)"  v-if="currentEvent?.type == 'Need'">
                        <option v-for="department in facilityDepts" :value="department.departmentId" :key="department.departmentId">
                            {{'(' + department.departmentCode + ') ' + department.departmentName}}
                        </option>
                    </select>
                </div>
                <div class="col-12 neu-margin--top-20">
                    <neu-label for="txtSkill" content="Skill" position="fixed"></neu-label>
                    <neu-input type="text" name="Skill" id="txtSkill" v-model="skillName" :value="skillName" readonly v-if="currentEvent?.type != 'Need'"/>
                    <!-- <neu-select name="ddlSkill" interface="popover" :value="selectedSkillId" @v-neu-change="onOpenNeedSkillChange"  v-if="currentEvent.type == 'Need'">
                        <neu-option v-for="skill in skills" :value="skill.id" :key="skill.id">
                            {{skill.description}}
                        </neu-option>
                    </neu-select> -->
                    <select name="ddlSkill" class="ddl-skill neu-input__text-field" v-model="selectedSkillId" @change="onOpenNeedSkillChange($event)" v-if="currentEvent?.type == 'Need'">
                        <option v-for="skill in skills" :value="skill.id" :key="skill.id">
                            {{skill.description}}
                        </option>
                    </select>
                </div>
                <div class="col-12 neu-margin--top-20">
                    <neu-label for="txtShift" content="Shift" position="fixed"></neu-label>
                    <neu-input type="text" name="shift" id="txtShift" v-model="deptShiftDesc" :value="deptShiftDesc" readonly
                    v-if="currentEvent?.type == 'Assignment' && currentEvent?.status  == 'Pending'" />
                    <!-- <neu-select name="ddlShifts" interface="popover" :value="data.selectedShift" @v-neu-change="onOpenNeedShiftChanges"  v-if="currentEvent.type == 'Need' || (currentEvent.type == 'Assignment' && currentEvent.status  != 'Pending')">
                        <neu-option v-for="shift in data.shifts" :value="shift.id" :key="shift.id">
                            {{ shift.description }} {{shift.premiumLaborLevel ? ' (Incentive)': ''}}
                        </neu-option>
                    </neu-select> -->
                    <select class="ddl-shift neu-input__text-field"
                            name="ddlShifts" style="padding: 1px !important"
                            v-model="data.selectedShift"
                            @change="onOpenNeedShiftChanges()"
                            v-if="currentEvent?.type == 'Need' || (currentEvent?.type == 'Assignment' && currentEvent?.status  != 'Pending') ">
                        <option v-for="shift in data.shifts"
                                :value="shift.id"
                                :key="shift.id">
                            {{ shift.description }} {{shift.premiumLaborLevel ? ' (Incentive)': ''}}
                        </option>
                    </select>

                    <div class="mt3" v-if="deptPartialShifts && deptPartialShifts?.length">
                        <neu-input type="checkbox" name="showPartial" id="chkShowPartial" v-model="showPartial" :value="showPartial"
                            v-if="currentEvent?.type == 'Assignment' && currentEvent?.status  == 'Pending'" />
                        <neu-label for="chkShowPartial" content="Show Partial Shift Options" position="fixed"></neu-label>
                    </div>

                    <!-- <neu-select name="ddlPartialShifts" interface="popover" :value="data.selectedPartialShift" @v-neu-change="onOpenNeedPartialShiftChanges"   v-if="deptPartialShifts && deptPartialShifts.length && showPartial">
                        <neu-option v-for="shift in data.partialShifts" :value="shift.departmentShiftId" :key="shift.departmentShiftId">
                            {{ shift.description }} 
                        </neu-option>
                    </neu-select> -->
                    <select class="ddl-partial-shift neu-input__text-field mt3"
                            name="ddlPartialShifts"
                            v-model="data.selectedPartialShift"
                            @change="onOpenNeedPartialShiftChanges()"
                            v-if="deptPartialShifts && deptPartialShifts?.length && showPartial">
                        <option v-for="shift in data.partialShifts"
                                :value="shift.departmentShiftId"
                                :key="shift.departmentShiftId">
                            {{ shift.description }} 
                        </option>
                    </select>
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
                    <div class="row" v-if="data.shiftMembers.length == 0">
                        <div class="col-12 neu-margin--top-20">
                            <p class="neu-text--tag neu-text--align-left">No Shift Member Found</p>
                        </div>
                    </div>
                    <div class="row"
                         v-if="data.shiftMembers.length > 0">
                        <div class="col-12 neu-margin--top-20"><p class="neu-text--tag neu-text--align-left">SHIFT MEMBERS</p></div>
                        <div class="col-12 row mt3">
                            <div class="col-12 mt2 mb2"
                                 v-for="shiftMember in data.shiftMembers"
                                 :key="shiftMember.username">
                                <div class="d-flex">
                                    <div class="col-auto pa0">
                                        <h6 class="bg-gray tc white mr2 initial-name">
                                            {{ shiftMember.firstName[0] + shiftMember.lastName[0] }}
                                        </h6>
                                    </div>
                                    <div class="col-auto pa0">
                                        <div class="row">
                                            <div class="col-12" v-bind:title="shiftMember.name">
                                                <span class="fw6">
                                                    {{
                                                        shiftMember.name
                                                    }}
                                                </span>
                                            </div>
                                            <div class="col-12">
                                                <span class="gray">{{ shiftMember.skill }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
        <!-- </div> -->
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
    class Props{
        currentEvent!: any;
        scheduleStartDate!: Date;
        scheduleEndDate!: Date;
    }
    @Options({
        components: {
            ErrorNotification,
            NeuSelect,NeuOption,NeuLabel,NeuInput,NeuButton
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
            this.skillName =  this.profileData?.skills?.find((x:any) => x.primary == true ).description;
            this.deptShifts = this.profileData?.departmentShifts?.filter((x:any) => x.canRequest == false);
            
            if (this.currentEvent?.type == "Assignment" && this.currentEvent?.status == "Pending") {                
                this.loadopenNeeds();
            } else {
                this.loadopenNeedShiftMembers();
            }
        }

        loadopenNeedShiftMembers() {      
            let dates = this.currentEvent?.description?.split(',');
            const payload = {
                selectedDate: this.currentEvent?.date,
                username: this.profileData?.username,
                start: moment(dates != undefined ? dates[0] : null).format("YYYY-MM-DD"),
                end: moment(dates != undefined ? dates[1] : null).format("YYYY-MM-DD"),
                includePartials: true,
            };   
            this.$store
                .dispatch("schedule/getOpenNeeds", payload)
                .then((res) => {
                    this.facilities = this.openNeedsFacilities;
                    this.hasNeedsInPrimaryDept = this.openNeedsDepartments?.filter((x:any) => x.departmentId == this.profileData?.deptId).length > 0;
                    this.selectedFacilityId = this.openNeedsFacilities?.find((x:any) => x.facilityId == this.profileData?.facilityId) == undefined
                        ? this.openNeedsFacilities[0]?.facilityId : this.profileData?.facilityId;
                    this.facilityName = this.openNeedsFacilities?.find((x:any) => x.facilityId == this.selectedFacilityId) == undefined
                        ? this.openNeedsFacilities[0]?.facilityName : this.profileData?.facilityName;
                    this.facilityDepts = this.openNeedsDepartments?.filter((x:any) => x.facilityId == this.selectedFacilityId);

                    if (this.selectedFacilityId == this.profileData?.facilityId) {
                        this.selectedDeptId = this.profileData?.deptId;
                    }
                    else {
                        this.selectedDeptId = this.openNeedsDepartments?.find((x:any) => x.facilityId == this.selectedFacilityId)[0]?.departmentId;
                    }
                    this.primarySkillId = this.profileData?.skills?.find((x:any) => x.primary == true).id;

                    //remove duplicate from array having same shift code
                    const removeDuplicatesFromArrayByProperty = (arr:any, prop:any) => arr?.reduce((accumulator:any, currentValue:any) => {
                        if (!accumulator.find((obj:any) => obj[prop] === currentValue[prop])) {
                            accumulator.push(currentValue);
                        }
                        return accumulator;
                    }, [])

                    this.skills = removeDuplicatesFromArrayByProperty(res?.data?.map((x:any) => { return { id: x.skillId, description: x.skill } }), 'id');
                    this.selectedSkillId = this.skills?.length ? this.skills[0]?.id : this.primarySkillId;
                    this.deptShifts = this.openNeedsShiftDetails?.filter((x:any) => x.departmentId == this.selectedDeptId && !x.isPartial);
                    const updatedShift: any = res.data.map((members:any) => {
                        if(members.isPartial){
                            members.description = members.shiftCode
                                + " " + this.formatTime(members.startTime)
                                + " - " + this.formatTime(members.endTime);
                        }
                        else{
                            members.description = members.shiftCode
                                + " " + this.formatTime(members.startTime)
                                + " - " + this.formatTime(members.endTime);
                        }

                        members.key = members.id + '-' + members.departmentShiftId;
                        return members;
                    });

                    this.data.allShifts = removeDuplicatesFromArrayByProperty(updatedShift, 'departmentShiftId');
                    this.data.partialShifts = updatedShift?.filter((x:any) => x.isPartial);
                    this.deptShifts = this.openNeedsShiftDetails?.filter((x:any) => x.departmentId == this.selectedDeptId && !x.isPartial);
                    this.deptPartialShifts = this.openNeedsShiftDetails?.filter((x:any) => x.departmentId == this.selectedDeptId && x.isPartial);
                    if(this.deptShifts.length){
                        this.setShiftDetails(this.deptShifts[0]?.departmentShiftId, this.deptShifts[0]?.departmentId);
                    }
                    else{
                        this.setShiftDetails(0, 0);
                    }
                    

                    if (this.deptPartialShifts?.length){
                        this.setPartialShiftDetails(this.deptPartialShifts[0]?.departmentShiftId, this.deptPartialShifts[0]?.departmentId);
                    }
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
                        if(this.assignmentDetail.premiumLaborLevel){
                                this.assignmentDetail.description = this.assignmentDetail.shiftCode
                                    + " " + this.formatTime(this.assignmentDetail.startTime)
                                    + " - " + this.formatTime(this.assignmentDetail.endTime)
                                    + " (Incentive)";
                            }
                        else{
                            this.assignmentDetail.description = this.assignmentDetail.shiftCode
                            + " " + this.formatTime(this.assignmentDetail.startTime)
                            + " - " + this.formatTime(this.assignmentDetail.endTime);
                        }

                        this.deptShiftDesc = this.assignmentDetail.description;
                        this.actualShiftStartTime = this.formatTime(this.assignmentDetail.actualStartTime);
                        this.actualShiftEndTime = this.formatTime(this.assignmentDetail.actualEndTime);
                        this.needid = this.assignmentDetail.needId;
                        this.data.shiftMembers = this.assignmentDetail.shiftMembers.map((members:any) => {
                            members.name = members.firstName + " " + members.lastName;
                            return members;
                        });
                        this.skillName = this.assignmentDetail.skill;
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
                this.selectedDeptId = this.profileData?.deptId;
            }
            else {
                this.selectedDeptId = this.facilityDepts[0]?.departmentId;
            }
            this.departmentName = (this.facilityDepts.find((x:any) => x.departmentId == this.selectedDeptId) || {}).departmentCode;
            this.deptShifts = this.openNeedsShiftDetails.filter((x:any) => x.departmentId == this.selectedDeptId);
            if (this.deptShifts.length){
                this.setShiftDetails(this.deptShifts[0].departmentShiftId, this.deptShifts[0].departmentId);
            }
            else {
                this.setShiftDetails(0, 0);
            }

            if (this.deptPartialShifts?.length){
                this.setPartialShiftDetails(this.deptPartialShifts[0]?.departmentShiftId, this.deptPartialShifts[0]?.departmentId);
            }
        }

        onOpenNeedDepartmentChange(event:any) {
            this.selectedDeptId = parseInt(event.target.value);
            this.departmentName = (this.openNeedsShiftDetails.find((x:any) => x.departmentId == event.target.value) || {}).departmentCode;
            this.deptShifts = this.openNeedsShiftDetails.filter((x:any) => x.departmentId == event.target.value);
            if (this.deptShifts.length){
                this.setShiftDetails(this.deptShifts[0].departmentShiftId, this.deptShifts[0].departmentId);
            }
            else {
                this.setShiftDetails(0, 0);
            }

            this.deptPartialShifts = this.openNeedsShiftDetails.filter((x:any) => x.departmentId == this.selectedDeptId && x.isPartial);

            if (this.deptPartialShifts?.length){
                this.setPartialShiftDetails(this.deptPartialShifts[0]?.departmentShiftId, this.deptPartialShifts[0]?.departmentId);
            }
        }

        onOpenNeedSkillChange(event:any) {
            this.selectedSkillId = event.target.value;
            this.skillName = this.skills?.find((x:any) => x.id == event.target.value).description;
            this.deptShifts = this.openNeedsShiftDetails?.filter((x:any) => x.departmentId == this.selectedDeptId && x.skillId == event.target.value);
            if (this.deptShifts.length){
                this.setShiftDetails(this.deptShifts[0]?.departmentShiftId, this.deptShifts[0]?.departmentId);
            }
            else {
                this.setShiftDetails(0, 0);
            }

            if (this.deptPartialShifts?.length){
                this.setPartialShiftDetails(this.deptPartialShifts[0]?.departmentShiftId, this.deptPartialShifts[0]?.departmentId);
            }
        }

        setShiftDetails(deptShiftId:number, deptId:number) {
            var selectedDeptShift = this.deptShifts.find((x:any) => x.departmentShiftId == deptShiftId
                && x.departmentId == deptId && !x.isPartial);
            var selectedShiftDetails: any

            if (this.data.allShifts.length > 0) {
                this.data.shifts = this.data.allShifts.filter((shift: any) => { return shift.departmentId === this.selectedDeptId && !shift.isPartial && shift.skillId == this.selectedSkillId });
            }
            if (this.data.shifts.length > 0) {
                this.data.shifts.sort();

                selectedShiftDetails = this.data.shifts[0];
                selectedDeptShift = this.deptShifts.find((x:any) => x.departmentShiftId == selectedShiftDetails.departmentShiftId
                    && x.departmentId == selectedShiftDetails.departmentId && !x.isPartial);
                
                this.data.selectedShift = selectedDeptShift? selectedDeptShift.id : "";
            } else {
                this.data.shifts = this.openNeedsShiftDetails?.filter((shift: any) => { return shift.departmentId === this.selectedDeptId && !shift.isPartial && shift.skillId == this.selectedSkillId });
                if (this.data.shifts.length > 0) {
                    this.data.shifts.sort();

                    selectedShiftDetails = this.data.shifts[0];
                    selectedDeptShift = this.deptShifts.find((x:any) => x.departmentShiftId == selectedShiftDetails.departmentShiftId
                        && x.departmentId == selectedShiftDetails.departmentId && !x.isPartial);
                    
                    this.data.selectedShift = selectedDeptShift? selectedDeptShift.id : "";
                }
                else{
                    this.data.selectedShift = "";
                }
            }

            if (selectedDeptShift){
                this.deptShiftDesc = selectedDeptShift.shiftDescription;
                this.shiftStartTime = selectedDeptShift.startTime;
                this.shiftEndTime = selectedDeptShift.endTime;
            }
            this.onOpenNeedShiftChanges();
        }

        setPartialShiftDetails(deptShiftId:number, deptId:number) {
            const selectedDeptShift = this.deptPartialShifts.find((x:any) => x.departmentShiftId == deptShiftId
                && x.departmentId == deptId);

            if (this.data.allShifts.length > 0) {
                this.data.partialShifts = this.data.allShifts.filter((shift: any) => { return shift.id == this.data.selectedShift && shift.departmentId === this.selectedDeptId && shift.isPartial });
            }
            if (this.data.partialShifts.length > 0) {
                this.data.partialShifts.sort();
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

        onOpenNeedShiftChanges() {
            const filteredShift: any = this.data?.shifts?.filter((shift: any) => {
                return shift.id === this.data.selectedShift;
            });
            if (filteredShift.length){
                this.needid = filteredShift[0].id;
                this.actualShiftStartTime = this.formatTime(filteredShift[0].startTime);
                this.actualShiftEndTime = this.formatTime(filteredShift[0].endTime);
                this.departmentShiftId = filteredShift[0].departmentShiftId;

                this.data.shiftMembers = filteredShift[0].shiftMembers.map((members:any) => {
                    members.name = members.firstName + " " + members.lastName;
                    return members;
                });
            }           
            
            if (this.showErrorMsg) {
                this.showErrorMsg = false;
                this.errorMsg = "";
            }

            if (this.deptPartialShifts?.length){
                this.setPartialShiftDetails(this.deptPartialShifts[0]?.departmentShiftId, this.deptPartialShifts[0]?.departmentId);
            }
        }

        onOpenNeedPartialShiftChanges() {
            const filteredShift: any = this.data.partialShifts.filter((shift: any) => {
                return shift.id === this.data.selectedShift && shift.departmentShiftId === this.data.selectedPartialShift;
            });
            
            if (filteredShift.length){
                this.needid = filteredShift[0].id;
                this.actualPartialShiftStartTime = this.formatTime(filteredShift[0].startTime);
                this.actualPartialShiftEndTime = this.formatTime(filteredShift[0].endTime);
                this.departmentPartialShiftId = filteredShift[0].departmentShiftId;

                this.data.shiftMembers = filteredShift[0].shiftMembers.map((members:any) => {
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
            return this.data.partialShifts.length && this.showPartial? this.departmentPartialShiftId : this.departmentShiftId;
        }

        selectedShiftActualStartTime(){
            return this.data.partialShifts.length && this.showPartial && this.data.selectedPartialShift? this.actualPartialShiftStartTime : this.actualShiftStartTime;
        }

        selectedShiftActualEndTime(){
            return this.data.partialShifts.length && this.showPartial && this.data.selectedPartialShift? this.actualPartialShiftEndTime : this.actualShiftEndTime;
        }

        FireAction() {
            try {
                if (this.currentEvent?.type == "Assignment" && this.currentEvent?.status == "Pending") {
                    this.isLoading = true;
                    this.$store.dispatch('schedule/WithdrawEvent', { needid: this.needid, assignementid: this.currentEvent.id })
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
                        "needId": this.needid,
                        "tenantId": this.profileData?.tenantId,
                        "deptShiftId": this.selectedShiftId(),
                        "date": this.currentEvent?.date,
                        "deptId": this.selectedDeptId,
                        "staffId": this.profileData?.staffId,
                        "scheduleStartDate": this.scheduleStartDate,
                        "scheduleEndDate": this.scheduleEndDate
                    };
                    this.isLoading = true;
                    this.$store
                        .dispatch("schedule/ScheduleOpenNeedRequest", requestBody)
                        .then((res) => {
                            console.log("test777")
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