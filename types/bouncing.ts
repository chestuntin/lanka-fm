export interface Message {
    id: string;
    text: string;
    timestamp: number;
  }
  
  export interface Bounds {
    left: number;
    top: number;
    width: number;
    height: number;
  }
  
  export interface Position {
    x: number;
    y: number;
  }
  
  export interface Velocity {
    x: number;
    y: number;
  }
  
  export interface Size {
    width: number;
    height: number;
  }
  
  export interface BouncingElement {
    pos: Position;
    vel: Velocity;
    size: Size;
    setPos: (pos: Position) => void;
    setVel: (vel: Velocity) => void;
  }