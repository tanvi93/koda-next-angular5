import { Injectable } from '@angular/core';
import { SpriteService } from './../sprite.service';

declare let Blockly: any;
declare function escape(s: string): string;
declare function unescape(s: string): string;

@Injectable()
export class SayBlockService {
  private sp: SpriteService;
  private block;
  public xml; String;

  constructor(activity = null) {
    this.xml = `<block type="say" id="say"></block>`;
    this.sp = new SpriteService();
    const sprites = this.sp.spriteDropdown(activity);
    Blockly.Blocks['say'] = {
      init: function () {
        this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown(sprites), 'sprite')
          .appendField(': say')
          .appendField(new Blockly.FieldTextInput(''), 'message');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('');
      }
    };

    Blockly.JavaScript['say'] = block => {
      this.block = block;
      let spriteIndex = block.getFieldValue('sprite');
      spriteIndex = spriteIndex.length === 0 ? -1 : spriteIndex;
      let textName = String(block.getFieldValue('message'));
      textName = escape(textName);
      let json = {
        textName,
        spriteIndex
      }
      return `say('${JSON.stringify(json)}');\n`;
    };
  }

  initInterpreterSay = (interpreter, scope, cb) => {
    // Ensure function name does not conflict with variable names.
    Blockly.JavaScript.addReservedWords('say');
    const wrapper = (text, callback) => {
      if (this.block) {
        this.block.addSelect();
      }  
      text = JSON.parse(text.replace(/[']/g, ''));
      text.textName = text.textName ? text.textName : '';
      text.textName = unescape(text.textName);
      cb(text.textName, text.spriteIndex, 2000);
      setTimeout(() => {
        if (this.block) {
          this.block.removeSelect();
        }  
        callback(text.textName);
      }, 2000);
    };
    interpreter.setProperty(scope, 'say', interpreter.createAsyncFunction(wrapper));
  }
}