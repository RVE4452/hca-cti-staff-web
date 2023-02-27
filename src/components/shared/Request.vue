<template>
    <div class="col-12">
        <loading :active="isFullScreenLoading" :can-cancel="false" :height="128" :width="128" :color="loaderColor"
            :opacity="0.7" :is-full-page="true" />
        <div class="bg-black-05 container-fluid">
            <div class="row">
                <div class="col-12 pt3">
                    <p>
                        Estimated PTO Balance:
                        <strong>{{ profileData.ptoBalance }}</strong>
                    </p>
                </div>
                <div class="col-12 neu-margin--bottom-20" v-if="showErrorMsg">
                    <ErrorNotification :errorMsg="errorMsg" :errorType="errorType" />
                </div>
                <div class="col-12 pt3 pb4" v-if="availiableDates.length > 1">
                    <h4>Dates</h4>
                </div>
                <div class="col-12" v-if="availiableDates.length > 1">
                    <div class="row">
                        <div class="col-6 mb3" v-for="dates of availiableDates" v-bind:key="dates">
                            <div @click="selectDates(dates)" v-bind:class="[
                                'pa2 custom-border pointer',
                                {
                                    'neu-background--cerulean-25':
                                        selectedDate.indexOf(dates) >
                                        -1,
                                },
                            ]">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="hr-line"></div>
                </div>
                <div class="col-md-12 pb4">
                    <div class="row">
                        <div class="col-12">
                            <label for="approval_code" class="neu-input__label">Select Shift</label>
                            <template v-if="!additionalRequestEvent">
                                <neu-select                                     
                                    interface="popover" ref="shiftChange" name="ddlShift" :value="shift" @v-neu-change="shiftChange">
                                    <neu-option ref="ddlShiftOptions" v-for="shift in userSchedules.departmentShifts"
                                        :value="shift.departmentShiftId" :key="shift.departmentShiftId">
                                        {{ shift.description }}
                                    </neu-option>
                                </neu-select>
                            </template>

                            <template v-if="additionalRequestEvent">
                                <neu-select                                     
                                    interface="popover"  name="ddlShift" :value="defaultShift"
                                    @v-neu-change="shiftChange">
                                    <neu-option ref="ddlShiftOptions" v-for="shift in userSchedules.departmentShifts"
                                        :value="shift.departmentShiftId" :key="shift.departmentShiftId">
                                        {{ shift.description }}
                                    </neu-option>
                                </neu-select>
                            </template>
                        </div>
                    </div>

                    <div class="row pt3">
                        <div class="col-12">
                            <div class="row">
                                <div class="d-inline-flex w-100">
                                    <div class="col-6">
                                        <label for="partof_day" class="neu-input__label">Start Time</label>
                                        <template v-if="!additionalRequestEvent">
                                            <neu-input name="txtStartTime" :disabled="bindDisabled" :input="startTime"
                                                :value:class="['neu-input__text-field']" type="time" />
                                        </template>

                                        <template v-if="additionalRequestEvent">
                                            <neu-input name="txtStartTime" :input="defaultStartTime" :value:class="[
                                                'neu-input__text-field',
                                                {
                                                    'readonly_text_field starttimecolor': getDisableDuration(additionalRequestEvent),
                                                },
                                            ]" type="time" />
                                        </template>
                                    </div>

                                    <div class="col-6">
                                        <label for="partof_day" class="neu-input__label">Duration</label>
                                        <div v-if="!additionalRequestEvent">
                                            <neu-select :disabled="bindDisabled" id="durationOne" interface="popover"
                                                name="ddlDuration">
                                                <neu-option v-for="duration in durationList" :value="duration.value"
                                                    :key="duration.value">
                                                    {{ duration.label }}
                                                </neu-option>
                                            </neu-select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Comments: textarea -->
                    <div class="row pt3">
                        <div class="col-12">
                            <label for="approval_code" class="neu-input__label">Comments (Optional)</label>
                            <textarea :disabled="bindDisabled" class="neu-textarea" :maxlength="maxCommentsCharacters" v-model="comment" name="Comment"></textarea>
                            <br>
                            <span class="commentCharacterCountText">Remaining {{ maxCommentsCharacters - (comment !=
                                undefined ? comment.length : 0) }} characters.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <neu-button :disabled="bindDisabled" color="primary" fill="raised" class="actionButton d-block"
                        @click="FireAction(additionalRequestEvent)"
                        v-bind:name="'btn' + (currentEvent?.type == 'Request' && additionalRequestEvent == false ? 'Withdraw' : 'AddToSchedule')"
                        data-test="fire-action">Add to Schedule</neu-button>
                </div>
            </div>
        </div>
        <div v-if="isConfirmModalVisible">
            <ConfirmMsgPopUp @cancelled="isConfirmModalVisible = false" @confirmed="confirmedClicked"
                :msgValue="confirmMsgValue"></ConfirmMsgPopUp>
        </div>
    </div>
