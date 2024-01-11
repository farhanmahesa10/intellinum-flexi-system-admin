import { javascriptGenerator } from "blockly/javascript";

// javascriptGenerator.forBlock["print_to_console"] = function (block) {
//   return "console.log('custom block');\n";
// };

javascriptGenerator.forBlock['print_to_console'] = function (block) {
  var name = block.getFieldValue('Name');
  var content = javascriptGenerator.statementToCode(block, 'Content');

  return "fetch('" + name + "');\n" + content;
};

javascriptGenerator.forBlock['example_block'] = function (block) {
  var name = javascriptGenerator.statementToCode(block, 'NAME');
  var text = javascriptGenerator.statementToCode(block, 'TEXT');

  return "console.log('Name: " + name + "');\nconsole.log('Text: " + text + "');\n";
};

javascriptGenerator['api_block'] = function (block) {
  var apiUrl = javascriptGenerator.valueToCode(block, 'API_URL', javascriptGenerator.ORDER_ATOMIC);
  var method = javascriptGenerator.valueToCode(block, 'METHOD', javascriptGenerator.ORDER_ATOMIC);
  var apiBody = javascriptGenerator.statementToCode(block, 'API_BODY');
  var apiHeaders = javascriptGenerator.statementToCode(block, 'API_HEADERS');


  const bodyConvert = apiBody.replace(/,\s*$/, '')
  const headerConvert = apiHeaders.replace(/,\s*$/, '')
  

  if(apiBody == '' && apiHeaders == ''){
      return `fetch(${apiUrl}, {
        method: ${method.toUpperCase()}
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response;
      })`
    
  }
  else if(apiHeaders == ''){
    return `fetch(${apiUrl}, {
      method: ${method},
      body: { ${bodyConvert}
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response;
    })`
  }
  else{
    return `fetch(${apiUrl}, {
      method: ${method},
      headers: { ${headerConvert}
      },
      body: { ${bodyConvert}
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response;
    })`
  }
};

javascriptGenerator['api_header'] = function (block) {
  var headerName = javascriptGenerator.valueToCode(block, 'HEADER_NAME', javascriptGenerator.ORDER_ATOMIC);
  var headerValue = javascriptGenerator.valueToCode(block, 'HEADER_VALUE', javascriptGenerator.ORDER_ATOMIC);

  return "\n" + headerName + ":" + headerValue + ",";
};

javascriptGenerator.forBlock['api_body'] = function (block) {
  var bodyName = javascriptGenerator.valueToCode(block, 'BODY_NAME', javascriptGenerator.ORDER_ATOMIC);
  var bodyValue = javascriptGenerator.valueToCode(block, 'BODY_VALUE', javascriptGenerator.ORDER_ATOMIC);

  return "\n" + bodyName + ":" + bodyValue + "," ;
};
