//
//  PortfolioLoader.swift
//  Stocks
//
//  Created by Jan Honsbrok on 19.11.22.
//

import Foundation
import SwiftUI

class PortfolioLoader: LoadableObject {
  var loadEmpty: Bool = false
  @Published private(set) var state = LoadingState<Portfolio>.idle

  func load() {
      for family in UIFont.familyNames {
               print(family)
               for names in UIFont.fontNames(forFamilyName: family){
               print("== \(names)")
               }
          }
      
    state = .loading
    DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
      let stocks = ModelData()
      if self.loadEmpty {
        self.state = .loaded(
          Portfolio(stocks: []))
        return
      }
      self.state = .loaded(
        Portfolio(stocks: [
          PortfolioEntry(stock: stocks.stocks[0], amount: 5),
          PortfolioEntry(stock: stocks.stocks[4], amount: 8),
          PortfolioEntry(stock: stocks.stocks[22], amount: 15),
        ]))
    }
  }
}
