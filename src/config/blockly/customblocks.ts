import * as Blockly from "blockly/core";

const object = {
  type: "object",
  message0: "{ %1 %2 }",
  args0: [
    {
      type: "input_dummy"
    },
    {
      type: "input_statement",
      name: "MEMBERS"
    }
  ],
  output: null,
  colour: 230,
};

const member = {
  type: "member",
  message0: "%1 %2 %3",
  args0: [
    {
      type: "field_input",
      name: "MEMBER_NAME",
      text: ""
    },
    {
      type: "field_label",
      name: "COLON",
      text: ":"
    },
    {
      type: "input_value",
      name: "MEMBER_VALUE"
    }
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 230,
}

Blockly.Blocks["object"] = {
  init: function () {
    this.jsonInit(object);
    this.setStyle("loop_blocks");
  },
};

Blockly.Blocks["member"] = {
  init: function () {
    this.jsonInit(member);
    this.setStyle("loop_blocks");
  },
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

    this.appendValueInput("API_BODY")
      // .setCheck(["api_body", "api_body_array"])
      .setCheck("String")
      .appendField("API Body");

    this.appendValueInput("API_HEADERS")
      .setCheck("String")
      .appendField("API Headers");

    this.setPreviousStatement(true, "api_block");
    this.setNextStatement(true, "api_block");
    this.setColour(120);
    this.setTooltip("Block to store information about an API");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['authorization_basic'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Authorization Basic");

    this.appendValueInput("USERNAME")
      .setCheck("String")
      .appendField("Username");

    this.appendValueInput("PASSWORD")
      .setCheck(null)
      .appendField("Password");

    this.setPreviousStatement(true, "api_header");
    this.setNextStatement(true, "api_header");
    this.setColour(120);
    this.setTooltip("Authorization Basic");
    this.setHelpUrl("");
  }
};

// Blockly.Blocks['api_body'] = {
//   init: function () {
//     this.appendDummyInput()
//       .appendField("API Body");

//     this.appendValueInput("BODY_NAME")
//       .setCheck("String")
//       .appendField("Body Name");

//     this.appendValueInput("VALUES")
//       .setCheck(null)
//       .appendField("Body Value");

//     this.setPreviousStatement(true, "api_body");
//     this.setNextStatement(true, "api_body");
//     this.setColour(120);
//     this.setTooltip("API Body");
//     this.setHelpUrl("");
//   }
// };

// Blockly.Blocks['api_body_array'] = {
//   init: function () {
//     this.appendDummyInput()
//       .appendField("API Body Array");

//     this.appendValueInput("ARRAY_NAME")
//       .setCheck("String")
//       .appendField("Array Name");

//     this.appendStatementInput("VALUES")
//       .setCheck("api_body")
//       .appendField("Values");

//     this.setPreviousStatement(true, "api_body");
//     this.setNextStatement(true, "api_body");
//     this.setColour(120);
//     this.setTooltip("API Body Array");
//     this.setHelpUrl("");
//   }
// };

// Blockly.Blocks['api_body_json'] = {
//   init: function () {
//     this.appendDummyInput()
//       .appendField("API Body Json");

//     this.appendValueInput("JSON_NAME")
//       .setCheck("String")
//       .appendField("Json Name");

//     this.appendStatementInput("VALUES")
//       .setCheck("api_body")
//       .appendField("Values");

//     this.setPreviousStatement(true, "api_body");
//     this.setNextStatement(true, "api_body");
//     this.setColour(120);
//     this.setTooltip("API Body Json");
//     this.setHelpUrl("");
//   }
// };

// Blockly.Blocks['api_header'] = {
//   init: function () {
//     this.appendDummyInput()
//       .appendField("API Header");

//     this.appendValueInput("HEADER_NAME")
//       .setCheck("String")
//       .appendField("Name");

//     this.appendValueInput("HEADER_VALUE")
//       .setCheck(null)
//       .appendField("Value");

//     this.setPreviousStatement(true, "api_header");
//     this.setNextStatement(true, "api_header");
//     this.setColour(120);
//     this.setTooltip("API Header");
//     this.setHelpUrl("");
//   }
// };




