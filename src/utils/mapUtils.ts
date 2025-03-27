import L from 'leaflet'
import type { LatLng, LatLngBounds, Layer } from 'leaflet'
import 'leaflet.heat'
import 'leaflet.markercluster'

// 计算多边形的面积（平方米）
export const calculatePolygonArea = (coordinates: LatLng[]): number => {
  if (coordinates.length < 3) return 0

  let area = 0
  for (let i = 0; i < coordinates.length; i++) {
    const j = (i + 1) % coordinates.length
    area += coordinates[i].lng * coordinates[j].lat
    area -= coordinates[j].lng * coordinates[i].lat
  }

  return Math.abs(area) / 2
}

// 将平方米转换为亩
export const squareMetersToMu = (area: number): number => {
  return area / 666.67
}

// 将亩转换为平方米
export const muToSquareMeters = (area: number): number => {
  return area * 666.67
}

// 计算多边形的中心点
export const calculatePolygonCenter = (coordinates: LatLng[]): LatLng => {
  if (coordinates.length === 0) {
    throw new Error('坐标数组不能为空')
  }

  let sumLat = 0
  let sumLng = 0

  coordinates.forEach(coord => {
    sumLat += coord.lat
    sumLng += coord.lng
  })

  return L.latLng(sumLat / coordinates.length, sumLng / coordinates.length)
}

// 计算多边形的边界框
export const calculatePolygonBounds = (coordinates: LatLng[]): LatLngBounds => {
  if (coordinates.length === 0) {
    throw new Error('坐标数组不能为空')
  }

  let minLat = coordinates[0].lat
  let maxLat = coordinates[0].lat
  let minLng = coordinates[0].lng
  let maxLng = coordinates[0].lng

  coordinates.forEach(coord => {
    minLat = Math.min(minLat, coord.lat)
    maxLat = Math.max(maxLat, coord.lat)
    minLng = Math.min(minLng, coord.lng)
    maxLng = Math.max(maxLng, coord.lng)
  })

  return L.latLngBounds(
    L.latLng(minLat, minLng),
    L.latLng(maxLat, maxLng)
  )
}

// 检查点是否在多边形内
export const isPointInPolygon = (point: LatLng, polygon: LatLng[]): boolean => {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng
    const yi = polygon[i].lat
    const xj = polygon[j].lng
    const yj = polygon[j].lat

    if (
      ((yi > point.lat) !== (yj > point.lat)) &&
      (point.lng < (xj - xi) * (point.lat - yi) / (yj - yi) + xi)
    ) {
      inside = !inside
    }
  }
  return inside
}

// 计算两点之间的距离（米）
export const calculateDistance = (point1: LatLng, point2: LatLng): number => {
  return point1.distanceTo(point2)
}

// 格式化距离显示
export const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)}公里`
  }
  return `${Math.round(meters)}米`
}

// 创建自定义图标
export const createCustomIcon = (options: {
  iconUrl: string
  iconSize?: [number, number]
  iconAnchor?: [number, number]
  popupAnchor?: [number, number]
  shadowUrl?: string
  shadowSize?: [number, number]
  shadowAnchor?: [number, number]
}): L.Icon => {
  return L.icon({
    iconUrl: options.iconUrl,
    iconSize: options.iconSize || [25, 41],
    iconAnchor: options.iconAnchor || [12, 41],
    popupAnchor: options.popupAnchor || [1, -34],
    shadowUrl: options.shadowUrl,
    shadowSize: options.shadowSize || [41, 41],
    shadowAnchor: options.shadowAnchor || [12, 41]
  })
}

// 创建图层组
export const createLayerGroup = (layers: Layer[]): L.LayerGroup => {
  return L.layerGroup(layers)
}

// 创建要素组
export const createFeatureGroup = (layers: Layer[]): L.FeatureGroup => {
  return L.featureGroup(layers)
}

// 创建GeoJSON图层
export const createGeoJSONLayer = (
  geojson: GeoJSON.Feature | GeoJSON.FeatureCollection,
  options?: L.GeoJSONOptions
): L.GeoJSON => {
  return L.geoJSON(geojson, options)
}

// 创建热力图图层
export const createHeatLayer = (
  points: [number, number, number][],
  options?: any
): any => {
  return (L as any).heatLayer(points, options)
}

// 创建标记聚类图层
export const createMarkerClusterGroup = (
  options?: any
): any => {
  return (L as any).markerClusterGroup(options)
} 