import { ItemForm, Dashboard, DataTable, Navigation } from "dattatable";
import { DataSource, IItem } from "./ds";
import { Components } from "gd-sprest-bs";
import * as jQuery from "jquery";
import * as moment from "moment";
import * as Common from "./common";
import { formatDateValue } from "./common";
import Strings from "./strings";
import { Icons } from "./icons";
import { gear } from "gd-sprest-bs/build/icons/svgs/gear";
import { plusSquareFill } from "gd-sprest-bs/build/icons/svgs/plusSquareFill";
import { filterSquare } from "gd-sprest-bs/build/icons/svgs/filterSquare";
import { cardList } from "gd-sprest-bs/build/icons/svgs/cardList";
import { printer } from "gd-sprest-bs/build/icons/svgs/printer";
import { pencilSquare } from "gd-sprest-bs/build/icons/svgs/pencilSquare";
import { EventsForm } from "./components/ItemForm";
import { GanttChart } from "./components/GanttChart";

/**
 * Main Application
 */
export class App {
    // Variables
    private _chart: GanttChart = null;
    private _navigation: Navigation = null;
    private _subNavigation: Navigation = null;
    private _Datatable: DataTable = null;
    private _el: HTMLElement = null;
    // Constructor
    constructor(el: HTMLElement) {
        this._el = el;
        // Renders the app
        this.render(el);
        // Set the list name
        ItemForm.ListName = Strings.Lists.Schedule;
        ItemForm.UseModal = true;
    }
    // Methods
    // Refreshes the dashboard
    private refresh() {
        // Refresh the data
        DataSource.load().then(items => {
            // Update the dashboard and timeline
            this._chart.refresh();
            this._Datatable.refresh(items);
        });
    }
    private render(el: HTMLElement) {
        this._navigation = new Navigation({
            el,
            title: Strings.ProjectName,
            hideFilter: true,
            hideSearch: true,
            onRendering: props => {
                props.type = Components.NavbarTypes.Dark;
                props.className = "MainNav rounded-top";
            },
            itemsEnd: [
                {
                    text: "Settings",
                    iconSize: 18,
                    iconType: gear,
                    isButton: true,
                    className: "btn-outline-light me-1 btn-sm",
                    // TODO
                }
            ]
        });
        this._subNavigation = new Navigation({
            el,
            title: "",
            hideFilter: true,
            hideSearch: true,
            onRendering: props => {
                props.type = Components.NavbarTypes.Light;
                props.className = "SubNav";
            },
            items: [
                {
                    text: "New",
                    iconType: plusSquareFill,
                    iconSize: 18,
                    isButton: true,
                    className: "btn-outline-dark me-1 btn-sm",
                    onClick: () => {
                        ItemForm.create({
                            onUpdate: () => {
                                this.refresh();
                            }
                        });
                    }
                },
                {
                    text: "Legend",
                    iconType: cardList,
                    iconSize: 18,
                    isButton: true,
                    className: "btn-outline-dark me-1 btn-sm",
                    onClick: () => {

                    }
                },
                {
                    text: "Print",
                    iconSize: 18,
                    iconType: printer,
                    isButton: true,
                    className: "btn-outline-dark me-1 btn-sm",
                }
            ],
            itemsEnd: [
                {
                    text: "Filters",
                    isButton: true,
                    iconSize: 18,
                    iconType: printer,
                    className: "btn-outline-dark me-1 btn-sm",
                    onClick: () => {
                        this.refresh();
                    }
                }
            ]
        });
        this._chart = new GanttChart(el);
        let _elTable = document.createElement("div");
        el.appendChild(_elTable);
        this._Datatable = new DataTable({
            el: _elTable,
            rows: DataSource.Items,
            dtProps: {
                dom: 'rts<"row"<"col-sm-4"l><"col-sm-4"i><"col-sm-4"p>>',
                columnDefs: [
                    {
                        "targets": 6,
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
                lengthMenu: [10, 25, 50, 100],
                // Order by the 1st column by default; ascending
                order: [[1, "asc"]]
            },
            columns: [
                {
                    name: "",
                    title: "",
                    onRenderCell: (el, column, item: IItem) => {
                        Components.Button({
                            el,
                            type: Components.ButtonTypes.OutlineDark,
                            isSmall: true,
                            iconSize: 18,
                            iconType: pencilSquare,
                            id: "editBTN",
                            onClick: () => {
                                ItemForm.edit({
                                    itemId: item.Id,
                                    onUpdate: () => {
                                        this.refresh();
                                    }
                                });
                            }
                        });
                    }
                },
                {
                    name: "ProjectName",
                    title: "ProjectName"
                },
                {
                    name: "Description",
                    title: "Description"
                },
                {
                    name: "EventDate",
                    title: "EventDate"
                },
                {
                    name: "EndDate",
                    title: "EndDate"
                },
                {
                    name: "Status",
                    title: "Status"
                },
                {
                    name: "Category",
                    title: "Category"
                },
                {
                    name: "Priority",
                    title: "Priority"
                }
            ]
        });
    }


}