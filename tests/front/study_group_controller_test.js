describe('StudyGroupController', function(){
  var controller, scope, locationMock, apiMock, routeParamsMock;

  beforeEach(function(){
    module('StudyGroupsApp');

    locationMock = {
      path: function(path){},
      absUrl: function(){ return '' }
    }

    routeParamsMock = {
      id: 1,
      key: 'abc'
    }

    var dummyCallback = {
      then: function(callback){ callback() }
    };

    apiMock = {
      getStudyGroup: function(id){
        return {
          then: function(callback){
            callback({ data: { name: 'Arton opintopiiri', UserId: 1 } })

            return {
              catch: function(callback){ callback() }
            }
          }
        }
      },
      removeStudyGroup: function(id){
        return dummyCallback;
      },
      updateStudyGroup: function(page){
        return dummyCallback;
      }
    }

    spyOn(apiMock, 'getStudyGroup').and.callThrough();
    spyOn(apiMock, 'removeStudyGroup').and.callThrough();
    spyOn(apiMock, 'updateStudyGroup').and.callThrough();
    spyOn(locationMock, 'path').and.callThrough();
    spyOn(window, 'confirm').and.returnValue(true);

    inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      controller = $controller('StudyGroupController', {
        $scope: scope,
        $location: locationMock,
        $routeParams: routeParamsMock,
        Api: apiMock
      });
    });
  });

  it('should display the correct study group', function(){
    expect(apiMock.getStudyGroup).toHaveBeenCalledWith(1, 'abc');
    expect(scope.group.name).toBe('Arton opintopiiri');
  });

  it('should be able to update the study group', function(){
    scope.editedGroup = {
      name: 'Arton opintopiiri',
      description: 'Täällä opitaan ohjelmoimaan'
    };

    scope.updateStudyGroup();

    expect(apiMock.updateStudyGroup).toHaveBeenCalledWith(scope.editedGroup);
    expect(scope.isEditing).toBe(false);
    expect(scope.group.name).toBe('Arton opintopiiri');
    expect(scope.group.description).toBe('Täällä opitaan ohjelmoimaan');
  });

  it('should be able to remove the studyGroup', function(){
    scope.removeStudyGroup();

    expect(locationMock.path).toHaveBeenCalledWith('/study-groups');
  });

});
