import { Helper, SPTypes } from "gd-sprest-bs";
import Strings from "./strings";
/**
 * SharePoint Assets
 */
export const Configuration = Helper.SPConfig({
    ListCfg: [
        // Battle Rhythm Event List
        {
            ListInformation: {
                Title: Strings.Lists.Main,
                BaseTemplate: SPTypes.ListTemplateType.GenericList
            },
            TitleFieldDisplayName: "Project Name",
            CustomFields: [
                // Priorities
                {
                    name: "priorities",
                    title: "Priorities",
                    type: Helper.SPCfgFieldType.Choice,
                    required: true,
                    choices: ["High", "Medium", "Low"]
                } as Helper.IFieldInfoChoice,
                // Lines of Effort
                {
                    name: "linesofeffort",
                    title: "Lines of Effort",
                    type: Helper.SPCfgFieldType.Choice,
                    required: true,
                    choices: ["Effort A", "Effort B", "Effort C", "Effort D", "Effort E"]
                } as Helper.IFieldInfoChoice,
                // Status
                {
                    name: "Status",
                    title: "Status",
                    type: Helper.SPCfgFieldType.Choice,
                    choices: [
                        "Not Started",
                        "In Progress",
                        "Needs Attention",
                        "Completed",
                        "Cancelled",
                        "Delayed",
                        "Archived"
                    ],
                    defaultValue: "Not Started"
                } as Helper.IFieldInfoChoice,
                // Assessment
                {
                    name: "Assessment",
                    title: "Assessment",
                    type: Helper.SPCfgFieldType.Number,
                    defaultValue: "0",
                    min: 0,
                    max: 10,
                    numberType: SPTypes.FieldNumberType.Integer
                } as Helper.IFieldInfoNumber,
                {
                    name: "StartDate",
                    title: "Start Date",
                    displayFormat: SPTypes.DateFormat.DateOnly,
                    format: SPTypes.DateFormat.DateOnly,
                    type: Helper.SPCfgFieldType.Date
                } as Helper.IFieldInfoDate,
                {
                    name: "EndDate",
                    title: "End Date",
                    displayFormat: SPTypes.DateFormat.DateOnly,
                    format: SPTypes.DateFormat.DateOnly,
                    type: Helper.SPCfgFieldType.Date
                } as Helper.IFieldInfoDate,
            ],
            ViewInformation: [
                {
                    ViewName: "All Items",
                    ViewFields: [
                        "LinkTitle", "Priorities", "linesofeffort", "Status", "Assessment", "StartDate", "EndDate"
                    ]
                }
            ]
        },
        // Templates Library
        {
            ListInformation: {
                Title: Strings.Lists.Templates,
                BaseTemplate: SPTypes.ListTemplateType.DocumentLibrary
            }
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