
<template>
    <div class="margin">
        <neu-row class="no-print">
            <neu-col xxl="" xl="3" lg="12" md="2" sm="6" cols="12">
                <neu-select ref="ddlFacility" interface="popover" :value="selectedFacilityId" @v-neu-change="onFacilityChange">
                <neu-option ref="ddlFacilityOption" v-for="facility in facilities" :value="facility.facilityId" :key="facility.facilityId">
                    {{facility.facilityName}}
                </neu-option>
                </neu-select>
            </neu-col>
            <neu-col xxl="2" xl="3" lg="12" md="2" sm="6" cols="12">
                <neu-select ref="ddlDepartment" interface="popover" :value="selectedDeptId" @v-neu-change="onDepartmentChange">
                <neu-option ref="ddlDepartmentOption" v-for="department in facilityDepts" :value="department.deptId" :key="department.deptId">
                    {{department.deptName}}
                </neu-option>
                </neu-select>
            </neu-col>
            <neu-col xxl="2" xl="3" lg="12" md="2" sm="6" cols="12">
                <VueMultiselect ref="ddlSkills" v-model="selectedSkills"
                        :options="skills"
                        :multiple="true"
                        :searchable="true"
                        :close-on-select="true"
                        @update:modelValue="onSkillSelect"
                        placeholder="Select Skills"
                        label="description"
                        track-by="description">
                </VueMultiselect>
            </neu-col>
            <neu-col xxl="2" xl="3" lg="12" md="2" sm="6" cols="12">
                <VueMultiselect ref="ddlScheduleBlocks" v-model="selectedSkills"
                        :options="skills"
                        :multiple="true"
                        :searchable="true"
                        :close-on-select="true"
                        @update:modelValue="onSkillSelect"
                        placeholder="Select Schedule Blocks"
                        label="description"
                        track-by="description">
                </VueMultiselect>
            </neu-col>
            <neu-col xxl="2" xl="3" lg="12" md="2" sm="6" cols="12">
                <neu-select ref="ddlPeriod" interface="popover" :value="selectedScheduleId" @v-neu-change="onScheduleChange">
                    <neu-option ref="ddlPeriodOption" v-for="schedule in userSchedules" :key="schedule.id" :value="schedule.id">
                        {{getSchedulePeriod(userSchedules.indexOf(schedule))}}
                    </neu-option>
                </neu-select>
            </neu-col>
            <neu-col xxl="2" xl="3" lg="12" md="2" sm="6" cols="12">
                <span>Last Updated : <br> {{lastUpdatedDate}}</span>
            </neu-col>
        </neu-row>        
    </div>
    <neu-divider color="gray-100" dark="true" >
    </neu-divider>
    <!--Print Page Filters -->
    <div class="deptFiltersPrint">
            <table>
                <tr>
                    <td>Facility :</td>
                    <td class="print-td-style">{{selectedFacilityName}}</td>
                    <td>Dept :</td>
                    <td class="print-td-style">{{ selectedDeptName}}</td>
                    <td>Skills :</td>
                    <td class="print-td-style">{{selectedSkillList}}</td>
                    <td>Schedule Period :</td>
                    <td class="print-td-style">{{selectedScheduleName}}</td>
                    <td>Last Updated :</td>
                    <td class="print-td-style">{{lastUpdatedDate}}</td>
                </tr>
            </table>          
        </div>
    <div class="neu-container neu-padding--0 deptTableContainer deptContainer margin">
            <table class="neu-table_new deptView">
                <tr class="th_HeaderRow">
                    <th class="neu-input__label td_column1 empName pt10"  v-bind:class="{ 'hideEmployeNameCol': columnToggle }">
                        Employee Name
                        <i class="material-icons neu-table__sort no-print valign" v-on:click="getSortedDSData('clicked')">{{ sortArrow }}</i>
                    </th>
                    <th class="neu-input__label td_column2 skillWidth pt14" v-bind:class="{ 'hideSkillCol': columnToggle }">
                        <span v-bind:class="{ 'hideIcon': columnToggle }">Skill</span>
                        <div class="navArrow mobileNav no-print">                           
                            <neu-icon class="material-icons pointer colNavigation"  v-bind:class="{ 'hideIcon': !iconToggle }" @click="hideColumns">
                                chevron_left
                            </neu-icon>
                            <neu-icon class="material-icons pointer colNavigation " v-bind:class="{ 'hideIcon': iconToggle }" @click="showColumns">
                                chevron_right
                            </neu-icon>
                        </div>
                    </th>
                    <th v-for="day in days" :key="days.indexOf(day)" class="neu-input__label periodWidth" 
                        v-bind:class="applyCSS(day,null)"
                        >
                        {{  getFormattedDay(day) }}
                        <br />
                        {{ getFormattedDate(day) }}
                    </th>
                </tr>

                <tr class="neu-table__row tableBorder" v-for="ds in sortedDSList" :key="sortedDSList.indexOf(ds)" :staffId="ds.staffId">
                    <td :class="['neu-table__cell neu-table__row-comfy neu-input__label td_column1 colEmpNameData', (ds.staffId == profileData.staffId || ds.charge== 1) ? 'boldClass' : '', columnToggle? 'hideEmployeNameCol': '']"  >
                        {{ ds.lastName }},  {{ ds.firstName }}
                    </td>
                    <td class="neu-table__row-comfy neu-input__label td_column2" v-bind:class="{ 'hideSkillCol': columnToggle }">
                        {{ !columnToggle ? ds.skill: '' }}
                    </td>
                    <td v-for="day in days" :key="days.indexOf(day)+'_row'" class="neu-table__row-comfy neu-input__label"
                    v-bind:class="applyCSS(day,ds)"
                        style=" border: 1px solid silver; word-wrap: break-word !important; text-align: center !important;"  :date="displayDate(day)">
                        {{ showCellData(day,ds) }}
                    </td>
                </tr>
            </table>
        </div>
