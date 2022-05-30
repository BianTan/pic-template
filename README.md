# PicTemplate

[![npm](https://img.shields.io/npm/v/pic-template.svg?style=flat-square)](https://www.npmjs.com/package/pic-template)
[![npm](https://img.shields.io/npm/dt/pic-template.svg?style=flat-square)](https://www.npmjs.com/package/pic-template)

A Vue Component for html2canvas  

<div align="center">
  <div style="background-color: #78b03f; display: flex; align-items: center; justify-content: center;">
    <img width="56" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNTZweCIgaGVpZ2h0PSI1NnB4IiB2aWV3Qm94PSIwIDAgNTYgNTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iUHJvcG9zYWwtLS1TdWtodW12aXQtU2V0IiBmaWxsPSIjRkZGRkZGIj4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCAzLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik00LDEyIEw0LDQ2IEwzNy4wMjMyNTU4LDQ2IEwzNy4wMjMyNTU4LDEyIEw0LDEyIFogTTIsOCBMMzkuMDIzMjU1OCw4IEM0MC4xMjc4MjUzLDggNDEuMDIzMjU1OCw4Ljg5NTQzMDUgNDEuMDIzMjU1OCwxMCBMNDEuMDIzMjU1OCw0OCBDNDEuMDIzMjU1OCw0OS4xMDQ1Njk1IDQwLjEyNzgyNTMsNTAgMzkuMDIzMjU1OCw1MCBMMiw1MCBDMC44OTU0MzA1LDUwIDEuMzUyNzA3NWUtMTYsNDkuMTA0NTY5NSAtMS4yMzI1OTUxNmUtMzEsNDggTC0yLjIyMDQ0NjA1ZS0xNiwxMCBDLTMuNTczMTUzNTVlLTE2LDguODk1NDMwNSAwLjg5NTQzMDUsOCAyLDggWiIgaWQ9IlJlY3RhbmdsZSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMiw0IEwxMiwzOCBMNDYsMzggTDQ2LDQgTDEyLDQgWiBNMTAsMCBMNDgsMCBDNDkuMTA0NTY5NSwtMi4wMjkwNjEyNWUtMTYgNTAsMC44OTU0MzA1IDUwLDIgTDUwLDQwIEM1MCw0MS4xMDQ1Njk1IDQ5LjEwNDU2OTUsNDIgNDgsNDIgTDEwLDQyIEM4Ljg5NTQzMDUsNDIgOCw0MS4xMDQ1Njk1IDgsNDAgTDgsMiBDOCwwLjg5NTQzMDUgOC44OTU0MzA1LDIuMDI5MDYxMjVlLTE2IDEwLDAgWiIgaWQ9IlJlY3RhbmdsZS1Db3B5Ij48L3BhdGg+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=" alt="html2canvas">
    <p style="font-size: 58px; color: white; margin: 0;">html2canvas</p>
  </div>
  <img width="200" src="https://vuejs.org/images/logo.png" alt="Vue.js">
</div>

## Vue support

Supports only Vue >= 2

## Installation and usage

```
npm install --save pic-template
```

```html
<PicTemplate
  ref="boxRef"
  v-model="loading"
  :data="data"
  @error="onError"
/>
```

### Global Import
```js
import PicTemplate from 'pic-template'
Vue.use(PicTemplate)
```

### Import on Demand
```js
import PicTemplate from 'pic-template'

new Vue({
  components: {
    PicTemplate
  },
  data() {
    return {
      loading: false,
      options: {
        debug: true,
        autoRender: false
      },
      data: {
        bgImage: '',
        list: [
          {
            type: 1, // 1-text 2-image
            content: 'ABC Number CBA', // text or image url
            fontSize: 100,
            fontColor: 'white',
            x: 503,
            y: 676,
            alignment: 2, // 1-left 2-center 3-right
          }
        ]
      }
    }
  },
  methods: {
    async render() {
      const res = await this.$refs['boxRef'].render()
      console.log('res:', res)
    },
    onError(error) {
      console.log(error)
    }
  }
});
```

## PicTemplate Props
| Attribute | Required | Type | Default |
|:------| :------ | :------ | :------ |
| v-model | no | boolean | `false` |
| data | yes | object (PicTemplateData) | - |
| options | no | object (PicTemplateOps) | - |

## PicTemplate Events
| Event | Description | Arguments
|:------| :------ | :------
| error | error | error: string |

## PicTemplate Types
```
PicTemplateData {
  bgImage: string;
  list: Array<{
    type: 1 | 2; // 1-text 2-image
    content: string; // text or image url
    fontSize?: number'
    fontColor?: string;
    x: number;
    y: number;
    alignment: 1 | 2 | 3; // 1-left 2-center 3-right
  }>;
}
```
```
PicTemplateOps {
  debug?: boolean; // default false
  imageType?: string; // default image/png
  autoRender?: boolean; // default true
}
```
