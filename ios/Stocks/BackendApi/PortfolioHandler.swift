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
          let portfolioDto = try r.getEntity(PortfolioDto.self)

          let portfolioStocks = try self.loadPortfolioEntries(portfolioDto)

          let portfolio = Portfolio(stocks: portfolioStocks)

          onComplete(portfolio)
        } catch {
          print("Failed load error message: \(error)")
        }
      }
    )
  }

  private func loadPortfolioEntries(_ portfolioDto: PortfolioDto) throws -> [PortfolioEntry] {
    return try portfolioDto.stocksOnUser.map { stockOnUserDto in
      let stock = try self.loadStock(stockId: stockOnUserDto.id)
      return PortfolioEntry(stock: stock, amount: stockOnUserDto.totalAmount)
    }
  }

  private func loadStock(stockId: Int) throws -> Stock {
    let url = "\(ApiUtils.BASE_URL)/stocks/\(stockId)"
    let response = JustOf<HTTP>().get(url, headers: self.authenticationHandler.getHeaders())
    return try response.getEntity(Stock.self)
  }
}
