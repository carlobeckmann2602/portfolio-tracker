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
  var portfolioHandler: PortfolioHandler
  @Published private(set) var state = LoadingState<Portfolio>.idle

  init(portfolioHandler: PortfolioHandler) {
    self.portfolioHandler = portfolioHandler
  }

  func load() {
    state = .loading
    portfolioHandler.loadUserPortfolio(onComplete: { portfolio in
      self.state = .loaded(portfolio)
    })
  }
}
