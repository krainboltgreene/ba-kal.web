import React from "react";
import ComponentLink from "react-router-component-link";
import {defaultProps} from "recompose";
import {startsWith} from "@unction/complete";
import {isNil} from "@unction/complete";
import {get} from "@unction/complete";
import {omit} from "@unction/complete";

import view from "@internal/view";

const REMAINING_PROP_NAMES = [
  "kind",
  "href",
  "children",
];

const kinds = {
  primary: "green",
  normal: "blue",
  hidden: "neutral",
};

export default view([
  defaultProps({
    kind: "normal",
  }),
  function Link (properties) {
    const {children} = properties;
    const {href} = properties;
    const {kind} = properties;
    const color = get(kind)(kinds);
    const remainingProperties = omit(REMAINING_PROP_NAMES)(properties);

    if (isNil(href)) {
      return <a data-element="Link" color={color} {...remainingProperties}>
        {children}
      </a>;
    }

    if (startsWith("https")(href) || startsWith("http")(href)) {
      return <a data-element="Link" color={color} href={href} {...remainingProperties}>
        {children}
      </a>;
    }

    return <ComponentLink data-element="Link" color={color} to={href} component="a" {...remainingProperties}>{children}</ComponentLink>;
  },
]);
