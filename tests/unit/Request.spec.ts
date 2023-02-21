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
            profileData: profileMockData,
            appInsightEventData: {},          
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
            expect(wrapper.vm.formatTime("10/4/2023")).toBe("00:00:00")
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
            expect(wrapper.vm.formatTime("24/2/2023")).toBe("Invalid date")
        });

        it("should display label 'Duration'", () =>{
            expect(wrapper.text()).toContain('Duration');
        });

        it("should call generateTimeList to get the total hours", () => {
            expect(wrapper.vm.generateTimeList("maxDuration")).toBe(undefined)
        });

        it("should on change call getRequestEvent to get Shift Listings", () => {
            const event = {
                detail: {
                    value: 'Education'
                }
            }
            wrapper.setData({
                additionalRequestEvent: false
            })
            
            wrapper.findComponent({
                ref: 'shiftChange'
            }).vm.$emit('v-neu-change', event)
            expect(wrapper.vm.shift).toBe('Education')
        });

        it("should display label 'Comments (Optional)'", () =>{
            expect(wrapper.text()).toContain('Comments (Optional)');
        });
    })
    

    describe("Test the Button component", () => {
        it("Action Button name should be 'Add To Schedule'", () => {
            const actionButton = wrapper.find('.actionButton')
            actionButton.trigger('click')
            expect(wrapper.emitted('fireAction'));
        })
    })

    describe("Testing on FireAction", () => {
        wrapper.vm.profileData = profileMockData;
        it("check prop values in FireAction", async ()=> { 
          wrapper.vm.FireAction();
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.isLoading).toBe(false);
          await wrapper.vm.$nextTick();
          expect(wrapper.vm.isLoading).toBe(false);
        })
    });
});