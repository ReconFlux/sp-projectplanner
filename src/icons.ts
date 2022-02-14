/**
 * Icon Library
 */
export abstract class Icons {
    // Generates the html for an icon
    private static generateIcon(svg, height, width) {
        // Assume a square if no width provided
        if (height && !width) { width = height }
        // Get the icon element
        let elDiv = document.createElement("div");
        elDiv.innerHTML = svg;
        let icon = elDiv.firstChild as SVGElement;
        if (icon) {
            // Set the height/width
            icon.setAttribute("height", (height ? height : 32).toString());
            icon.setAttribute("width", (width ? width : 32).toString());
            // Update the styling
            icon.style.pointerEvents = "none";
            // Support for IE
            icon.setAttribute("focusable", "false");
        }
        // Return the icon
        return icon;
    };

    private static cirBrdr = " viewBox=\"0 0 192 192\"><path fill=\"currentColor\" d=\"M0,12C0,5.3725586,5.3725586,0,12,0h168c6.6269531,0,12,5.3725586,12,12v168c0,6.6269531-5.3730469,12-12,12H12 c-6.6274414,0-12-5.3730469-12-12V12L0,12z\"/><circle fill=\"#FFF\" cx=\"96\" cy=\"96\" r=\"92\"/>";
    private static svgHead = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"16\" width=\"16\" ";
    
    static B2Logo(height?: number, width?: number): SVGElement {
        // Render the Logo for SET
        return this.generateIcon("<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"48\" width=\"78\" fill=\"currentColor\" class=\"b2-logo\" viewBox=\"0, 0, 400, 163.33\"><path d=\"M188.044 7.996 C 181.826 12.394,167.636 22.453,156.511 30.349 C 145.386 38.245,130.936 48.484,124.399 53.103 C 117.863 57.722,94.425 74.330,72.314 90.010 C 50.202 105.690,24.886 123.628,16.056 129.873 C 7.225 136.118,0.000 141.374,0.000 141.554 C 0.000 141.734,2.219 143.464,4.930 145.399 C 7.642 147.333,14.359 152.161,19.857 156.127 C 25.355 160.093,30.096 163.338,30.392 163.338 C 30.871 163.338,43.650 154.459,85.052 125.364 C 91.743 120.662,97.412 116.814,97.648 116.814 C 97.885 116.814,105.536 122.120,114.652 128.604 C 140.151 146.743,146.513 151.201,146.902 151.201 C 147.100 151.201,149.911 149.331,153.150 147.046 C 156.389 144.761,161.721 141.002,164.999 138.694 L 170.959 134.498 181.434 141.757 C 201.171 155.435,199.682 154.518,200.921 153.757 C 201.527 153.386,207.814 149.074,214.892 144.177 C 221.970 139.279,228.029 135.105,228.357 134.902 C 228.857 134.592,238.746 141.219,250.266 149.585 C 253.194 151.712,251.819 152.345,265.651 142.502 C 296.359 120.652,302.015 116.752,302.641 116.992 C 303.009 117.133,306.007 119.164,309.303 121.504 C 329.362 135.748,368.514 163.008,369.153 163.176 C 369.570 163.286,373.894 160.511,378.761 157.011 C 383.628 153.510,390.392 148.666,393.791 146.246 C 397.191 143.826,399.974 141.732,399.978 141.593 C 399.981 141.454,393.900 137.033,386.464 131.769 C 379.029 126.505,364.867 116.469,354.994 109.467 C 329.745 91.563,287.241 61.448,236.410 25.449 C 226.953 18.752,215.026 10.286,209.905 6.636 C 204.784 2.986,200.314 -0.000,199.971 -0.000 C 199.629 -0.000,194.262 3.598,188.044 7.996\"></path></svg>", height, width);
    }
}