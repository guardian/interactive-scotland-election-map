import mainHTML from './text/main.html!text'

//import {select} from 'd3-selection';
import {json as d3_json} from 'd3-request';

import {randomUniform} from 'd3-random';

import Grid from './components/Grid';

import {MAP} from '../assets/data/map';

import { requestAnimationFrame, cancelAnimationFrame } from './lib/raf';

export function init(el, context, config, mediator) {
    el.innerHTML = mainHTML.replace(/%assetPath%/g, config.assetPath);

    let map=[];

    d3_json(config.assetPath+"/assets/data/scotland2.json",(__data)=>{
        console.log("SCOTLAND",__data)
        let data=[];

        console.log(__data.map(d=>d.name))

        __data.forEach((d,i)=>{
            
            let PARTIES=["Con","Lab","SNP","Lib Dem"];



            data.push({
                constituency:d.name,
                coords:[Math.floor(i/10),i%10],
                years:[
                    ((votes)=>{
                        let parties={};
                        votes.filter(p=>PARTIES.indexOf(p.party)>-1).forEach(v=>{
                            parties[(v.party==="Lib Dem")?"LD":v.party]={
                                percentage:v.percentage-v.change
                            }
                        })
                        
                        return parties;

                    })(d.votes),
                    ((votes)=>{
                        let parties={};
                        votes.filter(p=>PARTIES.indexOf(p.party)>-1).forEach(v=>{
                            parties[(v.party==="Lib Dem")?"LD":v.party]={
                                percentage:v.percentage,
                                change:v.change
                            }
                        })
                        
                        return parties;
                        
                    })(d.votes)

                ]
            });
        })

        //console.log("NEW DATA IS",data)

        

        let grid=new Grid(data,{
            container:el.querySelector(".interactive-container"),
            map:MAP.map(m=>m.split(";"))
                // .reduce(function(a, b) {
                //   return a.concat(b);
                // }, [])
        });

        window.addEventListener("optimizedResize", function() {
            console.log("resize")
            grid.resize();
        });


    })
    

    ;(function() {
        var throttle = function(type, name, obj) {
            var obj = obj || window;
            var running = false;
            var func = function() {
                if (running) { return; }
                running = true;
                requestAnimationFrame(() => {
                    obj.dispatchEvent(new CustomEvent(name));
                    running = false;
                });
            };
            obj.addEventListener(type, func);
        };

        //* init - you can init any event
        throttle ("resize", "optimizedResize");
    })();
    
    if (!Array.prototype.find) {
      Array.prototype.find = function(predicate) {
        if (this === null) {
          throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return value;
          }
        }
        return undefined;
      };
    }
}
