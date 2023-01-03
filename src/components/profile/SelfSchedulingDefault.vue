<template>
    <div>
        <div class="schedulerDefaultMainDiv">
            <div class="neu-margin--bottom-20 neu-margin--top-10 neu-text--caption">
                Create a self-scheduling template by adding your preferred shifts below.
                <br />
                Apply preferences during your self-scheduling period and make edits as needed before submitting.
                <br />
                <br />
                The dates below correspond to the days and weeks in a scheduling period such as the first Monday or second Saturday.
            </div>
            <notifications group="smspreference" position="top center" />

            <div class="col-12 neu-margin--bottom-20" v-if="showErrorMsg">
                <ErrorNotification :errorMsg="errorMsg" :errorType="errorType" />
            </div>
            <div class="row">
                <div class="col-sm-12 neu-margin--bottom-20">
                    <FullCalendar :options="calendarOptions" ref="fullCalendarSelfSchedulingDefaults">
                    </FullCalendar>
                </div>
            </div>
            <div>
                <button @click="saveChanges" :class="[isSaveBtnEnabled ? 'neu-button--primary neu-button neu-button--raised no-print' : ' neu-button--blue-disabled neu-button neu-button--raised no-print']" :disabled="!isSaveBtnEnabled">
                    Save Changes
                </button>
                <span class="btnDiv neu-text--caption spnNote">
                    <b>Note: </b> Shifts requested during self-scheduling are not guaranteed to be honored.
                </span>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { Options, Vue } from 'vue-class-component';
    import moment from "moment";
    import { mapState } from "vuex";
    import SaveMsgPopUp from "@/components/shared/SaveMsgPopUp.vue";
    import SelfSchedulingDefaultModal from "./SelfSchedulingDefaultModal.vue";
    import { SelfScheduleDefaultShift}  from "@/models";
   
    //import Loading from 'vue-loading-overlay';
    import ErrorNotification from "../shared/ErrorNotification.vue";

    import FullCalendar from "@fullcalendar/vue3";
    // import dayGridPlugin, { DayGridView } from "@fullcalendar/daygrid";
    // import adaptivePlugin from '@fullcalendar/adaptive';
    // import interactionPlugin from "@fullcalendar/interaction";
    import tippy from 'tippy.js';
    import 'tippy.js/dist/tippy.css';
   class Props{
    ssdCounter!: number;
   }

    @Options({
         computed: {
            ...mapState('profile', ['profileData','isImpersonating']),
            ...mapState('profile', ['schedule','defaultSelfSchedules']),
        },
        components: { FullCalendar, SaveMsgPopUp, SelfSchedulingDefaultModal,  ErrorNotification }
    })
    export default class SelfSchedulingDefault extends Vue.with(Props) {
        
        public profileData!: any;
        public defaultSelfSchedules!: any;
        isImpersonating!: boolean;
        private defaultSelfScheduleCalendarApi: any;
        private sharedToggle: boolean = false;
        public defaultShifts!: any;

        declare $refs: {
            fullCalendarSelfSchedulingDefaults: HTMLFormElement
        };
        weeksInSchedule: number = 4;//6;
        calSelectedDates: any = {};
        currentShift!: any;
        dssData!: any;
        isSaveBtnEnabled: boolean = false;
        errorMsg: string = '';
        errorType: string = 'error';
        showErrorMsg: boolean = false;
        msgValue: string = '';
        classFlag: string = '';
        

        private calendarOptions: any = {
            schedulerLicenseKey: '0712583610-fcs-1643842135',
            plugins: [
                // adaptivePlugin,
                // dayGridPlugin,
                // interactionPlugin,
            ],
            initialView: 'dayGridMonth',
            duration: { weeks: this.weeksInSchedule },
            dateIncrement: { weeks: this.weeksInSchedule },
            views: {
                dayGrid: {
                    type: "dayGrid", // Applicable for: dayGrid and dayGridMonth
                    fixedWeekCount: true,
                    showNonCurrentDates: false,
                },
            },
            visibleRange: {
                start: '2022-05-01',
                end: '2023-05-28'
            },
            headerToolbar: false,
            editable: true,
            eventStartEditable: false,
            selectable: true,
            selectMirror: true,
            dayMaxEvents: false,
            weekends: true,
            dayCellDidMount: function (info:any) {
                    if (moment(info.date).format("M") == "6") // if its June month started
                    {
                        var monthDay = moment(info.date).format("D");
                        var sixWeekCalendarDay = (Number(monthDay) + 31).toString();
                        info.dayNumberText = sixWeekCalendarDay;
                        if (info.el.childNodes[0].childNodes[0].childNodes[0].childNodes.length > 0) {
                            info.el.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeValue = sixWeekCalendarDay;
                        }
                    }
            },
            select: this.handleDateSelect,
            eventClick: this.handleEventClick,
            eventDidMount: function (info:any) {
                if (info.event.extendedProps.type.includes("Need") && !info.event.extendedProps.needFV) {
                    info.el.parentElement?.parentElement?.style.removeProperty("border");
                    info.el.parentElement?.parentElement?.style.removeProperty("background");
                }
                else {
                    info.el.parentElement?.parentElement?.style.setProperty("border", "none");
                    info.el.parentElement?.parentElement?.style.setProperty("background", "none");
                }
            },
            eventWillUnmount: function (info:any) {
                if (info.el?.parentElement?.nextElementSibling?.className == 'fc-daygrid-day-bottom' && info.el?.parentElement?.previousElementSibling?.className != 'fc-daygrid-event-harness') {
                    info.el.parentElement?.parentElement?.style.removeProperty("border");
                    info.el.parentElement?.parentElement?.style.removeProperty("background");
                }
            },
            eventContent: function (arg: any) {
                let italicEl = document.createElement("div");
                if (arg.event.extendedProps.type.includes("Pending")) {
                    let descriptionChild = document.createElement("div");
                    descriptionChild.innerHTML = arg.event.extendedProps.description;
                    descriptionChild.classList.add("event-descriptionNew");
                    italicEl.appendChild(descriptionChild);
                    italicEl.classList.add("main-reserveNew");
                }

                let arrayOfDomNodes = [italicEl];
                return {
                    domNodes: arrayOfDomNodes,
                };
            },
        };

        //@Watch('ssdCounter', { immediate: true }) 
        onSSPChanges() {
            if (this.ssdCounter > 0) {
                this.getDefaultSelfSchedules(true);
                setTimeout(() => this.defaultSelfScheduleCalendarApi.updateSize(), 300);
            }
            else if (this.ssdCounter < 0) {
                setTimeout(() => this.defaultSelfScheduleCalendarApi.updateSize(), 300);
            }
        }

        async mounted() {
            this.getDefaultSelfSchedules(false);
        }

        async getDefaultSelfSchedules(refreshFlag: boolean) {
            this.weeksInSchedule = this.profileData.weeksInSchedule; //6;
            this.defaultSelfScheduleCalendarApi = this.$refs.fullCalendarSelfSchedulingDefaults.getApi();
            this.defaultSelfScheduleCalendarApi.changeView("dayGrid");
            this.defaultSelfScheduleCalendarApi.gotoDate("2022-05-01");

            if (!refreshFlag) {
                await this.$store
                    .dispatch("schedule/getDefaultSelfSchedules", { username: this.profileData.username })
                    .then((res: any) => {
                        this.setCalendarEvents();
                    })
                    .catch((err: any) => {
                        if (err) {
                            console.log(err); // Handle errors any way you want
                        }
                    });
            }
            else {
                this.refreshCalendar();
            }

            this.defaultSelfScheduleCalendarApi.changeView("dayGrid");
            this.defaultSelfScheduleCalendarApi.setOption('duration', { weeks: this.weeksInSchedule });
            this.defaultSelfScheduleCalendarApi.setOption('dateIncrement', { weeks: this.weeksInSchedule });

            if (this.weeksInSchedule == 6) {
                this.defaultSelfScheduleCalendarApi.setOption('height', 800);
            }
            else {
                this.defaultSelfScheduleCalendarApi.setOption('height', 550);
            }
        }

        setCalendarEvents() {
            this.defaultShifts = [];
            this.defaultSelfScheduleCalendarApi.removeAllEvents();
            if (this.defaultSelfSchedules == "") {
                if (localStorage.getItem("DefaultSelfSchedule") != null) {
                    this.dssData = JSON.parse(localStorage.getItem('DefaultSelfSchedule') || '{}');
                }
                else {
                    this.dssData = {};
                }
            }
            else {
                if (localStorage.getItem("DefaultSelfSchedule") != null) {
                    this.dssData = JSON.parse(localStorage.getItem('DefaultSelfSchedule') || '{}');
                }
                else {
                    this.dssData = this.defaultSelfSchedules;
                }
            }

            if (this.dssData.defaultShifts != undefined) {
                this.dssData.defaultShifts.forEach((shift: SelfScheduleDefaultShift) => {
                    let cellTitle: string;
                    this.defaultShifts.push(shift);
                    cellTitle = "";
                    this.defaultSelfScheduleCalendarApi.addEvent({
                        id: shift.id,
                        title: cellTitle,
                        start: shift.date,
                        end: shift.date,
                        type: 'Pending',
                        description: shift.shiftDescription,
                        descriptionCoid: (shift.coid + ' - ' + shift.departmentCode),
                        facilityDeptName: (shift.facilityName + ' - ' + shift.departmentName)
                    });
                });
            }

            if (localStorage.getItem("DefaultSelfSchedule") == null) {
                localStorage.setItem("DefaultSelfSchedule", JSON.stringify(this.dssData));
            }
            this.displaySaveButtonVisibility();
        }

        refreshCalendar() {
            this.defaultShifts = [];
            this.defaultSelfScheduleCalendarApi.removeAllEvents();
            this.dssData = JSON.parse(localStorage.getItem("DefaultSelfSchedule") || '{}');
            if (this.dssData != undefined || this.dssData != null) {
                this.dssData.defaultShifts.forEach((shift: SelfScheduleDefaultShift) => {
                    let cellTitle: string;
                    this.defaultShifts.push(shift);
                    cellTitle = "RESERVED";
                    this.defaultSelfScheduleCalendarApi.addEvent({
                        id: shift.id,
                        title: cellTitle,
                        start: shift.date,
                        end: shift.date,
                        type: 'Pending',
                        description: shift.shiftDescription,
                        descriptionCoid: (shift.coid + ' - ' + shift.departmentCode),
                        facilityDeptName: (shift.facilityName + ' - ' + shift.departmentName)
                    });
                });
            }
            this.displaySaveButtonVisibility();
        }

        displaySaveButtonVisibility() {
            if (this.defaultSelfSchedules == "") {
                if (this.dssData.defaultShifts != undefined && !this.isImpersonating) {
                    this.isSaveBtnEnabled = true;
                }
                else {
                    this.isSaveBtnEnabled = false;
                }
            }
            else if (this.defaultSelfSchedules != "") {
                if (this.dssData.defaultShifts != undefined) {
                    var i:number, j: number;
                    for (i = 0; i < this.dssData.defaultShifts.length; i++) {
                        var isAddedShiftExist = this.defaultSelfSchedules.defaultShifts.find((x:any) => x.id == this.dssData.defaultShifts[i].id);
                        if (isAddedShiftExist == null) // it means Shift is newly added
                        {
                            this.isSaveBtnEnabled = true;
                            break;
                        }
                        else {
                            this.isSaveBtnEnabled = false;
                        }
                    }

                    if (!this.isSaveBtnEnabled) {
                        for (j = 0; j < this.defaultSelfSchedules.defaultShifts.length; j++) {
                            var isWithdrawnShiftExist = this.dssData.defaultShifts.find((x:any) => x.id == this.defaultSelfSchedules.defaultShifts[j].id);
                            if (isWithdrawnShiftExist == null) // it means Shift is withdrawn
                            {
                                this.isSaveBtnEnabled = true;
                                break;
                            }
                            else {
                                this.isSaveBtnEnabled = false;
                            }
                        }
                    }
                }
                else {
                    this.isSaveBtnEnabled = true;
                }
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
            this.calSelectedDates = { startDate: selectInfo.start, endDate: selectInfo.end };
            this.sharedToggle = true;
            this.currentShift = {};
            window.scrollTo(0, 0);
            this.$emit("showSidePanelCS", {
                sharedToggle: this.sharedToggle,
                currentShift: this.currentShift,
                calSelectedDates: this.calSelectedDates
            });
            setTimeout(() => this.defaultSelfScheduleCalendarApi.updateSize(), 300);
        }

        handleEventClick(clickInfo: any) {
            this.processClickEvent(clickInfo.event.title, clickInfo.event.start, clickInfo.event.id, clickInfo.event.extendedProps.needFV);
        }

        processClickEvent(cellTitle:any, eventStart:Date, eventId:string, needFV:any) {
            const shift = this.defaultShifts.find((shift: SelfScheduleDefaultShift) => shift.id === eventId);
            if (shift) {
                this.currentShift = shift;
                let clickEventNextDate: Date = new Date(shift.date);
                clickEventNextDate.setDate(clickEventNextDate.getDate() + 1);
                this.calSelectedDates = { startDate: eventStart, endDate: clickEventNextDate };
                this.sharedToggle = true;
                window.scrollTo(0, 0);
                this.$emit("showSidePanelCS", {
                    sharedToggle: this.sharedToggle,
                    currentShift: this.currentShift,
                    calSelectedDates: this.calSelectedDates
                });
                setTimeout(() => this.defaultSelfScheduleCalendarApi.updateSize(), 300);
            }
        }

        async saveChanges() {
            if (!this.showErrorMsg) {
                await this.$store.dispatch('schedule/saveDefaultSelfSchedules', this.dssData)
                    .then((res: any) => {
                        this.isSaveBtnEnabled = false;
                        window.scrollTo(0, 0);
                        this.msgValue = 'Your changes have been saved.';
                        this.classFlag = 'success';
                        this.$emit("showNotificationModalCS", {
                            successFlag: this.classFlag,
                            msgValue: this.msgValue
                        });

                    })
                    .catch((err: any) => {
                        if (err) {
                            console.log(err);
                            let parseResponse = err.request.responseText != "" ? JSON.parse(err.request.responseText) : err.request.responseText;
                            this.showErrorMsg = true;
                            this.errorMsg = (parseResponse.result != null || parseResponse.result != undefined) ? JSON.parse(parseResponse.result).Message : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
                        }
                    });
            }
        }
    }

</script>

<style lang="css">

    .event-descriptionNew {
        color: #1f2532;
        position: absolute;
        display: flex;
        font-weight: bold;
        font-family: "HCA-Mark","Arial",sans-serif;
        font-size: 11px;
        white-space: pre-line;
        width: 100%;
        justify-content: center;
        text-align: center;
        line-height: 110%;
    }

    .main-reserveNew {
        width: 100% !important;
        height: 100%;
        display: flex;
        align-items: center;
        flex-grow: 1;
        position: absolute;
        border: 1px dashed #992901;
        cursor: pointer;
    }

        .main-reserveNew:hover {
            background-color: lightgray;
        }

    .btnDiv {
        display: inline-block;
        margin-left: 25px;
    }

    .neu-button--blue-disabled, .neu-button--blue-disabled:hover, .neu-button--blue-disabled:focus, .neu-button--blue-disabled:active {
        background-color: gray;
        color: #ffffff;
        outline: none;
        cursor: not-allowed;
    }
    /* Media Query for Mobile Devices */
    @media (max-width: 480px) {
        .schedulerDefaultMainDiv {
            position: relative;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            transition: width 0.2s ease-in-out;
            width: 100%;
            padding-right: 5px;
        }

        .spnNote {
            margin-top: 1rem !important;
            margin-left: 0 !important;
        }
    }

    /* Media Query for low resolution  Tablets, Ipads */
    @media (min-width: 481px) and (max-width: 899px) {
        .schedulerDefaultMainDiv {
            position: relative;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            transition: width 0.2s ease-in-out;
            width: 100%;
            padding-right: 5px;
        }

        .spnNote {
            margin-top: 1rem !important;
            margin-left: 0 !important;
        }
    }

    /* Media Query for Tablets Ipads portrait mode */
    @media (min-width: 900px) and (max-width: 1024px) {
        .schedulerDefaultMainDiv {
            position: relative;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            transition: width 0.2s ease-in-out;
            width: 100%;
            padding-right: 5px;
        }
    }

    /* Media Query for Laptops and Desktops */
    @media (min-width: 1025px) {
        .schedulerDefaultMainDiv {
            position: relative;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            transition: width 0.2s ease-in-out;
            width: 100%;
            padding-right: 5px;
        }
    }
</style>