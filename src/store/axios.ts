import axios from "axios";

const http = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
});

http.interceptors.request.use((config) => {
    if(config.method == "get" || config.method == "delete"){
        config.params = config.params || {};
        config.params['tenantId'] = sessionStorage.getItem("tenant");
    }
    else{
        if(config.data != undefined){
            config.data = Object.assign(config.data, {
                TenantId: sessionStorage.getItem("tenant")
            });
        }
        else{
            config.data = {
                TenantId: sessionStorage.getItem("tenant")
            };
        }
    }
    return config;
});

export default http

