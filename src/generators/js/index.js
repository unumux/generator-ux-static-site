require("babel-polyfill");

import generators from "yeoman-generator";
import glob from "glob";
import * as questions from "@unumux/ux-questions";
import getPaths from "@unumux/ux-get-paths";

import * as questionsText from "../../constants/questions-text";

const getFilesAtPath = function(src) {
    return new Promise(function(resolve, reject) {
        glob(src, {}, function(err, files) {
            if(err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
};

module.exports = generators.Base.extend({
    constructor: function() {
        generators.Base.apply(this, arguments);

        this.option("paths", {
            hide: true
        });

        this.option("browserify");
        this.option("dest");
        this.option("scaffold");
    },

    initializing: function() {
        if (!this.options.paths) {
            this.options.paths = getPaths("js");
        }

        this.config = {};
    },

    prompting: {
        scaffold: async function() {
            if((await this.options.paths).length === 0 && this.options.scaffold === undefined) {
                this.options.scaffold = await questions.yesNo(questionsText.JS.SCAFFOLD, true);
                this.options.paths = ["scripts"];
            }
        },
        src: async function() {
            this.basePath = await questions.list(questionsText.JS.PATH, await this.options.paths);
            this.config.src = `${this.basePath}/**/*.js`;

            // start searching for JS files at src to provide as option for this.config.main
            this.filesAtPath = getFilesAtPath(this.config.src);
        },
        dest: function() {
            this.config.dest = this.options.dest || this.basePath;
        },
        browserify: async function() {
            if (this.options.browserify === undefined) {
                this.options.browserify = await questions.yesNo(questionsText.JS.USE_BROWSERIFY, true);
            }

            if(this.options.browserify) {
                if(this.options.scaffold) {
                    this.config.main = "scripts/site.js";
                    return;
                }

                this.config.main = await questions.list(questionsText.JS.MAIN, await this.filesAtPath);
            }
        }
    },

    writing: {
        uxJson: function() {
            let config = this.fs.readJSON(this.destinationPath("ux.json"), {});
            config.js = this.config;
            this.fs.writeJSON(this.destinationPath("ux.json"), config);
        },
        scaffold: function() {
            if(this.options.scaffold) {
                this.fs.copy(
                    this.templatePath("site.js"),
                    this.destinationPath("./scripts/site.js")
                );
            }
        }
    }

});
