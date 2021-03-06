(function () {
    'use strict';

    angular
        .module('smoothieApp', ['ngRoute', 'ngResource', 'ui.bootstrap', 'gettext', 'ngSanitize', 'xeditable', 'LocalStorageModule', 'ngFileUpload',
            //removeIf(demo)
            /*
            //endRemoveIf(demo)

            'ngMockE2E'

            //removeIf(demo)
            */
            //endRemoveIf(demo)
            ])
        .config(ConfigBlock)
        .run(RunBlock);

    RunBlock.$inject = ['gettextCatalog', 'localStorageService', 'editableOptions', '$httpBackend'];
    ConfigBlock.$inject = ['localStorageServiceProvider'];

    function ConfigBlock(localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('smoothieApp');
    }

    function RunBlock(gettextCatalog, localStorageService, editableOptions, $httpBackend) {
        gettextCatalog.setCurrentLanguage(localStorageService.get('currentLanguage') || 'en');
        gettextCatalog.debug = true;

        editableOptions.theme = 'bs3';
        editableOptions.activate = 'select';

        //removeIf(demo)
        /*
        //endRemoveIf(demo)
        var heaterT0SelectedTemp = 0;
        var heaterT1SelectedTemp = 0;
        var bedSelectedTemp = 0;

        var heaterT0ActualTemp = 30;
        var heaterT1ActualTemp = 25;
        var bedActualTemp = 22;

        $httpBackend.when('POST', '/command').respond(function (method, url, data) {
            //console.log('Received these data:', method, url, data);

            var result = "ok";
            data = data.replace(/(\r\n|\n|\r)/gm, "");
            var rand;

            if (data == "M105") {
                heaterT0ActualTemp = getRandomValue("T0");
                heaterT1ActualTemp = getRandomValue("T1");
                bedActualTemp = getRandomValue("bed");

                result = "ok T0:" + heaterT0ActualTemp + " /" + heaterT0SelectedTemp + "@0 ";
                result += "T1:" + heaterT1ActualTemp + " /" + heaterT1SelectedTemp + "@0 ";
                result += "B:" + bedActualTemp + " /" + bedSelectedTemp + "@0 ";
                result += "P:29.7 /0.0 @0\n";
            } else if (data == "M20") {
                rand = Math.floor((Math.random() * 2) * 10 + 1);

                result = "Begin file list\n" +
                    "config.txt\n" +
                    "web\n" +
                    "web2\n" +
                    "demo_test" + (rand + 2) + ".gcode\n" +
                    "demo_test" + (rand - 2) + ".gcode\n" +
                    "demo_test" + (rand + 3) + ".gcode\n" +
                    "End file list\n" +
                    "ok";
            } else if (data.indexOf("M104") > -1 || data.indexOf("M140") > -1) {
                var regex;
                var regexResult;
                if (data.indexOf("M104") > -1) {
                    if (data.indexOf("T1")) {
                        regex = /M104 S(.*) T(.*)/gi;
                        regexResult = regex.exec(data);
                        if (regexResult[2] == "0") {
                            heaterT0SelectedTemp = Number(regexResult[1]).toFixed(1);
                        } else {
                            heaterT1SelectedTemp = Number(regexResult[1]).toFixed(1);
                        }
                    }
                } else {
                    regex = /M140 S(.*)/gi;
                    regexResult = regex.exec(data);
                    bedSelectedTemp = Number(regexResult[1]).toFixed(1);
                }
            } else if (data == "progress") {
                result = "Nothing is printed";
            } else if (data == "abort") {
                result = "Abort! Abort!";
            }


            return [200, result, {}];
        });

        function getRandomValue(target) {
            var min;
            var max;

            if (target == "bed") {
                min = 30;
                max = 32;
            } else {
                min = 200;
                max = 210;
            }

            var result = Math.random() * (max - min + 1) + min;
            return result.toFixed(1);
        }

        $httpBackend.whenGET(/^img\//).passThrough();
        //removeIf(demo)
        */
        //endRemoveIf(demo)
    }
})();
