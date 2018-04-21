'use strict';

const axios = require('axios');

module.exports = app => {
    const defaultConfig = {
        headers: {
            common: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        },
        timeout: 10000
    };
    axios.defaults = Object.assign(defaultConfig, app.config.http);

    axios.interceptors.response.use(function (response) {
        return response.data;
    }, function (error) {
        return Promise.reject(error);
    });

    app.http = axios;
};
