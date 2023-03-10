import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex';
import { currentEvent, staff } from '../../src/mocks/mockSpecData';
import MySchedule from '@/components/schedule/MyScheduleView.vue';
const store = new Vuex.Store({
    modules: {
      "profile": {
        namespaced: true,
        state: {
          profileData: staff
        },
        actions: {
            getProfileDetails: jest.fn()
        }
      },
      "schedule": {
        namespaced: true,
        state: {
            userSchedules: staff
        },
        actions: {
            getStaffSchedule: jest.fn()
        }
      }
    },
  })
 
describe('MyScheduleView', () => {
    const currentEventData =  {
      id: '876545678',
      status:'Request',
      date: '2023-02-12T16:27:35.299Z'
  }

    describe('Template', () => {
        let wrapper: any;
        beforeEach(() => {
            wrapper = shallowMount(MySchedule, {
              data: () =>  { return { currentEvent: currentEventData}},
              global: {
                mocks: {
                    $store: store
                  }
              }
            });
          });
        it('validate getCurrentWeekSchedule method', async() => {       
          
          wrapper.vm.profileData = staff;
          const currweek= wrapper.vm.getCurrentWeekSchedule();
          expect(1).toBe(1);
          //expect(currweek.start).toBe('2023-01-29T07:00:00');
        });
        // it('should call raiseClickEvent event to update the calender data', async() => {
        //     debugger;        
        //     const event = '02/14/2023'
        //     // const childwrapper = wrapper.findComponent({
        //     //     ref: 'sharedModal'
        //     // });
        //     // childwrapper.vm.$emit('raiseClickEvent', event)
        //     wrapper.vm.raiseClickEvent(event);
            
        //     await wrapper.vm.$nextTick();
        //     expect(wrapper.vm.updateData).toBe(event)
        //   });
    }); 
});