import { mount, shallowMount } from '@vue/test-utils';
import DayPreferenceView from '@/components/shared/DayPreference.vue';
import Vuex from 'vuex';
import { departmentSchedules, profileData, userSchedules } from '../../src/mocks/mockSpecData';

const store = new Vuex.Store({
    modules: {
      // "profile": {
      //   namespaced: true,
      //   state: {
      //     profileData: profileData,
      //     appInsightEventData: []
      //   },
      //   actions: {
      //     getProfileDetails: jest.fn()
      //   }
      // },
      "schedule": {
        namespaced: true,
        state: {
          userSchedules: userSchedules,
          departmentSchedules: departmentSchedules
        },
        actions: {
          saveDayPreference: jest.fn(),
        }
      }
    },
  })

  
  let wrapper: any;
  beforeEach(() => {   
    wrapper = mount(DayPreferenceView, {
      store,
      data: () => {
        return {
          appInsightEventData: {} as any,
          departmentSchedules: [] as any,
          userSchedules: [] as any,
          profileData: [] as any

        }
      },
      props: {
        currentEvent: {}
      },
      global: {
        mocks: {
          $store:store,
        },
      } 
    });
  });
  afterEach(() => {
    wrapper.unmount()
  })

  describe("Testing on onPreferenceChange", () => {
    // wrapper.vm.profileData = profileData;
    it("check prop values in onPreferenceChange", async ()=> {  
      const value = "Required"
           
      wrapper.vm.selectionChange(value);
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.dayPreference).toBe("Required");
    //   expect(wrapper.vm.facilityDepts.length).toBe(0);
    })
  });