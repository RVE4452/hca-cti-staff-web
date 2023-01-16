<template>
    <!-- <table class="neu-table">
        <tr class="th_HeaderRow">
            <th class="neu-input__label  purpleColor">Schedule</th>
            <th class="neu-input__label  redColor">Actual</th>
        </tr>

        <tr v-for="payrollDetail in payrollDetails" :key="payrollDetails.indexOf(payrollDetail)">
            <td class="silverBorder">
                <div class="div_centered neu-input__label" v-if="payrollDetail.departmentId != 0">
                    {{ formatDate(payrollDetail.start) }}
                    <br />
                    <span class="purpleColor">{{ payrollDetail.shiftCode }}
                        {{ formatTime(payrollDetail.start) }} - {{ formatTime(payrollDetail.end) }} </span>
                    <br />
                    Dept : {{ payrollDetail.departmentCode }}
                </div>
            </td>
            <td class="silverBorder">
                <div class="div_centered neu-input__label" v-for="clockInOut in payrollDetail.clockInOuts"
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

            </td>
        </tr>
    </table> -->

    <neu-table class="tableSection">
        <neu-table-row columns="{'Schedule': '50%', 'Actual': '50%'}">
            <neu-table-heading icon="none" active="false" slot="Schedule">
                <div class="tHeading">Schedule</div>
            </neu-table-heading>
            <neu-table-heading icon="none" active="false" slot="Actual">
                <div class="tHeading actual">Actual</div>
            </neu-table-heading>
        </neu-table-row>

        <neu-table-body>
            <neu-table-row columns="{'Schedule': '50%', 'Actual': '50%'}" size="small">
                <neu-label slot="Schedule">
                    <!-- <neu-container> -->
                    <neu-container v-for="item in lists" :key="item">
                        <neu-label>{{item.isDateFormat}}</neu-label>
                        <neu-label class="text-bold">{{item.isTimeDetails}}</neu-label>
                        <neu-label>{{item.isDept}}</neu-label>
                    </neu-container>    
                    
                </neu-label>
                <neu-label slot="Actual">
                    <neu-container>
                            <neu-label>Monday, November 14 2022</neu-label>
                            <neu-label>CERT, PRCEP, PROD</neu-label>
                            <neu-label class="text-bold text-red">7AM - 7PM <label>6.03 hrs</label></neu-label>
                            <neu-label>DEPT: 63335</neu-label>
                    </neu-container>
                    <neu-container>
                            <neu-label>Monday, November 14 2022</neu-label>
                            <neu-label>CERT, PRCEP, PROD</neu-label>
                            <neu-label class="text-bold text-red">7AM - 7PM <label>6.03 hrs</label></neu-label>
                            <neu-label>DEPT: 63335</neu-label>
                    </neu-container>
                    <neu-container>
                            <neu-label>Monday, November 14 2022</neu-label>
                            <neu-label>CERT, PRCEP, PROD</neu-label>
                            <neu-label class="text-bold text-red">7AM - 7PM <label>6.03 hrs</label></neu-label>
                            <neu-label>DEPT: 63335</neu-label>
                    </neu-container>
                    <neu-container>
                            <neu-label>Monday, November 14 2022</neu-label>
                            <neu-label>CERT, PRCEP, PROD</neu-label>
                            <neu-label class="text-bold text-red">7AM - 7PM <label>6.03 hrs</label></neu-label>
                            <neu-label>DEPT: 63335</neu-label>
                    </neu-container>
                </neu-label>
            </neu-table-row>
        </neu-table-body>
    </neu-table>


</template>

<script lang="ts">
import {
    NeuTableRow,
    NeuTable,
    NeuTableBody,
    NeuTableHeading
} from '@neutron/vue'
import { Options, Vue } from 'vue-class-component';
import axios from 'axios';
import { warn } from '@vue/runtime-core';

export default {
    name: 'PayrollDetailsTable',
    components: {
        NeuTableRow,
        NeuTable,
        NeuTableBody,
        NeuTableHeading
    },
    data(){
        return{
            lists:[]
        }
    },
    async mounted()
    {
        let result = await axios.get("http://localhost:3000/schedulePreferences");
        console.warn('API Result', result.data);
        this.lists  =  result.data;  
    }
}
</script>

<style>
.neu-table-heading.sc-neu-table-heading, .neu-table-heading.sc-neu-table-heading-h,
.neu-table-row.sc-neu-table-row, .neu-table-row.sc-neu-table-row-h,
.neu-table-heading.sc-neu-table-heading:hover, .neu-table-heading.sc-neu-table-heading-h:hover,
.neu-table-row.sc-neu-table-row:hover, .neu-table-row.sc-neu-table-row-h:hover{
    background: none !important;
    cursor: auto !important;
}
.tHeading{
    text-align: center;
    width: 100%;
}
.tHeading.actual,
.text-red{
    color: red
}
.tableSection .neu-container.sc-neu-container-h{
    border: 1px solid #a8a8a8 !important;
    font-size: 1em;
    margin: 1em auto;
    min-width: 225px;
}
.text-bold{
    font-weight: bold;
}
.text-black{
    color: #a8a8a8;
}
</style>