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

export default function legend(data, options) {

	//console.log(data)

	let extents=max(data,(d)=>{
		//console.log("--->",values(d.years[0]))
		return max([
				sum(values(d.years[0]),v=>{
					return v.percentage;
				}),
				sum(values(d.years[1]),v=>v.percentage)
			]);
	});

	//console.log(extents)

	let legend=select(options.container)
				.append("div")
				.attr("class","legend grid")
	let _switch=legend.append("div")
					.attr("class","switch");

	legend.append("span")
			.attr("class","left label")
			.text("2011")
	legend.append("span")
			.attr("class","right label")
			.text("2016")

	new Switch(data[0].years,{
					id:data.constituency,
					container:_switch,
					extent:extents,
					parties:['Con','SNP','Lab',"LD","Green"],
					margins:{
						top:0,
						left:0,
						right:0,
						bottom:0
					}
				})
}