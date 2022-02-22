import { Components } from "gd-sprest-bs";
import { DataSource, IItem } from "../ds";
import * as moment from "moment";
import { ItemForm, Modal } from "dattatable";
import Strings from "../strings";

import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { ITermInfo } from "gd-sprest-bs/src/webparts/types";

/**
 * Calendar App
 */
export class calendarApp {
    // Vars
    private _el: HTMLElement = null;
    private _filter: string = null;
    private _items: Array<any> = null;
    private _elBody = document.createElement("div");
    private _elFooter = document.createElement("div");

    // Calendar Chart
    private _Cchart = null;
    get Cal() { return this._Cchart; }

    // Constructor
    constructor(el: HTMLElement) {
        ItemForm.ListName = Strings.Lists.Schedule;
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
                        id: item.Id,
                        title: item.ProjectName,
                        description: item.Description,
                        priority: item.Priority,
                        Assignedto: item.AssignedTo.Title,
                        status: item.Status,
                        category: item.Category,
                        modified: item.Modified,
                        modifiedBy: item.Editor.Title,
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
                plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
                dayHeaderClassNames: "Calendar_Headings",
                dayCellClassNames: "Calendar_Cells",
                eventClassNames: "CalEvent",
                themeSystem: 'standard',
                //headerToolbar: false,
                initialView: 'dayGridMonth',
                events: this._items,
                height: "45vh",
                views: {
                    dayGrid: {
                        // options apply to dayGridMonth, dayGridWeek, and dayGridDay views

                    },
                    timeGrid: {
                        // options apply to timeGridWeek and timeGridDay views
                    },
                    week: {
                        // options apply to dayGridWeek and timeGridWeek views
                    },
                    day: {
                        // options apply to dayGridDay and timeGridDay views
                    }
                },
                eventClick: (info) => {
                    //info.event.extendedProps.priority,
                    this.itemModal(info);
                }
            });
            this._Cchart.updateSize();
            this._Cchart.render();
        }
    }
    private itemModal(info) {
        Modal.setHeader(info.event.title);
        this._elBody.innerHTML = `<div class="lh-1 p-3">
<div class="row text-black.">
<div class="col">
<div class="row mt-3">
<h6 class="fw-bold text-black text-uppercase">Description:</h6>
<p class=" m-0">${info.event.extendedProps.description || "No Description was provided."}</p>
    </div>
    <div class="row mt-2">
        <div class="col">
            <h6 class="fw-bold text-black text-uppercase">Start Date:</h6>
            <p class=" m-0">${(moment(info.event.extendedProps.start).format("MMM/DD/YYYY"))}</p>
        </div>
        <div class="col">
            <h6 class="fw-bold text-black text-uppercase">End Date:</h6>
            <p class=" m-0">${(moment(info.event.extendedProps.end).format("MMM/DD/YYYY"))}</p>
        </div>
    </div>
    <div class="row mt-3">
        <div class="col">
            <h6 class="fw-bold text-black text-uppercase">Category:</h6>
            <p class=" m-0">${info.event.extendedProps.category || ""}</p>
        </div>
        <div class="col">
            <h6 class="fw-bold text-black text-uppercase">Status:</h6>
            <p class=" m-0">${info.event.extendedProps.status || ""}</p>
        </div>
    </div>
    <div class="row mt-3">
        <div class="col">
            <h6 class="fw-bold text-black text-uppercase">Priority:</h6>
            <p class=" m-0">${info.event.extendedProps.priority || ""}</p>
        </div>
        <div class="col">
            <h6 class="fw-bold text-black text-uppercase">Assigned:</h6>
            <p class=" m-0">${info.event.extendedProps.Assignedto || ""}</p>
        </div>
    </div>
</div>
</div>
</div>`
        Modal.setBody(this._elBody);

        Modal.setFooter(this._elFooter);
        Modal.show();
    }

}