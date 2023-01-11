"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// https://github.com/trekhleb/javascript-algorithms/blob/master/src/data-structures/graph/GraphEdge.js
var GraphEdge = /** @class */ (function () {
    function GraphEdge(startVertex, endVertex, weight, rawWeight, metadata) {
        if (weight === void 0) { weight = 0; }
        if (rawWeight === void 0) { rawWeight = 0; }
        this.weight = 0;
        this.rawWeight = 0;
        this.metadata = {};
        this.startVertex = startVertex;
        this.endVertex = endVertex;
        this.weight = weight;
        this.rawWeight = rawWeight;
        this.metadata = metadata;
    }
    /**
     * @return {string}
     */
    GraphEdge.prototype.getKey = function () {
        var startVertexKey = this.startVertex.getKey();
        var endVertexKey = this.endVertex.getKey();
        return startVertexKey + "_" + endVertexKey;
    };
    /**
     * @return {GraphEdge}
     */
    GraphEdge.prototype.reverse = function () {
        var tmp = this.startVertex;
        this.startVertex = this.endVertex;
        this.endVertex = tmp;
        return this;
    };
    /**
     * @return {string}
     */
    GraphEdge.prototype.toString = function () {
        return this.getKey();
    };
    return GraphEdge;
}());
exports.default = GraphEdge;