</template>

<script lang="ts">
import {
    NeuSelect, NeuOption, NeuLabel, NeuInput, NeuButton, NeuTextarea
} from '@neutron/vue'
import { ORSchedule, Event } from "@/models";
import { Options, Vue } from 'vue-class-component';
import moment from "moment";
import { mapState } from "vuex";
import ErrorNotification from "./ErrorNotification.vue";
import ConfirmMsgPopUp from "@/components/shared/ConfirmMsgPopUp.vue";
import { useAppInsights } from '../../store/modules/AppInsights'

class Props {
    calSelectedDates!: any;
    currentEvent!: any;
    additionalRequestEvent!: any;
    dayChanged!: any;
}
@Options({
    computed: {
        ...mapState('schedule', ['requestDetail', 'userSchedules']),
        ...mapState('profile', ['profileData', 'isAdmin', 'isImpersonating', 'appInsightEventData'])
    },
    props: {
        disabled: {
        type: Boolean,
        default: true
    },
    },
    data() {
        return {
            bindDisabled: this.disabled !== true ? { disabled: 'disabled' } : {} as Object | Boolean
        }
    },
    components: {
        NeuSelect, 
        NeuOption, 
        NeuLabel, 
        NeuInput, 
        NeuButton, 
        NeuTextarea,
        ErrorNotification,
        ConfirmMsgPopUp
    },
})

export default class Request extends Vue.with(Props) {
    public requestDetail!: any;
    public data!: any;
    availiableDates: string[] = [];
    buttonCaption: string = "";
    isLoading: boolean = false;
    errorMsg: string = "";
    errorType: string = "error";
    showErrorMsg: boolean = false;
    disableduration: boolean = false;
    maxTimeDuration: any = 12;
    isFullScreenLoading: boolean = false;
    loaderColor: string = "#0085ca";
    isConfirmModalVisible: boolean = false;
    confirmMsgValue: string = '';
    value: string = '';
    maxCommentsCharacters: number = 25;
    public profileData!: any;
    currentSchedule!: ORSchedule;
    isAdmin!: boolean;
    public userSchedules!: any;
    isImpersonating!: boolean;
    appInsightEventData!: any;
    startTime: string = "";
    defaultStartTime: string = "";
    duration: string = "";
    defaultDuration: string = "";
    shift: string = "";
    defaultShift: string = "";
    minutes: string = "";
    hours: number = 0;
    startDateTime: string = "";
    durationList = [];
    availableShifts = [] as any;
    comment: string = "";
    defaultComment: string = "";
    skillId: number = 0;
    staffId: number = 0;
    bindDisabled: Boolean | Object = {};
    selectedDate: string = "";    

    async mounted(): Promise<void> {
        await this.loadData();
        console.log(this.calSelectedDates)
    }

    matchSkillId() {
        console.log("test", this.userSchedules)
        let skills = [] as any
        this.userSchedules.events.filter((item: any) => {
            if (item.departmentShiftId === (this.shift || this.defaultShift)) {
                skills.push(item.skillId)
            }
        })
        this.skillId = skills[0];
    }    

