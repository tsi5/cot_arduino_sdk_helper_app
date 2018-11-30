
angular.module('cot.arduionosdkhelper').controller('smartRestMgmtCtrl', smartRestMgmtCtrl);

function smartRestMgmtCtrl($scope, $rootScope, $q, c8yInventory, c8yMeasurements, $filter, c8yBase,
                           alertSvc, sdkHelperSvc, c8yAlert) {
    'use strict';

    $scope.templateID;
    $scope.templateContent = '...'
    $scope.templateId2Delete;
    $scope.tmpltName = '';
    $scope.tmpltData = '...';

    /**
     * @description List template collections, available on this tenant.
     */
    $scope.listTemplates = function() {
        console.log('+++ listTemplates()');

        sdkHelperSvc.listTemplates().then(
            function (templates) {
                // Handle your successful response here
                console.log('getTemplate() Success: ', templates); // FIXME: Comment out !

                var output="<ul>";

                angular.forEach(templates, function( template) {
                    output += "<li>" + template.id + ",  " + template.type + "</li>";
                });
                output += "</ul>";

                $('#templatesList').html(output);
            },
            // Error handler
            function (error) {
                console.error('listTemplates() Error');
            });
    }


    /**
     * @description Display template collection with given ManagedObject ID.
     */
    $scope.getTemplate = function() {
        console.log('+++ getTemplate(), templateID: ', $scope.templateID);

        sdkHelperSvc.findTemplate( $scope.templateID).then(
            function (data) {
                // Handle your successful response here
                //console.log('getTemplate() Success: ' + JSON.stringify(data, null, '  '));
                $scope.templateContent = JSON.stringify(data, null, '  ');
            },
            // Error handler
            function (error) {
                console.error('getTemplate() Error: ', error);
            });
    }


    /**
     * @description Delete template collection with given ManagedObject ID.
     */
    $scope.deleteTemplate = function() {
        console.log('+++ deleteTemplate(), templateId2Delete: ', $scope.templateId2Delete);

        sdkHelperSvc.removeTemplate( $scope.templateId2Delete).then(
            function (result) {
                // Handle your response here
                console.log('deleteTemplate() result: ' + result); // FIXME: Comment out !
            },
            // Error handler
            function (error) {
                console.error('deleteTemplate() Error: ', error);
            });
    }


    /**
     * @description POST new SmartREST template collection for current tenant.
     */
    $scope.postNewTemplate = function() {
        console.log('+++ postNewTemplate()  tmpltName: ' + $scope.tmpltName);
        //console.log('+++  tmpltData: ' + $scope.tmpltData);

        sdkHelperSvc.createNewTemplate( $scope.tmpltName, $scope.tmpltData).then(
            function ( result) {
                // Handle your response here
                console.log('postNewTemplate() result: ' + result); // FIXME: Comment out !
            },
            // Error handler
            function (error) {
                console.error('postNewTemplate() Error: ', error);
            });
    }

}
