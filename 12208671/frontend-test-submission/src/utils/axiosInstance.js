import axios from "axios"
import log from '../../../logging-middleware/logger.js';

const axiosInstance = axios.create({
    baseURL:"http://localhost:3000",
    timeout:10000, 
    withCredentials:true
})


axiosInstance.interceptors.response.use(
    (response) => {

        return response;
    },
    (error) => {

        if (error.response) {

            const { status, data } = error.response;
            
            switch (status) {
                case 400:
                    log('frontend', 'error', 'api', `Bad Request: ${JSON.stringify(data)}`);
                    break;
                case 401:
                    log('frontend', 'error', 'api', `Unauthorized: ${JSON.stringify(data)}`);
                    // You could redirect to login page or refresh token here
                    break;
                case 403:
                    log('frontend', 'error', 'api', `Forbidden: ${JSON.stringify(data)}`);
                    break;
                case 404:
                    log('frontend', 'error', 'api', `Not Found: ${JSON.stringify(data)}`);
                    break;
                case 500:
                    log('frontend', 'error', 'api', `Server Error: ${JSON.stringify(data)}`);
                    break;
                default:
                    log('frontend', 'error', 'api', `Error (${status}): ${JSON.stringify(data)}`);
            }
        } else if (error.request) {

            log('frontend', 'error', 'api', `Network Error: No response received`);
        } else {

            log('frontend', 'error', 'api', `Error: ${error.message}`);
        }


        return Promise.reject({

            message: error.response?.data?.message || error.message || "Unknown error occurred",
            status: error.response?.status,
            data: error.response?.data,

        });
    }
);
export default axiosInstance