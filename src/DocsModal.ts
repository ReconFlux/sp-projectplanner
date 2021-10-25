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
        this.render(el);
    }

    // Render method
    private render(el: HTMLElement) {

        // Create the Modal Header
        let _elHead = document.createElement("div");
        _elHead.id = "modalHeader";
        _elHead.innerHTML = "Item Documents Folder";
        Modal.setHeader(_elHead);

        let _elDoc = document.createElement("div");
        let Docs = new Documents({
            el: _elDoc,
            listName: strings.Lists.Main,
            itemId: this._itemID,
            canDelete: true,
            canEdit: true,
            canView: true,


        });
        Modal.setBody(_elDoc);
        // Modal Props
        Modal.setScrollable(true);
        Modal.setType(Components.ModalTypes.XLarge);
        // Show
        Modal.show();
    }
}