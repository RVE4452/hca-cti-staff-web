<template>
<div>
    <neu-container class="mw-100">
        <div class="schedulerMainDiv"  v-bind:class="{ 'panel-open': sharedToggle, 'posNone': isWelcomeModalVisible }">
            <neu-row v-if="viewFlag == 'CalView'">
                <neu-col md="3" style="margin-left:-45px;">
                                <h5>
                                    <p left="true"
                                    >
                                        <small @click.prevent="todayDate()">
                                            <neu-icon class="m-3 neu-icon pointer neu-icon--large hydrated">home</neu-icon>                                        
                                            <a style="position: relative; top: -7px;"
                                            class="neu-link"
                                            href="#">TODAY</a>
                                        </small>
                                    </p>
                                </h5>
                </neu-col>
                <neu-col md="6" >
                        <div>
                                <div style="text-align: center">
                                    <h5>
                                        <neu-icon @click="beforeMonthNavigate(false)"  style="position: relative; top: 4px" class="m-3 neu-icon pointer neu-icon--large hydrated">chevron_left</neu-icon>
                                        <span>
                                            {{ this.currentDate }}
                                        </span>                                  
                                        <neu-icon @click="beforeMonthNavigate(true)" style="position: relative; top: 4px" class="m-3 neu-icon pointer neu-icon--large hydrated" >chevron_right</neu-icon>
                                    </h5>
                                </div>
                        </div>
                </neu-col>
                <neu-col  md="2" >                
                        <h5>
                            <p  style="margin-top: 1em; margin-left: 1em;">
                                            <span v-if="scheduleStatus.toUpperCase() == 'PLAN SHEET' && isTierOpen">
                                                SELF-SCHEDULING OPEN
                                            </span>
                                            <span v-if="scheduleStatus.toUpperCase() == 'PLAN SHEET' && !isTierOpen">
                                                FUTURE SCHEDULE
                                            </span>
                                            <span v-if="scheduleStatus.toUpperCase() == 'AFTER PLAN SHEET'">
                                                PENDING MANAGEMENT REVIEW
                                            </span>
                                            <span v-if="scheduleStatus.toUpperCase() == 'FIRST APPROVAL'">
                                                PENDING MANAGEMENT APPROVAL
                                            </span>
                                            <span v-if="scheduleStatus.toUpperCase() == 'POSTED'">
                                                SCHEDULE POSTED
                                            </span>
                                            <span v-if="scheduleStatus.toUpperCase() == 'BEFORE PLAN SHEET' || scheduleStatus.toUpperCase() == 'FUTURE'">
                                                FUTURE SCHEDULE
                                            </span>
                                        </p>
                                    </h5>                               
                </neu-col>
                <neu-col md="1" style="margin-left:20px;">
                     <neu-icon  @click="toggleFilterPanel()" class="m-3 neu-icon pointer neu-icon--large hydrated">filter_list</neu-icon>
                </neu-col>
            </neu-row>    
            <neu-row> 
                <div class="container calContainer" v-if="viewFlag == 'CalView'">
                    <div v-if="!isLoading"> 
                        <!-- CALENDAR -->
                        <neu-row>
                            <neu-col md="12">
                                <FullCalendar :options="calendarOptions"
                                            ref="fullCalendarCurrentMonth">                                
                                </FullCalendar>
                            </neu-col>                            
                            <div class="col-sm-12 neu-margin--top-20 neu-text--caption neu-text--align-center mTop0">
                                    <span class="neu-text--bold">Important Note </span>: Shift assignments display on the date of the shift's actual start time.
                            </div>
                        </neu-row>
                        <!-- END CALENDAR -->
                        <!-- MODAL -->
                    </div>
                    <div v-else>
                        <vcl-facebook></vcl-facebook>                   
                    </div>
                    <!-- END MODAL -->
                </div>
                <div class="neu-container neu-padding--top-0 paddingDeptView" v-else>
                    <div v-if="!isLoading">
                        <DepartmentView :currentScheduleId="currentShceduleIndex" />
                        <div class="col-sm-12 neu-margin--top-20 neu-text--caption neu-text--align-center mTop0">
                            <span class="neu-text--bold">Important Note </span>: Shift assignments display on the date of the shift's actual start time.
                        </div>
                    </div>
                    <div v-else>
                        <vcl-facebook></vcl-facebook>                   
                    </div>
                </div>
            </neu-row>       
        </div> 
         <neu-row style="display: block;">
             <CalendarFilterPanel ref="calendarfilter"
                                                    @close-event="toggleFilterPanel"
                                                    @sched-event="onCheckSchedEvents"
                                                    @check-pend-event="onCheckPendRequestsOption"
                                                    @check-depart-need-event="onCheckDepartNeedsOption"
                                                    @check-trade-shift-event="onCheckTradeShiftsOption"
                                                    @check-unavailability-event="onCheckUnavailabilityOption"
                                                    @check-all="onCheckAllOption"
                                                    :toggleStatus="leftNavBar"></CalendarFilterPanel>
         <SharedModal v-if="sharedToggle"
                     :currentEvent="currentEvent"
                     :scheduleStartDate="scheduleStartDate"
                     :scheduleEndDate="scheduleEndDate"
                     @close-modal="closeSharedModal()"
                     @showSuccessModal="showSMPModal"
                     @raiseClickEvent="raiseClickEvent"
                     :sharedRequest="sharedRequest"
                     :isPanelOpen="sharedToggle"
                     :counter="counter"
                     :key="counter">
        </SharedModal>       
    </neu-row>
    </neu-container>   
</div>
</template>

