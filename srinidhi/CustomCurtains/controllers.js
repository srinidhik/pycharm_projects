var curtains = angular.module('curtainsController', []);

curtains.controller('curtainsController', ['$scope', '$http', '$timeout', '$compile', '$state', '$stateParams', '$rootScope',
    function ($scope, $http, $timeout, $compile, $state, $stateParams, $rootScope) {

        if (document.location.href.indexOf('custom-curtains') == -1) {
            document.location.href = "/custom-curtains/#/";
        }

        $rootScope.hardwareCategoriesList = [];

        $rootScope.showNavItems = false;
        $rootScope.dimensions = {
            'widthFeet': '6',
            'widthInch': '1',
            'heightFeet': '7',
            'heightInch': '0'
        };
        $rootScope.selectedHardwareList = [];
        $rootScope.selectedLining = null;
        $rootScope.selectedMount = null;
        $rootScope.selectedLift = null;
        $rootScope.numberOfCurtains = 2;
        $rootScope.totalCost = 0;
        $rootScope.requestId = 0;
        $rootScope.singleCurtainWidth = null;
        $rootScope.curtainType = 'custom dimensions';

        $rootScope.isDefaultWidth = true;
        $rootScope.quantity = 2;

        $rootScope.filterNameIndexMap = {};
        $rootScope.samplesList = [];

        $rootScope.styleMap = {};
        $rootScope.selectedStyle = null;
        $rootScope.curtainTypeName = null;
        $rootScope.selectedCurtain = null;
        $rootScope.getFabricPrice = null;
        $rootScope.liningInformation = null;
        $rootScope.mountInformation = null;
        $rootScope.liftInformation = null;
        $rootScope.selectedHardware = null;
        $rootScope.searchFlag = false;
        $rootScope.sortByInputs = null;

        assignOptionId();
        getCategoryId();
        getData();
        getSamples();

        function assignOptionId() {
            $http({
                method: 'GET',
                url: '/api/custom-curtains/get-option-id',
                params: {}
            }).then(function successCallback(response) {
                var optionsIds = response.data;
                $rootScope.fabricOptionId = optionsIds.fabrics;
                $rootScope.shadeFabricOptionId = optionsIds.shadeFabric;
                $rootScope.curtainLiningOptionId = optionsIds.lining;
                $rootScope.shadeLiningOptionId = optionsIds.shadeLining;
                $rootScope.mountOptionId = optionsIds.mount;
                $rootScope.liftOptionId = optionsIds.lift;
            }, function errorCallback(error) {
                defaultThemeDialog(error.data);
            })
        }

        function getCategoryId() {
            $http({
                method: 'GET',
                url: '/api/custom-curtains/get-category-id',
                params: {}
            }).then(function successCallBack(response) {
                var categoriesIds = response.data;
                $rootScope.productCategoryId = categoriesIds.curtains["id"].toString();
                $rootScope.hardwareCategoriesList.push(categoriesIds['hardware-sets']);
                $rootScope.hardwareCategoriesList.push(categoriesIds.finials);
                $rootScope.hardwareCategoriesList.push(categoriesIds.brackets);
                $rootScope.hardwareCategoriesList.push(categoriesIds.rings);
                $rootScope.hardwareCategoriesList.push(categoriesIds['hold-backs']);
                $rootScope.hardwareCategoriesList.push(categoriesIds.rod);
            }, function errorCallBack(error) {
                defaultThemeDialog(error.data);
            })
        }

        function getData() {
            ajaxindicatorstart("");
            $http({
                method: 'GET',
                url: '/api/custom-curtains/get-curtain-types',
                params: {'productCategoryId': $rootScope.productCategoryId}
            }).then(function successCallback(response) {
                ajaxindicatorstop();
                $rootScope.listOfCurtains = response.data;

                for (var i = 0; i < $rootScope.listOfCurtains.length; i++) {
                    $rootScope.styleMap[$rootScope.listOfCurtains[i].name.toUpperCase()] = i;
                }

            }, function errorCallback(error) {
                defaultThemeDialog(error.data);
            })
        }

        $rootScope.getCost = function () {
            $rootScope.selectedCurtainFlag = false;
            var curtainTypeOptionId = $rootScope.curtainTypeName == 'curtain' ? $rootScope.fabricOptionId : $rootScope.shadeFabricOptionId;
            var optionsData = getProductData();
            optionsData["requestId"] = $scope.requestId + 1;
            $scope.requestId = $scope.requestId + 1;

            $http({
                method: 'POST',
                url: '/api/custom-curtains/get-cost',
                data: {'optionsData': optionsData, 'optionId': curtainTypeOptionId},
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': kustome.getCookie('csrftoken')
                }
            }).then(function successCallback(response) {
                $scope.getCostResult = response.data.result;
                $rootScope.getFabricPrice = $scope.getCostResult.price;
                $rootScope.getHardwarePrice = $scope.getCostResult.hardwarePrice;
                $rootScope.totalCost = $scope.getFabricPrice + $rootScope.getHardwarePrice;
                $rootScope.numberOfCurtains = $scope.getCostResult.quantity;
            }, function errorCallback(error) {
                defaultThemeDialog(error.data.detail ? error.data.detail : error.data);
            })
        };

        function getSelectedHardware() {
            var selectedHardwareDict = {};

            if ($rootScope.selectedHardwareList.length > 0) {
                for (var i = 0; i < $rootScope.selectedHardwareList.length; i++) {
                    var selectedHardware = $rootScope.selectedHardwareList[i];
                    selectedHardwareDict[selectedHardware.id] = {
                        'skuId': selectedHardware.skuid,
                        'name': selectedHardware.name,
                        'material': selectedHardware.material,
                        'categoryId': selectedHardware.productCategory.toString(),
                        'id': selectedHardware.id.toString(),
                        'displayImage': selectedHardware.displayImage,
                        'quantity': parseInt(selectedHardware.quantity),
                        'price': selectedHardware.price
                    };
                }
            }

            return selectedHardwareDict;
        }

        function getOptionsData() {
            var curtainTypeOptionId = $rootScope.curtainTypeName == 'curtain' ? $rootScope.fabricOptionId : $rootScope.shadeFabricOptionId;
            var optionsDict = {};

            optionsDict[curtainTypeOptionId] = $rootScope.selectedCurtain.id.toString();

            if ($scope.curtainTypeName == 'shade') {
                optionsDict[$scope.liningOptionId] = $rootScope.selectedLining ? $rootScope.selectedLining.id.toString() : "15";
                optionsDict[$scope.mountOptionId] = $rootScope.selectedMount ? $rootScope.selectedMount.id.toString() : "21";
                optionsDict[$scope.liftOptionId] = $rootScope.selectedLift ? $rootScope.selectedLift.id.toString() : "16";
            } else {
                optionsDict[$scope.liningOptionId] = $rootScope.selectedLining ? $rootScope.selectedLining.id.toString() : "11";
            }

            return optionsDict;
        }

        function calculateDimension(valueInFeet, valueInInches) {
            var totalValueInInches = Math.ceil((parseInt(valueInFeet) * 12) + parseInt(valueInInches));

            if ($scope.curtainTypeName == 'shade' && $scope.selectedMount && $scope.selectedMount.name == "Outside") {
                totalValueInInches = totalValueInInches + 4
            }

            return totalValueInInches;
        }

        $rootScope.removeHardwareSetsBasedOnWidth = function () {
            var temp_array = [];
            for (var i = 0; i < $rootScope.selectedHardwareList.length; i++) {
                if (!('HARDWARE-SETS' == $rootScope.selectedHardwareList[i]['category'])) {
                    temp_array.push($rootScope.selectedHardwareList[i]);
                }
            }
            $rootScope.selectedHardwareList = temp_array;
            $rootScope.getCost();
        };

        function getProductData() {
            var fullnessHeight = $rootScope.curtainTypeName == 'curtain' ? '' : $rootScope.selectedStyle ? $rootScope.selectedStyle.fullness_height : '';

            return {
                'assemblyId': $rootScope.selectedStyle ? $rootScope.selectedStyle.assembly.toString() : null,
                'category': "curtain",
                'cost': $rootScope.totalCost,
                'dimensionType': $rootScope.curtainType,
                'fullness': $rootScope.selectedStyle ? $rootScope.selectedStyle.fullness_ratio : null,
                'fullnessHeight': fullnessHeight,
                'fullnessWidth': $rootScope.selectedCurtain.width,
                'hardware': getSelectedHardware(),
                'height': calculateDimension($rootScope.dimensions.heightFeet, $rootScope.dimensions.heightInch),
                'name': $rootScope.selectedStyle ? $rootScope.selectedStyle.name : null,
                'numberOfCurtains': parseInt($rootScope.numberOfCurtains),
                'options': getOptionsData(),
                'price': $rootScope.totalCost,
                'productCategory': $rootScope.productCategoryId,
                'productId': $rootScope.selectedStyle.id.toString(),
                'productType': $rootScope.curtainTypeName,
                'quantity': 1,
                'width': calculateDimension($rootScope.dimensions.widthFeet, $rootScope.dimensions.widthInch)
            };
        }

        function getDefaultObject(listOfObjects) {
            for (var i = 0; i < listOfObjects.length; i += 1) {
                if (listOfObjects[i]['isDefault'] === 'True') {
                    return listOfObjects[i];
                }
            }
        }

        function getOptionInformation() {
            $http({
                method: 'GET',
                url: '/api/custom-curtains/get-lining-information',
                params: {
                    'productCategoryId': $rootScope.productCategoryId,
                    'liningOptionId': $rootScope.liningOptionId,
                    'mountOptionId': $rootScope.mountOptionId,
                    'liftOptionId': $rootScope.liftOptionId
                }
            }).then(function successCallback(response) {
                $rootScope.liningInformation = response.data.response_data_lining;
                $rootScope.mountInformation = response.data.response_data_mount;
                $rootScope.liftInformation = response.data.response_data_lift;

                $rootScope.selectedLining = getDefaultObject($rootScope.liningInformation);

                if ($scope.mountInformation) {
                    $rootScope.selectedMount = getDefaultObject($rootScope.mountInformation);
                    $rootScope.selectedLift = getDefaultObject($rootScope.liftInformation);
                }
            }, function errorCallback(error) {
                defaultThemeDialog(error.data);
            })
        }

        $scope.$watch(function () {
            return $rootScope.curtainTypeName;
        }, function (newValue, oldValue) {
            if (newValue !== oldValue) {
                getOptionInformation();
            }
        });

        $rootScope.setCurtainType = function (name) {
            var index = $rootScope.styleMap[name.toUpperCase()];
            $rootScope.selectedStyle = $rootScope.listOfCurtains[index];
            getSelectedTypeDetails();
        };


        $rootScope.getDetailsBySkuId = function () {
            ajaxindicatorstart('');
            $http({
                method: 'GET',
                url: '/api/custom-curtains/get-filter-data',
                params: {
                    'searchBySkuId': $stateParams.skuid,
                    'optionId': $stateParams.type,
                    'curtainStyleId': $rootScope.productId,
                    'productCategoryId': $rootScope.productCategoryId
                }
            }).then(function successCallback(response) {
                $rootScope.selectedCurtain = (response.data.data)[0];
                ajaxindicatorstop();
            }, function errorCallback(error) {
                ajaxindicatorstop();
                defaultThemeDialog(error.data);
            });
        };

        $rootScope.setSelectedCurtain = function (name, searchBySkuIdFlag) {

            searchBySkuIdFlag = searchBySkuIdFlag == undefined ? true : searchBySkuIdFlag;

            if (!$rootScope.selectedCurtain) {
                $scope.$watch(function () {
                    return ($rootScope.productCategoryId && $rootScope.listOfCurtains);
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $rootScope.setCurtainType(name);
                        if (searchBySkuIdFlag) {
                            $rootScope.getDetailsBySkuId();
                        }
                    }
                })
            }
        };

        // onclick zoom

        $scope.zoomOnClick = function (item) {
            $scope.zoomImageDetails = {
                'imageSrc': '',
                'name': '',
                'composition': '',
                'material': '',
                'pattern': '',
                'color': '',
                'GSM': '',
                'SKUID': ''
            };

            $scope.zoomImageDetails.imageSrc = item.images[1] + '_zoom';
            $scope.zoomImageDetails.name = item.displayName;
            $scope.zoomImageDetails.composition = item.material;
            $scope.zoomImageDetails.material = item.material_filter[0];
            $scope.zoomImageDetails.pattern = item.pattern_filter[0];
            $scope.zoomImageDetails.color = item.color_filter[0];
            $scope.zoomImageDetails.GSM = item.gsm;
            $scope.zoomImageDetails.SKUID = item.skuid;

            var img_id = "#modalZoomImage";
            var url = $scope.zoomImageDetails.imageSrc;
            if (url) {
                if (url.indexOf('https') == -1) {
                    url = url.replace('http', 'https');
                }
            }
            $(img_id).attr('src', url);

            var onOpen = function () {
                $('.jconfirm-content').find(img_id).elevateZoom({
                    zoomType: "inner",
                    cursor: "crosshair",
                    appendTo: '.jconfirm'
                });
            };

            $timeout(function () {
                defaultThemeDialog($('#showZoomImage').html(), 80, '', onOpen);
            }, 10);

        };

        // onclick zoom end

        // samples

        $scope.$watch(function () {
            return window.kustome.myAccount.accountMail;
        }, function (newValue, oldValue) {
            if (newValue !== oldValue) {
                $http({
                    method: 'GET',
                    url: '/api/custom-curtains/merge-samples',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': kustome.getCookie('csrftoken')
                    }
                }).then(function successCallback(response) {
                    $rootScope.samplesList = response.data.result;
                    $scope.samplesIdList = Object.keys($rootScope.samplesList);
                    $scope.samplesCount = $scope.samplesIdList.length;
                }, function errorCallback(error) {
                    defaultThemeDialog(error.data);
                });
            }
        });

        function getSamples() {
            $http({
                method: 'GET',
                url: '/api/custom-curtains/get-samples',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': kustome.getCookie('csrftoken')
                }
            }).then(function successCallback(response) {
                $rootScope.samplesList = response.data;
                $scope.samplesIdList = Object.keys($rootScope.samplesList);
                $scope.samplesCount = $scope.samplesIdList.length;
            }, function errorCallback(error) {
                defaultThemeDialog(error.data);
            });
        }

        $scope.addToSampleList = function (selectedSample) {
            var optionDetails = $rootScope.getSelectedProductOptionDetails(selectedSample);
            ajaxindicatorstart('Adding Sample...');

            $http({
                method: 'POST',
                url: '/api/custom-curtains/add-sample',
                data: {'samples': optionDetails},
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': kustome.getCookie('csrftoken')
                }
            }).then(function successCallback(response) {
                $rootScope.samplesList = response.data;
                $scope.samplesIdList = Object.keys($rootScope.samplesList);
                $scope.samplesCount = $scope.samplesIdList.length;
                ajaxindicatorstop();
            }, function errorCallback(error) {
                ajaxindicatorstop();
                defaultThemeDialog(error.data);
            });
        };

        $scope.removeSample = function (selectedSample) {
            ajaxindicatorstart('Removing Sample...');
            $http({
                method: 'POST',
                url: '/api/custom-curtains/remove-sample',
                data: {'sample': selectedSample.optionId},
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': kustome.getCookie('csrftoken')
                }
            }).then(function successCallback(response) {
                $rootScope.samplesList = response.data;
                $scope.samplesIdList = Object.keys($rootScope.samplesList);
                $scope.samplesCount = $scope.samplesIdList.length;
                ajaxindicatorstop();
            }, function errorCallback(error) {
                ajaxindicatorstop();
                defaultThemeDialog(error.data);
            })
        };

        $scope.orderSamples = function () {
            if ($scope.samplesCount <= 15) {
                ajaxindicatorstart('Adding to cart...');
                $http({
                    method: 'POST',
                    url: '/api/custom-curtains/delete-samples',
                    data: {},
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': kustome.getCookie('csrftoken')
                    }
                }).then(function successCallback() {
                    var fabricSampleList = [];

                    angular.forEach($rootScope.samplesList, function (each) {
                        var fabricData = {};
                        fabricData['id'] = each.optionId;
                        fabricData['image'] = each.optionDisplayImage;
                        fabricData['name'] = each.optionName;
                        fabricData['skuId'] = each.skuId;
                        fabricSampleList.push(fabricData);
                    });

                    var sampleDetails = {};
                    sampleDetails['quantity'] = 1;
                    sampleDetails['cost'] = 100;
                    sampleDetails['category'] = 'curtainSamples';
                    sampleDetails['price'] = 100;
                    sampleDetails['productId'] = $scope.productCategoryId;
                    sampleDetails['name'] = 'Sample Fabrics';
                    sampleDetails['sampleFabrics'] = fabricSampleList;
                    sampleDetails['image'] = fabricSampleList[0]['image'];

                    ajaxindicatorstop();

                    window.cart.addAllToCart([sampleDetails], function () {
                    });

                }, function errorCallback(error) {
                    ajaxindicatorstop();
                    defaultThemeDialog(error.data);
                });
            } else {
                defaultThemeDialog('You can order only 15 sample fabrics at a time.<br><br> Please check and remove the excess.', 40, '', '', 'orange')
            }
        };

        // samples end

        // filters

        $scope.$watch(function () {
            return $rootScope.selectedStyle;
        }, function (newValue, oldValue) {
            if (newValue !== oldValue) {
                $rootScope.selectedCurtainFlag = true;

                $rootScope.selectedFilter = {
                    'color': [],
                    'material': [],
                    'pattern': []
                };

                $rootScope.sortByDict = {
                    'sortBy': null
                };

                $rootScope.searchByIdDict = {
                    'searchById': null
                };

                emptyFilterList();
                getFilterInputs();

            }
        });

        $rootScope.emptyFilterList = emptyFilterList;

        function emptyFilterList() {
            $rootScope.filterOptionIdList = [];
        }

        function getFilterListByName(data, filterName, key) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].name == filterName) {
                    $rootScope.filterNameIndexMap[key] = data[i].id;
                    return data[i]['sub_groups'];
                }
            }
        }

        function getFilterInputs() {
            $http({
                method: 'GET',
                url: '/api/custom-curtains/get-filter-inputs',
                params: {'optionId': $scope.curtainTypeName, 'productCategoryId': $scope.productCategoryId}
            }).then(function successCallback(response) {
                $rootScope.filterByColorList = getFilterListByName(response.data, 'colors', 'COLORS');
                $rootScope.filterByMaterialList = getFilterListByName(response.data, 'material', 'MATERIALS');
                $rootScope.filterByPatternList = getFilterListByName(response.data, 'pattern', 'PATTERN');
                $rootScope.sortByInputs = response.data[response.data.length - 1]['sortInput'];
                $rootScope.sortByDict.sortBy = $rootScope.sortByInputs[0].value;
            }, function errorCallback(error) {
                defaultThemeDialog(error.data);
            })
        }

        // filters end

        // hardware

        $rootScope.removeThisHardware = function (hardwareId) {
            for (var j = 0; j < $rootScope.selectedHardwareList.length; j++) {
                if (hardwareId == $rootScope.selectedHardwareList[j].id) {
                    $rootScope.selectedHardwareList[j]['quantity'] = 0;

                    var indexOfHardware = $rootScope.selectedHardwareList.indexOf($rootScope.selectedHardwareList[j]);
                    $rootScope.selectedHardwareList.splice(indexOfHardware, 1);
                }
            }
            $rootScope.getCost();
        };

        // hardware end

        // add to cart

        function getSelectedTypeDetails() {
            $rootScope.curtainTypeName = $rootScope.selectedStyle.type;
            $rootScope.productId = $rootScope.selectedStyle.id;
            $rootScope.productName = $rootScope.selectedStyle.name;
            $rootScope.productFullness = $rootScope.selectedStyle.fullness_ratio;
            $rootScope.fullnessHeight = $rootScope.curtainTypeName == 'curtain' ? '' : $rootScope.selectedStyle ? $rootScope.selectedStyle.fullness_height : '';
            $rootScope.assemblyId = $rootScope.selectedStyle.assembly;
            $rootScope.liningOptionId = $rootScope.curtainTypeName == 'curtain' ? $rootScope.curtainLiningOptionId : $rootScope.shadeLiningOptionId;
        }

        function getSelectedProductOptionDetails(element) {
            var optionDetails = {};

            optionDetails['optionId'] = element.id.toString();
            optionDetails['optionName'] = element.displayName;
            optionDetails['optionDisplayImage'] = element.displayImage;
            optionDetails['optionImage'] = element.displayImage;
            optionDetails['optionSetCategory'] = element.setCategory;
            optionDetails['optionMaterial'] = element.material;
            optionDetails['optionWorkingImage'] = element.workingImage;
            optionDetails['fullnessWidth'] = element.width;
            optionDetails['skuId'] = element.skuid;
            optionDetails['gsm'] = element.gsm;
            optionDetails['deliveryTime'] = element.deliveryTime;

            return optionDetails;
        }

        $rootScope.getSelectedProductOptionDetails = getSelectedProductOptionDetails;

        function updateOptions() {
            var optionDetails = getSelectedProductOptionDetails($scope.selectedCurtain);
            $scope.options = {};
            $scope.selectedFabricOptions = {};
            $scope.productOption = '';

            if ($scope.curtainTypeName == 'curtain') {
                $scope.options[$scope.fabricOptionId] = optionDetails['optionId'];
                $scope.selectedFabricOptions['fabric'] = optionDetails;
                $scope.productOption = 'fabric';
            }
            else {
                $scope.options[$scope.shadeFabricOptionId] = optionDetails['optionId'];
                $scope.selectedFabricOptions['shadeFabric'] = optionDetails;
                $scope.productOption = 'shadeFabric';
            }
        }

        function getOptionalOptions() {
            var optionalOptions = [];
            var lining = {
                "category": $scope.selectedLining.optionId.toString(),
                "id": $scope.selectedLining.id.toString(),
                "name": $scope.selectedLining.name,
                "optionName": $scope.selectedLining.optionName
            };
            optionalOptions.push(lining);

            if ($scope.curtainTypeName == 'shade') {
                var mount = {
                    "category": $scope.selectedMount.optionId.toString(),
                    "id": $scope.selectedMount.id.toString(),
                    "name": $scope.selectedMount.name,
                    "optionName": $scope.selectedMount.optionName
                };

                var lift = {
                    "category": $scope.selectedLift.optionId.toString(),
                    "id": $scope.selectedLift.id.toString(),
                    "name": $scope.selectedLift.name,
                    "optionName": $scope.selectedLift.optionName
                };

                optionalOptions.push(mount);
                optionalOptions.push(lift);
            }

            return optionalOptions;
        }

        $rootScope.setNoOfCurtains = function () {
            if ($scope.curtainType != 'custom dimensions' || $scope.isDefaultWidth) {
                var cmToInch = 0.3937;
                var defaultNumberOfCurtains = 1;
                var curtainFullnessInches = Math.round($scope.selectedCurtain.width * cmToInch);
                var totalWidth = defaultNumberOfCurtains * curtainFullnessInches;
                $scope.singleCurtainWidth = totalWidth / $scope.productFullness;
                if ($scope.curtainTypeName == 'shade') {
                    $scope.singleCurtainWidth = 90;
                }
                $scope.panelWidth = ($scope.singleCurtainWidth / 12).toFixed(1);
            }
        };


        $scope.curtainAddToCart = function () {
            if ($scope.dimensions['widthFeet'] && $scope.dimensions['heightFeet']) {
                addToCart();
            }
        };

        function addToCart() {
            getSelectedProductOptionDetails($scope.selectedCurtain);
            updateOptions();

            var productData = getProductData();
            productData['optionalOptions'] = getOptionalOptions();
            productData['optionDetails'] = {};
            productData['optionDetails']['fabric'] = $scope.selectedFabricOptions[$scope.productOption];
            productData['quantityPerSet'] = null;
            productData['deliveryTime'] = $scope.selectedFabricOptions[$scope.productOption]['deliveryTime'];
            productData['image'] = $scope.selectedCurtain.images[0];
            window.cart.addAllToCart([productData], function () {
            });
        }


        // cart end


        $rootScope.selectedItem = function (selectedItemObject) {
            $rootScope.selectedCurtain = selectedItemObject;
            $rootScope.goToDimensions();
        };

        $scope.goToStyles = function () {
            $rootScope.selectedNavItem = 'styles';
            $state.go('styles');
        };

        $rootScope.goToFabric = function () {
            if ($rootScope.searchFlag) {
                goToSearchState();
            } else {
                goToFabricState();
            }
        };

        $rootScope.goToFabricState = goToFabricState;

        function goToFabricState(name) {
            name = name == undefined ? $rootScope.productName : name;

            var params = {
                productName: name
            };

            $state.go('fabric', params);
        }

        function goToSearchState() {
            var params = {
                productName: $rootScope.productName,
                skuid: $rootScope.selectedCurtain.skuid
            };

            $state.go('search', params);
        }

        function getParams() {
            return {
                type: $rootScope.curtainTypeName,
                productName: $rootScope.productName,
                skuid: $rootScope.selectedCurtain.skuid
            };
        }

        $rootScope.goToDimensions = function () {
            $state.go('dimensions', getParams());
        };

        $rootScope.goToLining = function () {
            $state.go('lining', getParams());
        };

        $rootScope.goToMount = function () {
            $state.go('mount', getParams());
        };

        $rootScope.goToLift = function () {
            $state.go('lift', getParams());
        };

        $rootScope.goToHardware = function () {
            $state.go('hardware', getParams());
        };

        $rootScope.goToCart = function () {
            $state.go('cart', getParams());
        };

        $rootScope.goToDeliveredSamples = function () {
            if (window.kustome.myAccount.accountMail) {
                $state.go('deliveredSamples', getParams());
            } else {
                defaultThemeDialog('Please login to view delivered samples.', 40, '', '', 'orange');
            }
        };

        $rootScope.compileDefaultThemeDialog = function (id, width) {
            defaultThemeDialog($compile($(id).html())($scope), width);
        };

        $rootScope.closeHeaderMenu = function () {
            var curtainsHeaderSubMenu = ".curtains-header-sub-menu";
            if (!$(curtainsHeaderSubMenu).hasClass('hidden')) {
                $(curtainsHeaderSubMenu).toggleClass('hidden');
                $(".mobile-header").toggleClass('mobile-header-up-arrow');
            }
        };

        $rootScope.setInfoDivHeight = function () {
            $timeout(function () {
                var block = $('.main-image-block');
                var divHeight = $(block[0]).height();
                $(block[0]).prev().css('minHeight', divHeight + 'px');
            }, 500);
        };

    }
]);


