// import { shallowMount } from '@vue/test-utils'
// import TradeShift from './TradeShift.vue';
// import { createLocalVue } from '@vue/test-utils'
// import Vuex, { Store } from "vuex";


// const defaultMockActions = {
//   'schedule/getShiftTradeOffer': jest.fn(),
//   'schedule/getAssignmentDetail': jest.fn(),
//   'schedule/getPotetialTradeAssignment': jest.fn(),
//   'schedule/withdrawPotentialTrade': jest.fn()
// }

// const mockAssignmentDetail = {
//     actualStartTime: '2021-07-20T16:27:35.299Z',
//     actualEndTime: '2021-07-20T16:27:35.299Z',
//     shiftMembers: []
// };

// const mockMethod = jest.fn()

// const mockShiftTradeOfferDetail = {
//     data: 'test'
// }


// const mockMember = [{firstName: 'First Name', lastName: 'Last Name', assignmentStart: new Date(), assignmentEnd: new Date(), skill: 'Skill', departmentName: 'Dept Name', isAutoapprovable: true },
// {firstName: 'First Name2', lastName: 'Last Name2', assignmentStart: new Date(), assignmentEnd: new Date(), skill: 'Skill', departmentName: 'Dept Name', isAutoapprovable: true }];

// const defaultMockState = {
//     assignmentDetail: mockAssignmentDetail,
//     shiftTradeOfferDetail:mockShiftTradeOfferDetail,
//     potentialTradeAssignment: mockMember
// }

// const defaultData = {
//     searchNameDate: "",
//     shiftMembers: [],
//     potentialMembers: mockMember,
//     filteredPotentialMembers: mockMember,
//     stage: "todo",
//     checkedPotential: [],
//     activePageNumber: 1,
//     potentialMemberLoading: false,
//     assignmentLoaded: false,
//     shiftDetailLoaded: false
// };

// const defaultPops =  {
//     id: '876545678',
//     date: '2021-07-20T16:27:35.299Z'
// }

// const localVue = createLocalVue()
// localVue.use(Vuex);
// const actions = {
//     someAction: jest.fn()
// };


// // const factory = async ( mockState = defaultMockState, mockData = defaultData) => {
// //     const wrapper = shallowMount(TradeShift, {
// //         localVue,
// //         store: new Vuex.Store({
// //             modules: {
// //                schedule: {
// //                 namespaced: true,
// //                 state: () => (mockState)
// //                }
// //             },
// //           actions: {...defaultMockActions, ...actions}
// //         }),
// //         propsData: { currentEvent: defaultPops },
// //         data() {
// //             return mockData;
// //         }
// //     });
// //     await wrapper.setData({ assignmentLoaded: true, shiftDetailLoaded: true })
// //     return wrapper;
// // };

// describe('TradeShift.vue', () => {

//   describe('Template', () => {
//     let wrapper;

//     beforeEach(() => {
//       const copyState = JSON.parse(JSON.stringify(defaultMockState));
//       delete copyState.potentialTradeAssignment;
//       delete copyState.shiftTradeOfferDetail;
//       wrapper = shallowMount(TradeShift, {
//         localVue,
//         store: new Vuex.Store({
//             modules: {
//                schedule: {
//                 namespaced: true,
//                 state: () => (copyState)
//                }
//             },
//           actions: {...defaultMockActions, ...actions}
//         }),
//         propsData: { currentEvent: defaultPops },
//         data() {
//             return defaultData;
//         }
//       });
//     });
//     it('should display drop and swap', async() => {
//       expect(wrapper.text().includes('DROP')).toBe(true);
//       expect(wrapper.text().includes('SWAP')).toBe(true);
//     });

//     it('should display swap as not completed progress',async () => {
//       const swapContainer = wrapper.find('[data-test="swap-container"]');
//       expect(swapContainer.classes().includes('todo')).toBeTruthy();
//     });

//     it('should display Date cotainer in 1st Screen', async() => {
//       expect(wrapper.find('[data-test="date-time"]').exists()).toBe(true);
//     });

//     it('should not display Potential Trades as text and Search Input in 1st Screen',async () => {
//       expect(wrapper.find('[data-test="potential-trades"]').exists()).toBe(false);
//       expect(wrapper.find('[data-test="search-input"]').exists()).toBe(false);
//     })

//     it('should show swap request button for 1st screen', async () => {
//       const fireActionBtn = wrapper.find('[data-test="fire-action"]');
//       expect(fireActionBtn.text()).toBe('Swap Shift');
//     });

