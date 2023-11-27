import * as Blockly from "blockly/core";

const testReactField = {
  type: "print_to_console",
  message0: "print_to_console %1",

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

Blockly.Blocks["print_to_console"] = {
  init: function () {
    this.jsonInit(testReactField);
    this.setStyle("loop_blocks");
    this.setOutput(true, "Number");
  },
};
