// import { shallowMount } from '@vue/test-utils'
// import Request from './Request.vue';
// import { createLocalVue } from '@vue/test-utils'
// import Vuex, { Store } from "vuex";
// import * as profileData from '../../mocks/profiledata.json';

// const defaultMockState = {
//     profileData: profileData
// }

// const defaultData = {
//     selectedDate: [],
//     entireShiftChecked: true,
//     startTime: "",
//     duration: "",
//     shift: "",
//     minutes: "",
//     hours: 0,
//     startDateTime: "",
//     startTimeList: [],
//     durationList: [],
// }

// const defaultMockActions = {
//     'schedule/RequestSchedule': jest.fn(),
//     'schedule/WithdrawEvent': jest.fn(),
// }

// const currentEvent =  {
//     id: '876545678',
//     date: '2021-07-20T16:27:35.299Z',
//     type: false
// }
// const calSelectedDates = {
//     endDate: '2021-08-040T16:27:35.299Z',
//     startDate: '2021-08-020T16:27:35.299Z'
// }

// const actions = {
//     someAction: jest.fn()
// };

// const localVue = createLocalVue()
// localVue.use(Vuex);

// const factory = ( mockState = defaultMockState, mockData = defaultData) => {
//     return shallowMount(Request, {
//         localVue,
//         store: new Vuex.Store({
//             modules: {
//                profile: {
//                 namespaced: true,
//                 state: () => (mockState)
//                }
//             },
//           actions: {...defaultMockActions, ...actions}
//         }),
//         propsData: { currentEvent, calSelectedDates },
//         data() {
//             return mockData;
//         }
//     });
// };

// describe('Request.vue', () => {

//     it('should match snapshot', () => {
//       const wrapper = factory();
//       expect(wrapper.element).toMatchSnapshot()
//     });

//     it('should display Add to Schedule button when type is false ', async() => {
//         const wrapper = factory();
//         const fireActionBtn = wrapper.find('[data-test="fire-action"]');
//         expect(fireActionBtn.text()).toBe('Add to Schedule');
//     });

//     it('should fire shiftChange on shift member change', async() => {
//         const wrapper = factory();
//         await wrapper.setData({ shift: '31965' });
//         wrapper.findAll('select#shift-change > option').at(1).element.selected = true;
//         wrapper.find('select#shift-change').trigger('change');
//         expect(wrapper.vm.data.shift).not.toBe('');
//     });

//     describe('methods', () => {
//         const wrapper = factory();
//         it('shiftChange', () => {
//             console.log(wrapper.vm.startDateTime, 'startDateTime');
//             wrapper.vm.shiftChange();
//             console.log(wrapper.vm.startDateTime, 'startDateTime');
//         })
//     });


// });