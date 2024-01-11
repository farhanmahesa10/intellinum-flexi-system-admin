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
  tooltip: "testTooltip",
  helpUrl: "testHelpurl"
};

// Blockly.Blocks["print_to_console"] = {
//   init: function () {
//     this.jsonInit(testReactField);
//     this.setStyle("loop_blocks");
//     this.setOutput(true, "Number");
//     // this.setTooltip("");
//     // this.setHelpUrl("");
//   },
// };

Blockly.Blocks['print_to_console'] = {
  init: function () {
      this.appendDummyInput()
          .appendField(new Blockly.FieldTextInput("Boundary Function Name"), "Name");
      this.appendStatementInput("Content")
          .setCheck(null);
      this.setInputsInline(true);
      this.setColour(315);
      this.setTooltip("");
      this.setHelpUrl("");
  }
};

Blockly.Blocks['example_block'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Example Block");

    this.appendStatementInput("NAME")
      .setCheck("math_number")
      .appendField("Numbers");

    this.appendStatementInput("TEXT")
      .setCheck("text")
      .appendField("Text");

    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['api_block'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("API Block");

    this.appendValueInput("API_URL")
      .setCheck("String")
      .appendField("API URL");

    this.appendValueInput("METHOD")
      .setCheck("String")
      .appendField("METHOD");

    this.appendStatementInput("API_BODY")
      // .setCheck("api_parameter")
      .appendField("API Body");

    this.appendStatementInput("API_HEADERS")
      // .setCheck("api_header")
      .appendField("API Headers");

    this.setPreviousStatement(true, "api_block");
    this.setNextStatement(true, "api_block");
    this.setColour(120);
    this.setTooltip("Block to store information about an API");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['api_body'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("API Body");

    this.appendValueInput("BODY_NAME")
      .setCheck("String")
      .appendField("Body Name");

    this.appendValueInput("BODY_VALUE")
      .setCheck(null)
      .appendField("Body Value");

    this.setPreviousStatement(true, "api_body");
    this.setNextStatement(true, "api_body");
    this.setColour(120);
    this.setTooltip("API Body");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['api_header'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("API Header");

    this.appendValueInput("HEADER_NAME")
      .setCheck("String")
      .appendField("Header Name");

    this.appendValueInput("HEADER_VALUE")
      .setCheck(null)
      .appendField("Header Value");

    this.setPreviousStatement(true, "api_header");
    this.setNextStatement(true, "api_header");
    this.setColour(120);
    this.setTooltip("API Header");
    this.setHelpUrl("");
  }
};

