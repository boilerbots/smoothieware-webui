(function () {
    'use strict';

    angular
        .module('smoothieApp')
        .factory('DataService', DataService);

    DataService.$inject = ['$http'];

    function DataService($http) {
        var url = "/command";

        var extruderState = {
            supportEnabled: localStorage.secondExtruderSupportEnabled == "true"
        }

        var output = [];

        var service = {
            runCommand: runCommand,
            registerOutput: registerOutput,
            broadcastCommand: broadcastCommand,
            secondExtruderState: secondExtruderState,
            updateSecondExtruder: updateSecondExtruder
        };

        return service;

        ////////////

        function runCommand(cmd) {
            cmd += "\n";

            var config = {
                headers: {
                    'Content-Type': 'text/plain'
                }
            };
            return $http.post(url, cmd, config)
                .then(function (response) {
                    return response.data;
                });
        }

        function registerOutput(out) {
            output.push(out);
        }

        function broadcastCommand(msg) {
            for (var index = 0; index < output.length; ++index)
                output[index].updateOutput(msg);
        }

        function secondExtruderState() {
             return extruderState;
        }

        function updateSecondExtruder() {
            localStorage.secondExtruderSupportEnabled = extruderState.supportEnabled ? "true" : "false";
        }
    }
})();
