// // // // Type definitions for Leaflet.MarkMoving
import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Marker {
    class MarkMoving extends Marker {
      constructor(latlng: LatLngExpression, duration?: any, options?: MarkMovingOptions);
      options: MarkMovingOptions;
      start(): void;
      pause(): void;
      resume(): void;
      addLatLng(latlng: any, duration: any): void;
      moveTo(latlng: any, duration: any): void;
      addStation(pointIndex: any, duration: any): void;
      setDurations(pointIndex: any, duration: any): void;
      stop(elapsedTime?: any): void;
      isEnded(): void;
    }

    interface MarkMovingOptions {
      autostart?: boolean;
      loop?: boolean;
    }


  }

  namespace Marker {
    /**
     * Creates a Leaflet.MarkMoving.
     */
    function movingMarker(latlngs, duration, options): Marker.MarkMoving;
  }


}
