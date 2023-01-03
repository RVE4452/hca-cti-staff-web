<template>
    <div class="no-print" v-bind:class="isSharedPanelOpen ? 'sideNavPanelDefault' : 'sideNavPanelDefaultClose'">
        <header class="fs-22 fw-bold modal-header flex relative" id="modalTitle">
            Select Shift
            <button type="button"
                    class="btn-close f1 absolute pointer"
                    @click="close"
                    data-test="modal-close"
                    aria-label="Close Modal">
                &times;
            </button>
        </header>
        <div class="pb3 row">
            <SelfSchedulingDefaultModal :currentShift="currentShift"
                                    :calSelectedDates="calSelectedDates"
                                    :key="counter"
                                    @showSuccessMsgPopUp="showSMPModal"/>
        </div>    
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from 'vue-class-component';
    import SelfSchedulingDefaultModal from './SelfSchedulingDefaultModal.vue';
    
    import { SelfScheduleDefault, SelfScheduleDefaultShift } from '@/models';
 class Props {
     currentShift!: SelfScheduleDefaultShift;
     calSelectedDates!: any;
      readonly isSharedPanelOpen!: boolean;
      counter: any;
    }
    Options({
        components: {
            SelfSchedulingDefaultModal
        },
    })
    export default class SharedModal extends Vue.with(Props) {
       

        close() {
            this.$emit("close-modal");
        }

        showSMPModal(){
            this.$emit("showSuccessMesssgPopUp");
        }
    }
</script>
<style src="@/css/shared-modal.css" />
<style scoped>
.padding-right1{
    padding-right: 0.4rem;
}
.padding-left1{
    padding-left: 0.4rem;
}
.neu-tablist{
    height:auto !important;
}

.calender-nav{
    padding-left: 10px;
    padding-right: 10px;
}
/* Media Query for Mobile Devices */
@media (max-width: 480px) {
    .sideNavPanelDefault{
        position: absolute;
        right: 0;
        top: 70px;
        background-color: #f4f4f4;
        bottom: 92px;
        z-index: 99;
        border-left-style: solid;
        border-left-width: 1px;
        width:100%;
        transition: left 1s ease-in-out;
        overflow-x: hidden;
        overflow-y: auto;
        border: 1px solid var(--fc-border-color, #ddd);
    }

    .sideNavPanelDefaultClose{
        display:none; 
        left: 502px;
        transition: left 1s ease-in-out;
    }

    @keyframes fade_in_show {
        0% {
            opacity: 0;
            transform: scale(0)
        }

        100% {
            opacity: 1;
            transform: scale(1)
        }
    }
}
          
/* Media Query for low resolution  Tablets, Ipads */
@media (min-width: 481px) and (max-width: 767px) {
     .sideNavPanelDefault{
        position: absolute;
        right: 0;
        top: 70px;
        background-color: #f4f4f4;
        bottom: 92px;
        z-index: 99;
        border-left-style: solid;
        border-left-width: 1px;
        width:100%;
        transition: left 1s ease-in-out;
        overflow-x: hidden;
        overflow-y: auto;
        border: 1px solid var(--fc-border-color, #ddd);
    }

    .sideNavPanelDefaultClose{
        display:none; 
        left: 502px;
        transition: left 1s ease-in-out;
    }

    @keyframes fade_in_show {
        0% {
            opacity: 0;
            transform: scale(0)
        }

        100% {
            opacity: 1;
            transform: scale(1)
        }
    }       
}

@media (min-width: 768px) and (max-width: 899px) {
     .sideNavPanelDefault{
        position: absolute;
        right: 0;
        top: 70px;
        background-color: #f4f4f4;
        bottom: 92px;
        z-index: 99;
        border-left-style: solid;
        border-left-width: 1px;
        width:100%;
        transition: left 1s ease-in-out;
        overflow-x: hidden;
        overflow-y: auto;
        border: 1px solid var(--fc-border-color, #ddd);
    }

    .sideNavPanelDefaultClose{
        display:none; 
        left: 502px;
        transition: left 1s ease-in-out;
    }

    @keyframes fade_in_show {
        0% {
            opacity: 0;
            transform: scale(0)
        }

        100% {
            opacity: 1;
            transform: scale(1)
        }
    }       
}
          
/* Media Query for Tablets Ipads portrait mode */
@media (min-width: 900px) and (max-width: 1024px){
     .sideNavPanelDefault{
        position: absolute;
        right: 0;
        top: 70px;
        width: 30%;
        display: block;
        background-color: #f4f4f4;
        bottom: 92px;
        overflow-x: hidden;
        overflow-y: auto;
        border: 1px solid var(--fc-border-color, #ddd);
    }

    .sideNavPanelDefaultClose{
        display:none;
    }

    @keyframes fade_in_show {
        0% {
            opacity: 0;
            transform: scale(0)
        }

        100% {
            opacity: 1;
            transform: scale(1)
        }
    }        
}
          
/* Media Query for Laptops and Desktops */
@media (min-width: 1025px) {
    .sideNavPanelDefault{
        position: absolute;
        right: 0;
        top: 60px;
        width: 25%;
        display: block;
        background-color: #f4f4f4;
        bottom: 92px;
        overflow-x: hidden;
        overflow-y: auto;
        border: 1px solid var(--fc-border-color, #ddd);
    }

    .sideNavPanelDefaultClose{
        display:none;
    }

    @keyframes fade_in_show {
        0% {
            opacity: 0;
            transform: scale(0)
        }

        100% {
            opacity: 1;
            transform: scale(1)
        }
    }            
}
</style>