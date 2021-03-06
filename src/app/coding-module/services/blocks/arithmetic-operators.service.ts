import { Injectable } from '@angular/core';
import { NumberBlockService } from './number-block.service';

declare let Blockly: any;

@Injectable()
export class ArithmeticOperatorsService {
  public xml: String;
  private numberBlock: NumberBlockService;

  constructor() {
    this.numberBlock = new NumberBlockService();
    this.xml = `<block type="arithmetic_operators">
      <value name="input1">
        ${this.numberBlock.xml}
      </value>
      <value name="input2">
        ${this.numberBlock.xml}
      </value>
    </block>`;

    Blockly.Blocks['arithmetic_operators'] = {
      init: function () {
        this.appendValueInput("input1");
        this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown([
            ["+", "0"],
            ["-", "1"],
            ["*", "2"],
            ["/", "3"]
          ]), "operator");
        this.appendValueInput("input2");
        this.setInputsInline(true);
        this.setOutput(true, "Number");
        this.setColour(190);
        this.setTooltip('');
        this.setHelpUrl('');
      }
    };

    Blockly.JavaScript['arithmetic_operators'] = function (block) {
      const operator = block.getFieldValue('operator');
      const input1 = Blockly.JavaScript.valueToCode(block, 'input1');
      const input2 = Blockly.JavaScript.valueToCode(block, 'input2');
      let json = {
        method: 'getArithmeticResult',
        type: 'input',
        params: {
          input1,
          input2,
          operator
        }
      }
      return [JSON.stringify(json)];
    };

  }

  interpret = interpreter => {
    let operatorArr = ['add', 'sub', 'multiply', 'divide'];
    const wrapper = function ({input1, input2, operator}) {
      let result = null;
      if (isNaN(Number(input1))) {
        input1 = interpreter.executeCommands(input1);
      }
      if (isNaN(Number(input2))) {
        input2 = interpreter.executeCommands(input2);
      }
      input1 = parseFloat(input1);
      input2 = parseFloat(input2);
      switch (operatorArr[operator]) {
        case "add":
          result = input1 + input2;
          break;
        case "sub":
          result = input1 - input2;
          break;
        case "multiply":
          result = input1 * input2;
          break;
        case "divide":
          result = input1 / input2;
          break;
      }
      return result;
    };
    interpreter.setProperty('getArithmeticResult', wrapper, 'input');
  }
}
