import { Modal, Documents } from "dattatable";
import { Components } from "gd-sprest-bs";
import { DataSource, IItem } from "./ds";
import strings from "./strings";

/**
 * Templates Modal
 */

// Export
export class DocModal {
    private _el: HTMLElement = null;
    private _docs: Documents = null;
    private _eventItem: IItem = null;
    private _itemID: number;

    // Constructor
    constructor(el: HTMLElement, item) {
        this._el = el;
        //this._eventItem = item;
        this._itemID = item.Id;

        // Render the modal
        this.render();
    }

    // Render method
    private render() {

        // Create the Modal Header
        Modal.setHeader("Item Documents Folder");

        // Create the attachments table
        let el = document.createElement("div");
        let docs = new Documents({
            el,
            listName: strings.Lists.Main,
            itemId: this._itemID,
            canDelete: true,
            canEdit: true,
            canView: true,
        });

        // Set the body
        Modal.setBody(el);

        // Modal Props
        Modal.setScrollable(true);
        Modal.setType(Components.ModalTypes.XLarge);

        // Show
        Modal.show();
    }
}