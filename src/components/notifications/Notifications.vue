<template v-if="toggleStatus">
    <div class="overflow-hidden absolute bottom-0 fr right-0 z-999 notificationContainer" :style="customTop">
        <div class="bg-near-white h-100 ml-auto relative rightnav-drawer" :style="this.toggleStatus ? 'left: 0' : 'left:502px'">
            <div class="bg-near-white bl-ns h-100 pb4 z-999">
                <div class="align-items-xl-center bg-white container-fluid flex pa3 w-100">
                    <h5 class="tc w-100">Alerts</h5>
                    <span @click="closeNav()" class="material-icons pointer tr-ns notification-close">close</span>
                </div>
                <div class="container-fluid">
                    <div class="row bg-near-white ">
                    <div class="col-12 pa3">
                        <p class="f3 tl">
                             Inbox</p>
                    </div>
                    </div>

                    <div class="row bg-near-white notification-container">
                    <div class="col-12">
                        <div class="flex-flex-column">
                            <div v-for="(notifications) in notificationList" :key="notifications.id" class="div-cursor notification-list-shadow" :class="!notifications.read ? 'neu-text--bold' : 'bg-white'">
                                <div class="flex flex-row justify-content-between pa2 notification-list" :class="hideArray === notifications.id  ? 'neu-background--cerulean-25' : 'bg-white'" @click="toogleHideRule(notifications,notifications.id, 'nonurgent');">
                                    <div class="flex">
                                        <div class="br-100 f6 flex justify-content-center ml2 pa1 round-username ttu white">{{notifications.username.substring(0,2)}}</div>
                                        <div class="neu-text--caption neu-margin--left-10 align-self-center bold">{{notifications.message}}</div>
                                    </div>
                                    <div class="flex">
                                        <p class="pointer material-icons neu-button__icon  align-self-center opaque-80" @click="deleteNotification($event,notifications.id)" title="Delete Notification">delete</p>
                                        <p :class="hideArray === notifications.id ? 'chevron-toggle' : ''" class="pointer material-icons neu-button__icon neu-button__icon--left neu-text--denim align-self-center">chevron_right</p>
                                    </div>
                                </div>
                                <div v-show="hideArray === notifications.id" style="border-top:1px solid #ccc;" class="pa3">
                                    <p class="gray">{{notifications.timestampVal}}</p>
                                    <div v-html="notifications.body"></div>
                                    <div v-show='notifications.notificationEventType === "ShiftTradeOfferedTo"' class="notificationBtnContainer">
                                        <button @click="ShiftTradeOfferAction(notifications.actionableBy, 'Accept', notifications.id, notifications.shiftTradeOfferId)" 
                                                class="notificationBtn mr2 neu-button neu-button--small neu-button--raised neu-button--primary">Accept</button>
                                        <button @click="ShiftTradeOfferAction(notifications.actionableBy, 'Decline', notifications.id, notifications.shiftTradeOfferId)" 
                                                class="notificationBtn mr2 neu-button neu-button--small neu-button--raised neu-button--primary">Decline</button>
                                        <button @click="GetShiftTradeOffer(notifications.actionableBy, notifications.shiftTradeOfferId)" class="notificationBtn neu-button neu-button--small neu-button--raised neu-button--primary">View Details</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
//import plugins and modules
    import { Options, Vue } from 'vue-class-component';
    import moment from "moment";
    import { mapState } from "vuex";
// import { bus } from "../../main";
//import bus from '../../eventBus';
import { useAppInsights } from '../../store/modules/AppInsights'

class Props{
    readonly toggleStatus!: boolean;
}
@Options({
     computed: {
                ...mapState('profile', ['profileData']),
                ...mapState('notification', ['notificationList']),
            },
    data:() => {
        return {
            hideRuleContent: []
        }
    }
})
export default class Notifications extends Vue.with(Props) {
    headerHeight: string = '';    
    public firstClick: boolean = false;
    private hideArray: string = '';

    constructor() {
        super(); 
        //  bus.$on("notificationchanged",(msg:string) => {
        //          this.getAllNotification();
                //  this.$notify({
                //     group: "Notification",
                //     title: "Alert",
                //     text: msg,
                // });           
            //}); 
            
        // bus.$on("shiftTradenotificationchanged",() => {
        //          this.getAllNotification();         
        //     });
    }

    
    public profileData!: any;
    public notificationList!: any;
    async created() {
        this.getAllNotification();
    }

