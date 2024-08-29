"use strict";
exports.__esModule = true;
var express_1 = require("express");
var path_1 = require("path");
var app = (0, express_1["default"])();
app.use(express_1["default"].json());
app.use(express_1["default"].static(path_1["default"].join(__dirname, '../client/dist')));
app.listen(3000, function () { return console.log('Server running on port 3000'); });
