import { currentEvent } from './../../src/mocks/mockSpecData';
import { mount } from '@vue/test-utils'
import SharedModal from '@/components/shared/SharedModal.vue';

describe('Shared Modal', () => {
    const defaultSharedRequest = {
      type: 2,
      assignmentDetail: true,
      calSelectedDates: []
    };
    const currentEventData =  {
      id: '876545678',
      status:'Request',
      date: '2023-02-10T16:27:35.299Z'
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
    }); 
});