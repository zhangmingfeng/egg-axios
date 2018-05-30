# egg-axios
[axios](https://github.com/axios/axios) plugin for Egg.js.

> NOTE: This plugin just for integrate axios into Egg.js, more documentation please visit https://github.com/axios/axios.

# Install

```bash
$ npm i --save egg-axios
```

## Usage & configuration

- `config.default.js`

```js
exports.http = {
  headers: {
     common: {
        'Content-Type': 'application/json; charset=UTF-8'
       }
  },
 timeout: 10000
};
```

- `config/plugin.js`

``` js
exports.http = {
  enable: true,
  package: 'egg-axios'
}
```

### example

```js
// controller.js or service.js
// with promise
this.ctx.http.get('/user', {id: 123}).then((data)=>{
    // data is only remote server response data
    console.log(data);
}).catch((err)=>{
    console.error(err);
});
```
```js
this.ctx.http.post('/post', {postId: 123}).then((data)=>{
    // data is only remote server response data
    console.log(data);
}).catch((err)=>{
    console.error(err);
});
```
```js
// with await/async
try {
    const data = await this.ctx.http.get('/user', {id: 123});
    console.log(data);
} catch (e) {
    console.error(e)
}
```
```js
try {
    const data = await this.ctx.http.post('/post', {postId: 123});
    console.log(data);
} catch (e) {
    console.error(e)
}
```
more example please visit https://github.com/axios/axios.
