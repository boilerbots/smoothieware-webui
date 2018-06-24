(function () {
    'use strict';

    angular
        .module('smoothieApp')
        .controller('HeaderCtrl', HeaderCtrl);

    HeaderCtrl.$inject = ['gettextCatalog'];

    function HeaderCtrl(gettextCatalog) {
        var vm = this;

        vm.printerName = localStorage.printerName || 'Your printer name';

        // Language switcher
        vm.languages = {
            current: gettextCatalog.currentLanguage,
            available: {
                //'de': 'German',
                'en': 'English',
                'pl': 'Polski'
            }
        };

        vm.setLanguage = setLanguage;
        vm.updatePrinterName = updatePrinterName;

        ////////////////

        function setLanguage(item) {
            vm.languages.current = item;
            gettextCatalog.setCurrentLanguage(item);
            localStorage.currentLanguage = vm.languages.current;
        }

        function updatePrinterName() {
            localStorage.printerName = vm.printerName;
        }
    }
})();
