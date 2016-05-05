import {
    select,
    selectAll,
    selection
} from 'd3-selection';

import {
	scalePoint,
    scaleLinear
} from 'd3-scale';

import {
	entries
} from 'd3-collection'

import {
    line
}
from 'd3-shape';

import {
    interpolateNumber
}
from 'd3-interpolate';

export default function Switch(data, options) {

	console.log("Switch",data,options);

	data=data.map(d=>{

		let prev=0;
		d=entries(d).sort((a,b)=>{
			return b.value - a.value;
		}).map(d=>{

			d.prev=prev;
			prev+=d.value;

			return d;
		})

		return d;

	})

	console.log("---->",data)

	//return;

	let box = options.container.node().getBoundingClientRect();
    let WIDTH = options.width || box.width,
        HEIGHT = options.height || box.width;

	let svg = options.container
        		.append("svg")
        		.attr("width",WIDTH)
        		.attr("height",HEIGHT)

    let defs = svg.append("defs");

    //addArrow(defs);

    

    console.log(WIDTH,HEIGHT)

	let margins = options.margins || {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    let padding = options.padding || {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    let xscale = scalePoint().domain([2011,2016]).range([0, WIDTH - (margins.left + margins.right + padding.left + padding.right)]),
        yscale = scaleLinear().domain([0,options.extent]).range([0,HEIGHT - (margins.top + margins.bottom + padding.top)]),
        hscale = scaleLinear().domain([0,options.extent]).range([0,HEIGHT - (margins.top + margins.bottom + padding.top)]);

    let party;

    buildVisual();

	function buildVisual() {

		let lines=svg.append("g")
				.attr("class","lines")
				.attr("transform", "translate(" + (margins.left+padding.left) + "," + (margins.top+padding.top) + ")");

		party=lines
					.selectAll("g.line")
					.data(data[1].map(d=>d.key).sort((a,b)=>{
						let party1=data[1].find(v=>(v.key===a)),
							party2=data[1].find(v=>(v.key===b));
						return party2.value - party1.value;
					}))
					.enter()
					.append("g")
						.attr("class",d=>{
							return "line "+d;
						});

		// party.append("line")
		// 	.attr("x1",xscale(2011))
		// 	.attr("x2",xscale(2016))
		// 	.attr("y1",d=>{
		// 		let party=data[0].find(v=>(v.key===d));
		// 		return yscale(party.prev)
		// 	})
		// 	.attr("y2",d=>{
		// 		let party=data[1].find(v=>(v.key===d));
		// 		return yscale(party.prev)
		// 	})
		// 	.style("marker-end",d => "url(#arrow-"+d+")")

		party.append("path")
				
		updateVisuals();

	}

	function updateVisuals() {
		party.select("path")
				.attr("d",d=>{
					return drawPath(d);
				})
	}

	function drawPath(d) {
		let x1=xscale(2011),
			x2=xscale(2016),
			party1=data[0].find(v=>(v.key===d)),
			y1=yscale(party1.prev),
			h1=hscale(party1.value),
			party2=data[1].find(v=>(v.key===d)),
			y2=yscale(party2.prev),
			h2=hscale(party2.value);

		let curvature = .5;

		let xi = interpolateNumber(x1, x2),
			xc1 = xi(curvature),
          	xc2 = xi(1 - curvature);


		return `
			M${x1},${y1}
			C${xc1},${y1} ${xc2},${y2} ${x2},${y2}
			L${x2},${y2+h2}
			C${xc2},${y2+h2} ${xc1},${y1+h1} ${x1},${y1+h1}
		`;

		return 	`
					M${x1},${y1}
					L${x2},${y2}
					L${x2},${y2+h2}
					L${x1},${y1+h1}
					z
				`;
	}

	this.resize = () => {
		let box = options.container.node().getBoundingClientRect();
	    WIDTH = options.width || box.width;
		HEIGHT = options.height || box.width;

		xscale.range([0, WIDTH - (margins.left + margins.right + padding.left + padding.right)]),
        yscale.range([0,HEIGHT - (margins.top + margins.bottom + padding.top)]),
        hscale.range([0,HEIGHT - (margins.top + margins.bottom + padding.top)]);

        updateVisuals();
	}

	function addArrow(defs) {
		

		

		defs
			.selectAll("marker")
			.data([
				{
					"p":"con",
					"c":"#005789"
				},
				{
					"p":"lab",
					"c":"#E31F26"
				},
				{
					"p":"snp",
					"c":"#fcb705"
				}
			])
			.enter()
				.append("marker")
				.attr("id",d => "arrow-"+d.p)
				.attr("viewBox","0 0 11 11")
				.attr("markerWidth",9)
				.attr("markerHeight",9)
				.attr("markerUnits","userSpaceOnUse")
				.attr("refX",2)
				.attr("refY",5)
				.attr("orient","auto")
					.append("path")
						.attr("d","M 0 0 L 10 5 L 0 10 z")
						.attr("fill",d=>d.c)
	}
}