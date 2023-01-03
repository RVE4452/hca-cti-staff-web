<template>
    <transition name="modal-fade">
        
        <div class="flex absolute z-max" >            
            <div class="c4c-modal fade " style="border: 5px solid black;"
                 role="dialog"
                 aria-labelledby="modalTitle"
                 aria-describedby="modalDescription">
                <header class="f3 fw7 modal-header flex relative" id="modalTitle">
                   
                </header>
                <div v-if="isSuccess">
                <div  class="row col-sm-10">
                    <div class="col-sm-2"><i class="material-icons">check_circle</i></div>
                    <div class="col-sm-8">Success!</div>                  
                </div>
                 <div class="col-sm-12">Your submitted shifts are now pending review prior to scheduling. </div>                 
                
                </div>
                <div v-else class="row col-sm-12">
                    <div class="col-sm-2"><i class="material-icons">error_outline</i></div>
                    <div class="col-sm-10" style="float:left;">Your requested shifts cannot be submitted for the following reason(s):</div>                  
                </div>
                <div v-if="!isSuccess" class="row col-sm-12 neu-margin--left-10">
                    <ul>
                        <li v-if="scheduleToCommitment">You have not met your full scheduling commitment.</li>
                        <li v-if="weekendCommitment">You have not met your weekend shift commitment.</li>
                        <li v-if="scheduleBeyondcommitment">You cannot request shifts beyond your commitment during self-scheduling.</li>
                    </ul>
                <div>
                    The progress bar in the calendar view indicates how close you are to meeting your self-scheduling commitments.
                </div>
                <div>
                    <div class="row col-sm-12">
                        
                        <div class="col-sm-2"> <vue-circle :progress="50"
                                            :size="55"
                                            :reverse="false"
                                            line-cap="round"
                                            :fill="{ color: '#007fbe' }"                                            
                                            empty-fill="rgba(0, 0, 0, .1)"
                                            :animation-start-value="0.0"
                                            :start-angle="0"
                                            insert-mode="append"
                                            :thickness="3"
                                            :show-percent="false">
                                
                                </vue-circle></div>
                        <div class="col-sm-4 neu-margin--left-10">Under Commitment</div>
                        <div class="col-sm-2"> <vue-circle :progress="100"
                                            :size="55"
                                            :reverse="false"
                                            line-cap="round"
                                            :fill="{ color: '#ffc844' }"                                            
                                            empty-fill="rgba(0, 0, 0, .1)"
                                            :animation-start-value="0.0"
                                            :start-angle="0"
                                            insert-mode="append"
                                            :thickness="3"
                                            :show-percent="false">
                                
                                </vue-circle></div>
                        <div class="col-sm-2 neu-margin--left-10">Exceeds Commitment</div>
                    </div>
                     <div class="row col-sm-12">
                        
                        <div class="col-sm-2"> <vue-circle :progress="100"
                                            :size="55"
                                            :reverse="false"
                                            line-cap="round"
                                            :fill="{ color: '#007fbe' }"                                            
                                            empty-fill="rgba(0, 0, 0, .1)"
                                            :animation-start-value="0.0"
                                            :start-angle="0"
                                            insert-mode="append"
                                            :thickness="3"
                                            :show-percent="false">
                                
                                </vue-circle></div>
                        <div class="col-sm-4 neu-margin--left-10">Full Commitment</div>
                        <div class="col-sm-2"> <vue-circle :progress="100"
                                            :size="55"
                                            :reverse="false"
                                            line-cap="round"
                                            :fill="{ color: '#992902' }"                                            
                                            empty-fill="rgba(0, 0, 0, .1)"
                                            :animation-start-value="0.0"
                                            :start-angle="0"
                                            insert-mode="append"
                                            :thickness="3"
                                            :show-percent="false">
                                
                                </vue-circle></div>
                        <div class="col-sm-2 neu-margin--left-10">Overtime</div>
                    </div>
                </div>
                    <!-- <p> <i class="material-icons">check_circle</i> {{msgValue}} </p> -->
                </div>
                <div class="neu-margin--top-20 neu-margin--bottom-20 neu-text--align-center">                    
                    <button @click="onCancelClick()" class="neu-button--primary neu-button neu-button--raised adjustWidth neu-margin--left-10">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>
// <script lang="ts">
//     import { Component, Vue, Prop } from "vue-property-decorator";
//      import VueCircle from 'vue2-circle-progress'

//     @Component({
//          components: {
//             VueCircle}
//     })
//     export default class AlertPopUp extends Vue {

//         @Prop()
//         msgValue: any;
//         @Prop()
//         isSuccess: any;
//         @Prop()
//         scheduleToCommitment: any;
//         @Prop()
//         weekendCommitment: any;
//         @Prop()
//         scheduleBeyondcommitment: any;

//         onCancelClick() { this.$emit('cancelled'); }
//     }

// </script>

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
        min-width: 60%;
        max-width: 80%;
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

    @media only screen and (min-device-width: 475px) and (max-device-width: 812px) {
        .c4c-modal {
            max-width: 95%;
        }
    }

    .adjustWidth {
        min-width: auto !important;
    }
</style>
