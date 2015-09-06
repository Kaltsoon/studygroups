describe('PageController', function(){
  var controller, scope, locationMock, apiMock, routeParamsMock;

  beforeEach(function(){
    module('StudyGroupsApp');

    locationMock = {
      path: function(path){}
    }

    routeParamsMock = {
      pageId: 1,
      groupId: 1,
      key: 'abc'
    }

    var dummyCallback = {
      then: function(callback){ callback() }
    };

    apiMock = {
      getPage: function(id, key){
        return {
          then: function(callback){
            callback({ data: { title: 'Kallen salaseura', content: 'Lorem ipsum', id: 1, Highlights: [] } })

            return {
              catch: function(callback){ callback() }
            }
          }
        }
      },
      removePage: function(id){
        return dummyCallback;
      },
      updatePage: function(page){
        return dummyCallback;
      },
      createHighlight: function(highlight){
        return dummyCallback;
      },
      removeHighlightings: function(id){
        return dummyCallback;
      }
    }

    spyOn(apiMock, 'getPage').and.callThrough();
    spyOn(apiMock, 'removePage').and.callThrough();
    spyOn(apiMock, 'updatePage').and.callThrough();
    spyOn(apiMock, 'createHighlight').and.callThrough();
    spyOn(apiMock, 'removeHighlightings').and.callThrough();
    spyOn(locationMock, 'path').and.callThrough();
    spyOn(window, 'confirm').and.returnValue(true);

    inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      controller = $controller('PageController', {
        $scope: scope,
        $location: locationMock,
        $routeParams: routeParamsMock,
        Api: apiMock
      });
    });
  });

  it('should display the correct page', function(){
    expect(apiMock.getPage).toHaveBeenCalledWith(1, 'abc');
    expect(scope.page.title).toBe('Kallen salaseura');
  });

  it('should be able to update the page', function(){
    scope.editedPage = {
      title: 'Arton opintopiiri',
      content: '**Materiaali**'
    };

    scope.updatePage();

    expect(apiMock.updatePage).toHaveBeenCalledWith(scope.editedPage);
    expect(scope.isEditing).toBe(false);
    expect(scope.page.title).toBe('Arton opintopiiri');
    expect(scope.page.content).toBe('**Materiaali**');
  });

  it('should be able to remove the page', function(){
    scope.removePage();

    expect(locationMock.path).toHaveBeenCalledWith('/study-groups/1/abc')
  });

  it('should be able to highlight text with more than or equal to 3 words', function(){
    expect(scope.page.Highlights.length).toBe(0);

    scope.currentlyHighlightedSection = 'Lorem ipsum dolor';

    scope.highlight('success');

    expect(apiMock.createHighlight).toHaveBeenCalledWith({ type: 'success', text: 'Lorem ipsum dolor', PageId: 1 });
    expect(scope.page.Highlights.length).toBe(1);
  });

  it('should not be able to highlight text with less than 3 words', function(){
    expect(scope.page.Highlights.length).toBe(0);

    scope.currentlyHighlightedSection = 'Lorem ipsum';

    scope.highlight('success');

    expect(apiMock.createHighlight).not.toHaveBeenCalled()
    expect(scope.page.Highlights.length).toBe(0);
  });

  it('should be able to remove all highlightins', function(){
    scope.page.Highlights.push({ type: 'success', text: 'Lorem ipsum dolor', PageId: 1 });
    scope.removeHighlightings();

    expect(apiMock.removeHighlightings).toHaveBeenCalledWith(1);
    expect(scope.page.Highlights.length).toBe(0);
  });
});