//     it('should show spinner when click send swap request', async () => {
//       const fireActionBtn = wrapper.find('[data-test="fire-action"]');
//       await fireActionBtn.trigger('click', {
//           ctrlKey: true
//       })
//       expect(wrapper.find('.neu-feedback--spinner').selector).toBe('.neu-feedback--spinner')
//     });

//     it('should display swap container as completed status for 2nd sreen', async () => {
//       const swapContainer = wrapper.find('[data-test="swap-container"]');
//       expect(swapContainer.classes().includes('completed')).toBeTruthy();
//     });

//     it('should not display Potential Trades as text and Search Input in 1st Screen',async () => {
//       expect(wrapper.find('[data-test="potential-trades"]').exists()).toBe(true);
//       expect(wrapper.find('[data-test="search-input"]').exists()).toBe(true);
//     });

//     it('should show Send Swap Request button for 2nd screen',async () => {
//       const fireActionBtn = wrapper.find('[data-test="fire-action"]');
//       expect(fireActionBtn.text()).toBe('Send Swap Request');
//     });
//   });

//   describe('getPotetialTradeAssignment', () => {
//     let wrapper;

//     beforeEach(() => {
//       const copyState = JSON.parse(JSON.stringify(defaultMockState));
//       delete copyState.shiftTradeOfferDetail;
//       wrapper = shallowMount(TradeShift, {
//         localVue,
//         store: new Vuex.Store({
//             modules: {
//                schedule: {
//                 namespaced: true,
//                 state: () => (copyState)
//                }
//             },
//           actions: {...defaultMockActions, ...actions}
//         }),
//         propsData: { currentEvent: defaultPops },
//         data() {
//             return defaultData;
//         }
//       });
//     });

//     it('should show display potential shift members for 2nd screen', async () => {
//       wrapper.vm.getPotetialTradeAssignment();
//       await wrapper.setData({ filteredPotentialMembers: mockMember })
//       expect(wrapper.vm.filteredPotentialMembers).toBe(mockMember)
//       await wrapper.vm.$nextTick()
//       const potentialMemberContainer = wrapper.findAll('[data-test="potential-members"]');
//       expect(potentialMemberContainer.exists()).toBeTruthy();
//     });
//   });

//   describe('getPotetialTradeAssignment', () => {
//     let wrapper;

//     beforeEach(() => {
//       const copyState = JSON.parse(JSON.stringify(defaultMockState));
//       wrapper = shallowMount(TradeShift, {
//         localVue,
//         store: new Vuex.Store({
//             modules: {
//                schedule: {
//                 namespaced: true,
//                 state: () => (copyState)
//                }
//             },
//           actions: {...defaultMockActions, ...actions}
//         }),
//         methods: {
//           withdrawPotentialTrade: mockMethod
//         },
//         propsData: { currentEvent: defaultPops },
//         data() {
//             return defaultData;
//         }
//       });
//     });

//     it('should display withdraw button on 3rd ', async() => {
//         const fireActionBtn = wrapper.find('[data-test="fire-action"]');
//         await wrapper.setData({ stage: 'withdraw' });
//         await wrapper.vm.$nextTick()
//         expect(fireActionBtn.text()).toBe('Withdraw Swap Request');
//     });

//     it('should call withdrawpotential on withdraw click ', async() => {
//         wrapper.vm.withdrawPotentialTrade = jest.fn();
//         const fireActionBtn = wrapper.find('[data-test="fire-action"]');
//         await wrapper.setData({ stage: 'withdraw' });
//         await fireActionBtn.trigger('click', {
//             ctrlKey: true
//         });
//         expect(wrapper.vm.withdrawPotentialTrade.mock.calls.length).toBe(1)
//     });

//     it('should not call api endpoint if processmode is true on withdraw click ', async() => {
//         wrapper.vm.withdrawPotentialTrade = jest.fn();
//         const fireActionBtn = wrapper.find('[data-test="fire-action"]');
//         await wrapper.setData({ stage: 'completed', processMode: true, checkedPotential: [] });
//         await fireActionBtn.trigger('click', {
//             ctrlKey: true
//         });
//         expect(wrapper.vm.withdrawPotentialTrade.mock.calls.length).toBe(1)
//     });

//     it('should handle potential shift member checkbox', async() => {
//         wrapper.vm.withdrawPotentialTrade = jest.fn();
//         const fireActionBtn = wrapper.find('[data-test="fire-action"]');
//         await wrapper.setData({ stage: 'completed', processMode: true, checkedPotential: [] });
//         await fireActionBtn.trigger('click', {
//             ctrlKey: true
//         });
//         expect(wrapper.vm.withdrawPotentialTrade.mock.calls.length).toBe(1)
//     });
//   });
// })
