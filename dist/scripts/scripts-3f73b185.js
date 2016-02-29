!function() {
    "use strict";
    angular.module("app.common", [ "app.templates" ]);
}(), function() {
    "use strict";
    function urlParameters() {
        function splitURL(search) {
            return window.location.search.substr(1).split(search);
        }
        return {
            getParameters: function() {
                var search, params = {};
                return search = -1 !== window.location.search.indexOf("&amp;") ? "&amp;" : "&", 
                angular.forEach(splitURL(search), function(item) {
                    params[item.split("=")[0]] = item.split("=")[1];
                }), params;
            },
            $get: function() {
                return {};
            }
        };
    }
    angular.module("app.common").provider("urlParameters", urlParameters);
}(), function() {
    "use strict";
    function trackEvents() {
        function record(eventName) {
            console.log("-------------------"), console.log("TRACKING - > IS NOT IMPLEMENTED, THIS IS TBD!!! "), 
            console.log(eventName), console.log("-------------------"), console.log("eventName -" + eventName);
        }
        var service = {
            record: record
        };
        return service;
    }
    angular.module("app.common").service("trackEvents", trackEvents);
}(), function() {
    "use strict";
    function preloaderService(preloader) {
        var isLoading = !0, isSuccessful = !1, percentLoaded = 0;
        return {
            bind: function(images, eventHandlers) {
                preloader.preloadImages(images).then(function() {
                    isLoading = !1, isSuccessful = !0, eventHandlers.complete && eventHandlers.complete();
                }, function(imageLocation) {
                    isLoading = !1, isSuccessful = !1, console.error("Image Failed", imageLocation), 
                    eventHandlers.error && eventHandlers.error();
                }, function(event) {
                    percentLoaded = event.percent, eventHandlers.progress && eventHandlers.progress(percentLoaded);
                });
            }
        };
    }
    angular.module("app.common").factory("preloaderService", preloaderService), preloaderService.$inject = [ "preloader" ];
}(), function() {
    "use strict";
    function preloader($q, $rootScope) {
        function Preloader(imageLocations) {
            this.imageLocations = imageLocations, this.imageCount = this.imageLocations.length, 
            this.loadCount = 0, this.errorCount = 0, this.states = {
                PENDING: 1,
                LOADING: 2,
                RESOLVED: 3,
                REJECTED: 4
            }, this.state = this.states.PENDING, this.deferred = $q.defer(), this.promise = this.deferred.promise;
        }
        return Preloader.preloadImages = function(imageLocations) {
            var preloader = new Preloader(imageLocations);
            return preloader.load();
        }, Preloader.prototype = {
            constructor: Preloader,
            isInitiated: function() {
                return this.state !== this.states.PENDING;
            },
            isRejected: function() {
                return this.state === this.states.REJECTED;
            },
            isResolved: function() {
                return this.state === this.states.RESOLVED;
            },
            load: function() {
                if (this.isInitiated()) return this.promise;
                this.state = this.states.LOADING;
                for (var i = 0; i < this.imageCount; i++) this.loadImageLocation(this.imageLocations[i]);
                return this.promise;
            },
            handleImageError: function(imageLocation) {
                this.errorCount++, this.isRejected() || (this.state = this.states.REJECTED, this.deferred.reject(imageLocation));
            },
            handleImageLoad: function(imageLocation) {
                this.loadCount++, this.isRejected() || (this.deferred.notify({
                    percent: Math.ceil(this.loadCount / this.imageCount * 100),
                    imageLocation: imageLocation
                }), this.loadCount === this.imageCount && (this.state = this.states.RESOLVED, this.deferred.resolve(this.imageLocations)));
            },
            loadImageLocation: function(imageLocation) {
                var safeApply = function(fn) {
                    var phase = $rootScope.$root.$$phase;
                    "$apply" === phase || "$digest" === phase ? fn && "function" == typeof fn && fn() : $rootScope.$apply(fn);
                }, preloader = this, image = $(new Image()).load(function(event) {
                    $rootScope.$apply(function() {
                        preloader.handleImageLoad(event.target.src), preloader = image = event = null;
                    });
                }).error(function(event) {
                    safeApply(function() {
                        preloader.handleImageError(event.target.src), preloader = image = event = null;
                    });
                }).prop("src", imageLocation);
            }
        }, Preloader;
    }
    angular.module("app.common").factory("preloader", preloader), preloader.$inject = [ "$q", "$rootScope" ];
}(), function() {
    "use strict";
    angular.module("app.navigation", []);
}(), function() {
    "use strict";
    function navbar() {
        return {
            restrict: "E",
            templateUrl: "scripts/navigation/navbar.html",
            controller: "NavigationController",
            controllerAs: "vm"
        };
    }
    angular.module("app.navigation").directive("navbar", navbar);
}(), function() {
    "use strict";
    function NavigationController($scope, auth, $location) {
        var vm = this;
        vm.isLoggedIn = auth.isLoggedIn, vm.isActive = function(path) {
            if ($location.path()) {
                var currentPath = $location.path().split("/")[1].split("?")[0];
                return currentPath === path.split("/")[1];
            }
        }, vm.logout = function() {
            auth.logout().then(function() {
                localStorage.removeItem("auth_token"), $location.path("/login");
            });
        };
    }
    angular.module("app.navigation").controller("NavigationController", NavigationController), 
    NavigationController.$inject = [ "$scope", "auth", "$location" ];
}(), function() {
    "use strict";
    angular.module("app.core", [ "ngCookies", "ngResource", "ngSanitize", "ngRoute" ]);
}(), function() {
    "use strict";
    function configure($routeProvider, $provide, urlParametersProvider) {
        urlParametersProvider.getParameters();
        $routeProvider.when("/", {
            templateUrl: "scripts/core/main.html"
        }).when("/login", {
            templateUrl: "scripts/admin/login.html",
            controller: "LoginController",
            controllerAs: "vm"
        }).otherwise({
            redirectTo: "/"
        }), $provide.constant("CONFIG", {
            someConfigObject: {}
        });
    }
    angular.module("app.core").config(configure), configure.$inject = [ "$routeProvider", "$provide", "urlParametersProvider" ];
}(), function() {
    "use strict";
    function MainCtrl($scope) {
        $scope.awesomeThings = [ "HTML5 Boilerplate", "AngularJS", "Karma" ];
    }
    angular.module("app.core").controller("MainCtrl", MainCtrl), MainCtrl.$inject = [ "$scope" ];
}(), function() {
    "use strict";
    angular.module("app.admin", []);
}(), function() {
    "use strict";
    angular.module("app.admin").controller("LogoutController", function(auth) {
        auth.logout();
    });
}(), function() {
    "use strict";
    function LoginController($scope, auth) {
        function success(response) {
            localStorage.setItem("auth_token", response.data.authToken);
        }
        function error() {
            vm.wrongCredentials = !0;
        }
        var vm = this;
        vm.user = {
            email: "",
            password: ""
        }, vm.wrongCredentials = !1, vm.login = function() {
            $scope.loginForm.$valid ? auth.login(vm.user).then(success, error) : vm.loginForm.submitted = !0;
        };
    }
    angular.module("app.admin").controller("LoginController", LoginController), LoginController.$inject = [ "$scope", "auth", "$location" ];
}(), function() {
    "use strict";
    function auth($http) {
        this.login = function(user) {
            return $http.post("/api/login", {
                email: user.email,
                password: user.password
            });
        }, this.isLoggedIn = function() {
            return localStorage.getItem("auth_token") ? !0 : !1;
        };
    }
    angular.module("app.admin").service("auth", auth), auth.$inject = [ "$http" ];
}(), function() {
    "use strict";
    angular.module("app.admin").controller("AdminController", function() {});
}(), function() {
    "use strict";
    angular.module("app", [ "app.common", "app.core", "app.admin", "app.navigation" ]);
}();