import {
    select,
    selectAll,
    selection
} from 'd3-selection';

import {
	max,
	sum,
	extent
} from 'd3-array'

import {
	values
} from 'd3-collection'

import {strokeShadow} from '../lib/CSSUtils';

import Switch from './Switch';

export default function Grid(data, options) {

	console.log("Grid",data)



	let extents=max(data,(d)=>{
		//console.log("--->",values(d.years[0]))
		return max([
				sum(values(d.years[0]),v=>{
					return v.percentage;
				}),
				sum(values(d.years[1]),v=>v.percentage)
			]);
	});

	console.log(extents)

	let tiles=[];
				

	let switches=[];

	let grid=select(options.container)
		.append("div")
		.attr("class","grid");

	let row=grid.selectAll("div.row")
			.data(options.map)
			.enter()
			.append("div")
				.attr("class","row");

	row
			.selectAll("div.switch")
			.data(d => d.map(m=>{
				let c=data.find((c)=>(c.constituency===m));
				return c?c:{constituency:"none",real_constituency:m};
			}))
			.enter()
				.append("div")
				.attr("class","switch")
				.classed("none",d=>{
					let constituency=d.real_constituency || d.constituency;
					return constituency==="none";
				})
				.attr("rel", d => d.real_constituency || d.constituency)
				//.style("top",d=>((d.coords[0]*42)+"px"))
				//.style("left",d=>(((d.coords[1]*42)+"px")))
				.each(function(d){
					//console.log(d,this)
					if(d.constituency!=="none") {
						switches.push(new Switch(d.years,{
											id:d.constituency,
											container:select(this),
											extent:extents,
											parties:['Con','SNP','Lab',"LD",'Green'],
											margins:{
												top:0,
												left:0,
												right:0,
												bottom:0
											},
											onTouchEndCallback:(d)=>{
												grid
													.classed("hover",true)
													.selectAll(".switch")
														.classed("hover",false);
											}/*,
											onMouseEnter:(d)=>{
												grid
													.classed("hover",true)
													.selectAll(".switch")
														.classed("hover",false);
											},
											onMouseLeave:(d)=>{
												grid
													.classed("hover",false)
													//.selectAll(".switch")
													//	.classed("hover",false);
											}*/
										}));
					} else {
						select(this)
							.classed("inactive",true)
							.append("div")
							.attr("class","stretch")
							.on("touchend",()=>{
								grid
									.classed("hover",false)
									.selectAll(".switch")
										.classed("hover",false);
							})
					}
					let constituency=d.real_constituency || d.constituency;
					if(constituency!=="none") {
						select(this).append("h4")
							.append("span")
		    					.text(constituency)
		    					.each(function(d){
		    						strokeShadow(this);
		    					})
	    			}
					
	
				})

	this.resize = () => {

		switches.forEach(d=>d.resize());

	}

}