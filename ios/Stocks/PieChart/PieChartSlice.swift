//
//  PieChartSlice.swift
//  MyPieChart
//
//  Created by BLCKBIRDS on 07.06.21.
//

import SwiftUI

struct PieChartSlice: View {

  var center: CGPoint
  var radius: CGFloat
  var innerRatio: CGFloat
  var startDegree: Double
  var endDegree: Double
  var isTouched: Bool
  var accentColor: Color
  var innerColor: Color
  var separatorColor: Color
  var label: String

  var outter: Path {
    var path = Path()
    path.addArc(
      center: center, radius: radius, startAngle: Angle(degrees: startDegree),
      endAngle: Angle(degrees: endDegree), clockwise: false)
    path.addLine(to: center)
    path.closeSubpath()
    return path
  }

  var inner: Path {
    var path = Path()
    path.addArc(
      center: center, radius: radius * innerRatio, startAngle: Angle(degrees: startDegree),
      endAngle: Angle(degrees: endDegree), clockwise: false)
    path.addLine(to: center)
    path.closeSubpath()
    return path
  }

  var body: some View {
    ZStack {
      outter
        .fill(accentColor)
        .scaleEffect(touchedMultiplier())
        .animation(Animation.spring())
      inner
        .fill(innerColor)
        .scaleEffect(touchedMultiplier())
        .animation(Animation.spring())
      Text(label).foregroundColor(.white)
        .position(
          rotate(
            pivot: center,
            point: CGPoint(x: center.x + radius * 0.75 * touchedMultiplier(), y: center.y),
            angle: Angle(degrees: (startDegree + endDegree) / 2.0))
        ).animation(Animation.spring())

    }
  }
  func touchedMultiplier() -> Double {
    return isTouched ? 1.05 : 1
  }

  func rotate(pivot: CGPoint, point: CGPoint, angle: Angle) -> CGPoint {
    let translatedToPivot = CGPoint(x: point.x - pivot.x, y: point.y - pivot.y)
    let rotated = CGPoint(
      x: translatedToPivot.x * CoreGraphics.cos(angle.radians as Double) - translatedToPivot.y
        * CoreGraphics.sin(angle.radians),
      y: translatedToPivot.x * CoreGraphics.sin(angle.radians as Double) - translatedToPivot.y
        * CoreGraphics.cos(angle.radians))
    let result = CGPoint(x: rotated.x + pivot.x, y: rotated.y + pivot.y)
    return result
  }
}

struct PieChartSlice_Previews: PreviewProvider {
  static var previews: some View {
    PieChartSlice(
      center: CGPoint(x: 100, y: 200), radius: 300, innerRatio: 0.5, startDegree: 0, endDegree: 45,
      isTouched: true,
      accentColor: .orange, innerColor: .white, separatorColor: .black, label: "AAPL")
  }
}
