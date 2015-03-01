'use strict';

describe('pk module', function () {
    var $scope;

    beforeEach(module('pk.sortableTable'));
    beforeEach(module('template/sortable-table.html'));
    beforeEach(module('template/table-input-form.html'));

    describe('Filter', function() {

        describe('matchNameOrMailFilter', function() {

            var users, filter;

            beforeEach(function () {
                users = [
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
            });

            beforeEach(inject(function (matchNameOrMailFilter) {
                filter = matchNameOrMailFilter;
            }));

            it('should be defined', function() {
                expect(filter).not.toBeNull();
            });

            it('should respond with same array when every name or mail contain query case insensitive', function() {
                var query = 'A';
                expect(filter(users, query)).toEqual(users);
            });

            it('should filter users when not all of them pass predicate function', function() {
                var query = 'z',
                result = [{
                    name: "Zygfryd",
                    dateOfBirth: "1978-01-12",
                    mail: "zygai@some.pl",
                    numberOfChildren: 3
                }];

                expect(filter(users, query)).toEqual(result);
            });

            it('should respond with empty array when non of the users pass predicate', function() {
                var query = '1',
                result = [];

                expect(filter(users, query)).toEqual(result);
            });
        });
    });

    describe('Sortable table', function() {
        var scope, $compile, element;

        beforeEach(inject(function (_$rootScope_, _$compile_) {
            scope = _$rootScope_;
            $compile = _$compile_;
        }));

        afterEach(function () {
            scope = $compile = undefined;
        });

        describe('Compiling directive', function() {
            beforeEach(function () {
                var tpl = [
                    "<pk-sortable-table>",
                        "<pk-table-input-form></pk-table-input-form>",
                    "</pk-sortable-table>"
                ].join('\n');
                element = angular.element(tpl);
                $compile(element)(scope);
                scope.$digest();
            });

            afterEach(function() {
                element.remove();
            });

            it('should display form', function() {
                expect(element.find('ng-form').length).toEqual(1);
                expect(element.find('fieldset').length).toEqual(1);
                expect(element.find('legend').text()).toEqual("Add Person Details");
                expect(element.find('input').length).toEqual(4);
                for (var i = 0, length = element.find('input').length; i < length; i++) {
                    expect(element.find('input').text()).toEqual("");
                }
                expect(element.find('button').text()).toEqual('SUBMIT');
            });

            it('should display table header titles', function() {
                expect(element.find('th').length).toEqual(4);
                expect(element.find('th').eq(0).text()).toEqual('Name');
                expect(element.find('th').eq(1).text()).toEqual('Date of birth');
                expect(element.find('th').eq(2).text()).toEqual('Mail');
                expect(element.find('th').eq(3).text()).toEqual('Number of children');
            });
        });
    });
});