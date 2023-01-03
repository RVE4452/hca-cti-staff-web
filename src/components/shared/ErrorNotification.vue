
<template>
    <div>
        <div class="bg-black-05 w-100 container-fluid notificationborder" v-if="errorType == 'error'">
            <span class="reporticon" aria-hidden="true">report_problem</span>
            <span class="notification">
                {{
                                errorMsg
                }}
            </span>
        </div>

        <div class="bg-black-05 w-100 container-fluid warningborder" v-if="errorType == 'warning'">
            <span class="reporticonWarning" aria-hidden="true">report_problem</span>
            <span class="warningSpan">
                {{
                                errorMsg
                }}
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
        border: #971B2F solid 1px;
        height: 60%;
        border-radius: 6px;
        background-color: #FCF0F1;
    }

    .notification {
        left: 5%;
        color: #971B2F;
        position: relative;
        font-size: .875rem;
        font-family: "HCA-Mark-Medium", "Arial", sans-serif !important;
        display: block;
        width: 95%;
        word-wrap: break-word;
        white-space: pre-line;
    }

    .reporticon {
        text-align: center;
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        color: #971B2F;
        font-size: 24px;
        line-height: 1;
        letter-spacing: normal;
        text-transform: none;
        display: inline-block;
        white-space: nowrap;
        word-wrap: normal;
        direction: ltr;
        position: absolute;
        left: 5%;
        /* -webkit-font-feature-settings: 'liga'; */
        -webkit-font-smoothing: antialiased;
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