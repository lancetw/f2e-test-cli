export const loadParams = (params: string[]) => {
  if (params) {
    let obj: any = {}
    params.forEach((ele: string) => {
      const arg = ele.split('=')
      if (arg.length === 2) {
        obj[arg[0]] = arg[1]
      }
    })
    params = obj
  }
  return params
}
