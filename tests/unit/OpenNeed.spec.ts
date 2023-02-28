import { shallowMount } from '@vue/test-utils';
import OpenNeed from '@/components/shared/OpenNeed.vue';
import Vuex from 'vuex';
import { currentEvent, staff, resOpenNeedData } from '../../src/mocks/mockSpecData';

const store = new Vuex.Store({
    modules: {
      "profile": {
        namespaced: true,
        state: {
          profileData: staff,
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
            openNeedShiftMembers: resOpenNeedData,
            assignmentDetail: [],
            openNeedsFacilities: resOpenNeedData,
            openNeedsDepartments: resOpenNeedData,
            openNeedsShiftDetails: resOpenNeedData
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
      profileData: staff,
      openNeedShiftMembers: resOpenNeedData,
      assignmentDetail: [],
      openNeedsFacilities: resOpenNeedData,
      openNeedsDepartments: resOpenNeedData,
      openNeedsShiftDetails: resOpenNeedData,
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
  describe('computed prop', () => {
    wrapper = shallowMount(OpenNeed, componentOptions);
    wrapper.vm.data = {
      allShifts: [{departmentId:110541, skillId: 14}],
      shifts: [{departmentId:110541, departmentShiftId: 14}],
      selectedShift: "14",
      shiftMembers: [],
      partialShifts: [],
      selectedPartialShift: null
    };
    wrapper.vm.profileData = staff;
    wrapper.vm.openNeedsDepartments = resOpenNeedData;
    wrapper.vm.openNeedsFacilities = resOpenNeedData;
    wrapper.vm.openNeedShiftMembers = resOpenNeedData;
    wrapper.vm.openNeedsShiftDetails = resOpenNeedData;
    wrapper.vm.currentEvent = currentEvent;
    wrapper.vm.facilities = resOpenNeedData;
    wrapper.vm.isLoaded = true;
    wrapper.vm.currentEvent.type = "Need";
    wrapper.vm.selectedSkillId = 89;
    describe("Testing on Controls",() => {   
        it("check for facility dropdown option value", async () => {
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.selectedFacilityId).toBe(15);
        });
        it("check for department dropdown option value", async () => {    
          const selectDept = wrapper.find('.ddl-department-option');
          await wrapper.vm.$nextTick();
          //await selectDept.setValue('110'); //Note: wrapper.setValue() cannot be called on NEU-SELECT        
          expect(selectDept.text()).toBe("(22222) Test Dept");         
        });
        it("check for skill dropdown option value", async () => {
          await wrapper.vm.$nextTick();   
          expect(wrapper.vm.selectedSkillId).toBe("");      
        });
        
        it("check for shift dropdown option value", async () => {
          await wrapper.vm.$nextTick();   
          expect(wrapper.vm.data.selectedShift).toBe("");      
        });           
      });

      describe("Testing on loadopenNeedShiftMembers", () => { 
        it("check prop values in loadopenNeedShiftMembers", async ()=> {
          wrapper.vm.loadopenNeedShiftMembers();
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.selectedFacilityId).toBe(15);       
        })
      });

      describe("Testing on loadopenNeeds", () => {
        wrapper.vm.assignmentDetail = {
          facilityName: "Mock Facility",
        }; 
        it("check prop values in loadopenNeeds", async ()=> {
          wrapper.vm.loadopenNeeds();
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.isLoaded).toBe(true);
          expect(wrapper.vm.facilityName).toBe("Mock Facility");        
        })
      });

      describe("Testing on onOpenNeedFacilityChange", () => {
        it("check prop values in onOpenNeedFacilityChange", async ()=> {  
            const event = {target: { value: 12 } }    
            wrapper.vm.onOpenNeedFacilityChange(event);
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.selectedFacilityId).toBe(12);
          })
      });

      describe("Testing on onOpenNeedDepartmentChange", () => {
        it("check prop values in onOpenNeedDepartmentChange", async ()=> {  
          const event = {target: { value: 110541 } }   
          wrapper.vm.onOpenNeedDepartmentChange(event);
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.selectedDeptId).toBe(110541);
        })
      });

      describe("Testing on onOpenNeedSkillChange", () => {
        it("check prop values in onOpenNeedSkillChange", async ()=> {  
          const event = {target: { value: 14 } }   
          wrapper.vm.onOpenNeedSkillChange(event);
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.selectedSkillId).toBe(14);
          expect(wrapper.vm.skillName).toBe(undefined);
          expect(wrapper.vm.deptPartialShifts.length).toBe(2);
        })
      });

      describe("Testing on setShiftDetails", () => {        
        it("check prop values in setShiftDetails", async ()=> { 
          wrapper.vm.setShiftDetails(0,0);
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.data.shifts.length).toBe(1);
        })
      });

      describe("Testing on setPartialShiftDetails", () => {
        it("check prop values in setPartialShiftDetails", async ()=> { 
          wrapper.vm.setPartialShiftDetails(0,0);
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.deptPartialShiftDesc).toBe("");
        })
      });

      describe("Testing on onOpenNeedShiftChanges", () => {
        wrapper.vm.deptPartialShifts = resOpenNeedData;
        const event = { target: { value: 12 } };
        it("check prop values in onOpenNeedShiftChanges", async ()=> { 
          wrapper.vm.onOpenNeedShiftChanges(event);
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.data.selectedShift).toBe(12);
        })
      });

      describe("Testing on onOpenNeedPartialShiftChanges", () => {
        wrapper.vm.data.partialShifts = [{id: 1, departmentShiftId: 639}];
        wrapper.vm.showErrorMsg = true;
        it("check prop values in onOpenNeedPartialShiftChanges", async ()=> { 
          wrapper.vm.onOpenNeedPartialShiftChanges();
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.errorMsg).toBe("");
          expect (wrapper.vm.data.partialShifts.length).toBe(1);
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

  