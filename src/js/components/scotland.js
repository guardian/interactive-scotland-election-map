import {json as d3_json} from 'd3-request';

import {randomUniform} from 'd3-random';

import Grid from './Grid';

import Legend from './Legend';

import {MAP,filters} from '../lib/map';

import {
	entries
} from 'd3-collection'

import {
    select
} from 'd3-selection';

import { requestAnimationFrame, cancelAnimationFrame } from '../lib/raf';

export default function ScotlandElectionMap(options) {

	let map=[];

	let el=options.el,
		config=options.config;

	if(options.filter && options.filter!=="lab" && !filters[options.filter]) {
		options.filter=null;
	}

    d3_json(config.assetPath+"/assets/data/scotland2.json",(__data)=>{
    //d3_json("https://interactive.guim.co.uk/2016/04/localelections2016/booted/data/scottish/full.json",(__data)=>{
        //console.log("SCOTLAND",__data)
        let data=[];

        //console.log(__data.map(d=>d.name))

        __data.forEach((d,i)=>{
            
            let PARTIES=["Con","Lab","SNP","Lib Dem","Green"];



            data.push({
                constituency:d.name,
                coords:[Math.floor(i/10),i%10],
                years:[
                    ((votes)=>{
                        let parties={};
                        votes.filter(p=>PARTIES.indexOf(p.party)>-1).forEach(v=>{
                            parties[(v.party==="Lib Dem")?"LD":v.party]={
                                percentage:!v.change?0:v.percentage-v.change
                            }
                        })
                        
                        return parties;

                    })(d.votes),
                    ((votes)=>{
                        let parties={};
                        votes.filter(p=>PARTIES.indexOf(p.party)>-1).forEach(v=>{
                            parties[(v.party==="Lib Dem")?"LD":v.party]={
                                percentage:v.percentage,
                                change:!v.change?0:v.change
                            }
                        })
                        
                        return parties;
                        
                    })(d.votes)

                ]
            });
        })

        //console.log("NEW DATA IS",data)

        let _map=MAP;
        if(options.filter && options.filter!=="lab") {
        	_map=filters[options.filter]
        }
        if(options.filter==="lab") {
        	data=data.filter(c=>{
        		let orders=[[],[]];

        		([0,1]).forEach(i=>{
        			entries(c.years[i]).sort((a,b)=>{
	        			return b.value.percentage - a.value.percentage;
	        		}).forEach(c=>{
	        			orders[i].push(c.key)
	        		})	
        		});

        		//console.log(orders[0].indexOf("Lab"),orders[1].indexOf("Lab"))

        		
        		return orders[0].indexOf("Lab")<orders[1].indexOf("Lab");
        	})
        	//console.log(data)
        }
        //return;
        if(!options.filter) {
        	let legend=new Legend(
	        	data.filter(d=>d.constituency==="Edinburgh Central")
		        ,{
		        	container:el.querySelector(".interactive-container")
		        });
        }
        
        //return;
        let grid=new Grid(data,{
            container:el.querySelector(".interactive-container"),
            map:_map.map(m=>m.split(";"))
        });

        
        if(options.filter && options.filter!=="lab") {
        	select(el.querySelector(".interactive-container")).append("img")
        		.attr("class","scotland-map")
        		.attr("src",config.assetPath+"/assets/imgs/"+options.filter+".png")
        }

        window.addEventListener("optimizedResize", function() {
            //console.log("resize")
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