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
    VStack {
      if portfolio.stocks.isEmpty {
        Text("Your portfolio is empty, add a ").foregroundColor(Color.white)
      } else {
        PieChart(
          title: "Portfolio",
          portfolio: portfolio, separatorColor: Color(UIColor.systemBackground), innerColor: .black,
          accentColors: pieColors)
      }
    }
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
