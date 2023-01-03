<template>
    <div class="overflowHide">
        <div class="row neu-margin--bottom-20">
            <div class="col-12 neu-margin--bottom-20" v-if="showErrorMsg">
                    <ErrorNotification :errorMsg="errorMsg" :errorType="errorType"/>
            </div>
            <div class="col-sm-12">
                <h6 class="neu-text--transform-uppercase">
                    CONSENT TO RECEIVE SMS NOTIFICATIONS ON YOUR PERSONAL DEVICE
                </h6>
            </div>
            <div class="col-sm-12 neu-margin--top-10 neu-text--caption">
                By selecting "YES" you consent to receive SMS notifications from the Company on your personal device.
            </div>
            <div class="col-sm-12 neu-margin--top-10">
                <div class="neu-checkbox">
                    <input id="chkConsent" name="a11y-issues" type="checkbox" class="neu-checkbox__input" v-model="smsPrefData.isUserOptedIn">
                    <label class="neu-checkbox__label neu-text--caption" for="chkConsent">YES</label>
                </div>
            </div>
            <div class="col-sm-12 neu-margin--top-20 neu-text--caption">
                <span class="neu-notification-badge d-inline-block neu-text--support info_icon_bgcolor">i</span>
                &nbsp; &nbsp; &nbsp; You may revoke your consent or opt-out by adjusting your preferences or by responding STOP at any time to unsubscribe.
            </div>
            <div class="col-sm-12 neu-margin--top-20">
                <h6 class="neu-text--transform-uppercase">
                    SMS NOTIFICATIONS
                </h6>
            </div>
            <div class="col-sm-12 neu-margin--top-10 neu-text--caption">
                For your convenience, you may choose to receive texts, SMS notifications, or similar messages("SMS Notifications") from the Company on your personal phone or mobile device for staffing and scheduling purposes.
            </div>

            <div class="col-sm-12 neu-margin--top-20">
                <h6 class="neu-text--transform-uppercase">
                    HOW THE COMPANY WILL USE YOUR NUMBER
                </h6>
            </div>
            <div class="col-sm-12 neu-margin--top-10 neu-text--caption">
                With your consent, the Company will use the phone number entered below for staffing and scheduling notifications, including through SMS Notifications. Opting in to receive SMS Notifications is optional and is not required. If you choose not to receive these notifications, you will still receive staffing and scheduling communications from the Company through email.
            </div>
        </div>
        <div class="row neu-margin--bottom-20">            
            <div class="col-sm-12 neu-input">
                <label for="txtMobilePhoneNum" class="neu-input__label">Mobile Phone Number</label>
            </div>
            <div class="col-sm-4 neu-input neu-margin--top-10 flex50">
                <input type="text" id="txtMobilePhoneNum" :class="[isMobileNoEnabled ? 'neu-input__text-field' : 'readonly_text_field']"
                       ref="mNumber" :readonly="!isMobileNoEnabled" v-model="smsPrefData.mobileNumber" oninput="this.value = this.value.replace(/[^0-9]/g, '')" maxlength="10">
            </div>
            <div v-if="!isImpersonating" class="col-sm-2 neu-margin--top-10 btnActivateDiv no-print">
                <button @click="activateMobileNumber" :class="[isActivateButtonEnabled ? '' : 'neu-button--blue-disabled', 'neu-button--primary neu-button neu-button--raised btnActivate']" :disabled="!isMobileNoEnabled">
                    Activate
                </button>
            </div>
            <div v-if="!isImpersonating" class="col-sm-4 neu-margin--top-10 no-print">
                <button @click="reactivateMobileNumber" :class="[isActivateButtonEnabled ? '' : 'neu-button--blue-disabled', 'neu-button--primary neu-button neu-button--raised']" :disabled="!isMobileNoEnabled">
                    Send New Code
                </button>
            </div>

            <div id="timer" class="col-sm-12 neu-margin--top-20 neu-input" v-if="isTimerVisible">
                <span id="hours">{{ hours }}</span>
                <span id="hm_middle">:</span>
                <span id="minutes">{{ minutes }}</span>
                <span id="ms_middle">:</span>
                <span id="seconds">{{ seconds }}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span class="neu-text--caption">Please enter a valid Activation Code before the timer expires</span>
            </div>


            <div class="col-sm-12 neu-input neu-margin--top-20">
                <label for="txtactivationCode" class="neu-input__label">Activation Code</label>
            </div>
            <div class="col-sm-4 neu-input neu-margin--top-10 flex50">
                <input type="text" id="txtactivationCode" :class="[isActivationCodeEnabled ? 'neu-input__text-field' : 'readonly_text_field']"
                       :readonly="!isActivationCodeEnabled" v-model="smsPrefData.activationCode" oninput="this.value = this.value.replace(/[^0-9]/g, '')" maxlength="6">
            </div>
            <div v-if="!isImpersonating" class="col-sm-4 neu-margin--top-10 no-print">
                <button @click="validateActivationCode" :class="[isActivationCodeEnabled ? '' : 'neu-button--blue-disabled', 'neu-button--primary neu-button neu-button--raised']" :disabled="!isActivationCodeEnabled">
                    Validate
                </button>
            </div>


            <div class="col-sm-12 neu-margin--top-20">
                <span class="neu-text--product">
                    SMS Notification Types - After Schedule Posting
                </span>
            </div>
            <div :class="['col-sm-12 neu-margin--top-10', isSMSNtfTypesDisabled ? 'wrapper' : '']">
                <div class="neu-checkbox">
                    <input id="chkVal_ALL" type="checkbox" class="neu-checkbox__input" v-model="checkALLOption" @change="onCAOChanges($event)" :disabled="isSMSNtfTypesDisabled">
                    <label class="neu-checkbox__label neu-text--caption" for="chkVal_ALL">ALL</label>
                </div>
                <div class="neu-checkbox neu-margin--top-05">
                    <input id="chk_AssgCre" type="checkbox" class="neu-checkbox__input" v-model="smsPrefData.assignmentCreated" :disabled="isSMSNtfTypesDisabled">
                    <label class="neu-checkbox__label neu-text--caption" for="chk_AssgCre">Shift Created</label>
                </div>
                <div class="neu-checkbox neu-margin--top-05 marTop13">
                    <input id="chk_AssgMdf" type="checkbox" class="neu-checkbox__input" v-model="smsPrefData.assignmentModified" :disabled="isSMSNtfTypesDisabled">
                    <label class="neu-checkbox__label neu-text--caption" for="chk_AssgMdf">Shift Modified</label>
                </div>
                <div class="neu-checkbox neu-margin--top-05">
                    <input id="chk_AssgCal" type="checkbox" class="neu-checkbox__input" v-model="smsPrefData.assignmentCanceled" :disabled="isSMSNtfTypesDisabled">
                    <label class="neu-checkbox__label neu-text--caption" for="chk_AssgCal">Shift Cancelled</label>
                </div>
                <div class="neu-checkbox neu-margin--top-05">
                    <input id="chk_StfNd" type="checkbox" class="neu-checkbox__input" v-model="smsPrefData.staffingNeed" :disabled="isSMSNtfTypesDisabled">
                    <label class="neu-checkbox__label neu-text--caption" for="chk_StfNd">Staff Need</label>
                </div>
                <div class="neu-checkbox neu-margin--top-05">
                    <input id="chkStfNd_CPAO" type="checkbox" class="neu-checkbox__input" v-model="smsPrefData.staffingNeedCriticalPay" :disabled="isSMSNtfTypesDisabled">
                    <label class="neu-checkbox__label neu-text--caption" for="chkStfNd_CPAO">Critical Staff Need</label>
                </div>
            </div>
        </div>
        <!--<div class="row neu-margin--bottom-10" v-if="isContentVisible">
            <div class="col-sm-12">
                <div class="neu-checkbox">
                    <input id="chkCMBT" name="a11y-issues" type="checkbox" class="neu-checkbox__input" v-model="smsPrefData.callBeforeText">
                    <label class="neu-checkbox__label neu-text--caption" for="chkCMBT">CALL ME BEFORE TEXTING*</label>
                </div>
            </div>
            <div class="col-sm-12 neu-margin--top-20 neu-input">
                <label for="txtactivationCode" class="neu-input__label">Call Number</label>
            </div>
            <div class="col-sm-4 neu-input">
                <input class="neu-input__text-field" type="text" id="txtcallNumber" ref="cNumber" v-model="smsPrefData.callNumber" @keypress="checkUSNumber" maxlength="12">
            </div>

            <div class="col-sm-12 neu-margin--top-20">
                *Call Before Texting only applies to Staffing Need and Staffing Need - Critical Pay Notification Types.
            </div>
        </div>-->
        <div  v-if="!isImpersonating" class="col-sm-12 neu-margin--top-30 no-print">
            <button @click="validateSMSPrefDetails" :class="[anyChangeHappened ? '' : 'neu-button--blue-disabled', 'neu-button--primary neu-button neu-button--raised']" :disabled="!anyChangeHappened">
                Save Changes
            </button>
        </div>

        <div v-if="isModalVisible">
            <SaveMsgPopUp @closeModal="closeModal"
                          :msgValue="msgValue"
                          :classFlag="classFlag"></SaveMsgPopUp>
        </div>
        <div v-if="isConfirmModalVisible">
            <ConfirmMsgPopUp @cancelled="isConfirmModalVisible = false"
                             @confirmed="confirmedClicked"
                             :msgValue="confirmMsgValue"></ConfirmMsgPopUp>
        </div>
    </div>
