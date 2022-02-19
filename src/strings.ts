import { ContextInfo } from "gd-sprest-bs";

// Constant
export const SourceUrl: string = ContextInfo.webServerRelativeUrl + "/SiteAssets/sp-projectplanner/";

// Updates the strings for SPFx
export const setContext = (context) => {
    // Set the page context
    ContextInfo.setPageContext(context);

    // Update the values
    Strings.SolutionUrl = ContextInfo.webServerRelativeUrl + "/SiteAssets/schedule/index.html";

}

// Strings
const Strings = {
    AppElementId: "sp-projectplanner",
    GlobalVariable: "SPDashboard",
    Lists: {
        Schedule: "Projects"
    },
    ProjectName: "My Planner",
    ProjectDescription: "A Simple Project Planner Application",
    SolutionUrl: ContextInfo.webServerRelativeUrl + "/siteassets/sp-projectplanner/index.html",
    SupportEmail: "stephenburtrum@burtrumtech.onmicrosoft.com",
    TimeFormat: "MM/DD/YYYY HH:mm:ss",
    DateFormat: "MM/DD/YYYY",
    Version: "0.1",
    WebConfigUrl: SourceUrl + "config.json",
}
export default Strings;