//
//  SearchHandler.swift
//  Stocks
//
//  Created by Jan Honsbrok on 12.01.23.
//

import Foundation
import Just

class SearchHandler {
  private let authenticationHandler: AuthenticationHandler

  init(authenticationHandler: AuthenticationHandler) {
    self.authenticationHandler = authenticationHandler
  }

  func loadSearch(searchText: String, onComplete: @escaping ([Stock]) -> Void) {
    JustOf<HTTP>().get(
      "\(ApiUtils.BASE_URL)/stocks?name=\(searchText)",
      headers: authenticationHandler.getHeaders(),
      asyncCompletionHandler: { r in
        if !r.ok {
          return
        }
        do {
          let stocks = try r.getEntity([Stock].self)

          onComplete(stocks)
        } catch {
          print("Failed load search result: \(error)")
        }
      }
    )
  }
}
