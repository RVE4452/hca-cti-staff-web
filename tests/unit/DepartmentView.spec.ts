import { mount, shallowMount } from '@vue/test-utils';
import DepartmentView from '@/components/schedule/DepartmentView.vue';
import Vuex from 'vuex';
import { departmentSchedules, profileData, userSchedules } from '../../src/mocks/mockDeptData';

const store = new Vuex.Store({
  modules: {
    "profile": {
      namespaced: true,
      state: {
        profileData: profileData,
        appInsightEventData: []
      },
      actions: {
        getProfileDetails: jest.fn()
      }
    },
    "schedule": {
      namespaced: true,
      state: {
        userSchedules: userSchedules,
        departmentSchedules: departmentSchedules
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
    jest.useFakeTimers('modern');
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
        profileData: profileData,
        departmentSchedules: departmentSchedules,
        userSchedules: userSchedules
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
      expect(wrapper.vm.lastUpdatedDate).toBe("2020-4-1 0:0:0")
    });
    it("should call displayDate to get the format date time", () => {
      expect(wrapper.vm.displayDate("2020-4-1 0:0:0")).toBe("2020-04-01")
    });
  });

  describe("Testing on Neu Controls",() => {
    it("check for facility dropdown onChangeEvent Id - onFacilityChange", async () => {
      const select = wrapper.findComponent({ref: 'ddlFacility'});
      expect(select.exists()).toBe(true);
      const event = {
        target: {
          value: 2
        }
      }
      wrapper.findComponent({ref: 'ddlFacility'}).vm.$emit("v-neu-change", event);
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.selectedFacilityId).toBe(2);
    });

    it("check for facility dropdown value - facilityName", async () => {
      // wrapper.setData({
      //   facilities: [{ facilityId: 1, facilityName: "Frisbie Memorial Hospital"}]
      // })
      wrapper.vm.facilities = [{ facilityId: 830, facilityName: "Frisbie Memorial Hospital"}];
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.facilities[0].facilityName).toBe("Frisbie Memorial Hospital")
    });

    it("check for facility dropdown option values", async () => {
      const options = wrapper.findComponent({ref: 'ddlFacilityOption'});
      expect(options.vm.value).toBe(830);
    });

    it("check for department dropdown onChangeEvent Id- onDepartmentChange", async () => {
      //const select = wrapper.findComponent({ref: 'ddlDepartment'});
      //expect(select.exists()).toBe(true);
      const event = {
        target: {
          value: 110541
        }
      }
      // const payload = {
      //   startDate: "2020-10-01",
      //   endDate: "2010-10-10",
      //   deptId: "387",
      //   username: "ADT4201",
      // };
      wrapper.vm.facilityDepts = [{ deptId: 110541, deptName: "ED"}];
      wrapper.findComponent({ref: 'ddlDepartment'}).vm.$emit("v-neu-change", event);
      await wrapper.vm.$nextTick();
      //expect(wrapper.vm.getDeptSchedules(payload)).toEqual(Promise.resolve({}));
      expect(wrapper.vm.selectedDeptId).toBe(110541);
    });

    it("check for department dropdown value - deptName", async () => {      
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.facilityDepts[0].deptName).toBe("ED")
    });

    it("check for department dropdown option values", async () => {
      const options = wrapper.findComponent({ref: 'ddlDepartmentOption'});
      expect(options.vm.value).toBe(110541);
    });

    it("check for skills dropdown onChangeEvent Id- onSkillSelect", async () => {
      const items = [{id:100,description:"All",skill:"All"},{id:110,description:"PCT",skill:"PCT"}];
      const lastSelectItem = "";
      wrapper.vm.skills = items;
      wrapper.vm.selectedSkills = [{id:110,description:"PCT",skill:"PCT"}];
      wrapper.findComponent({ref: 'ddlSkills'}).vm.$emit("update", items, lastSelectItem);
      await wrapper.vm.$nextTick();
      //expect(wrapper.html()).toBe("");
      expect(wrapper.vm.selectedSkills[0].id).toBe(110);
    });

    it("check for schedule blocks dropdown onChangeEvent Id- onSkillSelect", async () => {
      const items = [{id:100,description:"All",skill:"All"},{id:110,description:"PCT",skill:"PCT"}];
      const lastSelectItem = "";
      wrapper.vm.skills = items;
      wrapper.vm.selectedSkills = [{id:110,description:"PCT",skill:"PCT"}];
      wrapper.findComponent({ref: 'ddlScheduleBlocks'}).vm.$emit("update", items, lastSelectItem);
      await wrapper.vm.$nextTick();
      //expect(wrapper.html()).toBe("");
      expect(wrapper.vm.selectedSkills[0].id).toBe(110);
    });

    it("check for period dropdown onChangeEvent Id- onScheduleChange", async () => {
      const event = {
        target: {
          value: '6e1aceac-dc7b-4af3-9dfb-01b5d73648f9'
        }
      }
      //wrapper.vm.departmentSchedules = departmentSchedules;
      // const items = [{id:100,description:"All",skill:"All"},{id:110,description:"PCT",skill:"PCT"}];
      // wrapper.vm.skills = items;
      // wrapper.vm.selectedSkills = [{id:110,description:"PCT",skill:"PCT"}];
      wrapper.vm.userSchedules = userSchedules;
      // wrapper.vm.selectedDeptId = 1;
      // wrapper.vm.sortedDSList = departmentSchedules;
      // wrapper.vm.sortedDSListforSkills = departmentSchedules;
      wrapper.findComponent({ref: 'ddlPeriod'}).vm.$emit("v-neu-change", event);
      await wrapper.vm.$nextTick();
      //expect(wrapper.html()).toBe("");      
      expect(wrapper.vm.selectedScheduleId).toBe('6e1aceac-dc7b-4af3-9dfb-01b5d73648f9');
    });

    it("check for period dropdown value - selectedScheduleName", async () => {      
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.selectedScheduleName).toBe("Nov 27, 2022 - Dec 24, 2022")
    });

    it("check for period dropdown option values", async () => {
      const options = wrapper.findComponent({ref: 'ddlPeriodOption'});
      expect(options.vm.value).toBe('f456398a-e93b-47e2-b6e1-813f536a4f82');
    });
  });
})