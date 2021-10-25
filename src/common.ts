import { Icons } from "./icons";
import { Modal } from "dattatable";
import { Components, ContextInfo } from "gd-sprest-bs";
import * as moment from "moment";
import Strings from "./strings";
// Generates the Assessment Icon
export const generateAssessmentIcon = (el: HTMLElement, value: number) => {
    // Check the value
    if (value < 0 || value > 10) { value = 0; }

    // Create the element for the value
    let span = document.createElement("span");
    span.className = "ps-3";

    // Determine the color based on the value
    switch (value) {
        case 0:
        case 1:
        case 2:
        case 3:
            span.classList.add("text-danger");
            break;
        case 4:
        case 5:
        case 6:
            span.classList.add("text-warning");
            break;
        case 7:
        case 8:
        case 9:
        case 10:
            span.classList.add("text-success");
            break;
        default:
            span.classList.add("text-muted");
            break;
    }

    // Add the circle number icon
    span.appendChild(Icons["Circle_" + value](36));
    span.title = "Assessment: " + value;

    // Add the element
    el.appendChild(span);
}

// Formats the time value
export const formatTimeValue = (value: string) => {
    // Ensure a value exists
    if (value) {
        // Return the date value
        return moment(value).format(Strings.TimeFormat);
    }

    // Return nothing
    return "";
}

// Formats file size into human readable form
export const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    // Return the formatted size string
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Formats the date value
export const formatDateValue = (value: string) => {
    // Ensure a value exists
    if (value) {
        // Return the date value
        return moment(value).format(Strings.DateFormat);
    }

    // Return nothing
    return "";
}

// Gets the event type for the timeline
export const getEventType = (startTime, endTime) => {
    let type = null;
    // Ensure the dates exist
    if (startTime && endTime) {
        let dtStart = moment(startTime);
        let dtEnd = moment(endTime);

        // See if the date/time spans more than a week
        if (dtEnd.diff(dtStart, "days") <= 1) {
            // Set the type
            type = "point";
        }
    }

    // Return the type
    return type;
}

// Gets the field value
export const getFieldValue = (propName: string, value: any) => {
    // Split the properties
    let keys = propName.split(".");

    // Set the field value
    let fieldValue = value;
    for (let i = 0; i < keys.length; i++) {
        // Set the field value
        fieldValue = fieldValue ? fieldValue[keys[i]] : null;
    }

    // Return the field value
    return fieldValue || "";
}