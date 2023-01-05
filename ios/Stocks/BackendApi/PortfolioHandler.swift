//
//  PortfolioHandler.swift
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
  var histories: [StockHistory]
}

struct PortfolioDto: Decodable {
  var currentPortfolioValue: Float
  var gainAbsolute: Float
  var gainPercentage: Float
  var stocks: [PortfolioOnUserDto]
}

class PortfolioHandler {

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

          let portfolio = Portfolio(
            stocks: portfolioStocks, currentPortfolioValue: portfolioDto.currentPortfolioValue,
            gainAbsolute: portfolioDto.gainAbsolute, gainPercentage: portfolioDto.gainPercentage)

          onComplete(portfolio)
        } catch {
          print("Failed load portfolio: \(error)")
        }
      }
    )
  }

  private func mapToPortfolioEntries(_ portfolioDto: PortfolioDto) -> [PortfolioEntry] {
    return portfolioDto.stocks.map { stockOnUserDto in
      let stock = Stock(
        id: stockOnUserDto.id, name: stockOnUserDto.name, symbol: stockOnUserDto.symbol,
        description: stockOnUserDto.description, histories: stockOnUserDto.histories)
      return PortfolioEntry(
        stock: stock,
        amountAfterSplit: stockOnUserDto.amountAfterSplit,
        price: stockOnUserDto.price,
        trend: stockOnUserDto.trend,
        moneyInvestedInStock: stockOnUserDto.moneyInvestedInStock,
        gainAbsolute: stockOnUserDto.gainAbsolute,
        gainPercentage: stockOnUserDto.gainPercentage
      )
    }
  }
}
