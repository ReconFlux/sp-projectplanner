import { Components, List, Types, Web } from "gd-sprest-bs";
import { IFieldValue } from "gd-sprest-bs/src/components/components";
import Strings from "./strings";

// Item
export interface IItem extends Types.SP.ListItem {
    AssignedToId: number;
    AssignedTo: { Title: string; Id: number; }
    Category: string;
    Description: string;
    EndDate: string;
    EventDate: string;
    ProjectName: string;
    Status: string;
    Priority: string;
}
export interface IConfiguration {
    "Navclass": string;
    "supportEmail": string;
}
/**
 * Data Source
 */
export class DataSource {
    // Category Filters
    private static _categoryFilters: Components.ICheckboxGroupItem[] = null;
    static get CategoryFilters(): Components.ICheckboxGroupItem[] { return this._categoryFilters; }
    static loadCategoryFilters(): PromiseLike<Components.ICheckboxGroupItem[]> {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Get the status field
            List(Strings.Lists.Schedule).Fields("Category").execute((fld: Types.SP.FieldChoice) => {
                let items: Components.ICheckboxGroupItem[] = [];

                // Parse the choices
                for (let i = 0; i < fld.Choices.results.length; i++) {
                    // Add an item
                    items.push({
                        label: fld.Choices.results[i],
                        type: Components.CheckboxGroupTypes.Switch
                    });
                }

                // Set the filters and resolve the promise
                this._categoryFilters = items.sort((a, b) => {
                    if (a.label < b.label) { return -1; }
                    if (a.label > b.label) { return 1; }
                    return 0;
                });
                resolve(items);
            }, reject);
        });
    }

    // Initializes the application
    static init(): PromiseLike<void> {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Load the data
            // Load the configuration
            this.loadConfiguration().then(() => {
                this.load().then(() => {
                    // Load the category filters
                    this.loadCategoryFilters().then(() => {
                        // Resolve the request
                        resolve();
                    }, reject);
                }, reject);
            }, reject)
        });
    }

    // Loads the list data
    private static _items: IItem[] = null;
    static get Items(): IItem[] { return this._items; }
    static load(): PromiseLike<IItem[]> {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Load the data
            List(Strings.Lists.Schedule).Items().query({
                Expand: ["AssignedTo"],
                GetAllItems: true,
                OrderBy: ["EventDate"],
                Select: ["*", "AssignedTo/Id", "AssignedTo/Title"],
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
}