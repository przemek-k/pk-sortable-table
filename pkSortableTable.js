/**
* pk Module
*
* EXAMPLE
* <pk-sortable-table>
*     <pk-table-input-form></pk-table-input-form>
* </pk-sortable-table>
* <p>
*     <span>Filter by name and email: </span>
*     <input type="text" ng-model="filterTableBy" placeholder="Start typing to filter">
* </p>
*
*/
'use strict';

angular.module('pk', ['pk.tpls', 'pk.sortableTable']);
angular.module('pk.tpls', ['template/sortable-table.html', 'template/table-input-form.html']);

angular.module('pk.sortableTable', [])
    .directive('pkSortableTable', pkSortableTable)
    .directive('pkTableInputForm', pkTableInputForm)
    .filter('matchNameOrMail', matchNameOrMail);

function pkSortableTable () {
    var directive = {
        replace: true,
        templateUrl: 'template/sortable-table.html',
        restrict: 'E',
        transclude: true,
        scope: true,
        controller: pkSortableTableCtrl,
        link: linkFn
    };

    return directive;

    function linkFn ($scope) {
        $scope.predicate = "name";
        $scope.reverse = false;
        $scope.users = [
            {
                name: "Alfredo",
                dateOfBirth: "1982-01-12",
                mail: "some@some.pl",
                numberOfChildren: 1
            },{
                name: "Zygfryd",
                dateOfBirth: "1978-01-12",
                mail: "zygai@some.pl",
                numberOfChildren: 3
            },{
                name: "Barbara",
                dateOfBirth: "1989-01-12",
                mail: "varbra@some.pl",
                numberOfChildren: 4
            }
        ];
        $scope.sort = function(field) {
            if (field === $scope.predicate) {
                $scope.reverse = !$scope.reverse;
            } else {
                $scope.predicate = field;
                $scope.reverse = false;
            }
        };
    }
}

pkSortableTableCtrl.$inject = ['$scope'];

function pkSortableTableCtrl ($scope) {
    this.addUser = function (user) {
        $scope.users.push(user);
    };
}

function pkTableInputForm () {
    var directive = {
        restrict: 'E',
        replace: true,
        templateUrl: 'template/table-input-form.html',
        require: '^pkSortableTable',
        link: linkFn
    };

    return directive;

    function linkFn ($scope, iElm, iAttrs, controller) {
        $scope.user = {
            name: "",
            dateOfBirth: "",
            mail: "",
            numberOfChildren: ""
        };

        $scope.submit = function () {
            if ($scope.captureUserData.$valid) {
                controller.addUser($scope.user);
                $scope.user = {
                    name: "",
                    dateOfBirth: "",
                    mail: "",
                    numberOfChildren: ""
                };
            }
        };
    }
}

function matchNameOrMail () {
    return function (users, query) {
        var filtered = [],
            query = query || "",
            user;

        for (var i = 0, length = users.length; i < length; i++) {
            user = users[i];
            if (user.name.toLowerCase().match(query.toLowerCase()) || user.mail.toLowerCase().match(query.toLowerCase())) {
                filtered.push(user);
            }
        }

        return filtered;
    };
}

angular.module('template/table-input-form.html', []).run(["$templateCache", function($templateCache) {
    $templateCache.put('template/table-input-form.html',
        [
            "<ng-form name=\"captureUserData\">",
            "    <fieldset style='border: 1px solid black; width: 430px;'>",
            "       <legend><strong>Add Person Details</strong></legend>",
            "       <input type=\"text\" ng-model=\"user.name\" name=\"name\" placeholder=\"Enter name\" required>",
            "       Name is valid = {{captureUserData.name.$valid}}<br>",
            "       <input type=\"date\" ng-model=\"user.dateOfBirth\" name=\"dateOfBirth\" required>",
            "       Date of birth is valid = {{captureUserData.dateOfBirth.$valid}}<br>",
            "       <input type=\"email\" ng-model=\"user.mail\" name=\"mail\" placeholder=\"Enter email\" required>",
            "       Mail is valid = {{captureUserData.mail.$valid}}<br>",
            "       <input type=\"number\" ng-model=\"user.numberOfChildren\" name=\"numberOfChildren\" placeholder=\"Number of children\" required>",
            "       Number of children is valid = {{captureUserData.numberOfChildren.$valid}}<br><br>",
            "       <button ng-click=\"submit()\">SUBMIT</button>",
            "       Form is valid = {{captureUserData.$valid}}",
            "   </fieldset>",
            "</ng-form>"
        ].join('\n')
    );
}]);

angular.module('template/sortable-table.html', []).run(["$templateCache", function($templateCache) {
    $templateCache.put('template/sortable-table.html',
        [
            "<div>",
            "<div ng-transclude></div>",
            "<p>Sorted column: <strong><span ng-if=\"predicate==='name'\">Name</span><span ng-if=\"predicate==='dateOfBirth'\">Date of birth</span><span ng-if=\"predicate==='mail'\">Mail</span><span ng-if=\"predicate==='numberOfChildren'\">Number of children</span></strong> Sorted order: <strong><span ng-if=\"!reverse\">Ascending</span><span ng-if=\"reverse\">Descending</span></p></strong>",
            "<table border='1'>",
            "    <thead>",
            "        <tr>",
            "            <th ng-click=\"sort('name')\">Name</th>",
            "            <th ng-click=\"sort('dateOfBirth')\">Date of birth</th>",
            "            <th ng-click=\"sort('mail')\">Mail</th>",
            "            <th ng-click=\"sort('numberOfChildren')\">Number of children</th>",
            "        </tr>",
            "    </thead>",
            "    <tbody>",
            "        <tr ng-repeat=\"user in filteredUsers = (users | matchNameOrMail:filterTableBy | orderBy:predicate:reverse)\">",
            "            <td>{{user.name}}</td>",
            "            <td>{{user.dateOfBirth}}</td>",
            "            <td>{{user.mail}}</td>",
            "            <td>{{user.numberOfChildren}}</td>",
            "        </tr>",
            "        <tr ng-if=\"filteredUsers.length === 0\">",
            "            <td colspan=\"4\">No results matching criteria..</td>",
            "        </tr>",
            "    </tbody>",
            "</table>",
            "</div>"
        ].join('\n')
    );
}]);