curtains.controller('fabricController', ['$scope', '$http', '$timeout', '$state', '$stateParams', '$rootScope',
    function ($scope, $http, $timeout, $state, $stateParams, $rootScope) {

        if ($state.current.name == 'fabric') {

            $rootScope.closeHeaderMenu();
            $rootScope.searchFlag = false;

            var curtainsLength = 0;
            var filterTypes = ['color', 'material', 'pattern'];

            $rootScope.selectedNavItem = 'fabric';
            $rootScope.showMobileFilterDiv = 'colors';

            if (!$rootScope.listOfCurtains) {
                $scope.$watch(function () {
                    return $rootScope.listOfCurtains;
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        getCurtains();
                    }
                });
            }
            else {
                getCurtains();
            }

            function getCurtains() {
                $rootScope.setCurtainType($stateParams.productName);
                $scope.listOfOptionsCurtains = [];
                $rootScope.selectedHardwareList = [];
                $rootScope.productId = $rootScope.selectedStyle.id;
                $scope.categoryId = $rootScope.selectedStyle.productCategory;
                $scope.optionId = $rootScope.selectedStyle.type;
                $scope.busy = false;
                $rootScope.showNavItems = true;

                $scope.nextPage = 1;

                $scope.$watch(function () {
                    return ($rootScope.filterOptionIdList && $rootScope.sortByDict && $rootScope.searchByIdDict);
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        assignCurtainType($rootScope.selectedStyle.type);
                        fetchData();
                    }
                });
            }

            function assignCurtainType(typeName) {
                $rootScope.curtainTypeName = typeName;
                $rootScope.liningOptionId = $rootScope.curtainTypeName == 'curtain' ? $rootScope.curtainLiningOptionId : $rootScope.shadeLiningOptionId;
                $scope.optionId = $scope.curtainTypeName;

                $scope.listOfOptionsCurtains = [];
                $scope.busy = false;
            }

            function getAllCurtainsOfSelectedType() {
                $http({
                    method: 'GET',
                    url: '/api/custom-curtains/get-option-details',
                    params: {
                        'productId': $rootScope.productId,
                        'categoryId': $scope.categoryId,
                        'optionId': $scope.optionId,
                        'pageNumber': $scope.nextPage
                    }
                }).then(function successCallback(response) {
                    $scope.listOfOptionsCurtains = $scope.listOfOptionsCurtains.concat(response.data.data);
                    if ($rootScope.selectedCurtainFlag) {
                        $rootScope.selectedCurtain = $scope.listOfOptionsCurtains[0];
                        $rootScope.setNoOfCurtains();
                        $rootScope.getCost();
                    }
                    $scope.nextPage = response.data.nextPage;
                    setInfoDivHeight();
                    getFilterInputCount();

                    $timeout(function () {
                        $scope.busy = false;
                        ajaxindicatorstop();
                    }, 0);

                }, function errorCallback(error) {
                    ajaxindicatorstop();
                    defaultThemeDialog(error.data);
                })
            }

            $scope.fetchData = fetchData;

            function fetchData() {
                $scope.noDataFound = false;
                if ($scope.busy) return;

                if ($scope.nextPage != null) {
                    $scope.busy = true;
                    if (!$rootScope.filterOptionIdList.length && !$rootScope.sortByDict.sortBy && !$rootScope.searchByIdDict.searchById) {
                        getAllCurtainsOfSelectedType();
                    }
                    else {
                        getFilterOptionCurtains();
                    }
                }
            }

            function setInfoDivHeight() {
                $timeout(function () {
                    var block = $('.main-image-block');
                    curtainsLength > 30 ? curtainsLength = curtainsLength - 30 : curtainsLength = 0;
                    for (curtainsLength; curtainsLength < block.length; curtainsLength++) {
                        var divHeight = $(block[curtainsLength]).height();
                        $(block[curtainsLength]).prev().css('minHeight', divHeight + 'px');
                    }
                }, 1000)
            }

            // filter


            $scope.toggleFilterDiv = function (filterBy) {
                if ($scope.showFilterDiv == filterBy) {
                    $scope.showFilterDiv = '';
                }
                else {
                    $scope.showFilterDiv = filterBy;
                }
            };

            function getFilterInputCount() {
                var selectedFilter = {};
                for (var i = 0; i < filterTypes.length; i++) {
                    selectedFilter[filterTypes[i]] = [];
                    for (var j = 0; j < $rootScope.selectedFilter[filterTypes[i]].length; j++) {
                        selectedFilter[filterTypes[i]].push($rootScope.selectedFilter[filterTypes[i]][j].name);
                    }
                }
                var pattern = selectedFilter['pattern'];
                var colors = selectedFilter['color'];
                var materials = selectedFilter['material'];
                var queryDataDict = {
                    'PATTERN': pattern ? pattern.join().replace(/,/g, ', ') : '',
                    'COLORS': colors ? colors.join().replace(/,/g, ', ') : '',
                    'MATERIALS': materials ? materials.join().replace(/,/g, ', ') : ''
                };

                $http({
                    method: 'GET',
                    url: '/api/custom-curtains/get-filter-input-count',
                    params: {
                        'optionId': $scope.curtainTypeName,
                        'productCategoryId': $scope.productCategoryId,
                        'queryData': queryDataDict
                    }
                }).then(function successCallback(response) {
                    $scope.changedFilterName != 'COLORS' ? $rootScope.filterByColorList = response.data[$rootScope.filterNameIndexMap['COLORS']] : null;
                    $scope.changedFilterName != 'MATERIALS' ? $rootScope.filterByMaterialList = response.data[$rootScope.filterNameIndexMap['MATERIALS']] : null;
                    $scope.changedFilterName != 'PATTERN' ? $rootScope.filterByPatternList = response.data[$rootScope.filterNameIndexMap['PATTERN']] : null;
                }, function errorCallback(error) {
                    defaultThemeDialog(error.data);
                })
            }

            function getFilterOptionCurtains() {
                $scope.noDataFound = false;
                $http({
                    method: 'GET',
                    url: '/api/custom-curtains/get-filter-data',
                    params: {
                        'filterOptionsInput': ($rootScope.filterOptionIdList.join().replace(/,/g, '%2C')),
                        'pageNumber': $scope.nextPage,
                        'sortBy': $rootScope.sortByDict.sortBy,
                        'searchBySkuId': $rootScope.searchByIdDict.searchById,
                        'optionId': $scope.optionId,
                        'curtainStyleId': $scope.productId,
                        'productCategoryId': $scope.productCategoryId
                    }
                }).then(function successCallback(response) {
                    $scope.listOfOptionsCurtains = $scope.listOfOptionsCurtains.concat(response.data.data);
                    if (!$scope.listOfOptionsCurtains.length) {
                        $scope.noDataFound = true;
                    }
                    $scope.selectedCurtain = $scope.listOfOptionsCurtains[0];
                    $scope.nextPage = response.data.nextPage;
                    setInfoDivHeight();
                    getFilterInputCount();

                    $timeout(function () {
                        $scope.busy = false;
                        ajaxindicatorstop();
                    }, 0);

                }, function errorCallback(error) {
                    ajaxindicatorstop();
                    defaultThemeDialog(error.data);
                });
            }

            function nextPageFunction() {
                $scope.nextPage = 1;
                $scope.listOfOptionsCurtains = [];

                fetchData();
            }

            $scope.sortByPrice = sortByPrice;

            function sortByPrice() {
                curtainsLength = 0;
                nextPageFunction();
            }

            $rootScope.filterByDropdown = filterByDropdown;

            function filterByDropdown(filterOption) {
                ajaxindicatorstart('');

                $rootScope.emptyFilterList();

                angular.forEach($rootScope.selectedFilter, function (each) {
                    for (var i = 0; i < each.length; i++) {
                        $rootScope.filterOptionIdList.push(each[i].id);
                    }
                });

                $scope.changedFilterName = filterOption;
                curtainsLength = 0;
                nextPageFunction();
            }

            $(document).bind('click', function (event) {
                if (!$(event.target).closest('.filter-multiselect').is('.filter-multiselect')) {
                    $scope.showFilterDiv = '';
                }

                $timeout(function () {
                    $scope.$apply();
                }, 0);
            });

            $rootScope.mobileSortByPrice = function (value) {
                $rootScope.sortByDict.sortBy = value;
                sortByPrice();
                $(".jconfirm-closeIcon").click();
            };

            $rootScope.searchBySkuId = searchBySkuId;

            function searchBySkuId() {
                $(".jconfirm-closeIcon").click();
                $scope.busy = false;
                curtainsLength = 0;
                nextPageFunction();
            }

            // filter end


        }

    }
]);


