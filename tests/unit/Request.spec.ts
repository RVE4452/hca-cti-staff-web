import { mount, shallowMount } from '@vue/test-utils';
import Request from '@/components/shared/Request.vue';
import Vuex from 'vuex';
import { requestDetailsMockData, profileData } from '../../src/mocks/requestMockSpecData';

const store = new Vuex.Store({
    modules:{
        "schedule":{
            namespaced: true,
            state:{
                requestDetail: requestDetailsMockData
            },
            actions:{
                getRequestEvent:jest.fn()
            }
        },
        "profile":{
            namespaced: true,
            state:{
                profileData: profileData,
                appInsightEventData: []
            },
            actions: {
                getRequestEvent:jest.fn()
            }
        }
    }
})

let wrapper: any;

describe('computed prop', () => {
    beforeAll(() => {
      jest.setSystemTime(new Date(2020, 3, 1));
    });

    afterAll(() => {
      jest.useRealTimers();
    });
});

wrapper = mount(Request,{
    
});