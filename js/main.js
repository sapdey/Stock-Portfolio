(function () {
	angular.module('myApp', [])
	.controller('Controller1', function(Service, items){
		var vm = this;

		vm.submit = function() {
			var promise = Service.getStock();

			promise.then(function(response){
				vm.stocks = response.data;
				console.log(vm.stocks);

			})
			.catch(function(){
				console.log("promise error");
			})
		}

         vm.add = items.add; // transfer data to other controller
         
         
	})
	.service('Service', function($http){
		var service = this;

		service.getStock = function(){
			var response = $http({
				method: 'GET',
				url: "data.json"
			});

			return response;
		}

	})
	.filter('pagination', function()
		{
		  return function(input, start)
			 {
			  start = +start;
			  return input.slice(start);
			 };
			})
	// .filter('objLimitTo', [function(){
 //    return function(obj, limit){
 //        var keys = Object.keys(obj);
 //        if(keys.length < 1) return [];
 //        var ret = new Object();
 //        var count = 0;
 //        angular.forEach(keys, function(key, arrayIndex){
 //            if(count >= limit) return false;
 //            ret[key] = obj[key];
 //            count++;
 //        });
 //        return ret;
 //    };
// }])
	.controller('Controller2', function(items){
		var vm = this;
            vm.list = items.list;
            vm.priceHeld = 0;
            
            vm.detail = function(){
            	vm.net = [];
            	vm.EPS = [];
            	vm.finalGraph = [];
            	vm.netWorth = 0;
            	vm.netEPS = 0;
            	for(var i = 0; i<vm.list().length; i++) {
            		vm.key = vm.list()[i].key;
            		vm.value = vm.list()[i].value;
            		vm.counter = vm.list()[i].counter;

            		vm.net.push(vm.value * vm.counter);

            		vm.eps = vm.list()[i].eps;

            		vm.EPS.push(vm.eps * vm.counter);

            		vm.history = vm.list()[i].history.point;
            		vm.graph = [];
            		for (var j = 0; j<vm.history.length; j++) {
            			vm.graph.push(vm.history[j].price * vm.counter);

            		}
            		
            		vm.finalGraph.push(vm.graph);
            	}
            	
            	for(var i in vm.net) {
            		vm.netWorth += vm.net[i];
            	}
            	for (var i in vm.EPS) {
            		vm.netEPS += vm.EPS[i];
            	}

            	vm.pe = vm.netWorth/vm.netEPS; // P/E Ratio

            	for(var i=0; i<vm.finalGraph.length-1; i++) {

            		vm.finalGraph[i+1] = vm.finalGraph[i].map(function (num, index) {
            			return num + vm.finalGraph[i+1][index];
            		});

            	}
            	vm.dataarr = vm.finalGraph[vm.finalGraph.length-1]
            	console.log(vm.dataarr);
            	

            	Highcharts.chart('graph', {
				    chart: {
				        type: 'area'
				    },
				    title : "",
				    xAxis: {
				        allowDecimals: false,
				        labels: {
				            formatter: function () {
				                return this.value;
				            }
				        }
				    },
				    yAxis: {
				        title: {
				            text: 'Value'
				        },
				        labels: {
				            formatter: function () {
				                return this.value;
				            }
				        }
				    },
				    tooltip: {
				        pointFormat: '<b>{point.y:,.0f}</b>'
				    },
				    plotOptions: {
				        area: {
				            pointStart: 0,
				            marker: {
				                enabled: false,
				                symbol: 'circle',
				                radius: 2,
				                states: {
				                    hover: {
				                        enabled: true
				                    }
				                }
				            }
				        }
				    },
				    series: [{
				        name: 'Time',
				        data: vm.dataarr
				    }]
				});

            } 
	})

	.factory('items', function(){
		var items = [];
		var itemsService = {};
    
	    itemsService.add = function(key, value, counter, eps, history) {
	        items.push({key, value, counter, eps, history});
	    };
	    itemsService.list = function() {
	        return items;
	    };
	    
	    return itemsService;
	})
	.directive('removeOnClick', function() {
	    return {
		link: function(scope, elt, attrs) {
		    scope.remove = function() {
			elt.html('');
		    };
		}
	    }
	})
	.directive('increDecre', function(){
		return {
			scope: {
				counter: '='
			},
			template: ` <button ng-click="counter = counter + 1" class="smallButton">+</button>
					    	<div id="counterValue" ng-model="detail.count">{{counter}}</div>
					    <button ng-click="counter = counter - 1" ng-disabled="counter == 0" class="smallButton">-</button>`
		}
	})



})();
