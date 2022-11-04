//
//  SearchView.swift
//  Stocks
//
//  Created by Jan Honsbrok on 26.10.22.
//

import Combine
import Foundation
import SwiftUI

class SearchState: ObservableObject {
  @Published var searchText = ""
}

struct SearchStocksList: View {

  @Environment(\.isSearching)
  private var isSearching: Bool

  var body: some View {
    if isSearching {
      StockHintList()
    } else {
      StocksList()
    }
  }
}

class StocksLoader: LoadableObject {
  @Published private(set) var state = LoadingState<[Stock]>.idle

  func load() {
    state = .loading
    DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
      self.state = .loaded([Stock(name: "DemoStock")])
    }
  }
}

struct SearchView: View {

  @StateObject var searchState = SearchState()
  var stocksLoader = StocksLoader()

  var body: some View {
    NavigationView {
      AsyncContentView(loadable: stocksLoader, loadingView: ProgressView()) { stocks in
        SearchStocksList()
      }
    }.searchable(text: $searchState.searchText, prompt: "Search a stock").environmentObject(
      searchState)
  }
}

struct SearchView_Previews: PreviewProvider {
  static var previews: some View {
    SearchView()
  }
}
