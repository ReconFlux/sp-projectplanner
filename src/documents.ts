import { Dashboard, ItemForm, LoadingDialog, Modal } from "dattatable";
import { Components, ContextInfo, Helper, List, Utility, Web, SPTypes, Types } from "gd-sprest-bs";
import { DataSource, IItem } from "./ds";
import { fileEarmarkText } from "gd-sprest-bs/build/icons/svgs/fileEarmarkText";
import { fileEarmarkX } from "gd-sprest-bs/build/icons/svgs/fileEarmarkX";
import { upload } from "gd-sprest-bs/build/icons/svgs/upload";
import Strings from "./strings"


export class Documents {
    // private variables
    private _dashboard: Dashboard = null;
    private _eventItem: IItem = null;
    private _itemID: number;
    private _el: HTMLElement = null;
    private _onUpdate: () => void = null;



    // Constructor
    constructor(el: HTMLElement, item: IItem, dashboard: Dashboard, onUpdate: () => void) {
        this._dashboard = dashboard;
        this._eventItem = item;
        this._itemID = item.Id;
        this._el = el;
        this.Render();
        this._onUpdate = onUpdate;
    }

    private Render() {
        //create table
        let actionsTable = document.createElement("table");
        actionsTable.classList.add("table");
        actionsTable.classList.add("eventDocsList");
        // Render the upload tooltip, if user is an admin

        let tableHeadEl = actionsTable.createTHead();
        let tableRowEl = document.createElement("tr");
        let tableColEl = document.createElement("td");
        tableColEl.setAttribute("colspan", "3");
        tableRowEl.appendChild(tableColEl);
        tableHeadEl.appendChild(tableRowEl);
        actionsTable.appendChild(tableHeadEl);
        this.renderUploadTooltip(tableColEl);

        // render the attachments list
        this.getAttachments(actionsTable);

        let listDiv = document.createElement("div");
        listDiv.classList.add("responsive");
        listDiv.appendChild(actionsTable);
        this._el.appendChild(listDiv);
    }

    private renderUploadTooltip(tableColEl: HTMLElement) {
        //Render the upload tooltip
        Components.Tooltip({
            el: tableColEl,
            content: "Upload a document",
            placement: Components.TooltipPlacements.Top,
            btnProps: {
                iconType: upload,
                iconSize: 24,
                toggle: "tooltip",
                type: Components.ButtonTypes.OutlinePrimary,
                onClick: () => {
                    this.uploadDocument();
                },
            }
        });
    }

    private uploadDocument() {
        Helper.ListForm.showFileDialog().then((fileInfo) => {
            LoadingDialog.setHeader("Upload Document");
            LoadingDialog.setBody("Uploading document to event");
            LoadingDialog.show();
            List(Strings.Lists.Main)
                .Items(this._itemID)
                .AttachmentFiles()
                .add(fileInfo.name, fileInfo.data)
                .execute(
                    (file) => {
                        // Refresh the dashboard
                        DataSource.refreshDashboard();
                        this._onUpdate;
                        LoadingDialog.hide();
                    },
                    (err) => {
                        alert("Error uploading the file");
                        LoadingDialog.hide();
                    }
                );
        });
    }

    private getAttachments(actionsTable: HTMLTableElement) {
        //Get the attachments list
        let attachments = List(Strings.Lists.Main)
            .Items(this._itemID)
            .AttachmentFiles()
            .executeAndWait().results;
        if (attachments.length > 0) {
            //build out the list items
            let listItems: Components.IListGroupItem[] = [];
            //create tbody for table
            let tableTBody = actionsTable.createTBody();
            attachments.forEach((attachment) => {
                let attachmentRow = document.createElement("tr");
                let attachmentTitleCell = document.createElement("td");
                attachmentTitleCell.classList.add("event-reg-fileName");
                attachmentTitleCell.innerText = attachment.FileName;
                let attachmentViewCell = document.createElement("td");
                attachmentViewCell.classList.add("viewBtn");
                let attachmentDeleteCell = document.createElement("td");
                attachmentDeleteCell.classList.add("deleteBtn");
                attachmentRow.appendChild(attachmentTitleCell);
                attachmentRow.appendChild(attachmentViewCell);
                attachmentRow.appendChild(attachmentDeleteCell);
                tableTBody.appendChild(attachmentRow);
                actionsTable.appendChild(tableTBody);
                //Render the view tooltip
                this.renderViewTooltip(attachmentViewCell, attachment);


                //Render the delete tooltip
                this.renderDeleteTooltip(attachmentDeleteCell, attachment);

            });
        }
    }

