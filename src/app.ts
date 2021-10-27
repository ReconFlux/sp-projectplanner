import { ItemForm, Dashboard } from "dattatable";
import { DataSource, IItem } from "./ds";
import { Components } from "gd-sprest-bs";
import * as jQuery from "jquery";
import * as moment from "moment";
import * as Common from "./common";
import Strings from "./strings";
import { Icons } from "./icons";
import { folderFill } from "gd-sprest-bs/build/icons/svgs/folderFill";
import { table } from "gd-sprest-bs/build/icons/svgs/table";
import { plusSquareFill } from "gd-sprest-bs/build/icons/svgs/plusSquareFill";
import { pencilSquare } from "gd-sprest-bs/build/icons/svgs/pencilSquare";
import { calendar2RangeFill } from "gd-sprest-bs/build/icons/svgs/calendar2RangeFill";
import { DashboardNavigation } from "./dashboardsubNav";
import { templateModal } from "./templatefolderModal";
import { BRETimeline } from "./Timeline";
import { TimelineNavigation } from "./subNavTimeline";
import { Documents } from "./documents";
import { DocModal } from "./DocsModal";

/**
 * Main Application
 */
export class App {
    private _dashboard: Dashboard = null;
    private _elTable: HTMLElement = null;
    private _subDashboardNav: DashboardNavigation = null;
    private _timeline: BRETimeline = null;
    private _elTimeline: HTMLElement = null;
    private _elNavButton: HTMLAnchorElement = null;
    private _el: HTMLElement = null;

    // Constructor
    constructor(el: HTMLElement) {
        this._el = el;
        // Set the list name
        ItemForm.ListName = Strings.Lists.Main;

        // Initialize the application
        DataSource.init().then(() => {
            // Render the dashboard
            this.render(el);
        });
    }

    // Reload the objective information
    private refresh() {
        DataSource.load().then(() => {
            // Refresh the data table
            //this._dashboard.refresh(DataSource.Items);
            DataSource.refreshDashboard();

            // Refresh the timeline
            this._timeline.refresh();

        });
    }
    // Reload the objective information
    Apprefresh() {
        DataSource.load().then(() => {
            // Refresh the data table
            this._dashboard.refresh(DataSource.Items);

            // Refresh the timeline
            this._timeline.refresh();

        });
    }

