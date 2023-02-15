import { currentEvent } from './../../src/mocks/mockSpecData';
import { mount } from '@vue/test-utils'
import SharedModal from '@/components/shared/SharedModal.vue';

describe('Shared Modal', () => {
    const defaultSharedRequest = {
      type: 2,
      assignmentDetail: true,
      calSelectedDates: {startDate:'2/12/2023',endDate:'02/13/2023'}
    };
    const currentEventData =  {
      id: '876545678',
      status:'Request',
      date: '2023-02-12T16:27:35.299Z'
  }

    describe('Template', () => {
        let wrapper: any;
        beforeEach(() => {
            wrapper = mount(SharedModal, {
              data: () =>  { return {sharedRequest: defaultSharedRequest , currentEvent: currentEventData}}
            });
          });
        it('should render shared modal with header title Details', () => {
          console.log(wrapper);
          expect(wrapper.text().includes('Details')).toBe(true);
        });
        it('should render shared modal with btn-0close', () => {
          const swapContainer = wrapper.find('[data-test="modal-close"]');
          expect(swapContainer.classes().includes('btn-close')).toBeTruthy();
        });
        it('should render shared modal with Scheduled Event', () => {
          expect(wrapper.text().includes('Scheduled Event')).toBe(true);
        });
        it('should close modal when click close button', async () => {
          const fireActionBtn = wrapper.find('[data-test="modal-close"]');
          await fireActionBtn.trigger('click', {
              ctrlKey: true
          })
          wrapper.vm.$nextTick(() => {
            expect(wrapper.emitted()['close-modal'][0]).toEqual([])
          })
        });
        it('Validate date navigation method', () => {
          expect(wrapper.vm.showDateNavigation()).toBe(true);
        });
        it('Validate prev day navigation method', async() => {
          debugger
          await wrapper.vm.previousDay();
          expect(wrapper.text().includes('February 13, 2023'));
        });
        it('Validate next day navigation method', async() => {
          debugger
          wrapper.vm.nextDay();
          await wrapper.vm.$nextTick()
          expect(wrapper.emitted('raiseClickEvent')).toBeTruthy();
          //expect(wrapper.text().includes('Hello'));
        });
    }); 
});