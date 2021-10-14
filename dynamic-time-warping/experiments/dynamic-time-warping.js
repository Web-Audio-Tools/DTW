// 1. The first line imports the DynamicTimeWarping class from the dtw.js file.
// 2. The second line creates a new instance of the DynamicTimeWarping class.
// 3. The third line calls the getDistance() method on the DynamicTimeWarping instance.
// 4. The fourth line calls the getPath() method on the DynamicTimeWarping instance.
// 5. The fifth line prints the distance and the path.

(function () {
    "use strict";
    function DynamicTimeWarping(ts1, ts2, distanceFunction) {
        const ser1 = ts1;
        const ser2 = ts2;
        const distFunc = distanceFunction;
        let distance;
        let matrix;
        let path;

        const getDistance = () => {
            if (distance !== undefined) {
                return distance;
            }
            matrix = [];
            for (let i = 0; i < ser1.length; i++) {
                matrix[i] = [];
                for (let j = 0; j < ser2.length; j++) {
                    let cost = Infinity;
                    if (i > 0) {
                        cost = Math.min(cost, matrix[i - 1][j]);
                        if (j > 0) {
                            cost = Math.min(cost, matrix[i - 1][j - 1]);
                            cost = Math.min(cost, matrix[i][j - 1]);
                        }
                    } else {
                        if (j > 0) {
                            cost = Math.min(cost, matrix[i][j - 1]);
                        } else {
                            cost = 0;
                        }
                    }
                    matrix[i][j] = cost + distFunc(ser1[i], ser2[j]);
                }
            }

            return matrix[ser1.length - 1][ser2.length - 1];
        };

        this.getDistance = getDistance;

        const getPath = () => {
            if (path !== undefined) {
                return path;
            }
            if (matrix === undefined) {
                getDistance();
            }
            let i = ser1.length - 1;
            let j = ser2.length - 1;
            path = [[i, j]];
            while (i > 0 || j > 0) {
                if (i > 0) {
                    if (j > 0) {
                        if (matrix[i - 1][j] < matrix[i - 1][j - 1]) {
                            if (matrix[i - 1][j] < matrix[i][j - 1]) {
                                path.push([i - 1, j]);
                                i--;
                            } else {
                                path.push([i, j - 1]);
                                j--;
                            }
                        } else {
                            if (matrix[i - 1][j - 1] < matrix[i][j - 1]) {
                                path.push([i - 1, j - 1]);
                                i--;
                                j--;
                            } else {
                                path.push([i, j - 1]);
                                j--;
                            }
                        }
                    } else {
                        path.push([i - 1, j]);
                        i--;
                    }
                } else {
                    path.push([i, j - 1]);
                    j--;
                }
            }
            path = path.reverse();

            return path;
        };

        this.getPath = getPath;
    }

    const root = typeof self === "object" && self.self === self && self ||
        typeof global === "object" && global.global === global && global ||
        this;

    if (typeof exports !== "undefined" && !exports.nodeType) {
        if (typeof module !== "undefined" && !module.nodeType && module.exports) {
            exports = module.exports = DynamicTimeWarping;
        }
        exports.DynamicTimeWarping = DynamicTimeWarping;
    } else {
        root.DynamicTimeWarping = DynamicTimeWarping;
    }

    if (typeof define === "function" && define.amd) {
        define("dynamic-time-warping", [], () => {
            return DynamicTimeWarping;
        });
    }
}());
