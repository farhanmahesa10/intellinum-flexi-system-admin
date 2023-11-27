import { javascriptGenerator } from "blockly/javascript";

javascriptGenerator.forBlock["print_to_console"] = function (block) {
  return "console.log('custom block');\n";
};