</template>

<script lang="ts">
    import { Options, Vue } from 'vue-class-component';
    //@ts-ignore
    import moment from "moment";
    import { mapState } from "vuex";
    import { DepartmentStaff, DepartmentAssignment } from "@/models";    
    //@ts-ignore
    import { Multiselect } from 'vue-multiselect';
    import { useAppInsights } from '../../store/modules/AppInsights'
    import {
        NeuIcon
    } from '@neutron/vue'

    class Props{
        readonly currentScheduleId!: string;
    }
    @Options({
        components: { 
            VueMultiselect : Multiselect,NeuIcon
            //NeuSelect,NeuOption,NeuRow,NeuCol,NeuDivider
         },
         computed: {
                ...mapState('profile', ['profileData','appInsightEventData']),
                ...mapState('schedule', ['departmentSchedules','userSchedules'])
            },
    })
    export default class DepartmentView extends Vue.with(Props) {

        public profileData!: any;
        public departmentSchedules!: DepartmentStaff[];
        public userSchedules!: any;
        appInsightEventData!: any;

        days: Date[] = [];
        sortedDSList: DepartmentStaff[] = [];
        sortedDSListforSkills: DepartmentStaff[] = [];
        sortOrder: string = 'asc';
        sortArrow: string = 'arrow_upward';
        facilities: any = [];
        facilityDepts: any = [];
        selectedFacilityId: number = 0;
        selectedDeptId: number = 0;
        skills: any = [];
        selectedSkillId: number = 0;
        facilityName: string = '';
        departmentName: string = '';
        skillName!: string;
        lastUpdatedDate: string = '';
        selectedSkills: any = [];
        lastSelectedSkills: any = {};
        currentShceduleIndex: number = (localStorage.getItem("sIndex") == null ? 0 : Number(localStorage.getItem("sIndex")));
        selectedScheduleId: string = '';
        selectedFacilityName: string = '';
        selectedDeptName: string = '';
        selectedScheduleName: string = '';
        selectedSkillList: string = '';
        private columnToggle: boolean = false;
        private iconToggle: boolean = true;

        async mounted() { 
            if(this.profileData?.first == "" || this.profileData?.first == null || this.profileData?.first == undefined)
            {
                await this.$store.dispatch('profile/getProfileDetails','');
                await this.getFiltersData();
                await this.showScheduleDays();
                await this.getDepartmentSchedule();
                localStorage.setItem("visitedDepartmentView", "true");
                useAppInsights().trackEvent({name:'ViewDepartment',properties: 
                JSON.parse(JSON.stringify(this.appInsightEventData))}); 
            } else{
                await this.getFiltersData();
                await this.showScheduleDays();
                await this.getDepartmentSchedule();
                localStorage.setItem("visitedDepartmentView", "true");
                useAppInsights().trackEvent({name:'ViewDepartment',properties: 
                JSON.parse(JSON.stringify(this.appInsightEventData))});
            }            
        }

        async getFiltersData() {
            if (this.profileData != null && this.profileData?.username != null) {
                var objPrimaryFacilityDepartment = {
                    facilityId: this.profileData.facilityId,
                    coid: this.profileData.coid,
                    facilityName: this.profileData.facilityName,
                    deptId: this.profileData.deptId,
                    deptCode: this.profileData.deptCode,
                    deptName: this.profileData.deptName,
                    effective: "",
                    expires: ""
                }
                const deptIndex = this.profileData?.secondaryDepartments?.findIndex((x:any) => x.deptId == objPrimaryFacilityDepartment.deptId);
                if (deptIndex > -1) {
                    this.profileData?.secondaryDepartments?.splice(deptIndex, 1);
                }
                this.profileData?.secondaryDepartments?.push(objPrimaryFacilityDepartment);

                this.facilities = this.removeDuplicatesFromArrayByProperty(this.profileData.secondaryDepartments, 'facilityId');                
                this.selectedFacilityId = (localStorage.getItem("selFacId") == null ? this.profileData.facilityId : Number(localStorage.getItem("selFacId")));               
                this.facilityDepts = this.profileData?.secondaryDepartments?.filter((x:any) => x.facilityId == this.selectedFacilityId);
                this.selectedDeptId = (localStorage.getItem("selDepId") == null ? this.profileData.deptId : Number(localStorage.getItem("selDepId")));               

                if (this.userSchedules?.length  == 0 || this.userSchedules == undefined) {
                    var payload = {
                        username: this.profileData.username,
                        index: this.currentShceduleIndex,
                    };

                    await this.$store.dispatch("schedule/getAllUserSchedules", payload);
                }

                if (this.userSchedules != undefined) {
                    this.selectedScheduleId = this.userSchedules[this.currentShceduleIndex]?.id;
                    let Schedule = this.userSchedules.filter((x:any)=> x.id == this.selectedScheduleId)[0]
                    this.selectedScheduleName = this.getSchedulePeriod(this.userSchedules.indexOf(Schedule));
                }

                this.selectedFacilityName =  this.facilities?.filter((x:any)=> x.facilityId == this.selectedFacilityId)[0]?.facilityName;
                this.selectedDeptName = this.facilityDepts?.filter((y:any)=> y.deptId == this.selectedDeptId)[0]?.deptName;
            }
        }

        removeDuplicatesFromArrayByProperty = (arr:any, prop:any) => arr?.reduce((accumulator:any, currentValue:any) => {
            if (!accumulator.find((obj:any) => obj[prop] === currentValue[prop])) {
                accumulator.push(currentValue);
            }
            return accumulator;
        }, [])

        removeDuplicatesSkillsFromArrayByProperty = (arr:any, prop:any) => arr?.reduce((accumulator:any, currentValue:any) => {
            if (accumulator.length == 0) {
                accumulator.push({ "id": 0, "description": "All", "skill": "All" });
            }
            if (!accumulator.find((obj:any) => obj[prop] === currentValue[prop])) {
                accumulator.push({ "id": accumulator.length, "description": currentValue.skill, "skill": currentValue.skill });
            }
            return accumulator;
        }, [])

        async getDepartmentSchedule() {
            if(this.userSchedules != undefined && this.userSchedules != null){
                var payload = {
                    startDate: this.userSchedules[this.currentShceduleIndex]?.startDate,
                    endDate: this.userSchedules[this.currentShceduleIndex]?.endDate,
                    deptId: this.selectedDeptId,
                    username: this.profileData.username,
                };

                    if(this.selectedDeptId > 0)
                    {
                    await this.$store
                    .dispatch("schedule/getDepartmentSchedule", payload)
                    .then((res: any) => {
                        this.skills = this.removeDuplicatesSkillsFromArrayByProperty(this.departmentSchedules, 'skill');
                        this.selectedSkills = localStorage.getItem("selSkills") == null ? this.skills?.filter((x:any) => x.skill == "All") : JSON.parse(localStorage.getItem("selSkills") as any);
                        this.sortedDSList = this.departmentSchedules;
                        this.sortedDSListforSkills = this.departmentSchedules;
                        this.getLastUpdatedDate();
                        this.getSortedDSData('');
                        this.sortDSListForFilteredSkills('');
                        this.selectedSkillList = Array.prototype.map.call(this.selectedSkills, function(item) { return item.description; }).join(",");
                    })
                    .catch((err: any) => {
                        if (err) {
                            console.log(err); // Handle errors any way you want
                        }
                    });
                    }
            }
        }

        getLastUpdatedDate() {
            const today = new Date();
            const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            this.lastUpdatedDate = date + ' ' + time;
        }

        async showScheduleDays() {
            this.days = [];
            if(this.userSchedules != undefined && this.userSchedules != null){
                var date1 = new Date(this.userSchedules[this.currentShceduleIndex]?.startDate);
                var daysInSchedule = this.profileData.weeksInSchedule * 7;
                for (var i = 0; i < daysInSchedule; i++) {
                    var d = new Date(date1);
                    d.setDate(date1.getDate() + i);
                    this.days.push(d);
                }
            }
        }

        getSortedDSData(flag: string) {
            if (flag == 'clicked') {
                this.sortArrow = (this.sortOrder == 'asc' ? 'arrow_downward' : 'arrow_upward');
                this.sortOrder = (this.sortOrder == 'asc' ? 'desc' : 'asc');
                this.sortedDSList = this.sortedDSList.slice().sort((a, b) => (a.lastName as any) > (b.lastName as any) ? (this.sortOrder == 'asc' ? 1 : -1) : ((a.lastName as any) < (b.lastName as any) ? (this.sortOrder == 'asc' ? -1 : 1) : 0));
            }
            else {
                this.sortOrder = 'asc';
                this.sortArrow = 'arrow_upward';
                this.sortedDSList = this.sortedDSList.slice().sort((a, b) => (a.lastName as any) > (b.lastName as any) ? 1 : -1);
            }

            var loggedInStaff = this.sortedDSList?.find(x => x.staffId == this.profileData.staffId);
            if (loggedInStaff != undefined) {
                var loggedInStaffIndex = this.sortedDSList?.findIndex(x => x.staffId == this.profileData.staffId);
                this.sortedDSList.splice(loggedInStaffIndex, 1);
                this.sortedDSList.unshift(loggedInStaff);
            }
        }

        getFormattedDay(date: Date): string {
           return moment(date).format("ddd");
        }
        applyCSS(date:Date, ds:any): string {                     
            let dayname= moment(date).format("ddd"); 
            let getcss = '';          
            if(dayname === 'Sun' || dayname === 'Sat')
            getcss = 'weekend_bg_color';            
            if(moment(date).format("MM/DD/yyyy") === moment(new Date()).format("MM/DD/yyyy") )
            {
              getcss = 'today_bg_color';
            }
            if(ds!=null)
            {               
                let objDeptStaff = this.sortedDSList.find(x => x.staffId == ds.staffId);
                let objDeptAssignment = objDeptStaff?.assignments.filter(x => moment(new Date(x.date)).format("MM/DD/yyyy") == moment(new Date(date)).format("MM/DD/yyyy"));
                if (objDeptAssignment != undefined) {
                    objDeptAssignment?.forEach(shift => {               
                    if(shift.isOverTime == true)
                    {
                        if(getcss == '')
                        getcss = 'overtimeshift_bg_color';
                        else
                        getcss = getcss + " " + 'overtimeshift_bg_color';                        
                    }
                    if(shift.isChargeShift == true)
                    {
                        if(getcss == '')
                        getcss = 'boldClass';
                        else
                        getcss = getcss + " " + 'boldClass';
                    }
                    });  
                }
            }
            return getcss;
        }

        getFormattedDate(date: Date): string {
            return moment(date).format("D");
        }

        showCellData(dayValue:any, dsObject:any) {           
            let shiftCode = '';           
            var objDepartmentStaff = this.sortedDSList.find(x => x.staffId == dsObject.staffId);
            var objDepartmentAssignment = objDepartmentStaff?.assignments.filter(x => moment(new Date(x.date)).format("MM/DD/yyyy") == moment(new Date(dayValue)).format("MM/DD/yyyy"));
            if (objDepartmentAssignment != undefined) {
                objDepartmentAssignment?.forEach(shift => {
                shiftCode += shift.shiftCode + '\n';               
                });               
                return  shiftCode.substring(0, shiftCode.length - 1);
            }
            else {
                return "";
            }
        }

        displayDate(date:Date){
            return moment(new Date(date)).format("yyyy-MM-DD");
        }

        async onFacilityChange(event:any) {
            this.selectedFacilityId = event.target.value;
            this.facilityDepts = this.profileData.secondaryDepartments?.filter((x:any) => x.facilityId == event.target.value);
            if (this.selectedFacilityId == this.profileData.facilityId) {
                this.selectedDeptId = this.profileData.deptId;
            }
            else {
                this.selectedDeptId = this.facilityDepts != null ? this.facilityDepts[0]?.deptId : 0;
            }
            localStorage.setItem("selFacId", this.selectedFacilityId?.toString());
            localStorage.setItem("selDepId", this.selectedDeptId?.toString());
            localStorage.removeItem("selSkills");
            this.selectedFacilityName =  this.facilities?.filter((x:any)=> x.facilityId == this.selectedFacilityId)[0]?.facilityName;
            this.selectedDeptName = this.facilityDepts?.filter((y:any)=> y.deptId == this.selectedDeptId)[0]?.deptName;
            await this.getDepartmentSchedule();
        }

        async onDepartmentChange(event:any) {
            this.selectedDeptId = event.target.value;
            localStorage.setItem("selDepId", this.selectedDeptId?.toString());
            localStorage.removeItem("selSkills");
            this.selectedDeptName = this.facilityDepts?.filter((y:any)=> y.deptId == this.selectedDeptId)[0]?.deptName;
            await this.getDepartmentSchedule();
        }

        onSkillSelect(items:any, lastSelectItem:any) {            
            this.selectedSkills = lastSelectItem?.skill == "All" ? items.filter((x:any) => x.skill == "All") : items.filter((x:any) => x.skill != "All");
            this.lastSelectedSkills = lastSelectItem;

            this.sortedDSListforSkills = this.sortedDSListforSkills.slice().sort((a, b) => (a.lastName as any) > (b.lastName as any) ? 1 : -1);

            var loggedInStaff = this.sortedDSListforSkills?.find(x => x.staffId == this.profileData?.staffId);
            if (loggedInStaff != undefined) {
                var loggedInStaffIndex = this.sortedDSListforSkills?.findIndex(x => x.staffId == this.profileData?.staffId);
                this.sortedDSListforSkills.splice(loggedInStaffIndex, 1);
                this.sortedDSListforSkills.unshift(loggedInStaff);
            }

            localStorage.setItem("selSkills", JSON.stringify(this.selectedSkills));
            this.selectedSkillList = Array.prototype.map.call(this.selectedSkills, function(item) { return item.description; }).join(",");
            this.sortDSListForFilteredSkills("skill"); 
        }

        sortDSListForFilteredSkills(flag:string) {
            if (this.selectedSkills?.length > 0 && this.selectedSkills?.find((x:any) => x.skill == "All") == undefined) {
                var finalArray:any = [];
                for (var i = 0; i < this.selectedSkills.length; i++) {
                    var searchedArray = this.sortedDSListforSkills?.filter(x => x.skill == this.selectedSkills[i].description);
                    if (searchedArray.length > 0) {
                        Array.prototype.push.apply(finalArray, searchedArray);
                    }
                }
                this.sortedDSList = finalArray;
                this.sortedDSList = this.sortedDSList.slice().sort((a, b) => (a.lastName as any) > (b.lastName as any) ? 1 : -1);

                var loggedInStaff1 = this.sortedDSList?.find(x => x.staffId == this.profileData.staffId);
                if (loggedInStaff1 != undefined) {
                    var loggedInStaffIndex1 = this.sortedDSList?.findIndex(x => x.staffId == this.profileData.staffId);
                    this.sortedDSList.splice(loggedInStaffIndex1, 1);
                    this.sortedDSList.unshift(loggedInStaff1);
                }
                this.sortOrder = 'asc';
                this.sortArrow = 'arrow_upward';
            }
            else {
                if (flag == "skill") {
                    this.sortedDSList = this.sortedDSListforSkills;
                    this.sortOrder = 'asc';
                    this.sortArrow = 'arrow_upward';
                }
            }
        }

        getSchedulePeriod(indexVal:number) {
            var scheduleDate = (
                moment(this.userSchedules[indexVal]?.startDate).format("ll") +
                " - " +
                moment(this.userSchedules[indexVal]?.endDate).format("ll"));
            return scheduleDate;
        }

        async onScheduleChange(value:any) {
            this.selectedScheduleId = value.target.value;
            var schedule = this.userSchedules?.find((x:any) => x.id == value.target.value);
            this.currentShceduleIndex = this.userSchedules?.indexOf(schedule);
            localStorage.setItem("sIndex", this.currentShceduleIndex?.toString());
            let Schedule = this.userSchedules?.filter((x:any)=> x.id == this.selectedScheduleId)[0];
            this.selectedScheduleName = this.getSchedulePeriod(this.userSchedules?.indexOf(Schedule));
            this.showScheduleDays();
            await this.getDepartmentSchedule();
        }

        hideColumns(){
            this.columnToggle = true;
            this.iconToggle = false;
        }

        showColumns(){
            this.columnToggle = false;
            this.iconToggle = true;
        }
    }

