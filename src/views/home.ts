import { render } from '../lib/template'

export function renderHome(opts: { appName: string; appEnv: string; port: number; svg: string }) {
  return render('views/home.html', {
    ...opts,
    svgLogo: opts.svg.replace('<svg', '<svg class="logo"'),
    serverTime: new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }),
  })
}
