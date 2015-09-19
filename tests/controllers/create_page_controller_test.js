describe('CreatePageController', function(){
  var controller, scope, locationMock, apiMock, routeParamsMock, rootScopeMock;

  beforeEach(function(){
    module('StudyGroupsApp');

    locationMock = {
      path: function(path){}
    }

    routeParamsMock = {
      id: 1,
      key: 'abc'
    }

    apiMock = {
      getStudyGroup: function(id, key){
        return {
          then: function(callback){ callback({ data: { name: 'Arton opintopiiri', UserId: 1 } }) }
        }
      },
      createPage: function(page){
        return {
          then: function(callback){
            page.id = 1;
            callback({ data: page });

            return {
              catch: function(callback){ callback(); }
            }
          }
        }
      }
    }

    rootScopeMock = {
      userSignedIn: { id: 2 }
    }

    spyOn(locationMock, 'path').and.callThrough();
    spyOn(apiMock, 'getStudyGroup').and.callThrough();
    spyOn(apiMock, 'createPage').and.callThrough();

    inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      controller = $controller('CreatePageController', {
        $scope: scope,
        $location: locationMock,
        $routeParams: routeParamsMock,
        $rootScope: rootScopeMock,
        Api: apiMock
      });
    });
  });

  it('should retrieve correct study group when users lands the page', function(){
    expect(apiMock.getStudyGroup).toHaveBeenCalledWith(1, 'abc');
    expect(scope.group.name).toBe('Arton opintopiiri');
  });

  it('should redirect the user to study groups page if the user is not the study group owner', function(){
    expect(apiMock.getStudyGroup).toHaveBeenCalledWith(1, 'abc');
    expect(scope.group.UserId).toBe(1);
    expect(locationMock.path).toHaveBeenCalledWith('/study-groups');
  });

  it('should be able to create a page', function(){
    scope.newPage = { title: 'Kallen tietopankki', content: '#Otsikko' };
    scope.createPage();
    expect(apiMock.createPage).toHaveBeenCalledWith(scope.newPage);
    expect(locationMock.path).toHaveBeenCalledWith('/study-groups/1/abc/pages/1');
  });
});
