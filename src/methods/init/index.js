"use strict";

import bind from "../dom/bind";
import read from "./read";
import {
    getSlug
} from "../slug";

import {
    moveTo
} from "../move";

export default function () {
    const _this = this;
    const slug = getSlug.call(_this);

    //beforeInit Callback
    _this.events.beforeInit.call(_this);

    _this.elements = bind.call(_this);

    read.call(_this);

    //Move to either saved slug or default id
    if (slug !== "") {
        moveTo.call(_this, slug);
    } else {
        moveTo.call(_this, _this.data.defaultId);
    }

    //afterInit Callback
    _this.events.afterInit.call(_this);
}
