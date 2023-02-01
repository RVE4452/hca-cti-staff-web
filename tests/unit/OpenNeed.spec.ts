import { mount, shallowMount } from '@vue/test-utils';
import OpenNeed from '@/components/shared/OpenNeed.vue';
import Vuex from 'vuex';
import { currentEvent, profileData, resultOpenNeed } from '../../src/mocks/mockSpecData';

const store = new Vuex.Store({
    modules: {
      "profile": {
        namespaced: true,
        state: {
          profileData: profileData,
          appInsightEventData: [],
          isAdmin: false,
          isImpersonating: false
        },
        actions: {
        }
      },
      "schedule": {
        namespaced: true,
        state: {
            openNeedShiftMembers: resultOpenNeed,
            assignmentDetail: resultOpenNeed,
            openNeedsFacilities: resultOpenNeed,
            openNeedsDepartments: resultOpenNeed,
            openNeedsShiftDetails: resultOpenNeed
        },
        actions: {
            getOpenNeeds: jest.fn(),
            GetScheduleAssignmentDetail: jest.fn(),
            WithdrawEvent: jest.fn(),
            ScheduleOpenNeedRequest: jest.fn()
        }
      }
    },
  })
  let wrapper: any;
  const componentOptions = {
    store,
    data: () => {
      return {
        appInsightEventData: {},            
        profileData: [],
        openNeedShiftMembers: [],
        assignmentDetail: [],
        openNeedsFacilities: [],
        openNeedsDepartments: [],
        openNeedsShiftDetails: [],
        currentEvent: {}
      }
    },
    props: {
      appInsightEventData: {},
      profileData: profileData,
      openNeedShiftMembers: resultOpenNeed,
      assignmentDetail: resultOpenNeed,
      openNeedsFacilities: resultOpenNeed,
      openNeedsDepartments: resultOpenNeed,
      openNeedsShiftDetails: resultOpenNeed,
      scheduleStartDate: "2023-01-30",
      scheduleEndDate: "2023-01-31",
      currentEvent: currentEvent
    },
    global: {
      mocks: {
        $store:store,
      },
    } 
}
  // beforeEach(() => {
  //  wrapper = mount(OpenNeed, componentOptions);
  // })
  // afterEach(() => {
  //   jest.clearAllMocks();
  // })
  describe('computed prop', () => {
    wrapper = mount(OpenNeed, componentOptions);
    wrapper.vm.data = {
      allShifts: [{departmentId:110541, skillId: 14}],
      shifts: [],
      selectedShift: "cef47bce-8a04-435d-9f0c-47bb5a1a2966",
      shiftMembers: [],
      partialShifts: [],
      selectedPartialShift: null
  };
    describe("Testing on Controls",() => {   
      
        wrapper.vm.profileData = profileData;
        wrapper.vm.openNeedsDepartments = resultOpenNeed;
        wrapper.vm.openNeedsFacilities = resultOpenNeed;
        wrapper.vm.openNeedShiftMembers = resultOpenNeed;
        wrapper.vm.openNeedsShiftDetails = resultOpenNeed;
        wrapper.vm.currentEvent = currentEvent;
        wrapper.vm.facilities = resultOpenNeed;
        wrapper.vm.isLoaded = true;
        wrapper.vm.currentEvent.type = "Need";

        it("check for facility dropdown option value", async () => {
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.selectedFacilityId).toBe(12);
        });
        it("check for department dropdown option value", async () => {
          //expect(wrapper.html()).toBe(1);      
          const selectDept = wrapper.find('.ddl-department-option');
          await wrapper.vm.$nextTick();
          //await selectDept.setValue('110'); //Note: wrapper.setValue() cannot be called on NEU-SELECT        
          expect(selectDept.text()).toBe("(60702) PCU");         
        });
        it("check for skill dropdown option value", async () => {
          await wrapper.vm.$nextTick();   
          expect(wrapper.vm.selectedSkillId).toBe(110);      
        });
        
        it("check for shift dropdown option value", async () => {
          await wrapper.vm.$nextTick();   
          expect(wrapper.vm.data.selectedShift).toBe("");      
        });

        // it("check for facility dropdown onChangeEvent Id - onFacilityChange", async () => {
        //   wrapper.vm.isLoaded = true;
        //   await wrapper.vm.$nextTick();
          
        //   expect (wrapper.html()).toBe("");
        //   const select = wrapper.findComponent({ref: 'ddlFacility'});
        //   await wrapper.vm.$nextTick();
        //   expect(select.exists()).toBe(true);
        //   const event = {
        //     target: {
        //       value: 2
        //     }
        //   }
        //   wrapper.findComponent({ref: 'ddlFacility'}).vm.$emit("v-neu-change", event);
        //   await wrapper.vm.$nextTick();
        //   expect(wrapper.vm.selectedFacilityId).toBe(2);
        // });

        // it("check for department dropdown onChangeEvent Id- onOpenNeedDepartmentChange", async () => {  
        //   const event = { target: { value: 110541 } }      
        //   const spy = jest.spyOn(wrapper.vm, "onOpenNeedDepartmentChange")
        //   await wrapper.vm.$nextTick();          
        //   const selectDept = wrapper.find('.ddl-department');
        //   await wrapper.vm.$nextTick();          
        //   selectDept.trigger("v-neu-change");
        //   expect(spy).toHaveBeenCalled();
        //   // wrapper.vm.onOpenNeedDepartmentChange(event);
        //   // expect(wrapper.vm.selectedDeptId).toBe(110541);
        // });       
      });

      describe("Testing on loadopenNeedShiftMembers", () => { 
        wrapper.vm.openNeedsShiftDetails = resultOpenNeed;
        it("check prop values in loadopenNeedShiftMembers", async ()=> {
          wrapper.vm.loadopenNeedShiftMembers();
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.selectedFacilityId).toBe(12);
          expect(wrapper.vm.primarySkillId).toBe(110);       
        })
      });

      describe("Testing on loadopenNeeds", () => {
        wrapper.vm.assignmentDetail = resultOpenNeed; 
        wrapper.vm.facilities = resultOpenNeed;
        it("check prop values in loadopenNeeds", async ()=> {
          wrapper.vm.loadopenNeeds();
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.isLoaded).toBe(true);
          //expect(wrapper.vm.facilityName).toBe("Frisbie Memorial Hospital");
          expect(wrapper.vm.departmentName).toBe("");
          expect(wrapper.vm.needid).toBe(undefined);         
        })
      });

      describe("Testing on onOpenNeedFacilityChange", () => {
        wrapper.vm.assignmentDetail = resultOpenNeed; 
        wrapper.vm.facilities = resultOpenNeed;
        it("check prop values in onOpenNeedDepartmentChange", async ()=> {  
            const event = {
              target: {
                value: 12
              }
            }    
            wrapper.vm.onOpenNeedFacilityChange(event);
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.selectedFacilityId).toBe(12);
            expect(wrapper.vm.facilityName).toBe("Parkland Hospital");
            expect(wrapper.vm.facilityDepts.length).toBe(1);
            expect(wrapper.vm.departmentName).toBe("60702");
          })
      });

      describe("Testing on onOpenNeedDepartmentChange", () => {
        wrapper.vm.openNeedsShiftDetails = resultOpenNeed;
        it("check prop values in onOpenNeedDepartmentChange", async ()=> {  
          const event = {
            target: {
              value: 110541
            }
          }    
          wrapper.vm.onOpenNeedDepartmentChange(event);
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.selectedDeptId).toBe(110541);
          expect(wrapper.vm.departmentName).toBe("60702");
          expect(wrapper.vm.deptShifts.length).toBe(1);
        })
      });

      describe("Testing on onOpenNeedSkillChange", () => {
        wrapper.vm.openNeedsShiftDetails = resultOpenNeed;
        it("check prop values in onOpenNeedSkillChange", async ()=> {  
          const event = {
            target: {
              value: 14
            }
          }    
          wrapper.vm.onOpenNeedSkillChange(event);
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.selectedSkillId).toBe(14);
          expect(wrapper.vm.skillName).toBe(undefined);
          expect(wrapper.vm.deptShifts.length).toBe(1);
          expect(wrapper.vm.deptPartialShifts.length).toBe(0);
        })
      });

      describe("Testing on setShiftDetails", () => {
        wrapper.vm.openNeedsShiftDetails = resultOpenNeed;
        wrapper.vm.deptShifts = resultOpenNeed;
        
        it("check prop values in setShiftDetails", async ()=> {            
          //wrapper.vm.setShiftDetails(185611,36083);
          wrapper.vm.setShiftDetails(0,0);
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.data.shifts.length).toBe(1);
          expect(wrapper.vm.data.selectedShift).toBe("cef47bce-8a04-435d-9f0c-47bb5a1a2966");
          expect(wrapper.vm.deptShiftDesc).toBe(undefined);
        })
      });

      describe("Testing on setPartialShiftDetails", () => {
        wrapper.vm.openNeedsShiftDetails = resultOpenNeed;
        wrapper.vm.deptPartialShifts = resultOpenNeed;
        it("check prop values in setPartialShiftDetails", async ()=> { 
          wrapper.vm.setPartialShiftDetails(0,0);
          await wrapper.vm.$nextTick();
          //expect(wrapper.vm.data.allShifts.length).toBe(0);
          //expect(wrapper.vm.data.partialShifts.length).toBe(0);
          expect(wrapper.vm.deptPartialShiftDesc).toBe("");
        })
      });

      describe("Testing on onOpenNeedShiftChanges", () => {
        wrapper.vm.openNeedsShiftDetails = resultOpenNeed;
        wrapper.vm.deptPartialShifts = resultOpenNeed;
        it("check prop values in onOpenNeedShiftChanges", async ()=> { 
          wrapper.vm.onOpenNeedShiftChanges();
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.data.shifts.length).toBe(1);
        })
      });

      describe("Testing on onOpenNeedPartialShiftChanges", () => {
        wrapper.vm.openNeedsShiftDetails = resultOpenNeed;
        wrapper.vm.deptPartialShifts = resultOpenNeed;
        wrapper.vm.showErrorMsg = true;
        it("check prop values in onOpenNeedPartialShiftChanges", async ()=> { 
          wrapper.vm.onOpenNeedPartialShiftChanges();
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.errorMsg).toBe("");
        })
      });

      describe("Testing on selectedShiftId", () => {
        it("check prop values in selectedShiftId", async ()=> { 
          wrapper.vm.selectedShiftId();
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.showPartial).toBe(false);
        })
      });

      describe("Testing on selectedShiftActualStartTime", () => {
        it("check prop values in selectedShiftActualStartTime", async ()=> { 
          wrapper.vm.selectedShiftActualStartTime();
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.showPartial).toBe(false);
        })
      });

      describe("Testing on selectedShiftActualEndTime", () => {
        it("check prop values in selectedShiftActualEndTime", async ()=> { 
          wrapper.vm.selectedShiftActualEndTime();
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.showPartial).toBe(false);
        })
      });

      describe("Testing on FireAction", () => {
        wrapper.vm.currentEvent = currentEvent;
        it("check prop values in FireAction", async ()=> { 
          wrapper.vm.FireAction();
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.isLoading).toBe(true);
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.isLoading).toBe(false);
        })
      });
  });

  