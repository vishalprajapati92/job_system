var app = angular.module("jobManagement",['ngRoute']);

app.config(function($routeProvider){
    $routeProvider.when('/',{
         templateUrl : '/postaJob.html',        
         controller : 'cntRedirectPage',
         resolve : ['authService',function(authService){
            return authService.checkUserLoginStatus();
         }]
    })
    .when('/login',{
        templateUrl : '/login.html',
        controller : 'cntLoginCheck',
        resolve : ['displayMenu',function(displayMenu){
            return displayMenu.checkLoginOrRegisterDirection();
         }]
    })
    .when('/register',{
        templateUrl : '/register.html',
        controller : 'cntRegister',
    })
    .when('/postaJob',{
        templateUrl : '/postaJob.html',
        controller : 'cntPostaJob',
        resolve : ['authService',function(authService){
            return authService.checkUserLoginStatus();
         }]
    })
    .when('/searchJobs',{
        templateUrl : '/searchJobs.html',
        controller : 'cntSearchJobs',
        resolve : ['authService',function(authService){
            return authService.checkUserLoginStatus();
         }]
    })
    .when('/listJob',{
        templateUrl : '/listJob.html',
        controller : 'cntListJob',
        resolve : ['authService',function(authService){
            return authService.checkUserLoginStatus();
         }]
    })
    .when('/saveJobList',{
        templateUrl : '/saveJobList.html',
        controller : 'cntSaveJobList',
        resolve : ['authService',function(authService){
            return authService.checkUserLoginStatus();
         }]
    })
    .when('/logout',{
        resolve : ['logout',function(logout){
            return logout.logOutUser();
         }]
    })
    .otherwise({
        // redirectTo: '/postaJob',
        resolve : ['authService',function(authService){
            return authService.checkUserLoginStatus();
         }]
    });
    
});

app.controller("cntForHomepage", function($scope,$rootScope){
        if(localStorage.isLoggedIn)
        {
            $scope.isLogin = true;
            $scope.isNotLogin = false;
            if(localStorage.usertype == "company")
            {
                $scope.isUserTypeCompany = true;
                $scope.isUserTypeJobSeeker = false;
            }
            else
            {
                $scope.isUserTypeCompany = false;
                $scope.isUserTypeJobSeeker = true;
            }
        }
        else
        {
            $scope.isLogin = false;
            $scope.isNotLogin = true;
            isUserTypeJobSeeker = false;
            isUserTypeCompany = false;
        }
    $rootScope.$on('getDataFromeServer',function(evt,data){
        //   console.log('post data 1 = ',evt);
        if(data)
        {
            $scope.isLogin = true;
            $scope.isNotLogin = false;

            // console.log(localStorage.usertype);
            if(localStorage.usertype == "company")
            {
                $scope.isUserTypeCompany = true;
                $scope.isUserTypeJobSeeker = false;
            }
            else
            {
                // console.log("jobseeker");
                $scope.isUserTypeCompany = false;
                $scope.isUserTypeJobSeeker = true;
            }
            
        }
        else
        {
            $scope.isLogin = false;
            $scope.isNotLogin = true; 
            $scope.isUserTypeCompany = false;
            $scope.isUserTypeJobSeeker = false;
        }
        //  $scope.isLogin = args;
    }); 

});
app.controller("cntLoginCheck", function($scope,$http,$location,$rootScope){
    // console.log("data for response",localStorage.isLoggedIn);
    //  $rootScope.$broadcast('getDataFromeServer',localStorage.isLoggedIn);

             
         $scope.loginValue = function(){
                    if($scope.user == undefined)
                            {
                                    $scope.isValidUser = true;
                                    $scope.showMessage  = "Please enter all data";       
                            }
                            else
                            {   
                                    $http.post('http://localhost:3000/isLoginData',$scope.user).then(function(response)  {
                                            //  console.log("Data = ", response.data);
                                            if(response.data.isLoggedIn){
                                                // $rootScope.$broadcast('getDataFromeServer',response.data.isLoggedIn);
                                                localStorage.isLoggedIn = response.data.isLoggedIn;
                                                localStorage.username = response.data["username"];
                                                localStorage.usertype = response.data["usertype"];   
                                                $rootScope.$broadcast('getDataFromeServer',response.data.isLoggedIn);
                                                if(response.data["usertype"] == "company")
                                                {                      
                                                    $location.path('/postaJob');
                                                }
                                                else
                                                {
                                                    $location.path('/searchJobs');
                                                }
                                            }
                                            else
                                            {
                                                $scope.isValidUser = true;
                                                $scope.showMessage  = "Username and password invalid";       

                                            }
                                        });
                             }
                     }
            
});
app.controller("cntRegister", ['$scope','$http', function($scope,$http){
    isRegister = false;
    $scope.comapany = [{
        "name" : 'Company'
    }, {
        "name": 'job_seeker'
    }];
    $scope.submitValue = function()
    {  
            if($scope.user == undefined)
            {
                
                    $scope.isRegister = true;
                    $scope.successfull  = "Please enter all data";
                    
            }
            else
            {
                     // console.log();
                    $http.post('http://localhost:3000/registerInfo',$scope.user).then(function(response)  {
                        // console.log("Data", response.data);
                        if(response.data)
                        {
                            $scope.user = "";
                            $scope.successfull  = "successfull register";
                            $scope.isRegister = true;
                        }
                        else
                        {
                            $scope.isRegister = true;
                            $scope.successfull  = "user already register";
                        }
                    });
            }
           
        // console.log($scope.user);
    }

}]);

