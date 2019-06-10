#!/usr/bin/env node

import './polyfills'
import * as commander from 'commander'
import * as inquirer from 'inquirer'
import { createSession, loadData } from './libs'
import { loadParams } from './util'

import * as path from 'path'

require('dotenv-defaults').config({
  path: path.resolve(`${__dirname}`, '../.env'),
  defaults: path.resolve(`${__dirname}`, '../.env.defaults'),
})

commander.version('0.0.1').description('F2E TEST CLI')

commander
  .command('demo')
  .description('quick test')
  .action(async () => {
    await createSession(`${process.env.USERNAME}`, `${process.env.PASSWORD}`)
    const data = await loadData('api/products', {
      offset: 0,
      limit: 1000,
    })
    // [CONSOLE OUTPUT]
    console.log(data)
  })

commander
  .command('fetch <url> [params...]', undefined, {
    isDefault: true,
  })
  .alias('get')
  .description('get API data')
  .action((url: string, params: any) => {
    ;(async () => {
      const form: {
        username: string
        password: string
      } = await inquirer.prompt([
        { type: 'input', name: 'username', default: `${process.env.USERNAME}` },
        {
          type: 'password',
          name: 'password',
          default: `${process.env.PASSWORD}`,
        },
      ])
      await createSession(form.username, form.password)
      const data = await loadData(url, {
        ...loadParams(params),
      })
      // [CONSOLE OUTPUT]
      console.log(data)
    })()
  })

if (!process.argv.slice(2).length) {
  commander.outputHelp()
  process.exit()
}
commander.parse(process.argv)
