import { mount, shallowMount } from '@vue/test-utils';
import DayPreference from '@/components/shared/DayPreference.vue';
import Vuex from 'vuex';
import { profileData,  } from '../../src/mocks/mockSpecData';

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
      }
    },
  })
  let wrapper: any;
  wrapper = shallowMount (DayPreference, {
    store,
    data: () => {
      return {
        appInsightEventData: {},
        profileData: []
      }
    },
    props: {
      appInsightEventData: {},
      profileData: profileData
    },
    global: {
      mocks: {
        $store:store,
      },
    } 
});

  describe("Testing on onPreferenceChange", () => {
    wrapper.vm.profileData = profileData;
    it("check prop values in onPreferenceChange", async ()=> {  
      const value = "Required"
           
      wrapper.vm.selectionChange(value);
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.dayPreference).toBe("Required");
    //   expect(wrapper.vm.facilityDepts.length).toBe(0);
    })
  });