curtains.controller('dimensionsController', ['$scope', '$state', '$stateParams', '$rootScope',
    function ($scope, $state, $stateParams, $rootScope) {

        if ($state.current.name == 'dimensions') {

            $rootScope.closeHeaderMenu();
            $rootScope.selectedNavItem = 'dimensions';
            $rootScope.showNavItems = true;
            $rootScope.setSelectedCurtain($stateParams.productName);

            if (!$rootScope.selectedCurtain) {
                $scope.$watch(function () {
                    return $rootScope.selectedCurtain;
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $rootScope.getCost();
                    }
                });
            } else {
                $rootScope.getCost();
            }

            $scope.selectedDimensionValue = function (parameter, value) {
                $rootScope.dimensions[parameter] = value;
                $scope.hideAddHardwareSetsButton = false;
                if (($rootScope.dimensions['widthFeet'] == 6 && $rootScope.dimensions['widthInch'] >= 6) || ($rootScope.dimensions['widthFeet'] > 6)) {
                    $rootScope.removeHardwareSetsBasedOnWidth();
                    if ($rootScope.selectedHardware == 'HARDWARE-SETS') {
                        $scope.hideAddHardwareSetsButton = true;
                    }
                }
                else {
                    $rootScope.getCost();
                }
                $rootScope.setNoOfCurtains();
            };
        }

        $scope.submitDimensions = function () {
            $rootScope.getCost();
            if ($rootScope.curtainTypeName == 'curtain') {
                $rootScope.goToLining();
            } else {
                $rootScope.goToMount();
            }
        };

        $scope.openMeasurementGuide = function (element, width, title) {
            defaultThemeDialog($(element).html(), width, title);
        };

    }
]);


