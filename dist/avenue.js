var Avenue = function () {
    'use strict';

    const _window = window;
    const _location = _window.location;

    /**
     * Returns hash without starting char
     *
     * @param {Object} _location location Object
     * @returns {String} replaced string
     */
    const getHash = function (_location) {
        return _location.hash.replace("#", "");
    };

    /**
     * Splits path by dashes and trims
     *
     * @param {String} path path string
     * @returns {Array} split path
     */
    const splitPath = function (path) {
        return path.split("/").filter(item => item.length);
    };

    /**
     * Returns wether the pathPart is a variable
     *
     * @param {String} path Path part string
     * @returns {Boolean} wether the pathPart is a variable
     */
    const isPathVariable = function (path) {
        return path[0] === ":";
    };

    /**
     * Checks two routes for matching
     *
     * @param {Array} currentPath splitted current path
     * @param {Array} currentPath splitted route path
     * @returns {Boolean} if routes match
     */
    const matchRoutes = function (currentPath, routePath) {
        return currentPath.every((currentPathPart, index) => {
            const routePathPart = routePath[index];

            if (routePathPart) {
                //Checks for variable-wildcard or equivalency
                return isPathVariable(routePathPart) || currentPathPart === routePathPart;
            }
        });
    };

    /**
     * Finds route by path from route container
     *
     * @param {String} path route path
     * @param {Object} routes route map
     * @returns {Object} matching route
     */
    const findRoute = function (path, routes) {
        const currentPath = splitPath(path);
        const matchingRoute = routes.find(route => {
            return matchRoutes(currentPath, route.path);
        });

        if (matchingRoute) {
            const args = {};

            matchingRoute.path.forEach((matchingRoutePathPart, index) => {
                if (isPathVariable(matchingRoutePathPart)) {
                    args[matchingRoutePathPart.substr(1)] = currentPath[index];
                }
            });

            return {
                args,
                fn: matchingRoute.fn
            };
        }

        return null;
    };

    /**
     * Avenue Class
     *
     * @class
     */
    const Avenue = class {
        /**
         * Avenue constructor
         *
         * @constructor
         * @param {Object} routes routing map
         */
        constructor(routes) {
            const _this = this;
            const currentHash = getHash(_location);

            _this.$routes = [];

            //Parse routes from {path:fn} to [{path,fn}]
            Object.keys(routes).forEach(routePath => {
                _this.$routes.push({
                    path: splitPath(routePath),
                    fn: routes[routePath]
                });
            });

            //Bind event
            _window.addEventListener("hashchange", e => {
                _this.navigate(getHash(_location), e);
            }, false);

            //load current route
            if (currentHash.length) {
                _this.navigate(currentHash);
            }
        }
        /**
         * Navigate to the given path
         *
         * @param {String} path Path string
         * @param {Event} e Initializer event
         */
        navigate(path, e) {
            const routeData = findRoute(path, this.$routes);

            _location.hash = path;

            if (routeData) {
                routeData.fn(e, routeData.args);
            }
        }
    };

    return Avenue;
}();