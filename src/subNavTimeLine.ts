import { Components } from "gd-sprest-bs";
import { filter } from "gd-sprest-bs/build/icons/svgs/filter";
import { zoomIn } from "gd-sprest-bs/build/icons/svgs/zoomIn";
import { zoomOut } from "gd-sprest-bs/build/icons/svgs/zoomOut";
import legend from "./legend";
import Strings from "./strings";
import { cardList } from "gd-sprest-bs/build/icons/svgs/cardList";

// Properties
export interface ITimelineNavigationProps {
    el: HTMLElement;
    onSetDateRange: (props: IDateRange) => void;
    onShowFilter?: () => void;
}

// Date Range Information
export interface IDateRange {
    OffsetMonths: number;
    Range: number;
    Title: string;
    ZoomMin: number;
    ZoomMax: number;
}

/*
 * Timeline View Data
 */
const TL_MO_1: IDateRange = {
    OffsetMonths: 1,
    Range: 2678400000 * 2,
    Title: "One Month",
    ZoomMin: 2628000000, // 1 months in milliseconds
    ZoomMax: 5256000000 // 2 months in milliseconds
}
const TL_MO_3: IDateRange = {
    OffsetMonths: 3,
    Range: 2678400000 * 6,
    Title: "Three Months",
    ZoomMin: 7889400000, // 3 months in milliseconds
    ZoomMax: 15778800000 // 6 months in milliseconds
}
const TL_MO_6: IDateRange = {
    OffsetMonths: 6,
    Range: 2678400000 * 12,
    Title: "Six Months",
    ZoomMin: 15778800000, // 6 months in milliseconds
    ZoomMax: 31557600000 // 12 months in milliseconds
}
const TL_YR_1: IDateRange = {
    OffsetMonths: 12,
    Range: 2678400000 * 24,
    Title: "One Year",
    ZoomMin: 31557600000, // 1 year in milliseconds
    ZoomMax: 63115200000 // 2 years in milliseconds
}
const TL_YR_3: IDateRange = {
    OffsetMonths: 36,
    Range: 2678400000 * 72,
    Title: "Three Years",
    ZoomMin: 94672800000, // 3 years in milliseconds
    ZoomMax: 189345600000 // 6 years in milliseconds
}
const TL_YR_5: IDateRange = {
    OffsetMonths: 60,
    Range: 2678400000 * 120,
    Title: "Five Years",
    ZoomMin: 157788000000, // 3 years in milliseconds
    ZoomMax: 315576000000 // 6 years in milliseconds
}

/**
 * Timeline Navigation
 */
export class TimelineNavigation {
    private _el: HTMLElement = null;
    private _onSetDateRange: (props: IDateRange) => void = null;
    private _onShowFilter: () => void = null;
    private _zoomData: IDateRange[] = [TL_MO_1, TL_MO_3, TL_MO_6, TL_YR_1, TL_YR_3, TL_YR_5];
    private _zoomLevel: number = null;
    private _zoomInBtn: Components.ITooltip = null;
    private _zoomOutBtn: Components.ITooltip = null;

    // Constructor
    constructor(props: ITimelineNavigationProps) {
        // Save the properties
        this._el = props.el;
        this._onSetDateRange = props.onSetDateRange;
        this._onShowFilter = props.onShowFilter;

        // Set an id for the element
        this._el.id = "timelineDiv";
        this._zoomLevel = 0;

        // Render the navigation
        this.render();
        this.legend(this._el);
    }

