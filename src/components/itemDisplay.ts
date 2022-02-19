import { ItemForm, Modal } from "dattatable";
import { DataSource, IItem } from "../ds";
import { Components } from "gd-sprest-bs";
import * as jQuery from "jquery";
import * as moment from "moment";
import Strings from "../strings";

/**
 * Item Display
 * Modal Popup when selecting an Item from the chart
 */

export class itemDisplay {
    // VARS
    private _el: HTMLElement = null;
    private _elDisplayForm: HTMLElement = null;
    private _item: IItem = null;
    // CONSTRUCTOR
    constructor(el: HTMLElement, item: IItem) {
        // grabs the item ID
        this._item = item;
        // Set the list
        ItemForm.ListName = Strings.Lists.Schedule;
        // Set the render
        this.render(el);
    }
    // METHODS
    // Render
    private render(el: HTMLElement) {
        // Sets the Header
        // Sets the Body
        let _elBody = document.createElement("div");
        _elBody.innerHTML = `<div class="lh-1">
        <div class="row text-black">
            <div class="col">
            <div class="row mt-3">
                    <div class="col">
                        <h6 class="fw-bold text-black">Name:</h6>
                        <p class=" m-0">${this._item.ProjectName}</p>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col">
                        <h6 class="fw-bold text-black">Start Date:</h6>
                        <p class=" m-0">${(moment(this._item.EventDate).format("MMM/DD/YYYY"))}</p>
                    </div>
                    <div class="col">
                        <h6 class="fw-bold text-black">End Date:</h6>
                        <p class=" m-0">${(moment(this._item.EndDate).format("MMM/DD/YYYY"))}</p>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col">
                        <h6 class="fw-bold text-black">Category:</h6>
                        <p class=" m-0">${this._item.Category}</p>
                    </div>
                    <div class="col">
                        <h6 class="fw-bold text-black">Status:</h6>
                        <p class=" m-0">${this._item.Status || ""}</p>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col">
                        <h6 class="fw-bold text-black">Priority:</h6>
                        <p class=" m-0">${this._item.Priority}</p>
                    </div>
                    <div class="col">
                        <h6 class="fw-bold text-black">Assigned:</h6>
                        <p class=" m-0">${this._item.AssignedTo.Title || ""}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>`
        Modal.setBody(_elBody);
        // Sets the Footer
        // Shows the Modal
        Modal.show();
    }
}