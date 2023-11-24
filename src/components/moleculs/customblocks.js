import * as Blockly from "blockly/core";

// Since we're using json to initialize the field, we'll need to import it.

const testReactField = {
  type: "test_react_field",
  message0: "custom field %1",
  args0: [
    {
      type: "field_react_component",
      name: "FIELD",
      text: "Click me",
    },
  ],
  previousStatement: null,
  nextStatement: null,
};

Blockly.Blocks["test_react_field"] = {
  init: function () {
    this.jsonInit(testReactField);
    this.setStyle("loop_blocks");
  },
};
