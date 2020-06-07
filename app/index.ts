import './styles/index.scss'

import { default as main } from '../package.json'
import { default as tools } from '../node_modules/ais-tools/package.json'

import { ColorSchemes, Color } from 'ais-tools'
import { Controller } from './Controller'

try {
    new Controller()
} catch (ex) {
    console.error(ex)
}

const styles = (color: Color, idx: number) => {
    const styles = {
        'font-family': '"Courier New", Monospace',
        'color': color.get(idx),
        'font-size': '13px',
        'line-height': '13px'
    } 

    return Object.keys(styles).map(style => style + ':' + styles[style]).join(';')
} 

const logo = () => {
    const idx = Math.floor(Math.random() * Math.floor(ColorSchemes.length))
    const color = ColorSchemes.get(idx)
    let s: string[] = []
    s.push(styles(color, 2))
    s.push(styles(color, 3))
    s.push(styles(color, 4))
    s.push(styles(color, 3))
    s.push(styles(color, 2))
    s.push(styles(color, 1))
    s.push(styles(color, 0))

   console.log(`
%c █████╗ ██╗███████╗  ██████╗ ██╗  ████████╗██████╗ 
%c██╔══██╗██║██╔════╝  ██╔══██╗██║  ╚══██╔══╝██╔══██╗
%c███████║██║███████╗  ██████╔╝██║     ██║   ██████╔╝
%c██╔══██║██║╚════██║  ██╔═══╝ ██║     ██║   ██╔══██╗
%c██║  ██║██║███████║  ██║     ███████╗██║   ██║  ██║
%c╚═╝  ╚═╝╚═╝╚══════╝  ╚═╝     ╚══════╝╚═╝   ╚═╝  ╚═╝

%c         https://github.com/3epnm/ais-pltr

%c        ais-pltr v${main.version}, ais-tools v${tools.version}
`, s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[2])                                                
}

logo()
