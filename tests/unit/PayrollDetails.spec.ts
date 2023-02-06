import { userSchedules } from './../../src/mocks/mockSpecData';
import { mount, shallowMount } from '@vue/test-utils'
import PayrollDetails from '@/components/profile/PayrollDetails.vue';
import Vuex from "vuex";
import { payRollMockData, profileData } from '../../src/mocks/payRollMockData';

const store = new Vuex.Store({

    modules: {
        "schedule": {
            namespaced: true,
            state: {
                payrollDetails: payRollMockData
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
    }
})

let wrapper: any;

describe("computed prop",() => {
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
            payrollDetails: payRollMockData,
            profileData: profileData
        },
        global: {
            mocks: {
              $store:store,
            },
        }
    });
    // Wrapper Ends

    describe("Testing on methods", () => {
        it("should call formatDate to get the format date", () => {
            expect(wrapper.vm.formatDate("1/2/2023")).toBe("Monday, January 02 2023")
        });

        it("should call formatTime to get the format time", () => {
            expect(wrapper.vm.formatTime("10/4/2023")).toBe("12:00 AM")
        });

        it("should call totalHours to get the total hours 0:00", () => {
            expect(wrapper.vm.totalHours(null, null)).toBe("0.00")
        });

        it("should call totalHours to get the total hours", () => {
            expect(wrapper.vm.totalHours("02/06/2023", "02/07/2023")).toBe("24.00")
        });

        // it("should call getPayrollDetails to update the getPayrollDetails", () => {
        //     wrapper.vm.getPayrollDetails();
        //     const spy = jest.spyOn(wrapper.vm, "validateDates")
        //     expect(wrapper.vm.validateDates()).toBe(true)
        // });
    });
});
// END Global Describe