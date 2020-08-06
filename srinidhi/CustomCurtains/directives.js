/**
 * Created by cfit006 on 5/2/18.
 */

angular.module('curtainsDirective', [])
	.directive('autoScrollTo', ['$location', '$anchorScroll', '$timeout', function ($location, $anchorScroll, $timeout) {
		return {
            scope: false,
            link: function (scope, elem, attr) {
                $timeout(function () {
                    $location.hash(attr.autoScrollTo);
                    $anchorScroll();
                })
            }
        }
	}])
	.directive("curtainsOwlCarousel", function () {
		return {
			restrict: 'E',
			transclude: false,
			link: function (scope) {
				scope.initCarousel = function(element) {
					var defaultOptions = {
						dots: true,
						items: 1,
						pagination: true,
						navigation: true
					};
					var customOptions = scope.$eval($(element).attr('data-options'));
					for(var key in customOptions) {
						defaultOptions[key] = customOptions[key];
					}
					$(element).owlCarousel(defaultOptions);
				};
			}
		};
	})
	.directive('curtainsOwlCarouselItem', [function() {
		return {
			restrict: 'A',
			transclude: false,
			link: function(scope, element) {
				if(scope.$last) {
					scope.initCarousel(element.parent());
				}
			}
		};
	}])
	.directive('pressEnter', function () {
		return function (scope, element, attrs) {
			element.bind("keydown keypress", function (event) {
				if(event.which === 13) {
					scope.$apply(function (){
						scope.$eval(attrs.pressEnter);
					});

					event.preventDefault();
				}
			});
		};
	})
	.directive('samplesData', ['$compile', 'samplesTemplate', function ($compile, samplesTemplate) {
		return {
			scope: true,
			link: function (scope, element) {
				var template = samplesTemplate();
				element.html($compile(template)(scope));
			}
		};
	}])
	.directive('sortData', ['$compile', 'sortByTemplate', function ($compile, sortByTemplate) {
		return {
			scope: true,
			link: function (scope, element) {
				var template = sortByTemplate();
				element.html($compile(template)(scope));
			}
		};
	}]);