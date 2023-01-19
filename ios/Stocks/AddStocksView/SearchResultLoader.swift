//
//  SearchResultLoader.swift
//  Stocks
//
//  Created by Jan Honsbrok on 12.01.23.
//

import Foundation

class SearchResultLoader: LoadableObject {
  var searchHandler: SearchHandler
  @Published private(set) var state = LoadingState<[Stock]>.idle
  var searchText: String

  init(searchHandler: SearchHandler, searchText: String) {
    self.searchHandler = searchHandler
    self.searchText = searchText
  }

  func load() {
    state = .loading
    searchHandler.loadSearch(
      searchText: searchText,
      onComplete: { stocks in
        self.state = .loaded(stocks.sorted(by: { $0.name < $1.name }))
      })
  }
}
