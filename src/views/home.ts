import { render } from '../lib/template'

export function renderHome(opts: { appName: string; appEnv: string; port: number; svg: string }) {
  return render('views/home.html', {
    ...opts,
    svgLogo: opts.svg.replace('<svg', '<svg class="logo"'),
  })
}
