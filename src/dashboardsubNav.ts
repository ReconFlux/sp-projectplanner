import { Components, Helper, SPTypes } from "gd-sprest-bs";
import { filter } from "gd-sprest-bs/build/icons/svgs/filter";
import { plus } from "gd-sprest-bs/build/icons/svgs/plus";
import { threeDots } from "gd-sprest-bs/build/icons/svgs/threeDots";
import { DataSource } from "./ds";
import Strings from "./strings";

// Properties
export interface IDashboardNavigationProps {
    el: HTMLElement;
    dt: any;
    onShowFilter: () => void;
    onUpdate: () => void;
}
/**
 * Dashboard Navigation
 */
export class DashboardNavigation {
    private _dt: any = null;
    private _el: HTMLElement = null;
    private _onShowFilter: () => void = null;
    private _onUpdate: () => void = null;

    // Constructor
    constructor(props: IDashboardNavigationProps) {
        // Save the properties
        this._dt = props.dt;
        this._el = props.el;
        this._onShowFilter = props.onShowFilter;
        this._onUpdate = props.onUpdate;

        // Render the navigation
        this.render();
    }

    // Render the sub nav
    private render() {
        let nav = Components.Navbar({
            brand: Strings.DashboardName,
            className: "SubNavClass py-0",
            id: "dashboardSubNav"
        });
        /* Fix the padding on the left & right of the nav */
        nav.el.querySelector("div.container-fluid").classList.add("ps-75");
        nav.el.querySelector("div.container-fluid").classList.add("pe-2");
        nav.el.querySelector("div.container-fluid").id = "dashboardSubNav";

        this._el.insertBefore(nav.el, this._el.firstChild);
    }
}