// import { shallowMount } from '@vue/test-utils'
// import Detail from './Detail.vue';
// import { createLocalVue } from '@vue/test-utils'
// import Vuex from "vuex";

// describe('Describe', () => {
//     const mockAssignmentDetail = {
//         actualStartTime: '2021-07-20T16:27:35.299Z',
//         actualEndTime: '2021-07-20T16:27:35.299Z',
//         shiftMembers: []
//     };
//     const mockState = {
//         assignmentDetail: mockAssignmentDetail
//     }
//     const mockAction = {
//         'schedule/getAssignmentDetail': jest.fn(),
//     }
    
//     const defaultPops =  {
//         id: '876545678',
//         date: '2021-07-20T16:27:35.299Z'
//     }
//     const localVue = createLocalVue()
//     localVue.use(Vuex);

//     describe('Template', () => {
//         let wrapper;
//         beforeEach(() => {
//             const copyState = JSON.parse(JSON.stringify(mockState));
//             wrapper = shallowMount(Detail, {
//               localVue,
//               store: new Vuex.Store({
//                   modules: {
//                      schedule: {
//                       namespaced: true,
//                       state: () => (copyState)
//                      }
//                   },
//                 actions: {...mockAction}
//               }),
//               propsData: { currentEvent: defaultPops, enableField: [] }
//             });
//           });
//         it('should render 4 field', () => {
//             expect(wrapper.findAll('.neu-input').length).toBe(4)
//         })
//         it('should render Facility field', () => {
//             expect(wrapper.text().includes('Facility')).toBe(true);
//         })
//         it('should render Department field', () => {
//             expect(wrapper.text().includes('Department')).toBe(true);
//         })
//         it('should render Skill field', () => {
//             expect(wrapper.text().includes('Skill')).toBe(true);
//         })
//         it('should render Shift field', () => {
//             expect(wrapper.text().includes('Shift')).toBe(true);
//         })
//     });

//     describe('Methods', () => {
//         let wrapper;
//         beforeEach(() => {
//             const copyState = JSON.parse(JSON.stringify(mockState));
//             wrapper = shallowMount(Detail, {
//               localVue,
//               store: new Vuex.Store({
//                   modules: {
//                      schedule: {
//                       namespaced: true,
//                       state: () => (copyState)
//                      }
//                   },
//                 actions: {...mockAction}
//               }),
//               propsData: { currentEvent: defaultPops, enableField: [] }
//             });
//           });
        
//         it('getEventDetail', () => {
//             wrapper.vm.getEventDetail = jest.fn().mockImplementation(() => Promise.resolve());
//             wrapper.vm.getEventDetail().then(() => {
//                 expect(wrapper.vm.isLoaded).toBe(true);
//             })
            
//         });
//         it('formatDate', () => {
//             expect(wrapper.vm.formatDate('2021-07-20T16:27:35.299Z')).toBe('Tuesday, Jul 20 2021');
//         });
//     });
// });