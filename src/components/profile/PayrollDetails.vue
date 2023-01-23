<template>
    <div v-if="profileData" class="overflowHide">
        <div class="row neu-margin--top-20 neu-margin--bottom-20">
            <div class="col-sm-10 neu-margin--bottom-20" v-if="showErrorMsg">
                <ErrorNotification :errorMsg="errorMsg" :errorType="errorType" />
            </div>

            <neu-container class="bg-transparent">
                <neu-row>
                    <neu-col xxl="3" xl="3" lg="4" md="3" sm="6" cols="12">
                        <label for="txtFromDate" class="neu-input__label">From</label>
                        <input class="neu-input__text-field" type="date" id="txtFromDate" v-model="fromDateVal" />
                    </neu-col>

                    <neu-col xxl="3" xl="3" lg="4" md="3" sm="6" cols="12">
                        <label for="txtToDate" class="neu-input__label">To</label>
                        <input class="neu-input__text-field" type="date" id="txtToDate" v-model="toDateVal" />
                    </neu-col>

                    <neu-col xxl="2" xl="2" lg="2" md="2" sm="6" cols="12" class="text-right">
                        <neu-button color="primary" class="neu-margin--top-20 w-100 no-print" fill="raised"
                            @click="getPayrollDetails">
                            Go
                        </neu-button>
                    </neu-col>

                    <neu-col xxl="3" xl="3" lg="4" md="3" sm="6" cols="12" class="mt-5 pt-2 ml-2">
                        <label class="card-text mt-4">PTO Balance: 300</label>
                    </neu-col>
                </neu-row>
            </neu-container>
        </div>

        <div class="neu-container neu-margin--top-20 neu-margin--bottom-20">
            <template v-if="payrollDetails.length > 0">
                <neu-table>
                    <neu-table-row columns="{'Schedule': '50%', 'Actual': '50%'}" header="true">
                        <neu-table-heading icon="none" slot="Schedule">
                            <div class="tHeading">Schedule</div>
                        </neu-table-heading>
                        <neu-table-heading slot="Actual" icon="none" active="false">
                            <div class="tHeading actual">Actual</div>
                        </neu-table-heading>
                    </neu-table-row>

                    <neu-table-body>
                        <neu-table-row columns="{'Schedule': '50%', 'Actual': '50%'}"
                            size="small" v-for="payrollDetail in payrollDetails"
                            :key="payrollDetails.indexOf(payrollDetail)"> 
                            <neu-label slot="Schedule">                              
                                <neu-container class="borderLine boxWidth">
                                    <div class="neu-input__label" v-if="payrollDetail.departmentId != 0">
                                        {{ formatDate(payrollDetail.start) }}
                                        <br />
                                        <span class="purpleColor">{{ payrollDetail.shiftCode }}
                                            {{ formatTime(payrollDetail.start) }} - {{ formatTime(payrollDetail.end) }}
                                        </span>
                                        <br />
                                        Dept : {{ payrollDetail.departmentCode }}
                                    </div>
                                </neu-container>
                            </neu-label>

                            <neu-label slot="Actual">
                            <neu-container class="borderLine boxWidth">
                                <div class="neu-input__label"
                                    v-for="clockInOut in payrollDetail.clockInOuts"
                                    :key="payrollDetail.clockInOuts.indexOf(clockInOut)">
                                    {{ formatDate(clockInOut.inDateTime) }}
                                    <br />
                                    <span style="font-weight:bold;">{{ clockInOut.code }}</span>
                                    <br />
                                    <span class="redColor">
                                        {{ formatTime(clockInOut.inDateTime) }} - {{
                                            clockInOut.outDateTime != null ?
                                                formatTime(clockInOut.outDateTime) : ''
                                        }}
                                    </span>
                                    <span style="font-weight:bold;">
                                        [ {{ totalHours(clockInOut.inDateTime, clockInOut.outDateTime) }} hrs ]
                                    </span>
                                    <br />
                                    Dept : {{ clockInOut.departmentCode }}
                                </div>
                            </neu-container>
                            </neu-label>
                        </neu-table-row>
                    </neu-table-body>
                </neu-table>
               
            </template>
            <template v-else>
                <div class="neu-input__label text-center">No data exist</div>
            </template>
        </div>
    </div>

</template>

<script lang="ts">
import {
    NeuApp,
    NeuContent,
    NeuInput,
    NeuButton,
    NeuTableRow,
    NeuTable,
    NeuTableBody,
    NeuTableHeading
} from '@neutron/vue'
import { Options, Vue } from 'vue-class-component';
import moment from "moment";
import { mapState } from "vuex";
import { ScheduleActualCIOD } from "@/models";
import ErrorNotification from "@/components/shared/ErrorNotification.vue";
import { useAppInsights } from '../../store/modules/AppInsights'
// import PayrollDetailsTable  from '../profile/PayrollDetailsTable.vue'

@Options({
    components: {
        NeuInput,
        NeuButton,
        NeuApp,
        NeuContent,
        ErrorNotification,
        NeuTableRow,
        NeuTable,
        NeuTableBody,
        NeuTableHeading
        // PayrollDetailsTable
    },
    computed: {
        ...mapState('profile', ['profileData', 'appInsightEventData']),
        ...mapState('schedule', ['userSchedules', 'payrollDetails']),
    },
})
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

        if (this.profileData?.first == null || this.profileData?.first == undefined) {
            await this.$store.dispatch('profile/getProfileDetails', '');
        }

        useAppInsights().trackEvent({
            name: 'ViewPayrollDetails', properties:
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
            let currDt = new Date(new Date().setHours(0, 0, 0, 0));
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
        if (sDate != null && eDate != null) {
            var sDateVal: any = new Date(new Date(sDate).setSeconds(0, 0));
            var eDateVal: any = new Date(new Date(eDate).setSeconds(0, 0));
            totalHours = (Math.abs(sDateVal - eDateVal) / 36e5).toFixed(2);
        }

        return totalHours;
    }
}
</script>

<style scoped>
.bg-transparent {
    background: transparent;
}

.text-left {
    text-align: left
}

.text-center {
    text-align: center
}

.text-right {
    text-align: right;
}

.neu-table,
:host.neu-table {
    display: table;
}

.th_HeaderRow {
    position: sticky;
    top: 0;
    z-index: 3;
    width: 25vw;
    background: white;
    font-weight: bold;
    padding: 20px;
}

.borderLine {
    border: 1px solid #a8a8a8 !important;
}
.boxWidth{
    margin: 2em 0;
    width: 275px;
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

    .overflowHide {
        overflow-x: hidden;
    }

    .w100 {
        max-width: 100% !important;
    }
}
</style> 