<script lang="ts">    
    import DepartmentView from "./DepartmentView.vue";
    import CalendarFilterPanel from "./CalendarFilterPanel.vue";   
    import FullCalendar from '@fullcalendar/vue3';
    import adaptivePlugin from '@fullcalendar/adaptive';
    import dayGridPlugin from "@fullcalendar/daygrid";    
    import interactionPlugin from "@fullcalendar/interaction";
    import { CalendarOptions, EventApi, DateSelectArg, EventClickArg } from '@fullcalendar/core'
    import SharedModal from "../shared/SharedModal.vue";
    import SaveMsgPopUp from "../shared/SaveMsgPopUp.vue";
    import NotificationMsgPopUp from "../shared/NotificationMsgPopUp.vue"   
    import { ORSchedule, Event } from "@/models";
    import { Options, Vue } from "vue-class-component";
    import moment from "moment";
    import { mapState } from "vuex"; 
    // import { bus } from "../../main";
    //import bus from '../../eventBus'
    import tippy from 'tippy.js';
    import 'tippy.js/dist/tippy.css';
    import WelcomeMsgPopup from "../profile/WelcomeMsgPopup.vue";
    import ConfirmMsgPopUp from "../shared/ConfirmMsgPopUp.vue";
    import AlertPopUp from "../shared/AlertPopUp.vue";
    import { useAppInsights } from '../../store/modules/AppInsights';
    import {
    NeuTable,
    NeuLabel,
    NeuContainer,
    NeuRow,
    NeuCol
} from "@neutron/vue";
    
    class Props{
        viewFlag!:string;
    }
    @Options({  
    
    computed: {
        ...mapState('oidcStore',['oidcUser']),
         ...mapState('schedule',['userSchedules']),
        ...mapState('profile', ['profileData', 'appInsightEventData'])
    },
    components: {
        FullCalendar, 
                SharedModal,
                
                CalendarFilterPanel,
                SaveMsgPopUp,            
                DepartmentView,
                WelcomeMsgPopup,
                ConfirmMsgPopUp,
                AlertPopUp,
                NotificationMsgPopUp,                
                NeuTable,
                NeuLabel,
                NeuContainer,
                NeuRow,
                NeuCol
    },
    watch: {
            viewFlag(viewFlag) {
            if(viewFlag =='CalView'){
                         
                 this.getSchedules(false);
                 useAppInsights().trackEvent({name:'ViewCalendar', properties: 
                    JSON.parse(JSON.stringify(this.appInsightEventData))
                });
            }
        }
    }
    })
    
    export default class MyScheduleView extends Vue.with(Props) {
    
        sharedRequest: any = null;
        leftNavBar: boolean = false;
        isAlertModalVisible: boolean = false;
        alertMsgValue: string = '';
        declare public $refs: {
            fullCalendarCurrentMonth: HTMLFormElement;
            calendarfilter: any;
        };
        isPanelOpen: boolean = false;
        oidcUser!: any;        
        profileData!: any;        
        isAdmin!: boolean;        
        isImpersonating!: boolean;       
        appInsightEventData!: any;
        private currentDate: string = "March, 2021";
        confirmMsgValue = "You have not submitted your shift requests. Are you sure you want to navigate away?";
        isConfirmModalVisible: boolean = false;
        profile: any = null;
        private backDate = new Date();
        private forwardDate = new Date();
        private selectedDates: Array<string | string> = [];
        private isModalVisible = false;

        currentMonthCalendarApi: any = null;
        private schedules: any;
        private scheduleStatus = "Unknown";
        currentEvent: any =null;

        updateData: string = "";
        firstName: string = "";
        lastName: string = "";
        nameInitials: string = "";

        isSMPModalVisible: boolean = false;
        isDeptNeedCheck: boolean = true;
        msgValue: string = "";
        classFlag: string = "";
        calSelectedDates: any = {};
        isUnavailabilityAllowed!: boolean;

        employeeType: string = "";
        objCommitmentSubmit: any = {};
        scheduleId!: string;
        weeksInSchedule: number = 4;
        currentShceduleIndex: number = 0;
        scheduleStartDate!: Date;
        scheduleEndDate!: Date;
        isTierOpen: boolean = false;
        needFV = true;
        isWelcomeModalVisible: boolean = false;
        isAllFilterChecked: boolean = true;
        localNextVar: any;
        navForward: any;
        navBackward: any;
        isShiftTradeAllowed: boolean = false;
        isNotificationSuccessModalVisible: boolean = false;
        isNotificationErrorModalVisible: boolean = false;
        successMsgValue: string = "";
        successClassFlag: string = "";
        errorMsgValue: string = "";
        errorClassFlag: string = "";
        isCalenderViewLoaded: boolean = false;
       
        
        beforeRouteLeave(to:any, from:any, next:any) {
            let warningMsgStatus = this.checkWarningMessage();
            if(warningMsgStatus) {
                this.localNextVar = next;
                this.navForward = false;
                this.navBackward = false;
                this.isConfirmModalVisible = true;
            }
            else {
                next();
            }
        }

        beforeMonthNavigate(forwards:any) {
            let warningMsgStatus = this.checkWarningMessage();

            if(warningMsgStatus) {
                this.localNextVar = null;
                this.navForward = forwards;
                this.navBackward = !forwards;
                this.isConfirmModalVisible = true;
            }
            else {
                if (forwards) {
                    this.nextMonth();
                }
                else {
                    this.prevMonth();
                }
            }
        }

        checkWarningMessage() {
            let isPlanSheet = this.scheduleStatus.toUpperCase() == 'PLAN SHEET';

            let reservedEvents = this.events.some((e:any) => e.status === 'Reserved');

            let isCalendarView = this.viewFlag === 'CalView'

            return reservedEvents && isPlanSheet && isCalendarView;
        }

        async confirmedClicked() {
            this.isConfirmModalVisible = false;

            if (this.localNextVar) {
                this.localNextVar();
            }
            else if (this.navForward) {
                this.nextMonth();
            }
            else {
                this.prevMonth();
            }
        }

        private calendarOptions: any = {
            schedulerLicenseKey: '0712583610-fcs-1643842135',
            plugins: [
                adaptivePlugin,
                dayGridPlugin,
                //timeGridPlugin,
                interactionPlugin, // needed for dateClick
            ],
            validRange: {
                start: this.backDate.setMonth(this.backDate.getMonth() - 3), //'2021-03-25',//
                end: this.forwardDate.setMonth(this.forwardDate.getMonth() + 15),
            },
            duration: { weeks: this.weeksInSchedule },
            dateIncrement: { weeks: this.weeksInSchedule },
            views: {
                dayGrid: {
                    type: "dayGrid", // Applicable for: dayGrid and dayGridMonth
                    fixedWeekCount: true,
                    showNonCurrentDates: false,
                },
            },
            headerToolbar: false,
            editable: true,
            eventStartEditable: false,
            selectable: true,
            selectMirror: true,
            dayMaxEvents: false,
            weekends: true,
            select: (selectInfo:any) =>{
              this.handleDateSelect(selectInfo);
            },//this.handleDateSelect,
            eventClick: (clickInfo:any) =>{
              this.processClickEvent(clickInfo.event.title, clickInfo.event.start, clickInfo.event.id, clickInfo.event.extendedProps.needFV);
        
            },//this.handleEventClick,
            eventsSet: this.handleEvents,
            eventDidMount: function (info:any) {
                if (info.event.extendedProps.type.includes("Need") && !info.event.extendedProps.needFV) {
                    info.el.parentElement?.parentElement?.style.removeProperty("border");
                    info.el.parentElement?.parentElement?.style.removeProperty("background");                     
                }
                else {
                    info.el.parentElement?.parentElement?.style.setProperty("border", "none");
                    info.el.parentElement?.parentElement?.style.setProperty("background", "none");
                    if(info.event.extendedProps.type.includes("Need") && 
                    info.event.extendedProps.dailyEvents>1 && 
                    info.event.extendedProps.schedStatus == 'Posted' && info.event.extendedProps.types.includes("Need"))
                    {
                     info.el.parentElement?.style.setProperty("max-height", "22px");
                     info.el?.style.setProperty("border", "none");
                    }
                }
            },
            eventWillUnmount: function (info:any){
                if(info.el?.parentElement?.nextElementSibling?.className == 'fc-daygrid-day-bottom' && info.el?.parentElement?.previousElementSibling?.className != 'fc-daygrid-event-harness'){
                    info.el.parentElement?.parentElement?.style.removeProperty("border");
                    info.el.parentElement?.parentElement?.style.removeProperty("background");
                }
            },
            eventContent: function (arg: any) {
                let italicEl = document.createElement("div");
                let eventChanged = arg.event.extendedProps.changed; //if change flag is true
                let dailyEvents = arg.event.extendedProps.dailyEvents;
                let child = document.createElement("div");
                italicEl.appendChild(child);
                if (arg.event.extendedProps.type.includes("Need")) {
                     if (arg.event.extendedProps.needFV) {
                        italicEl.classList.add("main-openneed");
                        child.classList.add("openNeed-title");
                        child.innerHTML = arg.event.title;
                        //append description
                        let descriptionChild = document.createElement("div");
                        descriptionChild.innerHTML = "<span>+</span>";
                        descriptionChild.classList.add("openNeed-plusSign");
                        italicEl.appendChild(descriptionChild);
                        //append PremiumLaborShift Icon
                        var ispremiumLaborLevelIconVisible = arg.event.extendedProps.premiumLaborLevel;
                        let premiumLaborLevelIcon = document.createElement("i");
                        premiumLaborLevelIcon.innerHTML = "hourglass_empty";
                        premiumLaborLevelIcon.classList.add("material-icons");
                        premiumLaborLevelIcon.classList.add("hourGlsEmpty");
                        if(ispremiumLaborLevelIconVisible){
                            italicEl.appendChild(premiumLaborLevelIcon);
                        }
                        if (eventChanged) {
                            //append left visual if change flag is true
                            let leftChild = document.createElement("div");
                            leftChild.innerHTML = "NEW";
                            leftChild.classList.add("openNeed-new");
                            italicEl.appendChild(leftChild);
                            //append logo
                            let logoChild = document.createElement("div");
                            logoChild.innerHTML = "<span>circle</span>";
                            logoChild.classList.add("logo-need-bottom");
                            italicEl.appendChild(logoChild);
                            let logoChild1 = document.createElement("div");
                            logoChild1.innerHTML = "<span>circle</span>";
                            logoChild1.classList.add("logo-need-top");
                            italicEl.appendChild(logoChild1);
                            if (dailyEvents > 1) {
                                italicEl.removeChild(leftChild);
                                italicEl.removeChild(logoChild);
                                logoChild1.classList.remove("logo-need-top");
                                logoChild1.classList.add("logo-need-top-fourweek");
                            }
                        }
                        if (dailyEvents > 1) {
                            italicEl.removeChild(descriptionChild);
                            if(ispremiumLaborLevelIconVisible){
                                italicEl.removeChild(premiumLaborLevelIcon);
                            }
                            child.classList.remove("openNeed-title");
                            if(arg.event.extendedProps.schedStatus == 'Posted' && arg.event.extendedProps.types.includes("Need"))
                            child.classList.add("openNeed-title-withschedule");
                            else
                             child.classList.add("openNeed-title-fourweek");
                        }

                        if (arg.event.extendedProps.filteredEventCount == 1 || arg.event.extendedProps.isAllFilterChecked == false) {
                            italicEl.appendChild(descriptionChild);
                            if(ispremiumLaborLevelIconVisible){
                                italicEl.appendChild(premiumLaborLevelIcon);
                            }
                            child.classList.add("openNeed-title");
                            child.classList.remove("openNeed-title-fourweek");
                        }
                    }
                    else if (!arg.event.extendedProps.needFV && dailyEvents <= 1) {
                        italicEl.classList.add("open-daycell");
                    }
                    else if(!arg.event.extendedProps.needFV && dailyEvents > 1){
                        arg.event.setProp("display", "none");
                    }
                }
                else if (arg.event.extendedProps.type.includes("Pending")) {
                    let descriptionCoid = document.createElement("div");
                    descriptionCoid.innerHTML = arg.event.extendedProps.descriptionCoid;
                    descriptionCoid.classList.add("event-descriptionCoid");
                    descriptionCoid.classList.add("hideFacilityDeptNumber");
                    let facilityDeptNameText = document.createElement("div");
                    facilityDeptNameText.innerHTML = arg.event.extendedProps.facilityDeptName;
                    facilityDeptNameText.classList.add("event-descriptionCoid");
                    facilityDeptNameText.classList.add("calDetailsPrint");
                    italicEl.appendChild(descriptionCoid);
                    italicEl.appendChild(facilityDeptNameText);
                    tippy(descriptionCoid, {
                        content: arg.event.extendedProps.facilityDeptName,
                        placement: 'bottom',
                    });
                    let descriptionChild = document.createElement("div");
                    descriptionChild.innerHTML = arg.event.extendedProps.description;
                    descriptionChild.classList.add("event-description");
                    descriptionChild.classList.add("mTop10");
                    italicEl.appendChild(descriptionChild);
                    italicEl.classList.add("main-reserve");
                    child.classList.add("reserveNeed-title");
                    child.innerHTML = arg.event.extendedProps.isOvertime ? '<i class="material-icons overtimeIndicatorDivSingleEvents">error_outline</i> ' + arg.event.title : arg.event.title;
                    const childElementTippy = tippy(child);
                    childElementTippy.disable();
                    if (dailyEvents > 1) {
                        child.classList.remove("reserveNeed-title");
                        child.classList.add("reserveNeed-title-fourweek");
                        child.innerHTML = arg.event.extendedProps.isOvertime ? '<i class="material-icons overtimeIndicatorDivMultipleEvents">error_outline</i> ' + arg.event.title : arg.event.title;
                        italicEl.removeChild(descriptionCoid);
                        italicEl.removeChild(facilityDeptNameText);
                        italicEl.removeChild(descriptionChild);
                        childElementTippy.setProps({ content: "<div style='text-align: center'>"+arg.event.extendedProps.facilityDeptName+"<br>" + arg.event.extendedProps.description+"</div>"});
                        childElementTippy.setProps({ placement: 'bottom'});
                        childElementTippy.setProps({ allowHTML: true});
                        childElementTippy.enable();
                    }

                    if (arg.event.extendedProps.filteredEventCount == 1 || arg.event.extendedProps.isAllFilterChecked == false) {
                        child.classList.add("reserveNeed-title");
                        child.classList.remove("reserveNeed-title-fourweek");
                        child.innerHTML = arg.event.extendedProps.isOvertime ? '<i class="material-icons overtimeIndicatorDivSingleEvents">error_outline</i> ' + arg.event.title : arg.event.title;
                        italicEl.appendChild(descriptionCoid);
                        italicEl.appendChild(facilityDeptNameText);
                        italicEl.appendChild(descriptionChild);
                        childElementTippy.disable();
                    }
                } else if (arg.event.extendedProps.type.includes("Request") || (arg.event.extendedProps.type == "Assignment" && arg.event.extendedProps.status == "Pending")) {
                    let descriptionCoid = document.createElement("div");
                    descriptionCoid.innerHTML = arg.event.extendedProps.descriptionCoid;
                    descriptionCoid.classList.add("event-descriptionCoid");
                    descriptionCoid.classList.add("hideFacilityDeptNumber");
                    let facilityDeptNameText = document.createElement("div");
                    facilityDeptNameText.innerHTML = arg.event.extendedProps.facilityDeptName;
                    facilityDeptNameText.classList.add("event-descriptionCoid");
                    facilityDeptNameText.classList.add("calDetailsPrint");
                    italicEl.appendChild(descriptionCoid);
                    italicEl.appendChild(facilityDeptNameText);
                    tippy(descriptionCoid, {
                        content: arg.event.extendedProps.facilityDeptName,
                        placement: 'bottom',
                    });
                    let descriptionChild = document.createElement("div");
                    descriptionChild.innerHTML = arg.event.extendedProps.description;
                    descriptionChild.classList.add("event-description");
                    descriptionChild.classList.add("mTop10");
                    italicEl.appendChild(descriptionChild);
                    italicEl.classList.add("main-reserve");
                    child.classList.add("requestNeed-title");
                    child.innerHTML = arg.event.extendedProps.isOvertime ? '<i class="material-icons overtimeIndicatorDivSingleEvents">error_outline</i> ' + arg.event.title : arg.event.title;
                    const childElementTippy = tippy(child);
                    childElementTippy.disable();
                    if (dailyEvents > 1) {
                        child.classList.remove("requestNeed-title");
                        child.classList.add("requestNeed-title-fourweek");
                        child.innerHTML = arg.event.extendedProps.isOvertime ? '<i class="material-icons overtimeIndicatorDivMultipleEvents">error_outline</i> ' + arg.event.title : arg.event.title;
                        italicEl.removeChild(descriptionCoid);
                        italicEl.removeChild(facilityDeptNameText);
                        italicEl.removeChild(descriptionChild);
                        childElementTippy.setProps({ content: "<div style='text-align: center'>"+arg.event.extendedProps.facilityDeptName+"<br>" + arg.event.extendedProps.description+"</div>"});
                        childElementTippy.setProps({ placement: 'bottom'});
                        childElementTippy.setProps({ allowHTML: true});
                        childElementTippy.enable();
                    }

                    if (arg.event.extendedProps.filteredEventCount == 1 || arg.event.extendedProps.isAllFilterChecked == false) {
                        child.classList.add("requestNeed-title");
                        child.classList.remove("requestNeed-title-fourweek");
                        child.innerHTML = arg.event.extendedProps.isOvertime ? '<i class="material-icons overtimeIndicatorDivSingleEvents">error_outline</i> ' + arg.event.title : arg.event.title;
                        italicEl.appendChild(descriptionCoid);
                        italicEl.appendChild(facilityDeptNameText);
                        italicEl.appendChild(descriptionChild);
                        childElementTippy.disable();
                    }
                } else if (arg.event.extendedProps.type.includes("Unavailability")) {
                    italicEl.classList.add("main-unavail");
                    child.classList.add("unavail-title");
                    child.innerHTML = arg.event.title;
                    if (dailyEvents > 1) {
                        child.classList.remove("unavail-title");
                        child.classList.add("unavail-title-fourweek");
                    }

                    if (arg.event.extendedProps.filteredEventCount == 1 || arg.event.extendedProps.isAllFilterChecked == false) {
                        child.classList.remove("unavail-title-fourweek");
                        child.classList.add("unavail-title");
                    }
                } else if (arg.event.extendedProps.type.includes("Trade")) {
                    let descriptionCoid = document.createElement("div");
                    descriptionCoid.innerHTML = arg.event.extendedProps.descriptionCoid;
                    descriptionCoid.classList.add("event-descriptionCoid");
                    descriptionCoid.classList.add("hideFacilityDeptNumber");
                    let facilityDeptNameText = document.createElement("div");
                    facilityDeptNameText.innerHTML = arg.event.extendedProps.facilityDeptName;
                    facilityDeptNameText.classList.add("event-descriptionCoid");
                    facilityDeptNameText.classList.add("calDetailsPrint");
                    italicEl.appendChild(descriptionCoid);
                    italicEl.appendChild(facilityDeptNameText);
                    tippy(descriptionCoid, {
                        content: arg.event.extendedProps.facilityDeptName,
                        placement: 'bottom',
                    });
                    let descriptionChild = document.createElement("div");
                    descriptionChild.classList.add("trade-description");
                    descriptionChild.classList.add("mTop10");
                    descriptionChild.innerHTML = arg.event.extendedProps.description;
                    italicEl.appendChild(descriptionChild);
                    italicEl.classList.add("main-trade");
                    child.classList.add("trade-title");
                    child.innerHTML = arg.event.title;
                    let leftChild = document.createElement("div");
                    leftChild.innerHTML = "TRADE";
                    leftChild.classList.add("trade-visual");
                    italicEl.appendChild(leftChild);
                    let logoChild = document.createElement("div");
                    logoChild.innerHTML = "<span>swap_horiz</span>";
                    logoChild.classList.add("logo-trade-bottom");
                    italicEl.appendChild(logoChild);
                    let logoChild1 = document.createElement("div");
                    logoChild1.innerHTML = "<span>swap_horiz</span>";
                    logoChild1.classList.add("logo-trade-top");
                    italicEl.appendChild(logoChild1);
                    const childElementTippy = tippy(child);
                    childElementTippy.disable();
                    if (dailyEvents > 1) {
                        italicEl.removeChild(leftChild);
                        italicEl.removeChild(logoChild);
                        italicEl.removeChild(descriptionCoid);
                        italicEl.removeChild(facilityDeptNameText);
                        italicEl.removeChild(descriptionChild);
                        child.classList.remove("trade-title");
                        child.classList.add("trade-title-fourweek");
                        logoChild1.classList.remove("logo-trade-top");
                        logoChild1.classList.add("logo-trade-top-fourweek");

                        childElementTippy.setProps({ content: "<div style='text-align: center'>"+arg.event.extendedProps.facilityDeptName+"<br>" + arg.event.extendedProps.description+"</div>"});
                        childElementTippy.setProps({ placement: 'bottom'});
                        childElementTippy.setProps({ allowHTML: true});
                        childElementTippy.enable();
                    }

                    if (arg.event.extendedProps.filteredEventCount == 1 || arg.event.extendedProps.isAllFilterChecked == false) {
                        italicEl.appendChild(leftChild);
                        italicEl.appendChild(logoChild);
                        italicEl.appendChild(descriptionCoid);
                        italicEl.appendChild(facilityDeptNameText);
                        italicEl.appendChild(descriptionChild);
                        child.classList.add("trade-title");
                        child.classList.remove("trade-title-fourweek");
                        logoChild1.classList.add("logo-trade-top");
                        logoChild1.classList.remove("logo-trade-top-fourweek");
                        childElementTippy.disable();
                    }
                } else {
                    let descriptionCoid = document.createElement("div");
                    descriptionCoid.innerHTML = arg.event.extendedProps.descriptionCoid;
                    descriptionCoid.classList.add("event-descriptionCoid");
                    descriptionCoid.classList.add("hideFacilityDeptNumber");
                    let facilityDeptNameText = document.createElement("div");
                    facilityDeptNameText.innerHTML = arg.event.extendedProps.facilityDeptName;
                    facilityDeptNameText.classList.add("event-descriptionCoid");
                    facilityDeptNameText.classList.add("calDetailsPrint");
                    italicEl.appendChild(descriptionCoid);
                    italicEl.appendChild(facilityDeptNameText);
                    tippy(descriptionCoid, {
                        content: arg.event.extendedProps.facilityDeptName,
                        placement: 'bottom',
                    });
                    let descriptionChild = document.createElement("div");
                    descriptionChild.innerHTML = arg.event.extendedProps.description;
                    descriptionChild.classList.add("event-description");
                    descriptionChild.classList.add("mTop10");
                    italicEl.appendChild(descriptionChild);
                    //Remove title in case of needs available
                     if (dailyEvents > 1 && arg.event.extendedProps.schedStatus =='Posted' && arg.event.extendedProps.types.includes("Need")) {
                        child.innerHTML = arg.event.extendedProps.isOvertime ? '<i class="material-icons overtimeIndicatorDivSingleEvents">error_outline</i> ':'';
                     }
                    else {
                         child.innerHTML = arg.event.extendedProps.isOvertime ? '<i class="material-icons overtimeIndicatorDivSingleEvents">error_outline</i> ' + arg.event.title : arg.event.title;
                         child.classList.add("event-title");
                        }
                    italicEl.classList.add("main-event");                    
                    const childElementTippy = tippy(child);
                    childElementTippy.disable();
                    if (eventChanged) {
                        let leftChild = document.createElement("div");
                        leftChild.innerHTML = "UPDATED";
                        leftChild.classList.add("event-updated");
                        italicEl.appendChild(leftChild);
                        let logoChild = document.createElement("div");
                        logoChild.innerHTML = "<span>circle</span>";
                        logoChild.classList.add("logo-updated-bottom");
                        italicEl.appendChild(logoChild);
                        let logoChild1 = document.createElement("div");
                        logoChild1.innerHTML = "<span>circle</span>";
                        logoChild1.classList.add("logo-updated-top");
                        italicEl.appendChild(logoChild1);
                        if (dailyEvents > 1) {
                            italicEl.removeChild(leftChild);
                            italicEl.removeChild(logoChild);
                            logoChild1.classList.remove("logo-updated-top");
                            logoChild1.classList.add("logo-updated-top-fourweek");
                        }
                    }
                   if (dailyEvents > 1 && arg.event.extendedProps.schedStatus =='Posted' && !arg.event.extendedProps.types.includes("Need") ) {
                        italicEl.removeChild(descriptionCoid);
                        italicEl.removeChild(descriptionChild);
                        italicEl.removeChild(facilityDeptNameText);
                        // child.classList.remove("event-title");
                        child.classList.add("event-title-fourweek");
                        child.innerHTML = arg.event.extendedProps.isOvertime ? '<i class="material-icons overtimeIndicatorDivMultipleEvents">error_outline</i> ' + arg.event.title : arg.event.title;
                        childElementTippy.setProps({ content: "<div style='text-align: center'>"+arg.event.extendedProps.facilityDeptName+"<br>" + arg.event.extendedProps.description+"</div>"});
                        childElementTippy.setProps({ placement: 'bottom'});
                        childElementTippy.setProps({ allowHTML: true});
                        childElementTippy.enable();
                   }
                    if (dailyEvents > 1 && arg.event.extendedProps.schedStatus !='Posted') {
                        italicEl.removeChild(descriptionCoid);
                        italicEl.removeChild(descriptionChild);
                        italicEl.removeChild(facilityDeptNameText);
                        child.classList.remove("event-title");
                        child.classList.add("event-title-fourweek");
                        child.innerHTML = arg.event.extendedProps.isOvertime ? '<i class="material-icons overtimeIndicatorDivMultipleEvents">error_outline</i> ' + arg.event.title : arg.event.title;
                        childElementTippy.setProps({ content: "<div style='text-align: center'>"+arg.event.extendedProps.facilityDeptName+"<br>" + arg.event.extendedProps.description+"</div>"});
                        childElementTippy.setProps({ placement: 'bottom'});
                        childElementTippy.setProps({ allowHTML: true});
                        childElementTippy.enable();
                    }
                   
                    if (arg.event.extendedProps.filteredEventCount == 1 || arg.event.extendedProps.isAllFilterChecked == false) {
                        child.classList.add("event-title");
                        child.classList.remove("event-title-fourweek");
                        child.innerHTML = arg.event.extendedProps.isOvertime ? '<i class="material-icons overtimeIndicatorDivSingleEvents">error_outline</i> ' + arg.event.title : arg.event.title;
                        italicEl.appendChild(descriptionCoid);
                        italicEl.appendChild(descriptionChild);
                        italicEl.appendChild(facilityDeptNameText);
                        childElementTippy.disable();
                    }
                }
                let arrayOfDomNodes = [italicEl];
                return {
                    domNodes: arrayOfDomNodes,
                };
            },
        };
        
        public userSchedules!: any;        
        private isLoading!: Boolean;
        public events: any = [];
        private sharedToggle: boolean = false;
        public counter: any = 0;

        //constructor() {
           // super();
            //get singal r notification by using event bus
            // bus.$on("profileLoaded", (msg:any) => {
            //     this.getSchedules(true);
            
            //     this.showWelcomeModal();
            // });

            // bus.$on("assignmentchanged", (msg:any) => {
            //     this.getSchedules(false);
            // });

            // bus.$on("loadShiftTradeEvent", (actionableByDate:any, shiftTradeOfferId:any) => {
            //     this.raiseShiftTradeViewEvent(actionableByDate, shiftTradeOfferId);
            // });

            // bus.$on("ShiftTradeActionEvent", (actionableByDate:any, action:any, shiftTradeOfferId:any, notificationId:any) => {
            //     let eventDate = new Date(actionableByDate);
            //     this.raiseShiftTradeActionEvent(eventDate, action, shiftTradeOfferId, notificationId);
            // });
        //}

        async created() { 
            await this.$store.dispatch("profile/getProfileDetails", "");           
                if(this.profileData.username !== undefined)
                {
                    this.profile =  this.profileData;
                    if (localStorage.getItem("visitedDepartmentView") != null) {
                        localStorage.removeItem("visitedDepartmentView");
                        await this.getSchedules(false);
                    }
                    else {
                        await this.getSchedules(true);
                    }
                }           
        }

        mounted() {
             // create a local variable of this
             this.currentMonthCalendarApi = this.$refs.fullCalendarCurrentMonth.getApi();
                 
            this.updateUserName();
        }

       

        updated() {
            
            if(this.isAdmin && !this.isImpersonating && !this.profileData.isStaffHasAdminAccount)
            {
                this.$router.push('/admin')
            }
            this.updateUserName();

            if(!this.isCalenderViewLoaded && this.appInsightEventData.Username != undefined){
                //User logged in Event
                var isUserLoggedIn = (localStorage.getItem("isUserLoggedIn") == null ? false : localStorage.getItem("isUserLoggedIn")=='true');
                
                if(isUserLoggedIn){
                    useAppInsights().trackEvent({name:'UserLogin', properties: 
                        JSON.parse(JSON.stringify(this.appInsightEventData))
                    });
                    localStorage.removeItem("isUserLoggedIn");
                }

                //Calendar Load event
                this.isCalenderViewLoaded = true;
                useAppInsights().trackEvent({name:'ViewCalendar', properties: 
                   JSON.parse(JSON.stringify(this.appInsightEventData))
                });
            }
        }

        closeSharedModal() {
            this.sharedToggle = false;
            if (
                this.sharedRequest.assignmentDetail ||
                this.sharedRequest.selfSchedule ||
                this.sharedRequest.availability ||
                this.sharedRequest.tradeShift ||
                this.sharedRequest.request ||
                this.sharedRequest.type === 3
            ) {
                this.getSchedules(false);
            }
            setTimeout(() => this.currentMonthCalendarApi.updateSize(), 300);
            window.scrollTo(0, 0);
        }

        refreshCalender() {
            this.getSchedules(false);
        }

        showSMPModal(successFlag: boolean = true, msgValue: string = '') {
            if (msgValue != '') {
                this.msgValue = successFlag ? msgValue : "Failed to save your changes";
            }
            else {
                this.msgValue = successFlag ? "Your changes have been saved." : "Failed to save your changes";
            }
            this.classFlag = successFlag ? "success" : "error";
            this.isSMPModalVisible = true;
        }

        closeSMPModal() {
            this.isSMPModalVisible = false;
        }

        showNotificationSuccessModal(options:any) {
            if (options.msgValue != '') {
                this.successMsgValue = options.msgValue;
            }
            else {
                this.successMsgValue = options.successFlag ? "Your changes have been saved." : "Failed to save your changes";
            }
            this.successClassFlag = options.successFlag ? "success" : "error";
            this.isNotificationSuccessModalVisible = true;
        }

        closeNotificationSuccessModal() {
            this.isNotificationSuccessModalVisible = false;
        }

        showNotificationErrorModal(options:any) {
            if (options.msgValue != '') {
                this.errorMsgValue = options.msgValue;
            }
            else {
                this.errorMsgValue = options.successFlag ? "Your changes have been saved." : "Failed to save your changes";
            }
            this.errorClassFlag = options.successFlag ? "success" : "error";
            this.isNotificationErrorModalVisible = true;
        }

        closeNotificationErrorModal() {
            this.isNotificationErrorModalVisible = false;
        }

        updateUserName() {
            if (this.profileData != null) {
                this.firstName = this.profileData.first;
                this.lastName = this.profileData.last;
            } else {
                this.firstName = this.oidcUser.firstName;
                this.lastName = this.oidcUser.firstName;
            }
            if (this.firstName != undefined && this.lastName != undefined) {
                this.nameInitials = this.firstName.charAt(0).toUpperCase() + this.lastName.charAt(0).toUpperCase();
            }
        }

        setCalendarEvents(index: number) {
            this.events = [];
            if (this.viewFlag == 'CalView') {
                this.currentMonthCalendarApi.removeAllEvents();
            }
            this.scheduleStatus = this.userSchedules[index].status;
            this.isTierOpen = this.userSchedules[index].tierOpen;
            this.currentDate =
                moment(this.userSchedules[index].startDate).format("ll") +
                " - " +
                moment(this.userSchedules[index].endDate).format("ll");
            let count = index + 1;

           
            while (count >= index - 1) {
                if (this.userSchedules[count] != undefined) {
                     this.userSchedules[count].events.forEach((event: Event) => {
                        let cellTitle: string;
                        event.assignmentId =
                            event.type == "Need" || event.type == "Pending"
                                ? this.userSchedules[count].id
                                : "";
                        this.events.push(event);

                        cellTitle = this.getEventCellTitle(event, this.userSchedules[count].status, this.userSchedules[count].events);
                        if (this.viewFlag == 'CalView') {
                            this.currentMonthCalendarApi.addEvent({
                                id: event.id,
                                title: cellTitle,
                                start: event.date,
                                end: event.date,
                                type: event.type,
                                changed: event.changed,
                                status: event.status,
                                description: event.description,
                                descriptionCoid: event.status.toUpperCase() == "PENDING" || event.status.toUpperCase() == "SCHEDULED" || event.status.toUpperCase() == "RESERVED" ? (event.facilityCoId + ' - ' + event.departmentCode)
                                    : (this.userSchedules[count].coid + ' - ' + this.userSchedules[count].departmentCode),
                                facilityDeptName: event.status.toUpperCase() == "PENDING" || event.status.toUpperCase() == "SCHEDULED" || event.status.toUpperCase() == "RESERVED" ? (event.facilityName + ' - ' + event.departmentName)
                                    : (this.userSchedules[count].facilityName + ' - ' + this.userSchedules[count].departmentName),
                                dailyEvents: event.dailyEvents,
                                needFV: this.needFV,
                                filteredEventCount: 0,
                                isAllFilterChecked: true,
                                isSelfScheduled: event.isSelfScheduled,
                                isOvertime: event.isOvertime,
                                premiumLaborLevel: event.premiumLaborLevel,
                                schedStatus: this.scheduleStatus,
                                types: event.dailyEventsType
                            });
                        }
                    });
                }
                count -= 1;
            }           
            if (this.viewFlag == 'CalView') {
                if (this.leftNavBar) {
                    if (!this.$refs.calendarfilter.checkSchedEventsOption) {
                        this.onCheckSchedEvents(
                            this.$refs.calendarfilter.checkSchedEventsOption
                        );
                    }
                    if (!this.$refs.calendarfilter.checkPendRequestsOption) {
                        this.onCheckPendRequestsOption(
                            this.$refs.calendarfilter.checkPendRequestsOption
                        );
                    }
                    if (!this.$refs.calendarfilter.checkDepartNeedsOption) {
                        this.onCheckDepartNeedsOption(
                            this.$refs.calendarfilter.checkDepartNeedsOption
                        );
                    }
                    if (!this.$refs.calendarfilter.checkTradeShiftsOption) {
                        this.onCheckTradeShiftsOption(
                            this.$refs.calendarfilter.checkTradeShiftsOption
                        );
                    }
                    if (!this.$refs.calendarfilter.checkUnavailabilityOption) {
                        this.onCheckUnavailabilityOption(
                            this.$refs.calendarfilter.checkUnavailabilityOption
                        );
                    }
                }
            }   
        }

        getEventCellTitle(event:any, status:any, events:any) {
            var cellTitle = '';
            if (event.type == "Need") {
                cellTitle = event.status.toUpperCase();
            } else if (event.type == "Pending") {
                cellTitle = "RESERVED";
            } else if (event.type == "Assignment" && event.status == "Pending" && status == "Plan Sheet" && event.isSelfScheduled) {
                cellTitle = "PENDING";
            } else if (event.type == "Request" || (event.type == "Assignment" && event.status == "Pending")) {
                cellTitle = "REQUESTED";
            } else if (event.type == "Unavailability") {
                cellTitle = "UNAVAILABLE";
            } else if (event.type == "Trade") {
                cellTitle = event.status.toUpperCase();
            }//event.type = "Assignment"
            else {
                cellTitle = "SCHEDULED";
            }
            return cellTitle;
        }

        toggleFilterPanel() {
            this.leftNavBar = !this.leftNavBar;
        }

        onCheckSchedEvents(check: boolean) {
            let events = this.currentMonthCalendarApi.getEvents();
            let filteredDatesRemoved: any = [];
            let filteredDatesAdded: any = [];
            let isAllFilterStatusUpdated: boolean = false;
            if (check) {
                events.forEach((event: any) => {
                    if (event.extendedProps.type == "Assignment" && event.extendedProps.status != "Pending") {
                        event.setProp("display", "auto");
                        filteredDatesAdded.push(event.start);
                        if(this.isAllFilterChecked == false && event.extendedProps.dailyEvents > 1){
                           event.setExtendedProp('isAllFilterChecked', false);
                           isAllFilterStatusUpdated = true;
                        }
                    }
                });
                if(isAllFilterStatusUpdated){
                    this.isAllFilterChecked = true;
                }
            } else if (!check) {
                events.forEach((event: any) => {
                    if (event.extendedProps.type == "Assignment" && event.extendedProps.status != "Pending") {
                        event.setProp("display", "none");
                        filteredDatesRemoved.push(event.start);
                    }
                });
            }

            if(filteredDatesRemoved.length > 0){
                filteredDatesRemoved.forEach((removedDate: any) => {
                    let startDate = moment(removedDate).format("YYYY-MM-DD");
                    events.forEach((event: any) => {
                        let eventDate = moment(event.start).format("YYYY-MM-DD");
                        if ((event.extendedProps.type != "Assignment" || (event.extendedProps.type == "Assignment" && event.extendedProps.status == "Pending")) && startDate == eventDate) {
                            let count = event.extendedProps.filteredEventCount == 0 ? event.extendedProps.dailyEvents - 1 : event.extendedProps.filteredEventCount - 1;
                            event.setExtendedProp('filteredEventCount', count);
                            event.setExtendedProp('isAllFilterChecked', true);
                        }
                    });
                });
            }

            if(filteredDatesAdded.length > 0){
                filteredDatesAdded.forEach((addedDate: any) => {
                    let startDate = moment(addedDate).format("YYYY-MM-DD");
                    events.forEach((event: any) => {
                        let eventDate = moment(event.start).format("YYYY-MM-DD");
                        if ((event.extendedProps.type != "Assignment" || (event.extendedProps.type == "Assignment" && event.extendedProps.status == "Pending")) && startDate == eventDate) {
                            let count = event.extendedProps.filteredEventCount == 0 ? event.extendedProps.dailyEvents : event.extendedProps.filteredEventCount + 1;
                            event.setExtendedProp('filteredEventCount', count);
                            event.setExtendedProp('isAllFilterChecked', true);
                        }
                    });
                });
            }
        }

        onCheckPendRequestsOption(check: boolean) {
            let events = this.currentMonthCalendarApi.getEvents();
            let filteredDatesRemoved: any = [];
            let filteredDatesAdded: any = [];
            let isAllFilterStatusUpdated: boolean = false;
            if (check) {
                events.forEach((event: any) => {
                    if (
                        event.extendedProps.type == "Pending" ||
                        event.extendedProps.type == "Request" || (event.extendedProps.type == "Assignment" && event.extendedProps.status == "Pending")
                    ) {
                        event.setProp("display", "auto");
                        filteredDatesAdded.push(event.start);
                        if(this.isAllFilterChecked == false && event.extendedProps.dailyEvents > 1){
                           event.setExtendedProp('isAllFilterChecked', false);
                           isAllFilterStatusUpdated = true;
                        }
                    }
                });
                if(isAllFilterStatusUpdated){
                    this.isAllFilterChecked = true;
                }
            } else if (!check) {
                events.forEach((event: any) => {
                    if (
                        event.extendedProps.type == "Pending" ||
                        event.extendedProps.type == "Request" || (event.extendedProps.type == "Assignment" && event.extendedProps.status == "Pending")
                    ) {
                        event.setProp("display", "none");
                        filteredDatesRemoved.push(event.start);
                    }
                });
            }

            if(filteredDatesRemoved.length > 0){
                filteredDatesRemoved.forEach((removedDate: any) => {
                    let startDate = moment(removedDate).format("YYYY-MM-DD");
                    events.forEach((event: any) => {
                        let eventDate = moment(event.start).format("YYYY-MM-DD");
                        if ((event.extendedProps.type != "Pending" ||
                        event.extendedProps.type != "Request" || (event.extendedProps.type != "Assignment" && event.extendedProps.status != "Pending")) && startDate == eventDate) {
                            let count = event.extendedProps.filteredEventCount == 0 ? event.extendedProps.dailyEvents - 1 : event.extendedProps.filteredEventCount - 1;
                            event.setExtendedProp('filteredEventCount', count);
                            event.setExtendedProp('isAllFilterChecked', true);
                        }
                    });
                });
            }

            if(filteredDatesAdded.length > 0){
                filteredDatesAdded.forEach((addedDate: any) => {
                    let startDate = moment(addedDate).format("YYYY-MM-DD");
                    events.forEach((event: any) => {
                        let eventDate = moment(event.start).format("YYYY-MM-DD");
                        if ((event.extendedProps.type != "Pending" ||
                        event.extendedProps.type != "Request" || (event.extendedProps.type != "Assignment" && event.extendedProps.status != "Pending")) && startDate == eventDate) {
                            let count = event.extendedProps.filteredEventCount == 0 ? event.extendedProps.dailyEvents : event.extendedProps.filteredEventCount + 1;
                            event.setExtendedProp('filteredEventCount', count);
                            event.setExtendedProp('isAllFilterChecked', true);
                        }
                    });
                });
            }
        }

        onCheckDepartNeedsOption(check: boolean) {
            let events = this.currentMonthCalendarApi.getEvents();
            let filteredDatesRemoved: any = [];
            let filteredDatesAdded: any = [];
            let isAllFilterStatusUpdated: boolean = false;
            if (check) {
                events.forEach((event: any) => {
                    if (event.extendedProps.type == "Need") {
                        event.setExtendedProp('needFV', true);
                        this.isDeptNeedCheck = true;
                        event.setProp("display", "auto");
                        filteredDatesAdded.push(event.start);
                        if(this.isAllFilterChecked == false && event.extendedProps.dailyEvents > 1){
                           event.setExtendedProp('isAllFilterChecked', false);
                           isAllFilterStatusUpdated = true;
                        }
                    }
                });
                if(isAllFilterStatusUpdated){
                    this.isAllFilterChecked = true;
                }
            } else if (!check) {
                events.forEach((event: any) => {
                    if (event.extendedProps.type == "Need") {
                        event.setExtendedProp('needFV', false);
                        this.isDeptNeedCheck = false;
                        filteredDatesRemoved.push(event.start);
                    }
                });
            }

            if(filteredDatesRemoved.length > 0){
                filteredDatesRemoved.forEach((removedDate: any) => {
                    let startDate = moment(removedDate).format("YYYY-MM-DD");
                    events.forEach((event: any) => {
                        let eventDate = moment(event.start).format("YYYY-MM-DD");
                        if (event.extendedProps.type != "Need" && startDate == eventDate) {
                            let count = event.extendedProps.filteredEventCount == 0 ? event.extendedProps.dailyEvents - 1 : event.extendedProps.filteredEventCount - 1;
                            event.setExtendedProp('filteredEventCount', count);
                            event.setExtendedProp('isAllFilterChecked', true);
                        }
                    });
                });
            }

            if(filteredDatesAdded.length > 0){
                filteredDatesAdded.forEach((addedDate: any) => {
                    let startDate = moment(addedDate).format("YYYY-MM-DD");
                    events.forEach((event: any) => {
                        let eventDate = moment(event.start).format("YYYY-MM-DD");
                        if (event.extendedProps.type != "Need" && startDate == eventDate) {
                            let count = event.extendedProps.filteredEventCount == 0 ? event.extendedProps.dailyEvents : event.extendedProps.filteredEventCount + 1;
                            event.setExtendedProp('filteredEventCount', count);
                            event.setExtendedProp('isAllFilterChecked', true);
                        }
                    });
                });
            }
        }

        onCheckTradeShiftsOption(check: boolean) {
            let events = this.currentMonthCalendarApi.getEvents();
            let filteredDatesRemoved: any = [];
            let filteredDatesAdded: any = [];
            let isAllFilterStatusUpdated: boolean = false;
            if (check) {
                events.forEach((event: any) => {
                    if (event.extendedProps.type == "Trade") {
                        event.setProp("display", "auto");
                        filteredDatesAdded.push(event.start);
                        if(this.isAllFilterChecked == false && event.extendedProps.dailyEvents > 1){
                           event.setExtendedProp('isAllFilterChecked', false);
                           isAllFilterStatusUpdated = true;
                        }
                    }
                });
                if(isAllFilterStatusUpdated){
                    this.isAllFilterChecked = true;
                }
            } else if (!check) {
                events.forEach((event: any) => {
                    if (event.extendedProps.type == "Trade") {
                        event.setProp("display", "none");
                        filteredDatesRemoved.push(event.start);
                    }
                });
            }

            if(filteredDatesRemoved.length > 0){
                filteredDatesRemoved.forEach((removedDate: any) => {
                    let startDate = moment(removedDate).format("YYYY-MM-DD");
                    events.forEach((event: any) => {
                        let eventDate = moment(event.start).format("YYYY-MM-DD");
                        if (event.extendedProps.type != "Trade" && startDate == eventDate) {
                            let count = event.extendedProps.filteredEventCount == 0 ? event.extendedProps.dailyEvents - 1 : event.extendedProps.filteredEventCount - 1;
                            event.setExtendedProp('filteredEventCount', count);
                            event.setExtendedProp('isAllFilterChecked', true);
                        }
                    });
                });
            }

            if(filteredDatesAdded.length > 0){
                filteredDatesAdded.forEach((addedDate: any) => {
                    let startDate = moment(addedDate).format("YYYY-MM-DD");
                    events.forEach((event: any) => {
                        let eventDate = moment(event.start).format("YYYY-MM-DD");
                        if (event.extendedProps.type != "Trade" && startDate == eventDate) {
                            let count = event.extendedProps.filteredEventCount == 0 ? event.extendedProps.dailyEvents : event.extendedProps.filteredEventCount + 1;
                            event.setExtendedProp('filteredEventCount', count);
                            event.setExtendedProp('isAllFilterChecked', true);
                        }
                    });
                });
            }
        }

        onCheckAllOption(check: boolean) {
            let events = this.currentMonthCalendarApi.getEvents();
            if (check) {
                events.forEach((event: any) => {
                    if (
                        event.extendedProps.type == "Assignment" ||
                        event.extendedProps.type == "Pending" ||
                        event.extendedProps.type == "Trade" ||
                        event.extendedProps.type == "Unavailability" ||
                        event.extendedProps.type == "Request" ||
                        (event.extendedProps.type == "Assignment" && event.extendedProps.status == "Pending")
                    ) {
                        event.setProp("display", "auto");
                    }
                    if (event.extendedProps.type == "Need") {
                        event.setExtendedProp('needFV', true);
                        event.setProp("display", "auto");
                    }
                    event.setExtendedProp('filteredEventCount', 0);
                    this.isAllFilterChecked = true;
                    event.setExtendedProp('isAllFilterChecked', true);
                });
            } else if (!check) {
                events.forEach((event: any) => {
                    if (
                        event.extendedProps.type == "Assignment" ||
                        event.extendedProps.type == "Pending" ||
                        event.extendedProps.type == "Trade" ||
                        event.extendedProps.type == "Unavailability" ||
                        event.extendedProps.type == "Request" ||
                        (event.extendedProps.type == "Assignment" && event.extendedProps.status == "Pending")
                    ) {
                        event.setProp("display", "none");
                    }
                    if (event.extendedProps.type == "Need") {
                        event.setExtendedProp('needFV', false);
                    }
                    event.setExtendedProp('filteredEventCount', 0);
                    this.isAllFilterChecked = false;
                    event.setExtendedProp('isAllFilterChecked', true);
                });
            }
        }

        onCheckUnavailabilityOption(check: boolean) {
            let events = this.currentMonthCalendarApi.getEvents();
            let filteredDatesRemoved: any = [];
            let filteredDatesAdded: any = [];
            let isAllFilterStatusUpdated: boolean = false;
            if (check) {
                events.forEach((event: any) => {
                    if (event.extendedProps.type == "Unavailability") {
                        event.setProp("display", "auto");
                        filteredDatesAdded.push(event.start);
                        if(this.isAllFilterChecked == false && event.extendedProps.dailyEvents > 1){
                           event.setExtendedProp('isAllFilterChecked', false);
                           isAllFilterStatusUpdated = true;
                        }
                    }
                });

                if(isAllFilterStatusUpdated){
                    this.isAllFilterChecked = true;
                }
            } else if (!check) {
                events.forEach((event: any) => {
                    if (event.extendedProps.type == "Unavailability") {
                        event.setProp("display", "none");
                        filteredDatesRemoved.push(event.start);
                    }
                });
            }

            if(filteredDatesRemoved.length > 0){
                filteredDatesRemoved.forEach((removedDate: any) => {
                    let startDate = moment(removedDate).format("YYYY-MM-DD");
                    events.forEach((event: any) => {
                        let eventDate = moment(event.start).format("YYYY-MM-DD");
                        if (event.extendedProps.type != "Unavailability" && startDate == eventDate) {
                            let count = event.extendedProps.filteredEventCount == 0 ? event.extendedProps.dailyEvents - 1 : event.extendedProps.filteredEventCount - 1;
                            event.setExtendedProp('filteredEventCount', count);
                            event.setExtendedProp('isAllFilterChecked', true);
                        }
                    });
                });
            }

            if(filteredDatesAdded.length > 0){
                filteredDatesAdded.forEach((addedDate: any) => {
                    let startDate = moment(addedDate).format("YYYY-MM-DD");
                    events.forEach((event: any) => {
                        let eventDate = moment(event.start).format("YYYY-MM-DD");
                        if (event.extendedProps.type != "Unavailability" && startDate == eventDate) {
                            let count = event.extendedProps.filteredEventCount == 0 ? event.extendedProps.dailyEvents : event.extendedProps.filteredEventCount + 1;
                            event.setExtendedProp('filteredEventCount', count);
                            event.setExtendedProp('isAllFilterChecked', true);
                        }
                    });
                });
            }
        }

        async getSchedules(currentDate: boolean = false) {
            if (currentDate) {
                localStorage.removeItem("sIndex");
            }
            
            if (localStorage.getItem("sIndex") != null) {
                this.currentShceduleIndex = Number(localStorage.getItem("sIndex"));
            }
            this.isUnavailabilityAllowed = this.profile.isUnavailabilityAllowed;
            this.employeeType = this.profileData.employeeType;
            this.weeksInSchedule = this.profileData.weeksInSchedule;

            let payload = {
                username: this.profileData.username,
                index: this.currentShceduleIndex,
            };
            if(this.profileData.staffId == 0)
            return;
            await this.$store
                .dispatch("schedule/getAllUserSchedules", payload)
                .then((res: any) => {
                    if (currentDate) {
                        let currSchedule = this.getCurrentWeekSchedule();
                        this.scheduleStatus = currSchedule.status;
                        if (this.viewFlag == 'CalView') {
                            this.currentMonthCalendarApi = this.$refs.fullCalendarCurrentMonth.getApi();
                            this.currentMonthCalendarApi.changeView("dayGrid"); //Switch to one day view
                            this.currentMonthCalendarApi.gotoDate(currSchedule.startDate);
                        }
                    }
                    else {
                        if (localStorage.getItem("sIndex") != null) {
                            var departmentScheduleIndex = Number(localStorage.getItem("sIndex"));
                            let currsched = this.userSchedules[departmentScheduleIndex];
                            this.currentShceduleIndex = departmentScheduleIndex;
                            this.scheduleStartDate = currsched.startDate;
                            this.scheduleEndDate = currsched.endDate;
                            this.scheduleStatus = currsched.status;
                            if (this.viewFlag == 'CalView') {
                                this.currentMonthCalendarApi = this.$refs.fullCalendarCurrentMonth.getApi();
                                this.currentMonthCalendarApi.changeView("dayGrid"); //Switch to one day view
                                this.currentMonthCalendarApi.gotoDate(currsched.startDate);
                            }
                        }
                    }

                    this.setCalendarEvents(this.currentShceduleIndex);
                    if (this.viewFlag == 'CalView') {
                        this.currentMonthCalendarApi.changeView("dayGrid");
                        this.currentMonthCalendarApi.setOption('duration', { weeks: this.weeksInSchedule });
                        this.currentMonthCalendarApi.setOption('dateIncrement', { weeks: this.weeksInSchedule });
                        if (this.weeksInSchedule == 6) {
                            this.currentMonthCalendarApi.setOption('height', 800);
                        }
                        else {
                            this.currentMonthCalendarApi.setOption('height', 550);
                        }
                    }
                })
                .catch((err: any) => {
                    if (err) {
                        console.log(err); // Handle errors any way you want
                    }
                });

            localStorage.setItem("sIndex", this.currentShceduleIndex.toString());
        }

        async getScheduleDetailsOnNavigation(index: Number): Promise<any> {
            let payload = {
                username: this.profileData.username,
                index: index,
            };

            await this.$store
                .dispatch("schedule/getAllUserSchedules", payload)
                .then((res: any) => {
                    return res.data;
                })
                .catch((err: any) => {
                    if (err) {
                        console.log(err); // Handle errors any way you want
                    }
                });
        }

        showModal() {
            this.sharedToggle = true;
            setTimeout(() => this.currentMonthCalendarApi.updateSize(), 300);
            window.scrollTo(0, 0);
        }

        handleDateUnselect(selectinfo: any) {
            if (
                selectinfo.jsEvent?.shiftKey == false &&
                this.selectedDates.length > 0
            ) {
                alert("Great");
            }
        }

        handleDateSelect(selectInfo: any, onDateNavigation: boolean = false) {
            let startDate = moment(selectInfo.start).format("YYYY-MM-DD");
            let objEndDate: Date = new Date(selectInfo.end);
            objEndDate.setDate(objEndDate.getDate() - 1);
            let endDate = moment(objEndDate).format("YYYY-MM-DD");
            let todayDate = moment(new Date()).format("YYYY-MM-DD");

            var startSD = moment(startDate, 'M/D/YYYY');
            var endSD = moment(endDate, 'M/D/YYYY');
            var diffDays = endSD.diff(startSD, 'days');

            if (
                new Date(startDate) <= new Date(todayDate) &&
                new Date(endDate) <= new Date(todayDate)
            ) {
                this.isUnavailabilityAllowed = false;
            } else {
                this.isUnavailabilityAllowed = this.profile.isUnavailabilityAllowed;
            }

            this.calSelectedDates =  { startDate: selectInfo.start, endDate: selectInfo.end };

            this.sharedToggle = false;
            setTimeout(() => this.currentMonthCalendarApi.updateSize(), 300);

            if (this.checkIfFutureDate(selectInfo.end) || onDateNavigation) {
                var scheduleEventType: any;
                let selfScheduleDeptIds: any;
                const checkSchedules = this.userSchedules[this.currentShceduleIndex].events.some((schedules:any) => {
                    scheduleEventType = schedules.type;
                   if(scheduleEventType == "Need" && moment(schedules.date).format("YYYY-MM-DD") == moment(selectInfo.start).format("YYYY-MM-DD"))
                    {
                      selfScheduleDeptIds = schedules.selfScheduleDepartments;                      
                    }
                    return (moment(schedules.date).format("YYYY-MM-DD") == moment(selectInfo.start).format("YYYY-MM-DD")
                    );
                });
                if (checkSchedules) {
                    if ((scheduleEventType != "Need" && diffDays == 0) || (scheduleEventType == "Need" && diffDays == 0 && this.isDeptNeedCheck == false))
                        return;
                }
                this.sharedToggle = (this.isUnavailabilityAllowed || this.checkIfFutureDate(selectInfo.start) || onDateNavigation);
                this.counter = this.counter + 1;
                setTimeout(() => this.currentMonthCalendarApi.updateSize(), 300);
                window.scrollTo(0, 0);

                var isMultiDayAllowed = this.multiDaySelectionAllowedOrNot();
                const reset: any = [];
                this.currentEvent = reset;  
                this.sharedRequest = {
                    type: 1,
                    selfSchedule: isMultiDayAllowed,
                    request: this.checkIfFutureDate(selectInfo.start),
                    availability: this.isUnavailabilityAllowed,
                    vacationBidding: false,
                    calSelectedDates: this.calSelectedDates,
                    isSelfScheduledEvent: false,
                    status: this.scheduleStatus,
                    scheduleId: (isMultiDayAllowed == true ? this.userSchedules[this.currentShceduleIndex].id : ""),
                    SelfScheduleDepartments: selfScheduleDeptIds
                }; /*needApproval: true,*/
                if (new Date(selectInfo.start) < new Date(this.scheduleStartDate)) {
                    this.prevMonth();
                }
                else if (new Date(selectInfo.start) > new Date(this.scheduleEndDate)) {
                    this.nextMonth();
                }
            }
        }

        multiDaySelectionAllowedOrNot() {
            var returnVal;
            if (this.scheduleStatus.toUpperCase() == 'PLAN SHEET' && this.isTierOpen == true) {
                var startSD = moment(this.calSelectedDates.startDate, 'M/D/YYYY');
                var endSD = moment(this.calSelectedDates.endDate, 'M/D/YYYY');
                var diffDays = endSD.diff(startSD, 'days');
                let calCurrentDate: Date = new Date(this.calSelectedDates.startDate);
                let todayDate: Date = new Date();
                if (calCurrentDate < todayDate) {
                    calCurrentDate = todayDate;
                    let currentDiffDays = (moment(todayDate, 'M/D/YYYY')).diff(startSD, 'days');
                    diffDays = diffDays - currentDiffDays;
                }

                for (var i = 0; i < diffDays; i++) {
                    var isNeedExist = this.events.find(
                        (event: Event) =>
                            moment(event.date).format("YYYY-MM-DD") ==
                            moment(calCurrentDate).format("YYYY-MM-DD")
                            && event.type == "Need"
                    );
                    if (isNeedExist != undefined) {
                        returnVal = true;
                        calCurrentDate.setDate(calCurrentDate.getDate() + 1);
                    }
                    else {
                        returnVal = false;
                        break;
                    }
                }
            }
            else {
                returnVal = false;
            }
            return returnVal;
        }

        async raiseShiftTradeViewEvent(eventDate: any, shiftTradeOfferId: any)
        {
            var payload = { 
                username: this.profile.username, 
                shiftTradeOfferId: shiftTradeOfferId,
            };

            this.$store.dispatch("schedule/getShiftTradeRequested", payload)
                .then((res: any) => {
                    if(res === '' || res.status === 'Accepted')
                    {
                        this.isAlertModalVisible = true;
                        this.alertMsgValue = 'This shift is no longer available for swapping.';
                    }
                    else
                    {
                        let date = new Date(res.date);
                        this.raiseShiftTradeViewClickEvent(date, res.id, null);
                    }
                })
                .catch((err: any) => {
                    if (err) {
                        console.log(err); // Handle errors any way you want
                    }
                });
        }

        async raiseShiftTradeActionEvent(eventDate: any, action: any, shiftTradeOfferId: any, notificationId: any) {
            var payload = { 
                username: this.profileData.username, 
                shiftTradeOfferId: shiftTradeOfferId,
            };

            this.$store.dispatch("schedule/getShiftTradeRequested", payload)
                .then((res: any) => {
                    if(res === '' || res.status === 'Accepted')
                    {
                        this.isAlertModalVisible = true;
                        this.alertMsgValue = 'This shift is no longer available for swapping.';
                    }
                    else
                    {
                        const requestBody = [{
                        id: shiftTradeOfferId,
                        username: res.username,
                        firstName: res.firstName,
                        lastName: res.lastName,
                        tenantId: res.tenantId,
                        scheduleId: res.scheduleId,
                        facilityId: res.facilityId,
                        coid: res.coid,
                        facilityName: res.facilityName,
                        departmentId: res.departmentId,
                        // facilityCoId: this.assignmentDetail.facilityCoId,
                        departmentName: res.departmentName,
                        departmentCode: res.departmentCode,
                        departmentShiftId: res.departmentShiftId, // todo not sure of value
                        shiftCode: res.shiftCode,
                        shiftDescription: res.shiftDescription,
                        skill: res.skill,
                        date: res.date,
                        startTime: res.startTime,
                        endTime: res.endTime,
                        actualStartTime: res.actualStartTime,
                        actualEndTime: res.actualEndTime,
                        hours: res.hours,
                        minutes: res.minutes,
                        status: "",
                        requestorAssignmentId: res.requestorAssignmentId,
                        acceptorAssignmentId: res.acceptorAssignmentId,
                        offeredToUsername: res.offeredToUsername,
                        offeredToFirstName: res.offeredToFirstName,
                        offeredToLastName: res.offeredToLastName,
                        isAutoapprovable: res.isAutoapprovable,
                        notificationId: notificationId
                    }];
                    requestBody[0].status = action === "Decline" ? 'Rejected' : 'Accepted';
                    var appinsightTitle = 'ShiftTrades' + requestBody[0].status;
                    this.isLoading = true;
                    this.$store
                        .dispatch("schedule/acceptShiftTradeOffer", requestBody)
                        .then(() => {
                            this.isLoading = false;
                            this.emitter.emit('showSuccessMsgPopUp', true);
                            this.emitter.emit('closeSharedModal');
                            //bus.$emit('shiftTradenotificationchanged');
                            this.refreshCalender();
                            useAppInsights().trackEvent({name:appinsightTitle, properties: 
                                JSON.parse(JSON.stringify(this.appInsightEventData))
                            });
                        })
                        .catch((err: any) => {
                            this.isLoading = false;
                            this.emitter.emit('showSuccessMsgPopUp', false);
                            let parseResponse = err.request.responseText != "" ? JSON.parse(err.request.responseText) : err.request.responseText;
                            this.isAlertModalVisible = true;
                            this.alertMsgValue = (parseResponse.result != null || parseResponse.result != undefined) ? JSON.parse(parseResponse.result).Message : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
                            //bus.$emit('shiftTradenotificationchanged');
                        });
                    }
                })
                .catch((err: any) => {
                    if (err) {
                        console.log(err); // Handle errors any way you want
                    }
                });
        }

        async raiseShiftTradeViewClickEvent(eventDate: any, shiftTradeOfferId: any, callback:any) {
            if (new Date(eventDate) < new Date(this.scheduleStartDate)) {
                await this.prevMonth();
            }
            else if (new Date(eventDate) > new Date(this.scheduleEndDate)) {
                await this.nextMonth();
            }
            this.updateData = eventDate;
            var eventFound = false;
            for (var i = 0; i < this.userSchedules.length; i++) {
                if (eventDate >= new Date(this.userSchedules[i].startDate) && eventDate <= new Date(this.userSchedules[i].endDate)) {
                    this.userSchedules[i].events.forEach((event: Event) => {
                        if (eventDate.toDateString() == new Date(event.date).toDateString()) {
                            var cellTitle = this.getEventCellTitle(event, this.userSchedules[i].status, this.userSchedules[i].events);
                            if(shiftTradeOfferId === event.id)
                                this.processClickEvent(cellTitle, eventDate, event.id, this.needFV);
                            eventFound = true;
                            return;
                        }
                    });
                }
            }
            if (!eventFound) {
                var selectInfo: any = {} as any;
                var endDate = new Date(eventDate);
                endDate.setDate(eventDate.getDate() + 1)
                selectInfo.start = eventDate;
                selectInfo.end = endDate;
                this.handleDateSelect(selectInfo, true);
            }
            if (callback) {
                callback(this.sharedRequest);
            }
        }

        async raiseClickEvent(eventDate: any, callback:any) {
            if (new Date(eventDate) < new Date(this.scheduleStartDate)) {
                await this.prevMonth();
            }
            else if (new Date(eventDate) > new Date(this.scheduleEndDate)) {
                await this.nextMonth();
            }
            this.updateData = eventDate;
            var eventFound = false;
            for (var i = 0; i < this.userSchedules.length; i++) {
                if (eventDate >= new Date(this.userSchedules[i].startDate) && eventDate <= new Date(this.userSchedules[i].endDate)) {
                    this.userSchedules[i].events.forEach((event: Event) => {
                        if (eventDate.toDateString() == new Date(event.date).toDateString()) {
                            var cellTitle = this.getEventCellTitle(event, this.userSchedules[i].status, this.userSchedules[i].events);
                            this.processClickEvent(cellTitle, eventDate, event.id, this.needFV);
                            eventFound = true;
                            return;
                        }
                    });
                }
            }
            if (!eventFound) {
                var selectInfo: any = {} as any;
                var endDate = new Date(eventDate);
                endDate.setDate(eventDate.getDate() + 1)
                selectInfo.start = eventDate;
                selectInfo.end = endDate;
                this.handleDateSelect(selectInfo, true);
            }
            if (callback) {
                callback(this.sharedRequest);
            }
        }

        handleEventClick(clickInfo: any) {         
            this.processClickEvent(clickInfo.event.title, clickInfo.event.start, clickInfo.event.id, clickInfo.event.extendedProps.needFV);
        }

        processClickEvent(cellTitle:string, eventStart:any, eventId:string, needFV:boolean) {
             //this.currentMonthCalendarApi = this.$refs.fullCalendarCurrentMonth.getApi();
            const event = cellTitle.includes("NEEDS") || cellTitle.includes("SHIFT")
                ? this.events.find(
                    (event: Event) =>
                        moment(event.date).format("YYYY-MM-DD") ==
                        moment(eventStart).format("YYYY-MM-DD")
                        && event.type == "Need"
                )
                : this.events.find((event: Event) => event.id === eventId);
            if (event) {
                this.currentEvent = event;
                this.sharedToggle = false;
                this.sharedToggle = true;
                this.counter = this.counter + 1;
                setTimeout(() => this.currentMonthCalendarApi.updateSize(), 300);
                window.scrollTo(0, 0);
                if (
                    event.status == "Scheduled" &&
                    this.scheduleStatus == "Posted" && 
                    this.checkIfFutureDate(event.date)
                ) {
                    let strClickEventDate = moment(event.date).format("YYYY-MM-DD");
                    let clickEventNextDate: Date = new Date(moment(event.date).format("YYYY/MM/DD"));
                    clickEventNextDate.setDate(clickEventNextDate.getDate() + 1);
                    let todayDate = moment(new Date()).format("YYYY-MM-DD");

                    if (new Date(strClickEventDate) <= new Date(todayDate)) {
                        this.isUnavailabilityAllowed = false;
                    }
                    else {
                        this.isUnavailabilityAllowed = this.profile.isUnavailabilityAllowed;
                    }
                    if (moment(event.date) > moment().add(48,'hours')) {
                        this.isShiftTradeAllowed = true;
                    } else {
                        this.isShiftTradeAllowed = false;
                    }

                    this.calSelectedDates = { startDate: eventStart, endDate: clickEventNextDate };

                    this.sharedRequest = {
                        type: 4,
                        tradeShift: this.isShiftTradeAllowed,
                        selfSchedule: true,
                        request: this.checkIfFutureDate(strClickEventDate),
                        status: this.scheduleStatus,
                        calSelectedDates: this.calSelectedDates,
                        isSelfScheduledEvent: false,
                        assignmentDetail: !this.isShiftTradeAllowed,
                        isSymphonyUser: this.profile.useMySchedulerOperatingRoom? true :false
                    };
                    return;
                }

                if (event.type == "Need") {
                    let strClickEventDate = moment(event.date).format("YYYY-MM-DD");
                    let clickEventNextDate: Date = new Date(moment(event.date).format("YYYY/MM/DD"));
                    clickEventNextDate.setDate(clickEventNextDate.getDate() + 1);
                    let todayDate = moment(new Date()).format("YYYY-MM-DD");

                    if (new Date(strClickEventDate) <= new Date(todayDate)) {
                        this.isUnavailabilityAllowed = false;
                    }
                    else {
                        this.isUnavailabilityAllowed = this.profile.isUnavailabilityAllowed;
                    }

                    this.calSelectedDates ={ startDate: eventStart, endDate: clickEventNextDate };

                    this.sharedRequest = {
                        type: 1,
                        selfSchedule: needFV,
                        request: this.checkIfFutureDate(strClickEventDate),
                        availability: this.isUnavailabilityAllowed,
                        calSelectedDates: this.calSelectedDates,
                        status: this.scheduleStatus,
                        isSelfScheduledEvent: false,
                        SelfScheduleDepartments: event.selfScheduleDepartments                      
                    };
                }                
                else if (event.type == "Unavailability") {
                    this.sharedRequest = {
                        type: 1,
                        selfSchedule: false,
                        request: false,
                        availability: true,
                        calSelectedDates: {},
                        isUnavailabilityEvent: true,
                        isSelfScheduledEvent: false,
                        status: this.scheduleStatus
                    }; /*needApproval: false,*/
                }
                else if ((event.status == "Requested" || event.status == "Pending") && event.type == "Trade") {
                    this.sharedRequest = {
                        type: 3,
                        val: true,
                    };
                }
                else if (event.type == "Request") {
                    let strClickEventDate = moment(event.date).format("YYYY-MM-DD");
                    const calSelectedDates = { startDate: eventStart, endDate: moment(eventStart).add(1, 'days') };
                    this.sharedRequest = {
                        type: 1,
                        selfSchedule: false,
                        request: true,
                        additionalRequest: this.checkIfFutureDate(strClickEventDate),
                        availability: false,
                        calSelectedDates,
                        isSelfScheduledEvent: false,
                        status: this.scheduleStatus                       
                    };
                } //event.type = "Assignment"
                else {
                    this.sharedRequest = {
                        type: 2,
                        event: this.checkIf48hour(event),
                        assignmentDetail: true,
                        status: this.scheduleStatus,
                        isSymphonyUser: this.profile.useMySchedulerOperatingRoom? true :false,
                        availability:true
                    };
                }
            }
            if (new Date(event.date) < new Date(this.scheduleStartDate)) {
                this.prevMonth();
            }
            else if (new Date(event.date) > new Date(this.scheduleEndDate)) {
                this.nextMonth();
            }
        }

        checkIf48hour(event:any) {
            return moment().diff(moment(event.date), "hours") < -48;
        }

        checkIfFutureDate(event:any) {
            return moment().diff(moment(event), "hours") < 0;
        }

        handleEvents(events: any) {
            //this.currentEvents = events;
        }

        
        async prevMonth() {
            if (this.currentShceduleIndex > 0) {
                this.currentShceduleIndex -= 1;
            }
            await this.getScheduleDetailsOnNavigation(this.currentShceduleIndex);
            let prevWeek = this.userSchedules[this.currentShceduleIndex];
            this.scheduleStartDate = prevWeek.startDate;
            this.scheduleEndDate = prevWeek.endDate;
            this.scheduleStatus = prevWeek.status;
            this.currentMonthCalendarApi.gotoDate(prevWeek.startDate);
            this.setCalendarEvents(this.currentShceduleIndex);
            localStorage.setItem("sIndex", this.currentShceduleIndex.toString());
        }

        getCurrentWeekSchedule(): any {
            var currdate = new Date();
            var currentsched:any;

            this.userSchedules.forEach((sched: any) => {
                var startDt, endDt, currDt;
                startDt = moment(sched.startDate).format("DD/MM/YYYY");
                currDt = moment(currdate).format("DD/MM/YYYY");
                endDt = moment(sched.endDate).format("DD/MM/YYYY");
                //getting week start date from schedules, based on current date

                var sDt = startDt.split("/");
                var cDt = currDt.split("/");
                var eDt = endDt.split("/");

                var from = new Date(parseInt(sDt[2]), parseInt(sDt[1])-1, parseInt(sDt[0]));  // -1 because months are from 0 to 11
                var to   = new Date(parseInt(eDt[2]), parseInt(eDt[1])-1, parseInt(eDt[0]));
                var check = new Date(parseInt(cDt[2]), parseInt(cDt[1])-1, parseInt(cDt[0]));

                if(check >= from && check <= to){
                    currentsched = sched;
                    return;
                }
            });

            this.currentShceduleIndex = this.userSchedules.indexOf(currentsched);
            this.scheduleStartDate = currentsched.startDate;
            this.scheduleEndDate = currentsched.endDate;

            return currentsched;
        }

        //get current week schedules
        async todayDate() {
            await this.getScheduleDetailsOnNavigation(0);
            localStorage.removeItem("sIndex");
            let todaysWeek = this.getCurrentWeekSchedule();
            this.currentMonthCalendarApi.gotoDate(todaysWeek.startDate);
            this.setCalendarEvents(this.currentShceduleIndex);
        }

        //get next month schedules
        async nextMonth() {
            this.currentShceduleIndex += 1;
            await this.getScheduleDetailsOnNavigation(this.currentShceduleIndex);
            const nextWeek = this.userSchedules[this.currentShceduleIndex];
            this.scheduleStartDate = nextWeek.startDate;
            this.scheduleEndDate = nextWeek.endDate;
            this.scheduleStatus = nextWeek.status;
            this.currentMonthCalendarApi.gotoDate(nextWeek.startDate);
            this.setCalendarEvents(this.currentShceduleIndex);
            localStorage.setItem("sIndex", this.currentShceduleIndex.toString());
        }

        showWelcomeModal(){
            if(this.profileData.isFirstTimeLogin && 
                !this.profileData.isAdmin) {
                this.isWelcomeModalVisible = true;
            }
            else{
                this.isWelcomeModalVisible = false;
            }
        }

        async onCloseWelcomePopup(){
            let data = {
                        isFirstTimeLogin: true,
                    };
            await this.$store.dispatch('profile/updateWelcomePopupstatus', data)
                .then((res: any) => {
                    this.isWelcomeModalVisible = false;
                })
                .catch((err: any) => {
                    if (err) {
                        console.log(err);
                        this.isWelcomeModalVisible = false;
                    }
                });
        }
    }

