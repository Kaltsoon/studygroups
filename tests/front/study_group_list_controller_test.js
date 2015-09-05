describe('StudyGroupListController', function(){
  var controller, scope, locationMock, apiMock;

  beforeEach(function(){
    module('StudyGroupsApp');

    locationMock = {
      path: function(path){}
    }

    apiMock = {
      getUsersStudyGroups: function(){
        return {
            then: function(callback){ callback({ data: [{ name: 'Kallen salaseura' }, { name: 'Gurulan lautapeliseura' }] }) }
        }
      },
      createStudyGroup: function(){
        return {
          then: function(callback){ callback({ data: { name: 'Luotu ryhmä', id: 1, key: 'abc' } }) }
        }
      }
    }

    spyOn(locationMock, 'path').and.callThrough();
    spyOn(apiMock, 'getUsersStudyGroups').and.callThrough();
    spyOn(apiMock, 'createStudyGroup').and.callThrough();

    inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      controller = $controller('StudyGroupListController', {
        $scope: scope,
        $location: locationMock,
        Api: apiMock
      });
    });
  });

  it('should have users study groups listed', function(){
    expect(apiMock.getUsersStudyGroups).toHaveBeenCalled();
    expect(scope.groups.length).toBe(2);
    expect(scope.groups[0].name).toBe('Kallen salaseura');
  });

  it('should be able to add a new study group', function(){
    scope.newStudyGroup = { name: 'Matin node.js-kerho', description: '**Node.js FTW!**' };
    scope.createStudyGroup();
    expect(apiMock.createStudyGroup).toHaveBeenCalledWith(scope.newStudyGroup);
    expect(locationMock.path).toHaveBeenCalledWith('/study-groups/1/abc');
  });
});
