import React from "react";
import {ThemeConsumer} from "evergreen-ui";
import {Pane} from "evergreen-ui";
import {Heading} from "evergreen-ui";
import {Strong} from "evergreen-ui";
import {Paragraph} from "evergreen-ui";
import {UnorderedList} from "evergreen-ui";
import {ListItem} from "evergreen-ui";

import {Link} from "@internal/elements";

export default function PageFooter () {
  return <ThemeConsumer>
    {
      (theme) => <Pane data-element="Footer" is="footer" minHeight={400} padding={25} background={theme.colors.background.greenTint} display="flex" flexDirection="row" justifyContent="space-evenly">
        <Heading size={800} width={300}>
          Trunk
        </Heading>
        <Pane display="flex" alignItems="stretch" flexGrow="1" justifyContent="space-evenly">
          <Pane>
            <Heading size={500}>
              Find Me
            </Heading>
            <UnorderedList>
              <ListItem>
                <Link href="https://github.com/krainboltgreene"><i className="fab fa-github" /></Link>
              </ListItem>
              <ListItem>
                <Link href="https://twitter.com/krainboltgreene"><i className="fab fa-twitter" /></Link>
              </ListItem>
            </UnorderedList>
          </Pane>

          <Pane>
            <Heading size={500}>
              Legal
            </Heading>
            <Paragraph>
              <Strong>Trunk</Strong> is owned by <Link href="https://kurits.rainbolt-greene.online">Kurtis Rainbolt-Greene</Link>.<br />
              The source code is licensed <Link href="http://opensource.org/licenses/isc-license.php">ISC</Link>.<br />
              The website content is licensed <Link href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC ANS 4.0</Link>.
            </Paragraph>
          </Pane>
        </Pane>
      </Pane>
    }
  </ThemeConsumer>;
}
