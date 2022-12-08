const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
import graphFromOsm from "graph-from-osm";
import haversine from "haversine";

let g = null;

export async function generateGraph(settings, graph) {
    const osmData = await graphFromOsm.getOsmData(settings);

    g = graphFromOsm.osmDataToGraph(osmData);

    let points = g.features.filter((obj) => obj.geometry.type === "Point");
    let ways = g.features.filter((obj) => obj.geometry.type === "LineString");
    points.forEach((node) => {
        graph.addNode(node.id, {
            coordinates: [node.geometry.coordinates[1], node.geometry.coordinates[0]],
            osmId: node.properties.osmId,
        });
    });

    let elevations = await getElevations(graph);
    let index = 0;
    graph.forEachNode((node) => {
        node.data.elevation = elevations.results[index++].elevation;
    });

    ways.forEach((way) => {
        let start = {
            latitude: graph.getNode(way.src).data.coordinates[0],
            longitude: graph.getNode(way.src).data.coordinates[1],
        };

        let end = {
            latitude: graph.getNode(way.tgt).data.coordinates[0],
            longitude: graph.getNode(way.tgt).data.coordinates[1],
        };

        let distance = haversine(start, end, { unit: "meter" });

        if (way.properties.tags.oneway && way.properties.tags.oneway == "yes") {
            graph.addLink(way.src, way.tgt, { distance: distance });
        } else if (!way.properties.tags.oneway || way.properties.tags.oneway == "no") {
            graph.addLink(way.src, way.tgt, { distance: distance });
            graph.addLink(way.tgt, way.src, { distance: distance });
        }
    });

    graph.forEachLink((link) => {
        let node1 = graph.getNode(link.fromId);
        let node2 = graph.getNode(link.toId);
        let elevation = node2.data.elevation - node1.data.elevation;
        link.data.elevation = elevation;
    });

    console.log("Data loaded");
}

async function getElevations(graph) {
    let answer = {
        results: [],
    };

    let locations = [];

    graph.forEachNode((node) => {
        locations.push({
            latitude: node.data.coordinates[0],
            longitude: node.data.coordinates[1],
        });
    });

    let time = Math.round(locations.length / 200);

    for (let i = 0; i < time; i++) {
        let temp = locations.slice(i * 200, (i + 1) * 200);
        let body = {
            locations: temp,
        };

        let response = await fetch("https://api.open-elevation.com/api/v1/lookup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        let result = await response.json();

        answer.results.push(...result.results);
    }

    if (locations.length > time * 200) {
        let temp = locations.slice(time * 200, locations.length);
        let body = {
            locations: temp,
        };
        let response = await fetch("https://api.open-elevation.com/api/v1/lookup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        let result = await response.json();

        answer.results.push(...result.results);
    }

    return answer;
}
