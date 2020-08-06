angular.module('curtainsFactory', [])
	.factory('samplesTemplate', function () {
		return function () {
			return '<ul class="large-block-grid-9 medium-block-grid-5 small-block-grid-2">' +
				'<li ng-repeat="sample in samplesList">' +
				'<div>' +
				'<a ng-click="removeSample(sample)"><i class="fas fa-times-circle remove-sample"></i></a>' +
				'<img ng-src="{$ sample.optionDisplayImage | convertToHTTPS  $}" alt="{$ sample.skuId $}" style="border: 1px solid #c5c5c5;height: 70px;width: 77px;">' +
				'</div>' +
				'</li>' +
				'</ul>';
		}
	})
	.factory('sortByTemplate', function () {
		return function () {
			return '<ul style="list-style: none;">' +
				'<li ng-repeat="sortOption in sortByInputs" class="margin-top-5">' +
				'<a ng-class="{\'font-red\': sortByDict.sortBy == sortOption.value}" ng-click="mobileSortByPrice(sortOption.value);" class="font-gray">{$ sortOption.name $}</a>' +
				'</li>' +
				'</ul>';
		}
	});
