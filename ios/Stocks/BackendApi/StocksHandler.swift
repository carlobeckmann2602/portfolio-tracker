//
//  StocksHandler.swift
//  Stocks
//
//  Created by Jan Honsbrok on 12.01.23.
//

import Foundation
import Just

struct AddToPortfolioDto: Encodable {
  var amount: Int
  var pricePerUnit: Float
  var date: Date
}

class StocksHandler {
  private let authenticationHandler: AuthenticationHandler

  init(authenticationHandler: AuthenticationHandler) {
    self.authenticationHandler = authenticationHandler
  }

  func addToPortfolio(
    stockId: Int, amount: Int, pricePerUnit: Float, date: Date,
    onComplete: @escaping (Stock) -> Void
  ) throws {
    let dto = AddToPortfolioDto(amount: amount, pricePerUnit: pricePerUnit, date: date)
    let jsonEncoder = JSONEncoder()
    jsonEncoder.dateEncodingStrategy = .iso8601
    let jsonData = try jsonEncoder.encode(dto)

    JustOf<HTTP>().post(
      "\(ApiUtils.BASE_URL)/users/me/stocks/\(stockId)",
      headers: authenticationHandler.getHeaders(),
      requestBody: jsonData,
      asyncCompletionHandler: { r in
        if !r.ok {
          return
        }
        do {
          let stock = try r.getEntity(Stock.self)
          onComplete(stock)
        } catch {
          print("Failed to add stock to portfolio: \(error)")
        }
      }
    )

  }
}
