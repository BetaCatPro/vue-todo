const Router = require('koa-router')
const axios = require('axios')
const MemeryFS = require('memery-fs')
const webpack = require('webpack')
const VueServerRenderer = require('vue-server-renderer')

const serverConfig = require('../../build/webpack.config.server')