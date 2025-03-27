import L from 'leaflet'

declare module 'leaflet' {
  interface Layer {
    _map?: Map
  }
  
  interface Map {
    _map?: Map
  }
}

export interface MapLayer {
  id: string
  name: string
  layer: L.Layer
  visible: boolean
} 