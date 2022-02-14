import { Helper, SPTypes } from "gd-sprest-bs";
import Strings from "./strings";

/**
 * SharePoint Assets
 */
export const Configuration = Helper.SPConfig({
    ListCfg: [
        {
            ListInformation: {
                Title: Strings.Lists.Schedule,
                BaseTemplate: SPTypes.ListTemplateType.Events
            },
            ContentTypes: [
                {
                    Name: "Event",
                    FieldRefs: [
                        "ProjectName", "Description", "Cost", "AssignedTo", "EventDate",
                        "EndDate", "Category", "Status", "Priority"
                    ]
                }
            ],
            CustomFields: [
                {
                    name: "AssignedTo",
                    title: "Assigned To",
                    type: Helper.SPCfgFieldType.User,
                    required: true,
                    selectionMode: SPTypes.FieldUserSelectionType.PeopleOnly,
                    defaultValue: "[Me]"
                } as Helper.IFieldInfoUser,
                {
                    name: "ProjectName",
                    title: "Project Name",
                    type: Helper.SPCfgFieldType.Text,
                    description: "Your project's name.",
                    required: true
                } as Helper.IFieldInfoText,
                {
                    name: "Status",
                    title: "Status",
                    type: Helper.SPCfgFieldType.Choice,
                    required: true,
                    choices: [
                        "Not Started",
                        "In Progress",
                        "On Hold",
                        "Delayed",
                        "Completed",
                        "Cancelled",
                        "Aborted"
                    ],
                    defaultValue: "Not Started"
                } as Helper.IFieldInfoChoice,
                {
                    name: "Priority",
                    title: "Priority",
                    type: Helper.SPCfgFieldType.Choice,
                    required: true,
                    choices: [
                        "High",
                        "Medium",
                        "Low"
                    ],
                    description: "Priority of the project.",
                    defaultValue: "Low",
                } as Helper.IFieldInfoChoice,
                {
                    name: "Cost",
                    title: "Cost",
                    type: Helper.SPCfgFieldType.Currency,
                    description: "Enter the total cost of the project if there is any.",
                    require: false,
                    min: 0,
                } as Helper.IFieldInfoCurrency,
            ],
            ViewInformation: [
                {
                    ViewName: "All Events",
                    ViewFields: [
                        "ProjectName", "Description", "Cost", "AssignedTo", "EventDate", "EndDate", "Category", "Status", "Priority",
                    ]
                }
            ]
        }
    ]
});

// Adds the solution to a classic page
Configuration["addToPage"] = (pageUrl: string) => {
    // Add a content editor webpart to the page
    Helper.addContentEditorWebPart(pageUrl, {
        contentLink: Strings.SolutionUrl,
        description: Strings.ProjectDescription,
        frameType: "None",
        title: Strings.ProjectName
    }).then(
        // Success
        () => {
            // Load
            console.log("[" + Strings.ProjectName + "] Successfully added the solution to the page.", pageUrl);
        },

        // Error
        ex => {
            // Load
            console.log("[" + Strings.ProjectName + "] Error adding the solution to the page.", ex);
        }
    );
}