// Type definitions for Leaflet.fullscreen 1.3
// Project: https://github.com/brunob/leaflet.fullscreen
// Definitions by: William Comartin <https://github.com/wcomartin>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Control {
    class MousePosition extends Control {
      constructor(options?: MousePositionOptions);
      options: MousePositionOptions;
    }

    interface MousePositionOptions {
      content?: string;
      position?: ControlPosition;
      separator?: string;
      emptyString?: string;
      lngFirst?: boolean;
      numDigits?: number;
      lngFormatter?: string;
      latFormatter?: string;
      prefix?: string;
    }
  }

  namespace control {
    /**
     * Creates a fullscreen control.
     */
    function mousePosition(options?: Control.MousePositionOptions): Control.MousePosition;
  }
}
