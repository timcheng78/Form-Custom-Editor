!function () {
    function processModule(modules, fn, tree) {
        fn.prototype = eNursing.isNotBlankObj(fn.prototype) ? eNursing.extend({}, eNursing.Nursing, fn.prototype) : eNursing.Nursing;
        tree["create" + (eNursing.getFnName(fn))] = function (isInit) {
            var temp = new fn();
            var constructor = temp.parentConstructor;
            if (eNursing.isFunction(constructor)) {
                if (!tree["get" + (eNursing.getFnName(constructor))]) {
                    processModule(modules, constructor, tree);
                }
                temp.setParent(tree["get" + (eNursing.getFnName(constructor))]().getCurrent(isInit))
            }
            return temp;
        };
        var module = tree["create" + (eNursing.getFnName(fn))](true);
        tree["get" + (eNursing.getFnName(fn))] = function () {
            return module;
        };
    }

    eNursing.processModule = processModule;
    eNursing.init = function () {
        var modules = eNursing.getModules(),
            tree;
        if (modules) {
            tree = {};
            for (var k in modules) {
                if (modules.hasOwnProperty(k) && eNursing.isFunction(modules[k])) {
                    var fn = modules[k];
                    if (!tree["get" + eNursing.getFnName(fn)]) {
                        processModule(modules, fn, tree);
                    }
                }
            }
        }
        return tree;
    };
}(eNursing);
/** @function nursing.createUser*/
/** @function nursing.getUser*/
/** @function nursing.createZone*/
/** @function nursing.getZone*/
/** @function nursing.createStation*/
/** @function nursing.getStation*/
/** @function nursing.createPatient*/
/** @function nursing.getPatient*/
/** @function nursing.createOrderCalendar*/
/** @function nursing.getOrderCalendar*/
/** @function nursing.getFileStore*/
var nursing = new eNursing();