curtains.controller('liningController', ['$scope', '$timeout', '$state', '$stateParams', '$rootScope',
    function ($scope, $timeout, $state, $stateParams, $rootScope) {

        if ($state.current.name == 'lining') {

            $rootScope.closeHeaderMenu();
            $rootScope.selectedNavItem = 'lining';

            $rootScope.setSelectedCurtain($stateParams.productName);

            if (!$rootScope.selectedLining) {
                $scope.$watch(function () {
                    return $rootScope.liningInformation;
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        setLiningData();
                    }
                })
            } else {
                setLiningData();
            }

            function setLiningData() {
                $rootScope.showNavItems = true;
                $rootScope.curtainTypeName = $stateParams.type;
                $rootScope.getCost();
            }

            $scope.submitLining = function (liningObject) {
                $rootScope.selectedLining = liningObject;
                $rootScope.getCost();
                if ($rootScope.curtainTypeName == 'curtain') {
                    $rootScope.goToHardware();
                } else {
                    $rootScope.goToCart();
                }
            };

            $scope.openLiningDetails = function (lining) {
                $scope.liningDetails = lining;

                $timeout(function () {
                    defaultThemeDialog($('#liningDetails').html(), 80);
                }, 0);
            };

        }
    }
]);


curtains.controller('mountController', ['$scope', '$timeout', '$state', '$stateParams', '$rootScope',
    function ($scope, $timeout, $state, $stateParams, $rootScope) {

        if ($state.current.name == 'mount') {

            $rootScope.closeHeaderMenu();
            $rootScope.selectedNavItem = 'mount';

            $rootScope.setSelectedCurtain($stateParams.productName);

            if (!$rootScope.selectedMount) {
                $scope.$watch(function () {
                    return $rootScope.mountInformation;
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        setMountData();
                    }
                })
            } else {
                setMountData();
            }

            function setMountData() {
                $rootScope.showNavItems = true;
                $rootScope.getCost();
            }

            $scope.submitMount = function (mountObject) {
                $rootScope.selectedMount = mountObject;
                $rootScope.getCost();
                $rootScope.goToLift();
            };

            $scope.openMountDetails = function (mount) {
                $scope.mountDetails = mount;

                $timeout(function () {
                    defaultThemeDialog($('#mountDetails').html(), 80);
                }, 0);
            };

        }
    }
]);

