(function () {
    function getColumnsForScaffolding(data) {
        if ((typeof data.length !== 'number') || data.length === 0) {
            return [];
        }
        var columns = [];
        for (var propertyName in data[0]) {
            columns.push({ headerText: propertyName, rowText: propertyName, show: true });
        }
        return columns;
        }

        var Options = function(totalShow) {
            this.totalShowOptions = totalShow;
        };

        ko.bindingHandlers.toggleClick = {
            init: function(element, valueAccessor){
                var observable = valueAccessor();
                ko.utils.registerEventHandler(element, "click", function () {
                    var val = observable();
                    observable(!val);
                });
            }
        };

        ko.simpleGrid = {
            viewModel: function (configuration) {
                var self = this;
                self.data = ko.observableArray(configuration.data());
                this.currentPageIndex = ko.observable(0);
                this.pageSize = ko.observable(configuration.pageSize);

                this.rowText = ko.observable('name');

                this.availableOptions = ko.observableArray([
                    new Options(5),
                    new Options(10),
                    new Options(15),
                    new Options(20),
                ]);

                this.selectedOption = ko.observable();

                this.columns = configuration.columns || getColumnsForScaffolding(ko.utils.unwrapObservable(this.data()));

                this.itemsOnCurrentPage = ko.pureComputed(function () {
                    var startIndex = Number(this.pageSize()) * this.currentPageIndex();
                    if(startIndex > this.totalRecord) {
                        this.currentPageIndex(1);
                        startIndex = Number(this.pageSize()) * this.currentPageIndex();
                    }
                    this.filter.value();
                    var newData = ko.utils.arrayFilter(self.data(), function(item) {
                        return item.match() === true;
                    });
                    return newData.slice(startIndex, startIndex + Number(this.pageSize()));
                }, this);
                // console.log(this.itemsOnCurrentPage())
                this.maxPageIndex = ko.computed(function () {
                    var newData = ko.utils.arrayFilter(self.data(), function(item) {
                        return item.match() === true;
                    });
                    return Math.ceil(ko.utils.unwrapObservable(newData).length / this.pageSize()) - 1;
                }, this);

                this.previousAction = function() {
                    if(this.currentPageIndex() === 0){
                        this.currentPageIndex(0);
                    }else{
                        this.currentPageIndex(this.currentPageIndex() - 1);
                    }
                }

                this.nextAction = function() {
                    if(this.currentPageIndex() === this.maxPageIndex()){
                        this.currentPageIndex(this.maxPageIndex());
                    }else{
                        this.currentPageIndex(this.currentPageIndex() + 1);
                    }
                }

                this.numberTo = function() {
                    var newData = ko.utils.arrayFilter(self.data(), function(item) {
                        return item.match() === true;
                    });
                    if(newData.length - (Number(this.pageSize()) * this.currentPageIndex()) > Number(this.pageSize())){
                        return (Number(this.pageSize()) * this.currentPageIndex()) + Number(this.pageSize());
                    }else{
                        return newData.length;
                    }
                }
                this.numberOf = function() {
                    var newData = ko.utils.arrayFilter(self.data(), function(item) {
                        return item.match() === true;
                    });
                    return newData.length;
                }

                this.numberFrom = function(){
                    var newData = ko.utils.arrayFilter(self.data(), function(item) {
                        return item.match() === true;
                    });
                    if(newData.length === 0){
                        return 0;
                    }else{
                        return (Number(self.pageSize()) * self.currentPageIndex()) + 1;
                    }
                }


                this.optionsChange = function(obj, event){
                    this.pageSize(event.target.value)
                }

                this.totalRecord = self.data().length;

                this.filter = {
                value: ko.observable()
            }

            this.filter.value.subscribe(function(newValue) {
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

            this.sortData = function(data, event){
                console.log(data.rowText)
                self.rowText(data.rowText);
                self.currentPageIndex(0);
                var parentElement = event.target.parentElement;
                Array.from(parentElement.children).forEach(function(item) {
                    if(event.target !== item){
                        item.classList.remove("sorting_asc");
                        item.classList.remove("sorting_desc");
                    }
                });
                var sorted;
                sorted = self.data();
                if(data.rowText === "name"){
                    if(event.target.classList.contains("sorting_asc")) {
                        event.target.classList.remove("sorting_asc");
                        event.target.classList.add("sorting_desc");

                        sorted.sort(function sortDesc(a,b) {
                            if(a.name() > b.name()) return -1;
                            if(a.name() < b.name()) return 1;
                            return 0;
                        });
                    }else{
                        event.target.classList.remove("sorting_desc");
                        event.target.classList.add("sorting_asc");

                        sorted.sort(function sortAsc(a,b) {
                            if(a.name() > b.name()) return 1;
                            if(a.name() < b.name()) return -1;
                            return 0;
                        });
                    }
                    self.data(sorted);
                }
                if(data.rowText === "position"){
                    if(event.target.classList.contains("sorting_asc")) {
                        event.target.classList.remove("sorting_asc");
                        event.target.classList.add("sorting_desc");

                        sorted.sort(function sortDesc(a,b) {
                            if(a.position() > b.position()) return -1;
                            if(a.position() < b.position()) return 1;
                            return 0;
                        });
                    }else{
                        event.target.classList.remove("sorting_desc");
                        event.target.classList.add("sorting_asc");

                        sorted.sort(function sortAsc(a,b) {
                            if(a.position() > b.position()) return 1;
                            if(a.position() < b.position()) return -1;
                            return 0;
                        });
                    }
                    self.data(sorted);
                }
                if(data.rowText === "office"){
                    if(event.target.classList.contains("sorting_asc")) {
                        event.target.classList.remove("sorting_asc");
                        event.target.classList.add("sorting_desc");

                        sorted.sort(function sortDesc(a,b) {
                            if(a.office() > b.office()) return -1;
                            if(a.office() < b.office()) return 1;
                            return 0;
                        });
                    }else{
                        event.target.classList.remove("sorting_desc");
                        event.target.classList.add("sorting_asc");

                        sorted.sort(function sortAsc(a,b) {
                            if(a.office() > b.office()) return 1;
                            if(a.office() < b.office()) return -1;
                            return 0;
                        });
                    }
                    self.data(sorted);
                }
                if(data.rowText === "age"){
                    if(event.target.classList.contains("sorting_asc")) {
                        event.target.classList.remove("sorting_asc");
                        event.target.classList.add("sorting_desc");

                        sorted.sort(function sortDesc(a,b) {
                            if(a.age() > b.age()) return -1;
                            if(a.age() < b.age()) return 1;
                            return 0;
                        });


                    }else{
                        event.target.classList.remove("sorting_desc");
                        event.target.classList.add("sorting_asc");

                        sorted.sort(function sortAsc(a,b) {
                            if(a.age() > b.age()) return 1;
                            if(a.age() < b.age()) return -1;
                            return 0;
                        });
                    }
                    self.data(sorted);
                }
                if(data.rowText === "startDate"){
                    if(event.target.classList.contains("sorting_asc")) {
                        event.target.classList.remove("sorting_asc");
                        event.target.classList.add("sorting_desc");

                        sorted.sort(function sortDesc(a,b) {
                            if(new Date(a.startDate()) > new Date(b.startDate())) return -1;
                            if(new Date(a.startDate()) < new Date((b.startDate()))) return 1;
                            return 0;
                        });
                    }else{
                        event.target.classList.remove("sorting_desc");
                        event.target.classList.add("sorting_asc");

                        sorted.sort(function sortAsc(a,b) {
                            if(new Date(a.startDate()) > new Date(b.startDate())) return 1;
                            if(new Date(a.startDate()) < new Date((b.startDate()))) return -1;
                            return 0;
                        });
                    }
                    self.data(sorted);
                }
            }

            this.showChild = function(data, event){
                if(data.rowText === "name"){
                    var parentNode = event.target.parentElement;
                    console.log(parentNode.nextElementSibling)
                    if(parentNode.classList.contains("parent")) {
                        parentNode.classList.remove("parent");
                        parentNode.nextElementSibling.style.display = "none";
                    }else{
                        parentNode.classList.add("parent");
                        parentNode.nextElementSibling.style.display = "table-row";
                    }
                }
            }

            this.notMatch = function() {
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
                               }, value: selectedOption\" name=\"example_length\">\
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
                               <th class=\"sorting\" data-bind=\"hidden: !show, text: headerText, click: $root.sortData, css: { sorting_asc: rowText === 'name' }, class: rowText \"></th>\
                            </tr>\
                        </thead>\
                        <tbody data-bind=\"visible: numberOf() === 0\">\
                        <tr class=\"odd\">\
                            <td class=\"dataTables_empty\" colspan=\"5\" valign=\"top\">No matching records found</td>\
                        </tr>\
                        </tbody>\
                        <tbody data-bind=\"foreach: itemsOnCurrentPage\">\
                           <tr data-bind=\"foreach: $parent.columns, css: { old: $index() % 2 === 0, even: $index() % 2 != 0, parent: false}\">\
                               <td data-bind=\"click: $root.showChild, hidden: !show, css: {sorting_1: rowText === $root.rowText(), 'dtr-control': rowText === 'name' }, text: typeof rowText == 'function' ? rowText($parent) : $parent[rowText] \"></td>\
                           </tr>\
                           <tr class=\"child salary\">\
                                <td class=\"child\" colspan=\"5\">\
                                    <ul class=\"dtr-details\" data-dtr-index=\"4\">\
                                        <li class=\" dt-body-right\" data-dt-column=\"5\" data-dt-row=\"4\" data-dtr-index=\"5\"><span class=\"dtr-title\">Salary</span>\
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
                                <th class=\"dt-body-right\" rowspan=\"1\" colspan=\"1\">Age</th>\
                                <th class=\"dt-body-right\" rowspan=\"1\" colspan=\"1\">Start date</th>\
                                <th class=\"dt-body-right dtr-hidden\" rowspan=\"1\" colspan=\"1\" style=\"display: none;\">Salary</th>\
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
                        <a data-bind=\"click: nextAction, css: { disabled: $root.currentPageIndex() == $root.maxPageIndex() || numberOf() === 0}\" class=\"paginate_button previous\" class=\"paginate_button next\" id=\"example_next\">Next</a>\
                    </div>");

    // The "simpleGrid" binding
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

            // Render the main grid
            var gridContainer = element.appendChild(document.createElement("DIV"));
            ko.renderTemplate(gridTemplateName, viewModel, { templateEngine: templateEngine }, gridContainer, "replaceNode");

            // Render the page links
            var pageLinksContainer = element.appendChild(document.createElement("DIV"));
            ko.renderTemplate(pageLinksTemplateName, viewModel, { templateEngine: templateEngine }, pageLinksContainer, "replaceNode");

            var infoContainer = element.appendChild(document.createElement("DIV"));
            ko.renderTemplate(infoTemplateName, viewModel, { templateEngine: templateEngine }, infoContainer, "replaceNode");
        }
    };
})();