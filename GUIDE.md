
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
<!--ON_RUN>>>
<style>
    DIV[renderer="jsonrep"] {
        display: inline-block;
    }
</style>

RESULT: &CODE&
<<<ON_RUN-->
