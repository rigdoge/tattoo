// 简化的国界线数据
export const countries = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Asia" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [90, 30], [120, 30], [120, 60], [90, 60], [90, 30]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "North America" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-120, 30], [-80, 30], [-80, 50], [-120, 50], [-120, 30]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "Europe" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [0, 40], [30, 40], [30, 60], [0, 60], [0, 40]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "Africa" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [0, 0], [30, 0], [30, 30], [0, 30], [0, 0]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "South America" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70, -30], [-40, -30], [-40, 0], [-70, 0], [-70, -30]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "Australia" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [120, -30], [150, -30], [150, -10], [120, -10], [120, -30]
          ]
        ]
      }
    }
  ]
};
