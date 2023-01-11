"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LinkedListNode_1 = require("./LinkedListNode");
var Comparator_1 = require("./Comparator");
var LinkedList = /** @class */ (function () {
    function LinkedList(comparatorFunction) {
        this.head = null;
        this.tail = null;
        this.compare = new Comparator_1.default(comparatorFunction);
    }
    /**
     * @param {*} value
     * @return {LinkedList}
     */
    LinkedList.prototype.prepend = function (value) {
        // Make new node to be a head.
        var newNode = new LinkedListNode_1.default(value, this.head);
        this.head = newNode;
        // If there is no tail yet let's make new node a tail.
        if (!this.tail) {
            this.tail = newNode;
        }
        return this;
    };
    /**
     * @param {*} value
     * @return {LinkedList}
     */
    LinkedList.prototype.append = function (value) {
        var newNode = new LinkedListNode_1.default(value);
        // If there is no head yet let's make new node a head.
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
            return this;
        }
        // Attach new node to the end of linked list.
        this.tail.next = newNode;
        this.tail = newNode;
        return this;
    };
    /**
     * @param {*} value
     * @param {number} index
     * @return {LinkedList}
     */
    LinkedList.prototype.insert = function (value, rawIndex) {
        var index = rawIndex < 0 ? 0 : rawIndex;
        if (index === 0) {
            this.prepend(value);
        }
        else {
            var count = 1;
            var currentNode = this.head;
            var newNode = new LinkedListNode_1.default(value);
            while (currentNode) {
                if (count === index)
                    break;
                currentNode = currentNode.next;
                count += 1;
            }
            if (currentNode) {
                newNode.next = currentNode.next;
                currentNode.next = newNode;
            }
            else {
                if (this.tail) {
                    this.tail.next = newNode;
                    this.tail = newNode;
                }
                else {
                    this.head = newNode;
                    this.tail = newNode;
                }
            }
        }
        return this;
    };
    /**
     * @param {*} value
     * @return {LinkedListNode}
     */
    LinkedList.prototype.delete = function (value) {
        if (!this.head) {
            return null;
        }
        var deletedNode = null;
        // If the head must be deleted then make next node that is different
        // from the head to be a new head.
        while (this.head && this.compare.equal(this.head.value, value)) {
            deletedNode = this.head;
            this.head = this.head.next;
        }
        var currentNode = this.head;
        if (currentNode !== null) {
            // If next node must be deleted then make next node to be a next next one.
            while (currentNode.next) {
                if (this.compare.equal(currentNode.next.value, value)) {
                    deletedNode = currentNode.next;
                    currentNode.next = currentNode.next.next;
                }
                else {
                    currentNode = currentNode.next;
                }
            }
        }
        // Check if tail must be deleted.
        if (this.compare.equal(this.tail.value, value)) {
            this.tail = currentNode;
        }
        return deletedNode;
    };
    /**
     * @param {Object} findParams
     * @param {*} findParams.value
     * @param {function} [findParams.callback]
     * @return {LinkedListNode}
     */
    LinkedList.prototype.find = function (_a) {
        var _b = _a.value, value = _b === void 0 ? undefined : _b, _c = _a.callback, callback = _c === void 0 ? undefined : _c;
        if (!this.head) {
            return null;
        }
        var currentNode = this.head;
        while (currentNode) {
            // If callback is specified then try to find node by callback.
            if (callback && callback(currentNode.value)) {
                return currentNode;
            }
            // If value is specified then try to compare by value..
            if (value !== undefined && this.compare.equal(currentNode.value, value)) {
                return currentNode;
            }
            currentNode = currentNode.next;
        }
        return null;
    };
    /**
     * @return {LinkedListNode}
     */
    LinkedList.prototype.deleteTail = function () {
        var deletedTail = this.tail;
        if (this.head === this.tail) {
            // There is only one node in linked list.
            this.head = null;
            this.tail = null;
            return deletedTail;
        }
        // If there are many nodes in linked list...
        // Rewind to the last node and delete "next" link for the node before the last one.
        var currentNode = this.head;
        while (currentNode.next) {
            if (!currentNode.next.next) {
                currentNode.next = null;
            }
            else {
                currentNode = currentNode.next;
            }
        }
        this.tail = currentNode;
        return deletedTail;
    };
    /**
     * @return {LinkedListNode}
     */
    LinkedList.prototype.deleteHead = function () {
        if (!this.head) {
            return null;
        }
        var deletedHead = this.head;
        if (this.head.next) {
            this.head = this.head.next;
        }
        else {
            this.head = null;
            this.tail = null;
        }
        return deletedHead;
    };
    /**
     * @param {*[]} values - Array of values that need to be converted to linked list.
     * @return {LinkedList}
     */
    LinkedList.prototype.fromArray = function (values) {
        var _this = this;
        values.forEach(function (value) { return _this.append(value); });
        return this;
    };
    /**
     * @return {LinkedListNode[]}
     */
    LinkedList.prototype.toArray = function () {
        var nodes = [];
        var currentNode = this.head;
        while (currentNode) {
            nodes.push(currentNode);
            currentNode = currentNode.next;
        }
        return nodes;
    };
    /**
     * @param {function} [callback]
     * @return {string}
     */
    LinkedList.prototype.toString = function (callback) {
        return this.toArray().map(function (node) { return node.toString(callback); }).toString();
    };
    /**
     * Reverse a linked list.
     * @returns {LinkedList}
     */
    LinkedList.prototype.reverse = function () {
        var currNode = this.head;
        var prevNode = null;
        var nextNode = null;
        while (currNode) {
            // Store next node.
            nextNode = currNode.next;
            // Change next node of the current node so it would link to previous node.
            currNode.next = prevNode;
            // Move prevNode and currNode nodes one step forward.
            prevNode = currNode;
            currNode = nextNode;
        }
        // Reset head and tail.
        this.tail = this.head;
        this.head = prevNode;
        return this;
    };
    return LinkedList;
}());
exports.default = LinkedList;