</template>

<script lang="ts">
   import { Options, Vue } from 'vue-class-component';
    import moment from "moment";
    import { mapState } from "vuex";
    import { SMSPreferences } from "@/models";
    import SaveMsgPopUp from "@/components/shared/SaveMsgPopUp.vue";
    import ConfirmMsgPopUp from "@/components/shared/ConfirmMsgPopUp.vue";
    import ErrorNotification from "@/components/shared/ErrorNotification.vue";
   
    import { useAppInsights } from '../../store/modules/AppInsights'


    @Options({ components: { SaveMsgPopUp, ConfirmMsgPopUp, ErrorNotification},
     computed: {
            ...mapState('profile', ['smsPrefData','profileData','isImpersonating','appInsightEventData']),
        }, })
    export default class SMSPref extends Vue {

        old_smsPrefData!: SMSPreferences;
        //isContentVisible: boolean = false;
        isMobileNoEnabled: boolean = false;
        isActivateButtonEnabled: boolean = false;
        isActivationCodeEnabled: boolean = false;
        isSMSNtfTypesDisabled: boolean = false;

        uoi_changed: boolean = false;
        mn_changed: boolean = false;
        ac_changed: boolean = false;
        acr_changed: boolean = false;
        amd_changed: boolean = false;
        acc_changed: boolean = false;
        sn_changed: boolean = false;
        sncp_changed: boolean = false;
        //cbt_changed: boolean = false;
        //cn_changed: boolean = false;

        isModalVisible: boolean = false;
        msgValue: string = '';
        classFlag: string = '';
        errorMsg: string = '';
        errorType: string = 'error';
        showErrorMsg: boolean = false;

        isConfirmModalVisible: boolean = false;
        confirmMsgValue: string = '';

        checkALLOption: boolean = false;

        timer: any = null;
        totalTime: number = 0;
        isTimerVisible: boolean = false;
        public smsPrefData!: SMSPreferences;
        public profileData!: any;
        isImpersonating!: boolean;        
        appInsightEventData!: any;

        mounted() {
            this.getSMSPrefData();           
        }

        async getSMSPrefData() {
            await this.$store.dispatch('profile/getSMSPrefDetails', this.profileData.username)
                .then((res: any) => {
                    if (this.smsPrefData != undefined) {
                        this.old_smsPrefData = JSON.parse(JSON.stringify(this.smsPrefData));

                        if (this.smsPrefData.validated == false && this.smsPrefData.isUserOptedIn == true) {
                            this.smsPrefData.activationCode = "";                            
                            if (this.smsPrefData.activationCodeExpiresUtc != null || this.smsPrefData.activationCodeExpiresUtc != undefined) {

                                let currentDate = moment(new Date().toISOString(), 'DD-MM-YYYY HH:mm:ss');
                                let expireDate = moment(this.smsPrefData.activationCodeExpiresUtc, 'DD-MM-YYYY HH:mm:ss');
                                if (currentDate < expireDate) {
                                    this.getTotalTime();
                                    this.isTimerVisible = true;
                                    this.startTimer();
                                    this.isActivationCodeEnabled = true;
                                    this.isMobileNoEnabled = false;

                                }
                                else {
                                    this.isMobileNoEnabled = true;
                                    this.isActivateButtonEnabled = true;
                                }
                                this.isActivationCodeEnabled = true;
                            }
                        }
                        else if (this.smsPrefData.validated == true && this.smsPrefData.isUserOptedIn == true) {
                            this.isMobileNoEnabled = true;
                        }
                        else {
                            this.isMobileNoEnabled = false;
                        }

                        if (this.smsPrefData.validated) {
                            this.isSMSNtfTypesDisabled = false;
                        }
                        else {
                            this.isSMSNtfTypesDisabled = true;
                        }

                        if (this.smsPrefData.assignmentCreated && this.smsPrefData.assignmentModified && this.smsPrefData.assignmentCanceled && this.smsPrefData.staffingNeed && this.smsPrefData.staffingNeedCriticalPay) {
                            this.checkALLOption = true;
                        }
                    }
                })
                .catch((err: any) => {
                    if (err) {
                        console.log(err);
                    }
                });
        }

        confirmedClicked() {
            this.isConfirmModalVisible = false;
            useAppInsights().trackEvent({name:'SMSOptOut',properties: 
               JSON.parse(JSON.stringify(this.appInsightEventData))
            });
            this.saveSMSPrefDetails();
        }

        validateSMSPrefDetails() {
            if ((this.smsPrefData.isUserOptedIn == false && this.uoi_changed == true)) {
                this.confirmMsgValue = "Do you really want to Opt-Out?";
                this.isConfirmModalVisible = true;
            }
            else {
                this.saveSMSPrefDetails();
            }
        }

        async saveSMSPrefDetails() {
            this.showErrorMsg = false;  
            await this.$store.dispatch('profile/saveSMSPrefDetails', { username: this.profileData.username, smsData: this.smsPrefData })
                .then((res: any) => {
                    this.resetControls();
                    this.msgValue = 'Your changes have been saved.';
                    this.classFlag = 'success';
                    this.showModal();
                })
                .catch((err: any) => {
                    if (err) {
                        console.log(err);
                    }
                });
        }

        async activateMobileNumber() {
             this.showErrorMsg = false;  
             useAppInsights().trackEvent({name:'SMSOptIn',properties: 
                                    JSON.parse(JSON.stringify(this.appInsightEventData))
                                    });
            if (this.validatePhoneNumber("Mobile")) {
                await this.$store.dispatch('profile/activateMobileNumber', { username: this.profileData.username, phoneNumber: this.smsPrefData.mobileNumber })
                    .then((res: any) => {
                        this.getTotalTime();
                        this.isTimerVisible = true;
                        this.startTimer();
                        this.isActivationCodeEnabled = true;
                        this.isMobileNoEnabled = false;
                        this.isActivateButtonEnabled = false;
                        this.isSMSNtfTypesDisabled = true;
                        this.old_smsPrefData.activationCodeExpiresUtc = this.smsPrefData.activationCodeExpiresUtc;
                        this.old_smsPrefData.validated = this.smsPrefData.validated;
                        this.old_smsPrefData.validatedDate = this.smsPrefData.validatedDate;
                        //this.isContentVisible = false;
                    })
                    .catch((err: any) => {
                        if (err) {                           
                                let parseResponse = err.request.responseText;                              
                                this.showErrorMsg = true;                            
                                this.errorMsg = (parseResponse != null || parseResponse != undefined) ? parseResponse : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
                       }
                    });
            }
        }

        async reactivateMobileNumber() {
             this.showErrorMsg = false;  
            if (this.validatePhoneNumber("Mobile")) {
                await this.$store.dispatch('profile/reactivateMobileNumber', { username: this.profileData.username, phoneNumber: this.smsPrefData.mobileNumber })
                    .then((res: any) => {
                        this.getTotalTime();
                        this.isTimerVisible = true;
                        this.startTimer();
                        this.isActivationCodeEnabled = true;
                        this.isMobileNoEnabled = false;
                        this.isActivateButtonEnabled = false;
                        this.isSMSNtfTypesDisabled = true;
                        this.old_smsPrefData.activationCodeExpiresUtc = this.smsPrefData.activationCodeExpiresUtc;
                        this.old_smsPrefData.validated = this.smsPrefData.validated;
                        this.old_smsPrefData.validatedDate = this.smsPrefData.validatedDate;
                        //this.isContentVisible = false;
                    })
                    .catch((err: any) => {
                        if (err) {                           
                                let parseResponse = err.request.responseText;                              
                                this.showErrorMsg = true;                            
                                this.errorMsg = (parseResponse != null || parseResponse != undefined) ? parseResponse : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
                       }
                    });
            }
        }

        async validateActivationCode() {
            if (this.smsPrefData.activationCode.length < 6) {
                this.msgValue = 'Activation code should be 6 digits';
                this.classFlag = 'error';
                this.showModal();
                return false;
            }
            else {
                await this.$store.dispatch('profile/validateActivationCode', { username: this.profileData.username, activationCode: this.smsPrefData.activationCode })
                    .then((res: any) => {
                        //this.isContentVisible = true;

                        if (this.smsPrefData.validated == true && this.smsPrefData.validatedDate !== null && (this.smsPrefData.validatedDate < this.smsPrefData.activationCodeExpiresUtc)) {
                            this.msgValue = 'Activation code validated.';
                            this.classFlag = 'success';
                            this.showModal();
                            this.isTimerVisible = false;
                            this.totalTime = 0;
                            this.isActivationCodeEnabled = false;
                            this.isMobileNoEnabled = true;
                            this.isActivateButtonEnabled = false;
                            this.isSMSNtfTypesDisabled = false;
                            this.old_smsPrefData.validated = this.smsPrefData.validated;
                            this.old_smsPrefData.validatedDate = this.smsPrefData.validatedDate;
                            this.old_smsPrefData.assignmentCreated = this.smsPrefData.assignmentCreated;
                            this.old_smsPrefData.assignmentModified = this.smsPrefData.assignmentModified;
                            this.old_smsPrefData.assignmentCanceled = this.smsPrefData.assignmentCanceled;
                            this.old_smsPrefData.staffingNeed = this.smsPrefData.staffingNeed;
                            this.old_smsPrefData.staffingNeedCriticalPay = this.smsPrefData.staffingNeedCriticalPay;
                        }
                        else {
                            this.msgValue = 'Please enter valid Activation Code';
                            this.classFlag = 'error';
                            this.showModal();
                            this.isSMSNtfTypesDisabled = true;
                        }
                    })
                    .catch((err: any) => {
                        if (err) {                           
                                let parseResponse = err.request.responseText;                              
                                this.showErrorMsg = true;                            
                                this.errorMsg = (parseResponse != null || parseResponse != undefined) ? parseResponse : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
                       }
                    });
            }
        }

        onCAOChanges() {
            this.smsPrefData.assignmentCreated = this.checkALLOption;
            this.smsPrefData.assignmentModified = this.checkALLOption;
            this.smsPrefData.assignmentCanceled = this.checkALLOption;
            this.smsPrefData.staffingNeed = this.checkALLOption;
            this.smsPrefData.staffingNeedCriticalPay = this.checkALLOption;
        }

        validateNotificationTypes(flag:any) {
            let ACR_Val = this.smsPrefData.assignmentCreated;
            let AMD_Val = this.smsPrefData.assignmentModified;
            let ACC_Val = this.smsPrefData.assignmentCanceled;
            let SN_Val = this.smsPrefData.staffingNeed;
            let SNCP_Val = this.smsPrefData.staffingNeedCriticalPay;

            if (flag == 'assignmentCreated') {
                if (AMD_Val == true && ACC_Val == true && SN_Val == true && SNCP_Val == true) {
                    this.checkALLOption = ACR_Val;
                }
            }
            else if (flag == 'assignmentModified') {
                if (ACR_Val == true && ACC_Val == true && SN_Val == true && SNCP_Val == true) {
                    this.checkALLOption = AMD_Val;
                }
            }
            else if (flag == 'assignmentCanceled') {
                if (ACR_Val == true && AMD_Val == true && SN_Val == true && SNCP_Val == true) {
                    this.checkALLOption = ACC_Val;
                }
            }
            else if (flag == 'staffingNeed') {
                if (ACR_Val == true && AMD_Val == true && ACC_Val == true && SNCP_Val == true) {
                    this.checkALLOption = SN_Val;
                }
            }
            else if (flag == 'staffingNeedCriticalPay') {
                if (ACR_Val == true && AMD_Val == true && ACC_Val == true && SN_Val == true) {
                    this.checkALLOption = SNCP_Val;
                }
            }
        }

        validatePhoneNumber(flag:any) {
            var allowedFormat = /^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/;
            if (flag == "Mobile") {
                let mobileNumber: string = this.smsPrefData.mobileNumber;
                if ((mobileNumber == "") || (!mobileNumber.match(allowedFormat))) {
                    this.smsPrefData.activationCode = "";
                    this.isActivationCodeEnabled = false;
                    //this.isContentVisible = false;
                    this.msgValue = 'Please enter valid Mobile Phone Number like 123-456-7890';
                    this.classFlag = 'error';
                    this.showModal();
                    return false;
                }
            }
            else {
                let callNumber: string = this.smsPrefData.callNumber;
                if ((callNumber == "") || (!callNumber.match(allowedFormat))) {
                    this.msgValue = 'Please enter valid Call Number like 123-456-7890';
                    this.classFlag = 'error';
                    this.showModal();
                    return false;
                }
            }
            return true;
        }

        checkUSNumber(event:any) {
            let keyCode = event.keyCode ? event.keyCode : event.which;
            if (!((keyCode >= 48 && keyCode <= 57) || (keyCode == 45))) {
                event.preventDefault();
            }
        }

        onlyNumber(event:any) {
            let keyCode = event.keyCode ? event.keyCode : event.which;
            if (keyCode < 48 || keyCode > 57) {
                event.preventDefault();
            }
        }

        resetControls() {
            this.old_smsPrefData = JSON.parse(JSON.stringify(this.smsPrefData));
            this.uoi_changed = false;
            this.mn_changed = false;
            this.ac_changed = false;
            this.acr_changed = false;
            this.amd_changed = false;
            this.acc_changed = false;
            this.sn_changed = false;
            this.sncp_changed = false;
            this.showErrorMsg = false;  
            //this.cbt_changed = false;
            //this.cn_changed = false;
        }

        showModal() {
            this.isModalVisible = true;
        }

        closeModal() {
            this.isModalVisible = false;
        }

        getTotalTime() {
            if (this.smsPrefData.activationCodeExpiresUtc != undefined) {
                let currentDate = moment(new Date().toISOString(), 'DD-MM-YYYY HH:mm:ss');
                let expireDate = moment(this.smsPrefData.activationCodeExpiresUtc, 'DD-MM-YYYY HH:mm:ss');
                this.totalTime = expireDate.diff(currentDate, 'seconds');
                this.totalTime = (this.totalTime > 3600 ? 3600 : this.totalTime);
            }
        }

        startTimer() {
            this.timer = setInterval(() => this.countdown(), 1000);
        }

        stopTimer() {
            clearInterval(this.timer);
            this.timer = null;
        }

        padTime(time:any) {
            return (time < 10 ? '0' : '') + time;
        }

        countdown() {

            if (this.totalTime >= 1) {
                this.totalTime--;
            } else {
                this.totalTime = 0;
            }
        }

        ////computed
        get hours() {
            const hours = Math.floor(this.totalTime / 3600);
            return this.padTime(hours);
        }

        get minutes() {
            let currentMinutes = (this.totalTime - (Math.floor(this.totalTime / 3600) * 3600));
            const minutes = Math.floor(currentMinutes / 60);
            return this.padTime(minutes);
        }

        get seconds() {
            const seconds = this.totalTime % 60;
            return this.padTime(seconds);
        }

        get anyChangeHappened() {
             this.showErrorMsg = false;  
            let returnVal: boolean = false;
            if ((this.smsPrefData.isUserOptedIn == false && this.uoi_changed == true) ||
                (this.smsPrefData.isUserOptedIn == true && this.mn_changed == true && this.ac_changed == true && this.smsPrefData.validated == true) ||
                (this.smsPrefData.isUserOptedIn == true && this.mn_changed == false && this.ac_changed == true && this.smsPrefData.validated == true) ||
                ((this.smsPrefData.isUserOptedIn == true && this.mn_changed == true && this.ac_changed == true && this.smsPrefData.validated == true)
                    && (this.acr_changed == true || this.amd_changed == true || this.acc_changed == true
                        || this.sn_changed == true || this.sncp_changed == true)) ||
                ((this.smsPrefData.isUserOptedIn == true && this.mn_changed == false && this.ac_changed == true && this.smsPrefData.validated == true)
                    && (this.acr_changed == true || this.amd_changed == true || this.acc_changed == true
                        || this.sn_changed == true || this.sncp_changed == true)) ||
                ((this.smsPrefData.isUserOptedIn == true && this.mn_changed == false && this.ac_changed == false && this.smsPrefData.validated == true)
                    && (this.acr_changed == true || this.amd_changed == true || this.acc_changed == true
                        || this.sn_changed == true || this.sncp_changed == true))

            )//|| this.cbt_changed == true || this.cn_changed == true
            {
                returnVal = true;
            }
            return returnVal;
        }

        get totalTimerValue() {
            return this.totalTime;
        }

        //@Watch("totalTimerValue")
        onttchanges(newValue: number) {
            if (newValue == 0 && this.isTimerVisible == true) {
                this.isMobileNoEnabled = true;
                this.isActivateButtonEnabled = true;
                //this.isActivationCodeEnabled = false;
                this.isTimerVisible = false;
                this.totalTime = 0;
                this.stopTimer();
            }
        }
        //@Watch("smsPrefData.isUserOptedIn")
        onUOIChanges(newValue: boolean, oldValue: boolean) {

            if (this.old_smsPrefData != undefined) {
                this.uoi_changed = (this.old_smsPrefData.isUserOptedIn !== newValue ? true : false);
                if (newValue == true) {
                    this.isMobileNoEnabled = true;
                    this.smsPrefData.mobileNumber = this.old_smsPrefData.mobileNumber;
                    this.smsPrefData.activationCode = this.old_smsPrefData.activationCode;
                    this.smsPrefData.activationCodeExpiresUtc = this.old_smsPrefData.activationCodeExpiresUtc;
                    this.smsPrefData.validated = this.old_smsPrefData.validated;
                    this.smsPrefData.validatedDate = this.old_smsPrefData.validatedDate;
                    this.smsPrefData.assignmentCreated = this.old_smsPrefData.assignmentCreated;
                    this.smsPrefData.assignmentModified = this.old_smsPrefData.assignmentModified;
                    this.smsPrefData.assignmentCanceled = this.old_smsPrefData.assignmentCanceled;
                    this.smsPrefData.staffingNeed = this.old_smsPrefData.staffingNeed;
                    this.smsPrefData.staffingNeedCriticalPay = this.old_smsPrefData.staffingNeedCriticalPay;
                    if (this.smsPrefData.assignmentCreated && this.smsPrefData.assignmentModified && this.smsPrefData.assignmentCanceled && this.smsPrefData.staffingNeed && this.smsPrefData.staffingNeedCriticalPay) {
                        this.checkALLOption = true;
                    }
                    else {
                        this.checkALLOption = false;
                    }

                    if (this.smsPrefData.validated == false) {
                        this.smsPrefData.activationCode = "";
                        if (this.smsPrefData.activationCodeExpiresUtc != null || this.smsPrefData.activationCodeExpiresUtc != undefined) {
                            let currentDate = moment(new Date().toISOString(), 'DD-MM-YYYY HH:mm:ss');
                            let expireDate = moment(this.smsPrefData.activationCodeExpiresUtc, 'DD-MM-YYYY HH:mm:ss');
                            if (currentDate < expireDate) {
                                this.isTimerVisible = true;
                                this.isActivationCodeEnabled = true;
                                this.isMobileNoEnabled = false;
                            }
                            else {
                                this.isMobileNoEnabled = true;
                                this.isActivateButtonEnabled = true;
                            }
                        }
                        this.isSMSNtfTypesDisabled = true;
                    }
                    else {
                        this.isMobileNoEnabled = true;
                        this.isSMSNtfTypesDisabled = false;
                    }
                }
                else {
                    this.isMobileNoEnabled = false;
                    this.isActivationCodeEnabled = false;
                    this.isActivateButtonEnabled = false;
                    //this.isContentVisible = false;
                    this.smsPrefData.mobileNumber = "";
                    this.smsPrefData.validated = false;
                    this.smsPrefData.validatedDate = new Date(0);
                    // this.smsPrefData.callBeforeText = false;
                    //this.smsPrefData.callNumber = "";
                    this.smsPrefData.activationCode = "";
                    this.smsPrefData.activationCodeExpiresUtc = new Date(0);
                    this.checkALLOption = false;
                    this.smsPrefData.assignmentCreated = false;
                    this.smsPrefData.assignmentModified = false;
                    this.smsPrefData.assignmentCanceled = false;
                    this.smsPrefData.staffingNeed = false;
                    this.smsPrefData.staffingNeedCriticalPay = false;
                    this.isSMSNtfTypesDisabled = true;
                    if (this.isTimerVisible == true) {
                        this.isTimerVisible = false;
                    }
                }
            }
        }

        //@Watch("smsPrefData.mobileNumber")
        onMNchanges(newValue: string) {
            if (this.old_smsPrefData != undefined && this.smsPrefData.isUserOptedIn == true) {
                this.mn_changed = (this.old_smsPrefData.mobileNumber !== newValue ? true : false);
                this.smsPrefData.validated = (this.old_smsPrefData.mobileNumber !== newValue ? false : this.old_smsPrefData.validated);
                //this.smsPrefData.validatedDate = (this.old_smsPrefData.mobileNumber !== newValue ? new Date(0) : this.old_smsPrefData.validatedDate);
                if (this.old_smsPrefData.mobileNumber !== newValue) {
                    this.smsPrefData.activationCode = "";
                    this.isActivationCodeEnabled = false;
                    this.isActivateButtonEnabled = true;
                }
                else {

                    if (this.smsPrefData.validated == false) {
                        this.smsPrefData.activationCode = "";

                        if (this.smsPrefData.activationCodeExpiresUtc != null || this.smsPrefData.activationCodeExpiresUtc != undefined) {
                            let currentDate = moment(new Date().toISOString(), 'DD-MM-YYYY HH:mm:ss');
                            let expireDate = moment(this.smsPrefData.activationCodeExpiresUtc, 'DD-MM-YYYY HH:mm:ss');
                            if (currentDate < expireDate) {
                                this.isActivationCodeEnabled = true;
                                this.isMobileNoEnabled = false;
                            }
                            else {
                                this.isMobileNoEnabled = true;
                                this.isActivateButtonEnabled = true;
                            }
                        }
                    }
                    else {
                        this.isActivateButtonEnabled = false;
                        this.smsPrefData.activationCode = this.old_smsPrefData.activationCode;
                    }
                }
            }
        }

        //@Watch("smsPrefData.activationCode")
        onATCchanges(newValue: string) {

            if (this.old_smsPrefData != undefined) {
                this.ac_changed = (this.old_smsPrefData.activationCode !== newValue ? true : false);
            }
        }

        //@Watch("smsPrefData.assignmentCreated")
        onACRChanges(newValue: boolean, oldValue: boolean) {
            this.validateNotificationTypes("assignmentCreated");
            if (this.old_smsPrefData != undefined) {
                this.acr_changed = (this.old_smsPrefData.assignmentCreated !== newValue ? true : false);
            }
        }

        //@Watch("smsPrefData.assignmentModified")
        onAMChanges(newValue: boolean, oldValue: boolean) {
            this.validateNotificationTypes("assignmentModified");
            if (this.old_smsPrefData != undefined) {
                this.amd_changed = (this.old_smsPrefData.assignmentModified !== newValue ? true : false);
            }
        }

        //@Watch("smsPrefData.assignmentCanceled")
        onACCChanges(newValue: boolean, oldValue: boolean) {
            this.validateNotificationTypes("assignmentCanceled");
            if (this.old_smsPrefData != undefined) {
                this.acc_changed = (this.old_smsPrefData.assignmentCanceled !== newValue ? true : false);
            }
        }

        //@Watch("smsPrefData.staffingNeed")
        onSNChanges(newValue: boolean, oldValue: boolean) {
            this.validateNotificationTypes("staffingNeed");
            if (this.old_smsPrefData != undefined) {
                this.sn_changed = (this.old_smsPrefData.staffingNeed !== newValue ? true : false);
            }
        }

        //@Watch("smsPrefData.staffingNeedCriticalPay")
        onSNCPChanges(newValue: boolean, oldValue: boolean) {
            this.validateNotificationTypes("staffingNeedCriticalPay");
            if (this.old_smsPrefData != undefined) {
                this.sncp_changed = (this.old_smsPrefData.staffingNeedCriticalPay !== newValue ? true : false);
            }
        }

        ///-- All code which is related to Call Number and Call before text checkbox is commented for now-- if it comes in future then it will be reused--///
        //@Watch("smsPrefData.callBeforeText")
        //onCBTChanges(newValue: boolean, oldValue: boolean) {
        //    if (newValue == true) {
        //        this.smsPrefData.callNumber = (this.smsPrefData.callNumber == "" ? this.smsPrefData.mobileNumber : this.smsPrefData.callNumber);
        //    }
        //    else {
        //        this.smsPrefData.callNumber = "";
        //    }

        //    if (this.old_smsPrefData != undefined) {
        //        this.cbt_changed = (this.old_smsPrefData.callBeforeText !== newValue ? true : false);
        //    }
        //}

        //@Watch("smsPrefData.callNumber")
        //onCNChanges(newValue: string, oldValue: string) {

        //    if (this.old_smsPrefData != undefined) {
        //        this.cn_changed = (this.old_smsPrefData.callNumber !== newValue ? true : false);
        //    }
        //}
    }
