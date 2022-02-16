import { Components } from "gd-sprest-bs";
import Gantt from "frappe-gantt";
import { DataSource, IItem } from "../ds";

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

            // Create a popup
            Components.Popover({
                target: bar.group,
                title: "This is a Popover",
                placement: Components.PopoverPlacements.Top,
                options: {
                    appendTo: this._el,
                    content: "This is the content for: " + item.ProjectName,
                    trigger: "focus"
                }
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
            this.createPopups();
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
                view_mode: "Week",
                on_click: () => {
                    // Make sure the popup is hidden
                    this._chart.hide_popup();
                }
            });

            // Resize the element
            this._el.dispatchEvent(new Event("resize"));

            // Create the popup
            this.createPopups();
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
        this.createPopups();
    }
    // Changes view to Weeks
    viewWeek() {
        this.Chart.change_view_mode('Week');
        // Create the popup
        this.createPopups();
    }
    // Changes view to Months
    viewMonth() {
        this.Chart.change_view_mode('Month');
        // Create the popup
        this.createPopups();
    }

    
}