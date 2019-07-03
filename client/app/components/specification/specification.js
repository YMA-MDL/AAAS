angular.module('app.openrequirements.specification', [
  'app.openreq.service.specification',
  'app.openreq.service.requirement',
  'angular-click-outside',
  'ngSanitize',
  'angular-medium-editor',
  'as.sortable',
  'ui.bootstrap.contextMenu',
  'ngTagsInput',
  'rzTable',
  'app.user.config'
]).controller('specificationController', function ($scope, $rootScope, $document, specificationModel, requirementModel, $location, userconf, $routeParams) {

  // ██╗      ██████╗  █████╗ ██████╗ 
  // ██║     ██╔═══██╗██╔══██╗██╔══██╗
  // ██║     ██║   ██║███████║██║  ██║
  // ██║     ██║   ██║██╔══██║██║  ██║
  // ███████╗╚██████╔╝██║  ██║██████╔╝
  // ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ 






  if (!userconf.isLoggedIn()) {
    $location.path('/login');
  }

  mixpanel.track("open specification");

  $scope.logout = () => {
    userconf.logout();
    $location.path('/login');
  }

  // allows to go to the next line same column if arrow down
  $(document).keydown(function (e) {
    var cellindex = $(e.target).closest('td').index();

    if (e.which == 40) {
      $(e.target).closest('tr').nextAll('tr').find('td').eq(cellindex).find(':text').focus();
    }

    if (e.which == 38) {
      $(e.target).closest('tr').prevAll('tr').first().find('td').eq(cellindex).find(':text').focus();
    }
  });

  $scope.menuOptions = [
    // NEW IMPLEMENTATION
    {
      text: '<i class="far fa-plus-square"></i> Add New Requirement',
      click: function ($itemScope, $event, modelValue, text, $li) {
        console.log("TCL: $itemScope", $itemScope)
        $scope.addRequirement($itemScope.requirement.sortIndex + 1);
      }
    },
    {
      text: '<i class="fas fa-indent"></i> Indent',
      click: function ($itemScope, $event, modelValue, text, $li) {
        $scope.items.splice($itemScope.$index, 1);
      }
    },
    {
      text: '<i class="fas fa-outdent"></i> Outdent',
      click: function ($itemScope, $event, modelValue, text, $li) {
        $scope.items.splice($itemScope.$index, 1);
      }
    },
    null, // Dividier
    ['Remove', function ($itemScope, $event, modelValue, text, $li) {
      console.log($itemScope);
      $scope.deleteRequirement($itemScope.requirement);
    }]
  ];
  $scope.specificationId = $routeParams.specificationId;
  $scope.selectedTab = "editor";
  $scope.requirementTypes = ['Business', 'Market', 'Functional', 'Non-Functional', 'UI', 'Behavioral', 'Quality', 'Stakeholder', 'General'];
  $scope.requirementStatus = ['new', 'in Progress', 'on Hold', 'Cancelled', 'Completed'];
  $scope.docLoading = true;
  $scope.editable = true;


  requirementModel.getRequirements($scope.specificationId)
    .then((result) => {
      $scope.docLoading = false;
      $scope.specification = result.data.specification;
      $scope.requirements = result.data.requirements;

      const ImageTool = window.ImageTool;
      const editor = new EditorJS(
        {
          holderId: 'codex-editor', 
          tools: {
            header: Header, 
            warning: Warning,
            image: {
              class: ImageTool,
              config: {
                endpoints: {
                  byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
                  byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
                }
              }
            }
          }

        });
      // init text area
    })
    .catch((err) => {
      $scope.docLoading = false;
      console.error(err);
    })

  $scope.deleteRequirement = (requirement) => {
    requirementModel.deleteRequirement($scope.specificationId, requirement._id)
      .then((result) => {

        mixpanel.track("remove requirement");
        var index = $scope.requirements.indexOf(requirement);
        $scope.requirements.splice(index, 1);
      })
      .catch((err) => {
        console.log("TCL: $scope.deleteRequirement -> err", err)
      })
  }

  $rootScope.selectedRow = null;

  $scope.updateRequirement = (requirement, index) => {
    mixpanel.track("update requirement");
    requirement.sortIndex = index;
    requirementModel.updateRequirement($scope.specificationId, requirement._id, requirement)
      .then((result) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 2000
        });

        Toast.fire({
          type: 'success',
          title: 'Updated'
        })
      })
      .catch((err) => {
        console.log("TCL: $scope.deleteRequirement -> err", err)
      })
  };



  $scope.updateRequirementType = (requirement, type, sortIndex) => {
    mixpanel.track("update requirement type");
    requirement.type = type;
    requirement.sortIndex = sortIndex;
    $scope.updateRequirement(requirement);
  };

  $scope.updateRequirementStatus = (requirement, status, sortIndex) => {
    mixpanel.track("update requirement status");
    requirement.status = status;
    requirement.sortIndex = sortIndex;
    $scope.updateRequirement(requirement);
  };

  $scope.sortableOptions = {
    containment: '#requirements',
    placeholder: function (itemScope) {
      var tr = itemScope.element[0];
      var placeholder = $document[0].createElement("tr");
      placeholder.style.display = 'table-row';

      for (var i = 0; tr.cells[i]; i++) {
        var cell = placeholder.insertCell(i);
        cell.innerHTML = tr.cells[i].innerHTML;
      }

      return placeholder;
    }
  };


  $scope.addRequirement = (sortIndex) => {
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1']
    }).queue([
      {
        title: 'Title',
        text: 'Set a requirement title'
      }
    ]).then((result) => {
      console.log("TCL: $scope.addRequirement -> result", result)
      if (result.value) {
        requirementModel.createRequirement(
          $scope.specificationId,
          {
            ref: "REQ000001",
            title: result.value[0],
            sortIndex: sortIndex
          }
        ).then((requirement) => {
          console.log("TCL: $scope.addRequirement -> requirement", requirement)
          $scope.requirements.push(requirement.data);
          mixpanel.track("add requirement");
        }).catch((err) => {
          Swal.fire({
            position: 'top-end',
            type: 'error',
            title: 'Could not add the requirement',
            showConfirmButton: false,
            timer: 1500
          })
        })

      }
    })
  };

  /* sliding menus */
  // GIT
  $scope.graphPanelOpen = false;

  $scope.toggleGitGraph = () => {
    $scope.graphPanelOpen = !$scope.graphPanelOpen;
  };

  $scope.closeGitGraph = () => {
    $scope.graphPanelOpen = false;
  }

  // File
  $scope.filePanelOpen = false;
  $scope.toggleFilePanel = () => {
    $scope.filePanelOpen = !$scope.filePanelOpen;
  };

  $scope.closeFilePanel = () => {
    $scope.filePanelOpen = false;
  }

  // Discussion
  $scope.discussionPanelOpen = false;
  $scope.toggleDiscussionPanel = () => {
    $scope.discussionPanelOpen = !$scope.discussionPanelOpen;
  };

  $scope.closeDiscussionPanel = () => {
    $scope.discussionPanelOpen = false;
  }

  // People
  $scope.peoplePanelOpen = false;
  $scope.togglePeoplePanel = () => {
    $scope.peoplePanelOpen = !$scope.peoplePanelOpen;
  };

  $scope.closePeoplePanel = () => {
    $scope.peoplePanelOpen = false;
  }



  // ███████╗██╗   ██╗███╗   ██╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗
  // ██╔════╝██║   ██║████╗  ██║██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
  // █████╗  ██║   ██║██╔██╗ ██║██║        ██║   ██║██║   ██║██╔██╗ ██║███████╗
  // ██╔══╝  ██║   ██║██║╚██╗██║██║        ██║   ██║██║   ██║██║╚██╗██║╚════██║
  // ██║     ╚██████╔╝██║ ╚████║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║███████║
  // ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝


  $scope.openFile = (file) => {

  }

  $scope.save = () => {
    console.log($scope.liveContent)
    // update
  }

  $scope.openItemAccessModal = () => {
    Swal.fire({
      title: 'User Email?',
      input: 'text',
      showCancelButton: true,
    }).then((result) => {
      // test if user already exists
      specificationModel.sendUserInvite(result.value, $scope.specificationId)
        .then((result) => {
          mixpanel.track("invite collaborator");
          console.log("TCL: $scope.openItemAccessModal -> result", result)

        })
        .catch((err) => {
          console.log("TCL: $scope.openItemAccessModal -> err", err)

        })
      // if not ask for a nickname
    })
  }

  $scope.sortableOptions.orderChanged = (event) => {
    console.log("TCL: orderChanged", event)
    //Do what you want
  };


  $scope.returnToList = () => {
    $location.search('specification', null);
  }



})
