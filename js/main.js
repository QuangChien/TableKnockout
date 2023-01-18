var initialData = [
    { name: "Airi Satou", position: "Accountant", office: "Tokyo", age: 33, startDate: "11/28/2008" },
    { name: "Angelica Ramos", position: "Chief Executive Officer (CEO)", office: "London", age: 47, startDate: "10/9/2009" },
    { name: "Ashton Cox", position: "Junior Technical Author", office: "San Francisco", age: 66, startDate: "1/12/2009" },
    { name: "Bradley Greer", position: "Software Engineer", office: "London", age: 41, startDate: "10/13/2012" },
    { name: "Brielle Williamson", position: "Integration Specialist", office: "New York", age: 61, startDate: "12/2/2012" },
    { name: "Caesar Vance", position: "Sales Assistant", office: "New York", age: 46, startDate: "12/6/2011" },
    { name: "Cara Stevens", position: "Sales Assistant", office: "Edinburgh", age: 21, startDate: "5/3/2011" },
    { name: "Cara Stevens", position: "Sales Assistant", office: "Edinburgh", age: 21, startDate: "5/3/2011" },
    { name: "Airi Satou", position: "Accountant", office: "Tokyo", age: 33, startDate: "11/28/2008" },
    { name: "Angelica Ramos", position: "Chief Executive Officer (CEO)", office: "London", age: 47, startDate: "10/9/2009" },
    { name: "Ashton Cox", position: "Junior Technical Author", office: "San Francisco", age: 66, startDate: "1/12/2009" },
    { name: "Bradley Greer", position: "Software Engineer", office: "London", age: 41, startDate: "10/13/2012" },
    { name: "Brielle Williamson", position: "Integration Specialist", office: "New York", age: 61, startDate: "12/2/2012" },
    { name: "Caesar Vance", position: "Sales Assistant", office: "New York", age: 46, startDate: "12/6/2011" },
    { name: "Cara Stevens", position: "Sales Assistant", office: "Edinburgh", age: 21, startDate: "5/3/2011" },
    { name: "Cara Stevens", position: "Sales Assistant", office: "Edinburgh", age: 21, startDate: "5/3/2011" },
    { name: "Airi Satou", position: "Accountant", office: "Tokyo", age: 33, startDate: "11/28/2008" },
    { name: "Angelica Ramos", position: "Chief Executive Officer (CEO)", office: "London", age: 47, startDate: "10/9/2009" },
    { name: "Ashton Cox", position: "Junior Technical Author", office: "San Francisco", age: 66, startDate: "1/12/2009" },
    { name: "Bradley Greer", position: "Software Engineer", office: "London", age: 41, startDate: "10/13/2012" },
    { name: "Brielle Williamson", position: "Integration Specialist", office: "New York", age: 61, startDate: "12/2/2012" },
    { name: "Caesar Vance", position: "Sales Assistant", office: "New York", age: 46, startDate: "12/6/2011" },
    { name: "Cara Stevens", position: "Sales Assistant", office: "Edinburgh", age: 21, startDate: "5/3/2011" },
    { name: "Cara Stevens", position: "Sales Assistant", office: "Edinburgh", age: 21, startDate: "5/3/2011" },
];

function Information(name, position, office, age, startDate, salary, isFiltered = true) {
    this.name = ko.observable(name);
    this.position = ko.observable(position);
    this.office = ko.observable(office);
    this.age = ko.observable(age);
    this.startDate = ko.observable(startDate);
    this.salary = ko.observable(salary);
    this.isFiltered = ko.observable(isFiltered);
}

var PagedGridModel = function(items) {
    // this.items = ko.observableArray(items);
    this.items = ko.observableArray(items.map(function (item) {
        return new Information(item.name, item.position, item.office, item.age, item.startDate, item.salary, item.isFiltered);
    }));

    this.gridViewModel = new ko.simpleGrid.viewModel({
        data: this.items,
        columns: [
            { headerText: "Name", rowText: "name"},
            { headerText: "Position", rowText: "position"},
            { headerText: "Office", rowText: "office"},
            { headerText: "Age", rowText: "age"},
            { headerText: "Start date", rowText: "startDate"},
        ],
        pageSize: 5
    });
};

ko.applyBindings(new PagedGridModel(initialData));