</script>
<style scoped>
    .readonly_text_field {
        background-color: whitesmoke;
        display: block;
        width: 100%;
        height: 2.5rem;
        line-height: 2.5rem;
        border: 1px solid #d9d9d6;
        border-radius: 5px;
        padding: 0 0.938rem;
        font-size: 1em;
        color: #1f2532;
    }

    .neu-button--blue-disabled, .neu-button--blue-disabled:hover, .neu-button--blue-disabled:focus, .neu-button--blue-disabled:active {
        background-color: #6595bf;
        color: #ffffff;
        outline: none;
        cursor: not-allowed;
    }

    .maxbutton_width {
        max-width: 100%;
    }

    .info_icon_bgcolor {
        background-color: #005589;
    }

    .neu-margin--top-05 {
        margin-top: 0.300em !important;
    }

    .wrapper {
        cursor: not-allowed;
    }

    @media (max-width: 480px) {
        .overflowHide{
            overflow-x: hidden;
        }

        .btnActivate{
            flex: 0 0 18.666667% !important;
            max-width: 18.666667% !important;
        }

        .btnActivateDiv{
            max-width: 100%;
        }
    }

    @media (min-width: 481px) and (max-width: 899px) {
        .flex50{
            flex: 0 0 50% !important;
        }

        .overflowHide{
            overflow-x: hidden;
        }

        .btnActivate{
            flex: 0 0 18.666667% !important;
            max-width: 18.666667% !important;
        }

        .btnActivateDiv{
            max-width: 100%;
        }
    }

     @media print {
        .marTop13{
            margin-top: 1.3em !important;
        }
    }
</style>