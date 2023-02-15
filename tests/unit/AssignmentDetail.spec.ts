import { mount, shallowMount } from '@vue/test-utils';
import Detail from '@/components/shared/AssignmentDetail.vue';
import Vuex from "vuex";

 describe('Assignment detail page test', () => {
    const mockAssignmentDetail = {
        facilityName: 'TEST',
        departmentCode: '2023-02-10T16:27:35.299Z',
        departmentName: 'test dept',
        shiftMembers: []
    };
    const mockState = {
        currentEvent: mockAssignmentDetail
    }
    const mockAction = {
        'schedule/getAssignmentDetail': jest.fn(),
    }
    
    const currentEventData =  {
        id: '876545678',
        date: '2023-02-10T16:27:35.299Z'
    }
   

    describe('Template - Test all UI control in template', () => {
        let wrapper:any;
        beforeEach(() => {
            const copyState = JSON.parse(JSON.stringify(mockState));
            wrapper = shallowMount(Detail, {               
                data: () => {
                    return { currentEvent: currentEventData, enableField: [] }}
              });
          });
   it('should render 4 field', () => {
            expect(wrapper.findAll('neu-input').length).toBe(4)
        })
        it('should render Facility field', () => {
            expect(wrapper.text().includes('Facility')).toBe(true);
        })
        it('should render Department field', () => {
            expect(wrapper.text().includes('Department')).toBe(true);
        })
        it('should render Skill field', () => {
            expect(wrapper.text().includes('Skill')).toBe(true);
        })
        it('should render Shift field', () => {
            expect(wrapper.text().includes('Shift')).toBe(true);
        })
    });

    describe('Methods', () => {
        let wrapper:any;
        beforeEach(() => {
            const copyState = JSON.parse(JSON.stringify(mockState));
            wrapper = mount(Detail, {
              store: new Vuex.Store({
                  modules: {
                     schedule: {
                      namespaced: true,
                      state: () => (copyState)
                     }
                  },
                actions: {...mockAction}
              }),
              data: () => {
                return { currentEvent: currentEventData, enableField: [] }}
            });
          });
        
        it('Get shift member details', () => {
            wrapper.vm.getEventDetail = jest.fn().mockImplementation(() => Promise.resolve());
            wrapper.vm.getEventDetail().then(() => {
                expect(wrapper.vm.isLoaded).toBe(true);
            })
            
        });
        it('validate date format', () => {
            expect(wrapper.vm.formatDate('2023-02-10T16:27:35.299Z')).toBe('Friday, Feb 10 2023');
        });
    });
});