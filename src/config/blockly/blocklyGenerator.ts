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

// Custom block for API block
javascriptGenerator['api_block'] = function (block) {
  var apiUrl = javascriptGenerator.valueToCode(block, 'API_URL', javascriptGenerator.ORDER_ATOMIC);
  var method = javascriptGenerator.valueToCode(block, 'METHOD', javascriptGenerator.ORDER_ATOMIC);
  var apiBody = javascriptGenerator.valueToCode(block, 'API_BODY', javascriptGenerator.ORDER_ATOMIC);
  var apiHeaders = javascriptGenerator.valueToCode(block, 'API_HEADERS', javascriptGenerator.ORDER_ATOMIC);

  apiBody = apiBody.replace(/;/g, '');
  apiHeaders = apiHeaders.replace(/;/g, '');

  const options: { method: string, headers?: Record<string, string>, body?: string | null } = {
    method: method.replace(/'/g, '').toUpperCase(),
  };


  if (apiHeaders) {
    try{
      options.headers = JSON.parse(apiHeaders);
    }
    catch{
      options.headers = apiHeaders;

    }

  }
  if (apiBody) {
    try{
      options.body = JSON.stringify(JSON.parse(apiBody));
    }
    catch{
      options.body = apiBody;
    }
    //console.log(bodyConvert)

  }

  return `fetch(${apiUrl}, ${JSON.stringify(options, null, 2)})
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })`;
};

// Custom block for API header
javascriptGenerator['api_header'] = function (block) {
  var headerName = javascriptGenerator.valueToCode(block, 'HEADER_NAME', javascriptGenerator.ORDER_ATOMIC);
  var headerValue = javascriptGenerator.valueToCode(block, 'HEADER_VALUE', javascriptGenerator.ORDER_ATOMIC);

  headerName = headerName.replace(/'/g, '"'); 
  headerValue = headerValue.replace(/'/g, '"'); 

  if(headerName != "" && headerValue != ""){
    return `${headerName}:${headerValue},`;
  }
  else if(headerName != ""){
    return `${headerName}: "",`
  }
  else if(headerValue != ""){
    return `"":${headerValue},`;

  }
  else{
    return `"":""`;
  }};


// Custom block for API body array
javascriptGenerator['authorization_basic'] = function (block) {
  var username = javascriptGenerator.valueToCode(block, 'USERNAME', javascriptGenerator.ORDER_ATOMIC);
  var password = javascriptGenerator.valueToCode(block, 'PASSWORD', javascriptGenerator.ORDER_ATOMIC);

  username = username.replace(/'/g, ''); 
  password = password.replace(/'/g, ''); 

  const basicAuthCredentials = btoa(`${username}:${password}`);


  return `"Authorization" : "Basic ${basicAuthCredentials}"`;
};

javascriptGenerator['object'] = function (block, generator) {
  const statementMembers =
      generator.statementToCode(block, 'MEMBERS');
  const code = '{\n' + statementMembers + '\n}';
  return [code, javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator.scrub_ = function(block, code, thisOnly) {
  const nextBlock =
      block.nextConnection && block.nextConnection.targetBlock();
  if (nextBlock && !thisOnly) {
    return code + ',\n' + javascriptGenerator.blockToCode(nextBlock);
  }
  return code;
};

javascriptGenerator.forBlock['member'] = function(block, generator) {
  const name = block.getFieldValue('MEMBER_NAME');
  let value = generator.valueToCode(
      block, 'MEMBER_VALUE', javascriptGenerator.ORDER_ATOMIC);

  if(value === ""){
    const code = `"${name}": ""`;
    return code;
  }
  else{
    if(typeof value === 'string' && value.includes("'")){
      value = value.replace(/'/g, '"');
    }
    const code = `"${name}": ${value}`;
    return code;
  }

};

// not used
// // Custom block for API body
// javascriptGenerator.forBlock['api_body'] = function (block) {
//   var bodyName = javascriptGenerator.valueToCode(block, 'BODY_NAME', javascriptGenerator.ORDER_ATOMIC);
//   var bodyValue = javascriptGenerator.valueToCode(block, 'VALUES', javascriptGenerator.ORDER_ATOMIC);

//   bodyName = bodyName.replace(/'/g, '"'); 
//   bodyValue = bodyValue.replace(/'/g, '"'); 


//   if(bodyName != "" && bodyValue != ""){
//     return `${bodyName}:${bodyValue},`;
//   }
//   else if(bodyName != ""){
//     return `${bodyName}: "",`
//   }
//   else if(bodyValue != ""){
//     return `"":${bodyValue},`;

//   }
//   else{
//     return `"":"",`;
//   }

// };

// // Custom block for API body array
// javascriptGenerator['api_body_array'] = function (block) {
//   var arrayName = javascriptGenerator.valueToCode(block, 'ARRAY_NAME', javascriptGenerator.ORDER_ATOMIC);
//   var values = javascriptGenerator.statementToCode(block, 'VALUES');

//   arrayName = arrayName.replace(/'/g, '"'); 
//   values = values.replace(/'/g, '"'); 

//   values = values.replace(/,\s*$/, '');

//   if(arrayName != "" && values != ""){
//     return `{${arrayName}:[${values}]},`;
//   }
//   else if(arrayName != ""){
//     return `${arrayName}: [""],`
//   }
//   else if(values != ""){
//     return `[${values}],`;

//   }
//   else{
//     return `"":[""],`;
//   }};

// javascriptGenerator['api_body_json'] = function (block) {
//   var jsonName = javascriptGenerator.valueToCode(block, 'JSON_NAME', javascriptGenerator.ORDER_ATOMIC);
//   var values = javascriptGenerator.statementToCode(block, 'VALUES');

//   jsonName = jsonName.replace(/'/g, '"'); 
//   values = values.replace(/'/g, '"'); 

//   values = values.replace(/,\s*$/, '');


//   if(jsonName != "" && values != ""){
//     const isBlock = values && values.trim().startsWith('{') && values.trim().endsWith('}');
//     const isBlockArr = values && values.trim().startsWith('[') && values.trim().endsWith(']');
//     if(isBlock || isBlockArr){
//       return `{${jsonName}:${values}},`;
//     }
//     return `{${jsonName}:{${values}}},`;
//   }
//   else if(jsonName != ""){
//     return `{${jsonName}:{"":""}},`
//   }
//   else if(values != ""){
//     if(values.includes("{")){
//       return `${values},`;
//     }
//     return `{${values}},`;

//   }
//   else{
//     return `{"":""},`;
//   }
// };