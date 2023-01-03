<template>
    <transition name="modal-fade">
        <div class="modal-backdrop flex absolute z-max">
            <div class="c4c-modal fade w-50"
                 role="dialog"
                 aria-labelledby="modalTitle"
                 aria-describedby="modalDescription">
                <header class="f3 fw7 modal-header flex relative" id="modalTitle">
                    Alert
                </header>
                <div class="align-content-center">
                    <p> {{msgValue}} </p>
                </div>
                <div class="neu-margin--top-20 neu-margin--bottom-20 neu-text--align-center">                    
                    <button @click="onCancelClick()" class="neu-button--primary neu-button neu-button--raised adjustWidth neu-margin--left-10">
                        Ok
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>
<script lang="ts">
    //import plugins and modules
    import { Options, Vue } from 'vue-class-component';
    class Props{
        msgValue: any;
    }
    @Options({
    })
    export default class AlertPopUp extends Vue.with(Props) {


        onCancelClick() { 
            //this.$emit('cancelled');
             }
    }

</script>

<style lang="css">
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

    .modal-header {
        padding: 15px;
        justify-content: center;
    }

    .modal-body {
        position: relative;
        padding: 20px 10px;
    }

    .c4c-modal {
        max-width: 50%;
        overflow: hidden;
        font-family: "HCA-Mark-Medium", "Arial", sans-serif !important;
        margin-top: 8rem;
        background: white;
        box-shadow: 0px 16px 30px 0px rgba("1f2532", 0.5);
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

    @media only screen and (min-device-width: 375px) and (max-device-width: 812px) {
        .c4c-modal {
            max-width: 95%;
        }
    }

    .adjustWidth {
        min-width: auto !important;
    }
</style>
