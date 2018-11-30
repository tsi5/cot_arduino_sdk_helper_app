
/**
 * Constant with Managed-Object type of SmartREST Template collection.
 */
angular.module('cot.arduionosdkhelper').constant('smartRestTemplateType',
    'com_cumulocity_model_smartrest_SmartRestTemplate');


/**
 * @ngdoc service
 * @name cot.arduionosdkhelper.service:sdkHelperSvc
 * @description Service for displaying of alert overlay messages for success, error, info.
 */
angular.module('cot.arduionosdkhelper').factory('sdkHelperSvc', sdkHelperSvc);


/**
 * @ngdoc function
 * @name sdkHelperSvc
 * @description Implementation of the Service above.
 * @param {service} $timeout Timeout operations.
 * @param {service} c8yAlert Displaying alerts to the user.
 */
function sdkHelperSvc(  $q, $http, c8yUser, alertSvc, c8yInventory, c8yQueriesUtil, smartRestTemplateType) {
    'use strict';

    // Class for user data interchange
    // User password/credentials are not accessible.
    function CurrentUser( userName, userTenant) {
        this.userName = userName;
        this.userTenant = userTenant;
    }

    /**
     * @ngdoc function
     * @name getUserData
     * @description  Get user data of the current User.
     * @returns {promise} The desired CurrentUser object.
     */
    function getUserData() {

        // Promise for service-function result
        var deferredUser = $q.defer();

        //c8yUser.detailCurrent().then(function (currentUser) {
        c8yUser.current().then(function (currentUser) {
            console.log('*** getUserData(), currentUser: ', currentUser);

            var currentUserName = currentUser.userName;
            // Dynamically get correct platform-address
            var userAddr = currentUser.self;
            var endPos = userAddr.indexOf("/user/");
            var tenantAddr = userAddr.substr( 0, endPos);

            var userData = new CurrentUser( currentUserName, tenantAddr);
            deferredUser.resolve( userData);
        });

        // Promise for service-function result
        return deferredUser.promise;
    }


    /**
     * @ngdoc function
     * @name listTemplates
     * @description Find desired SmartREST template collection Managed Object.
     * @returns {promise} Desired template if success, null if error.
     */
    function listTemplates() {
        console.log('*** listTemplates()');

        // Promise for service-function result
        var deferredList = $q.defer();
        // Templates data array to return
        var templatesArray = [];

        // Filter works CORRECT !
        var templateFilters = {
            fragmentType: smartRestTemplateType
        };

        c8yInventory.list( templateFilters).then(
            function (templates) {
                // Success handler
                // console.log('### listTemplates(), templates: ', templates);
                console.log('### listTemplates(), Number of templates: ' + templates.length);

                if(templates.length == 0) {
                    alertSvc.addAlertDanger( 'Error: No SmartREST template collections found at this tenant!');
                }

                angular.forEach(templates, function( template) {
                    console.log('## listTemplates(), template: ', template);
                    var templateData = {
                        'id' : template.id,
                        'type' : template.type
                    };

                    templatesArray.push(templateData);
                });

                deferredList.resolve( templatesArray);
            },
            function (errorStatus) {
                // Error handler
                console.error('### listTemplates(), c8yInventory.list() ERROR:: ', errorStatus);
                alertSvc.addAlertDanger( 'Error: ', errorStatus.statusText);
                deferredList.reject(null);
            });

        // Promise for service-function result
        return deferredList.promise;
    }


    /**
     * @ngdoc function
     * @name findTemplate
     * @description Find desired SmartREST template collection Managed Object.
     * @param {string} templateId Managed Object ID of template collection.
     * @returns {promise} Desired template if success, null if error.
     */
    function findTemplate( templateId) {
        console.log('*** findTemplate(), templateId: ' +templateId);
        // Promise for service-function result
        var deferredFind = $q.defer();

        if( (templateId == null) || (templateId.length == 0)) {
            alertSvc.addAlertDanger( 'Enter timplate ID!');

            deferredFind.reject(null);
        }
        else {
            // Filter works CORRECT !?
            var templateFilters = {
                fragmentType: smartRestTemplateType,
                ids: templateId
            };

            //c8yInventory.list( params).then(
            c8yInventory.list( templateFilters).then(
                function (templates) {
                    // Success handler
                    // console.log('### findTemplate(), templates: ', templates);
                    console.log('### findTemplate(), Number of templates: ' + templates.length);

                    if( templates.length == 0) {
                        console.error('### findTemplate(), No template wiht this ID ' + templateId);
                        alertSvc.addAlertDanger( 'No template wiht this ID: ' + templateId);

                        deferredFind.reject(null);
                    }
                    else if( templates.length > 1) {
                        console.error('### findTemplate(), Many templates wiht this ID ' + templateId);
                        alertSvc.addAlertDanger( 'Many templates wiht this ID: ' + templateId);

                        deferredFind.reject(null);
                    }
                    else {
                        // Return only 0-th array element, without square brackets.
                        deferredFind.resolve( templates[0]);
                    }
                },
                function (errorStatus) {
                    // Error handler
                    console.error('### findTemplate(), c8yInventory.list() Error: ', errorStatus);
                    alertSvc.addAlertDanger( 'Error: ', errorStatus.statusText);
                    deferredFind.reject(null);
                });
        }

        // Promise for service-function result
        return deferredFind.promise;
    }


    /**
     * @ngdoc function
     * @name removeTemplate
     * @description Remove certain SmartREST template collection Managed Object.
     * @param {number} templateId Managed Object ID of template collection.
     * @returns {promise} True if success, false if error.
     */
    function removeTemplate( templateId) {
        console.log('*** removeTemplate(), templateId: ', templateId);
        // Promise for service-function result
        var deferredRemove = $q.defer();

        if( (templateId == null) || (templateId.length == 0)) {
            alertSvc.addAlertDanger( 'Enter timplate ID!');

            deferredRemove.reject(false);
        }
        else {
            // Optional Cascade deletion for groups/assets and devices.
            c8yInventory.remove( templateId, {cascade: false}).then(
                function (result) {
                    // Success handler
                    //console.log('### removeTemplate(), result: ', result);

                    alertSvc.addAlertSuccess('Template deleted! ' + result.statusText);
                    deferredRemove.resolve( true);
                },
                function (errorStatus) {
                    // Error handler
                    console.error('### removeTemplate(), c8yInventory.remove() Error: ', errorStatus);
                    // Cumulocity can also display its own Alert danger.
                    alertSvc.addAlertDanger( 'Error: ', errorStatus.statusText);
                    deferredRemove.reject(false);
                });
        }

        // Promise for service-function result
        return deferredRemove.promise;
    }

    /**
     * @ngdoc function
     * @name createNewTemplate
     * @description Publish new SmartREST template collection as Managed Object.
     * @param {string} tmpltName Name for new template collection, as "X-Id".
     * @param {string} tmpltData Content for new template collection, in CSV format.
     * @returns {promise} True if success, false if error.
     */
    function createNewTemplate( tmpltName, tmpltData) {
        console.log('*** createNewTemplate(), tmpltName: ' +tmpltName);
        // Promise for service-function result
        var deferredCreate = $q.defer();

        if (tmpltName.length < 2) {
            alertSvc.addAlertDanger( 'Enter timplate Name ("X-Id")');
            console.error('Error: No Template Name given!');

            deferredCreate.reject(false);
        }
        else if (tmpltData.length < 4) {
            alertSvc.addAlertDanger( 'Enter template CSV data!');
            console.error('Error: No Template Data given!');

            deferredCreate.reject(false);
        }
        else {
            getUserData().then( function (userData) {

                var tenant_base_url = userData.userTenant;
                console.log('call $http(),  tenant_base_url: ' + tenant_base_url);

                $http({
                    url: tenant_base_url+"/s/",
                    method: "POST",
                    async: true, // set to false if you don't mind the page pausing while waiting for response
                    cache: false,
                    headers: {
                        "X-Id": tmpltName
                    },
                    data: tmpltData
                }).then(
                    function success(response) {
                        console.log('### $http POST Success, response: ', response);
                        alertSvc.addAlertSuccess('Template uploaded! ' + response.data);

                        deferredCreate.resolve( true);
                    },
                    function error(response) {
                        console.error('### $http POST Error, response: ', response);
                        alertSvc.addAlertDanger('Upload Error! ' + response.statusText);

                        deferredCreate.reject( false);
                    });
            });
        }

        // Promise for service-function result
        return deferredCreate.promise;
    }


    /* Declare the public functions. */
    return {
        getUserData: getUserData,
        listTemplates: listTemplates,
        findTemplate: findTemplate,
        removeTemplate: removeTemplate,
        createNewTemplate: createNewTemplate
    };
}
