'use strict';

const axios = require('axios');
const merge = require('webpack-merge');

module.exports = app => {
    const defaultConfig = {
        headers: {
            common: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        },
        timeout: 10000
    };
    const config = Object.assign(defaultConfig, app.config.http);

    axios.defaults = merge(axios.defaults, config);

    app.logger.info(`app http defaults: ${JSON.stringify(axios.defaults)}`);

    axios.interceptors.request.use(function (config) {
        app.coreLogger.info(`[http] send request, baseURL: ${JSON.stringify(config.baseURL)},
                url: ${config.url}, method: ${config.method}, 
                data: ${JSON.stringify(config.data)}, 
                headers: ${JSON.stringify(config.headers)}`);
        return config;
    }, function (error) {
        app.coreLogger.error(`[http] send request error, ${JSON.stringify(error)}`);
        return Promise.reject(error);
    });

    axios.interceptors.response.use(function (response) {
        app.coreLogger.info(`[http] receive response, data: ${JSON.stringify(response.data)}, 
                status: ${response.status}, 
                headers: ${JSON.stringify(response.headers)}`);
        return response.data;
    }, function (error) {
        app.coreLogger.error(`[http] receive response error, ${JSON.stringify(error)}`);
        return Promise.reject(error);
    });

    app.http = axios;
};
