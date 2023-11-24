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
 * @fileoverview Main React component that includes the Blockly component.
 * @author samelh@google.com (Sam El-Husseini)
 */

import React from "react";

import BlocklyComponent, {
  Block,
  Value,
  Field,
  Shadow,
  Category,
  Mutation,
} from "../../atoms/Blockly";

import "../../moleculs/customblocks";
import "../../generator/generator";
import Workflow from ".";

function Workflow2(props) {
  return (
    <div className="">
      <header className=" h-600 w-100">
        <BlocklyComponent
          readOnly={false}
          trashcan={true}
          //   media={"media/"}
          move={{
            scrollbars: true,
            drag: true,
            wheel: true,
          }}
          initialXml={``}
          onXmlChange={() => {
            console.log("oe");
          }}
        >
          <Category name="Logic" colour={210}>
            <Block type="controls_if"></Block>
            <Block type="logic_compare">
              <Field name="OP">EQ</Field>
            </Block>
            <Block type="logic_operation">
              <Field name="OP">AND</Field>
            </Block>
            <Block type="logic_negate" />
            <Block type="logic_boolean">
              <Field name="BOOL">TRUE</Field>
            </Block>
            <Block type="logic_null" />
            <Block type="logic_ternary" />
          </Category>
          <Category name="Loops" colour={120}>
            <Block type="controls_repeat_ext">
              <Value name="TIMES">
                <Shadow type="math_number">
                  <Field name="NUM">10</Field>
                </Shadow>
              </Value>
            </Block>

            <Block type="controls_whileUntil" />
            <Block type="controls_for">
              <Field name="VAR" id="C(8;cYCF}~vSgkxzJ+{O" variabletype="">
                i
              </Field>
              <Value name="FROM">
                <Shadow type="math_number">
                  <Field name="NUM">1</Field>
                </Shadow>
              </Value>
              <Value name="TO">
                <Shadow type="math_number">
                  <Field name="NUM">10</Field>
                </Shadow>
              </Value>
              <Value name="BY">
                <Shadow type="math_number">
                  <Field name="NUM">1</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="controls_forEach">
              <Field name="VAR" id="Cg!CSk/ZJo2XQN3=VVrz" variabletype="">
                j
              </Field>
            </Block>
            <Block type="controls_flow_statements">
              <Field name="FLOW">BREAK</Field>
            </Block>
          </Category>
          <Category name="Math" colour={230}>
            <Block type="math_round">
              <Field name="OP">ROUND</Field>
              <Value name="NUM">
                <Shadow type="math_number">
                  <Field name="NUM">3.1</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="math_number">
              <Field name="NUM">0</Field>
            </Block>
            <Block type="math_single">
              <Field name="OP">ROOT</Field>
              <Value name="NUM">
                <Shadow type="math_number">
                  <Field name="NUM">9</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="math_trig">
              <Field name="OP">SIN</Field>
              <Value name="NUM">
                <Shadow type="math_number">
                  <Field name="NUM">45</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="math_constant">
              <Field name="CONSTANT">PI</Field>
            </Block>
            <Block type="math_number_property">
              <Mutation divisor_input="false"></Mutation>
              <Field name="PROPERTY">EVEN</Field>
              <Value name="NUMBER_TO_CHECK">
                <Shadow type="math_number">
                  <Field name="NUM">0</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="math_arithmetic">
              <Field name="OP">ADD</Field>
              <Value name="A">
                <Shadow type="math_number">
                  <Field name="NUM">1</Field>
                </Shadow>
              </Value>
              <Value name="B">
                <Shadow type="math_number">
                  <Field name="NUM">1</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="math_on_list">
              <Mutation op="SUM"></Mutation>
              <Field name="OP">SUM</Field>
            </Block>
            <Block type="math_modulo">
              <Value name="DIVIDEND">
                <Shadow type="math_number">
                  <Field name="NUM">64</Field>
                </Shadow>
              </Value>
              <Value name="DIVISOR">
                <Shadow type="math_number">
                  <Field name="NUM">10</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="math_constrain">
              <Value name="VALUE">
                <Shadow type="math_number">
                  <Field name="NUM">50</Field>
                </Shadow>
              </Value>
              <Value name="LOW">
                <Shadow type="math_number">
                  <Field name="NUM">1</Field>
                </Shadow>
              </Value>
              <Value name="HIGH">
                <Shadow type="math_number">
                  <Field name="NUM">100</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="math_random_int">
              <Value name="FROM">
                <Shadow type="math_number">
                  <Field name="NUM">1</Field>
                </Shadow>
              </Value>
              <Value name="TO">
                <Shadow type="math_number">
                  <Field name="NUM">100</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="math_random_float" />
          </Category>

          <Category name="Text" colour={160}>
            <Block type="text_charAt">
              <Mutation at="true"></Mutation>
              <Field name="WHERE">FROM_START</Field>
              <Value name="VALUE">
                <Block type="variables_get">
                  <Field name="VAR" id="q@$ZF(L?Zo/z`d{o.Bp!" variabletype="">
                    text
                  </Field>
                </Block>
              </Value>
            </Block>
            <Block type="text">
              <Field name="TEXT"></Field>
            </Block>
            <Block type="text_append">
              <Field name="VAR" id=":};P,s[*|I8+L^-.EbRi" variabletype="">
                item
              </Field>
              <Value name="TEXT">
                <Shadow type="text">
                  <Field name="TEXT"></Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="text_length">
              <Value name="VALUE">
                <Shadow type="text">
                  <Field name="TEXT">abc</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="text_isEmpty">
              <Value name="VALUE">
                <Shadow type="text">
                  <Field name="TEXT"></Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="text_indexOf">
              <Field name="END">FIRST</Field>
              <Value name="VALUE">
                <Block type="variables_get">
                  <Field name="VAR" id="q@$ZF(L?Zo/z`d{o.Bp!" variabletype="">
                    text
                  </Field>
                </Block>
              </Value>
              <Value name="FIND">
                <Shadow type="text">
                  <Field name="TEXT">abc</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="text_join">
              <Mutation items="2"></Mutation>
            </Block>
            <Block type="text_getSubstring">
              <Mutation at1="true" at2="true"></Mutation>
              <Field name="WHERE1">FROM_START</Field>
              <Field name="WHERE2">FROM_START</Field>
              <Value name="STRING">
                <Block type="variables_get">
                  <Field name="VAR" id="q@$ZF(L?Zo/z`d{o.Bp!" variabletype="">
                    text
                  </Field>
                </Block>
              </Value>
            </Block>
            <Block type="text_changeCase">
              <Field name="CASE">UPPERCASE</Field>
              <Value name="TEXT">
                <Shadow type="text">
                  <Field name="TEXT">abc</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="text_trim">
              <Field name="MODE">BOTH</Field>
              <Value name="TEXT">
                <Shadow type="text">
                  <Field name="TEXT">abc</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="text_print">
              <Value name="TEXT">
                <Shadow type="text">
                  <Field name="TEXT">abc</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="text_prompt_ext">
              <Mutation type="TEXT"></Mutation>
              <Field name="TYPE">TEXT</Field>
              <Value name="TEXT">
                <Shadow type="text">
                  <Field name="TEXT">abc</Field>
                </Shadow>
              </Value>
            </Block>
          </Category>

          <Category name="Lists" colour={259}>
            <Block type="lists_indexOf">
              <Field name="END">FIRST</Field>
              <Value name="VALUE">
                <Block type="variables_get">
                  <Field name="VAR" id="e`(L;x,.j[[XN`F33Q5." variabletype="">
                    list
                  </Field>
                </Block>
              </Value>
            </Block>
            <Block type="lists_create_with">
              <Mutation items="0"></Mutation>
            </Block>
            <Block type="lists_repeat">
              <Value name="NUM">
                <Shadow type="math_number">
                  <Field name="NUM">5</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="lists_length" />
            <Block type="lists_isEmpty" />
            <Block type="lists_create_with">
              <Mutation items="3"></Mutation>
            </Block>
            <Block type="lists_getIndex">
              <Mutation statement="false" at="true"></Mutation>
              <Field name="MODE">GET</Field>
              <Field name="WHERE">FROM_START</Field>
              <Value name="VALUE">
                <Block type="variables_get">
                  <Field name="VAR" id="e`(L;x,.j[[XN`F33Q5." variabletype="">
                    list
                  </Field>
                </Block>
              </Value>
            </Block>
            <Block type="lists_setIndex">
              <Mutation at="true"></Mutation>
              <Field name="MODE">SET</Field>
              <Field name="WHERE">FROM_START</Field>
              <Value name="LIST">
                <Block type="variables_get">
                  <Field name="VAR" id="e`(L;x,.j[[XN`F33Q5." variabletype="">
                    list
                  </Field>
                </Block>
              </Value>
            </Block>
            <Block type="lists_getSublist">
              <Mutation at1="true" at2="true"></Mutation>
              <Field name="WHERE1">FROM_START</Field>
              <Field name="WHERE2">FROM_START</Field>
              <Value name="LIST">
                <Block type="variables_get">
                  <Field name="VAR" id="e`(L;x,.j[[XN`F33Q5." variabletype="">
                    list
                  </Field>
                </Block>
              </Value>
            </Block>
            <Block type="lists_split">
              <Mutation mode="SPLIT"></Mutation>
              <Field name="MODE">SPLIT</Field>
              <Value name="DELIM">
                <Shadow type="text">
                  <Field name="TEXT">,</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="lists_sort">
              <Field name="TYPE">NUMERIC</Field>
              <Field name="DIRECTION">1</Field>
            </Block>
          </Category>
          <Category name="Colour" colour={19}>
            <Block type="colour_picker">
              <Field name="COLOUR">#ff0000</Field>
            </Block>
            <Block type="colour_random" />
            <Block type="colour_rgb">
              <Value name="RED">
                <Shadow type="math_number">
                  <Field name="NUM">100</Field>
                </Shadow>
              </Value>
              <Value name="GREEN">
                <Shadow type="math_number">
                  <Field name="NUM">50</Field>
                </Shadow>
              </Value>
              <Value name="BLUE">
                <Shadow type="math_number">
                  <Field name="NUM">0</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="colour_blend">
              <Value name="COLOUR1">
                <Shadow type="colour_picker">
                  <Field name="COLOUR">#ff0000</Field>
                </Shadow>
              </Value>
              <Value name="COLOUR2">
                <Shadow type="colour_picker">
                  <Field name="COLOUR">#3333ff</Field>
                </Shadow>
              </Value>
              <Value name="RATIO">
                <Shadow type="math_number">
                  <Field name="NUM">0.5</Field>
                </Shadow>
              </Value>
            </Block>
          </Category>
          <Category colour={330} name="Variables" custom="VARIABLE"></Category>
          <Category colour={290} name="Functions" custom="PROCEDURE"></Category>
          <Category name="Custom" colour="5CA699">
            <Block type="test_react_field" />
          </Category>
        </BlocklyComponent>
      </header>

      <Workflow />
    </div>
  );
}

export default Workflow2;
