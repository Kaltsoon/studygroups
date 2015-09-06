describe('ProfileController', function(){
  var controller, scope, locationMock, apiMock, routeParamsMock, windowMock;

  beforeEach(function(){
    module('StudyGroupsApp');

    locationMock = {
      path: function(path){}
    }

    var dummyCallback = {
      then: function(callback){ callback() }
    };

    apiMock = {
      getUser: function(name){
        return {
          then: function(callback){ callback({ data: { username: 'kalle', email: 'kalle@osoite.com', description: 'Olen Kalle', id: 1 } }) }
        }
      },
      updateUser: function(user){
        return dummyCallback;
      },
      removeUser: function(id){
        return dummyCallback;
      }
    }

    routeParamsMock = {
      username: 'kalle'
    }

    windowMock = { location: { replace: function(location){ return true } } }

    spyOn(locationMock, 'path').and.callThrough();
    spyOn(apiMock, 'getUser').and.callThrough();
    spyOn(apiMock, 'updateUser').and.callThrough();
    spyOn(apiMock, 'removeUser').and.callThrough();
    spyOn(windowMock.location, 'replace').and.callThrough();
    spyOn(window, 'confirm').and.returnValue(true);

    inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      controller = $controller('ProfileController', {
        $scope: scope,
        $location: locationMock,
        $routeParams: routeParamsMock,
        $window: windowMock,
        Api: apiMock
      });
    });
  });

  it('should have the right profile', function(){
    expect(apiMock.getUser).toHaveBeenCalledWith('kalle');
    expect(scope.user.username).toBe('kalle');
  });

  it('should be able to update profile', function(){
    scope.editedUser = {
      email: 'elina@osoite.com',
      description: '**Olen elina**'
    };

    scope.updateProfile();

    expect(apiMock.updateUser).toHaveBeenCalledWith(scope.editedUser);
    expect(scope.isEditing).toBe(false);
    expect(scope.user.email).toBe('elina@osoite.com');
    expect(scope.user.description).toBe('**Olen elina**');
  });

  it('should be able to remove profile', function(){
    scope.removeProfile();

    expect(apiMock.removeUser).toHaveBeenCalledWith(1);
    expect(windowMock.location.replace).toHaveBeenCalledWith('/welcome');
  });

});
