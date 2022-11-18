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
        path.addArc(center: center, radius: radius * innerRatio, startAngle: Angle(degrees: startDegree), endAngle: Angle(degrees: endDegree), clockwise: false)
        path.addLine(to: center)
        path.closeSubpath()
        return path
    }

  var body: some View {
      ZStack {
          outter
              .fill(accentColor)
              .scaleEffect(isTouched ? 1.05 : 1)
              .animation(Animation.spring())
          inner
              .fill(innerColor)
              .scaleEffect(isTouched ? 1.05 : 1)
              .animation(Animation.spring())
      }
  }
}

struct PieChartSlice_Previews: PreviewProvider {
  static var previews: some View {
    PieChartSlice(
        center: CGPoint(x: 100, y: 200), radius: 300, innerRatio: 0.5, startDegree: 30, endDegree: 80, isTouched: true,
        accentColor: .orange, innerColor: .white, separatorColor: .black)
  }
}
