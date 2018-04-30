const axios = require('axios');
const merge = require('webpack-merge');
const qstring = require('query-string');

function MyAxios(app) {
    this.app = app;
    this.init();
}

MyAxios.prototype.init = function () {
    const defaultConfig = {
        headers: {
            common: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        },
        timeout: 10000
    };
    const config = Object.assign(defaultConfig, this.app.config.http);

    axios.defaults = merge(axios.defaults, config);

    this.app.logger.info(`egg-axios defaults: ${JSON.stringify(axios.defaults)}`);

    axios.interceptors.request.use(function (config) {
        this.app.coreLogger.info(`[egg-axios] send request, baseURL: ${JSON.stringify(config.baseURL)}, url: ${config.url}, method: ${config.method}, data: ${JSON.stringify(config.data)}, headers: ${JSON.stringify(config.headers)}`);
        return config;
    }, function (error) {
        this.app.coreLogger.error(`[egg-axios] send request error, ${JSON.stringify(error)}`);
        return Promise.reject(error);
    });

    axios.interceptors.response.use(function (response) {
        this.app.coreLogger.info(`[egg-axios] receive response, data: ${JSON.stringify(response.data)}, status: ${response.status}, headers: ${JSON.stringify(response.headers)}`);
        return response.data;
    }, function (error) {
        this.app.coreLogger.error(`[egg-axios] receive response error, ${JSON.stringify(error)}`);
        return Promise.reject(error);
    });
};

for (let method of ['delete', 'get', 'head', 'options']) {
    MyAxios.prototype[method] = function (url, data, config) {
        if (data && typeof data === 'object') {
            url = `${url}?${qstring.stringify(data)}`;
        }
        return axios[method](url, config);
    };
}

module.exports = MyAxios;