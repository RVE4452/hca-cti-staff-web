import { createStore } from 'vuex'
import Oidc from './modules/oidc'
import {schedule} from './modules/schedule'
import {notification} from "./modules/notification";
import {profile} from './modules/profile'

export default createStore({
    modules: {
        Oidc,
        schedule,
        profile,
        notification
    }
})

