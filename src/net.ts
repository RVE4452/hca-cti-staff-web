import axios, {AxiosRequestConfig} from 'axios'


export default {
    install(Vue: any): void {
        const net = {
            request(config: AxiosRequestConfig) {
                return axios.request(config)
            },
            get(url: string, config: AxiosRequestConfig) {
                const defaultConfig = {
                    headers: {
                        Pragma: 'no-cache', // Needed for IE!!!
                    }
                }
                const newConfig = Object.assign(defaultConfig, config)
                return axios.get(url, newConfig)
            },
            delete(url: string, config: AxiosRequestConfig) {
                return axios.delete(url, config)
            },
            post(url: string, data: any, config: AxiosRequestConfig) {
                return axios.post(url, data, config)
            },
            put(url: string, data: any, config: AxiosRequestConfig) {
                return axios.put(url, data, config)
            }
        }
        Vue.$net = net
        Vue.prototype.$net = net

    }
}
