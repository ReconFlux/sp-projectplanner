import { Components } from "gd-sprest-bs";
import { DataSource, IItem } from "../ds";
import * as moment from "moment";
import { ItemForm } from "dattatable";
import Strings from "../strings";

import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

/**
 * Calendar App
 */
export class calendarApp {
    // Vars
    private _el: HTMLElement = null;
    private _filter: string = null;
    private _items: Array<any> = null;

    // Calendar Chart
    private _Cchart = null;
    get Cal() { return this._Cchart; }

    // Constructor
    constructor(el: HTMLElement) {
        // Create the element
        this.createElement(el);

        // Load the rows and events
        this.loadEvents();

        // Shows the Calendar
        this.render();
    }


    // Methods
    // Filters the gantt chart
    filter(value: string) {
        // Set the filter
        this._filter = value;

    }
    private createElement(el: HTMLElement) {
        // Create the element
        this._el = document.createElement("div");
        this._el.id = "MyCalendar";
        el.appendChild(this._el);

    }
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
                        title: item.ProjectName,
                        start: new Date(startDate),
                        end: new Date(endDate),
                    });
                }
            }
        }
    }
    // Render
    private render() {
        // Ensure items exist
        if (this._items.length > 0) {

            // Create the Calenar
            this._Cchart = new Calendar(this._el, {
                plugins: [dayGridPlugin],
                headerToolbar: false,
                initialView: 'dayGridMonth',
                events: this._items,
                height: "45vh",
            });
            this._Cchart.updateSize();
            this._Cchart.render();
        }
    }
}