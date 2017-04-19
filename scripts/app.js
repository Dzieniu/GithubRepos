angular.module('GithubRepos', [] ).controller('MainCtrl', [
'$scope','$http','$q',

function($scope,$http,$q){
	$scope.currentUser = {
		branches: [] //repos order
	};

	$scope.getRepos= function(username){
		$scope.nouser=false;
		$scope.ready=false;
		$http({
			method: 'GET',
			url: 'https://api.github.com/users/' + username 
		}).then(
		function successCallback(response){
			$scope.currentUser = {branches:[]};
			$scope.currentUser.name = response.data.name;
			$scope.currentUser.login = response.data.login;
			$scope.currentUser.bio = response.data.bio;
			$scope.currentUser.avatar = response.data.avatar_url;
			$http.get(response.data.repos_url + "?per_page=100&page=1").then(function(response) {
				$scope.currentUser.repos = response.data
		     	getReposBranches($scope.currentUser.repos);
			});
		},function errorCallback(response){
			$scope.nouser=true;
		});
	}

	getReposBranches = function(repos){
		var tempBranches=[]
		for(i=0;i<=repos.length-1;i++){
			tempBranches.push($http.get(repos[i].url+"/branches"));
		}
		$q.all(tempBranches).then(function (tempB) {
			for(i=0;i<=tempB.length-1;i++){
				$scope.currentUser.branches.push(tempB[i].data.length)
				$scope.ready=true;
			}
		});
	}

}]);

