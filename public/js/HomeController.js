function HomeController($scope, $http, $window, $location) {
  //This will hide the DIV by default.
  $scope.IsHiddenAppConfigShowHide = false;
  $scope.IsHiddenSourceDBShowHide = true;
  $scope.IsHiddenTargetRDBMSShowHide = true;
  $scope.IsHiddenTargetMongoDBShowHide = true;
  $scope.IsHiddenTargetCassandraShowHide = true;
  $scope.IsHiddenAdminDBShowHide = true;
  $scope.AppConfigShowHide = function() {
    //If DIV is hidden it will be visible and vice versa.
    $scope.IsHiddenAppConfigShowHide = $scope.IsHiddenAppConfigShowHide ? false : true;
    $scope.IsHiddenSourceDBShowHide = true;
    $scope.IsHiddenTargetRDBMSShowHide = true;
    $scope.IsHiddenTargetMongoDBShowHide = true;
    $scope.IsHiddenTargetCassandraShowHide = true;
    $scope.IsHiddenAdminDBShowHide = true;
  }
  $scope.SourceDBShowHide = function() {
    //If DIV is hidden it will be visible and vice versa.
    $scope.IsHiddenSourceDBShowHide = $scope.IsHiddenSourceDBShowHide ? false : true;
    $scope.IsHiddenAppConfigShowHide = true;
    $scope.IsHiddenTargetRDBMSShowHide = true;
    $scope.IsHiddenTargetMongoDBShowHide = true;
    $scope.IsHiddenTargetCassandraShowHide = true;
    $scope.IsHiddenAdminDBShowHide = true;
  }

  $scope.TargetRDBMSShowHide = function() {
    //If DIV is hidden it will be visible and vice versa.
    $scope.IsHiddenTargetRDBMSShowHide = $scope.IsHiddenTargetRDBMSShowHide ? false : true;
    $scope.IsHiddenAppConfigShowHide = true;
    $scope.IsHiddenSourceDBShowHide = true;

    $scope.IsHiddenTargetMongoDBShowHide = true;
    $scope.IsHiddenTargetCassandraShowHide = true;
    $scope.IsHiddenAdminDBShowHide = true;
  }
  $scope.TargetMongoDBShowHide = function() {
    //If DIV is hidden it will be visible and vice versa.
    $scope.IsHiddenTargetMongoDBShowHide = $scope.IsHiddenTargetMongoDBShowHide ? false : true;
    $scope.IsHiddenAppConfigShowHide = true;
    $scope.IsHiddenSourceDBShowHide = true;
    $scope.IsHiddenTargetRDBMSShowHide = true;

    $scope.IsHiddenTargetCassandraShowHide = true;
    $scope.IsHiddenAdminDBShowHide = true;
  }
  $scope.TargetCassandraShowHide = function() {
    //If DIV is hidden it will be visible and vice versa.
    $scope.IsHiddenTargetCassandraShowHide = $scope.IsHiddenTargetCassandraShowHide ? false : true;
    $scope.IsHiddenAppConfigShowHide = true;
    $scope.IsHiddenSourceDBShowHide = true;
    $scope.IsHiddenTargetRDBMSShowHide = true;
    $scope.IsHiddenTargetMongoDBShowHide = true;

    $scope.IsHiddenAdminDBShowHide = true;
  }
  $scope.AdminDBShowHide = function() {
    //If DIV is hidden it will be visible and vice versa.
    $scope.IsHiddenAdminDBShowHide = $scope.IsHiddenAdminDBShowHide ? false : true;
    $scope.IsHiddenAppConfigShowHide = true;
    $scope.IsHiddenSourceDBShowHide = true;
    $scope.IsHiddenTargetRDBMSShowHide = true;
    $scope.IsHiddenTargetMongoDBShowHide = true;
    $scope.IsHiddenTargetCassandraShowHide = true;

  }
  $http.get('./home').success(function(data) {
    $scope.admindb = data.admindb;
    $scope.application = data.application;
    $scope.sourcedb = data.sourcedb;
    $scope.targetdb = data.targetdb;
    $scope.mongodb = data.mongodb;
    $scope.cassandradb = data.cassandradb;
  });
}