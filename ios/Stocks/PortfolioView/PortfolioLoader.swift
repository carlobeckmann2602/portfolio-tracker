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
  var networkAdapter: NetworkAdapter
  @Published private(set) var state = LoadingState<Portfolio>.idle

  init(networkAdapter: NetworkAdapter) {
    self.networkAdapter = networkAdapter
  }

  func load() {
    state = .loading
    networkAdapter.loadUserPortfolio(onComplete: { portfolio in
      self.state = .loaded(portfolio)
    })
  }
}