    // Renders the dashboard
    private render(el: HTMLElement) {
        // Create the dashboard
        this._dashboard = new Dashboard({
            el,
            hideHeader: false,
            useModal: true,
            hideFilter: true,
            filters: {
                items: [
                    {
                        header: "Filter by Status",
                        items: DataSource.statusFilters,
                        multi: true,
                        onFilter: (value: string) => {
                            // Filter the table
                            this._dashboard.filter(4, value);

                            // Filter the timeline
                            this._timeline.filterByStatus(value);
                        }
                    },
                    {
                        header: "Filter by Priority",
                        items: DataSource.priorityFilters,
                        multi: true,
                        onFilter: (value: string[]) => {
                            // Filter the table
                           // this._dashboard.filter(2, value);

                            // Filter the timeline
                            this._timeline.filterByPriority(value);
                        }
                    },
                ]
            },
            navigation: {
                title: Strings.ProjectName,
                onRendered: (el) => {

                    // Get the timeline button
                    this._elNavButton = el.querySelector(".timeline-btn");

                    // Update classes for the navBar container
                    let navEl = el.firstChild as HTMLElement;
                    navEl.classList.remove("bg-primary");
                    navEl.classList.remove("rounded");
                    navEl.classList.remove("rounded-bottom");
                    navEl.classList.add("rounded-top");
                    navEl.id = "DashboardNav";
                    navEl.firstElementChild.classList.add("ps-2");
                    navEl.firstElementChild.classList.add("pe-1");
                    let navbarProp = document.querySelector(".bg-sharepoint");
                    navbarProp.classList.remove("rounded-bottom");

                    // Add a logo to the navbar brand
                    let navBrand = navEl.querySelector(".navbar-brand") as HTMLAnchorElement;
                    navBrand.classList.add("d-flex");
                    navBrand.classList.add("me-2");
                    let brandText = navBrand.innerText;
                    let div = document.createElement("div");
                    div.classList.add("me-2");
                    //div.appendChild(Icons.B2Logo(48, 78));
                    navBrand.innerHTML = div.outerHTML;
                    navBrand.append(brandText);

                    // Add the navigation background
                    let elHead = document.querySelector("#" + Strings.AppElementId + " #header .header") as HTMLDivElement;
                    
                    elHead.style.height = "100% !important";
                    elHead.style.backgroundPosition = "0px 0px";
                    elHead.style.backgroundRepeat = "no-repeat";
                    elHead.style.backgroundSize = "100%";
                    let elHeadDiv = document.querySelector(".header");
                    elHeadDiv.classList.add("rounded-bottom");
                },
                items: [
                    {
                        text: "Timeline",
                        className: "btn-outline-light timeline-btn me-3",
                        iconSize: 18,
                        iconType: calendar2RangeFill,
                        isButton: true,
                        onClick: () => {
                            if (this._elNavButton.classList.contains("timeline-btn")) {
                                let DashboardSubNav = document.querySelector("#dashboardSubNav");
                                let Dashboard = document.querySelector("#datatable");
                                Dashboard.classList.add("d-none");
                                Dashboard.classList.add("Dashboard");
                                // Hide the Dashboard Subnav
                                DashboardSubNav.classList.add("d-none");
                                // Show the Timeline Subnav
                                this._elTimeline.classList.remove("d-none");


                                // Update the class
                                this._elNavButton.classList.remove("timeline-btn");
                                this._elNavButton.classList.add("dashboard-btn");

                                // Clear the button icon
                                while (this._elNavButton.firstChild) { this._elNavButton.removeChild(this._elNavButton.firstChild); }
                                // Render the dashboard icon
                                this._elNavButton.appendChild(table(18, 18));
                                this._elNavButton.append("Dashboard");

                                this.refresh();

                            } else {
                                let DashboardSubNav = document.querySelector("#dashboardSubNav");
                                let Dashboard = document.querySelector("#datatable");
                                // Show the data table
                                Dashboard.classList.remove("d-none");
                                // Hide the timeline sub nav
                                this._elTimeline.classList.add("d-none");
                                // show the dashboard subnav
                                DashboardSubNav.classList.remove("d-none");
                                // Update the class
                                this._elNavButton.classList.remove("dashboard-btn");
                                this._elNavButton.classList.add("timeline-btn");
                                // Clear the timeline icon
                                while (this._elNavButton.firstChild) { this._elNavButton.removeChild(this._elNavButton.firstChild); }
                                // Render the timeline icon
                                this._elNavButton.appendChild(calendar2RangeFill(18, 18));
                                // Update the text
                                this._elNavButton.append("Timeline");


                            }
                        }
                    }
                ],
                itemsEnd: [
                    {
                        text: "New Item",
                        className: "btn-outline-light me-3",
                        iconSize: 18,
                        iconType: plusSquareFill,
                        isButton: true,
                        onClick: () => {
                            // Create an item
                            ItemForm.create({
                                onUpdate: () => {
                                    // Load the data
                                    DataSource.load().then(items => {
                                        // Refresh the table
                                        this._dashboard.refresh(items);
                                        // refresh the timeline
                                        this._timeline.refresh();
                                    });
                                    DataSource.refreshDashboard();
                                }
                            });
                        }
                    },
                    {
                        text: "Templates",
                        className: "btn-outline-light me-3",
                        iconSize: 18,
                        iconType: folderFill,
                        isButton: true,
                        onClick: (el: HTMLElement) => {
                            // Open the Templates table
                            new templateModal(this._el);
                        }

                    }
                ]
            },
            onRendered: el => {
                // Append the timeline element
                this._elTimeline = document.createElement("div");
                this._elTimeline.classList.add("col");
                this._elTimeline.classList.add("d-none");
                this._elTable.parentElement.appendChild(this._elTimeline);

                // Render the navigation for the timeline
                new TimelineNavigation({
                    el: this._elTimeline,
                    onSetDateRange: (data) => {
                        // Update the date range
                        this._timeline.updateDateRange(data);
                    },
                    onShowFilter: () => {
                        this._dashboard.showFilter();
                    },
                });

                // Hide the search bar
                let serach = el.querySelector("input[type='search']");
                serach.classList.add("d-none");

                // Render the timeline
                let elTimeline = document.createElement("div");
                elTimeline.id = "timeline";
                this._elTimeline.appendChild(elTimeline);
                this._timeline = new BRETimeline(elTimeline);

            },
            table: {
                rows: DataSource.Items,
                dtProps: {
                    dom: 'rts<"row"<"col-sm-4"l><"col-sm-4"i><"col-sm-4"p>>',
                    columnDefs: [
                        {
                            "targets": 5,
                            "orderable": false,
                            "searchable": false
                        }
                    ],
                    createdRow: function (row, data, index) {
                        jQuery('td', row).addClass('align-middle');
                    },
                    drawCallback: function (settings) {
                        let api = new jQuery.fn.dataTable.Api(settings) as any;
                        jQuery(api.context[0].nTable).removeClass('no-footer');
                        jQuery(api.context[0].nTable).addClass('tbl-footer');
                        jQuery(api.context[0].nTable).addClass('table-striped');
                        jQuery(api.context[0].nTableWrapper).find('.dataTables_info').addClass('text-center');
                        jQuery(api.context[0].nTableWrapper).find('.dataTables_length').addClass('pt-2');
                        jQuery(api.context[0].nTableWrapper).find('.dataTables_paginate').addClass('pt-03');
                    },
                    headerCallback: function (thead, data, start, end, display) {
                        jQuery('th', thead).addClass('align-middle');
                    },
                    lengthMenu: [3, 5, 10, 25, 50, 100],
                    // Order by the 1st column by default; ascending
                    order: [[1, "asc"]]
                },
                onRendered: (el, dt) => {
                    // Set the subnav element
                    this._elTable = el;
                    //Render the subnav
                    this._subDashboardNav = new DashboardNavigation({
                        el,
                        dt,
                        onShowFilter: () => {
                            this._dashboard.showFilter();
                        },
                        onUpdate: () => {
                            // Refresh the data
                            this.refresh();
                        }
                    });
                },
                columns: [
                    {
                        name: "",
                        title: "",
                        onRenderCell(el, column, item: IItem) {
                            Components.Button({
                                el,
                                type: Components.ButtonTypes.OutlineSecondary,
                                isLarge: true,
                                iconSize: 24,
                                iconType: pencilSquare,
                                onClick: () => {
                                    // Show the edit form
                                    ItemForm.edit({
                                        itemId: item.Id,
                                        onUpdate: () => {
                                            // Refresh the data
                                            DataSource.load().then(items => {
                                                // Update the data
                                                this._dashboard.refresh(items);
                                            });
                                            DataSource.refreshDashboard();
                                        }
                                    });
                                }
                            });
                        }
                    },
                    {
                        name: "Title",
                        title: "Battle Rhythm Event"

                    },
                    {
                        name: "priorities",
                        title: "Priorities"
                    },
                    {
                        name: "linesofeffort",
                        title: "Line of Effort"
                    },
                    {
                        name: "Status",
                        title: "Status"
                    },
                    {
                        className: "p-1",
                        name: "",
                        title: "Assessment",
                        onRenderCell: (el, col, item: IItem) => {
                            // Generate the icon
                            Common.generateAssessmentIcon(el, (item[col.title] || 0));

                            // Set the filter/sort values
                            el.setAttribute("data-filter", item[col.title]);
                            el.setAttribute("data-sort", item[col.title]);
                        }
                    },
                    {
                        name: "StartDate",
                        title: "Start Date",
                        onRenderCell: (el, column, item: IItem) => {
                            let date = item[column.name];
                            el.innerHTML =
                                moment(date).format("MMMM DD, YYYY");
                        }
                    },
                    {
                        name: "EndDate",
                        title: "End Date",
                        onRenderCell: (el, column, item: IItem) => {
                            let date = item[column.name];
                            el.innerHTML =
                                moment(date).format("MMMM DD, YYYY");
                        }
                    },
                    {
                        // 6 - Documents
                        name: "Documents",
                        title: "Documents",
                        onRenderCell: (el, column, item: IItem) => {
                            /*
                            // Render the document column
                            new Documents(el, item, this._dashboard, () => {
                                // Refresh the data
                                DataSource.load().then(items => {
                                    // Update the data
                                    this._dashboard.refresh(items);
                                });
                                this.refresh();
                            });
                            */
                        }
                    },
                    {
                        // 6 - Documents
                        name: "DocumentsTEST",
                        title: "DocumentsTEST",
                        onRenderCell: (el, column, item: IItem) => {
                            // Render the document column
                            Components.Button({
                                el,
                                type: Components.ButtonTypes.Primary,
                                text: "TEST",
                                onClick: () => {
                                    new DocModal(el, item);
                                }
                            });
                        }
                    },
                ]
            },
            footer: {
                itemsEnd: [
                    {
                        text: "v" + Strings.Version
                    }
                ]
            },
        });
        DataSource.setDashBoard(this._dashboard);
    }
}