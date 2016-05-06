import iframeMessenger from 'guardian/iframe-messenger'
import embedHTML from './text/embed.html!text'
import ScotlandElectionMap from './components/scotland'

import { requestAnimationFrame, cancelAnimationFrame } from './lib/raf';

window.init = function init(el, config) {
    iframeMessenger.enableAutoResize();

    el.innerHTML = embedHTML;

    new ScotlandElectionMap({
    	el:el,
    	config:config,
    	filter:null
    });

};
