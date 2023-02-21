import { mount } from '@vue/test-utils';
import ShiftMemberDetail from '@/components/shared/ShiftMemberDetail.vue';
import Vuex from "vuex";

 describe('Shift member detail', () => {
    const store = new Vuex.Store({
        modules: {          
          "schedule": {
            namespaced: true,
            state: {
              shiftMembersDetail: []
            },
            actions: {
             getShiftMembersDetail: jest.fn(),
            }
          }
        },
      })
    
    const currentEventData =  {
        departmentId: 15,
        startTime: '2023-02-01T07:00:00',
        endTime: '2023-02-01T19:00:00'
    }
   
    describe('Methods', () => {
        let wrapper:any;
        beforeEach(() => {           
            wrapper = mount(ShiftMemberDetail, {
              store,
              data: () => {
                return { currentEvent: currentEventData}},
                global: {
                    mocks: {
                      $store:store
                    }
                  } 
            });
          });
        
        it('Get shift member details', async() => {
            wrapper.vm.getShiftMembersDetail = jest.fn().mockImplementation(() => Promise.resolve());            
            await wrapper.vm.$nextTick();
            wrapper.vm.getShiftMembersDetail().then(() => {
                expect(wrapper.vm.isLoaded).toBe(true);
            })
            
        });
        it('validate date format', () => {
            expect(wrapper.vm.formatDate('2023-02-10T16:27:35.299Z')).toBe('Fri, Feb 10');
        });
    });
});