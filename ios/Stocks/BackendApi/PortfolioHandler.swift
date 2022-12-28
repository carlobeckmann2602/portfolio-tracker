//
//  NetworkAdapter.swift
//  Stocks
//
//  Created by Jan Honsbrok on 09.12.22.
//

import Foundation
import JWTDecode
import Just

struct PortfolioOnUserDto: Decodable {
  var id: Int
  var symbol: String
  var name: String
  var description: String
  var totalValue: Float
  var totalAmount: Int
}

struct PortfolioDto: Decodable {
  var portfoliovalue: Float
  var stocksOnUser: [PortfolioOnUserDto]
}

class NetworkAdapter {

  private let authenticationHandler: AuthenticationHandler

  init(authenticationHandler: AuthenticationHandler) {
    self.authenticationHandler = authenticationHandler
  }

  func loadUserPortfolio(onComplete: @escaping (Portfolio) -> Void) {
    JustOf<HTTP>().get(
      "\(ApiUtils.BASE_URL)/users/me/stocks",
      headers: authenticationHandler.getHeaders(),
      asyncCompletionHandler: { r in
        if !r.ok {
          return
        }
        do {
          let decoder = JSONDecoder()
          let portfolioDto = try decoder.decode(
            PortfolioDto.self, from: r.text!.data(using: .utf8)!)  // TODO create extension function

          let portfolioStocks =
            try portfolioDto.stocksOnUser.map { stockOnUserDto in
              let stock = try self.loadStock(stockId: stockOnUserDto.id)
              return PortfolioEntry(stock: stock, amount: stockOnUserDto.totalAmount)
            }

          let portfolio = Portfolio(stocks: portfolioStocks)

          onComplete(portfolio)
        } catch {
          print("Failed load error message: \(error)")
        }
      }
    )
  }

  private func loadStock(stockId: Int) throws -> Stock {
    let decoder = JSONDecoder()
    let url = "\(ApiUtils.BASE_URL)/stocks/\(stockId)"
    let r = JustOf<HTTP>().get(url, headers: self.authenticationHandler.getHeaders())
    return try decoder.decode(Stock.self, from: r.text!.data(using: .utf8)!)
  }
}
