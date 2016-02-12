require("babel-polyfill");

import generators from "yeoman-generator";

module.exports = generators.Base.extend({
    constructor: function() {
        generators.Base.apply(this, arguments);

        this.option("scaffold", {
            default: true
        });

        this.option("node", {
            default: false
        });
    },

    writing: function() {
        let config = this.fs.readJSON(this.destinationPath(".eslintrc.json"), {});
        config.extends = this.options.node ? "@unumux/unumux/node" : "@unumux/unumux";
        this.fs.writeJSON(this.destinationPath(".eslintrc.json"), config);
    },

    install: function() {
        if(this.options.scaffold) {
            this.npmInstall([
                "eslint",
                "babel-eslint",
                "@unumux/eslint-config-unumux"
            ], { "saveDev": true });
        }
    }

});
