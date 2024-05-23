const app = angular.module("myapp", []);
app.controller("mycontro", ($scope, $http) => {
  $scope.queryallpoly = () => {
    $http.get("/getalldome").then(
      (response) => {
        $scope.cards = response.data;
        console.log("Fetched domes:", $scope.cards);
      },
      (error) => {
        console.error("Error fetching domes:", error);
        alert("Something went wrong! Please try again later.");
      }
    );
  };

  $scope.addpolyhs = () => {
    $http({
      url: "/createdome",
      method: "POST",
      data: {
        name: $scope.name,
        desc: $scope.desc,
      },
    }).then(
      (response) => {
        console.log(response.data);
        if (response.data.status === "ok") {
          $scope.message = "Dome created successfully!";
          $scope.queryallpoly();
        } else {
          $scope.message = "Something went wrong!";
        }
        myModal.show();
      },
      (error) => {
        console.error("Error creating dome:", error);
      }
    );
  };

  $scope.editpolybox = (id, name, desc) => {
    $scope.editname = name;
    $scope.editdesc = desc;
    $scope.editid = id;
  };

  $scope.updatepoly = (id) => {
    console.warn("Updating dome", id);
    $http({
      url: `/editdomedetails/${id}`,
      method: "PATCH",
      data: {
        name: $scope.editname,
        desc: $scope.editdesc,
      },
    }).then(
      (response) => {
        console.log(response.data);
        if (response.data.status === "ok") {
          alert("Dome updated successfully!");
          $scope.queryallpoly();
        } else {
          alert(response.data.message);
          $scope.queryallpoly();
        }
        editboxmodal.hide();
      },
      (error) => {
        console.error("Error updating dome:", error);
        editboxmodal.hide();
      }
    );
  };

  $scope.deleteDome = (id) => {
    if (confirm("Are you sure you want to delete this dome?")) {
      $http({
        url: `/delete/${id}`,
        method: "GET"
      }).then(
        (response) => {
          console.log("Delete response:", response.data);
          if (response.data.status === "ok") {
            alert("Dome deleted successfully!");
            $scope.queryallpoly();
          } else {
            alert(response.data.message);
          }
        },
        (error) => {
          console.error("Error deleting dome:", error);
          alert("Something went wrong! Please try again later.");
        }
      );
    }
  };


  $scope.queryallpoly();
});
