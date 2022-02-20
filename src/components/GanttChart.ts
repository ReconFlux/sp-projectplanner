import { Components } from "gd-sprest-bs";
import Gantt from "frappe-gantt";
import { DataSource, IItem } from "../ds";
import * as moment from "moment";
import { ItemForm } from "dattatable";
import Strings from "../strings";
/**
 * Gantt Chart
 */
export class GanttChart {
    private _el: HTMLElement = null;
    private _filter: string = null;
    private _items: Array<any> = null;


    // Gantt Chart
    private _chart = null;
    get Chart() { return this._chart; }

    // Constructor
    constructor(el: HTMLElement) {
        // Create the element
        this.createElement(el);

        // Load the rows and events
        this.loadEvents();

        // Show
        this.show();
    }

    // Creates the element to render the gantt chart to
    private createElement(el: HTMLElement) {
        // Create the element
        this._el = document.createElement("div");
        this._el.id = "ganttChart";
        el.appendChild(this._el);

        // Add a change event
        this._el.addEventListener("resize", () => {
            // See if we are off the screen
            let elPos = this._el.getBoundingClientRect();

            // Set the width
            this._el.style.width = (window.innerWidth - elPos.left - 10) + "px";
            this._el.style.border = "2px solid #DEE2E6";
            this._el.style.borderBottomLeftRadius = "5px";
            this._el.style.borderBottomRightRadius = "5px";
        });
    }

    // Creates the custom popup for the bars
    private createPopups() {
        // Parse the bars
        for (let i = 0; i < this._chart.bars.length; i++) {
            let bar = this._chart.bars[i];
            let item: IItem = bar.task.item;

            ItemForm.ListName = Strings.Lists.Schedule;

            let _elBody = document.createElement("div");
            _elBody.innerHTML = `<div class="lh-1 p-3">
        <div class="row text-white">
            <div class="col">
            <div class="row mt-3">
            <h6 class="fw-bold text-white">Description:</h6>
            <p class=" m-0">${item.Description || "No Description was provided."}</p>
                </div>
                <div class="row mt-2">
                    <div class="col">
                        <h6 class="fw-bold text-white">Start Date:</h6>
                        <p class=" m-0">${(moment(item.EventDate).format("MMM/DD/YYYY"))}</p>
                    </div>
                    <div class="col">
                        <h6 class="fw-bold text-white">End Date:</h6>
                        <p class=" m-0">${(moment(item.EndDate).format("MMM/DD/YYYY"))}</p>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col">
                        <h6 class="fw-bold text-white">Category:</h6>
                        <p class=" m-0">${item.Category || ""}</p>
                    </div>
                    <div class="col">
                        <h6 class="fw-bold text-white">Status:</h6>
                        <p class=" m-0">${item.Status || ""}</p>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col">
                        <h6 class="fw-bold text-white">Priority:</h6>
                        <p class=" m-0">${item.Priority || ""}</p>
                    </div>
                    <div class="col">
                        <h6 class="fw-bold text-white">Assigned:</h6>
                        <p class=" m-0">${item.AssignedTo.Title || ""}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>`

            let _elFooter = document.createElement("div");
            Components.Button({
                el: _elFooter,
                text: "Update",
                type: Components.ButtonTypes.OutlineLight,
                className: "mb-3",
                onClick: () => {
                    // Show the edit form
                    ItemForm.edit({
                        itemId: item.Id,
                        onUpdate: () => {
                            // TODO, get the refresh method from the App.
                            window.location.reload();
                        }
                    });
                }
            });

            _elBody.appendChild(_elFooter);

            // Create a popup
            Components.Popover({
                target: bar.group,
                className: "m-2",
                type: Components.PopoverTypes.Secondary,
                title: item.ProjectName,
                placement: Components.PopoverPlacements.Top,
                options: {
                    appendTo: this._el,
                    content: _elBody,
                    trigger: "focus"
                },
            });
        }
    }

    // Filters the gantt chart
    filter(value: string) {
        // Set the filter
        this._filter = value;

        // Refresh the gantt chart
        this.refresh();
    }

    // Hides the gantt chart
    hide() {
        // Hides the element
        this._el.classList.add("d-none");
    }

    // Loads the events
    private loadEvents() {
        // Clear the items
        this._items = [];

        // See if items exist
        if (DataSource.Items) {
            // Parse the events
            for (let i = 0; i < DataSource.Items.length; i++) {
                let item = DataSource.Items[i];

                // Validate the dates
                let startDate = item.EventDate;
                let endDate = item.EndDate;
                if (endDate && startDate) {
                    // See if the filter is set
                    if (this._filter) {
                        // Ensure the category matches
                        if (this._filter != item.Category) { continue; }
                    }

                    // Create the item
                    this._items.push({
                        id: "Event_" + item.Category,
                        item,
                        progress: 0, // A value is required
                        name: item.ProjectName,
                        start: new Date(startDate),
                        end: new Date(endDate),
                    });
                }
            }
        }
    }

    // Refreshes the gantt chart
    refresh() {
        // Load the rows and events
        this.loadEvents();

        // See if data exists
        if (this._chart) {
            // Clear the chart
            this._chart.clear();

            // Load the events
            this.loadEvents();

            // Refresh the chart
            this._items.length > 0 ? this._chart.refresh(this._items) : null;

            // Create the popup

        } else {
            // Render the gantt chart
            this.render();
        }
    }

    // Renders the gantt chart
    private render() {
        // Ensure items exist
        if (this._items.length > 0) {
            // Create the gantt chart
            this._chart = new Gantt(this._el, this._items, {
                popup_trigger: "",
                bar_height: 50,
                column_width: 50,
                view_mode: "Week",
                on_click: () => {
                    this.createPopups();
                }
            });



            // Resize the element
            this._el.dispatchEvent(new Event("resize"));
        }
    }

    // Shows the gantt chart
    show() {
        // Show the element
        this._el.classList.remove("d-none");

        // Render the gantt chart if it doesn't exist
        if (this._chart == null) { this.render(); }
    }

    // Changes view to Days
    viewDay() {
        this.Chart.change_view_mode('Day');
        // Create the popup

    }

    // Changes view to Weeks
    viewWeek() {
        this.Chart.change_view_mode('Week');
        // Create the popup

    }

    // Changes view to Months
    viewMonth() {
        this.Chart.change_view_mode('Month');
        // Create the popup

    }


}