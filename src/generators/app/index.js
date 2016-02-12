require("babel-polyfill");

import generators from "yeoman-generator";
import getPaths from "@unumux/ux-get-paths";

module.exports = generators.Base.extend({
    constructor: function() {
        generators.Base.apply(this, arguments);
    },

    initializing: function() {
        this.paths = {
            js: getPaths("js"),
            scss: getPaths("scss"),
            html: getPaths(["html", "cshtml"])
        };
    },

    default: function() {
        this.composeWith("@unumux/uxStaticSite:js", { options: {
            paths: this.paths.js
        }}, {
            local: require.resolve("../js/index")
        });
    },

    prompting: async function() {
        // console.log(await this.paths.html);
    },

    configuring: function() {
    }

});
