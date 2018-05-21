

function CrossFilterChart(){
	let dimension="Dimension";
	let plot;

	function me(selection){
		let myData = transformData(selection.datum())
		console.log("chart data", myData);
		console.log('node chart', selection.node());

		let layout ={
			title:dimension,
			margin: {
		    l: 50,
		    r: 75,
		    b: 100,
		    t: 100,
		    pad: 4
		  },
		}
		plot = Plotly.newPlot(selection.node(), myData, layout,{displayModeBar: false});
	}

	me.dimension = function(_){
		if(!arguments.length) return dimension;
		dimension = _;

		return me;
	}

	me.refresh = function(data){
		console.log('data chart', data);
		console.log('data transformed chart', transformData(data));
		// refresh plot after external event
		return me;
	}

	function transformData(data){
		let sData = data.sort(function(a,b){return -a.key + b.key});
		return[
			{
				type:'bar',
				y: sData.map(function(d){return d.key}),
				x: sData.map(function(d){return d.value}),
				orientation:'h',
			}
		];
	}
	return me;
}
