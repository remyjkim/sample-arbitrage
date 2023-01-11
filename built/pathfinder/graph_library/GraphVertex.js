"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LinkedList_1 = require("./LinkedList");
var GraphVertex = /** @class */ (function () {
    function GraphVertex(value) {
        if (value === undefined) {
            throw new Error('Graph vertex must have a value');
        }
        /**
         * @param {GraphEdge} edgeA
         * @param {GraphEdge} edgeB
         */
        var edgeComparator = function (edgeA, edgeB) {
            if (edgeA.getKey() === edgeB.getKey()) {
                return 0;
            }
            return edgeA.getKey() < edgeB.getKey() ? -1 : 1;
        };
        // Normally you would store string value like vertex name.
        // But generally it may be any object as well
        this.value = value;
        this.edges = new LinkedList_1.default(edgeComparator);
    }
    /**
     * @param {GraphEdge} edge
     * @returns {GraphVertex}
     */
    GraphVertex.prototype.addEdge = function (edge) {
        this.edges.append(edge);
        return this;
    };
    /**
     * @param {GraphEdge} edge
     */
    GraphVertex.prototype.deleteEdge = function (edge) {
        this.edges.delete(edge);
    };
    /**
     * @returns {GraphVertex[]}
     */
    GraphVertex.prototype.getNeighbors = function () {
        var _this = this;
        var edges = this.edges.toArray();
        /** @param {LinkedListNode} node */
        var neighborsConverter = function (node) {
            return node.value.startVertex === _this ? node.value.endVertex : node.value.startVertex;
        };
        // Return either start or end vertex.
        // For undirected graphs it is possible that current vertex will be the end one.
        return edges.map(neighborsConverter);
    };
    /**
     * @return {GraphEdge[]}
     */
    GraphVertex.prototype.getEdges = function () {
        return this.edges.toArray().map(function (linkedListNode) { return linkedListNode.value; });
    };
    /**
     * @return {number}
     */
    GraphVertex.prototype.getDegree = function () {
        return this.edges.toArray().length;
    };
    /**
     * @param {GraphEdge} requiredEdge
     * @returns {boolean}
     */
    GraphVertex.prototype.hasEdge = function (requiredEdge) {
        var edgeNode = this.edges.find({
            callback: function (edge) { return edge === requiredEdge; },
        });
        return !!edgeNode;
    };
    /**
     * @param {GraphVertex} vertex
     * @returns {boolean}
     */
    GraphVertex.prototype.hasNeighbor = function (vertex) {
        var vertexNode = this.edges.find({
            callback: function (edge) { return edge.startVertex === vertex || edge.endVertex === vertex; },
        });
        return !!vertexNode;
    };
    /**
     * @param {GraphVertex} vertex
     * @returns {(GraphEdge|null)}
     */
    GraphVertex.prototype.findEdge = function (vertex) {
        var edgeFinder = function (edge) {
            return edge.startVertex === vertex || edge.endVertex === vertex;
        };
        var edge = this.edges.find({ callback: edgeFinder });
        return edge ? edge.value : null;
    };
    /**
     * @returns {string}
     */
    GraphVertex.prototype.getKey = function () {
        return this.value;
    };
    /**
     * @return {GraphVertex}
     */
    GraphVertex.prototype.deleteAllEdges = function () {
        var _this = this;
        this.getEdges().forEach(function (edge) { return _this.deleteEdge(edge); });
        return this;
    };
    /**
     * @param {function} [callback]
     * @returns {string}
     */
    GraphVertex.prototype.toString = function (callback) {
        return callback ? callback(this.value) : "" + this.value;
    };
    return GraphVertex;
}());
exports.default = GraphVertex;
