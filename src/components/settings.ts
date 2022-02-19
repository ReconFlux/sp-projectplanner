import { ItemForm, Modal } from "dattatable";
import { Components, Web } from "gd-sprest-bs";
import Strings from "../strings";
import { DataSource, IItem } from "../ds";
import { ButtonTypes, Field, IFormProps } from "gd-sprest-bs/src/components/components";
/**
 * Settings Form
 */
export class settingsForm {

    // Vars
    private _el: HTMLElement;
    private _form: Components.IListForm = null
    // Constructor
    constructor() {

        this.render();
    }
    //Render
    private render() {
        // Sets the Header
        Modal.setHeader("Solution Settings");
        // Create a element for the body
        let _elBody = document.createElement("div");
        // Create the Body
        let _formDrop = Components.Form({
            el: _elBody,
            value: {
                NavbarType: 1
            },
            rows: [
                {
                    columns: [
                        {
                            control: {
                                label: "Nav Type: ",
                                name: "NavbarType",
                                type: Components.FormControlTypes.Dropdown,
                                onControlRendering: (props: Components.IFormControlPropsDropdown) => {
                                    props.id = "Navbar_setting_color";
                                    props.isPlainText = true;
                                    props.onChange = (item) => {
                                        // DataSource.Configuration.Navclass = item
                                    }
                                    props.items = [
                                        { text: "Choice 1", value: "1" },
                                        { text: "Choice 2", value: "2" },
                                        { text: "Choice 3", value: "3" },
                                    ];
                                },
                            }
                        }
                    ]
                }
            ]
        });
        Modal.setBody(_elBody);
        // Create a element for the footer
        let _elFooter = document.createElement("div");
        // Creates the Footer buttons
        Components.ButtonGroup({
            el: _elFooter,
            buttonType: Components.ButtonTypes.OutlineSecondary,
            buttons: [
                {
                    text: "Cancel",
                    isSmall: true,
                    onClick: () => {
                        // Closes the modal
                        Modal.hide();
                        console.log(DataSource.Configuration.Navclass);
                    }
                },
                {
                    text: "Update",
                    isSmall: true,
                    onClick: () => {
                        // Updates the settings
                        settingsForm.updateNav();
                        // Refreshes the page
                    }
                }
            ]
        });
        Modal.setFooter(_elFooter);
        Modal.show();
    }

    static get navsetting() {
        let input = (<HTMLInputElement>document.querySelector('div[aria-labelledby="Navbar_setting_color_label"]')).value;

        return input
    }

    getChoiceValue() {
    }

    static updateNav() {
        DataSource.Configuration.Navclass = settingsForm.navsetting
    }

}