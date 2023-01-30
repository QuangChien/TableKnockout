var initialData = [
    { name: "Kiri Satou", position: "Accountant", office: "Tokyo", age: 33, startDate: "11/28/2008", salary: "$162,700" },
    { name: "Angelica Ramos", position: "Chief Executive Officer (CEO)", office: "London", age: 47, startDate: "10/9/2009", salary: "$1,200,000" },
    { name: "Ashton Cox", position: "Junior Technical Author", office: "San Francisco", age: 66, startDate: "1/12/2009", salary: "$86,000" },
    { name: "Bradley Greer", position: "Software Engineer", office: "London", age: 41, startDate: "10/13/2012", salary: "$132,000" },
    { name: "Brielle Williamson", position: "Integration Specialist", office: "New York", age: 61, startDate: "12/2/2012", salary: "$206,850" },
    { name: "Caesar Vance", position: "Sales Assistant", office: "New York", age: 46, startDate: "12/6/2011", salary: "$372,000" },
    { name: "Cara Stevens", position: "Sales Assistant", office: "Edinburgh", age: 21, startDate: "5/3/2011", salary: "$145,600" },
    { name: "Cedric Kelly", position: "Senior Javascript Developer", office: "Edinburgh", age: 22, startDate: "3/29/2012", salary: " $433,060" },
    { name: "Charde Marshall", position: "Regional Director", office: "San Francisco", age: 36, startDate: "10/16/2008", salary: "$470,600" },
    { name: "Colleen Hurst", position: "Javascript Developer", office: "San Francisco", age: 39, startDate: "9/15/2009", salary: "$205,500" },
    { name: "Dai Rios", position: "Personnel Lead", office: "Sydney", age: 23, startDate: "9/20/2010", salary: "$85,600" },
    { name: "Finn Camacho", position: "Support Engineer", office: "San Francisco", age: 47, startDate: "7/7/2009", salary: "$87,500" },
    { name: "Fiona Green", position: "Chief Operating Officer (COO)", office: "Singapore", age: 48, startDate: "3/11/2010", salary: "$850,000" },
    { name: "Garrett Winters", position: "Accountant", office: "Tokyo", age: 63, startDate: "7/25/2011", salary: "$170,750" },
    { name: "Gavin Cortez", position: "Team Leader", office: "San Francisco", age: 47, startDate: "10/26/2008", salary: "$235,500" },
    { name: "Gavin Joyce", position: "Team Leader", office: "Sydney", age: 22, startDate: "10/26/2008", salary: "$235,500" },
    { name: "Quinn Flynn", position: "Support Lead", office: "Edinburgh", age: 63, startDate: "3/3/2013", salary: "$342,000" },
    { name: "Doris Wilder", position: "Sales Assistant", office: "Sydney", age: 23, startDate: "9/20/2010", salary: "$85,600" },
    { name: "Sonya Frost", position: "Software Engineer", office: "Edinburgh", age: 23, startDate: "12/13/2008", salary: "$103,600" },
    { name: "Donna Snider", position: "Customer Support", office: "New York", age: 27, startDate: "1/25/2011", salary: "$112,000" },
    { name: "Prescott Bartlett", position: "Technical Author", office: "London", age: 27, startDate: "5/7/2011", salary: "$145,000" },
    { name: "Brenden Wagner", position: "Software Engineer", office: "San Francisco", age: 28, startDate: "6/7/2011", salary: "$206,850" },
];

function Information(name, position, office, age, startDate, salary, match = true, showSalary = false) {
    this.name = ko.observable(name);
    this.position = ko.observable(position);
    this.office = ko.observable(office);
    this.age = ko.observable(age);
    this.startDate = ko.observable(startDate);
    this.salary = ko.observable(salary);
    this.match = ko.observable(match);
    this.showSalary = ko.observable(showSalary)
}

// total record show
var Options = function(totalShow) {
    var self = this;
    self.totalShowOptions = totalShow;
};

var PagedGridModel = function(items) {
    var self = this;
    self.items = ko.observableArray(items.map(function (item) {
        return new Information(item.name, item.position, item.office, item.age, item.startDate, item.salary, item.match, item.showSalary);
    }));

    self.availableOptions = ko.observableArray([
        new Options(10),
        new Options(25),
        new Options(50),
        new Options(100),
    ]);

    self.gridViewModel = new ko.simpleGrid.viewModel({
        data: this.items,
        columns: [
            { headerText: "Name", rowText: "name"},
            { headerText: "Position", rowText: "position"},
            { headerText: "Office", rowText: "office"},
            { headerText: "Age", rowText: "age"},
            { headerText: "Start date", rowText: "startDate"},
        ],
        availableOptions: self.availableOptions
    });
};

ko.applyBindings(new PagedGridModel(initialData));