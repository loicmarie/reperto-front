/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare var $: any;
declare var Chess: any;
declare var ChessBoard: any;
declare var Parser: any;

interface Parser {
    parseToJSON(pngData: string, cb?: Function): Object;
    loadFile();
}
