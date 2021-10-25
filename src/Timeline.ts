import { ItemForm } from "dattatable";
import { Components, ContextInfo } from "gd-sprest-bs";
import * as moment from "moment";
import { DataItem, DataSet, DataView, Timeline } from "vis-timeline/standalone";
import { formatDateValue, getEventType, getFieldValue } from "./common";
import { DataSource } from "./ds";
import Strings from "./strings";
import { IDateRange } from "./subNavTimeline";

/**
 * Timeline
 */
export class BRETimeline {
    private _el: HTMLElement = null;
    private _filterStatus: string = null;
    private _filterPriority: string[] = null;
    private _items: Array<any> = null;
    private _timeline = null;
    private _view: DataView = null;

    // Constructor
    constructor(el) {
        // Save the properties
        this._el = el;
        this._items = [];

        // Set the data
        this.loadBREs();

        // Render the timeline
        this.render();

        // Wait for the elements to be added to the dom
        setTimeout(() => {
            // Update the zoom buttons
            this.updateZoomButtons();
        }, 10);
    }

    // Filter the timeline data
    private filterData(row) {
        // Item var
        let item = row.item;

        // Filter by status
        if (this._filterStatus) {
            // Status Var
            let status = item.Status;
            if (this._filterStatus.indexOf(status) < 0) { return false; }
        }
        // Filter by priority
        if (this._filterPriority) {
            // Status Var
            let priority = item.priorities;
            if (this._filterPriority.indexOf(priority) < 0) { return false; }
        }
        return true;
    }

    // Loads the groups
    private loadGroups() {
        let groups: any[] = null;
        let item = DataSource.Items

        let groupNames = {};
        let grOrder = 1;
        // Clear the groups
        groups = [];

        // Parse the visible items
        let items = this._view.get();
        for (let i = 0; i < items.length; i++) {
            let item = items[i];

            // Save the group name
            if (item.group) { groupNames[item.group] = true; }
        }

        // Parse the group names
        for (let groupName in groupNames) {
            // set the group style for calendar events
            switch (groupName) {
                case "Readiness":
                    grOrder = 1;
                    break;
                case "Processes":
                    grOrder = 2;
                    break;
                case "Community":
                    grOrder = 3;
                    break;
            }

            // Ensure the group exists
            if (groupName)
                // Add the group
                groups.push({
                    id: groupName,
                    content: groupName,
                    order: grOrder,

                });

        }

        // Update the groups
        groups = groups.length > 0 ? groups : null;

        // Return the groups
        return groups;
    }

    // Loads the objectives
    private loadBREs() {
        // See if items exist and we are not in a workspace
        if (DataSource.Items) {
            let cfg = DataSource.Configuration ? DataSource.Configuration : null;
            let objectives = [];

            // Parse the items
            for (let i = 0; i < DataSource.Items.length; i++) {
                let item = DataSource.Items[i];

                // Validate the dates
                let startDate = getFieldValue((cfg && cfg.objective ? cfg.objective.startField : "") || "StartDate", item);
                let endDate = getFieldValue((cfg && cfg.objective ? cfg.objective.endField : "") || "EndDate", item);
                if (endDate && startDate) {
                    // Create the timeline item
                    let timelineItem: DataItem = {
                        item,
                        id: "Event_" + item.Id,
                        className: "Itemclass_" + getFieldValue("linesofeffort", item),
                        group: getFieldValue("priorities", item),
                        content: item.Title,
                        title: item.Title,
                        start: formatDateValue(startDate),
                        end: formatDateValue(endDate)
                    } as any;

                    // Set the type
                    timelineItem.type = getEventType(timelineItem.start, timelineItem.end);


                    // Add the timeline item
                    objectives.push(timelineItem);
                }
            }

            // Append the objectives
            this._items = this._items.concat(objectives);
        }
    }

    // Renders the timeline
    private render() {
        // Clear the element
        while (this._el.firstChild) { this._el.removeChild(this._el.firstChild); }

        // Update the zoom buttons
        this.updateZoomButtons();

        // Ensure items exist
        if (this._items) {
            // See if no items exist
            if (this._items.length == 0) {
                // Render a card
                Components.Card({
                    el: this._el,
                    body: [{
                        title: "No Data",
                        text: "No data exists. Go to the dashboard and create some."
                    }]
                });
            } else {
                // Create the view
                this._view = new DataView(new DataSet(this._items), { filter: row => { return this.filterData(row); } });

                // Initialize the timeline
                this._timeline = new Timeline(this._el, this._view, this.loadGroups(), DataSource.TimelineOptions,);

                this._timeline.redraw();

                this._timeline.on("click", (props) => {
                    let data = null;
                    let event = null;
                    // check if the event was clicked
                    if (props.item) {
                        data = props.item.split("_");
                        //console.log(moment().format("MMM"));
                    }
                    if (data && data[0] == "Event") {
                        //console.log(moment().format("MMM"));
                        // Parse the events
                        for (let i = 0; i < DataSource.Items.length; i++) {
                            let item = DataSource.Items[i];

                            // See if this is the target item
                            if (item.Id == data[1]) {
                                let title = item.Title;
                                console.log(moment().format("MMM"));
                                console.log(title);
                                // Open the Display Form

                            }

                        }

                    }


                });

            }
        }
    }

    // Disables/Enables the zoom buttons
    private updateZoomButtons() {
        // Parse the zoom button elements
        let buttons = document.querySelectorAll(".btn-zoom");
        for (let i = 0; i < buttons.length; i++) {
            let btn = buttons[i] as HTMLButtonElement;
            let zoomLevel = parseInt(btn.getAttribute("data-zoom"));

            // See if this is the zoom in button
            if (btn.classList.contains("btn-zoom-in")) {
                // Don't do anything if we are at the limit
                if (zoomLevel == 0) { continue; }
            } else {
                // Don't do anything if we are at the limit
                if (zoomLevel == 1) { continue; }
            }

            // Enable/Disable the button based on if data exists
            btn.disabled = this._items == null || this._items.length == 0;
        }
    }


    // Refreshes the data item
    refresh() {
        // Clear the items
        this._items = [];

        // Load the data
        this.loadBREs();

        // See if data exists
        if (this._view && this._items && this._items.length > 0) {
            // Set the items
            this._view.setData(new DataSet(this._items));

            this._timeline.redraw();

        } else {
            // Render the timeline
            this.render();
        }
    }

    // Updates the date range
    updateDateRange(value: IDateRange) {
        // set the date range for the timeline from navigation bar
        let today = moment();

        // set today's date with the offset
        today.add(-value.OffsetMonths, "month");

        // set the Options for zoom 
        this._timeline.setOptions({

            zoomMin: value.ZoomMin,
            zoomMax: value.ZoomMax,
            zoomable: false,
            orientation: "top",

        });

        // reset the view to specified values
        this._timeline.setWindow(today.valueOf(), today.valueOf() + value.Range);
    }

    // Public Methods

    // Status filter
    filterByStatus(values: string) {
        // Set the filter
        this._filterStatus = values;

        // Refresh the timeline
        this._view.refresh();


        console.log(values);
        // Group Icon Properties

        // Set the groups
        this._timeline.setGroups(this.loadGroups());
    }

    // Priority filter
    filterByPriority(values: string[]) {
        // Set the filter
        this._filterPriority = values;

        // Refresh the timeline
        this._view.refresh();


        console.log(values);
        // Group Icon Properties

        // Set the groups
        this._timeline.setGroups(this.loadGroups());
    }
}