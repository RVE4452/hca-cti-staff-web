<template>
    <div v-if="notificationPrefData">
        <div class="row neu-margin--bottom-10">
            <div class="col-sm-12 neu-margin--top-20">
                <h6 class="neu-text--transform-uppercase">
                    FLAGGED NOTIFICATIONS
                </h6>
            </div>
            <div class="col-sm-12 neu-margin--top-20">
                <div class="neu-margin--bottom-20 neu-margin--top-10 neu-text--caption">
                    Select any in-app notification types to be flagged as urgent within your Staff Portal inbox:
                </div>
            </div>
            <div class="col-sm-12">
                <div class="neu-checkbox ">
                    <input type="checkbox" id="chk1" class="neu-checkbox__input" v-model="notificationPrefData.selfScheduleOpening">
                    <label class="neu-checkbox__label neu-text--caption" for="chk1">Self-scheduling tier opening reminders</label>
                </div>
                <div class="neu-checkbox neu-margin--top-10">
                    <input type="checkbox" id="chk2" class="neu-checkbox__input" v-model="notificationPrefData.selfScheduleClosing">
                    <label class="neu-checkbox__label neu-text--caption" for="chk2">Self-scheduling tier closing reminders</label>
                </div>
                <div class="neu-checkbox neu-margin--top-10">
                    <input type="checkbox" id="chk3" class="neu-checkbox__input" v-model="notificationPrefData.departmentNeedsAvaliable">
                    <label class="neu-checkbox__label neu-text--caption" for="chk3">Departmental needs available</label>
                </div>
                <div class="neu-checkbox neu-margin--top-10">
                    <input type="checkbox" id="chk4" class="neu-checkbox__input" v-model="notificationPrefData.shiftsAvaliableForTrade">
                    <label class="neu-checkbox__label neu-text--caption" for="chk4">Shifts available for trade</label>
                </div>
                <div class="neu-checkbox neu-margin--top-10">
                    <input type="checkbox" id="chk5" class="neu-checkbox__input" v-model="notificationPrefData.shiftTradeOffered">
                    <label class="neu-checkbox__label neu-text--caption" for="chk5">Shift trade offered</label>
                </div>
                <div class="neu-checkbox neu-margin--top-10">
                    <input type="checkbox" id="chk6" class="neu-checkbox__input" v-model="notificationPrefData.shiftTradeOfferAccepted">
                    <label class="neu-checkbox__label neu-text--caption" for="chk6">Shift trade offer accepted</label>
                </div>
                <div class="neu-checkbox neu-margin--top-10">
                    <input type="checkbox" id="chk7" class="neu-checkbox__input" v-model="notificationPrefData.requestApproved">
                    <label class="neu-checkbox__label neu-text--caption" for="chk7">Needs Approval request approved</label>
                </div>
                <div class="neu-checkbox neu-margin--top-10">
                    <input type="checkbox" id="chk8" class="neu-checkbox__input" v-model="notificationPrefData.vacationBiddingTierOpening">
                    <label class="neu-checkbox__label neu-text--caption" for="chk8">Vacation biding tier opening reminders</label>
                </div>
                <div class="neu-checkbox neu-margin--top-10">
                    <input type="checkbox" id="chk9" class="neu-checkbox__input" v-model="notificationPrefData.vacationBiddingTierClosing">
                    <label class="neu-checkbox__label neu-text--caption" for="chk9">Vacation biding tier closing reminders</label>
                </div>
            </div>
        </div>
        <div class="row neu-margin--top-30 neu-margin--bottom-10">
            <div class="col-sm-12">
                <button @click="saveNotificationDetails" :class="[anyChangeHappened ? '' : 'neu-button--blue-disabled', 'neu-button--primary neu-button neu-button--raised']" :disabled="!anyChangeHappened">
                    Save Changes
                </button>
            </div>
        </div>

        <div v-if="isModalVisible">
            <SaveMsgPopUp @closeModal="closeModal"
                          :msgValue="msgValue"
                          :classFlag="classFlag"></SaveMsgPopUp>
        </div>
    </div>
</template>

