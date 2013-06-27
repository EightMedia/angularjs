var App = angular.module('ngView', [], function($routeProvider) {
  $routeProvider.when('/Book/:bookId', {
    templateUrl: 'book.html',
    controller: BookCntl,
    // make sure the ctrl doesnt gets reloaded when the url changes
    reloadOnSearch: false
  });
});


/**
 * model
 */
App.factory("BooksModel", ['$http', function($http) {
  var records = [
    { name: 'Harry Potter', chapters: ['Geboren','Dood'] },
    { name: 'Woordenboek', chapters: ['A-J','K-Z'] },
    { name: 'Puzzels', chapters: ['Simpel','Moeilijk'] },
  ];

  return {
    all : function() { return records; },
    get : function(index) { return records[index]; },
    save : function() {
      console.log(records, 'xhr..');
    }
  }
}]);


/**
 * contains everything..!
 * @constructor
 */
function MainCntl($scope, $route, BooksModel, $routeParams, $location) {
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;

  $scope.books = BooksModel.all();

  $scope.saveBooks = function() {
    BooksModel.save();
  }
}

/**
 * when book id changes this is all loaded
 */
function BookCntl($scope, BooksModel, $routeParams) {
  $scope.name = "BookCntl";
  $scope.params = $routeParams;
  $scope.book = BooksModel.get($routeParams.bookId);
}


/**
 * subcontroller in book,
 * only loads data when the param ?chapterId changes
 */
function ChapterCntl($scope, BooksModel, $routeParams, $route) {
  $scope.name = "ChapterCntl";

  // watch for chapterId changes
  $scope.$watch('$route.current.params', function(newVal, oldVal) {
    // only change book&chapter when book/chapter id has changed
    if(newVal.chapterId != oldVal.chapterId || newVal.bookId != oldVal.bookId) {
      $scope.book = BooksModel.get(newVal.bookId);
      $scope.chapter = $scope.book.chapters[newVal.chapterId];
    }
  });
}