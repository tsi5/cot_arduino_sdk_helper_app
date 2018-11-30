/*
 * Copyright (c) 2018 T-Systems International GmbH. All rights reserved.
 *
 * Project         : IoT Bundle Dev-Kit
 * File created by : eustepha
 * File created on : 2018-05-25
 */


(function () {
    'use strict';

    //Main module name must be defined in ngModules of the plugin manifest
    angular.module('cot.arduionosdkhelper', [])
        .config(['c8yNavigatorProvider', 'c8yViewsProvider',
                 function (c8yNavigatorProvider, c8yViewsProvider) {

                     c8yNavigatorProvider.addNavigation({
                         name: 'Template manager',
                         icon: 'cube',
                         priority: 100000,
                         path: 'templatemanager'
                     });

                     c8yViewsProvider.when('/templatemanager', {
                         templateUrl: ':::PLUGIN_PATH:::/views/index.html',
                         controller: 'smartRestMgmtCtrl'
                     });

                     // Automatically navigate to the Template Manager view.
                     c8yViewsProvider
                         .when('/', {
                             redirectTo: '/templatemanager'
                         });
                 }])

})();
