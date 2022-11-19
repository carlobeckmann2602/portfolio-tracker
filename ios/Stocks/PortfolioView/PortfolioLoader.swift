//
//  PortfolioLoader.swift
//  Stocks
//
//  Created by Jan Honsbrok on 19.11.22.
//

import Foundation

class PortfolioLoader: LoadableObject {
  @Published private(set) var state = LoadingState<Portfolio>.idle

  func load() {
    state = .loading
    DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
      let stocks = ModelData()
      self.state = .loaded(
        Portfolio(stocks: [
          PortfolioEntry(stock: stocks.stocks[0], amount: 5.4),
          PortfolioEntry(stock: stocks.stocks[4], amount: 8),
          PortfolioEntry(stock: stocks.stocks[22], amount: 15),
        ]))
    }
  }
}
