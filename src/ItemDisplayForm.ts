import Strings from "./strings";
import { ItemForm, Modal, Documents, DataTable } from "dattatable";
import { DataSource, IItem } from "./ds";
import * as moment from "moment";

/**
 * Item Display Form
 */

export class ItemDisplayForm {
    // Global vars
    private _el: HTMLElement = null;
    private _itemID: number;
    private _docs: Documents = null;
    // constructor
    constructor(el: HTMLElement, item) {
        // Save the properties
        this._el = el;
        // grabs the item ID
        this._itemID = item.Id;
    }
    // render
    // modal head
    // modal body
    // modal footer
}