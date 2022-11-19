//
//  PieChart.swift
//  MyPieChart
//
//  Created by BLCKBIRDS on 07.06.21.
//

import SwiftUI

struct PieChart: View {

  var portfolio: Portfolio
  var separatorColor: Color
  var innerColor: Color
  var accentColors: [Color]

  @State private var currentPortfolioEntry: PortfolioEntry? = nil

  @State private var touchLocation: CGPoint = .init(x: -1, y: -1)

  //Uncomment the following initializer to use fully generate random colors instead of using a custom color set
  //    init(title: String, data: [ChartData], separatorColor: Color) {
  //        self.title = title
  //        self.data = data
  //        self.separatorColor = separatorColor
  //
  //        accentColors    =   [Color]()
  //        for _  in 0..<data.count  {
  //           accentColors.append(Color.init(red: Double.random(in: 0.2...0.9), green: Double.random(in: 0.2...0.9), blue: Double.random(in: 0.2...0.9)))
  //        }
  //      }

  var pieSlices: [PieSlice] {

    var slices = [PieSlice]()
    portfolio.stocks.forEach { data in
      let value = normalizedValue(portfolioEntry: data, portfolio: self.portfolio)
      if slices.isEmpty {
        slices.append((.init(startDegree: 0, endDegree: value * 360)))
      } else {
        slices.append(
          .init(
            startDegree: slices.last!.endDegree, endDegree: (value * 360 + slices.last!.endDegree)))
      }
    }
    return slices
  }

  var body: some View {
    VStack(alignment: .leading, spacing: 20) {
      ZStack {
        GeometryReader { geometry in
          ZStack {
            ForEach(0..<self.portfolio.stocks.count) { i in
              PieChartSlice(
                center: CGPoint(
                  x: geometry.frame(in: .local).midX, y: geometry.frame(in: .local).midY),
                radius: geometry.frame(in: .local).width / 2,
                innerRatio: 0.5,
                startDegree: pieSlices[i].startDegree,
                endDegree: pieSlices[i].endDegree,
                isTouched: sliceIsTouched(index: i, inPie: geometry.frame(in: .local)),
                accentColor: accentColors[i], innerColor: innerColor, separatorColor: separatorColor
              )
            }
          }
          .gesture(
            DragGesture(minimumDistance: 0)
              .onChanged({ position in
                let pieSize = geometry.frame(in: .local)
                touchLocation = position.location
                updateCurrentValue(inPie: pieSize)
              })
          )
        }
        .aspectRatio(contentMode: .fit)
        VStack {
          if currentPortfolioEntry != nil {
            Text(currentPortfolioEntry!.stock.name)
              .font(.caption)
              .bold()
              .foregroundColor(.black)
              .padding(10)
              .background(
                RoundedRectangle(cornerRadius: 5).foregroundColor(.white).shadow(radius: 3))

            Text(String(format: "%.2f€", currentPortfolioEntry!.calculateStockValue()))
              .font(.caption)
              .bold()
              .foregroundColor(.black)
              .padding(5)
              .background(
                RoundedRectangle(cornerRadius: 5).foregroundColor(.white).shadow(radius: 3))
          }

        }
        .padding()
      }
      VStack {
        if currentPortfolioEntry != nil {
          PortfolioEntryInfo(portfolioEntry: currentPortfolioEntry!, portfolio: self.portfolio)
        }
      }
    }
    .padding()
  }

  func updateCurrentValue(inPie pieSize: CGRect) {
    guard let angle = angleAtTouchLocation(inPie: pieSize, touchLocation: touchLocation) else {
      return
    }
    let currentIndex =
      pieSlices.firstIndex(where: { $0.startDegree < angle && $0.endDegree > angle }) ?? -1

    currentPortfolioEntry = portfolio.stocks[currentIndex]
  }

  func resetValues() {
    currentPortfolioEntry = nil
    touchLocation = .init(x: -1, y: -1)
  }

  func sliceIsTouched(index: Int, inPie pieSize: CGRect) -> Bool {
    guard let angle = angleAtTouchLocation(inPie: pieSize, touchLocation: touchLocation) else {
      return false
    }
    return pieSlices.firstIndex(where: { $0.startDegree < angle && $0.endDegree > angle }) == index
  }

}