curtains.controller('liftController', ['$scope', '$timeout', '$state', '$stateParams', '$rootScope',
    function ($scope, $timeout, $state, $stateParams, $rootScope) {

        if ($state.current.name == 'lift') {

            $rootScope.closeHeaderMenu();
            $rootScope.selectedNavItem = 'lift';

            $rootScope.setSelectedCurtain($stateParams.productName);

            if (!$rootScope.selectedLift) {
                $scope.$watch(function () {
                    return $rootScope.liftInformation;
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        setLiftData();
                    }
                })
            } else {
                setLiftData();
            }

            function setLiftData() {
                $rootScope.showNavItems = true;
                $rootScope.getCost();
            }

            $scope.submitLift = function (liftObject) {
                $rootScope.selectedLift = liftObject;
                $rootScope.getCost();
                $rootScope.goToLining();
            };

            $scope.openLiftDetails = function (mount) {
                $scope.liftDetails = mount;

                $timeout(function () {
                    defaultThemeDialog($('#liftDetails').html(), 80);
                }, 0);
            };
        }
    }
]);


curtains.controller('hardwareController', ['$scope', '$http', '$anchorScroll', '$timeout', '$state', '$stateParams', '$rootScope',
    function ($scope, $http, $anchorScroll, $timeout, $state, $stateParams, $rootScope) {

        if ($state.current.name == 'hardware') {

            $rootScope.closeHeaderMenu();
            $rootScope.selectedNavItem = 'hardware';

            $rootScope.setSelectedCurtain($stateParams.productName);

            if (!$rootScope.hardwareCategoriesList.length) {
                $scope.$watch(function () {
                    return $rootScope.hardwareCategoriesList.length;
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        setHardwareData();
                    }
                })
            } else {
                setHardwareData();
            }

            function setHardwareData() {
                $rootScope.showNavItems = true;
                ajaxindicatorstart('');
                switchHardwareTab($scope.hardwareCategoriesList[0].categoryName, $scope.hardwareCategoriesList[0].id, 1);
                ajaxindicatorstop();
                $rootScope.getCost();
            }

            $scope.switchHardwareTab = switchHardwareTab;

            function switchHardwareTab(parameter, categoryId, pageNum) {
                $rootScope.selectedHardware = parameter;
                $scope.selectedHardwarePage = parseInt(pageNum);
                $scope.hideAddHardwareSetsButton = false;
                if (($rootScope.selectedHardware == 'HARDWARE-SETS') && (($rootScope.dimensions['widthFeet'] == 6 && $rootScope.dimensions['widthInch'] >= 6)
                    || ($rootScope.dimensions['widthFeet'] > 6))) {
                    $scope.hideAddHardwareSetsButton = true;
                }

                $http({
                    method: 'GET',
                    url: '/api/custom-curtains/get-hardware',
                    params: {
                        'hardwareCategoryId': categoryId,
                        'pageNumber': pageNum,
                        'curtainStyleId': $scope.productId
                    }
                }).then(function successCallback(response) {
                    $anchorScroll();
                    $scope.listOfHardware = response.data.data;
                    $scope.hardwareCategoryId = categoryId;
                    $scope.parameter = parameter;
                    $scope.range = response.data.totalPages;
                    getRanges();
                }, function errorCallback(error) {
                    defaultThemeDialog(error.data);
                })
            }

            $scope.addHardware = function (selectedHardware) {
                var hardwarePresent = false;

                for (var i = 0; i < $rootScope.selectedHardwareList.length; i++) {
                    if (selectedHardware.id == $rootScope.selectedHardwareList[i].id) {
                        var newQuantity = (parseInt($rootScope.selectedHardwareList[i]['quantity']) + 1);
                        hardwarePresent = true;

                        var indexOfHardware = $rootScope.selectedHardwareList.indexOf($rootScope.selectedHardwareList[i]);
                        $rootScope.selectedHardwareList.splice(indexOfHardware, 1);
                    }
                }

                if (!hardwarePresent) {
                    selectedHardware['quantity'] = '1';
                    $rootScope.selectedHardwareList.push(selectedHardware);
                }

                if (newQuantity) {
                    selectedHardware['quantity'] = newQuantity.toString();
                    $rootScope.selectedHardwareList.push(selectedHardware);
                }

                $scope.addedHardwareCss = true;
                $scope.addedHardwareId = selectedHardware.id;
                $timeout(function () {
                    $scope.addedHardwareCss = false;
                }, 1000);

                scrollToId("#selectedHardwareDiv");

                $rootScope.getCost();
            };

            $scope.changeHardwareCount = function (selectedHardwareId, quantity, action) {
                for (var i = 0; i < $rootScope.selectedHardwareList.length; i++) {
                    if (selectedHardwareId == $rootScope.selectedHardwareList[i].id) {
                        if (action == 'increase') {
                            $rootScope.selectedHardwareList[i]['quantity'] = parseInt(quantity) + 1;
                        } else if (action == 'decrease') {
                            $rootScope.selectedHardwareList[i]['quantity'] = parseInt(quantity) - 1;
                            if ($rootScope.selectedHardwareList[i]['quantity'] == 0) {
                                $rootScope.removeThisHardware(selectedHardwareId);
                            }
                        } else {
                            $rootScope.selectedHardwareList[i]['quantity'] = quantity;
                        }
                    }
                }
                $rootScope.getCost();
            };

            $scope.submitHardware = function () {
                $rootScope.getCost();
                $rootScope.goToCart();
            };

            function getRanges() {
                $scope.limitQuantity = $scope.range > 6;
                if ($scope.limitQuantity) {
                    $scope.start = parseInt($scope.selectedHardwarePage) > 3 ? (parseInt($scope.selectedHardwarePage) - 1) : 1;
                    $scope.end = ($scope.start + 3) < $scope.range ? ($scope.start + 3) : $scope.range;
                    $scope.first = true;
                    $scope.last = ($scope.end != $scope.range);
                }
                else {
                    $scope.start = 1;
                    $scope.end = $scope.range;
                }
            }

            $scope.getHardwareCount = function (hardwareObject) {
                for (var i = 0; i < $rootScope.selectedHardwareList.length; i++) {
                    if (hardwareObject.id == $rootScope.selectedHardwareList[i]['id']) {
                        return $rootScope.selectedHardwareList[i]['quantity']
                    }
                }
            };

            $scope.showHardwareDetails = function (hardware) {
                $scope.hardwareDetails = hardware;

                $timeout(function () {
                    defaultThemeDialog($('#showHardwareDetails').html(), 80, 'Hardware Details');
                }, 10);

            };


            function scrollToId(scrollId) {
                $(scrollId).animate({scrollTop: $(scrollId)[0].scrollHeight}, 'slow');
            }


        }
    }
]);

