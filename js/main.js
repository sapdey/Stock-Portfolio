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
            vm.send = function() {
            	console.log(vm.list);
           }

           vm.counter = 1;
           vm.decrement = function() {
           		vm.counter--;
           }
	})

	.factory('items', function(){
		var items = [];
		var itemsService = {};
    
	    itemsService.add = function(key, value) {
	        items.push({key, value});
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
});



})();