    private renderViewTooltip(attachmentViewCell: HTMLTableCellElement, attachment: Types.SP.Attachment) {
        Components.Tooltip({
            el: attachmentViewCell,
            content: "View the document",
            placement: Components.TooltipPlacements.Top,
            btnProps: {
                iconType: fileEarmarkText,
                iconSize: 24,
                toggle: "tooltip",
                type: Components.ButtonTypes.OutlinePrimary,
                onClick: () => {
                    this.viewDocument(attachment);
                },
            }
        });
    }

    private viewDocument(attachment: Types.SP.Attachment) {
        let isWopi: boolean = this.isWopi(attachment.FileName);
        window.open(
            isWopi
                ? ContextInfo.webServerRelativeUrl +
                "/_layouts/15/WopiFrame.aspx?sourcedoc=" +
                attachment.ServerRelativeUrl +
                "&action=view"
                : attachment.ServerRelativeUrl,
            "_blank"
        );
    }

    private renderDeleteTooltip(attachmentDeleteCell: HTMLTableCellElement, attachment: Types.SP.Attachment) {
        Components.Tooltip({
            el: attachmentDeleteCell,
            placement: Components.TooltipPlacements.Top,
            btnProps: {

                iconType: fileEarmarkX,
                iconSize: 24,
                toggle: "tooltip",
                type: Components.ButtonTypes.OutlineDanger,
                onClick: () => {
                    //create the confirmation modal
                    let elModal = document.getElementById(
                        "event-registration-modal"
                    );
                    if (elModal == null) {
                        //create the element
                        elModal = document.createElement("div");
                        elModal.className = "modal";
                        elModal.id = "event-registration-modal";
                        document.body.appendChild(elModal);
                    }
                    //Create the modal
                    let modal = Components.Modal({
                        el: elModal,
                        title: "Delete Document",
                        body: "Are you sure you wanted to delete the selected document?",
                        type: Components.ModalTypes.Medium,
                        onClose: () => {
                            if (elModal) {
                                document.body.removeChild(elModal);
                                elModal = null;
                            }
                        },
                        onRenderBody: (elBody) => {
                            let alert = Components.Alert({
                                type: Components.AlertTypes.Danger,
                                content: "Error deleting the document",
                                className: "docDeleteErr",
                            });
                            elBody.prepend(alert.el);
                            alert.hide();
                        },
                        onRenderFooter: (elFooter) => {
                            Components.ButtonGroup({
                                el: elFooter,
                                buttons: [
                                    {
                                        text: "Yes",
                                        type: Components.ButtonTypes.Primary,
                                        onClick: (button) => {
                                            this.deleteDocument(attachment, modal);
                                        },
                                    },
                                    {
                                        text: "No",
                                        type: Components.ButtonTypes.Secondary,
                                        onClick: () => {
                                            modal.hide();
                                        },
                                    },
                                ],
                            });
                        },
                    });
                    modal.show();
                },
            },
            options: {
                allowHTML: false,
                animation: "scale",
                content: "Delete the document",
                delay: 100,
                inertia: true,
                interactive: false,
                placement: "top",
                theme: "Danger",
            },
        });
    }

    private deleteDocument(attachment: Types.SP.Attachment, modal: Components.IModal) {
        let elAlert =
            document.querySelector(".docDeleteErr");
        let fileName = attachment.FileName;
        LoadingDialog.setHeader(
            "Delete Document"
        );
        LoadingDialog.setBody(
            "Deleting the document"
        );
        LoadingDialog.show();
        //Show a dialog
        List(Strings.Lists.Main)
            .Items(this._itemID)
            .AttachmentFiles(fileName)
            .delete()
            .execute(
                () => {
                    // Refresh the dashboard
                    DataSource.refreshDashboard();
                    LoadingDialog.hide();
                    modal.hide();
                },
                () => {
                    elAlert.classList.remove("d-none");
                    LoadingDialog.hide();
                }
            );
    }

    private isWopi(file: string) {
        let extension = file.split(".");
        switch (extension[extension.length - 1].toLowerCase()) {
            // Excel
            case "csv":
            case "doc":
            case "docx":
            //case "pdf":
            case "ppt":
            case "pptx":
            case "xls":
            case "xlsx":
                return true;
                break;
            // Default
            default: {
                return false;
            }
        }
    }
}