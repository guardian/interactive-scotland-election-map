import mainHTML from './text/main.html!text'
import ScotlandElectionMap from './components/scotland'
import { requestAnimationFrame, cancelAnimationFrame } from './lib/raf';

export function init(el, context, config, mediator) {
    el.innerHTML = mainHTML.replace(/%assetPath%/g, config.assetPath);

    let frameRequest = requestAnimationFrame(function checkInnerHTML(time) {
        //console.log(time)
        
        if(el && el.getBoundingClientRect().height) {
            cancelAnimationFrame(checkInnerHTML);
           	new ScotlandElectionMap({
		    	el:el,
		    	config:config,
		    	filter:"labegegd"
		    });  
            return; 
        }
        frameRequest = requestAnimationFrame(checkInnerHTML);
    });
    
}
