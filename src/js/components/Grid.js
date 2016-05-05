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

import Switch from './Switch';

export default function Grid(data, options) {

	console.log("Grid",data)



	let extents=max(data,(d)=>{
		return max([
				sum(values(d.years[0])),
				sum(values(d.years[1]))
			]);
	});

	console.log(extents)

	let switches=[];

	select(options.container)
		.append("div")
		.attr("class","grid")
			.selectAll("div.switch")
			.data(data)
			.enter()
				.append("div")
				.attr("class","switch")
				.attr("rel", d => d.constituency)
				//.style("top",d=>((d.coords[0]*42)+"px"))
				//.style("left",d=>(((d.coords[1]*42)+"px")))
				.each(function(d){
					console.log(d,this)

					switches.push(new Switch(d.years,{
											id:d.constituency,
											container:select(this),
											extent:extents,
											parties:['Con','SNP','Lab',"LD"],
											margins:{
												top:5,
												left:5,
												right:5,
												bottom:5
											}
										}));

				})

	this.resize = () => {

		switches.forEach(d=>d.resize());

	}

}