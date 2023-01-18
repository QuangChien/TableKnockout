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

            this.sorting = ko.observable(false);

            this.availableOptions = ko.observableArray([
                new Options(5),
                new Options(10),
                new Options(15),
                new Options(20),
            ]);

            this.selectedOption = ko.observable();
            // If you don't specify columns configuration, we'll use scaffolding
            this.columns = configuration.columns || getColumnsForScaffolding(ko.utils.unwrapObservable(this.data()));

            this.itemsOnCurrentPage = ko.pureComputed(function () {
                var startIndex = Number(this.pageSize()) * this.currentPageIndex();
                if(startIndex > this.totalRecord) {
                    this.currentPageIndex(1);
                    startIndex = Number(this.pageSize()) * this.currentPageIndex();
                }
                var newData = ko.utils.arrayFilter(self.data(), function(item) {
                    return item.isFiltered(true);
                });
                this.sorting = !this.sorting;
                console.log("change")
                return newData.slice(startIndex, startIndex + Number(this.pageSize()));
            }, this).extend({ notify: 'always' });

            this.maxPageIndex = ko.computed(function () {
                return Math.ceil(ko.utils.unwrapObservable(this.data()).length / this.pageSize()) - 1;
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
                if(this.totalRecord - (Number(this.pageSize()) * this.currentPageIndex()) > Number(this.pageSize())){
                    return (Number(this.pageSize()) * this.currentPageIndex()) + Number(this.pageSize());
                }else{
                    return this.totalRecord;
                }
            }

            this.optionsChange = function(obj, event){
                this.pageSize(event.target.value)
                // console.log(event.target.value)
            }

            this.totalRecord = this.data().length;

            this.filter = {
                value: ko.observable()
            }

            this.filter.value.subscribe(function(newValue) {
                newValue = newValue.toLowerCase();
                self.data().forEach(function(item) {
                    if (item.name().toLowerCase().indexOf(newValue) > -1
                        || item.position().toLowerCase().indexOf(newValue) > -1
                        || item.office().toLowerCase().indexOf(newValue) > -1
                        || String(item.age()).indexOf(newValue) > -1
                        || item.startDate().toLowerCase().indexOf(newValue) > -1
                    ) {
                        item.isFiltered(true);
                    } else {
                        item.isFiltered(false);
                    }
                });
                // filterData(newValue);
            });

            this.sortData = function(data, event){
                this.sorting = !this.sorting;
                console.log(this.sorting);
            }

            this.sorting.subscribe(function(newValue){
                console.log(newValue)
            })
            // console.log(this.data())

            // function filterData(filter) {
            //     self = this;
            //
            //     // console.log(configuration.data())
            // }
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
                               <th class=\"sorting\" data-bind=\"text: headerText, click: $root.sortData, css: { sorting_asc: $root.sortData }\"></th>\
                            </tr>\
                        </thead>\
                        <tbody data-bind=\"foreach: itemsOnCurrentPage\">\
                           <tr class=\"odd\" data-bind=\"hidden: !isFiltered(),foreach: $parent.columns\">\
                               <td data-bind=\"css: {  }, text: typeof rowText == 'function' ? rowText($parent) : $parent[rowText] \"></td>\
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
                        Showing <span data-bind = \"text: ($root.pageSize() * $root.currentPageIndex()) + 1 \"></span> to \
                        <span data-bind = \"text: $root.numberTo() \"></span> of \
                        <span data-bind='text: totalRecord'></span> entries\
                    </div>");

    templateEngine.addTemplate("ko_simpleGrid_pageLinks", "\
                    <div class=\"dataTables_paginate paging_simple_numbers\">\
                        <a data-bind=\"click: previousAction, css: { disabled: $root.currentPageIndex() == 0 }\" class=\"paginate_button previous\">Previous</a>\
                        <span>\
                        <!-- ko foreach: ko.utils.range(0, maxPageIndex) -->\
                               <a class=\"paginate_button\" href=\"#\" data-bind=\"text: $data + 1, click: function() { $root.currentPageIndex($data) }, css: { current: $data == $root.currentPageIndex() }\">\
                            </a>\
                        <!-- /ko -->\
                        </span>\
                        <a data-bind=\"click: nextAction, css: { disabled: $root.currentPageIndex() == $root.maxPageIndex() }\" class=\"paginate_button previous\" class=\"paginate_button next\" id=\"example_next\">Next</a>\
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