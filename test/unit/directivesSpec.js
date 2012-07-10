'use strict';

/* jasmine specs for directives go here */

//describe('directives', function() {
//  beforeEach(module('myApp.directives'));
//
//  describe('app-version', function() {
//    it('should print current version', function() {
//      module(function($provide) {
//        $provide.value('version', 'TEST_VER');
//      });
//      inject(function($compile, $rootScope) {
//        var element = $compile('<span app-version></span>')($rootScope);
//        expect(element.text()).toEqual('TEST_VER');
//      });
//    });
//  });
//});

/**
* Triggers a browser event. Attempts to choose the right event if one is
* not specified.
*
* @param {Object} element Either a wrapped jQuery/jqLite node or a DOMElement
* @param {string} type Optional event type.
* @param {Array.<string>=} keys Optional list of pressed keys
* (valid values: 'alt', 'meta', 'shift', 'ctrl')
*/
function simulateKeyEvent(element, type, keycode, keys) {
  if (element && !element.nodeName) element = element[0];

  keys = keys || [];
  function pressed(key) {
    return keys.indexOf(key) !== -1;
  }

  var evnt = document.createEvent('KeyboardEvent'),
      originalPreventDefault = evnt.preventDefault,
      appWindow = window,
      fakeProcessDefault = true,
      finalProcessDefault;

  // igor: temporary fix for https://bugzilla.mozilla.org/show_bug.cgi?id=684208
  appWindow.angular['ff-684208-preventDefault'] = false;
  evnt.preventDefault = function() {
    fakeProcessDefault = false;
    return originalPreventDefault.apply(evnt, arguments);
  };

  evnt.initKeyboardEvent(
      type,             //  in DOMString typeArg,
      true,             //  in boolean canBubbleArg,                                                        
      true,             //  in boolean cancelableArg,                                                       
      null,             //  in nsIDOMAbstractView viewArg,  Specifies UIEvent.view. This value may be null.     
      pressed('ctrl'),  //  in boolean ctrlKeyArg,                                                               
      pressed('alt'),   //  in boolean altKeyArg,                                                        
      pressed('shift'), //  in boolean shiftKeyArg,                                                      
      pressed('meta'),  //  in boolean metaKeyArg,                                                       
      keycode,          //  in unsigned long keyCodeArg,                                                      
      0);               //  in unsigned long charCodeArg);

  element.dispatchEvent(evnt);
  finalProcessDefault = !(appWindow.angular['ff-684208-preventDefault'] || !fakeProcessDefault);

  delete appWindow.angular['ff-684208-preventDefault'];

  return finalProcessDefault;
}

describe('keyEvents', function() {
  var element;

  beforeEach(module('directives.keyEvents'));

  describe('keydown', function() {
    it('should get called for a single key code', inject(function($compile, $rootScope) {
      var element = $compile('<div keydown="{ \'thing=true\': 13 }"></div>')($rootScope);
      expect($rootScope.thing).toBeFalsy();

      simulateKeyEvent(element, 'keydown', 13);
      expect($rootScope.thing).toEqual(true);
    }));

    //it('should get called for multiple key codes', inject(function($compile, $rootScope) {
    //  var element = $compile('<div keydown="{ \'thing=!thing\': [13, 24] }"></div>')($rootScope);
    //  expect($rootScope.thing).toBeFalsy();

    //  simulateKeyEvent(element, 'keydown', 13);
    //  expect($rootScope.thing).toEqual(true);

    //  simulateKeyEvent(element, 'keydown', 24);
    //  expect($rootScope.thing).toEqual(false);
    //}));
  });
});

