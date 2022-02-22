import { ItemForm, DataTable, Navigation } from "dattatable";
import { DataSource, IItem } from "./ds";
import { Components } from "gd-sprest-bs";
import * as jQuery from "jquery";
import * as moment from "moment";
import Strings from "./strings";
import { Icons } from "./icons";
import { plusSquareFill } from "gd-sprest-bs/build/icons/svgs/plusSquareFill";
import { filterSquare } from "gd-sprest-bs/build/icons/svgs/filterSquare";
import { cardList } from "gd-sprest-bs/build/icons/svgs/cardList";
import { printer } from "gd-sprest-bs/build/icons/svgs/printer";
import { calendar } from "gd-sprest-bs/build/icons/svgs/calendar";
import { pencilSquare } from "gd-sprest-bs/build/icons/svgs/pencilSquare";
import { GanttChart } from "./components/GanttChart";
import legend from "./components/legend";
import { Calendar } from "fullcalendar";
import { calendarApp } from "./components/Calendar";
/**
 * Main Application
 */
export class App {
    // Variables
    private _chart: calendarApp = null;
    //private _chart: GanttChart = null;
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
    // Public Refresh
    Apprefresh() {
        // Refresh the data
        DataSource.load().then(items => {
            // Update the dashboard and timeline
            this._chart.refresh();
            this._Datatable.refresh(items);
        });
    }
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
            /*
            // TODO, Need to figure WHAT to change. and HOW..
            itemsEnd: [
                {
                    text: "Settings",
                    iconSize: 18,
                    iconType: gear,
                    isButton: true,
                    className: "btn-outline-light me-1 btn-sm",
                    onClick: () => {
                        new settingsForm();
                    }
                }
            ]*/
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
                        let legend = document.querySelector(".Legend_Toast");
                        if (legend.classList.contains("hide")) {

                            // update class
                            legend.classList.remove("d-none")
                            legend.classList.remove("hide");
                            legend.classList.add("show");
                        } else {

                            // hide it
                            legend.classList.remove("show");
                            legend.classList.add("hide");
                            legend.classList.add("d-none");
                        }

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
            /*itemsEnd: [
                {
                    text: "Day",
                    isButton: true,
                    iconSize: 18,
                    iconType: calendar,
                    className: "btn-outline-dark me-1 btn-sm",
                    onClick: () => {
                        this._chart.viewDay();
                    }
                },
                {
                    text: "Week",
                    isButton: true,
                    iconSize: 18,
                    iconType: calendar,
                    className: "btn-outline-dark me-1 btn-sm",
                    onClick: () => {
                        this._chart.viewWeek();
                    }
                },
                {
                    text: "Month",
                    isButton: true,
                    iconSize: 18,
                    iconType: calendar,
                    className: "btn-outline-dark me-1 btn-sm",
                    onClick: () => {
                        this._chart.viewMonth();
                    }
                },
                {
                    text: "Filters",
                    isButton: true,
                    iconSize: 18,
                    iconType: filterSquare,
                    className: "btn-outline-dark me-1 btn-sm",
                    onClick: () => {
                        this.refresh();
                    }
                }
            ]*/
        });
        this._chart = new calendarApp(el);
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
                lengthMenu: [4, 10, 15, 50, 100],
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
                    title: "Name"
                },
                {
                    name: "Priority",
                    title: "Priority"
                },
                {
                    name: "Status",
                    title: "Status"
                },
                {
                    name: "EventDate",
                    title: "Start Date",
                    onRenderCell: (el, column, item: IItem) => {
                        let date = item[column.name];
                        el.innerHTML =
                            moment(date).format(Strings.TimeFormat);
                    }
                },
                {
                    name: "EndDate",
                    title: "End Date",
                    onRenderCell: (el, column, item: IItem) => {
                        let date = item[column.name];
                        el.innerHTML =
                            moment(date).format(Strings.TimeFormat);
                    }
                },
                {
                    name: "",
                    title: "Duration",
                    onRenderCell: (el, column, item: IItem) => {
                        let start = moment(item.EventDate);
                        let end = moment(item.EndDate);
                        let Dur = moment.duration(end.diff(start));
                        let hours = Dur.asHours();
                        let roundedDwn = Math.floor(hours).toString();
                        let humaned = Dur.humanize();
                        el.innerHTML = roundedDwn + " " + "Hours" + " " + "(" + humaned + ")";

                    }
                },
            ]
        });
        this.legend(el);
    }
    // Legend
    private legend(el: HTMLElement) {
        Components.Toast({
            el,
            className: "Legend_Toast hide d-none",
            headerText: "Legend",
            onRenderHeader: props => {
                props.id = "LegendHeader";
            },
            body: legend.Legend,
            options: { autohide: true }
        });
    }

}