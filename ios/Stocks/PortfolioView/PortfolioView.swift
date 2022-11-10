//
//  PortfolioView.swift
//  Stocks
//
//  Created by Jan Honsbrok on 26.10.22.
//

import Foundation
import SwiftUI

struct PortfolioView: View {
  @EnvironmentObject var modelData: ModelData
  @State var portfolio = Portfolio(stocks: [
    PortfolioStock(stock: ModelData().stocks[0], amount: 5.4),
    PortfolioStock(stock: ModelData().stocks[4], amount: 8),
    PortfolioStock(stock: ModelData().stocks[22], amount: 15),
  ])

  var body: some View {
    VStack {
      List {
        ForEach(portfolio.stocks) { portfolioStock in
          PortfolioListItem(portfolioStock: portfolioStock)
        }
      }
      .navigationTitle("Portfolio")
    }
  }
}

struct PortfolioView_Previews: PreviewProvider {
  static var previews: some View {
    PortfolioView()
      .environmentObject(ModelData())
  }
}
