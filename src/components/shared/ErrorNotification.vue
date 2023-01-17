
<template>
    <div>
        <div class="p-3 bg-black-05 w-100 container-fluid notificationborder" v-if="errorType == 'error'">
            <span class="reporticon" aria-hidden="true">report_problem</span>
            <span class="notification">
                {{ errorMsg }}
            </span>
        </div>

        <div class="bg-black-05 w-100 container-fluid warningborder" v-if="errorType == 'warning'">
            <span class="reporticonWarning" aria-hidden="true">report_problem</span>
            <span class="warningSpan">
                {{ errorMsg }}
            </span>
        </div>
    </div>
</template>



<script lang="ts">
    import { Options, Vue } from 'vue-class-component';

    class Props{
        errorMsg: any;
        errorType: any;
    }
    @Options({})
    export default class ErrorNotification extends Vue.with(Props) {
       
    }

</script>
<style scoped>
    .notificationborder {
        background-color: #FCF0F1;
        border: #971B2F solid 1px;
        border-radius: 6px;
        overflow: hidden;
    }

    .notification {
        color: #971B2F;
        font-size: .875rem;
        font-family: "HCA-Mark-Medium", "Arial", sans-serif !important;
        float: left;
    }

    .reporticon {
        font-family: 'Material Icons';
        color: #971B2F;
        font-size: 24px;
        float: left;
        line-height:14px;
    }

    .warningborder {
        border: #ac742f solid 1px;
        height: 60%;
        border-radius: 6px;
        background-color: #eee3d5;
    }

    .warningSpan {
        left: 9%;
        color: #ac742f;
        position: relative;
        font-size: .875rem;
        font-family: "HCA-Mark-Medium", "Arial", sans-serif !important;
    }

    .reporticonWarning {
        text-align: center;
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        color: #ac742f;
        font-size: 24px;
        line-height: 1;
        letter-spacing: normal;
        text-transform: none;
        display: inline-block;
        white-space: nowrap;
        word-wrap: normal;
        direction: ltr;
        position: absolute;
        left: 8%;
        /* -webkit-font-feature-settings: 'liga'; */
        -webkit-font-smoothing: antialiased;
    }
</style>