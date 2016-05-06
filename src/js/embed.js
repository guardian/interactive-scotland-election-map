import iframeMessenger from 'guardian/iframe-messenger'
import embedHTML from './text/embed.html!text'
import ScotlandElectionMap from './components/scotland'


import { requestAnimationFrame, cancelAnimationFrame } from './lib/raf';

window.init = function init(el, config) {
    iframeMessenger.enableAutoResize();


    let meta = window.location.search,
    	mapFilter;
    if(meta){

    	let info = meta.replace('?','').split('&')[0].split("=");
    	
    	if(info[0]==="f") {
    		mapFilter=info[1]
    	}
    }


    el.innerHTML = embedHTML;

    

    let frameRequest = requestAnimationFrame(function checkInnerHTML(time) {
        //console.log(time)

        if(el && el.getBoundingClientRect().height) {
            cancelAnimationFrame(checkInnerHTML);
           	new ScotlandElectionMap({
		    	el:el,
		    	config:config,
		    	filter:mapFilter
		    });
            return; 
        }
        frameRequest = requestAnimationFrame(checkInnerHTML);
    });

};
