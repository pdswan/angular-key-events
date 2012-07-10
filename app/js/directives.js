'use strict';

/* Directives */
(function() {
  function isIncluded(haystack, needle) {
    return haystack.indexOf(needle) != -1;
  }

  function parseExprMap(exprMap, scope, parse) {
    var exprList = [];
    angular.forEach(exprMap, function(keyCodes, exprString) {
      exprList.push({
        keyCodes: angular.isArray(keyCodes) ? keyCodes : [keyCodes],
        expr: parse(exprString)
      });
    });
    return exprList;
  }

  function accumulateApplicableExprs(exprList, keyCode) {
    var applicableExprs = [];
    angular.forEach(exprList, function(exprObj) {
      if (isIncluded(exprObj.keyCodes, keyCode)) {
        applicableExprs.push(exprObj.expr);
      }
    });
    return applicableExprs;
  }

  function applyExprs(exprs, scope) {
    if (exprs.length > 0) {
      var passAlong = Array.prototype.slice.call(arguments, 1);
      scope.$apply(function() {
        angular.forEach(exprs, function(fn) {
          fn.apply(null, passAlong);
        });
      });
    }
  }

  var keyEvents = angular.module('directives.keyEvents', []);

  angular.forEach(['keydown', 'keyup', 'keypress'], function(evtName) {
    keyEvents.directive(evtName, ['$parse', function($parse) {
      return function(scope, elm, attrs) {
        var exprMap = scope.$eval(attrs[evtName]),
            exprList = parseExprMap(exprMap, scope, $parse);

        elm.bind(evtName, function(evt) {
          applyExprs(accumulateApplicableExprs(exprList, evt.which), scope, { $event: evt });
        });
      };
    }]);
  });
})();

/**
* @ngdoc directive
* @name keyEvents.directive:keydown
*
* @description
* The `keydown` directive allows you to specify custom behavior on a keydown event.
*
* @element ANY
* @param {string} a string representation of an object literal with expressions as keys 
* and keyCode(s) as values
*
* @example
* <input type="text" data-keydown="{ 'doSomething()': 13, 'scopeVar = scopeVar + 1': [9, 5] }" />
*/

/**
* @ngdoc directive
* @name keyEvents.directive:keyup
*
* @description
* The `keyup` directive allows you to specify custom behavior on a keyup event.
*
* @element ANY
* @param {string} a string representation of an object literal with expressions as keys 
* and keyCode(s) as values
*
* @example
* <input type="text" data-keyup="{ 'doSomething()': 13, 'scopeVar = scopeVar + 1': [9, 5] }" />
*/

/**
* @ngdoc directive
* @name keyEvents.directive:keypress
*
* @description
* The `keypress` directive allows you to specify custom behavior on a keypress event.
*
* @element ANY
* @param {string} a string representation of an object literal with expressions as keys 
* and keyCode(s) as values
*
* @example
* <input type="text" data-keypress="{ 'doSomething()': 13, 'scopeVar = scopeVar + 1': [9, 5] }" />
*/

angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);
