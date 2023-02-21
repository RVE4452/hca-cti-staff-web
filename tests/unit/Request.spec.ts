import { mount, shallowMount } from '@vue/test-utils';
import Request from '@/components/shared/Request.vue';
import Vuex from 'vuex';
import { requestDetailsMockData, profileMockData } from '../../src/mocks/requestMockSpecData';

const store = new Vuex.Store({
    modules:{
        "schedule":{
            namespaced: true,
            state:{
                requestDetail: requestDetailsMockData,
                userSchedules: []
            },
            actions:{
                getRequestEvent:jest.fn()
            }
        },
        "profile":{
            namespaced: true,
            state:{
                profileData: profileMockData,
                appInsightEventData: []
            },
            actions: {
                getRequestEvent:jest.fn()
            }
        }
    }
})

let wrapper: any;

describe('computed prop', () => {
    beforeAll(() => {
      jest.setSystemTime(new Date(2020, 3, 1));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    wrapper = mount(Request, {
        store,
        data: () => {
          return {
            appInsightEventData: {},
            requestDetail: [],
            profileData: [],
            userSchedules: []
          }
        },
        props: {
          appInsightEventData: {},
          profileData: profileMockData,
          departmentSchedules: requestDetailsMockData,
          userSchedules: requestDetailsMockData
        },
        global: {
          mocks: {
            $store:store,
          },
        } 
    });
    // ENDs Wrapper

    describe("Testing on Methods", () => {
        it("should display Estimated PTO Balance", () =>{
            expect(wrapper.vm.ptoBalance).toBe(undefined);
        });

        it("should display  label 'Select Shift'", () =>{
            expect(wrapper.text()).toContain('Select Shift');
        });

        it("check for Select Shift dropdown option value", async () => {
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.shift).toBe("");
        });

        it("should display label 'Start Time'", () =>{
            expect(wrapper.text()).toContain('Start Time');
        });

        it("should call Start Time to get the format time", () => {
            expect(wrapper.vm.formatTime("24/2/2023")).toBe("06 PM")
        })
    })


});