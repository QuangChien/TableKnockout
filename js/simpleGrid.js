(function () {
    function getColumnsForScaffolding(data) {
        if ((typeof data.length !== 'number') || data.length === 0) {
            return [];
        }
        var columns = [];
        for (var propertyName in data[0]) {
            columns.push({ headerText: propertyName, rowText: propertyName });
        }
        return columns;
    }

    ko.simpleGrid = {
        viewModel: function (configuration) {
            var self = this;
            self.data = ko.observableArray(configuration.data());

            // sort asc by name initial
            self.sorted = self.data();
            self.sorted.sort(function sortAsc(a,b) {
                if(a.name() > b.name()) return 1;
                if(a.name() < b.name()) return -1;
                return 0;
            });
            self.data(self.sorted);

            self.currentPageIndex = ko.observable(0);
            self.pageSize = ko.observable();
            self.rowText = ko.observable('name');

            self.availableOptions = configuration.availableOptions;

            self.columns = configuration.columns || getColumnsForScaffolding(ko.utils.unwrapObservable(self.data()));

            // items on current page
            self.itemsOnCurrentPage = ko.pureComputed(function () {
                var startIndex = Number(self.pageSize()) * self.currentPageIndex();
                var newData = ko.utils.arrayFilter(self.data(), function(item) {
                    return item.match() === true;
                });

                return newData.slice(startIndex, startIndex + Number(self.pageSize()));
            }, self);

            // max page number
            self.maxPageIndex = ko.computed(function () {
                var newData = ko.utils.arrayFilter(self.data(), function(item) {
                    return item.match() === true;
                });
                return Math.ceil(ko.utils.unwrapObservable(newData).length / self.pageSize()) - 1;
            }, self);

            // previous action
            self.previousAction = function() {
                if(self.currentPageIndex() === 0){
                    self.currentPageIndex(0);
                }else{
                    self.currentPageIndex(self.currentPageIndex() - 1);
                }
            }

            // next action
            self.nextAction = function() {
                if(self.currentPageIndex() === self.maxPageIndex()){
                    self.currentPageIndex(self.maxPageIndex());
                }else{
                    self.currentPageIndex(self.currentPageIndex() + 1);
                }
            }

            // show number to on one page
            self.numberTo = function() {
                var newData = ko.utils.arrayFilter(self.data(), function(item) {
                    return item.match() === true;
                });
                if(newData.length - (Number(self.pageSize()) * self.currentPageIndex()) > Number(self.pageSize())){
                    return (Number(self.pageSize()) * self.currentPageIndex()) + Number(self.pageSize());
                }else{
                    return newData.length;
                }
            }

            // show number of total showing
            self.numberOf = function() {
                var newData = ko.utils.arrayFilter(self.data(), function(item) {
                    return item.match() === true;
                });
                return newData.length;
            }

            // show number from on one page
            self.numberFrom = function(){
                var newData = ko.utils.arrayFilter(self.data(), function(item) {
                    return item.match() === true;
                });
                if(newData.length === 0){
                    return 0;
                }else{
                    return (Number(self.pageSize()) * self.currentPageIndex()) + 1;
                }
            }

            //change total record on one page
            self.optionsChange = function(obj, event){
                self.pageSize(event.target.value)
                self.currentPageIndex(0);
            }

            //total record
            self.totalRecord = self.data().length;

            self.filter = {
                value: ko.observable()
            }

            //update match value of data when search
            self.filter.value.subscribe(function(newValue) {
                self.currentPageIndex(0);
                newValue = newValue.toLowerCase();
                self.data().forEach(function(item) {
                    if (item.name().toLowerCase().indexOf(newValue) >= 0
                        || item.position().toLowerCase().indexOf(newValue) >= 0
                        || item.office().toLowerCase().indexOf(newValue) >= 0
                        || String(item.age()).indexOf(newValue) >= 0
                        || item.startDate().toLowerCase().indexOf(newValue) >= 0
                    ) {
                        item.match(true);

                    } else {
                        item.match(false);
                    }
                });
            });

            //sort fields of data
            self.sortData = function(data, event){
                self.rowText(data.rowText);
                self.currentPageIndex(0);
                var parentElement = event.target.parentElement;
                Array.from(parentElement.children).forEach(function(item) {
                    if(event.target !== item){
                        item.classList.remove("sorting_asc");
                        item.classList.remove("sorting_desc");
                    }
                });

                if(data.rowText === "name"){
                    if(event.target.classList.contains("sorting_asc")) {
                        event.target.classList.remove("sorting_asc");
                        event.target.classList.add("sorting_desc");

                        self.sorted.sort(function sortDesc(a,b) {
                            if(a.name() > b.name()) return -1;
                            if(a.name() < b.name()) return 1;
                            return 0;
                        });
                    }else{
                        event.target.classList.remove("sorting_desc");
                        event.target.classList.add("sorting_asc");

                        self.sorted.sort(function sortAsc(a,b) {
                            if(a.name() > b.name()) return 1;
                            if(a.name() < b.name()) return -1;
                            return 0;
                        });
                    }
                    self.data(self.sorted);
                }
                if(data.rowText === "position"){
                    if(event.target.classList.contains("sorting_asc")) {
                        event.target.classList.remove("sorting_asc");
                        event.target.classList.add("sorting_desc");

                        self.sorted.sort(function sortDesc(a,b) {
                            if(a.position() > b.position()) return -1;
                            if(a.position() < b.position()) return 1;
                            return 0;
                        });
                    }else{
                        event.target.classList.remove("sorting_desc");
                        event.target.classList.add("sorting_asc");

                        self.sorted.sort(function sortAsc(a,b) {
                            if(a.position() > b.position()) return 1;
                            if(a.position() < b.position()) return -1;
                            return 0;
                        });
                    }
                    self.data(self.sorted);
                }
                if(data.rowText === "office"){
                    if(event.target.classList.contains("sorting_asc")) {
                        event.target.classList.remove("sorting_asc");
                        event.target.classList.add("sorting_desc");

                        self.sorted.sort(function sortDesc(a,b) {
                            if(a.office() > b.office()) return -1;
                            if(a.office() < b.office()) return 1;
                            return 0;
                        });
                    }else{
                        event.target.classList.remove("sorting_desc");
                        event.target.classList.add("sorting_asc");

                        self.sorted.sort(function sortAsc(a,b) {
                            if(a.office() > b.office()) return 1;
                            if(a.office() < b.office()) return -1;
                            return 0;
                        });
                    }
                    self.data(self.sorted);
                }
                if(data.rowText === "age"){
                    if(event.target.classList.contains("sorting_asc")) {
                        event.target.classList.remove("sorting_asc");
                        event.target.classList.add("sorting_desc");

                        self.sorted.sort(function sortDesc(a,b) {
                            if(a.age() > b.age()) return -1;
                            if(a.age() < b.age()) return 1;
                            return 0;
                        });


                    }else{
                        event.target.classList.remove("sorting_desc");
                        event.target.classList.add("sorting_asc");

                        self.sorted.sort(function sortAsc(a,b) {
                            if(a.age() > b.age()) return 1;
                            if(a.age() < b.age()) return -1;
                            return 0;
                        });
                    }
                    self.data(self.sorted);
                }
                if(data.rowText === "startDate"){
                    if(event.target.classList.contains("sorting_asc")) {
                        event.target.classList.remove("sorting_asc");
                        event.target.classList.add("sorting_desc");

                        self.sorted.sort(function sortDesc(a,b) {
                            if(new Date(a.startDate()) > new Date(b.startDate())) return -1;
                            if(new Date(a.startDate()) < new Date((b.startDate()))) return 1;
                            return 0;
                        });
                    }else{
                        event.target.classList.remove("sorting_desc");
                        event.target.classList.add("sorting_asc");

                        self.sorted.sort(function sortAsc(a,b) {
                            if(new Date(a.startDate()) > new Date(b.startDate())) return 1;
                            if(new Date(a.startDate()) < new Date((b.startDate()))) return -1;
                            return 0;
                        });
                    }
                    self.data(self.sorted);
                }
            }

            //show & hide salary
            self.showSalary = function(data, target){
                if(target.rowText === "name"){
                    data.showSalary() ? data.showSalary(false) : data.showSalary(true);
                }
            }

            // check have record when search
            self.notMatch = function() {
                var newData = ko.utils.arrayFilter(self.data(), function(item) {
                    return item.match() === true;
                });
                if(newData.length === 0){
                    return true;
                }else{
                    return false;
                }
            }
        }
    };

    var templateEngine = new ko.nativeTemplateEngine();

    templateEngine.addTemplate = function(templateName, templateMarkup) {
        document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "<" + "/script>");
    };

    templateEngine.addTemplate("ko_simpleGrid_length", "\
                  <div class=\"dataTables_length\">\
                        <label>\
                            Show\
                            <select  data-bind=\"event:{ change: optionsChange }, options: availableOptions(),\
                            optionsText: function(item) {\
                                   return item.totalShowOptions\
                               },optionsValue: function(item) {\
                                   return item.totalShowOptions\
                               }\" name=\"example_length\">\
                            </select>\
                            entries\
                        </label>\
                    </div>\
                  ");

    templateEngine.addTemplate("ko_simpleGrid_filter", "\
                  <div class=\"dataTables_filter\">\
                        <label>Search:<input data-bind=\"value: filter.value, valueUpdate: 'afterkeydown'\" type=\"search\" class=\"\"></label>\
                   </div>\
                  ");

    templateEngine.addTemplate("ko_simpleGrid_grid", "\
                    <table style=\"width: 100%;\" class=\"ko-grid display nowrap dataTable dtr-inline collapsed\" cellspacing=\"0\">\
                        <thead>\
                            <tr data-bind=\"foreach: columns\">\
                               <th class=\"sorting\" data-bind=\"text: headerText, click: $root.sortData, css: { sorting_asc: rowText === 'name' }, class: rowText \"></th>\
                            </tr>\
                        </thead>\
                        <tbody data-bind=\"visible: numberOf() === 0\">\
                        <tr class=\"odd\">\
                            <td class=\"dataTables_empty\" colspan=\"5\" valign=\"top\">No matching records found</td>\
                        </tr>\
                        </tbody>\
                        <tbody data-bind=\"foreach: itemsOnCurrentPage\">\
                           <tr data-bind=\"foreach: $parent.columns, css: { old: $index() % 2 === 0, even: $index() % 2 != 0, parent: showSalary() === true}\">\
                               <td data-bind=\"click: $root.showSalary.bind(this, $parent), css: {sorting_1: rowText === $root.rowText(), 'dtr-control': rowText === 'name', 'dt-body-right' : rowText === 'age' || rowText === 'startDate'}, text: typeof rowText == 'function' ? rowText($parent) : $parent[rowText] \"></td>\
                           </tr>\
                           <tr data-bind=\"visible: showSalary() === true \" class=\"child salary\">\
                                <td class=\"child\" colspan=\"5\">\
                                    <ul class=\"dtr-details\" data-dtr-index=\"4\">\
                                        <li data-dt-column=\"5\" data-dt-row=\"4\" data-dtr-index=\"5\"><span class=\"dtr-title\">Salary</span>\
                                            <span data-bind=\"text: salary \" class=\"dtr-data\"></span></li>\
                                    </ul>\
                                </td>\
                           </tr>\
                        </tbody>\
                        <tfoot>\
                            <tr>\
                                <th rowspan=\"1\" colspan=\"1\">Name</th>\
                                <th rowspan=\"1\" colspan=\"1\">Position</th>\
                                <th rowspan=\"1\" colspan=\"1\">Office</th>\
                                <th rowspan=\"1\" colspan=\"1\">Age</th>\
                                <th rowspan=\"1\" colspan=\"1\">Start date</th>\
                                <th class=\"dtr-hidden\" rowspan=\"1\" colspan=\"1\" style=\"display: none;\">Salary</th>\
                            </tr>\
                        </tfoot>\
                    </table>");

    templateEngine.addTemplate("ko_simpleGrid_info", "\
                    <div class=\"dataTables_info\">\
                        Showing <span data-bind = \"text: $root.numberFrom() \"></span> to \
                        <span data-bind = \"text: $root.numberTo() \"></span> of \
                        <span data-bind='text: numberOf()'></span> entries\
                        <span data-bind = \"visible: numberOf() < totalRecord \">(filtered from <span data-bind = \"text: totalRecord \"></span> total entries)</span>\
                    </div>");

    templateEngine.addTemplate("ko_simpleGrid_pageLinks", "\
                    <div class=\"dataTables_paginate paging_simple_numbers\">\
                        <a data-bind=\"click: previousAction, css: { disabled: $root.currentPageIndex() == 0 || numberOf() === 0 }\" class=\"paginate_button previous\">Previous</a>\
                        <span>\
                        <!-- ko foreach: ko.utils.range(0, maxPageIndex) -->\
                               <a class=\"paginate_button\" href=\"#\" data-bind=\"text: $data + 1, click: function() { $root.currentPageIndex($data) }, css: { current: $data == $root.currentPageIndex() }\">\
                            </a>\
                        <!-- /ko -->\
                        </span>\
                        <a data-bind=\"click: nextAction, css: { disabled: $root.currentPageIndex() == $root.maxPageIndex() || numberOf() === 0}\" class=\"paginate_button next\" id=\"example_next\">Next</a>\
                    </div>");

    ko.bindingHandlers.simpleGrid = {
        init: function() {
            return { 'controlsDescendantBindings': true };
        },

        update: function (element, viewModelAccessor, allBindingsAccessor) {
            var viewModel = viewModelAccessor(), allBindings = allBindingsAccessor();

            while(element.firstChild)
                ko.removeNode(element.firstChild);

            var gridTemplateName      = allBindings.simpleGridTemplate || "ko_simpleGrid_grid",
                pageLinksTemplateName = allBindings.simpleGridPagerTemplate || "ko_simpleGrid_pageLinks",
                infoTemplateName = allBindings.simpleGridPagerTemplate || "ko_simpleGrid_info";
                lengthTemplateName = allBindings.simpleGridPagerTemplate || "ko_simpleGrid_length";
                filterTemplateName = allBindings.simpleGridPagerTemplate || "ko_simpleGrid_filter";


            var lengthContainer = element.appendChild(document.createElement("DIV"));
            ko.renderTemplate(lengthTemplateName, viewModel, { templateEngine: templateEngine }, lengthContainer, "replaceNode");

            var filterContainer = element.appendChild(document.createElement("DIV"));
            ko.renderTemplate(filterTemplateName, viewModel, { templateEngine: templateEngine }, filterContainer, "replaceNode");

            var gridContainer = element.appendChild(document.createElement("DIV"));
            ko.renderTemplate(gridTemplateName, viewModel, { templateEngine: templateEngine }, gridContainer, "replaceNode");

            var pageLinksContainer = element.appendChild(document.createElement("DIV"));
            ko.renderTemplate(pageLinksTemplateName, viewModel, { templateEngine: templateEngine }, pageLinksContainer, "replaceNode");

            var infoContainer = element.appendChild(document.createElement("DIV"));
            ko.renderTemplate(infoTemplateName, viewModel, { templateEngine: templateEngine }, infoContainer, "replaceNode");
        }
    };
})();