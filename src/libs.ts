import axios from 'axios'
import * as cheerio from 'cheerio'
import * as path from 'path'

require('dotenv-defaults').config({
  path: path.resolve(`${__dirname}`, '../.env'),
  defaults: path.resolve(`${__dirname}`, '../.env.defaults'),
})

const request = axios.create({
  baseURL: `${process.env.API_ENDPOINT}`,
  timeout: 30000,
  validateStatus: function(status) {
    return status >= 200 && status < 303
  },
})

export const loadData = async (url: string, params?: Object) => {
  try {
    const resp = await request.get(`${url}`, {
      params,
    })
    if (resp.status !== 200) return

    return resp.data
  } catch (err) {
    throw err
  }
}

export const createSession = async (username: string, password: string) => {
  const params = {
    username,
    password,
    csrf: _parseCsrfToken((await request.get('login')).data),
  }
  const resp = await request.post('api/auth', params, {
    maxRedirects: 0,
  })
  if (resp.headers['set-cookie']) {
    const cookie = `${_parseCookie(
      resp.headers['set-cookie'][0]
    )}; ${_parseCookie(resp.headers['set-cookie'][1])}`
    request.defaults.headers.Cookie = cookie
  } else {
    throw new Error('Create session failed')
  }
}

const _parseCsrfToken = (text: string): string => {
  const $ = cheerio.load(text)
  return $('input[name="csrf"]').attr('value')
}

const _parseCookie = (value: string) => {
  const data = value.split(';')
  return data.length ? value.split(';')[0] : ''
}
