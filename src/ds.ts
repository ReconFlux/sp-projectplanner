import { Dashboard } from "dattatable";
import { Components, Helper, List, Types, Web } from "gd-sprest-bs";
import Strings from "./strings";
import * as moment from "moment";
import { formatDateValue } from "./common";
import { App } from "./app";

// Item
export interface IItem extends Types.SP.ListItem {
    Priorities: string;
    Status: string;
    linesofeffort: string;
    Assessment: string;
    Title: string;
}

// Configuration
export interface IConfiguration {
    objective: {
        startField: string;
        endField: string;
        groupField: string;
        subGroupField: string;
    };
    task: {
        startField: string;
        endField: string;
    };
    links: Array<{ title: string; url: string; }>
    options: any;
    templatesDocLibrary: string;
    supportEmail: string;
    battleRhythmUrl: string;
}

/**
 * Data Source
 */
export class DataSource {

    // Initializes the application
    static init(): PromiseLike<void> {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Load the data
            this.load().then(() => {
                // Load the status filters
                this.loadTemplateFiles().then(() => {
                    // Load the status filters
                    this.loadStatusFilters().then(() => {
                        // Load the priority filters
                        this.loadPriorityFilters().then(() => {
                            // Resolve the request
                            resolve();
                        }, reject);
                    }, reject);
                }, reject);
            }, reject)
        });
    }

    // Templates Files 
    private static _files: Types.SP.File[];
    static get Files(): Types.SP.File[] { return this._files; }
    private static _folders: Types.SP.FolderOData[];
    static get Folders(): Types.SP.FolderOData[] { return this._folders; }
    static loadTemplateFiles(): PromiseLike<void> {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Load the library
            List(Strings.Lists.Templates).RootFolder().query({
                Expand: [
                    "Folders", "Folders/Files", "Folders/Files/Author", "Folders/Files/ListItemAllFields", "Folders/Files/ModifiedBy",
                    "Files", "Files/Author", "Files/ListItemAllFields", "Files/ModifiedBy"
                ]
            }).execute(folder => {
                // Set the folders and files
                this._files = folder.Files.results;
                this._folders = [];
                for (let i = 0; i < folder.Folders.results.length; i++) {
                    let subFolder = folder.Folders.results[i];
                    // Ignore the OTB Forms internal folder  
                    if (subFolder.Name != "Forms") { this._folders.push(subFolder as any); }
                }

                // Resolve the request
                resolve();
            }, reject);
        });
    }

    // Loads the list data
    private static _items: IItem[] = null;
    static get Items(): IItem[] { return this._items; }
    private static _listInfo: Helper.IListFormResult = null;
    static get listInfo(): Helper.IListFormResult { return this._listInfo; }
    static get listItem(): IItem { return this._listInfo ? this._listInfo.item as any : null; }
    static load(): PromiseLike<IItem[]> {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Load the data
            List(Strings.Lists.Main).Items().query({
                GetAllItems: true,
                OrderBy: ["Title"],
                Top: 5000
            }).execute(
                // Success
                items => {
                    // Set the items
                    this._items = items.results as any;

                    // Resolve the request
                    resolve(this._items);
                },
                // Error
                () => { reject(); }
            );
        });
    }

    // Gets the item id from the query string
    static getItemIdFromQS() {
        // Get the id from the querystring
        let qs = document.location.search.split('?');
        qs = qs.length > 1 ? qs[1].split('&') : [];
        for (let i = 0; i < qs.length; i++) {
            let qsItem = qs[i].split('=');
            let key = qsItem[0];
            let value = qsItem[1];

            // See if this is the "id" key
            if (key == "ID") {
                // Return the item
                return parseInt(value);
            }
        }
    }

    // Configuration
    private static _cfg: IConfiguration = null;
    static get Configuration(): IConfiguration { return this._cfg; }
    static loadConfiguration(): PromiseLike<void> {
        // Return a promise
        return new Promise(resolve => {
            // Get the current web
            Web().getFileByServerRelativeUrl(Strings.WebConfigUrl).content().execute(
                // Success
                file => {
                    // Convert the string to a json object
                    let cfg = null;
                    try { cfg = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(file))); }
                    catch { cfg = {}; }

                    // Set the configuration
                    this._cfg = cfg;

                    // Resolve the request
                    resolve();
                },

                // Error
                () => {
                    // Set the configuration to nothing
                    this._cfg = {} as any;

                    // Resolve the request
                    resolve();
                }
            );
        });
    }

    // Timeline Options
    static get TimelineOptions() {
        let options = (this.Configuration ? this.Configuration.options : null) || {};
        options.tooltip = options.tooltip || {};
        options.tooltip.template = (originalItemData, parsedItemData) => {
            let item = null;
            item = originalItemData.item;
            if (item) {
                return `<span>${"LOE: " + item.linesofeffort}<br/> ${"BR Event: " + item.Title}<br/> ${"Start Date: " + formatDateValue(item.EventDate ? item.EventDate : item.StartDate)}<br/> ${"End Date: " + formatDateValue(item.EndDate ? item.EndDate : item.DueDate)}<br/> ${"Status: " + item.Status}<br/> ${"Assessment: " + item.Assessment}<br/></span>`;
            }
            return originalItemData.title;
        }
        // set options for start and end dates
        let today = moment();
        options.start = options.start || {};
        options.start = moment(today.add(-1, "month")).format('YYYY/MM/DD');
        options.end = options.end || {};
        options.end = moment(today.add(2, "month")).format('YYYY/MM/DD');
        options.zoomable = false;
        options.orientation = "top";
        options.maxHeight = 340;

        // Return the options
        return options;
    }

    private static _dashboard: Dashboard = null;
    static get Dashboard(): Dashboard { return this._dashboard; }
    static setDashBoard(dashboard: Dashboard) {
        this._dashboard = dashboard;
    }
    static refreshDashboard() {
        if (this._dashboard != null) {
            this.load().then((items) => {
                this._dashboard.refresh(items);
            });
        }
    }

    // Status Filters
    private static _statusFilters: Components.ICheckboxGroupItem[] = null;
    static get statusFilters(): Components.ICheckboxGroupItem[] { return this._statusFilters; }
    static loadStatusFilters(): PromiseLike<Components.ICheckboxGroupItem[]> {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Get the status field
            List(Strings.Lists.Main).Fields("Status").execute((fld: Types.SP.FieldChoice) => {
                let items: Components.ICheckboxGroupItem[] = [];

                // Parse the choices
                for (let i = 0; i < fld.Choices.results.length; i++) {
                    // Add an item
                    items.push({
                        label: fld.Choices.results[i],
                        type: Components.CheckboxGroupTypes.Switch,
                        isSelected: false
                    });
                }

                // Set the filters and resolve the promise
                this._statusFilters = items;
                resolve(items);
            }, reject);
        });
    }

    // Priorities Filters
    private static _priorityFilters: Components.ICheckboxGroupItem[] = null;
    static get priorityFilters(): Components.ICheckboxGroupItem[] { return this._priorityFilters; }
    static loadPriorityFilters(): PromiseLike<Components.ICheckboxGroupItem[]> {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Get the status field
            List(Strings.Lists.Main).Fields("priorities").execute((fld: Types.SP.FieldChoice) => {
                let items: Components.ICheckboxGroupItem[] = [];

                // Parse the choices
                for (let i = 0; i < fld.Choices.results.length; i++) {
                    // Add an item
                    items.push({
                        label: fld.Choices.results[i],
                        type: Components.CheckboxGroupTypes.Switch,
                        isSelected: true
                    });
                }

                // Set the filters and resolve the promise
                this._priorityFilters = items;
                resolve(items);
            }, reject);
        });
    }
}
