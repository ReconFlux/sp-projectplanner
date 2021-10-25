import { DataTable, ItemForm, LoadingDialog, Modal, Documents } from "dattatable";
import { Components, ContextInfo, Helper, List, SPTypes, Types, Web } from "gd-sprest-bs";
import * as jQuery from "jquery";
import * as moment from "moment";

import { formatBytes, formatTimeValue } from "./common";
import { DataSource } from "./ds";
import strings from "./strings";

/**
 * Templates Modal
 */

// Export
export class templateModal {
    private _el: HTMLElement = null;
    private _docs: Documents = null;

    // Constructor
    constructor(el: HTMLElement) {
        this._el = el;

        // Initialize the application
        DataSource.init().then(() => {
            // Render the dashboard
            this.render(el);
        });
    }

    private render(el: HTMLElement) {

        // Create the Modal Header
        let _elHead = document.createElement("div");
        _elHead.id = "modalHeader";
        _elHead.innerHTML = "Templates Folder";
        Modal.setHeader(_elHead);

        let _elDoc = document.createElement("div");
        let Docs = new Documents({
            el: _elDoc,
            listName: strings.Lists.Templates,
            canDelete: true,
            canView: true,
            canEdit: true,
        });
        Modal.setBody(_elDoc);
        // Modal Props
        Modal.setScrollable(true);
        Modal.setType(Components.ModalTypes.XLarge);
        // Show
        Modal.show();
    }
}