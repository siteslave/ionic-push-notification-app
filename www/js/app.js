
angular.module('starter', ['ionic', 'starter.GCM'])

  .run(function ($rootScope, $ionicPlatform, $log, $ionicPopup, GCMService) {
    $rootScope.users = [];
    $rootScope.username = 'Satit';

    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      var push = PushNotification.init({
        android: {
          senderID: "642908727095"
        },
        ios: {
          alert: "true",
          badge: "true",
          sound: "true"
        },
        windows: {}
      });

      push.on('registration', function (data) {
        console.log(data);
        GCMService.registerDevice($rootScope.username, data.registrationId)
          .then((data) => {
            $log.info(data);
          }, err => {
            $log.error(err)
          });
      });

      push.on('notification', function (data) {
        $log.info(data);

        var username = data.additionalData.username;

        $rootScope.users.forEach(function (v, idx) {
          if (v.username == username) {
            $rootScope.users[idx].count++;
          }
        });

        $ionicPopup.alert({
          title: data.title,
          template: data.message
        });
        // data.message,
        // data.title,
        // data.count,
        // data.sound,
        // data.image,
        // data.additionalData
      });

      push.on('error', function (e) {
        $log.error(e);
      });

      // initial users
      GCMService.getUsers()
        .then(function (users) {
          users.forEach(function (v) {
            var obj = {};
            obj.username = v.username;
            obj.token = v.token;
            obj.count = 0;
            $rootScope.users.push(obj);
          });
        });
    });
  });
