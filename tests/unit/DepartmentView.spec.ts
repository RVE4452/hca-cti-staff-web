import { mount, shallowMount } from '@vue/test-utils';
import DepartmentView from '@/components/schedule/DepartmentView.vue';
import Vuex from 'vuex';
import { staff, departmentSchedulesNew } from '../../src/mocks/mockSpecData';
import moment from "moment";

const store = new Vuex.Store({
  modules: {
    "profile": {
      namespaced: true,
      state: {
        profileData: staff,
        appInsightEventData: []
      },
      actions: {
        getProfileDetails: jest.fn()
      }
    },
    "schedule": {
      namespaced: true,
      state: {
        userSchedules: staff?.schedules,
        departmentSchedules: departmentSchedulesNew
      },
      actions: {
        getDepartmentSchedule: jest.fn(),
        getAllUserSchedules: jest.fn()
      }
    }
  },
})
let wrapper: any;

describe('computed prop', () => {
  beforeAll(() => {
    //jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2020, 3, 1));
  });
  afterAll(() => {
    jest.useRealTimers();
});

    wrapper = mount(DepartmentView, {
      store,
      data: () => {
        return {
          appInsightEventData: {},
          departmentSchedules: [],
          userSchedules: [],
          profileData: []
        }
      },
      props: {
        appInsightEventData: {},
        profileData: staff,
        departmentSchedules: departmentSchedulesNew,
        userSchedules: staff?.schedules
      },
      global: {
        mocks: {
          $store:store,
        },
      } 
  });
  describe("Testing on methods",() => {
    it("should call getLastUpdatedDate to update the lastUpdatedDate", () => {
      wrapper.vm.getLastUpdatedDate();
      expect(moment(wrapper.vm.lastUpdatedDate).format("MM/DD/yyyy")).toBe(moment(new Date()).format("MM/DD/yyyy"))
    });
    it("should call displayDate to get the format date time", () => {
      expect(wrapper.vm.displayDate("2020-4-1 0:0:0")).toBe("2020-04-01")
    });
    it("should call getFormattedDate to get the format date time", () => {
      expect(wrapper.vm.getFormattedDate("2020-4-1 0:0:0")).toBe("1")
    });
  });

  describe("Testing on Neu Controls",() => {
    wrapper.vm.userSchedules = staff?.schedules;
    wrapper.vm.profileData = staff;
    wrapper.vm.departmentSchedules = departmentSchedulesNew;
    // it("check for facility dropdown onChangeEvent Id - onFacilityChange", async () => {
    //   //expect(wrapper.html()).toBe("");
    //   const select = wrapper.findComponent({ref: 'ddlFacility'});
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

    it("check for facility dropdown value - facilityName", async () => {
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.facilities[0].facilityName).toBe("Mock Facility")
    });

    // it("check for facility dropdown option values", async () => {
    //   const options = wrapper.findComponent({ref: 'ddlFacilityOption'});
    //   expect(options.vm.value).toBe(9);
    // });

    // it("check for department dropdown onChangeEvent Id- onDepartmentChange", async () => {
    //   const event = {
    //     target: {
    //       value: 110541
    //     }
    //   }
    //   wrapper.vm.facilityDepts = [{ deptId: 110541, deptName: "ED"}];
    //   wrapper.findComponent({ref: 'ddlDepartment'}).vm.$emit("v-neu-change", event);
    //   await wrapper.vm.$nextTick();
    //   //expect(wrapper.vm.getDeptSchedules(payload)).toEqual(Promise.resolve({}));
    //   expect(wrapper.vm.selectedDeptId).toBe(110541);
    // });

    it("check for department dropdown value - deptName", async () => {      
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.facilityDepts[0].deptName).toBe(undefined)
    });

    // it("check for department dropdown option values", async () => {
    //   const options = wrapper.findComponent({ref: 'ddlDepartmentOption'});
    //   expect(options.vm.value).toBe(110541);
    // });

    it("check for skills dropdown onChangeEvent Id- onSkillSelect", async () => {
      const items = [{id:100,description:"All",skill:"All"},{id:110,description:"PCT",skill:"PCT"}];
      const lastSelectItem = "";
      wrapper.vm.skills = items;
      wrapper.findComponent({ref: 'ddlSkills'}).vm.$emit("update", items, lastSelectItem);
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.selectedSkills[0].description).toBe("All");
    });

    it("check for schedule blocks dropdown onChangeEvent Id- onScheduleBlockSelect", async () => {      
      const items1 = [{startTime:"07:00:00",description:"All",endTime:"07:00:00"},{startTime:"1:00:00",description:"PCT",endTime:"1:00:00"}];
      const lastSelectItem = "";
      wrapper.vm.scheduleBlocks = items1;
      wrapper.findComponent({ref: 'ddlScheduleBlocks'}).vm.$emit("update", items1, lastSelectItem);
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.selectedScheduleBlock[0].description).toBe("All");
    });

    // it("check for period dropdown onChangeEvent Id- onScheduleChange", async () => {
    //   const event = {
    //     target: {
    //       value: '6e1aceac-dc7b-4af3-9dfb-01b5d73648f9'
    //     }
    //   }
    //   wrapper.findComponent({ref: 'ddlPeriod'}).vm.$emit("v-neu-change", event);
    //   await wrapper.vm.$nextTick();
    //   //expect(wrapper.html()).toBe("");      
    //   expect(wrapper.vm.selectedScheduleId).toBe('6e1aceac-dc7b-4af3-9dfb-01b5d73648f9');
    // });

    it("check for period dropdown value - selectedScheduleName", async () => {      
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.selectedScheduleName).toBe("Dec 4, 2022 - Dec 31, 2022")
    });

    // it("check for period dropdown option values", async () => {
    //   const options = wrapper.findComponent({ref: 'ddlPeriodOption'});
    //   expect(options.vm.value).toBe(14);
    // });
  });

  describe("Testing on getDepartmentSchedule", () => {
    wrapper.vm.selectedDeptId = 1;
    wrapper.vm.departmentSchedules = departmentSchedulesNew;    
    it("should call getLastUpdatedDate method when trigger the getDepartmentSchedule", async ()=> {
      wrapper.vm.getDepartmentSchedule();
      await wrapper.vm.$nextTick();
      //expect(wrapper.vm.lastUpdatedDate).toBe("2023-1-20 10:41:55");
      expect(wrapper.vm.sortOrder).toBe("asc");
      expect(wrapper.vm.sortArrow).toBe("arrow_upward");
      expect(wrapper.vm.finalArray).toBe(undefined);
      expect(wrapper.vm.selectedSkills[0].skill).toBe("All");
      expect(wrapper.vm.selectedSkillList).toBe("All");
    })
  });

  describe("Testing on getFiltersData", () => {
    wrapper.vm.profileData = staff;
    it("check prop values in getFiltersData", async ()=> {      
      wrapper.vm.getFiltersData();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.selectedFacilityId).toBe(9);
      expect(wrapper.vm.facilities[0].facilityName).toBe('Mock Facility');
      expect(wrapper.vm.selectedDeptName).toBe("Test Dept");
    })
  });

  describe("Testing on showScheduleDays", () => {
    wrapper.vm.userSchedules = staff?.schedules;
    it("check prop values in showScheduleDays", async ()=> {      
      wrapper.vm.showScheduleDays();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.days.length).toBe(28);
    })
  });

  describe("Testing on getSortedDSData", () => {
    wrapper.vm.userSchedules = staff?.schedules;
    it("check prop values in getSortedDSData", async ()=> {      
      wrapper.vm.getSortedDSData('clicked');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.sortArrow).toBe("arrow_downward");
      expect(wrapper.vm.sortOrder).toBe("desc");
      expect(wrapper.vm.sortedDSList.length).toBe(13);
    })
  });

  describe("Testing on onDepartmentChange", () => {
    it("check prop values in onDepartmentChange", async ()=> {  
      const event = {
        target: {
          value: 2
        }
      }    
      wrapper.vm.onDepartmentChange(event);
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.selectedDeptId).toBe(2);
      expect(wrapper.vm.sortOrder).toBe("desc");
    })
  });

  describe("Testing on onFacilityChange", () => {
    wrapper.vm.profileData = staff;
    it("check prop values in onFacilityChange", async ()=> {  
      const event = {
        target: {
          value: 15
        }
      }    
      wrapper.vm.onFacilityChange(event);
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.selectedFacilityId).toBe(15);
      expect(wrapper.vm.facilityDepts.length).toBe(0);
    })
  });

  describe("Testing on onScheduleChange", () => {
    wrapper.vm.userSchedules = staff?.schedules;
    it("check prop values in onScheduleChange", async ()=> {  
      const value = {
        target: {
          value: 30
        }
      }    
      wrapper.vm.onScheduleChange(value);
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.selectedScheduleId).toBe(30);
    })
  });

  describe("Testing on onSkillSelect", () => {
    wrapper.vm.userSchedules = staff?.schedules;
    it("check prop values in onSkillSelect", async ()=> {  
      const items = [{id:100,description:"All",skill:"All"},{id:110,description:"PCT",skill:"PCT"}];
      const lastSelectItem = "";  
      wrapper.vm.onSkillSelect(items, lastSelectItem);
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.selectedSkills[0].description).toBe("PCT");
      expect(wrapper.vm.selectedSkills[0].skill).toBe("PCT");
    })
  });

  describe("Testing on getSchedulePeriod", () => {
    wrapper.vm.userSchedules = staff?.schedules;
    it("check prop values in getSchedulePeriod", async ()=> {  
      const indexVal = 1;
      wrapper.vm.getSchedulePeriod(indexVal);
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.scheduleDate).toBe(undefined);
    })
  });

  describe("Testing on hideColumns", () => {
    it("check prop values in hideColumns", async ()=> { 
      wrapper.vm.hideColumns();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.columnToggle).toBe(true);
      expect(wrapper.vm.iconToggle).toBe(false);
    })
  });

  describe("Testing on showColumns", () => {
    it("check prop values in showColumns", async ()=> { 
      wrapper.vm.showColumns();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.columnToggle).toBe(false);
      expect(wrapper.vm.iconToggle).toBe(true);
    })
  });

  describe("Testing on applyCSS", () => {
    wrapper.vm.dayname = "Wed";
    it("check prop values in applyCSS", async ()=> { 
      const date = "Wed Mar 22 2023 00:00:00";
      const ds = null;
      wrapper.vm.applyCSS(date, ds);
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.getcss).toBe(undefined);
    })
  });
})