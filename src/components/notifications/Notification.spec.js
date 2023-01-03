import { shallowMount } from '@vue/test-utils'
import Notification from './Notifications.vue';
import { createLocalVue } from '@vue/test-utils'
import Vuex, { Store } from "vuex";
import Vue from 'vue';


const mockNotifications = [{"id":"22bdfc6f-cd15-4258-849a-b003dbdcd75c","username":"QSE5629","tenantId":"1B279960-8327-42F3-86E2-9ABEDFA5E957","staffId":694361,"message":"Shift Modified","body":"You shift on 08/25/2021 has changed.","read":true,"urgent":false,"timestamp":"2021-08-09T19:19:38.926428+00:00","actionableBy":"2021-08-16T19:19:38.9264293Z"}, {"id":"22bdfc6f-cd15-4258-849a-a003dbdcd75c","username":"QSE5629","tenantId":"1B279960-8327-42F3-86E2-9ABEDFA5E957","staffId":694361,"message":"Shift Modified","body":"You shift on 08/25/2021 has changed.","read":true,"urgent":false,"timestamp":"2021-08-09T19:19:38.926428+00:00","actionableBy":"2021-08-16T19:19:38.9264293Z"}];
const defaultMockState = {
    notificationList: mockNotifications
}

const defaultMockActions = {
    'notification/statusUpdate': jest.fn(),
    'notification/getAllNotifications': jest.fn()
}

const actions = {
    someAction: jest.fn()
};

const GlobalPlugins = {
    install(v) {
      v.prototype.$eventBus = new Vue();
    },
  };

const localVue = createLocalVue()
localVue.use(Vuex);
localVue.use(GlobalPlugins);

const mocks = {
    bus: {
      $on: jest.fn(),
      $off: jest.fn(),
      $emit: jest.fn(),
    },
  };

describe('Notification', () => {
    describe('Template', () => {
        const wrapper = shallowMount(Notification, {
            localVue,
            store: new Vuex.Store({
                modules: {
                   notification: {
                    namespaced: true,
                    state: () => (defaultMockState)
                   }
                },
              actions: {...defaultMockActions, ...actions}
            }),
            propsData: { toggleStatus: false },
            data() {
                return {
                    hideRuleContent: []
                };
            }
        });
        it('should display Alert title', async() => {
            expect(wrapper.text().includes('Alert')).toBe(true);
        });
        it('should display Inbox title', async() => {
            expect(wrapper.text().includes('Inbox')).toBe(true);
        });
        it('should display close', async() => {
            expect(wrapper.text().includes('close')).toBe(true);
        });
        it('should render notification list', async() => {
            expect(wrapper.findAll('.notification-list').length).toBe(2)
        });
    });  
    describe('Methods', () => {
        const wrapper = shallowMount(Notification, {
            localVue,
            mocks,
            store: new Vuex.Store({
                modules: {
                   notification: {
                    namespaced: true,
                    state: () => (defaultMockState)
                   }
                },
              actions: {...defaultMockActions}
            }),
            propsData: { toggleStatus: false },
            data() {
                return {
                    hideRuleContent: []
                };
            }
        }); 
        
        it('calls method notificationchanged on event notificationchanged', () => {
            const changeNameSpy = jest.fn();
            const wrapper = shallowMount(Notification, {
                localVue,
                mocks,
                store: new Vuex.Store({
                    modules: {
                       notification: {
                        namespaced: true,
                        state: () => (defaultMockState)
                       }
                    },
                  actions: {...defaultMockActions}
                }),
                propsData: { toggleStatus: false },
                data() {
                    return {
                        hideRuleContent: []
                    };
                },
                methods: {
                    getAllNotification: changeNameSpy,
                  }
            });
        
            wrapper.vm.bus.$emit('notificationchanged');
        
            expect(changeNameSpy).toHaveBeenCalled();
            expect(changeNameSpy).toHaveBeenCalledWith();
        });

        it('close notification sidebar' , async () => {
            wrapper.vm.closeNav = jest.fn();
            wrapper.vm.updateNotificationCount = jest.fn();
            const fireActionBtn = wrapper.find('.notification-close');
            await fireActionBtn.trigger('click', {
                ctrlKey: true
            });
            expect(wrapper.vm.closeNav.mock.calls.length).toBe(1)
            expect(wrapper.vm.hideArray).toBe('');
            // expect(wrapper.vm.updateNotificationCount.mock.calls.length).toBe(1);
        });
    });    
});