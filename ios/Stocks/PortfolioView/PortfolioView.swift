//
//  PortfolioView.swift
//  Stocks
//
//  Created by Jan Honsbrok on 26.10.22.
//

import Foundation
import SwiftUI

struct PortfolioLoadedView: View {
  let portfolio: Portfolio
  var body: some View {
    VStack(alignment: .leading, spacing: 20) {
      Text("Portfolio")
        .bold()
        .font(.system(size: 50))
        .fontWeight(.bold)
        .foregroundColor(Color.white)
      if !portfolio.stocks.isEmpty {
        Text(String(format: "Total value: %.2f€", portfolio.totalValue()))
          .bold()
          .font(.system(size: 35))
          .fontWeight(.regular)
          .foregroundColor(Color.white)
      }
      Label("add", systemImage: "plus.circle")
        .font(.system(size: 40))
        .foregroundColor(Color(hex: "0094ff"))
        .labelStyle(.iconOnly)
      if portfolio.stocks.isEmpty {
        Text("Your portfolio is empty, add a ").foregroundColor(Color.white)
      } else {
        PieChart(
          portfolio: portfolio, separatorColor: Color(UIColor.systemBackground), innerColor: .black,
          accentColors: pieColors)
      }
    }.padding()
  }
}

struct PortfolioView: View {
  var portfolioLoader = PortfolioLoader()
  var body: some View {
    ZStack {
      Color.black
        .edgesIgnoringSafeArea(.all)
      AsyncContentView(
        loadable: portfolioLoader,
        loadingView: ProgressView("Loading Portfolio..").tint(.white).foregroundColor(Color.white)
      ) { portfolio in
        PortfolioLoadedView(portfolio: portfolio)
      }

    }
  }
}

struct PortfolioView_Previews: PreviewProvider {
  static var previews: some View {
    PortfolioView()
      .environmentObject(ModelData())
  }
}