    async loadData() {
        try {
            this.generateTimeList(this.maxTimeDuration);
            this.buttonCaption =
                this.currentEvent.type == "Request" ? "Withdraw" : "Add to Schedule";
            await this.getSelectedDates();
            if (this.currentEvent.type == "Request") {
                this.getRequestEvent();
                this.disableduration = false;
            }
            this.defaultStartTime = "";
            this.defaultDuration = "";
            this.defaultShift = "";
            this.availableShifts = [];
            this.defaultComment = "";            

            for (var i = 0; i < this.profileData.departmentShifts.length; i++) {
                let selectedDate = moment(new Date(
                    this.calSelectedDates.startDate.getTime() -
                    this.calSelectedDates.startDate.getTimezoneOffset() * 60000
                ).toISOString());

                if ((this.profileData.departmentShifts[i].effective === null)
                    && (this.profileData.departmentShifts[i].expires === null)) {
                    this.availableShifts.push(this.profileData.departmentShifts[i]);
                }
                else if ((this.profileData.departmentShifts[i].effective !== null)
                    && (this.profileData.departmentShifts[i].expires !== null)) {
                    if ((this.profileData.departmentShifts[i].effective <= selectedDate) && (this.profileData.departmentShifts[i].expires >= selectedDate)) {
                        this.availableShifts.push(this.profileData.departmentShifts[i]);
                    }
                }
                else if (((this.profileData.departmentShifts[i].effective === null)) && (selectedDate <= moment(this.profileData.departmentShifts[i].expires))) {
                    this.availableShifts.push(this.profileData.departmentShifts[i]);
                }
                else if (((this.profileData.departmentShifts[i].expires === null)) && (selectedDate >= moment(this.profileData.departmentShifts[i].effective))) {
                    this.availableShifts.push(this.profileData.departmentShifts[i]);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    generateTimeList(maxDuration: any): void {
        const hours: any = [];
        for (let hour = 0; hour < maxDuration; hour++) {
            hours.push({
                label: `${hour + 1} hour`,
                value: hour + 1,
            });
        }
        this.durationList = hours;
    }

    widthdrawMode(additionalRequestEvent: any): boolean {
        return Boolean(this.currentEvent?.type == "Request" && additionalRequestEvent == false);
    }

    async getSelectedDates(): Promise<void> {
        var startDate = moment(this.calSelectedDates?.start, "M/D/YYYY");
        var endDate = moment(this.calSelectedDates?.end, "M/D/YYYY");
        var diffDays = endDate.diff(startDate, "days");
        let currentDate: Date = new Date(this.calSelectedDates.startDate);
        this.availiableDates = [];
        for (var i = 0; i < diffDays; i++) {
            const date = moment(currentDate)
                .format("dddd, MMMM DD")
                .toString();
            this.availiableDates.push(date);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        this.selectedDate = JSON.parse(JSON.stringify(this.availiableDates));
    }

    getRequestEvent() {
        var payload = {
            username: this.profileData.username,
            id: this.currentEvent.id
        };

        this.$store
            .dispatch("schedule/GetRequestDetails", payload)
            .then((res: any) => {
                if (this.requestDetail != undefined) {
                    this.shift = this.requestDetail.departmentShiftId;
                    var requestEventStartDateTime = new Date(
                        this.requestDetail.startTime
                    );
                    var requeststartTime = moment(requestEventStartDateTime).format(
                        "hh:mm"
                    );
                    var requestHours = this.requestDetail.hours;
                    this.duration = requestHours;
                    this.startTime = requeststartTime;
                    this.comment = this.requestDetail.comment;
                }
            })
            .catch((err: any) => {
                if (err) {
                    console.log(err); // Handle errors any way you want
                }
            });
    }

    async FireAction(additionalRequestEvent: any) {
        if (!this.widthdrawMode(additionalRequestEvent)) {
            //If there is no email address present in profile then doesn't allow them to send Non-productive shift request]
            if (this.profileData.email == null ||
                this.profileData.email == undefined || this.profileData.email == "") {
                this.showErrorMsg = true;
                this.errorMsg = "Request Failed: There is no email address associated with your profile. To update this information, contact your manager, FSA, or call HCA HR Answers at 1-844-HR-ANSWR(472-6797)."
                return;
            }
            this.isLoading = true;

            let requestBody = {
                staffId: this.profileData.staffId,
                skillId: this.skillId,
                departmentId: this.profileData.departmentId,
                departmentShiftId: additionalRequestEvent ? this.defaultShift : this.shift,
                start: new Date(
                    this.calSelectedDates?.startDate.getTime() -
                    this.calSelectedDates?.startDate.getTimezoneOffset() * 60000
                ),
                
                end: new Date(
                    this.calSelectedDates?.endDate.getTime() -
                    this.calSelectedDates?.endDate.getTimezoneOffset() * 60000
                ),
                comment: additionalRequestEvent ? this.defaultComment : this.comment,
                email: this.profileData.email,
                status: "Pending"
            };
            for (var i = 0; i < this.selectedDate?.length; i++) {
                var eventStartDateTime = new Date(this.selectedDate[i]);
                if (!additionalRequestEvent) {
                    eventStartDateTime.setHours(
                        Number(this.startTime.split(":")[0]),
                        Number(this.startTime.split(":")[1])
                    );
                }
                else {
                    eventStartDateTime.setHours(
                        Number(this.defaultStartTime.split(":")[0]),
                        Number(this.defaultStartTime.split(":")[1])
                    );
                }
                eventStartDateTime.setFullYear(
                    this.calSelectedDates.startDate.getFullYear()
                );
                let objReq = {
                    departmentShiftId: additionalRequestEvent ? this.defaultShift : this.shift,
                    startDateTime: new Date(
                        eventStartDateTime.getTime() -
                        eventStartDateTime.getTimezoneOffset() * 60000
                    ), // Add Time
                    hours: Number(additionalRequestEvent ? this.defaultDuration : this.duration), // Add Hours
                    minutes: 0,
                };
            }
            this.isFullScreenLoading = true;
            this.$store
                .dispatch("schedule/RequestSchedule", requestBody)
                .then(() => {
                    // showing message in MyScheduleView Screen and close modal only on success
                    this.isFullScreenLoading = false;
                    this.$emit(
                        "showSuccessMsgPopUp",
                        true,
                        "Time off request successfully submitted."
                    );
                    this.$emit("closeSharedModal");
                    useAppInsights().trackEvent({
                        name: 'CreateRequests', properties:
                            JSON.parse(JSON.stringify(this.appInsightEventData))
                    });
                })
                .finally(() => { this.isLoading = false; this.isFullScreenLoading = false; })
                .catch((err: any) => {
                    this.isFullScreenLoading = false;
                    if (err) {
                        let parseResponse =
                            err.request.response != ""
                                ? err.request.response
                                : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";

                        this.showErrorMsg = true;
                        this.errorMsg = parseResponse;
                    }
                });
        }
        else //
        {
            if (this.profileData.selfScheduleToCommitment == true) {
                if (this.isBelowCommitment()) {
                    this.confirmMsgValue = "By withdrawing this request, you will be under your shift commitment. Do you want to proceed?";
                    this.isConfirmModalVisible = true;
                }
                else {
                    this.confirmMsgValue = "This shift request will be removed. Do you want to proceed?";
                    this.isConfirmModalVisible = true;
                }
            }
            else {
                this.confirmMsgValue = "This shift request will be removed. Do you want to proceed?";
                this.isConfirmModalVisible = true;
            }
        }
    }

    selectDates(date: string): void {
        const selectedDates: any = this.selectedDate;
        const index = selectedDates.indexOf(date);
        if (index > -1) {
            selectedDates.splice(index, 1);
        } else {
            selectedDates.push(date);
        }
    }

    shiftChange(event: CustomEvent): void {
        console.log("event", event);
        let defaultDuration = this.profileData.partOfDayDuration;
        let defaultStartTime = this.formatTime(this.profileData.partOfDayStartTime).toString();

        this.generateTimeList(this.maxTimeDuration);
        this.shift = event.detail.value;
        this.defaultShift = event?.detail.value;
        this.duration = defaultDuration;
        this.defaultDuration = defaultDuration;
        this.startTime = defaultStartTime;
        this.defaultStartTime = defaultStartTime;
        this.disableduration = true;
        this.bindDisabled = false;

        if (this.showErrorMsg) {
            this.showErrorMsg = false;
            this.errorMsg = "";
        }

        this.matchSkillId();     
    }

    formatTime(t: Date): string {
        return moment(t).format("HH:mm:ss");
    }


    getDisableDuration(additionalRequestEvent: any) {

        var isDisabled = false;
        if (this.currentEvent?.type == "Request" && !additionalRequestEvent) {
            isDisabled = true;
        }

        else if (this.currentEvent?.type == "Request" && additionalRequestEvent) {
            isDisabled = this.disableduration;
        }

        else if (this.currentEvent?.type != "Request") {
            isDisabled = this.disableduration;
        }
        return !isDisabled;
    }

    async confirmedClicked() {
        this.isLoading = true;
        this.isConfirmModalVisible = false;
        this.isFullScreenLoading = true;
        await this.$store
            .dispatch("schedule/WithdrawRequestEvent", this.requestDetail.requestId)
            .then(() => {
                this.isFullScreenLoading = false;
                this.$emit("showSuccessMsgPopUp");
                this.$emit("closeSharedModal");
            })
            .finally(() => { this.isLoading = false; this.isFullScreenLoading = false; })
            .catch((err: any) => {
                this.isFullScreenLoading = false;
                this.$emit("showSuccessMsgPopUp", false);
                if (err) {
                    let parseResponse =
                        err.request.response != ""
                            ? err.request.response
                            : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
                    this.showErrorMsg = true;
                    this.errorMsg = parseResponse;
                }
            });

    }

    isBelowCommitment() {
        let currdate = this.currentEvent.date;
        let currsched = this.userSchedules.length ? this.userSchedules[0] : null;
        currsched = null;

        this.userSchedules.forEach((sched: any) => {
            let startDt, endDt, currDt;
            startDt = sched.startDate;
            currDt = currdate;
            endDt = sched.endDate;
            if (
                new Date(startDt) <= new Date(currDt) &&
                new Date(endDt) > new Date(currDt)
            ) {
                currsched = sched;
                return;
            }
        });

        let totalHrs = 0,
            totalMins = 0,
            weekStartDate: Date = new Date(currsched.startDate),
            weekEndDate: Date = new Date(currsched.startDate),
            weekEvents!: Event[],
            weekHours: number,
            isOverallCommitmentBelow: boolean = false,
            isWeekendCommitmentBelow: boolean = false;

        for (var i = 0; i < this.profileData.weeksInSchedule; i++) {
            if (i == 0) {
                weekEndDate.setDate(weekStartDate.getDate() + 6);
            }
            else {
                weekStartDate.setDate(weekStartDate.getDate() + 7);
                weekEndDate.setDate(weekStartDate.getDate() + 6);
            }

            if (weekStartDate <= new Date(currdate) && new Date(currdate) <= weekEndDate) {
                weekEvents = currsched.events.filter(
                    (event: Event) =>
                        new Date(event.date) >= weekStartDate &&
                        new Date(event.date) <= weekEndDate && event.isCommitment == true &&
                        (event?.type == "Pending" || event?.type == "Assignment" || event?.type == "Request")
                );

                weekEvents.forEach((event: Event) => {
                    totalHrs += event.hours;
                    totalMins += event.minutes;
                });
                if (this.currentEvent.isCommitment) {
                    weekHours = Math.round((totalHrs + (totalMins / 60)) - (this.currentEvent.hours + (this.currentEvent.minutes / 60)));
                }
                else {
                    weekHours = Math.round((totalHrs + (totalMins / 60)));
                }
                if (this.currentEvent.isWeekend) {
                    let weekendScheduledEvents: Event[] = currsched.events.filter(
                        (event: Event) =>
                            new Date(event.date) >= new Date(currsched.startDate) &&
                            new Date(event.date) <= new Date(currsched.endDate) &&
                            (event?.type == "Pending" || event?.type == "Assignment" || event?.type == "Request") &&
                            event.isWeekend
                    );

                    if (this.profileData.displayWSC) {
                        if ((weekendScheduledEvents.length - 1) >= this.profileData.reqCountWSC) {
                            isWeekendCommitmentBelow = false;
                        }
                        else {
                            isWeekendCommitmentBelow = true;
                        }
                    }
                    else {
                        isWeekendCommitmentBelow = false;
                    }
                }
                if (weekHours < this.profileData.guarenteedHours || isWeekendCommitmentBelow) {
                    isOverallCommitmentBelow = true;
                }
                break;
            }
        }
        return isOverallCommitmentBelow;
    }
}
</script>
<style scoped="">
.starttimecolor {
    color: gray;
}

.neu-input__text-field {
    padding: 0 0.30rem;
}

.commentCharacterCountText {
    font-size: .875rem;
    float: right;
}

.text-small {
    font-size: 0.9em;
}

.text-right {
    text-align: right;
}
</style>