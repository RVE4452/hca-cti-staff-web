import { mount, shallowMount } from '@vue/test-utils';
import DayPreference from '@/components/shared/DayPreference.vue';
import Vuex from 'vuex';
import { staff } from '../../src/mocks/mockSpecData';

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
      }
    },
  })
 
 const wrapper = shallowMount (DayPreference, {
    store,
    data: () => {
      return {
        appInsightEventData: {},
        profileData: []
      }
    },
    props: {
      appInsightEventData: {},
      profileData: staff
    },
    global: {
      mocks: {
        $store:store,
      },
    } 
});

  describe("Testing on onPreferenceChange", () => {
    wrapper.vm.profileData = staff;
    it("check prop values in onPreferenceChange", async ()=> {  
      const value = "Required"
           
      wrapper.vm.selectionChange(value);
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.dayPreference).toBe("Required");
    //   expect(wrapper.vm.facilityDepts.length).toBe(0);
    })
  });