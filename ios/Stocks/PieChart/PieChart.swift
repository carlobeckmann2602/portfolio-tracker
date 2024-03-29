//
//  PieChart.swift
//  MyPieChart
//
//  Created by BLCKBIRDS on 07.06.21.
//

import SwiftUI

struct PieChart: View {

  @ObservedObject var portfolio: Portfolio
  var separatorColor: Color
  var innerColor: Color
  var accentColors: [Color]
  var portfolioHandler: PortfolioHandler

  @State private var currentStockId: Int? = nil

  @State private var touchLocation: CGPoint = .init(x: -1, y: -1)

  func currentPortfolioEntry() -> PortfolioEntry? {
    return self.portfolio.stocks.first(where: { $0.stock.id == currentStockId })
  }

  func computePieSclices() -> [PieSlice] {
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
    let pieSlices = computePieSclices()
    return VStack(alignment: .center, spacing: 20) {
      ZStack {
        GeometryReader { geometry in
          ZStack {
            ForEach(self.portfolio.stocks) { stock in
              let i = self.portfolio.stocks.firstIndex(where: { $0.id == stock.id })!
              PieChartSlice(
                center: CGPoint(
                  x: geometry.frame(in: .local).midX, y: geometry.frame(in: .local).midY),
                radius: geometry.frame(in: .local).width / 2,
                innerRatio: 0.5,
                startDegree: pieSlices[i].startDegree,
                endDegree: pieSlices[i].endDegree,
                isTouched: sliceIsTouched(index: i, inPie: geometry.frame(in: .local)),
                accentColor: accentColors[i % accentColors.count], innerColor: innerColor,
                separatorColor: separatorColor,
                label: stock.stock.symbol.uppercased()
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
      }

      HStack {
        if currentPortfolioEntry() != nil {
          PortfolioEntryInfo(
            portfolioEntry: currentPortfolioEntry()!, portfolio: self.portfolio,
            portfolioHandler: portfolioHandler)
        } else {
          Text("Tap on an area of the donut chart for more.")
            .roboto(size: 25)
            .multilineTextAlignment(.center)
            .frame(width: 260)
        }
      }
    }
  }

  func updateCurrentValue(inPie pieSize: CGRect) {
    guard let angle = angleAtTouchLocation(inPie: pieSize, touchLocation: touchLocation) else {
      return
    }
    let currentIndex =
      computePieSclices().firstIndex(where: { $0.startDegree < angle && $0.endDegree > angle })
      ?? -1

    currentStockId = portfolio.stocks[currentIndex].stock.id
  }

  func resetValues() {
    currentStockId = nil
    touchLocation = .init(x: -1, y: -1)
  }

  func sliceIsTouched(index: Int, inPie pieSize: CGRect) -> Bool {
    guard let angle = angleAtTouchLocation(inPie: pieSize, touchLocation: touchLocation) else {
      return false
    }
    return computePieSclices().firstIndex(where: { $0.startDegree < angle && $0.endDegree > angle })
      == index
  }

}
