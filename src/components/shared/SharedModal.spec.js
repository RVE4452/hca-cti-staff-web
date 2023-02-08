// import { shallowMount } from '@vue/test-utils'
// import SharedModal from './SharedModal.vue';
// import { createLocalVue } from '@vue/test-utils'
// import Vuex from "vuex";

// describe('Describe', () => {
//     const localVue = createLocalVue()
//     localVue.use(Vuex);

//     const defaultSharedRequest = {
//       type: 1,
//       calSelectedDates: [],
//       selfSchedule: true
//     };

//     describe('Template', () => {
//         let wrapper;
//         beforeEach(() => {
//             wrapper = shallowMount(SharedModal, {
//               localVue,
//               propsData: { sharedRequest: defaultSharedRequest },
//             });
//           });
//         it('should render shared modal with header title New Request', () => {
//           expect(wrapper.text().includes('New Request')).toBe(true);
//         });
//         it('should render shared modal with btn-close', () => {
//           const swapContainer = wrapper.find('[data-test="modal-close"]');
//           expect(swapContainer.classes().includes('btn-close')).toBeTruthy();
//         });
//         it('should render shared modal with Self Schedule', () => {
//           expect(wrapper.text().includes('Self Schedule')).toBe(true);
//         });
//         it('should close modal when click close button', async () => {
//           const fireActionBtn = wrapper.find('[data-test="modal-close"]');
//           await fireActionBtn.trigger('click', {
//               ctrlKey: true
//           })
//           wrapper.vm.$nextTick(() => {
//             expect(wrapper.emitted()['close-modal'][0]).toEqual([])
//           })
//         });
//     }); 
// });