// OpenRouteService による実道路ルート取得
// APIキーなしの場合は直線補間にフォールバック

function interpolateStraight(waypoints, stepsPerSegment = 60) {
  const points = []
  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i]
    const b = waypoints[i + 1]
    for (let s = 0; s < stepsPerSegment; s++) {
      const t = s / stepsPerSegment
      points.push([a.lat + (b.lat - a.lat) * t, a.lng + (b.lng - a.lng) * t])
    }
  }
  points.push([waypoints.at(-1).lat, waypoints.at(-1).lng])
  return points
}

export async function fetchRoadRoute(waypoints, apiKey) {
  if (!apiKey) return interpolateStraight(waypoints)

  try {
    const coordinates = waypoints.map(p => [p.lng, p.lat])
    const res = await fetch(
      'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
      {
        method: 'POST',
        headers: {
          Authorization: apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ coordinates }),
      }
    )
    if (!res.ok) throw new Error(`ORS ${res.status}`)
    const data = await res.json()
    // ORS は [lng, lat] で返すので Leaflet 用に変換
    return data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng])
  } catch (e) {
    console.warn('ORS ルート取得失敗、直線補間にフォールバック:', e)
    return interpolateStraight(waypoints)
  }
}