<script lang="ts">
   import { Options, Vue } from 'vue-class-component';
    import { mapState } from "vuex";
    import { NotificationPreferences } from "@/models";
    import SaveMsgPopUp from "@/components/shared/SaveMsgPopUp.vue";
    
    @Options({ components: { SaveMsgPopUp },
     computed: {
            ...mapState('profile', ['notificationPrefData','profileData']),
        }, })
    export default class NotificationMgmt extends Vue {

        old_ntfPrefData!: NotificationPreferences;

        sso_changed: boolean = false;
        ssc_changed: boolean = false;
        dna_changed: boolean = false;
        sat_changed: boolean = false;
        sto_changed: boolean = false;
        stoa_changed: boolean = false;
        ra_changed: boolean = false;
        vbto_changed: boolean = false;
        vbtc_changed: boolean = false;

        isModalVisible: boolean = false;
        msgValue: string = '';
        classFlag: string = '';
        public notificationPrefData!: NotificationPreferences;
        public profileData!: any;

        mounted() {
            this.getNotificationPrefData();
        }

        async getNotificationPrefData() {
            await this.$store.dispatch('profile/getNotificationPrefDetails', this.profileData.username)
                .then((res: any) => {
                    this.old_ntfPrefData = JSON.parse(JSON.stringify(this.notificationPrefData));
                })
                .catch((err: any) => {
                    if (err) {
                        console.log(err);
                    }
                });
        }

        async saveNotificationDetails() {
            await this.$store.dispatch('profile/saveNotificationPrefDetails', { username: this.profileData.usernam, ntfData: this.notificationPrefData})
                .then((res: any) => {
                    this.sso_changed = false;
                    this.ssc_changed = false;
                    this.dna_changed = false;
                    this.sat_changed = false;
                    this.sto_changed = false;
                    this.stoa_changed = false;
                    this.ra_changed = false;
                    this.vbto_changed = false;
                    this.vbtc_changed = false;

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

        //@Watch('notificationPrefData.selfScheduleOpening')
        onSSOChanges(newValue: boolean) {
            if (this.old_ntfPrefData != undefined) {
                this.sso_changed = (this.old_ntfPrefData.selfScheduleOpening !== newValue ? true : false);
            }
        }

        //@Watch('notificationPrefData.selfScheduleClosing')
        onSSCChanges(newValue: boolean) {
            if (this.old_ntfPrefData != undefined) {
                this.ssc_changed = (this.old_ntfPrefData.selfScheduleClosing !== newValue ? true : false);
            }
        }

        //@Watch('notificationPrefData.departmentNeedsAvaliable')
        onDNAChanges(newValue: boolean) {
            if (this.old_ntfPrefData != undefined) {
                this.dna_changed = (this.old_ntfPrefData.departmentNeedsAvaliable !== newValue ? true : false);
            }
        }

        //@Watch('notificationPrefData.shiftsAvaliableForTrade')
        onSATChanges(newValue: boolean) {
            if (this.old_ntfPrefData != undefined) {
                this.sat_changed = (this.old_ntfPrefData.shiftsAvaliableForTrade !== newValue ? true : false);
            }
        }

        //@Watch('notificationPrefData.shiftTradeOffered')
        onSTOChanges(newValue: boolean) {
            if (this.old_ntfPrefData != undefined) {
                this.sto_changed = (this.old_ntfPrefData.shiftTradeOffered !== newValue ? true : false);
            }
        }

        //@Watch('notificationPrefData.shiftTradeOfferAccepted')
        onSTOAChanges(newValue: boolean) {
            if (this.old_ntfPrefData != undefined) {
                this.stoa_changed = (this.old_ntfPrefData.shiftTradeOfferAccepted !== newValue ? true : false);
            }
        }

        //@Watch('notificationPrefData.requestApproved')
        onRAChanges(newValue: boolean) {
            if (this.old_ntfPrefData != undefined) {
                this.ra_changed = (this.old_ntfPrefData.requestApproved !== newValue ? true : false);
            }
        }

        //@Watch('notificationPrefData.vacationBiddingTierOpening')
        onVBTOChanges(newValue: boolean) {
            if (this.old_ntfPrefData != undefined) {
                this.vbto_changed = (this.old_ntfPrefData.vacationBiddingTierOpening !== newValue ? true : false);
            }
        }

        //@Watch('notificationPrefData.vacationBiddingTierClosing')
        onVBTCChanges(newValue: boolean) {
            if (this.old_ntfPrefData != undefined) {
                this.vbtc_changed = (this.old_ntfPrefData.vacationBiddingTierClosing !== newValue ? true : false);
            }
        }

        get anyChangeHappened() {    
            let returnVal: boolean = false;
            if (this.sso_changed || this.ssc_changed || this.dna_changed || this.sat_changed || this.sto_changed || this.stoa_changed || this.stoa_changed || this.ra_changed || this.vbto_changed || this.vbtc_changed)
            {
                returnVal = true;
            }
            return returnVal;
        }

        showModal() {
            this.isModalVisible = true;
        }
        closeModal() {
            this.isModalVisible = false;
        }
    }
</script>
<style scoped>
    .neu-button--blue-disabled, .neu-button--blue-disabled:hover, .neu-button--blue-disabled:focus, .neu-button--blue-disabled:active {
        background-color: #6595bf;
        color: #ffffff;
        outline: none;
        cursor: not-allowed;
    }
</style>