    // Renders the sub navigation
    private render() {
        // Render a navbar
        let nav = Components.Navbar({
            el: this._el,
            brand: Strings.TimelineName + ": " + this._zoomData[this._zoomLevel].Title,
            items: [
                {
                    // Legend
                    text: "Legend",
                    isButton: true,
                    iconSize: 24,
                    iconType: cardList,
                    className: "btn-outline-dark m-2 me-0",
                    onClick: () => {
                        let legend = document.querySelector(".Legend_Toast");
                        if (legend.classList.contains("hide")) {

                            // update class
                            legend.classList.remove("d-none")
                            legend.classList.remove("hide");
                            legend.classList.add("show");
                        } else {

                            // hide it

                            legend.classList.remove("show");
                            legend.classList.add("hide");
                            legend.classList.add("d-none");
                        }

                    }
                }
            ],
            itemsEnd: [
                {
                    text: "Zoom In",
                    onRender: (el, item) => {
                        // Clear the existing button
                        el.innerHTML = "";
                        // Create a span to wrap the icon in
                        let span = document.createElement("span");
                        span.className = "bg-white d-inline-flex ms-2 rounded";
                        el.appendChild(span);

                        // Render a tooltip
                        this._zoomInBtn = Components.Tooltip({
                            el: span,
                            content: item.text,
                            type: Components.TooltipTypes.LightBorder,
                            btnProps: {
                                // Render the icon button
                                className: "p-1 btn-zoom btn-zoom-in",
                                iconType: zoomIn,
                                iconSize: 24,
                                isDisabled: true,
                                type: Components.ButtonTypes.OutlineSecondary,
                                onClick: () => {
                                    // Remove one from the zoom level
                                    this._zoomLevel--;

                                    // Set the zoom level
                                    this._zoomInBtn.el.setAttribute("data-zoom", this._zoomLevel.toString());

                                    // Enable or disable the zoom buttons based on their level
                                    if (this._zoomLevel == 0) { this._zoomInBtn.el.setAttribute("disabled", "disabled"); }
                                    else if (this._zoomLevel == (this._zoomData.length - 2)) { this._zoomOutBtn.el.removeAttribute("disabled"); }

                                    // Call the event
                                    this._onSetDateRange(this._zoomData[this._zoomLevel]);

                                    // Update the navbar heading with the zoomlevel text
                                    nav.el.querySelector(".navbar-brand").innerHTML = Strings.TimelineName + ": " + this._zoomData[this._zoomLevel].Title;
                                }
                            },
                        });

                        // Set the zoom level
                        this._zoomInBtn.el.setAttribute("data-zoom", this._zoomLevel.toString());
                    }
                },
                {
                    text: "Zoom Out",
                    onRender: (el, item) => {
                        // Clear the existing button
                        el.innerHTML = "";
                        // Create a span to wrap the icon in
                        let span = document.createElement("span");
                        span.className = "bg-white d-inline-flex ms-2 rounded";
                        el.appendChild(span);

                        // Render a tooltip
                        this._zoomOutBtn = Components.Tooltip({
                            el: span,
                            content: item.text,
                            type: Components.TooltipTypes.LightBorder,
                            btnProps: {
                                // Render the icon button
                                className: "p-1 btn-zoom btn-zoom-out",
                                iconType: zoomOut,
                                iconSize: 24,
                                type: Components.ButtonTypes.OutlineSecondary,
                                onClick: () => {
                                    // Add one to the zoom level
                                    this._zoomLevel++;

                                    // Set the zoom level
                                    this._zoomOutBtn.el.setAttribute("data-zoom", this._zoomLevel.toString());

                                    // Enable or disable the zoom buttons based on their level
                                    if (this._zoomLevel == 1) { this._zoomInBtn.el.removeAttribute("disabled"); }
                                    else if (this._zoomLevel == (this._zoomData.length - 1)) { this._zoomOutBtn.el.setAttribute("disabled", "disabled"); }

                                    // Call the event
                                    this._onSetDateRange(this._zoomData[this._zoomLevel]);

                                    // Update the navbar heading with the zoomlevel text
                                    nav.el.querySelector(".navbar-brand").innerHTML = Strings.TimelineName + ": " + this._zoomData[this._zoomLevel].Title;
                                }
                            },
                        });

                        // Set the zoom level
                        this._zoomOutBtn.el.setAttribute("data-zoom", this._zoomLevel.toString());
                    }
                },
                {
                    text: "Filters",
                    onRender: (el, item) => {
                        // Clear the existing button
                        el.innerHTML = "";
                        // Only render if onShowFilter was passed in
                        if (this._onShowFilter) {
                            // Create a span to wrap the icon in
                            let span = document.createElement("span");
                            span.className = "bg-white d-inline-flex ms-2 rounded";
                            el.appendChild(span);

                            // Render a tooltip
                            Components.Tooltip({
                                el: span,
                                content: item.text,
                                type: Components.TooltipTypes.LightBorder,
                                btnProps: {
                                    // Render the icon button
                                    iconType: filter,
                                    iconSize: 28,
                                    type: Components.ButtonTypes.OutlineSecondary,
                                    onClick: () => {
                                        this._onShowFilter();
                                    }
                                },
                            });
                        }
                    }
                }
            ]
        });
        /* Fix the padding on the left & right of the nav */
        nav.el.querySelector("div.container-fluid").classList.add("ps-75");
        nav.el.querySelector("div.container-fluid").classList.add("pe-2");
    }
    // Legend
    private legend(el: HTMLElement) {
        Components.Toast({
            el,
            className: "Legend_Toast hide d-none",
            headerText: "Legend",
            body: legend.Legend,
            options: { autohide: true }
        });
    }
}