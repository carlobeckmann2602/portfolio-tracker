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
  var amountAfterSplit: Int
  var price: Float
  var trend: Float
  var moneyInvestedInStock: Float
  var gainAbsolute: Float
  var gainPercentage: Float
  var histories: [History]
}
// TODO: add additional information to Portfolio/PortfolioEntry/Stock classes
struct PortfolioDto: Decodable {
  var currentPortfolioValue: Float
  var gainAbsolute: Float
  var gainPercentage: Float
  var stocks: [PortfolioOnUserDto]
}

// TODO: rename to PortfolioHandler
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

          let portfolioStocks = self.mapToPortfolioEntries(portfolioDto)

          let portfolio = Portfolio(stocks: portfolioStocks)

          onComplete(portfolio)
        } catch {
          print("Failed load error message: \(error)")
        }
      }
    )
  }

  private func mapToPortfolioEntries(_ portfolioDto: PortfolioDto) -> [PortfolioEntry] {
    return portfolioDto.stocks.map { stockOnUserDto in
      let stock = Stock(
        id: stockOnUserDto.id, name: stockOnUserDto.name, symbol: stockOnUserDto.symbol,
        description: stockOnUserDto.description, histories: stockOnUserDto.histories)
      return PortfolioEntry(stock: stock, amount: stockOnUserDto.amountAfterSplit)
    }
  }
}
