import mainHTML from './text/main.html!text'

//import {select} from 'd3-selection';
import {json as d3_json} from 'd3-request';

import {randomUniform} from 'd3-random';

import Grid from './components/Grid';

import { requestAnimationFrame, cancelAnimationFrame } from './lib/raf';

export function init(el, context, config, mediator) {
    el.innerHTML = mainHTML.replace(/%assetPath%/g, config.assetPath);

    function dataGenerator() {

        let positions=[
            [8],
            [5],
            [3,4],
            [4,5,6],
            [5,6,7],
            [2,3,4,5,6,7],
            [3,4,5],
            [0,1,2,3,4,5,6,7],
            [2,3,4,5],
            [4]
        ];
        // positions=[
        //     [0]
        // ];

        let data=[];

        for(let i=0;i<positions.length;i++) {
            for(let j=0;j<positions[i].length;j++) {
                data.push({
                    constituency:"c"+i+"_"+positions[i][j],
                    coords:[i,positions[i][j]],
                    years:[
                        {
                            "con":randomUniform(10,20)(),
                            "lab":randomUniform(20,30)(),
                            "snp":randomUniform(25,40)()
                        },
                        {
                            "con":randomUniform(20,30)(),
                            "lab":randomUniform(10,30)(),
                            "snp":randomUniform(25,50)()
                        }
                    ]
                })
            }
        }

        return data;
    }

    d3_json(config.assetPath+"/assets/data/scotland.json",(__data)=>{
        console.log("SCOTLAND",__data)
        let data=[];
        __data.forEach((d,i)=>{
            
            let PARTIES=["Con","Lab","SNP","Lib Dem"];

            data.push({
                constituency:d.name,
                coords:[Math.floor(i/10),i%10],
                years:[
                    ((votes)=>{
                        let parties={};
                        votes.filter(p=>PARTIES.indexOf(p.party)>-1).forEach(v=>{
                            parties[(v.party==="Lib Dem")?"LD":v.party]=v.percentage-v.change
                        })
                        
                        return parties;

                    })(d.votes),
                    ((votes)=>{
                        let parties={};
                        votes.filter(p=>PARTIES.indexOf(p.party)>-1).forEach(v=>{
                            parties[(v.party==="Lib Dem")?"LD":v.party]=v.percentage
                        })
                        
                        return parties;
                        
                    })(d.votes)

                ]
            });
        })

        //console.log("NEW DATA IS",data)

        let grid=new Grid(data,{
            container:el.querySelector(".interactive-container")
        });

        window.addEventListener("optimizedResize", function() {
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
    

}
