
/**
 *
 *  This module will display a map with a symbol encoding for a set of geographical elements
 */


function MapWithLayers(){
	var projection = d3.geoMercator();
	var scale = 100; // default value for scale
	var center = [0,0]; // default value for centering the map
	var path;
	var gmap;

	let map;

	function me(selection){
		console.log("MapWithLayers", selection.datum());

		map = L.map(selection.node()).setView(center.reverse(),6);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		let circleLayer = L.d3SvgOverlay(function(selection, projection){
			console.log(selection);
	    var updateSelection = selection.selectAll('circle').data([center]);
	    updateSelection.enter()
	        .append('circle')
	        .attr('r',50)
	        .attr("cx", function(d) {

						let ll = L.latLng(d[0], d[1]);
						console.log('ll',ll);
						return projection.latLngToLayerPoint(ll).x })
	        .attr("cy", function(d) {
						let ll = L.latLng(d[0], d[1]);
						return projection.latLngToLayerPoint(ll).y });

				});
		circleLayer.addTo(map);
	}

	// getter and setter for variable center
	me.center = function(_){
		if(!arguments.length) return center;
		center = _;
		projection.center(center);

		return me;
	}



	return me;
}
