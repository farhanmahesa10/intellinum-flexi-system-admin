/**
 * @license
 *
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Blockly React Component.
 * @author samelh@google.com (Sam El-Husseini)
 */

import React, { useState } from "react";
import "./BlocklyComponent.css";
import { useEffect, useRef } from "react";

import Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";
import locale from "blockly/msg/en";
import "blockly/blocks";

Blockly.setLocale(locale);

function BlocklyComponent(props) {
  const [javascriptCode, setJavascriptCode] = useState();
  const blocklyDiv = useRef();
  const toolbox = useRef();
  let primaryWorkspace = useRef();
  const generateCode = () => {
    var code = javascriptGenerator.workspaceToCode(primaryWorkspace.current);
    setJavascriptCode(code);
  };
  primaryWorkspace?.current?.addEventlistener("change", () => {
    console.log("has changers workspace");
  });
  useEffect(() => {
    const { initialXml, children, ...rest } = props;
    primaryWorkspace.current = Blockly.inject(blocklyDiv.current, {
      toolbox: toolbox.current,
      ...rest,
    });

    if (initialXml) {
      Blockly.Xml.domToWorkspace(
        Blockly.utils.xml.textToDom(initialXml),
        primaryWorkspace.current
      );
    }
  }, [primaryWorkspace, toolbox, blocklyDiv, props]);
  function runCode() {
    // Generate JavaScript code and run it.

    let code = javascriptCode;
    javascriptGenerator.INFINITE_LOOP_TRAP =
      'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
    javascriptGenerator.INFINITE_LOOP_TRAP = null;
    try {
      eval(code);
      //   console.log(code);
    } catch (e) {
      alert(e);
    }
  }

  console.log("Blockly", Blockly);
  return (
    <React.Fragment>
      <textarea
        id="code"
        style={{ height: "200px", width: "400px" }}
        value={javascriptCode}
        readOnly
      ></textarea>
      <button onClick={generateCode}>Convert</button>
      <button onClick={runCode}>Run</button>
      <div ref={blocklyDiv} id="blocklyDiv" />
      <div style={{ display: "none" }} ref={toolbox}>
        {props.children}
      </div>
    </React.Fragment>
  );
}

export default BlocklyComponent;