    //@Watch('toggleStatus', {immediate: true}) 
    onMatchChanged() {
        if(this.toggleStatus) {
            const topHeight = document.getElementsByClassName('neu-nav neu-topnav--compact')[0] as HTMLElement;
            this.headerHeight = topHeight.offsetHeight + 'px';
            this.firstClick = true;
            document.body.classList.add('fixed', 'w-100');
        } else {
            document.body.classList.remove('fixed', 'w-100');
        }
    }

    get customTop() {
        let style = '';
        if(!this.toggleStatus) {
            style = 'height:1px;';
        }
        if(this.firstClick) {
            return style+= `top:${this.headerHeight}`
        } else {
            return style;
        }
    }

    async getAllNotification() {
        await this.$store.dispatch("notification/getAllNotifications", this.profileData.username);

        this.updateNotificationCount();
    }

    GetShiftTradeOffer(actionableByDate:Date, shiftTradeOfferId:string) {
        //bus.$emit("loadShiftTradeEvent", actionableByDate, shiftTradeOfferId);
        this.closeNav();
    }    

    ShiftTradeOfferAction(actionableByDate:Date, action:any, notificationId:any, shiftTradeOfferId:any) {
        //bus.$emit('ShiftTradeActionEvent', actionableByDate, action, shiftTradeOfferId, notificationId);
        this.closeNav();
    }

    closeNav(){
        try{
            this.hideArray = '';
            this.toogleHideRule({},'', '');
            this.updateNotificationCount();
            this.$emit('close-event');
        } catch(e) {console.log(e)}
    }

    updateNotificationCount() {
        try{
            if(!this.notificationList){return}
            const notificaionUnreadCount = this.notificationList.reduce((obj: any, v: any) => {
                obj[v.read] = (obj[v.read] || 0) + 1;
                return obj;
            }, {});

            this.$emit('unreadNotification', {count: (notificaionUnreadCount.false || 0), totalCount: this.notificationList.length});
        } catch(e) {console.log(e)}
    }
    async deleteNotification(event:any, notificationId: string) {
        event.stopPropagation();
        console.log('deleteNotification:', notificationId);
        await this.$store
            .dispatch("notification/deleteNotification", notificationId);
        this.updateNotificationCount();       
    }
    toogleHideRule(notification:any, index: string, key: string): void{
        try{
            const notificationStatus = notification.read;
            if(index === this.hideArray){
                this.hideArray = '';
                return;
            } else {
                this.notificationList = this.notificationList.map((list:any) => {
                    list.timestampVal = moment(list.timestamp).format('MMM D, yy - h:mm A');
                    if(index === list.id) {
                        list.read = true;
                    }
                    return list;
                });
                if(!notificationStatus) {
                    const allNotifications = this.notificationList;
                    notification.read = true;
                    this.readMessage(notification,allNotifications);
                }
                this.hideArray= index;
                this.updateNotificationCount();
            }
        } catch(e){console.log(e)}
    }

    readMessage(notificationData:object, notificationList: any) {
        this.$store.dispatch('notification/statusUpdate', {data: notificationData, list:notificationList});
    }
}
</script>
<style scoped>
.notification-container {
    max-height: calc(100vh - 200px);
    overflow-y: scroll;
}
.notification-list-shadow{
    box-shadow: 0 0.7px 0 #bcbcbc, 0 -0.7px 0 #bcbcbc;
}
.round-username{
    height: 35px;
    border: 3px solid grey;
    background: grey;
}
.rightnav-drawer{
    width: 350px;
    left: 352px;
    transition: left 1s;
}
.chevron-toggle {
    transform: rotate(90deg);
}
.notification-close:hover {
    background-color: rgba(0,0,0,.05);
}

.notificationBtnContainer{
    text-align: center;
    margin-top: 10px;
}

.notificationBtn{
    min-width: 70px !important;
}
@media (max-width: 899px) {
    .rightnav-drawer{
        width: 100% !important;
    }
    .notificationContainer{
        width: 100% !important; 
    }
}
</style>