app.controller("cntPostaJob", function($scope,$http,$location){
    $scope.postSuccess = false;
    $scope.submitJobPost = function()
    {
        if($scope.post == undefined)
        {
            console.log("value");
            $scope.postSuccess = true;
            $scope.showMessage = "Please enter all data";
        }
        else
        {
            $http.post('http://localhost:3000/insetJobPost',$scope.post).then(function(response)  {
                // console.log("Data", response.data);
                if(response.data)
                {
                    $location.path('/searchJobs')
                }
                else
                {
                    $scope.postSuccess = true;
                    $scope.showMessage = "Please check your post";
                }
            });
        }
  
    }
});

app.controller("cntSearchJobs", function($scope,$http,$location,$rootScope){
    $scope.saveJobs = function()
    {
        $location.path('/saveJobList');
    }
    $scope.searchValue = function()
    {
        if($scope.search == undefined || $scope.search.value == "" || $scope.search.value == undefined)
        {
            $scope.isTxtValue = true;
            $scope.TxtValue = "Please enter text";
        }
        else
        {
            $rootScope.serchValue = $scope.search;
            $location.path('/listJob');        
        }
    }
    $scope.resetValue = function()
    {
        $scope.search = "";
        $scope.isTxtValue = false;
    }
});

app.controller("cntListJob", function($scope,$http,$rootScope,$location){
    $scope.search = $rootScope.serchValue;
    if($scope.search == undefined || $scope.search.value == "")
    {
        $location.path('/searchJobs');
    }
    else
    {
        // console.log($scope.search);
        $http.post('http://localhost:3000/searchPost',$scope.search).then(function(response)  {
            // console.log("Data", response.data);
            if(response.data)
            {
                    $scope.postData = response.data;
            }
        });
    
    }    
    
    $scope.saveJob = function($index){
        $scope.postData[$index]["username"] = localStorage.username;
        $http.post('http://localhost:3000/savejob',$scope.postData[$index]).then(function(response)  {
            // console.log("Data", response.data);
            if(response.data)
            {
                $scope.isSaveSucessFull = true;
                $scope.showMessage = "save job successfull"; 
            }
            else
            {
                $scope.isSaveSucessFull = true;
                $scope.showMessage = "You have already saved this Job "; 
            }
        });
    }

    $scope.backToSearchPage = function()
    {
        $location.path('/searchJobs');
    }

});
app.controller("cntSaveJobList", function($scope,$http,$rootScope,$location){
    $http.get('http://localhost:3000/getAllSaveJobs').then(function(response)  {
        if(response.data)
        {
                $scope.search = "";
                $scope.saveJobData = response.data;
        }
    }); 
});


app.factory('authService',function($location){
    return{
        'checkUserLoginStatus': function()
        {
            if(localStorage.isLoggedIn == "false" || localStorage.isLoggedIn == undefined){
                $location.path('/login')
            }
            else
            {
                return false;
            }
        }
    }
});
app.factory('logout',function($location,$rootScope){
    return{
        'logOutUser': function()
        {
            localStorage.clear();
            $rootScope.$broadcast('getDataFromeServer',false);
            $location.path('/login')
        }
    }
});
app.factory('displayMenu',function($location){
 return{   
        'checkLoginOrRegisterDirection': function(){             
            if(localStorage.isLoggedIn == "false" || localStorage.isLoggedIn == undefined){
                $location.path('/login')
            }
            else
            {
               if(localStorage.usertype == "company")
               {
                    $location.path('/searchJobs')
               }
               else
               {
                    $location.path('/postaJob')    
               }
            }   
        }
    } 
});




