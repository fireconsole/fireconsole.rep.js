

| License | Source | &#8212;&raquo; | [Website](https://github.com/fireconsole/fireconsole.rep.js/tree/master/workspace.sh) | [npm](https://github.com/npm/npm) |
| :---: | :---: | :---: | :---: | :---: |
| [MPL](https://opensource.org/licenses/MPL-2.0) | [github.com/fireconsole/fireconsole.rep.js](https://github.com/fireconsole/fireconsole.rep.js) | [![CircleCI](https://circleci.com/gh/fireconsole/fireconsole.rep.js.svg?style=svg)](https://circleci.com/gh/fireconsole/fireconsole.rep.js) | [fireconsole.github.io/fireconsole.rep.js](https://fireconsole.github.io/fireconsole.rep.js) | [fireconsole.rep.js](https://www.npmjs.com/package/fireconsole.rep.js)


[fireconsole.rep.js](https://fireconsole.github.io/fireconsole.rep.js)
===


This **Guide** is best viewed at [fireconsole.github.io/fireconsole.rep.js](https://fireconsole.github.io/fireconsole.rep.js/) using a *Modern Browser*.

A [FireConsole](https://github.com/fireconsole/) component in the form of a [jsonrep.github.io/jsonrep](https://jsonrep.github.io/jsonrep/).

Integration
===========

HTML Page
---------

```html
<div renderer="jsonrep">{
    "@./dist/fireconsole": {
        "messages": [
            "Hello World!"
        ]
    }
}</div>
<script src="https://jsonrep.github.io/jsonrep/dist/jsonrep.js"></script>
```

Development
-----------

Requirements:

  * [bash 4](https://www.gnu.org/software/bash/) - GNU Bash
  * [nvm](https://github.com/creationix/nvm) - Node Version Manager

### Build from source

    rm -Rf dist/        # Optional to verify build
    nvm use 9
    npm install
    npm run build       # Append '--ignore-dirty' if you removed 'dist/'
    git diff            # Optional to verify build
        # No changes should be detected.


Provenance
==========

Original Source Logic under [Mozilla Public License 2.0](https://opensource.org/licenses/MPL-2.0) by [Christoph Dorn](http://christophdorn.com) since 2017.

```
Mozilla Public License 2.0

You are free to:
    Commercial Use, Modify, Distribute, Sublicense, Place Warranty, Use Patent Claims

Under the following terms:
    Include Copyright, Include License, Disclose Source, Include Original

You cannot:
    Use Trademark, Hold Liable
```

> Well-crafted Contributions are Welcome.

**INTENDED USE:** The *Logic and Code contained within* forms a **Developer Tool** and is intended to operate as part of a *Web Software Development Toolchain* on which a *Production System* operates indirectly. It is **NOT INTENDED FOR USE IN HIGH-LOAD ENVIRONMENTS** as there is *little focus on Runtime Optimization* in order to *maximize API Utility, Compatibility and Flexibility*. The logic & code **HAS NOT BEEN VALIDATED BY A SECURITY AUDIT** and is **NOT GUARANTEED** TO KEEP
PRIVATE INFORMATION NOR YOUR IDENTITY SECURE!

If you *need more* than what is contained within, study the Code, understand the Logic, and build your *Own Implementation* that is *API Compatible*. Share it with others who follow the same *Logic* and *API Contract* specified within. This Community of Users will likely want to use Your Work in their own *Software Development Toolchains*.
