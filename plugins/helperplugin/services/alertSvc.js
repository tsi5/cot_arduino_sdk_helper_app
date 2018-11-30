
/**
 * @ngdoc service
 * @name cti.pocAntitheftDeviceSimulator.service:alertSvc
 * @description Service for displaying of alert overlay messages for success, error, info.
 */
angular.module('cot.arduionosdkhelper').factory('alertSvc', alertSvc);


/**
 * @ngdoc function
 * @name alertSvc
 * @description Implementation of the Service above.
 * @param {service} $timeout Timeout operations.
 * @param {service} c8yAlert Displaying alerts to the user.
 */
function alertSvc( $timeout, c8yAlert) {
    'use strict';

    /**
     * @ngdoc object
     * @name alertInformation
     * @description Definition of alert overlay context object.
     */
    var alertInformation = {

        alertCommon : {
            text: 'An error happened',
            type: 'danger'
        }
    };

    /**
     * @description Function for displaying the success alert overlay.
     * @param {string} alertText  The success message text.
     */
    function addAlertSuccess (alertText) {

        // Try simple method, because .add() doesn't work well.
       // c8yAlert.success( alertText);

        c8yAlert.remove( alertInformation.alertCommon);

        alertInformation.alertCommon.text = alertText;
        alertInformation.alertCommon.type = 'success';
        c8yAlert.add(alertInformation.alertCommon);
        $timeout(angular.bind({}, c8yAlert.remove, alertInformation.alertCommon), Constants.DEFAULT_HIDE_DELAY);
    }

    /**
     * @description Function for displaying the error alert overlay.
     * @param {string} alertText  The error message text.
     */
    function addAlertDanger (alertText) {

        // Try simple method, because .add() doesn't work well.
       // c8yAlert.danger( alertText);

        c8yAlert.remove( alertInformation.alertCommon);

        alertInformation.alertCommon.text = alertText;
        alertInformation.alertCommon.type = 'danger';
        c8yAlert.add(alertInformation.alertCommon);
        $timeout(angular.bind({}, c8yAlert.remove, alertInformation.alertCommon), Constants.DEFAULT_ERROR_DELAY);
    }

    /**
     * @description Function for displaying the info alert overlay.
     * @param {string} alertText  The info message text.
     */
    function addAlertInfo (alertText) {

        // Try simple method, because .add() doesn't work well.
       // c8yAlert.info( alertText);

        c8yAlert.remove( alertInformation.alertCommon);

        alertInformation.alertCommon.text = alertText;
        alertInformation.alertCommon.type = 'info';
        // Show permanent without timeout
        c8yAlert.add(alertInformation.alertCommon);
    }

    /**
     * @description Function for reset the alert overlay.
     */
    function removeAlert () {

        // Try simple method.
       // c8yAlert.clearAll();

        c8yAlert.remove(alertInformation.alertCommon);
    }


    /* Declare the public functions. */
    return {
        addAlertSuccess: addAlertSuccess,
        addAlertDanger: addAlertDanger,
        addAlertInfo: addAlertInfo,
        removeAlert: removeAlert
    };
}
