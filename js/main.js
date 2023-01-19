var initialData = [
    { id: 1, name: "Airi Satou", position: "Accountant", office: "Tokyo", age: 33, startDate: "11/28/2008", salary: "162.700" },
    { id: 2, name: "Angelica Ramos", position: "Chief Executive Officer (CEO)", office: "London", age: 47, startDate: "10/9/2009", salary: "127.04" },
    { id: 3, name: "Ashton Cox", position: "Junior Technical Author", office: "San Francisco", age: 66, startDate: "1/12/2009", salary: "12.332" },
    { id: 4, name: "Bradley Greer", position: "Software Engineer", office: "London", age: 41, startDate: "10/13/2012", salary: "12.332" },
    { id: 5, name: "Brielle Williamson", position: "Integration Specialist", office: "New York", age: 61, startDate: "12/2/2012", salary: "12.332" },
    { id: 6, name: "Caesar Vance", position: "Sales Assistant", office: "New York", age: 46, startDate: "12/6/2011", salary: "12.332" },
    { id: 7, name: "Cara Stevens", position: "Sales Assistant", office: "Edinburgh", age: 21, startDate: "5/3/2011", salary: "12.332" },
    { id: 8, name: "Cara Stevens", position: "Sales Assistant", office: "Edinburgh", age: 21, startDate: "5/3/2011", salary: "12.332" },
    { id: 9, name: "Airi Satou", position: "Accountant", office: "Tokyo", age: 33, startDate: "11/28/2008", salary: 120 },
    { id: 10, name: "Angelica Ramos", position: "Chief Executive Officer (CEO)", office: "London", age: 47, startDate: "10/9/2009", salary: "12.332" },
    { id: 11, name: "Ashton Cox", position: "Junior Technical Author", office: "San Francisco", age: 66, startDate: "1/12/2009", salary: "12.332" },
    { id: 12, name: "Bradley Greer", position: "Software Engineer", office: "London", age: 41, startDate: "10/13/2012", salary: "12.332" },
    { id: 13, name: "Brielle Williamson", position: "Integration Specialist", office: "New York", age: 61, startDate: "12/2/2012", salary: "12.332" },
    { id: 14, name: "Caesar Vance", position: "Sales Assistant", office: "New York", age: 46, startDate: "12/6/2011", salary: "12.332" },
    { id: 15, name: "Cara Stevens", position: "Sales Assistant", office: "Edinburgh", age: 21, startDate: "5/3/2011", salary: "12.332" },
    { id: 16, name: "Cara Stevens", position: "Sales Assistant", office: "Edinburgh", age: 21, startDate: "5/3/2011", salary: "12.332"},
    { id: 17, name: "Airi Satou", position: "Accountant", office: "Tokyo", age: 33, startDate: "11/28/2008", salary: "12.332"},
    { id: 18, name: "Angelica Ramos", position: "Chief Executive Officer (CEO)", office: "London", age: 47, startDate: "10/9/2009", salary: "12.332" },
    { id: 19, name: "Ashton Cox", position: "Junior Technical Author", office: "San Francisco", age: 66, startDate: "1/12/2009", salary: "12.332" },
    { id: 20, name: "Bradley Greer", position: "Software Engineer", office: "London", age: 41, startDate: "10/13/2012", salary: "12.332" },
    { id: 21, name: "Brielle Williamson", position: "Integration Specialist", office: "New York", age: 61, startDate: "12/2/2012", salary: "12.332" },
    { id: 22, name: "Caesar Vance", position: "Sales Assistant", office: "New York", age: 46, startDate: "12/6/2011", salary: "12.332" },
    { id: 23, name: "Cara Stevens", position: "Sales Assistant", office: "Edinburgh", age: 21, startDate: "5/3/2011", salary: "12.332" },
    { id: 24, name: "Cara Stevens", position: "Sales Assistant", office: "Edinburgh", age: 21, startDate: "5/3/2011", salary: "12.332" },
];

function Information(id, name, position, office, age, startDate, salary, match = true) {
    this.id = id;
    this.name = ko.observable(name);
    this.position = ko.observable(position);
    this.office = ko.observable(office);
    this.age = ko.observable(age);
    this.startDate = ko.observable(startDate);
    this.salary = ko.observable(salary);
    this.match = ko.observable(match);
}

var PagedGridModel = function(items) {
    // this.items = ko.observableArray(items);
    this.items = ko.observableArray(items.map(function (item) {
        return new Information(item.id, item.name, item.position, item.office, item.age, item.startDate, item.salary, item.match);
    }));

    this.gridViewModel = new ko.simpleGrid.viewModel({
        data: this.items,
        columns: [
            { headerText: "Id", rowText: "id", show: false},
            { headerText: "Name", rowText: "name", show: true},
            { headerText: "Position", rowText: "position", show: true},
            { headerText: "Office", rowText: "office", show: true},
            { headerText: "Age", rowText: "age", show: true},
            { headerText: "Start date", rowText: "startDate", show: true},
        ],
        pageSize: 5
    });
};

ko.applyBindings(new PagedGridModel(initialData));