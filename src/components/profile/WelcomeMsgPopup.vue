<template>
    <transition name="modal-fade">
        <div class="modal-backdrop flex absolute z-max">
            <div class="c4c-modal fade w-50 modelPosition"
                 role="dialog"
                 aria-labelledby="modalTitle"
                 aria-describedby="modalDescription">
                <header class="fw7 modal-heading flex relative" id="modalTitle">
                    MyScheduler
                    <button type="button"
                        class="btn-close absolute pointer"
                        @click="closeWelcomePopup"
                        data-test="modal-close"
                        aria-label="Close Modal">
                        &times;
                    </button>
                </header>
                <div class="align-content-center p15">
                    <p> Welcome to MyScheduler! </p>
                    <br/>
                    <p> Please click the link below to view a brief introductory video about the app and its features. </p>
                </div>
                <div class="neu-margin--top-20 neu-margin--bottom-20 neu-text--align-center">
                    <a class="neu-link" href="https://mediaconnect.app.medcity.net/sharevideo/0a367c94-453e-43f6-a2fa-ebe3b8a9296f?startAt=00m00s&autoplay" target="_blank" @click="closeWelcomePopup">Introduction to MyScheduler</a>
                    <!-- <a class="neu-link neu-margin--left-30" href="javascript:void(0)" @click="closeWelcomePopup">Skip</a> -->
                </div>
            </div>
        </div>
    </transition>
</template>
<script lang="ts">
    import { Options, Vue } from 'vue-class-component';

    @Options({
    })
    export default class WelcomeMsgPopup extends Vue {
        closeWelcomePopup() { this.$emit('closeWelcomePopup'); }
    }

</script>

<style lang="css" scoped>
    .vertical-center {
        margin: 0;
        position: absolute;
        justify-content: center;
        align-items: center;
    }
    .modal-fade-enter,
    .modal-fade-leave-to {
        opacity: 0;
    }

    .modal-fade-enter-active,
    .modal-fade-leave-active {
        transition: opacity 0.5s ease;
    }

    .modal-backdrop {
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.3);
        justify-content: center;
        align-items: center;
    }

    .modal {
        background: #ffffff;
        box-shadow: 2px 2px 20px 1px;
        overflow-x: auto;
        display: flex;
        flex-direction: column;
    }

    .modal-heading {
        padding: 15px!important;
        justify-content: center!important;
        background-color: rgb(20 31 58)!important;
        color: #fff!important;
    }

    .modal-body {
        position: relative;
        padding: 20px 10px;
    }

    .c4c-modal {
        max-width: 50%;
        overflow: hidden;
        font-family: "HCA-Mark-Medium", "Arial", sans-serif !important;
        margin-top: 0 !important;
        margin-bottom: 13rem;
        background: white;
        box-shadow: 0 11px 15px -7px rgb(0 0 0 / 20%), 0 24px 38px 3px rgb(0 0 0 / 14%), 0 9px 46px 8px rgb(0 0 0 / 12%);
    }

    .c4c-modal-body section {
        border-radius: 4px;
        border: 1px solid #bcbcbc;
        padding: 1rem;
        margin-bottom: 1rem;
    }

        .c4c-modal-body section h6 {
            text-transform: uppercase;
            font-size: 1rem;
        }

    .btn-close{
        height: 20px !important;
        font-size: 2rem !important;
    }
    .btn-close:hover {
        background-color: #005589 !important;
        color: #fff !important;
    }

    .p15{
        padding: 15px;
    }

    /* Media Query for Mobile Devices */
@media (max-width: 480px) {
    .modelPosition{
        margin-bottom: 37rem;
        width: 90% !important;
        max-width: 90% !important;
    }
}
          
/* Media Query for low resolution  Tablets, Ipads */
@media (min-width: 481px) and (max-width: 700px) {
     .modelPosition{
        margin-bottom: 38rem;
        width: 70% !important;
        max-width: 70% !important;
    }
}

@media (min-width: 701px) and (max-width: 767px) {
     .modelPosition{
        margin-bottom: 15rem;
        width: 70% !important;
        max-width: 70% !important;
    }
}
          
/* Media Query for Tablets Ipads portrait mode */
@media (min-width: 768px) and (max-width: 1024px){
     .modelPosition{
        margin-bottom: 17rem;
    }
  
}
          
/* Media Query for Laptops and Desktops */
@media (min-width: 1025px) {
    .modelPosition{
        margin-bottom: 5rem;
    }      
}

    @media only screen and (min-device-width: 375px) and (max-device-width: 812px) {
        .c4c-modal {
            max-width: 95%;
        }
    }
</style>
confirm