</script>
<style lang="css">
    .neu-dashboard__header {
        background-color: #ffffff;
        max-width: 100%;
        min-height: 4.375em;
        display: flex;
        position: relative;
        align-items: center;
    }

    .neu-dashboard__header-no-padding {
        padding-right: 0;
        padding-left: 0;
    }

    .neu-dashboard__header-image-avatar {
        height: 125px;
        width: 125px;
        border-radius: 50%;
        text-align: center;
        padding: 18px;
    }

    .neu-dashboard__header-avatar {
        height: 85px;
        width: 85px;
        border-radius: 50%;
        text-align: center;
        padding: 18px;
    }

    .hourGlsEmpty{
        position: absolute;
        color: #03173e;
        bottom: 5px;
        left: 5px;
    }

    .neu-dashboard__header-avatar-text {
        color: white;
        margin-top: 4px;
    }

    .neu-dashboard__header-avatar_text {
        height: 85px;
        width: 85px;
        line-height: 0;
        position: relative;
        border-radius: 50%;
        text-align: center;
    }

    .fc .fc-daygrid-day-frame {
        min-height: 100%;
        display: flex;
        flex-flow: column;
    }

    .fc .fc-daygrid-day-top {
        display: flex;
        flex-direction: row-reverse;
        height: 23px;
    }

    .fc .fc-daygrid-day-events {
        position: relative;
        min-height: 6em !important;
        display: flex;
        flex-flow: column;
        flex-grow: 1;
        margin-top: 1 px;
        border-radius: 6px;
        border: 1px dashed #55575A;
        background-image: url("Plus_Icon.png");
        background-repeat: no-repeat;
        background-size: 10%;
        background-position: center;
    }

    .open-daycell {
        position: relative;
        min-height: 6.5em;
        display: flex;
        flex-flow: column;
        flex-grow: 1;
        margin-top: 1 px;
        border-radius: 6px;
        border: 1px dashed #55575A;
        background-image: url("Plus_Icon.png");
        background-repeat: no-repeat;
        background-size: 12%;
        background-position: center;
        height: 100%;
    }

    .fc .fc-daygrid-event-harness {
        width: 100%;
        display: flex;
        flex-grow: 1;
        margin-top: 0px !important;
    }

    .fc-direction-ltr .fc-daygrid-event.fc-event-end, .fc-direction-rtl .fc-daygrid-event.fc-event-start {
        margin-right: 2px;
        width: 100%;
    }

    .main-event {
        width: 100% !important;
        height: 100%;
        display: block;
        flex-flow: column;
        flex-grow: 1;
        border: 1px solid #20558C;
        position: absolute;
    }


    .main-openneed {
        width: 100% !important;
        height: 100%;
        display: block;
        flex-flow: column;
        flex-grow: 1;
        position: absolute;
        border-left: 1px dashed #55575A;
        border-right: 1px dashed #55575A;
        border-bottom: 1px dashed #55575A;
        border-radius: 6px;
    }

    .main-event:hover {
        background-color: lightgray;
    }

    .event-title {
        background-color: #E5F1F7 !important;
        border-bottom: 1px solid #20558C;
        color: #20558C;
        font-weight: bolder;
        font-family: "HCA-Mark","Arial",sans-serif;
        text-align: center;
        top: 0;
        flex: 1 1;
        width: 100%;
        position: absolute;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 3px;
    }

    .event-title-sixweek {
        background-color: #E5F1F7;
        color: #20558C;
        font-weight: bolder;
        font-family: "HCA-Mark","Arial",sans-serif;
        text-align: center;
        top: 0;
        flex: 1 1;
        width: 100%;
        height: 100%;
        line-height: 50px;
        position: absolute;
        font-size: 11px;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 3px;
    }

    .event-title-fourweek {
        background-color: #E5F1F7;
        color: #20558C;
        font-weight: bolder;
        font-family: "HCA-Mark","Arial",sans-serif;
        text-align: center;
        top: 0;
        flex: 1 1;
        width: 100%;
        height: 100%;
        line-height: 35px;
        position: absolute;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 3px;
    }

    .event-updated {
        position: absolute;
        color: #20558C;
        text-align: centre;
        right: 80%;
        top: 76%;
        width: 10%;
        font-weight: bolder;
        font-size: 11px;
        font-family: "HCA-Mark","Arial",sans-serif;
    }

    .logo-trade-bottom {
        color: #285C4D;
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        display: inline-block;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: 'liga';
        position: absolute;
        font-weight: bold;
        top: 68%;
        left: 2%;
        text-align: center;
        font-size: 15px;
    }

    .logo-trade-top {
        color: #285C4D;
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        display: inline-block;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: 'liga';
        position: absolute;
        top: 0;
        left: 2%;
        text-align: center;
        font-weight: bold;
        font-size: 15px;
    }

    .logo-trade-top-fourweek {
        color: #285C4D;
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        display: inline-block;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: 'liga';
        position: absolute;
        line-height: 45px;
        top: 0;
        left: 2%;
        text-align: center;
        font-weight: bold;
        font-size: 15px;
    }

    .logo-need-bottom {
        color: #55575A;
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        display: inline-block;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: 'liga';
        position: absolute;
        top: 77%;
        left: 2%;
        text-align: center;
        font-size: 8px;
    }

    .logo-need-top {
        color: #55575A;
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        display: inline-block;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: 'liga';
        position: absolute;
        top: 0;
        left: 2%;
        text-align: center;
        font-size: 8px;
    }

    .logo-need-top-fourweek {
        color: #55575A;
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        display: inline-block;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: 'liga';
        position: absolute;
        line-height: 45px;
        top: 0;
        left: 2%;
        text-align: center;
        font-size: 8px;
    }

    .logo-updated-bottom {
        color: #20558C;
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        display: inline-block;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: 'liga';
        position: absolute;
        top: 80%;
        left: 2%;
        text-align: center;
        font-size: 8px;
    }

    .logo-updated-top {
        color: #20558C;
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        display: inline-block;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: 'liga';
        position: absolute;
        top: 0;
        left: 2%;
        text-align: center;
        font-size: 8px;
    }

    .logo-updated-top-fourweek {
        color: #20558C;
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        display: inline-block;
        -webkit-font-smoothing: antialiased;
        line-height: 45px;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: 'liga';
        position: absolute;
        top: 0;
        left: 2%;
        text-align: center;
        font-size: 8px;
    }

    .event-descriptionCoid {
        color: #1f2532;
        position: absolute;
        top: 30%;
        font-weight: bold;
        font-family: "HCA-Mark","Arial",sans-serif;
        font-size: 11px;
        white-space: pre-line;
        width: 100%;
        justify-content: center;
        text-align: center;
        line-height: 110%;
    }

    .event-description {
        color: #1f2532;
        position: absolute;
        display: flex;
        top: 55%;
        font-weight: bold;
        font-family: "HCA-Mark","Arial",sans-serif;
        font-size: 11px;
        white-space: pre-line;
        width: 100%;
        justify-content: center;
        text-align: center;
        line-height: 110%;
    }

    element.style {
        margin-top: 0px;
    }

    .main-openNeed:hover {
        background-color: lightgray;
    }

        .main-openNeed:hover .openNeed-plusSign {
            background-color: lightgray;
        }

    .openNeed-title {
        background-color: #F5F5F5;
        border: 1px solid #55575A;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        color: #55575A;
        font-weight: bolder;
        font-size: 12px;
        font-family: "HCA-Mark","Arial",sans-serif;
        text-align: center;
        width: 100%;
        top: 0;
        flex: 1 1;
        padding: 1px 2px 3x 2px;
        position: absolute;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 2px;
    }
    .openNeed-title-withschedule {
        background-color: #F5F5F5;
        border: 1px solid #55575A;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        color: #55575A;
        font-weight: bolder;
        font-size: 12px;
        font-family: "HCA-Mark","Arial",sans-serif;
        text-align: center;
        width: 100%;
        height: 100%;
        line-height: 15px;
        top: 0;
        flex: 1 1;
        padding: 1px 2px 3x 2px;
        position: absolute;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 2px;
    }

    .openNeed-title-fourweek {
        background-color: #F5F5F5;
        border: 1px solid #55575A;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        color: #55575A;
        font-weight: bolder;
        font-size: 12px;
        font-family: "HCA-Mark","Arial",sans-serif;
        text-align: center;
        width: 100%;
        height: 100%;
        line-height: 35px;
        top: 0;
        flex: 1 1;
        padding: 1px 2px 3x 2px;
        position: absolute;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 2px;
    }

    .openNeed-plusSign {
        color: black;
        position: absolute;
        display: flex;
        top: 55%;
        left: 50%;
        font-weight: bold;
        font-family: "HCA-Mark","Arial",sans-serif;
        font-size: 20px;
        transform: translate(-50%, -50%);
    }

    .openNeed-new {
        position: absolute;
        color: #55575A;
        position: absolute;
        text-align: centre;
        right: 80%;
        top: 72%;
        width: 10%;
        font-weight: bolder;
        font-family: "HCA-Mark","Arial",sans-serif;
        font-size: 11px;
        padding: 1px 4px 2px 1px;
    }


    .main-reserve {
        width: 100% !important;
        height: 100%;
        display: block;
        flex-flow: column;
        flex-grow: 1;
        position: absolute;
        border-left: 1px dashed #992901;
        border-right: 1px dashed #992901;
        border-bottom: 1px dashed #992901;
    }

        .main-reserve:hover {
            background-color: lightgray;
        }

    .reserveNeed-title {
        background-color: #FEF3E6;
        border: 1px solid #992901;
        color: #992901;
        font-weight: bolder;
        font-family: "HCA-Mark","Arial",sans-serif;
        text-align: center;
        width: 100%;
        top: 0;
        flex: 1 1;
        position: absolute;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 2px;
    }

    .reserveNeed-title-fourweek {
        background-color: #FEF3E6;
        color: #992901;
        font-weight: bolder;
        font-family: "HCA-Mark","Arial",sans-serif;
        text-align: center;
        width: 100%;
        height: 100%;
        line-height: 35px;
        top: 0;
        flex: 1 1;
        position: absolute;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 2px;
    }

    .requestNeed-title {
        background-color: #FEF3E6;
        border: 1px solid #992901;
        color: #992901;
        font-weight: bolder;
        font-family: "HCA-Mark","Arial",sans-serif;
        text-align: center;
        width: 100%;
        top: 0;
        flex: 1 1;
        position: absolute;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 2px;
    }

    .requestNeed-title-fourweek {
        border-top: 1px dashed #992901;
        background-color: #FEF3E6;
        color: #992901;
        font-weight: bolder;
        font-family: "HCA-Mark","Arial",sans-serif;
        text-align: center;
        width: 100%;
        height: 100%;
        line-height: 35px;
        top: 0;
        flex: 1 1;
        position: absolute;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 2px;
    }


    .main-trade {
        width: 100% !important;
        height: 100%;
        display: block;
        flex-flow: column;
        flex-grow: 1;
        border: 1px solid #285C4D;
        position: absolute;
    }

    .trade-title {
        background-color: #F6FAEF;
        border-bottom: 1px solid #285C4D;
        color: #285C4D;
        font-weight: bolder;
        font-family: "HCA-Mark","Arial",sans-serif;
        text-align: center;
        width: 100%;
        top: 0;
        flex: 1 1;
        position: absolute;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 1px;
    }

    .trade-title-fourweek {
        background-color: #F6FAEF;
        color: #285C4D;
        font-weight: bolder;
        font-family: "HCA-Mark","Arial",sans-serif;
        text-align: center;
        width: 100%;
        top: 0;
        flex: 1 1;
        position: absolute;
        height: 100%;
        line-height: 35px;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 1px;
    }

    .trade-description {
        color: #1f2532;
        position: absolute;
        display: flex;
        top: 60%;
        font-weight: bold;
        font-family: "HCA-Mark","Arial",sans-serif;
        font-size: 11px;
        white-space: pre-line;
        width: 100%;
        justify-content: center;
        text-align: center;
        line-height: 110%;
    }

    .trade-visual {
        position: absolute;
        color: #285C4D;
        text-align: centre;
        right: 76%;
        width: 10%;
        top: 74%;
        font-weight: bolder;
        font-family: "HCA-Mark","Arial",sans-serif;
        font-size: 11px;
    }

    .main-unavail {
        width: 100% !important;
        height: 100%;
        display: block;
        flex-flow: column;
        flex-grow: 1;
        border: 1px solid #971B2F;
        position: absolute;
    }

    .unavail-title {
        background-color: #FCF0F1;
        top: 0;
        flex: 1 1;
        border-bottom: 1px solid #971B2F;
        color: #971B2F;
        font-weight: bolder;
        font-family: "HCA-Mark","Arial",sans-serif;
        text-align: center;
        position: absolute;
        width: 100%;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 2px;
    }

    .unavail-title-fourweek {
        background-color: #FCF0F1;
        height: 100%;
        line-height: 35px;
        top: 0;
        flex: 1 1;
        color: #971B2F;
        font-weight: bolder;
        font-family: "HCA-Mark","Arial",sans-serif;
        text-align: center;
        position: absolute;
        width: 100%;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 2px;
    }

    .progressbar {
        width: 100%;
        height: 5px;
        background-color: #eee;
        margin: 1em auto;
        transition: width 500ms;
    }

    .changedaycellbgcolor {
        background-image: linear-gradient(-45deg, #E8E8E8 25%, transparent 25%, transparent 50%, #E8E8E8 50%, #E8E8E8 75%, transparent 75%, transparent);
        background-size: 6px 6px;
    }

    /* .fc .fc-col-header {
    color: rgb(18, 142, 184);
    height: 100px;
    } */
    .fc .fc-col-header-cell-cushion {
        /* needs to be same precedence */
        padding-top: 10px; /* an override! */
        padding-bottom: 10px; /* an override! */
    }

    .fc-daygrid-day-number {
        color: rgb(18, 142, 184);
        font-weight: bold;
    }

    .fc-daygrid {
        background-color: white;
        border-style: groove !important;
    }

    .pointer {
        cursor: pointer;
    }

    p {
        text-align: center;
    }

    .verticallyCenter {
        display: flex;
        align-items: center;
    }

    .calendar-navigation:hover {
        background: #bfe0f2;
        border-radius: 1rem;
        color: white;
    }

    .posNone{
        position:inherit !important;
    }

    .overtimeIndicatorDivMultipleEvents{
        position: absolute;
        color: #992902;
        top: 5px;
        left: 1px;
    }

    .overtimeIndicatorDivSingleEvents{
        font-size: 15px;
        position: absolute;
        color: #992902;
        top: 1px;
        left: 4px;
        font-weight: 600;
    }
    /* Media Query for Mobile Devices */
    @media (max-width: 480px) {
        .schedulePeriodDate{
            display: inline-block;
            font-size: 1.25rem !important;
        }

        .schedulerMainDiv {
            position: relative;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            transition: width 0.2s ease-in-out;
            width: 100%;
            padding-right: 5px;
        }

        .profilePic{
            margin-top: 1em!important;
        }

        .commitmentProgress{
            padding-right: 0px;
        }

        .commitmentProgressBar{
            display: inline-block;
            max-width: 260px;
        }

        .commitmentProgressArrow{
            display: inline-block;
            max-width: 24px;
        }

        .event-descriptionCoid {
            color: #1f2532;
            position: absolute;
            top: 30%;
            font-weight: bold;
            font-family: "HCA-Mark","Arial",sans-serif;
            font-size: 9px;
            white-space: pre-line;
            width: 100%;
            justify-content: center;
            text-align: center;
            line-height: 110%;
        }

        .trade-description {
            color: #1f2532;
            position: absolute;
            display: flex;
            top: 55%;
            font-weight: bold;
            font-family: "HCA-Mark","Arial",sans-serif;
            font-size: 9px;
            white-space: pre-line;
            width: 100%;
            justify-content: center;
            text-align: center;
            line-height: 110%;
        }

        .trade-visual {
            position: absolute;
            color: #285C4D;
            text-align: centre;
            right: 76%;
            width: 10%;
            top: 86%;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            font-size: 10px;
        }

        .logo-trade-bottom {
            color: #285C4D;
            font-family: 'Material Icons';
            font-weight: normal;
            font-style: normal;
            display: inline-block;
            -webkit-font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
            -moz-osx-font-smoothing: grayscale;
            font-feature-settings: 'liga';
            position: absolute;
            font-weight: bold;
            top: 81%;
            text-align: center;
            font-size: 12px;
        }

        .event-description {
            color: #1f2532;
            position: absolute;
            display: flex;
            top: 55%;
            font-weight: bold;
            font-family: "HCA-Mark","Arial",sans-serif;
            font-size: 9px;
            white-space: pre-line;
            width: 100%;
            justify-content: center;
            text-align: center;
            line-height: 110%;
        }

        .requestNeed-title {
            background-color: #FEF3E6;
            border: 1px solid #992901;
            color: #992901;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            width: 100%;
            top: 0;
            flex: 1 1;
            position: absolute;
            font-size: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 2px;
        }

        .requestNeed-title-fourweek {
            border-top: 1px dashed #992901;
            background-color: #FEF3E6;
            color: #992901;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            width: 100%;
            height: 100%;
            line-height: 35px;
            top: 0;
            flex: 1 1;
            position: absolute;
            font-size: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 2px;
        }

        .event-title {
            background-color: #E5F1F7;
            border-bottom: 1px solid #20558C;
            color: #20558C;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            top: 0;
            flex: 1 1;
            width: 100%;
            position: absolute;
            font-size: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 1px;
        }

        .event-title-sixweek {
            background-color: #E5F1F7;
            color: #20558C;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            top: 0;
            flex: 1 1;
            width: 100%;
            height: 100%;
            line-height: 50px;
            position: absolute;
            font-size: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 1px;
        }

        .event-title-fourweek {
            background-color: #E5F1F7;
            color: #20558C;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            top: 0;
            flex: 1 1;
            width: 100%;
            height: 100%;
            line-height: 35px;
            position: absolute;
            font-size: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 1px;
        }

        .openNeed-title {
            background-color: #F5F5F5;
            border: 1px solid #55575A;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            color: #55575A;
            font-weight: bolder;
            font-size: 10px;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            width: 100%;
            top: 0;
            flex: 1 1;
            padding: 1px 2px 3x 2px;
            position: absolute;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 2px;
        }

        .openNeed-title-fourweek {
            background-color: #F5F5F5;
            border: 1px solid #55575A;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            color: #55575A;
            font-weight: bolder;
            font-size: 10px;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            width: 100%;
            height: 100%;
            line-height: 35px;
            top: 0;
            flex: 1 1;
            padding: 1px 2px 3x 2px;
            position: absolute;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 2px;
        }

        .unavail-title {
            background-color: #FCF0F1;
            top: 0;
            flex: 1 1;
            border-bottom: 1px solid #971B2F;
            color: #971B2F;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            position: absolute;
            width: 100%;
            font-size: 9px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .unavail-title-fourweek {
            background-color: #FCF0F1;
            height: 100%;
            line-height: 35px;
            top: 0;
            flex: 1 1;
            color: #971B2F;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            position: absolute;
            width: 100%;
            font-size: 9px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .trade-title {
            background-color: #F6FAEF;
            border-bottom: 1px solid #285C4D;
            color: #285C4D;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            width: 100%;
            top: 0;
            flex: 1 1;
            position: absolute;
            font-size: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 1px;
        }

        .trade-title-fourweek {
            background-color: #F6FAEF;
            color: #285C4D;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            width: 100%;
            top: 0;
            flex: 1 1;
            position: absolute;
            height: 100%;
            line-height: 35px;
            font-size: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 1px;
        }

        .reserveNeed-title {
            background-color: #FEF3E6;
            border: 1px solid #992901;
            color: #992901;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            width: 100%;
            top: 0;
            flex: 1 1;
            position: absolute;
            font-size: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 2px;
        }

        .reserveNeed-title-fourweek {
            background-color: #FEF3E6;
            color: #992901;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            width: 100%;
            height: 100%;
            line-height: 35px;
            top: 0;
            flex: 1 1;
            position: absolute;
            font-size: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 2px;
        }

        .overtimeIndicatorDivMultipleEvents{
            font-size: 12px !important;
            top: 1px !important;
        }

        .overtimeIndicatorDivSingleEvents{
            font-size: 10px !important;
            left: 0px !important;
        }
    }

    /* Media Query for low resolution  Tablets, Ipads */
    @media (min-width: 481px) and (max-width: 767px) { 
        .schedulerMainDiv {
            position: relative;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            transition: width 0.2s ease-in-out;
            width: 100%;
            padding-right: 5px;
        }

        .profilePic{
            margin-top: 1em!important;
        }

        .event-descriptionCoid {
            color: #1f2532;
            position: absolute;
            top: 30%;
            font-weight: bold;
            font-family: "HCA-Mark","Arial",sans-serif;
            font-size: 9px;
            white-space: pre-line;
            width: 100%;
            justify-content: center;
            text-align: center;
            line-height: 110%;
        }

        .trade-description {
            color: #1f2532;
            position: absolute;
            display: flex;
            top: 55%;
            font-weight: bold;
            font-family: "HCA-Mark","Arial",sans-serif;
            font-size: 9px;
            white-space: pre-line;
            width: 100%;
            justify-content: center;
            text-align: center;
            line-height: 110%;
        }

        .trade-visual {
            position: absolute;
            color: #285C4D;
            text-align: centre;
            right: 76%;
            width: 10%;
            top: 86%;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            font-size: 10px;
            left: 20%;
        }

        .logo-trade-bottom {
            color: #285C4D;
            font-family: 'Material Icons';
            font-weight: normal;
            font-style: normal;
            display: inline-block;
            -webkit-font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
            -moz-osx-font-smoothing: grayscale;
            font-feature-settings: 'liga';
            position: absolute;
            font-weight: bold;
            top: 81%;
            text-align: center;
            font-size: 12px;
        }

        .event-description {
            color: #1f2532;
            position: absolute;
            display: flex;
            top: 55%;
            font-weight: bold;
            font-family: "HCA-Mark","Arial",sans-serif;
            font-size: 9px;
            white-space: pre-line;
            width: 100%;
            justify-content: center;
            text-align: center;
            line-height: 110%;
        }

                .requestNeed-title {
            background-color: #FEF3E6;
            border: 1px solid #992901;
            color: #992901;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            width: 100%;
            top: 0;
            flex: 1 1;
            position: absolute;
            font-size: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 2px;
        }

        .requestNeed-title-fourweek {
            border-top: 1px dashed #992901;
            background-color: #FEF3E6;
            color: #992901;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            width: 100%;
            height: 100%;
            line-height: 35px;
            top: 0;
            flex: 1 1;
            position: absolute;
            font-size: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 2px;
        }

        .event-title {
            background-color: #E5F1F7;
            border-bottom: 1px solid #20558C;
            color: #20558C;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            top: 0;
            flex: 1 1;
            width: 100%;
            position: absolute;
            font-size: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 1px;
        }

        .event-title-sixweek {
            background-color: #E5F1F7;
            color: #20558C;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            top: 0;
            flex: 1 1;
            width: 100%;
            height: 100%;
            line-height: 50px;
            position: absolute;
            font-size: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 1px;
        }

        .event-title-fourweek {
            background-color: #E5F1F7;
            color: #20558C;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            top: 0;
            flex: 1 1;
            width: 100%;
            height: 100%;
            line-height: 35px;
            position: absolute;
            font-size: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 1px;
        }

        .openNeed-title {
            background-color: #F5F5F5;
            border: 1px solid #55575A;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            color: #55575A;
            font-weight: bolder;
            font-size: 10px;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            width: 100%;
            top: 0;
            flex: 1 1;
            padding: 1px 2px 3x 2px;
            position: absolute;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 2px;
        }

        .openNeed-title-fourweek {
            background-color: #F5F5F5;
            border: 1px solid #55575A;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            color: #55575A;
            font-weight: bolder;
            font-size: 10px;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            width: 100%;
            height: 100%;
            line-height: 35px;
            top: 0;
            flex: 1 1;
            padding: 1px 2px 3x 2px;
            position: absolute;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 2px;
        }

        .unavail-title {
            background-color: #FCF0F1;
            top: 0;
            flex: 1 1;
            border-bottom: 1px solid #971B2F;
            color: #971B2F;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            position: absolute;
            width: 100%;
            font-size: 9px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .unavail-title-fourweek {
            background-color: #FCF0F1;
            height: 100%;
            line-height: 35px;
            top: 0;
            flex: 1 1;
            color: #971B2F;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            position: absolute;
            width: 100%;
            font-size: 9px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .trade-title {
            background-color: #F6FAEF;
            border-bottom: 1px solid #285C4D;
            color: #285C4D;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            width: 100%;
            top: 0;
            flex: 1 1;
            position: absolute;
            font-size: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 1px;
        }

        .trade-title-fourweek {
            background-color: #F6FAEF;
            color: #285C4D;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            width: 100%;
            top: 0;
            flex: 1 1;
            position: absolute;
            height: 100%;
            line-height: 35px;
            font-size: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 1px;
        }

        .reserveNeed-title {
            background-color: #FEF3E6;
            border: 1px solid #992901;
            color: #992901;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            width: 100%;
            top: 0;
            flex: 1 1;
            position: absolute;
            font-size: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 2px;
        }

        .reserveNeed-title-fourweek {
            background-color: #FEF3E6;
            color: #992901;
            font-weight: bolder;
            font-family: "HCA-Mark","Arial",sans-serif;
            text-align: center;
            width: 100%;
            height: 100%;
            line-height: 35px;
            top: 0;
            flex: 1 1;
            position: absolute;
            font-size: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 2px;
        }

        .overtimeIndicatorDivMultipleEvents{
            font-size: 12px !important;
            top: 1px !important;
        }

        .overtimeIndicatorDivSingleEvents{
            font-size: 10px !important;
            left: 0px !important;
        }
    } 

    @media (min-width: 768px) and (max-width: 899px){
        .commitContainer{
            max-width: 800px !important;
        }

        .schedulerMainDiv {
            position: relative;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            transition: width 0.2s ease-in-out;
            width: 100%;
            padding-right: 5px;
        }

        .nameInitials {
            flex: 0 0 35%;
            max-width: 35%;
        }

        .commitmentWidget{
            flex: 0 0 65%;
            max-width: 65%;
        }
    }
    /* Media Query for Tablets Ipads portrait mode */
    @media (min-width: 900px) and (max-width: 1024px) {
        .schedulerMainDiv {
            position: relative;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            transition: width 0.2s ease-in-out;
            width: 100%;
            padding-right: 5px;
        }

        .panel-open {
            transition: width 0.2s ease-in-out;
            width: 70%;
        }
    }

    /* Media Query for Laptops and Desktops */
    @media (min-width: 1025px) {
        .schedulerMainDiv {
            position: relative;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            transition: width 0.2s ease-in-out;
            width: 100%;
            padding-right: 5px;
        }

        .panel-open {
            transition: width 0.2s ease-in-out;
            width: 75%;
        }
    }
    .fontBold{
        font-weight:bold !important;
    }
    @media screen
    {
        .paddingDeptView{
            padding-left: 0.625em!important;
            padding-right: 0.625em!important;
        }

        #printHeadingMsg {
            display: none;
            color: red;
            font-size: 12px;
            text-align: center;
        }

        .calDetailsPrint{
            display: none;
        }
    }
    @media print
    {
        .calContainer{
            max-width: 1100px !important;
        }

        .container {
            max-width: 1140px !important;
        }

        .paddingDeptView{
            padding: 0px !important;
        }

        .padd0{
            padding: 0px !important;
        }
        #printHeadingMsg {
            display: block !important;
            color: red !important;
            font-size: 12px !important;
            text-align: center !important;
        }

        .container{
            max-width: 100% !important;
        }

        .nameInitials {
            flex: 0 0 30% !important;
            max-width: 30% !important;
        }

        .commitmentWidget{
            flex: 0 0 70% !important;
            max-width: 70% !important;
        }

        .calDetailsPrint{
            display: block !important;
        }

        .hideFacilityDeptNumber{
            display: none !important;
        }

        .mTop10{
            margin-top: 10px !important;
        }

        .fc-daygrid{
            border-right: none !important;
        }

        .fc-scrollgrid-collapsible{
            min-width: 1099px !important;
        }

        .bg-gray {
            background-color: #777 !important;
        }

        .mTop0{
            margin-top: 0px !important;
        }

        .schedulingHeader{
            min-height: 8.8em !important;
        }
    }
</style>