</script>

<style scoped>

    .boldClass {
        font-weight: bold;
    }

    @media screen
    {
        .deptTableContainer{
            overflow:auto !important;
            height:410px;
        }

        .deptTable{
            margin-right:100px;
        }

        .colEmpNameData{
            padding: 0.400em 0.938rem !important;
        }

        .th_HeaderRow {
            /* position: sticky; */
            top: 0;
            z-index: 3;
            width: 25vw;
            background: white;
            border: 1px solid silver;
            border-top: 0px !important;
        }

        .td_column1 {
            position: sticky;
            left: 0;
            z-index: 1;
            background: white;
        }

        .td_column2 {
            position: sticky;
            left: 180px;
            z-index: 2;
            background: white;
            border-right: 1px solid silver !important;
        }

        .filter-input
        {
            width: 100%;
            font-family: "HCA-Mark","Arial",sans-serif!important;
        }

        .periodWidth{
            width:41px !important;
        }

        .empName{
            width: 180px;
            z-index:4 !important;
        }

        .skillWidth{
            width: 60px;
            text-align: left;
            z-index:4 !important;
        }
        .hideIcon{
            display: none;
        }

        .mobileNav{
            display: none;
        }

        .deptContainer::-webkit-scrollbar {
            -webkit-appearance: none;
        }

        .deptContainer::-webkit-scrollbar:vertical {
            width: 11px;
        }

        .deptContainer::-webkit-scrollbar:horizontal {
            height: 11px;
        }

        .deptContainer::-webkit-scrollbar-thumb {
            border-radius: 8px;
            border: 2px solid white; /* should match background, can't be transparent */
            background-color: rgba(0, 0, 0, .5);
        }

        .deptContainer::-webkit-scrollbar-track {
            background-color: #fff;
            border-radius: 8px;
        }

        .deptFiltersPrint{
            display: none;
        }
        .weekend_bg_color{   
            border: 1px solid gray;
            background:rgb(240, 237, 237);           
        }
        .today_bg_color{
            border-left: 2px solid black !important;
            border-right: 2px solid black !important;
             
        }
        .overtimeshift_bg_color{
              position: relative;
        }
        .overtimeshift_bg_color:after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 0; 
        height: 0; 
        display: block;
        border-style: solid;
        border: 1px solid;
        border-width: 20px 0 0 20px;
        border-color: transparent transparent transparent hsl(357, 100%, 50%);
    }

        @media (max-width: 480px) {
           .periodWidth{
                width:32px !important;
            }

            .empName{
                width: 145px;
                z-index:4 !important;
                transition: width .2s ease-in-out;
            }

            .skillWidth{
                width: 48px;
                text-align: left;
                z-index:4 !important;
                transition: width .2s ease-in-out;
            }

            .td_column2 {
                position: sticky;
                left: 145px;
                z-index: 2;
                background: white;
                border-right: 1px solid silver !important;
            }

            .navArrow{
                display: inline-block !important;
                top: 0;
                position: absolute;
            }

            .colNavigation{
                position: relative;
                font-size: 18px;
                border: 1px solid #777;
                border-radius: 50%;
                background-color: #777;
                color: #fff;
            }

            .pt10{
                padding-top: 10px;
            }

            .pt14{
                padding-top: 14px;
            }

            .hideEmployeNameCol{
                width: 0;
                display: none;
                transition: width .2s ease-in-out;
            }

            .hideSkillCol{
                width: 22px;
                transition: width .2s ease-in-out;
                left: 0px;
                z-index: 0 !important;
                height: 24px;
            }

            neu-col{
                padding-bottom: 5px;
            }
        }
    /* Media Query for low resolution  Tablets, Ipads */
        @media (min-width: 481px) and (max-width: 899px) {
            .mlr2{
               margin: 0 2px;
            }

            .plr5 {
                padding: 0 5px;
            }

            .filterFields{
                padding: 0 0.238rem;
            }

            .periodWidth{
                width:35px !important;
            }

            .skillWidth{
                width: 40px;
                text-align: left;
                z-index:4 !important;
            }

            .td_column2 {
                position: sticky;
                left: 180px;
                z-index: 2;
                background: white;
                border-right: 1px solid silver !important;
            }
            neu-col{
                padding-bottom: 5px;
            }

        }
    }
    @media print{
        table.deptView td {
            font-size: xx-small !important;
            border: 1px solid silver;
            padding: 0px !important;
        }
        table.deptView th {
            font-size: xx-small !important;
            border: 1px solid silver;
            padding: 0px !important;
        }

        .empName{
            width: 70px !important;
        }

        .skillWidth{
            width: 40px;
            text-align: left;
        }

        .periodWidth{
            white-space: nowrap !important;
        }

        .colEmpNameData{
            padding: 0px !important;
            overflow-wrap: break-word !important;
        }

        .th_HeaderRow {
            top: 0;
            width: 25vw;
            background: white;
            border: 1px solid silver;
            border-top: 0px !important;
        }

        .td_column1 {
            background: white;
        }

        .td_column2 {
            background: white;
            border-right: 1px solid silver !important;
        }

        .deptFiltersPrint{
            display: block;
        }
       
    }

 .valign{
    vertical-align: bottom;
}

.tableBorder{
    border:1px solid silver
}
.margin {
      margin: 8px;
  }

.neu-table__row:hover,
.neu-table__row:focus {
    background: #d9d9d6;
}
.print-td-style{
    font-weight:bold;
    padding-right: 15px;
    padding-left: 5px;
}
</style>