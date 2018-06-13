function BuildingApp() {
  var svg;
  var width = 910;
  var height = 610;
  var trajectories;
  var timeline;

  function me(selection) {
    console.log("BuildingApp");
    d3.text("assets/data/building_map.txt")
      .then(function(map) {
        let aMap = map.split('\n').map(function(d) {
          return d.trim().split(' ').map(function(e) {
            return +e
          })
        });
        console.log('map', aMap);
        let building = buildingBitmap();

        d3.select("#building").call(building);
        building.data(aMap);

      })
      .catch(function(error) {
        console.log(error);
      });

    d3.tsv("assets/data/rfid_assignments.txt")
      .then(rows => {
        let ids = rows
          .filter(row => {
            let entries = d3.values(row);
            return (entries[0].length > 0) // ignore rows with invalid id (not numeric)
          })
          .map(row => {
            let entries = d3.values(row);
            return {
              id: +entries[0],
              person: entries[1]
            }
          });
        console.log("ids", ids);

        me.personList = PersonList();
  			d3.select("#persons")
  				.datum(ids)
  			.call(me.personList);
      });
  }


  return me;
}


var buildingApp = BuildingApp();
d3.select("#main")
  .call(buildingApp);
