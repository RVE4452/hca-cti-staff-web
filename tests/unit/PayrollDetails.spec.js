import { mount, shallowMount } from '@vue/test-utils'
import PayrollDetails from '@/components/profile/PayrollDetails.vue';
import Vuex from "vuex";
import { payRollMockData, profileData } from '../../src/mocks/payRollMockData';

const store = new Vuex.Store({
    "schedule": {
        namespaced: true,
        state: {
          payRollMockData: payRollMockData
        }
    },
    "profile": {
        namespaced: true,
        state: {
          profileData: profileData,
          appInsightEventData: []
        },
        actions: {
            getPayrollDetails: jest.fn()
        }
      }
})

let wrapper: any;

describe('computed prop', => {
    beforeAll(() => {
        jest.useFakeTimers('modern');
        jest.setSystemTime(new Date(2020, 3, 1));
    });
    afterAll(() => {
        jest.useRealTimers();
    });

    wrapper = mount(PayrollDetails, {
        store,
        data: () => {
            return {
                appInsightEventData: {},
                userSchedules: [],
                payrollDetails: [],
                profileData: []
            }
        },
        props: {
            appInsightEventData: {},
            userSchedules: userSchedules,
            payrollDetails: payrollDetails,
            profileData: profileData
        },
        global: {
            mocks: {
              $store:store,
            },
        }
    }
    // Wrapper Ends

    describe("Testing on methods",() => {
        it("should call formatDate to get the format date", () => {
            expect(wrapper.vm.formatDate("1/2/2023")).toBe("01/02/2023")
        });

        it("should call formatTime to get the format time", () => {
            expect(wrapper.vm.formatTime("10/4/2023")).toBe("10/09/2023")
        });

        // it("should call totalHours to get the totaL hours", () => {
        //     expect(wrapper.vm.totalHours("10/4/2023")).toBe("10/09/2023")
        // });

        it("should call getPayrollDetails to update the getPayrollDetails", () => {
            wrapper.vm.getPayrollDetails();
            expect(wrapper.vm.getPayrollDetails).toBe("2020-4-1 0:0:0")
        });
    })
})
// END Global Describe