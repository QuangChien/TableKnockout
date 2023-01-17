(function () {
    // Private function
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
        // Defines a view model class you can use to populate a grid
        viewModel: function (configuration) {
            this.data = configuration.data;
            this.currentPageIndex = ko.observable(0);
            this.pageSize = configuration.pageSize || 5;

            // If you don't specify columns configuration, we'll use scaffolding
            this.columns = configuration.columns || getColumnsForScaffolding(ko.utils.unwrapObservable(this.data));

            this.itemsOnCurrentPage = ko.computed(function () {
                var startIndex = this.pageSize * this.currentPageIndex();
                return this.data.slice(startIndex, startIndex + this.pageSize);
            }, this);

            this.maxPageIndex = ko.computed(function () {
                return Math.ceil(ko.utils.unwrapObservable(this.data).length / this.pageSize) - 1;
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
                // console.log(this.maxPageIndex())
            }

            this.numberTo = function() {
                if(this.totalRecord - (this.pageSize * this.currentPageIndex()) > this.pageSize){
                    return (this.pageSize * this.currentPageIndex()) + this.pageSize;
                }else{
                    return this.totalRecord;
                }
            }

            // console.log(this.pageSize)
            this.totalRecord = configuration.data().length;
        }
    };

    // Templates used to render the grid
    var templateEngine = new ko.nativeTemplateEngine();

    templateEngine.addTemplate = function(templateName, templateMarkup) {
        document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "<" + "/script>");
    };

    templateEngine.addTemplate("ko_simpleGrid_length", "\
                  <div class=\"dataTables_length\">\
                        <label>\
                            Show\
                            <select name=\"example_length\">\
                                <option value=\"10\">10</option>\
                                <option value=\"25\">25</option>\
                                <option value=\"50\">50</option>\
                                <option value=\"100\">100</option>\
                            </select>\
                            entries\
                        </label>\
                    </div>\
                  ");

    templateEngine.addTemplate("ko_simpleGrid_filter", "\
                  <div class=\"dataTables_filter\">\
                        <label>Search:<input type=\"search\" class=\"\"></label>\
                   </div>\
                  ");

    templateEngine.addTemplate("ko_simpleGrid_grid", "\
                    <table style=\"width: 100%;\" class=\"ko-grid display nowrap dataTable dtr-inline collapsed\" cellspacing=\"0\">\
                        <thead>\
                            <tr data-bind=\"foreach: columns\">\
                               <th class=\"sorting sorting_asc\" data-bind=\"text: headerText\"></th>\
                            </tr>\
                        </thead>\
                        <tbody data-bind=\"foreach: itemsOnCurrentPage\">\
                           <tr class=\"odd\" data-bind=\"foreach: $parent.columns\">\
                               <td data-bind=\"text: typeof rowText == 'function' ? rowText($parent) : $parent[rowText] \"></td>\
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
                        Showing <span data-bind = \"text: ($root.pageSize * $root.currentPageIndex()) + 1 \"></span> to \
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
        // This method is called to initialize the node, and will also be called again if you change what the grid is bound to
        update: function (element, viewModelAccessor, allBindingsAccessor) {
            var viewModel = viewModelAccessor(), allBindings = allBindingsAccessor();

            // Empty the element
            while(element.firstChild)
                ko.removeNode(element.firstChild);

            // Allow the default templates to be overridden
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