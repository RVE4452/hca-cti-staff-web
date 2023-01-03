<template>
    <div v-if="schedulingPrefData" class="overflowHide">

        <div class="neu-margin--bottom-20 neu-margin--top-10 neu-text--caption">
            Selecting Preferences does not guarantee that they will be honored.
        </div>
        <notifications group="smspreference" position="top center" />
        <!-- <div class="row neu-margin--bottom-20">
        <div class="col-sm-12">
            <h6 class="neu-text--transform-uppercase">
                SELF SCHEDULING
            </h6>
        </div>
        <div class="col-sm-12 neu-margin--top-20">
            <div class="neu-checkbox">
                <input id="chkselfScheduling" name="a11y-issues" type="checkbox" class="neu-checkbox__input" v-model="schedulingPrefData.selfScheduling">
                <label class="neu-checkbox__label neu-text--caption" for="chkselfScheduling">Populate my monthly self-scheduling requests according to my departmental Work Schedule and Primary Shift</label>
            </div>
        </div>
    </div> -->
        <!--<div class="row neu-margin--bottom-20">
        <div class="col-sm-12">
            <h6 class="neu-text--transform-uppercase">
                MARKET FLOAT
            </h6>
        </div>
        <div class="col-sm-12 neu-margin--top-20 ">
            <div class="neu-checkbox">
                <input id="chkmarketFloat" name="a11y-issues" type="checkbox" class="neu-checkbox__input" v-model="schedulingPrefData.marketFloat">
                <label class="neu-checkbox__label neu-text--caption" for="chkmarketFloat">I am willing to be floated to departments in my Service Line outside of my home Facility</label>
            </div>
        </div>
    </div>-->
        <div class="row neu-margin--bottom-20">
            <div class="col-sm-12">
                <h6 class="neu-text--transform-uppercase">
                    SHIFT PATTERN
                </h6>
            </div>
            <div class="col-sm-3 neu-margin--top-20 flex48"  >
                <div role="radiogroup" class="neu-radiogroup" id="rdbtngrpShiftPattern">
                    <div class="neu-radio neu-margin--top-05">
                        <input id="rdbtngrpShiftPatternNoPref" type="radio" class="neu-radio__input" value='117' v-model="schedulingPrefData.shiftPattern">
                        <label class="neu-radio__label neu-text--caption" for="rdbtngrpShiftPatternNoPref" >No preference</label>
                    </div>
                    <div class="neu-radio neu-margin--top-05">
                        <input id="rdbtngrpShiftPatternCon" type="radio" class="neu-radio__input" value='118'  v-model="schedulingPrefData.shiftPattern">
                        <label class="neu-radio__label neu-text--caption" for="rdbtngrpShiftPatternCon" >Consecutive</label>
                    </div>
                    <div class="neu-radio neu-margin--top-05">
                        <input id="rdbtngrpShiftPatternOne" type="radio" class="neu-radio__input" value='119'  v-model="schedulingPrefData.shiftPattern">
                        <label class="neu-radio__label neu-text--caption" for ="rdbtngrpShiftPatternOne"> One On / One Off</label>
                    </div>
                    <div class="neu-radio neu-margin--top-05">
                        <input id="rdbtngrpShiftPatternTwo" type="radio" class="neu-radio__input" value='120'  v-model="schedulingPrefData.shiftPattern">
                        <label class="neu-radio__label neu-text--caption" for="rdbtngrpShiftPatternTwo" >Two On / One Off</label>
                    </div>
                </div>
            </div>
        </div>        
        <div class="row neu-margin--bottom-20">
                <div class="col-sm-12">
                    <h6 class="neu-text--transform-uppercase">
                        DAY OF WEEK
                    </h6>
                </div>
                <div class="col-sm-3 neu-margin--top-20 flex48" v-for="dowp in schedulingPrefData.daysOfWeek" :key="dowp.dayOfWeekId">
                    <span class="neu-text--product">{{dowp.dayOfWeek}}</span>
                    <div role="radiogroup" class="neu-radiogroup" :id="'rdbtngrp_' + dowp.dayOfWeekId">
                        <div class="neu-radio neu-margin--top-05">
                            <input :id="'rdbtnNoPref_' + dowp.dayOfWeekId" type="radio" class="neu-radio__input" value="No preference" v-model="dowp.avaliablity">
                            <label class="neu-radio__label neu-text--caption" :for="'rdbtnNoPref_' + dowp.dayOfWeekId">No preference</label>
                        </div>
                        <div class="neu-radio neu-margin--top-05">
                            <input :id="'rdbtnPrefWork_' + dowp.dayOfWeekId" type="radio" class="neu-radio__input" value="I prefer to work" v-model="dowp.avaliablity">
                            <label class="neu-radio__label neu-text--caption" :for="'rdbtnPrefWork_' + dowp.dayOfWeekId">I prefer to work</label>
                        </div>
                        <div class="neu-radio neu-margin--top-05">
                            <input :id="'rdbtnPrefNotWork_' + dowp.dayOfWeekId" type="radio" class="neu-radio__input" value="I prefer not to work" v-model="dowp.avaliablity">
                            <label class="neu-radio__label neu-text--caption" :for="'rdbtnPrefNotWork_' + dowp.dayOfWeekId">I prefer not to work</label>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="!isImpersonating" class="no-print">
                <button @click="saveSchedulingDetails" :class="[anyChangeHappend ? '' : 'neu-button--blue-disabled', 'neu-button--primary neu-button neu-button--raised']" :disabled="!anyChangeHappend">
                    Save Changes
                </button>
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
    import moment from "moment";
    import { mapState } from "vuex"
    import { SchedulingPreferences, DayOfWeekPreferences } from '@/models';
    import SaveMsgPopUp from "@/components/shared/SaveMsgPopUp.vue";

    // import { bus } from '../../main'
    //import bus from '../../eventBus'

    @Options({
        computed: {
            ...mapState('profile', ['schedulingPrefData','isAdmin','profileData','isImpersonating']),
        },
        components: { SaveMsgPopUp }
    })
    export default class SchedulingPref extends Vue {
        old_schedulingData!: SchedulingPreferences;

        isModalVisible: boolean = false;
        msgValue: string = '';
        classFlag: string = '';

        is_selfScheduling_Changed: boolean = false;
        //is_marketFloat_Changed: boolean = false;
        is_dowPref_Changed: boolean = false;
        is_shiftPattern_Changed: boolean = false;
        public schedulingPrefData!: SchedulingPreferences;
        isAdmin!: boolean;
        public profileData!: any;
        isImpersonating!: boolean;

        constructor() {
            super();
            //get singal r notification by using event bus
            // bus.$on("smsprefchanged", (msg:any) => {
            //     this.getSchedulingPrefData();
                // this.$notify({
                //     group: "smspreference",
                //     title: "Alert",
                //     text: msg,
                // });
            //});
        }
        mounted() {
            this.getSchedulingPrefData();
        }

        async getSchedulingPrefData() {
            await this.$store.dispatch('profile/getSchedulingPrefDetails', this.profileData.username)
                .then((res: any) => {
                    this.old_schedulingData = JSON.parse(JSON.stringify(this.schedulingPrefData));    
                                   
                })
                .catch((err: any) => {
                    if (err) {
                        console.log(err);
                    }
                });
        }

        async saveSchedulingDetails() {                        
             for (var i = 0; i < this.schedulingPrefData.daysOfWeek.length; i++) {
                if(this.schedulingPrefData.daysOfWeek[i].avaliablity == "I prefer to work")
                {
                this.schedulingPrefData.daysOfWeek[i].preference = true
                }
                else
                {
                    this.schedulingPrefData.daysOfWeek[i].preference = false
                }                
            } 
                    this.schedulingPrefData.shiftPattern = Number(this.schedulingPrefData.shiftPattern); 
                    await this.$store.dispatch('profile/saveSchedulingPrefDetails', { username: this.profileData.username, schPrefData: this.schedulingPrefData })                .then((res: any) => {
                    this.is_selfScheduling_Changed = false;
                    //this.is_marketFloat_Changed = false;
                    this.is_dowPref_Changed = false;      
                    this.is_shiftPattern_Changed = false;              
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

        //@Watch('schedulingPrefData.selfScheduling')
        onSSChanges(newValue: boolean) {
            if (this.old_schedulingData != undefined) {
                this.is_selfScheduling_Changed = (this.old_schedulingData.selfScheduling !== newValue ? true : false);
            }
        }

        //@Watch('schedulingPrefData.marketFloat')
        //onMFChanges(newValue: boolean) {
        //    if (this.old_schedulingData != undefined) {
        //        this.is_marketFloat_Changed = (this.old_schedulingData.marketFloat !== newValue ? true : false);
        //    }
        //}

        //@Watch('schedulingPrefData.shiftPattern')
        onSPChanges(newValue: number) {
           if (this.old_schedulingData != undefined) {
               this.is_shiftPattern_Changed = (this.old_schedulingData.shiftPattern !== newValue ? true : false);
           }
        }

        //@Watch('schedulingPrefData.daysOfWeek', { deep: true })
        onDWPChanges(newValue: DayOfWeekPreferences[]) {
            if (this.old_schedulingData != undefined) {
                let isChanged: boolean = false;
                for (var i = 0; i < newValue.length; i++) {
                    isChanged = (this.old_schedulingData.daysOfWeek[i].avaliablity !== newValue[i].avaliablity ? true : isChanged);
                }
                this.is_dowPref_Changed = isChanged;
            }
        }

        get anyChangeHappend() {
            return (this.is_selfScheduling_Changed || this.is_dowPref_Changed || this.is_shiftPattern_Changed); // this.is_marketFloat_Changed ||
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

    .neu-margin--top-05 {
        margin-top: 0.325em !important;
    }

    .neu-button--blue-disabled, .neu-button--blue-disabled:hover, .neu-button--blue-disabled:focus, .neu-button--blue-disabled:active {
        background-color: #6595bf;
        color: #ffffff;
        outline: none;
        cursor: not-allowed;
    }

    @media (max-width: 480px) {
        .overflowHide{
            overflow-x: hidden;
        }
    }
    /* Media Query for low resolution  Tablets, Ipads */
    @media (min-width: 481px) and (max-width: 899px) {
        .flex48 {
            flex: 0 0 48%;
            max-width: 48%;
        }

        .overflowHide{
            overflow-x: hidden;
        }
    }

    
</style>