curtains.controller('cartController', ['$scope', '$state', '$stateParams', '$rootScope',
    function ($scope, $state, $stateParams, $rootScope) {

        if ($state.current.name == 'cart') {

            $rootScope.closeHeaderMenu();
            $rootScope.selectedNavItem = 'cart';

            $rootScope.setSelectedCurtain($stateParams.productName);
            $rootScope.showNavItems = true;

            if (!$rootScope.selectedCurtain) {
                $scope.$watch(function () {
                    return $rootScope.selectedCurtain;
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $rootScope.getCost();
                    }
                });
            } else {
                $rootScope.getCost();
            }

        }
    }
]);

curtains.controller('deliveredSamplesController', ['$scope', '$http', '$state', '$stateParams', '$rootScope',
    function ($scope, $http, $state, $stateParams, $rootScope) {

        if ($state.current.name == 'deliveredSamples') {

            $rootScope.closeHeaderMenu();
            $rootScope.selectedNavItem = 'deliveredSamples';
            $rootScope.setSelectedCurtain($stateParams.productName, false);
            $rootScope.showNavItems = true;

            if (!$rootScope.selectedStyle) {
                $scope.$watch(function () {
                    return $rootScope.selectedStyle;
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        getDeliveredSamples();
                    }
                })
            } else {
                getDeliveredSamples();
            }

            $scope.deliveredSamplesFlag = false;

            function getDeliveredSamples() {
                if (!$scope.deliveredSamplesFlag) {
                    ajaxindicatorstart('Fetching Samples...');
                    $scope.noDeliveredSamples = false;
                    $http({
                        method: 'GET',
                        url: '/api/custom-curtains/get-delivered-samples',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': kustome.getCookie('csrftoken')
                        }
                    }).then(function successCallback(response) {
                        $scope.deliveredSamplesList = response.data.values;
                        if ($scope.deliveredSamplesList) {
                            viewDeliveredSample($scope.deliveredSamplesList[0].skuid);
                        } else {
                            $scope.noDeliveredSamples = true;
                        }
                        $scope.deliveredSamplesFlag = true;
                        ajaxindicatorstop();
                    }, function errorCallback(error) {
                        defaultThemeDialog(error.data);
                    })
                }
            }

            $scope.viewDeliveredSample = viewDeliveredSample;

            function viewDeliveredSample(skuId) {
                ajaxindicatorstart('Please wait...');
                $scope.noDataFound = false;
                $http({
                    method: 'GET',
                    url: '/api/custom-curtains/get-filter-data',
                    params: {
                        'searchBySkuId': skuId,
                        'optionId': $rootScope.selectedStyle.type,
                        'curtainStyleId': $rootScope.productId,
                        'productCategoryId': $rootScope.productCategoryId
                    }
                }).then(function successCallback(response) {
                    $scope.viewSample = '';
                    if (!response.data.data.length) {
                        $scope.noDataFound = true;
                    } else {
                        $scope.viewSample = (response.data.data)[0];
                    }
                    $rootScope.setInfoDivHeight();
                    ajaxindicatorstop();
                }, function errorCallback(error) {
                    ajaxindicatorstop();
                    defaultThemeDialog(error.data);
                });
            }


        }
    }
]);

