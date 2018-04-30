'use strict';

const Axios = require('./axios');
module.exports = app => {
    app.http = new Axios(app);
};
