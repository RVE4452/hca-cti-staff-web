<template>
    <div class="modal-backdrop flex absolute z-max">
        <div class="save-modal absolute fade" :id="[notificationPopUpModalId]" aria-labelledby="savePopUpModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div :class="['neu-snackbar', calssName]">
                        <div>
                            <i class="material-icons mr0 neu-snackbar__feedback-icon">
                                {{
                                    iconName
                                }}
                            </i>
                            <span>{{ headerText}}</span>
                        </div>
                        <span :class="['neu-snackbar__text', notificationBody]" v-html="msgValue">
                        </span>
                        <button :class="[btnClassName, 'neu-button neu-button--small neu-margin--left-auto']" @click="closeButtonClicked">
                            Ok
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    //import plugins and modules
    import { Options, Vue } from 'vue-class-component';

    class Props{
        msgValue: any;
        classFlag: any;
    }
    @Options({
    })
    export default class NotificationMsgPopUp extends Vue.with(Props) {
       
        calssName: string = "";
        iconName: string = "";
        btnClassName: string = "";
        headerText: string = "";
        notificationBody: string = "";
        notificationPopUpModalId: string = "";

        created() {
            if (this.classFlag == 'success') {
                this.calssName = 'neu-snackbar--success';
                this.iconName = 'check_circle';
                this.btnClassName = 'neu-button--success btnNotificationSuccess';
                this.headerText = 'Success';
                this.notificationBody = 'txtSuccessMsg';
                this.notificationPopUpModalId = 'SuccessPopup';
            }
            else if (this.classFlag == 'error') {
                this.calssName = 'neu-snackbar--error';
                this.iconName = 'error';
                this.btnClassName = 'neu-button--danger btnNotificationError';
                this.headerText = 'Alert';
                this.notificationBody = 'txtErrorMsg';
                this.notificationPopUpModalId = 'ErrorPopup';
            }
        }

        mounted() {
            var errorPopupElement = document.getElementById('ErrorPopup') as HTMLElement;
            var successPopupElement = document.getElementById('SuccessPopup') as HTMLElement;

            if(errorPopupElement != null){
                var errorPopupHeight = errorPopupElement.clientHeight + 20;
                if(successPopupElement != null){
                    successPopupElement.style.top = errorPopupHeight + "px";
                }
            }
        }

        closeButtonClicked() {
            //this.$emit('closeModal')
        }
    }

</script>
<style >
.btnNotificationError{
    color: #ffffff !important;
    background-color: #960b1c !important;
}

.txtSuccessMsg{
    padding: 10px 0px !important;
    display: block !important;
    font-weight: 100 !important;
}

.btnNotificationSuccess{
    color: #ffffff !important;
    background-color: #285c4d !important;
}

.boldTxt{
    font-weight: 700 !important;
}

.txtErrorMsg{
    padding: 10px 0px !important;
    display: block !important;
}

.ulList{
    padding-left: 2rem !important;
}

</style>