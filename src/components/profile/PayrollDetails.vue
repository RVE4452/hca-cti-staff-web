<template>
    <div v-if="profileData" class="overflowHide">
        <div class="row neu-margin--top-20 neu-margin--bottom-20">
            <div class="col-sm-10 neu-margin--bottom-20" v-if="showErrorMsg">
                <ErrorNotification :errorMsg="errorMsg" :errorType="errorType" />
            </div>
            <div class="col-sm-3 neu-input">
                <label for="txtFromDate" class="neu-input__label">From</label>
                <input class="neu-input__text-field"
                       type="date"
                       id="txtFromDate"
                       v-model="fromDateVal" />
            </div>
            <div class="col-sm-3 neu-input">
                <label for="txtToDate" class="neu-input__label">To</label>
                <input class="neu-input__text-field"
                       type="date"
                       id="txtToDate"
                       v-model="toDateVal" />
            </div>
            <div class="col-sm-1 neu-margin--top-20 w100 no-print">
                <button @click="getPayrollDetails" class="neu-button--primary neu-button neu-button--raised">
                    Go
                </button>
            </div>
        </div>
        <div class="neu-container neu-margin--top-20 neu-margin--bottom-20">
            <template v-if="payrollDetails.length > 0">
                <table class="neu-table">
                    <tr class="th_HeaderRow">
                        <th class="neu-input__label  purpleColor">Schedule</th>
                        <th class="neu-input__label  redColor">Actual</th>
                    </tr>

                    <tr  v-for="payrollDetail in payrollDetails" :key="payrollDetails.indexOf(payrollDetail)">
                        <td class="silverBorder">
                            <div class="div_centered neu-input__label" v-if="payrollDetail.departmentId != 0">
                                {{ formatDate(payrollDetail.start) }}
                                <br />
                                <span class="purpleColor">{{payrollDetail.shiftCode}} {{formatTime(payrollDetail.start)}} - {{formatTime(payrollDetail.end)}} </span>
                                <br />
                                Dept : {{payrollDetail.departmentCode}}
                            </div>
                        </td>
                        <td class="silverBorder">
                            <div class="div_centered neu-input__label" 
                                 v-for="clockInOut in payrollDetail.clockInOuts" :key="payrollDetail.clockInOuts.indexOf(clockInOut)">
                                {{ formatDate(clockInOut.inDateTime) }}
                                <br />
                                <span style="font-weight:bold;">{{clockInOut.code}}</span>
                                <br />
                                <span class="redColor">
                                    {{formatTime(clockInOut.inDateTime)}} - {{clockInOut.outDateTime != null ? formatTime(clockInOut.outDateTime) : ''}}
                                </span>
                                <span style="font-weight:bold;">
                                    [ {{totalHours(clockInOut.inDateTime, clockInOut.outDateTime)}} hrs ]
                                </span>
                                <br />
                                Dept : {{clockInOut.departmentCode }}
                            </div>

                        </td>
                    </tr>
                </table>
            </template>
            <template v-else>
                <div class="neu-input__label" style="text-align:center;">No data exist</div>
            </template>
        </div>
    </div>

</template>

