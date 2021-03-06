import { Injectable } from '@angular/core';
import { SpriteService } from './../sprite.service';
import { computeChildJson } from './utility-functions.service';

declare let Blockly: any;


@Injectable()
export class MoveWithSpeedService {
  private sp: SpriteService;
  public xml; String;
  private blocks;

  constructor(activity = null) {
    this.blocks = [];
    this.xml = `<block type = "move_with_speed" id = "move_with_speed" >
                    <value name="steps">
                        <shadow type="number"> </shadow>
                    </value>
                    <value name="speed">
                        <shadow type="number"> </shadow>
                    </value>
                </block> `;
    this.sp = new SpriteService();
    const sprites = this.sp.spriteDropdown(activity);
    Blockly.Blocks['move_with_speed'] = {
      init: function () {
        this.appendDummyInput();
        this.appendValueInput('steps')
          .setCheck(['Number'])
          .appendField(new Blockly.FieldDropdown(sprites), 'sprite')
          .appendField(': move ')
          .appendField(new Blockly.FieldDropdown([
            ['left', 'L'],
            ['right', 'R'],
            ['up', 'U'],
            ['down', 'D']
          ]), 'direction')
          .appendField(' by ');
        this.appendDummyInput()
          .appendField('steps')
          .appendField(new Blockly.FieldDropdown([
            ['slow', '0.6'],
            ['medium', '1'],
            ['fast', '2'],
          ]), 'speed')
          .appendField('speed');
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(300);
        this.setTooltip('');
        this.setHelpUrl('');
      }
    };

    Blockly.JavaScript['move_with_speed'] = (block) => {
      this.blocks.push(block);
      const direction = block.getFieldValue('direction');
      let steps = Blockly.JavaScript.valueToCode(block, 'steps');
      let spriteIndex = block.getFieldValue('sprite');
      spriteIndex = spriteIndex.length === 0 ? -1 : spriteIndex;
      const speed = Number(block.getFieldValue('speed'));
      const childJson = computeChildJson(block.childBlocks_);
      let params = {
        childJson,
        spriteIndex,
        direction,
        speed,
        hasAnimation: true,
        x: 0,
        y: 0,
        inputBlock: null,
        blockIndex: this.blocks.length - 1
      }
      if (!Number.isNaN(Number(steps))) {
        steps = Math.abs(steps);
        switch (direction) {
          case 'L':
            params.x = -steps;
            break;
          case 'R':
            params.x = steps;
            break;
          case 'U':
            params.y = -steps;
            break;
          case 'D':
            params.y = steps;
            break;
          default:
            params.x = steps;
            break;
        }
      } else {
        params.inputBlock = {
          axis: 'x',
          isAdd: true,
          steps: steps
        }
        switch (direction) {
          case 'L':
            params.inputBlock.axis = 'x';
            params.inputBlock.isAdd = false;
            break;
          case 'R':
            params.inputBlock.axis = 'x';
            break;
          case 'U':
            params.inputBlock.axis = 'y';
            params.inputBlock.isAdd = false;
            break;
          case 'D':
            params.inputBlock.axis = 'y';
            break;
          default:
            params.inputBlock.axis = 'x';
            break;
        }
      }
      const json = {
        method: 'moveWithSpeed',
        params
      }
      return `${JSON.stringify(json)};\n`;
    };
  }

  interpret = (interpreter, cb) => {
    const wrapper = (json, callback) => {
      if (this.blocks && this.blocks.length) {
        this.blocks[json.blockIndex].addSelect();
      } 
      const releasingBlock = () => {
        if (this.blocks && this.blocks.length) {
          this.blocks[json.blockIndex].removeSelect();
        }
        callback(json);
      }
      json.callback = releasingBlock;
      const executeFn = (axis) => {
        let value = interpreter.executeCommands(json.inputBlock.steps);
        json[json.inputBlock.axis] = json.inputBlock.isAdd ? Math.abs(value) : -1 * Math.abs(value);
        cb(json);
      }
      if (json.inputBlock) {
        executeFn(json.inputBlock.axis);
      } else {
        cb(json);
      }
    };
    interpreter.setProperty('moveWithSpeed', wrapper, 'async');
  }

}