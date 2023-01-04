import { createStore } from 'vuex'
// import Oidc from './modules/oidc'
import {schedule} from './modules/schedule'
import {notification} from "./modules/notification";
import {profile} from './modules/profile'
import { oidcSettings } from '../config/oidcSettings'
import { oidcOptionalSettings } from '../config/oidcOptionalSettings'
import { oidcEventListeners } from '../config/oidcEventListeners'
import { vuexOidcCreateStoreModule } from 'vuex-oidc'

export default createStore({
    modules: {
        oidcStore: vuexOidcCreateStoreModule(
            oidcSettings,
            oidcOptionalSettings,
            oidcEventListeners
          ),
        schedule,
        profile,
        notification
    }
})

