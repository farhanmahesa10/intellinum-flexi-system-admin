import { useEffect, useCallback, useState, useMemo } from "react";
// @ts-ignore
import * as FlexaUtil from "@intellinum/flexa-util";
const { Config, showMessage, callApi, TableAntd, CustomSelect } = FlexaUtil;
import { BlocklyWorkspace } from "react-blockly";
import { javascriptGenerator } from "blockly/javascript";
import { useFormik, FormikProvider } from "formik";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Space,
  Modal,
  Button,
  Form,
  Input,
  Select,
  Card,
  message,
  Popconfirm,
} from "antd";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import "./RuleList.css";
import randomstring from "randomstring";
import { AiOutlineQuestionCircle } from "react-icons/ai";

const { Option } = Select;

export const MqttRule = () => {
  const [mode, setMode] = useState("");
  const [userId, setId] = useState("");
  const [variable, setVariable] = useState(null);
  const [type, setType] = useState("groovy");
  const [xmlRule, setXml] = useState("");
  const [ruleValue, setRuleValue] = useState("");
  const [initialXml, setInitialXml] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [fetch, setFetch] = useState(true);
  const [open, setOpen] = useState(false);
  const { mqttTopicId } = useParams();
  const [searchUrl, setSearchUrl] = useState(
    Config.prefixUrl + "/messaging/mqttrule/search"
  );
  const [apiUrl, setApiUrl] = useState(
    Config.prefixUrl + "/messaging/mqttrule"
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("flexa_auth"))
  );

  const validationSchema = () => {
    let validation;
    if (user.userType == "Admin") {
      validation = Yup.object().shape({
        company: Yup.string().required("Company is required"),
      });
    }
    return validation;
  };

  const showModal = () => {
    setType("groovy");
    formik.setFieldValue("scriptType", "groovy");
    setOpen(true);
  };

  const showModalNew = () => {
    setMode("new");
    setType("groovy");
    formik.setFieldValue("scriptType", "groovy");
    formik.resetForm();
    setIsLoading(false);
    setOpen(true);
  };

  const handleOk = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
    setMode("");
    setId("");
    setType("groovy");
    formik.resetForm();
  };

  const handleSubmit = useCallback(
    async (values, setSubmitting) => {
      let payload;
      if (values.scriptType == "javascript") {
        payload = {
          pubSubId: values.pubSubId,
          rule: ruleValue,
          xmlRule: values.xmlRule,
          scriptType: values.scriptType,
          company: values.company,
          creationDate: new Date(),
          createdBy: user.id,
          updateDate: new Date(),
          updatedBy: user.id,
        };
      } else {
        payload = {
          pubSubId: values.pubSubId,
          rule: values.rule,
          xmlRule: null,
          scriptType: values.scriptType,
          company: values.company,
          creationDate: new Date(),
          createdBy: user.id,
          updateDate: new Date(),
          updatedBy: user.id,
        };
      }
      console.log("payload", payload);
      setIsLoading(true);
      if (mode == "edit") {
        try {
          await callApi(apiUrl + `/${userId}`, "PUT", payload);
          message.success("Succesfully edited data");
          setFetch(true);
          setOpen(false);
        } catch (error) {
          message.error("Something went wrong!");
        }
      } else {
        try {
          await callApi(apiUrl, "POST", payload);
          message.success("Succesfully added data");
          setFetch(true);
          setOpen(false);
        } catch (error) {
          message.error("Something went wrong!");
        }
      }
      setSubmitting(false);
      setIsLoading(false);
    },
    [isLoading, fetch, mode, ruleValue, xmlRule]
  );

  const formik = useFormik({
    initialValues: {
      pubSubId: mqttTopicId,
      rule: "",
      xmlRule: initialXml,
      scriptType: "groovy",
      company: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      handleSubmit(values, setSubmitting);
    },
  });

  const initiateXml = () => {
    const arr = variable.split(";");
    let result = "";
    for (const [i, product] of arr.entries()) {
      let random = randomstring.generate(20);
      //last index was null value
      if (i < arr.length - 1) {
        result = result + `<variable id="${random}">${product}</variable>`;
      } else {
        break;
      }
    }
    setInitialXml(
      '<xml xmlns="https://developers.google.com/blockly/xml"><variables>' +
        result +
        "</variables></xml>"
    );
  };

  const toolboxCategories = {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Logic",
        colour: 210,
        contents: [
          {
            kind: "block",
            type: "controls_if",
          },
          {
            kind: "block",
            blockxml:
              '<block type="logic_compare"><field name="OP">EQ</field></block>',
          },
          {
            kind: "block",
            blockxml:
              '<block type="logic_operation"><field name="OP">AND</field></block>',
          },
          {
            kind: "block",
            type: "logic_negate",
          },
          {
            kind: "block",
            blockxml:
              '<block type="logic_boolean"><field name="BOOL">TRUE</field></block>',
          },
          {
            kind: "block",
            type: "logic_null",
          },
          {
            kind: "block",
            type: "logic_ternary",
          },
        ],
      },
      {
        kind: "category",
        name: "Loops",
        colour: 120,
        contents: [
          {
            kind: "block",
            blockxml:
              '<block type="controls_repeat_ext">\n' +
              '      <value name="TIMES">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">10</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              "    </block>",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="controls_whileUntil">\n' +
              '      <field name="MODE">WHILE</field>\n' +
              "    </block>",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="controls_for">\n' +
              '      <field name="VAR" id="C(8;cYCF}~vSgkxzJ+{O" variabletype="">i</field>\n' +
              '      <value name="FROM">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">1</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              '      <value name="TO">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">10</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              '      <value name="BY">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">1</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="controls_forEach">\n' +
              '      <field name="VAR" id="Cg!CSk/ZJo2XQN3=VVrz" variabletype="">j</field>\n' +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="controls_flow_statements">\n' +
              '      <field name="FLOW">BREAK</field>\n' +
              "    </block>\n",
          },
        ],
      },
      {
        kind: "category",
        name: "Math",
        colour: 230,
        contents: [
          {
            kind: "block",
            blockxml:
              '    <block type="math_round">\n' +
              '      <field name="OP">ROUND</field>\n' +
              '      <value name="NUM">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">3.1</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="math_number">\n' +
              '      <field name="NUM">0</field>\n' +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="math_single">\n' +
              '      <field name="OP">ROOT</field>\n' +
              '      <value name="NUM">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">9</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="math_trig">\n' +
              '      <field name="OP">SIN</field>\n' +
              '      <value name="NUM">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">45</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="math_constant">\n' +
              '      <field name="CONSTANT">PI</field>\n' +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="math_number_property">\n' +
              '      <mutation divisor_input="false"></mutation>\n' +
              '      <field name="PROPERTY">EVEN</field>\n' +
              '      <value name="NUMBER_TO_CHECK">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">0</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="math_arithmetic">\n' +
              '      <field name="OP">ADD</field>\n' +
              '      <value name="A">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">1</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              '      <value name="B">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">1</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="math_on_list">\n' +
              '      <mutation op="SUM"></mutation>\n' +
              '      <field name="OP">SUM</field>\n' +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="math_modulo">\n' +
              '      <value name="DIVIDEND">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">64</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              '      <value name="DIVISOR">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">10</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="math_constrain">\n' +
              '      <value name="VALUE">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">50</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              '      <value name="LOW">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">1</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              '      <value name="HIGH">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">100</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="math_random_int">\n' +
              '      <value name="FROM">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">1</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              '      <value name="TO">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">100</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            type: "math_random_float",
          },
        ],
      },
      {
        kind: "category",
        name: "Text",
        colour: 160,
        contents: [
          {
            kind: "block",
            blockxml:
              '    <block type="text_charAt">\n' +
              '      <mutation at="true"></mutation>\n' +
              '      <field name="WHERE">FROM_START</field>\n' +
              '      <value name="VALUE">\n' +
              '        <block type="variables_get">\n' +
              '          <field name="VAR" id="q@$ZF(L?Zo/z`d{o.Bp!" variabletype="">text</field>\n' +
              "        </block>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="text">\n' +
              '      <field name="TEXT"></field>\n' +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="text_append">\n' +
              '      <field name="VAR" id=":};P,s[*|I8+L^-.EbRi" variabletype="">item</field>\n' +
              '      <value name="TEXT">\n' +
              '        <shadow type="text">\n' +
              '          <field name="TEXT"></field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="text_length">\n' +
              '      <value name="VALUE">\n' +
              '        <shadow type="text">\n' +
              '          <field name="TEXT">abc</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="text_isEmpty">\n' +
              '      <value name="VALUE">\n' +
              '        <shadow type="text">\n' +
              '          <field name="TEXT"></field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="text_indexOf">\n' +
              '      <field name="END">FIRST</field>\n' +
              '      <value name="VALUE">\n' +
              '        <block type="variables_get">\n' +
              '          <field name="VAR" id="q@$ZF(L?Zo/z`d{o.Bp!" variabletype="">text</field>\n' +
              "        </block>\n" +
              "      </value>\n" +
              '      <value name="FIND">\n' +
              '        <shadow type="text">\n' +
              '          <field name="TEXT">abc</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="text_join">\n' +
              '      <mutation items="2"></mutation>\n' +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="text_getSubstring">\n' +
              '      <mutation at1="true" at2="true"></mutation>\n' +
              '      <field name="WHERE1">FROM_START</field>\n' +
              '      <field name="WHERE2">FROM_START</field>\n' +
              '      <value name="STRING">\n' +
              '        <block type="variables_get">\n' +
              '          <field name="VAR" id="q@$ZF(L?Zo/z`d{o.Bp!" variabletype="">text</field>\n' +
              "        </block>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="text_changeCase">\n' +
              '      <field name="CASE">UPPERCASE</field>\n' +
              '      <value name="TEXT">\n' +
              '        <shadow type="text">\n' +
              '          <field name="TEXT">abc</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="text_trim">\n' +
              '      <field name="MODE">BOTH</field>\n' +
              '      <value name="TEXT">\n' +
              '        <shadow type="text">\n' +
              '          <field name="TEXT">abc</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="text_print">\n' +
              '      <value name="TEXT">\n' +
              '        <shadow type="text">\n' +
              '          <field name="TEXT">abc</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="text_prompt_ext">\n' +
              '      <mutation type="TEXT"></mutation>\n' +
              '      <field name="TYPE">TEXT</field>\n' +
              '      <value name="TEXT">\n' +
              '        <shadow type="text">\n' +
              '          <field name="TEXT">abc</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
        ],
      },
      {
        kind: "category",
        name: "Lists",
        colour: 259,
        contents: [
          {
            kind: "block",
            blockxml:
              '    <block type="lists_indexOf">\n' +
              '      <field name="END">FIRST</field>\n' +
              '      <value name="VALUE">\n' +
              '        <block type="variables_get">\n' +
              '          <field name="VAR" id="e`(L;x,.j[[XN`F33Q5." variabletype="">list</field>\n' +
              "        </block>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="lists_create_with">\n' +
              '      <mutation items="0"></mutation>\n' +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="lists_repeat">\n' +
              '      <value name="NUM">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">5</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            type: "lists_length",
          },
          {
            kind: "block",
            type: "lists_isEmpty",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="lists_create_with">\n' +
              '      <mutation items="3"></mutation>\n' +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="lists_getIndex">\n' +
              '      <mutation statement="false" at="true"></mutation>\n' +
              '      <field name="MODE">GET</field>\n' +
              '      <field name="WHERE">FROM_START</field>\n' +
              '      <value name="VALUE">\n' +
              '        <block type="variables_get">\n' +
              '          <field name="VAR" id="e`(L;x,.j[[XN`F33Q5." variabletype="">list</field>\n' +
              "        </block>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="lists_setIndex">\n' +
              '      <mutation at="true"></mutation>\n' +
              '      <field name="MODE">SET</field>\n' +
              '      <field name="WHERE">FROM_START</field>\n' +
              '      <value name="LIST">\n' +
              '        <block type="variables_get">\n' +
              '          <field name="VAR" id="e`(L;x,.j[[XN`F33Q5." variabletype="">list</field>\n' +
              "        </block>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="lists_getSublist">\n' +
              '      <mutation at1="true" at2="true"></mutation>\n' +
              '      <field name="WHERE1">FROM_START</field>\n' +
              '      <field name="WHERE2">FROM_START</field>\n' +
              '      <value name="LIST">\n' +
              '        <block type="variables_get">\n' +
              '          <field name="VAR" id="e`(L;x,.j[[XN`F33Q5." variabletype="">list</field>\n' +
              "        </block>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="lists_split">\n' +
              '      <mutation mode="SPLIT"></mutation>\n' +
              '      <field name="MODE">SPLIT</field>\n' +
              '      <value name="DELIM">\n' +
              '        <shadow type="text">\n' +
              '          <field name="TEXT">,</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="lists_sort">\n' +
              '      <field name="TYPE">NUMERIC</field>\n' +
              '      <field name="DIRECTION">1</field>\n' +
              "    </block>\n",
          },
        ],
      },
      {
        kind: "category",
        name: "Colour",
        colour: 19,
        contents: [
          {
            kind: "block",
            blockxml:
              '    <block type="colour_picker">\n' +
              '      <field name="COLOUR">#ff0000</field>\n' +
              "    </block>\n",
          },
          {
            kind: "block",
            type: "colour_random",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="colour_rgb">\n' +
              '      <value name="RED">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">100</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              '      <value name="GREEN">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">50</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              '      <value name="BLUE">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">0</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
          {
            kind: "block",
            blockxml:
              '    <block type="colour_blend">\n' +
              '      <value name="COLOUR1">\n' +
              '        <shadow type="colour_picker">\n' +
              '          <field name="COLOUR">#ff0000</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              '      <value name="COLOUR2">\n' +
              '        <shadow type="colour_picker">\n' +
              '          <field name="COLOUR">#3333ff</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              '      <value name="RATIO">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">0.5</field>\n' +
              "        </shadow>\n" +
              "      </value>\n" +
              "    </block>\n",
          },
        ],
      },
      { kind: "sep" },
      {
        kind: "category",
        name: "Variables",
        custom: "VARIABLE",
        colour: 330,
      },
      {
        kind: "category",
        name: "Functions",
        custom: "PROCEDURE",
        colour: 290,
      },
    ],
  };

  useEffect(() => {
    const topicData = callApi(
      Config.prefixUrl + "/messaging/mqttsubscribe/" + mqttTopicId,
      "GET"
    );
    topicData.then(({ data }) => setVariable(data.variable));
    if (variable != null) {
      initiateXml();
    }
  }, [open]);

  const workspaceDidChange = (workspace) => {
    const code = javascriptGenerator.workspaceToCode(workspace);
    setRuleValue(code.replace(/(\r\n|\n|\r)/gm, ""));
  };

  const handleDelete = useCallback(
    async (row) => {
      setTableLoading(true);
      try {
        await callApi(apiUrl + `/${row.id}`, "DELETE", null);
        message.success("Successfully deleted data");
        setFetch(true);
      } catch (error) {
        message.error("Failed | Something went wrong");
        setTableLoading(false);
      }
    },
    [fetch]
  );

  const handleEdit = useCallback(
    (row) => async () => {
      console.log(row);
      setMode("edit");
      setId(row.id);
      formik.setFieldValue("xmlRule", row.xmlRule);
      setInitialXml(row.xmlRule);
      formik.setFieldValue("rule", row.rule);
      formik.setFieldValue("scriptType", row.scriptType);
      formik.setFieldValue("company", row.company);
      showModal();
    },
    []
  );

  const columns = useMemo(
    () => [
      {
        title: "Rule",
        dataIndex: "rule",
      },
      {
        title: "Type",
        dataIndex: "scriptType",
      },
      {
        title: "",
        dataIndex: "",
      },
      {
        title: "Action",
        key: "action",
        render: (row) => (
          <Space size="middle">
            <a onClick={handleEdit(row)}>
              <EditOutlined />
            </a>
            <Popconfirm
              title={<span className="ms-2">Delete the task</span>}
              description={
                <span className="ms-2">Are you sure to delete this data?</span>
              }
              okText="Yes"
              cancelText="No"
              icon={<AiOutlineQuestionCircle style={{ color: "red" }} />}
              onConfirm={() => {
                handleDelete(row);
              }}
            >
              <DeleteOutlined />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [handleDelete, handleEdit]
  );
  const searchSection = "";
  const handleSelectChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);
    setType(value);
  };

  const handleXmlChange = (value) => {
    formik.setFieldValue("xmlRule", value);
  };

  return (
    <FormikProvider value={formik}>
      <Modal
        open={open}
        title={mode == "edit" ? `Edit` : "New"}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
        width={type == "javascript" ? 1000 : 450}
      >
        <Card>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={formik.handleSubmit}
            style={{ width: "100%", marginTop: "20px", height: "400px" }}
          >
            {user.userType == "Admin" ? (
              <Form.Item
                label="Company"
                style={{ marginBottom: "-10px" }}
                required
              >
                <CustomSelect
                  apiUrl={Config.prefixUrl + "/common/company"}
                  field={formik.getFieldProps("company")}
                  form={formik}
                  label="Company"
                  status={
                    formik.touched.company && formik.errors.company
                      ? "error"
                      : null
                  }
                />
                {formik.touched.company && formik.errors.company ? (
                  <p style={{ marginTop: "-20px", color: "#ff0000" }}>
                    {" "}
                    {formik.errors.company}
                  </p>
                ) : null}
              </Form.Item>
            ) : (
              ""
            )}
            <Form.Item label="Type">
              <Select
                placeholder="Select Type"
                onBlur={formik.handleBlur}
                value={type}
                id="type"
                onChange={(value) => handleSelectChange("scriptType", value)}
              >
                <Option value="groovy">Groovy</Option>
                <Option value="javascript">Javascript</Option>
              </Select>
            </Form.Item>
            {type == "javascript" ? (
              <>
                <BlocklyWorkspace
                  toolboxConfiguration={toolboxCategories}
                  initialXml={
                    mode == "edit"
                      ? formik.getFieldProps("xmlRule").value
                      : initialXml
                  }
                  className="fill-height"
                  workspaceConfiguration={{
                    grid: {
                      spacing: 20,
                      length: 3,
                      colour: "#ccc",
                      snap: true,
                    },
                  }}
                  onWorkspaceChange={workspaceDidChange}
                  onXmlChange={handleXmlChange}
                />
              </>
            ) : (
              <Form.Item label="Rule">
                <Input.TextArea id="rule" {...formik.getFieldProps("rule")} />
                {formik.touched.rule && formik.errors.rule ? (
                  <div>{formik.errors.rule}</div>
                ) : null}
              </Form.Item>
            )}
            <Form.Item
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "30px",
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                disabled={formik.isSubmitting}
              >
                {!isLoading && <span className="indicator-label"> Save</span>}
                {isLoading && (
                  <span
                    className="indicator-progress"
                    style={{ display: "block" }}
                  >
                    Please wait...
                  </span>
                )}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Modal>

      <div>
        <TableAntd
          title="Mqtt Rule List"
          loading={tableLoading}
          setLoading={setTableLoading}
          columns={columns}
          searchUrl={searchUrl}
          useCard={true}
          apiUrl={apiUrl + "/findByPubSub?pubsub=" + mqttTopicId}
          readonly={false}
          targetNew="#dataModal"
          targetEdit="#dataModal"
          searchSection={searchSection}
          showModal={showModalNew}
          fetch={fetch}
          setFetch={setFetch}
        />
      </div>
    </FormikProvider>
  );
};
