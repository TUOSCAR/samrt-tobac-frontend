import * as L from 'leaflet'

declare module 'leaflet' {
  namespace Control {
    interface MeasureOptions {
      position?: string
      primaryLengthUnit?: string
      secondaryLengthUnit?: string
      primaryAreaUnit?: string
      secondaryAreaUnit?: string
      activeColor?: string
      completedColor?: string
    }

    class Measure extends L.Control {
      constructor(options?: MeasureOptions)
      addTo(map: L.Map): this
      remove(): this
    }
  }
}

declare module 'leaflet-draw' {
  namespace Control {
    interface DrawOptions {
      position?: string
      draw?: {
        polygon?: {
          allowIntersection?: boolean
          drawError?: {
            color?: string
            message?: string
          }
          shapeOptions?: L.PolylineOptions
        }
        circle?: boolean | {
          shapeOptions?: L.CircleOptions
        }
        circlemarker?: boolean | {
          shapeOptions?: L.CircleMarkerOptions
        }
        marker?: boolean | {
          icon?: L.Icon
        }
        polyline?: boolean | {
          shapeOptions?: L.PolylineOptions
        }
        rectangle?: boolean | {
          shapeOptions?: L.PolylineOptions
        }
      }
      edit?: {
        featureGroup?: L.FeatureGroup
        remove?: boolean
      }
    }

    class Draw extends L.Control {
      constructor(options?: DrawOptions)
      addTo(map: L.Map): this
      remove(): this
    }
  }
} 