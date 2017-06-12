(function () {
	angular.module('myApp', [])
	.controller('Controller1', function(Service, items){
		var vm = this;

		vm.submit = function() {
			var promise = Service.getStock();

			promise.then(function(response){
				vm.stocks = response.data;

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
            	vm.net = []
            	vm.netWorth = 0;
            	for(var i = 0; i<vm.list().length; i++) {
            		vm.key = vm.list()[i].key;
            		vm.value = vm.list()[i].value;
            		vm.counter = vm.list()[i].counter;

            		vm.priceHeld = vm.value * vm.counter;
            		vm.net.push(vm.priceHeld);
            	}

            	//console.log(vm.key + ", " + vm.value + ", "+ vm.counter);
            	
            	for(var i in vm.net) {
            		vm.netWorth += vm.net[i];
            	}
            }

            	
            



           
	})

	.factory('items', function(){
		var items = [];
		var itemsService = {};
    
	    itemsService.add = function(key, value, counter) {
	        items.push({key, value, counter});
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
