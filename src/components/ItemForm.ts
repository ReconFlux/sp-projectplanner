import { ItemForm } from "dattatable";
import { Components, Web } from "gd-sprest-bs";
import Strings from "../strings";

/**
 * Item Form
 * Custom form for the time away events list.
 */
export class EventsForm {
    // Creates an item
    static create(onUpdate: () => void) {
        // Set the list name
        ItemForm.ListName = Strings.Lists.Schedule;

        // Show the new form
        ItemForm.create({
            onCreateEditForm: props => { return this.updateFormProps(props, true); },
            onUpdate,
            onSave: (values) => {
                // Return a promise
                return new Promise((resolve, reject) => {
                    // Get the user
                    Web().getUserById(values.AssignedToId).execute(user => {
                        // Default the title field
                        values["Title"] = user.Title;

                        // Resolve the values
                        resolve(values);
                    }, reject);
                });
            }
        });
    }

    // Edits an item
    static edit(itemId: number, onUpdate: () => void) {
        // Set the list name
        ItemForm.ListName = Strings.Lists.Schedule;

        // Show the edit form
        ItemForm.edit({
            itemId,
            onCreateEditForm: this.updateFormProps,
            onUpdate
        });
    }

    // Views an item
    static view(itemId: number) {
        // Set the list name
        ItemForm.ListName = Strings.Lists.Schedule;

        // Show the view form
        ItemForm.view({
            itemId
        });
    }

    // Configures the new/edit form
    private static updateFormProps(props: Components.IListFormEditProps, newForm: boolean = false) {
        // Set the rendering event
        props.onControlRendering = (ctrl, field) => {
            // See if this is the start or end date field
            if (field.InternalName == "EventDate" || field.InternalName == "EndDate") {
                // Update the display format
                (ctrl as any as Components.IDateTimeProps).showTime = false;
            }

            // See if this is the "Assigned To" field and we are editing the form
            if (field.InternalName == "AssignedTo" && !newForm) {
                // Set the field to be read-only
                ctrl.isReadonly = true;
            }
        }

        // Return the properties
        return props;
    }
}