curtains.controller('searchController', ['$scope', '$http', '$state', '$stateParams', '$rootScope',
    function ($scope, $http, $state, $stateParams, $rootScope) {

        if ($state.current.name == 'search') {

            $rootScope.closeHeaderMenu();
            $rootScope.selectedNavItem = 'search';
            $rootScope.searchFlag = true;

            if (!$rootScope.selectedCurtain) {
                $scope.$watch(function () {
                    return $rootScope.productCategoryId;
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        setCurtainType();
                    }
                });
            }
            else {
                getSearchResult();
            }

            function setCurtainType() {
                $scope.$watch(function () {
                    return $rootScope.listOfCurtains;
                }, function () {
                    $rootScope.setCurtainType($stateParams.productName);
                    getSearchResult();
                })
            }

            function getSearchResult() {
                $scope.listOfOptionsCurtains = [];
                $rootScope.selectedHardwareList = [];
                $rootScope.productId = $rootScope.selectedStyle.id;
                $scope.categoryId = $rootScope.selectedStyle.productCategory;
                $scope.optionId = $rootScope.selectedStyle.type;
                $scope.busy = false;
                $rootScope.showNavItems = true;

                $rootScope.curtainTypeName = $rootScope.selectedStyle.type;
                $rootScope.liningOptionId = $rootScope.curtainTypeName == 'curtain' ? $rootScope.curtainLiningOptionId : $rootScope.shadeLiningOptionId;

                getSearchData();

            }

            function getSearchData() {
                $scope.noDataFound = false;
                $http({
                    method: 'GET',
                    url: '/api/custom-curtains/get-search-data',
                    params: {
                        'pageNumber': 1,
                        'searchBySkuId': $stateParams.skuid,
                        'optionId': $scope.optionId,
                        'curtainStyleId': $rootScope.productId,
                        'productCategoryId': $rootScope.productCategoryId
                    }
                }).then(function successCallback(response) {
                    $scope.listOfOptionsCurtains = $scope.listOfOptionsCurtains.concat(response.data.data);
                    if (!$scope.listOfOptionsCurtains.length) {
                        $scope.noDataFound = true;
                    }
                    $rootScope.selectedCurtain = $scope.listOfOptionsCurtains[0];

                    $rootScope.setInfoDivHeight();
                    $rootScope.getCost();

                }, function errorCallback(error) {
                    defaultThemeDialog(error.data);
                });
            }

        }
    }
]);

