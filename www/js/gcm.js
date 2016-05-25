'use strict';

angular.module('starter.GCM', [])
  .controller('GCMCtrl', function ($scope, $rootScope, $ionicPopup, GCMService) {

    $scope.showPopup = function (user) {
      $scope.data = {};
      $scope.user = user;

      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.message">',
        title: 'ส่งข้อความ',
        subTitle: 'ระบุข้อความที่ต้องการจะส่ง',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Send</b>',
            type: 'button-positive',
            onTap: function (e) {
              if (!$scope.data.message) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.data.message;
              }
            }
          }
        ]
      });

      myPopup.then(function (message) {
        if (message) {
          // send message
          GCMService.sendMessage(user.username, message, user.token)
            .then(function (res) {
              console.log(res);
            }, function (err) {
              console.log(err);
            });
        }
      });
    };
  })
  .factory('GCMService', function ($q, $http) {
    // let url = 'http://192.168.43.76:3000';
    let url = 'http://hdc.kkh.go.th:3000';
    return {
      registerDevice(username, token) {
        let q = $q.defer();
        let _url = `${url}/register`;
        $http.post(_url, { token: token, username: username })
          .success(function (data) { q.resolve(data); })
          .error(function () { q.reject('Connection failed'); });

        return q.promise;
      },

      getUsers() {
        let q = $q.defer();
        let _url = `${url}/users`;
        $http.get(_url, {})
          .success(function (data) { q.resolve(data.users); })
          .error(function () { q.reject('Connection failed'); });

        return q.promise;
      },

      sendMessage(username, message, token) {
        let q = $q.defer();
        let _url = `${url}/send`;
        $http.post(_url, {username: username, message: message, token: token})
          .success(function (data) { q.resolve(data.users); })
          .error(function () { q.reject('Connection failed'); });

        return q.promise;
      }
    }
  });