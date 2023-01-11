"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @param {Graph} graph
 * @param {GraphVertex} startVertex
 * @return {{distances, previousVertices}}
 *
 * https://github.com/trekhleb/javascript-algorithms/blob/master/src/algorithms/graph/bellman-ford/bellmanFord.js
 */
function bellmanFord(graph, startVertex) {
    var distances = {};
    var previousVertices = {};
    // Init all distances with infinity assuming that currently we can't reach
    // any of the vertices except start one.
    distances[startVertex.getKey()] = 0;
    graph.getAllVertices().forEach(function (vertex) {
        previousVertices[vertex.getKey()] = null;
        if (vertex.getKey() !== startVertex.getKey()) {
            distances[vertex.getKey()] = Infinity;
        }
    });
    // (|V| - 1) iterations
    for (var iter = 0; iter < (graph.getAllVertices().length - 1); iter += 1) {
        var edges_3 = graph.getAllEdges();
        for (var _i = 0, edges_1 = edges_3; _i < edges_1.length; _i++) {
            var edge = edges_1[_i];
            var from = edge.startVertex;
            var to = edge.endVertex;
            if (distances[from.value] + edge.weight < distances[to.value]) {
                distances[to.value] = distances[from.value] + edge.weight;
                previousVertices[to.value] = from;
            }
        }
    }
    // Detect negative cycle
    // for (let iter = 0; iter < (graph.getAllVertices().length - 1); iter += 1) {
    var edges = graph.getAllEdges();
    var cyclePaths = [];
    var foundCycles = {};
    for (var _a = 0, edges_2 = edges; _a < edges_2.length; _a++) {
        var edge = edges_2[_a];
        var cyclePath = [];
        var from = edge.startVertex;
        var to = edge.endVertex;
        if (distances[from.value] + edge.weight < distances[to.value]) {
            // Logging
            // console.log(`NEGATIVE EDGE WEIGHT CYCLE DETECTED`)
            // console.log(`from: ${from.value}`)
            // console.log(`to: ${to.value}`)
            // Arbitrage value
            var curr = from;
            var index = 1;
            cyclePath[to.value] = index++;
            while (!cyclePath[curr.value]) {
                cyclePath[curr.value] = index++;
                curr = previousVertices[curr.getKey()];
            }
            cyclePath[curr.value + '_'] = index;
            // console.log(`found arb cycle`, cyclePath);
            // Remove non-cycle edges
            var path = [];
            for (var _b = 0, _c = Object.keys(cyclePath); _b < _c.length; _b++) {
                var key = _c[_b];
                path.push(key.replace('_', ''));
            }
            path.reverse();
            for (var i = 0; i < path.length; i++) {
                if (i !== 0 && path[0] === path[i]) {
                    path = path.slice(0, i + 1);
                    break;
                }
            }
            // console.log(`stripped cycle`, path);
            // Ensure uniqueness of cycles
            var uniquePath = path.join('');
            if (!foundCycles[uniquePath]) {
                cyclePaths.push(path);
                foundCycles[uniquePath] = true;
            }
        }
    }
    return {
        distances: distances,
        previousVertices: previousVertices,
        cyclePaths: cyclePaths
    };
}
exports.default = bellmanFord;
