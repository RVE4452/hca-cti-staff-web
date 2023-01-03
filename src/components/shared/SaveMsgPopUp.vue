<template>
    <div class="modal-backdrop flex absolute z-max">
        <div class="save-modal absolute fade" id="savePopUpModal" aria-labelledby="savePopUpModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div :class="['neu-snackbar', calssName]">
                        <i class="material-icons neu-snackbar__feedback-icon">
                            {{
                                iconName
                            }}
                        </i>
                        <span class="neu-snackbar__text">
                            {{
                                msgValue
                            }}
                        </span>
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
    export default class SaveMsgPopUp extends Vue.with(Props) {
        calssName: string = "";
        iconName: string = "";

        created() {
            if (this.classFlag == 'success') {
                this.calssName = 'neu-snackbar--success';
                this.iconName = 'check_circle';
            }
            else if (this.classFlag == 'error') {
                this.calssName = 'neu-snackbar--error';
                this.iconName = 'error';
            }
        }

        mounted() {
            let vm = this;
            setTimeout(function () { vm.closeButtonClicked() }, 3000);
        }

        closeButtonClicked() {
            //this.$emit('closeModal')
        }
    }

</script>