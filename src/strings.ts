import { ContextInfo } from "gd-sprest-bs";
/**
 * Global Constants
 */

// Constant
export const SourceUrl: string = ContextInfo.webServerRelativeUrl + "/SiteAssets/sp-projectplanner/";

export default {
    AppElementId: "sp-projectplanner",
    DashboardName: "Dashboard View",
    DateFormat: "MM/DD/YYYY",
    GlobalVariable: "SPDashboard",
    ProjectName: "Project Planner",
    ProjectDescription: "This is a Simple Project Planner",
    Lists: {
        Main: "Projects",
        Templates: "Templates"
    },
    SolutionUrl: "/sites/Classic/projectplanner/SiteAssets/sp-projectplanner/index.html",
    SupportEmail: "stephenburtrum@burtrumtech.onmicrosoft.com",
    TimeFormat: "MM/DD/YYYY HH:mm:ss",
    TimelineName: "Timeline View",
    Version: "0.1",
    WebConfigUrl: SourceUrl + "config.json",
}

// 