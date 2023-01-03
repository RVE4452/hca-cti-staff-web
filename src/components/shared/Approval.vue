<template>
     <div class="col-12">
                <div class="bg-black-05 container-fluid">
                <div class="row">
                  <div class="col-12 pt3">
                    <p>
                      Available Annual Adjusted Vacation Days:
                      <strong>{{profileData.ptoBalance}}</strong>
                    </p>
                  </div>
                  <div class="col-12 pb4">
                    <h4>Details</h4>
                  </div>
                  <div class="col-lg-5 col-md-12 pb4" style="height:300px">
                    <ul class="overflow-auto h-100 date-list">
                        <li class="neu-background--cerulean-25 pa3 mt1">Monday, June 26</li>
                        <li class="neu-background--cerulean-25 pa3 mt1">Tuesday, June 27</li>
                        <li class="neu-background--cerulean-25 pa3 mt1">Monday, June 26</li>
                        <li class="neu-background--cerulean-25 pa3 mt1">Monday, June 26</li>
                        <li class="neu-background--cerulean-25 pa3 mt1">Tuesday, June 27</li>
                        <li class="neu-background--cerulean-25 pa3 mt1">Monday, June 26</li>
                        <li class="neu-background--cerulean-25 pa3 mt1">Monday, June 26</li>
                        <li class="neu-background--cerulean-25 pa3 mt1">Tuesday, June 27</li>
                        <li class="neu-background--cerulean-25 pa3 mt1">Monday, June 26</li>
                        <li class="neu-background--cerulean-25 pa3 mt1">Monday, June 26</li>
                        <li class="neu-background--cerulean-25 pa3 mt1">Monday, June 26</li>
                        <li class="neu-background--cerulean-25 pa3 mt1">Monday, June 26</li>
                        <li class="neu-background--cerulean-25 pa3 mt1">Monday, June 26</li>
                    </ul>
                  </div>
                  <div class="col-lg-7 col-md-12 pb4">
                    <div class="col-12">
                      <label for="approval_code" class="neu-input__label"
                        >Select shift code</label
                      >
                      <select class="neu-input__text-field">
                        <template v-for="shift in profileData.departmentShifts">
                           <option :key="shift.id" v-if="shift.canRequest">
                           {{shift.code}} {{shift.description}}
                           </option>
                        </template>
                        </select>
                    </div>

                    <div class="col-12 mt4">
                      <label for="partof_day" class="neu-input__label"
                        >Part Of Day/Hours</label
                      ><select disabled class="neu-input__text-field bg-transparent">
                        <option
                          >{{profileData.partOfDay}}</option
                        >
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="container-fluid">
                <div class="row">
                  <div class="col-12">
                    <button
                      @click="addToSchedule()"
                      class="d-block mb4 mt4 neu-button w-100 white"
                      :class="[ isImpersonating ? 'neu-button--blue-disabled': 'neu-background--denim']"
                      :disabled="isImpersonating"
                    >
                      Add to Schedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
</template>

// <script lang="ts">
// import { Component, Vue, Prop } from "vue-property-decorator";
// import { namespace } from "vuex-class";
// const profile = namespace("profile");

// @Component
// export default class Approval extends Vue {

//     @profile.State 
//     public profileData!: any;
       
//     @profile.State
//     isImpersonating!: boolean;

//     addToSchedule() {
//         console.log('TODO:: add to schedule call api');
//         this.$emit('closeSharedModal')
//     }
// }
// </script>