<script lang="ts">
     import { Options, Vue } from 'vue-class-component';
    import moment from "moment";
    import { mapState } from "vuex";
    import { ScheduleActualCIOD } from "@/models";
    import ErrorNotification from "@/components/shared/ErrorNotification.vue";
    import { useAppInsights } from '../../store/modules/AppInsights'
    
    @Options({ components: { ErrorNotification },
     computed: {
            ...mapState('profile', ['profileData','appInsightEventData']),
             ...mapState('schedule', ['userSchedules','payrollDetails']),
        }, })
    export default class PayrollDetails extends Vue {
       
        public profileData!: any;
        public userSchedules!: any;
        public payrollDetails!: ScheduleActualCIOD[];
        appInsightEventData!: any;
        fromDateVal: string = new Date().toISOString().substr(0, 10);
        toDateVal: string = new Date().toISOString().substr(0, 10);
        errorMsg: string = '';
        errorType: string = 'error';
        showErrorMsg: boolean = false;
        
        async mounted() { 
            this.getCurrentPayperiod();             
            useAppInsights().trackEvent({name:'ViewPayrollDetails',properties: 
               JSON.parse(JSON.stringify(this.appInsightEventData))
            });
        }

        async getCurrentPayperiod() {
            if (this.userSchedules.length == 0) {
                var payload = {
                    username: this.profileData.username,
                    index: 0,
                };

                await this.$store.dispatch("schedule/getAllUserSchedules", payload);
            }
            if (this.userSchedules.length != 0) {
                let currDt = new Date(new Date().setHours(0,0,0,0));
                let currsched;
                this.userSchedules.forEach((sched: any) => {
                    let startDt, endDt;
                    startDt = sched.startDate;
                    endDt = sched.endDate;
                    if (new Date(startDt) <= new Date(currDt) &&
                        new Date(endDt) >= new Date(currDt)) //
                    {
                        currsched = sched;
                        var PayperiodCount = (this.profileData.weeksInSchedule / 2);
                        var sdate = new Date(currsched.startDate);
                        var payperiodStartDate!: any;
                        var payperiodEndDate!: any;
                        for (var i = 0; i < PayperiodCount; i++) {
                            if (i == 0) {
                                payperiodStartDate = sdate;
                                payperiodEndDate = moment(sdate).add(13, 'days');
                            }
                            else {
                                payperiodStartDate = moment(payperiodStartDate).add(14, 'days');
                                payperiodEndDate = moment(payperiodStartDate).add(13, 'days');
                            }
                            if (new Date(payperiodStartDate) <= new Date(currDt) &&
                                new Date(payperiodEndDate) >= new Date(currDt)) {
                                this.fromDateVal = new Date(payperiodStartDate).toISOString().substr(0, 10);
                                this.toDateVal = new Date(payperiodEndDate).toISOString().substr(0, 10);
                                this.getPayrollDetails();
                                break;
                            }
                        }
                        return;
                    }
                });
            }
        }

        async getPayrollDetails() {
            if (this.validateDates()) {
                var payload = {
                    startDate: this.fromDateVal,
                    endDate: this.toDateVal,
                    username: this.profileData.username,
                };
                
                await this.$store.dispatch('schedule/getPayrollDetails', payload)
                    .then((res: any) => {
                        
                    })
                    .catch((err: any) => {
                        if (err) {
                            console.log(err);
                        }
                    });
            }
        }
        validateDates() {
            var fromDt = moment(this.fromDateVal, 'YYYY-MM-DD');
            var toDt = moment(this.toDateVal, 'YYYY-MM-DD');
            if (fromDt.isValid() == false || toDt.isValid() == false) {
                this.showErrorMsg = true;
                if (fromDt.isValid() == true && toDt.isValid() == false) {
                    this.errorMsg = "Please enter valid To Date"
                }
                else if (fromDt.isValid() == false && toDt.isValid() == true) {
                    this.errorMsg = "Please enter valid From Date"
                }
                else {
                    this.errorMsg = "Please enter valid From and To Dates"
                }
            }
            else {
                var dateDiff = moment.duration(toDt.diff(fromDt)).asDays();
                if (dateDiff > 14) {
                    this.showErrorMsg = true;
                    this.errorMsg = "Date Range cannot be greater than 14 days."
                }
                else if (dateDiff <= 0) {
                    this.showErrorMsg = true;
                    this.errorMsg = "To Date should be greater than From Date."
                }
                else {
                    this.showErrorMsg = false;
                }
            }
            if (this.showErrorMsg) {
                return false;
            }
            else {
                return true;
            }
        }
        formatDate(date: Date): string {
            return moment(date).format("dddd, MMMM DD yyyy");
        }
        formatTime(t: Date): string {
            return moment(t).format("h:mm A");
        }
        totalHours(sDate: Date, eDate: Date) {
            var totalHours = "0.00";

            if(sDate != null && eDate != null){
                var sDateVal: any = new Date(new Date(sDate).setSeconds(0,0));
                var eDateVal: any = new Date(new Date(eDate).setSeconds(0,0));
                totalHours = (Math.abs(sDateVal - eDateVal) / 36e5).toFixed(2);
            }
             
            return totalHours;
        }
    }
</script>

<style scoped>
    .th_HeaderRow {
        position: sticky;
        top: 0;
        z-index: 3;
        width: 25vw;
        background: white;
        font-weight: bold;
        padding: 20px;
    }
    .silverBorder {
        border: 1px solid silver;
    }
    .purpleColor {
        color: #663399;
        font-weight: bold;
    }
    .redColor {
        color: #CC0000;
        font-weight: bold;
    }
    .content-centre-align {
        padding: 10px;
        vertical-align: middle;
    }
    .div_centered {
        margin: 40px;
        justify-content: center;
        border: 1px solid silver;
        padding: 10px;
    }

    /* Media Query for Mobile Devices */
    @media (max-width: 480px) {
        .div_centered {
            margin: 5px !important;
        }
    }

    /* Media Query for low resolution  Tablets, Ipads */
    @media (min-width: 481px) and (max-width: 899px) {
        .div_centered {
            margin: 5px !important;
        }

        .overflowHide{
            overflow-x: hidden;
        }

        .w100{
            max-width: 100% !important;
        }
    }
</style> 
