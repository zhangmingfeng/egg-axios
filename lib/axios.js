const axios = require('axios');
const merge = require('webpack-merge');
const qstring = require('querystring');
const urlTools = require('url');

function MyAxios(app) {
    this.app = app;
    this.init();
}

MyAxios.prototype.init = function () {
    const self = this;
    const defaultConfig = {
        headers: {
            common: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        },
        timeout: 10000
    };
    const config = Object.assign(defaultConfig, self.app.config.http);

    axios.defaults = merge(axios.defaults, config);

    self.app.logger.info(`egg-axios defaults: ${JSON.stringify(axios.defaults)}`);

    axios.interceptors.request.use(function (config) {
        self.app.coreLogger.info(`[egg-axios] send request, baseURL: ${JSON.stringify(config.baseURL)}, url: ${config.url}, method: ${config.method}, data: ${JSON.stringify(config.data)}, headers: ${JSON.stringify(config.headers)}`);
        return config;
    }, function (error) {
        self.app.coreLogger.error(`[egg-axios] send request error, ${JSON.stringify(error)}`);
        return Promise.reject(error);
    });

    axios.interceptors.response.use(function (response) {
        self.app.coreLogger.info(`[egg-axios] receive response, data: ${JSON.stringify(response.data)}, status: ${response.status}, headers: ${JSON.stringify(response.headers)}`);
        if (response.config && (response.config.method.toUpperCase() === 'HEAD' || response.config.method.toUpperCase() === 'options')) {
            return response;
        } else {
            return response.data;
        }
    }, function (error) {
        self.app.coreLogger.error(`[egg-axios] receive response error, ${JSON.stringify(error)}`);
        return Promise.reject(error);
    });
};

for (let method of ['delete', 'get', 'head', 'options']) {
    MyAxios.prototype[method] = function (url, data, config) {
        const urlParse = urlTools.parse(url);
        if (urlParse.query) {
            data = Object.assign(qstring.parse(urlParse.query), data);
        }
        const port = urlParse.port ? `:${urlParse.port}` : '';
        if (data && typeof data === 'object') {
            url = `${urlParse.protocol}//${urlParse.host}${port}${urlParse.pathname}?${qstring.stringify(data)}`;
        }
        return axios[method](url, config);
    };
}

for (let method of ['post', 'put', 'patch']) {
    MyAxios.prototype[method] = function (url, data, config) {
        return axios[method](url, data, config);
    };
}

module.exports = MyAxios;